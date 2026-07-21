import "server-only";

import { cookies } from "next/headers";
import { createDocument, getDocument, isFirestoreConfigured } from "./firestore-rest";

const SESSION_COOKIE = "demutz_session";
const REFRESH_COOKIE = "demutz_refresh";

type FirebaseAuthResponse = {
  localId: string;
  email: string;
  displayName?: string;
  idToken: string;
  refreshToken: string;
  expiresIn: string;
  isNewUser?: boolean;
};

export type FirebaseSessionUser = {
  uid: string;
  email: string;
  displayName: string;
  emailVerified: boolean;
  admin: boolean;
};

function apiKey() {
  const value = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  if (!value) throw new Error("Firebase client configuration is not complete.");
  return value;
}

async function identityRequest<T>(method: string, body: Record<string, unknown>) {
  const response = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:${method}?key=${encodeURIComponent(apiKey())}`,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
      signal: AbortSignal.timeout(12_000),
    },
  );
  const payload = (await response.json()) as T & { error?: { message?: string } };
  if (!response.ok) throw new Error(payload.error?.message ?? "Firebase authentication failed.");
  return payload;
}

export async function signInWithPassword(email: string, password: string) {
  return identityRequest<FirebaseAuthResponse>("signInWithPassword", {
    email,
    password,
    returnSecureToken: true,
  });
}

export async function signInWithGoogleIdToken(credential: string, requestUri: string) {
  const account = await identityRequest<FirebaseAuthResponse>("signInWithIdp", {
    postBody: new URLSearchParams({
      id_token: credential,
      providerId: "google.com",
    }).toString(),
    requestUri,
    returnIdpCredential: true,
    returnSecureToken: true,
  });

  if (isFirestoreConfigured()) {
    const profile = await getDocument(`users/${account.localId}`);
    if (!profile) {
      const now = new Date().toISOString();
      await createDocument("users", account.localId, {
        uid: account.localId,
        fullName: account.displayName ?? "Customer",
        email: account.email,
        phone: "",
        defaultShippingAddress: null,
        role: "customer",
        createdAt: now,
        updatedAt: now,
      });
    }
  }

  return account;
}

export async function registerWithPassword(input: {
  fullName: string;
  email: string;
  password: string;
  phone: string;
}) {
  const account = await identityRequest<FirebaseAuthResponse>("signUp", {
    email: input.email,
    password: input.password,
    returnSecureToken: true,
  });
  await identityRequest("update", {
    idToken: account.idToken,
    displayName: input.fullName,
    returnSecureToken: false,
  });
  await identityRequest("sendOobCode", {
    requestType: "VERIFY_EMAIL",
    idToken: account.idToken,
  });

  if (isFirestoreConfigured()) {
    const now = new Date().toISOString();
    await createDocument("users", account.localId, {
      uid: account.localId,
      fullName: input.fullName,
      email: account.email,
      phone: input.phone,
      defaultShippingAddress: null,
      role: "customer",
      createdAt: now,
      updatedAt: now,
    });
  }

  return { ...account, displayName: input.fullName };
}

export async function sendPasswordReset(email: string) {
  await identityRequest("sendOobCode", { requestType: "PASSWORD_RESET", email });
}

export function setAuthCookies(response: Response, account: FirebaseAuthResponse) {
  const secure = process.env.NODE_ENV === "production";
  const headers = new Headers(response.headers);
  const sessionCookie = `${SESSION_COOKIE}=${encodeURIComponent(account.idToken)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=3300${secure ? "; Secure" : ""}`;
  const refreshCookie = `${REFRESH_COOKIE}=${encodeURIComponent(account.refreshToken)}; Path=/api/auth; HttpOnly; SameSite=Strict; Max-Age=2592000${secure ? "; Secure" : ""}`;
  headers.append("set-cookie", sessionCookie);
  headers.append("set-cookie", refreshCookie);
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}

export function clearAuthCookies(response: Response) {
  const headers = new Headers(response.headers);
  headers.append("set-cookie", `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`);
  headers.append("set-cookie", `${REFRESH_COOKIE}=; Path=/api/auth; HttpOnly; SameSite=Strict; Max-Age=0`);
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}

export async function getCurrentFirebaseUser(): Promise<FirebaseSessionUser | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token || !process.env.NEXT_PUBLIC_FIREBASE_API_KEY) return null;

  try {
    const payload = await identityRequest<{
      users?: {
        localId: string;
        email: string;
        displayName?: string;
        emailVerified?: boolean;
        customAttributes?: string;
      }[];
    }>("lookup", { idToken: token });
    const user = payload.users?.[0];
    if (!user) return null;
    let claims: Record<string, unknown> = {};
    try {
      claims = user.customAttributes ? JSON.parse(user.customAttributes) : {};
    } catch {
      claims = {};
    }

    return {
      uid: user.localId,
      email: user.email,
      displayName: user.displayName ?? "Customer",
      emailVerified: Boolean(user.emailVerified),
      admin: claims.admin === true || claims.role === "admin",
    };
  } catch {
    return null;
  }
}
