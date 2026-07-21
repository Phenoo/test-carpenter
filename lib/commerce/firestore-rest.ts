import "server-only";

import { createSign } from "node:crypto";

type FirestoreValue =
  | { nullValue: null }
  | { stringValue: string }
  | { booleanValue: boolean }
  | { integerValue: string }
  | { doubleValue: number }
  | { arrayValue: { values?: FirestoreValue[] } }
  | { mapValue: { fields: Record<string, FirestoreValue> } };

type FirestoreDocument = {
  name: string;
  fields: Record<string, FirestoreValue>;
  createTime?: string;
  updateTime?: string;
};

export type StoredDocument<T> = {
  data: T;
  updateTime?: string;
};

let cachedAccessToken: { token: string; expiresAt: number } | null = null;

function base64Url(value: string | Buffer) {
  return Buffer.from(value).toString("base64url");
}

function firebaseConfig() {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error("Firebase Admin environment variables are not configured.");
  }

  return { projectId, clientEmail, privateKey };
}

export function isFirestoreConfigured() {
  return Boolean(
    process.env.FIREBASE_PROJECT_ID &&
      process.env.FIREBASE_CLIENT_EMAIL &&
      process.env.FIREBASE_PRIVATE_KEY,
  );
}

async function getAccessToken() {
  if (cachedAccessToken && cachedAccessToken.expiresAt > Date.now() + 60_000) {
    return cachedAccessToken.token;
  }

  const { clientEmail, privateKey } = firebaseConfig();
  const issuedAt = Math.floor(Date.now() / 1000);
  const header = base64Url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claims = base64Url(
    JSON.stringify({
      iss: clientEmail,
      sub: clientEmail,
      aud: "https://oauth2.googleapis.com/token",
      iat: issuedAt,
      exp: issuedAt + 3600,
      scope: "https://www.googleapis.com/auth/datastore",
    }),
  );
  const unsignedToken = `${header}.${claims}`;
  const signer = createSign("RSA-SHA256");
  signer.update(unsignedToken);
  signer.end();
  const assertion = `${unsignedToken}.${signer.sign(privateKey).toString("base64url")}`;
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Firebase service-account authentication failed (${response.status}).`);
  }

  const payload = (await response.json()) as { access_token: string; expires_in: number };
  cachedAccessToken = {
    token: payload.access_token,
    expiresAt: Date.now() + payload.expires_in * 1000,
  };

  return payload.access_token;
}

function encodeValue(value: unknown): FirestoreValue {
  if (value === null || value === undefined) {
    return { nullValue: null };
  }

  if (typeof value === "string") {
    return { stringValue: value };
  }

  if (typeof value === "boolean") {
    return { booleanValue: value };
  }

  if (typeof value === "number") {
    return Number.isInteger(value) ? { integerValue: String(value) } : { doubleValue: value };
  }

  if (Array.isArray(value)) {
    return { arrayValue: { values: value.map(encodeValue) } };
  }

  const fields = Object.fromEntries(
    Object.entries(value as Record<string, unknown>).map(([key, child]) => [key, encodeValue(child)]),
  );
  return { mapValue: { fields } };
}

function encodeFields(data: Record<string, unknown>) {
  return Object.fromEntries(Object.entries(data).map(([key, value]) => [key, encodeValue(value)]));
}

function decodeValue(value: FirestoreValue): unknown {
  if ("nullValue" in value) return null;
  if ("stringValue" in value) return value.stringValue;
  if ("booleanValue" in value) return value.booleanValue;
  if ("integerValue" in value) return Number(value.integerValue);
  if ("doubleValue" in value) return value.doubleValue;
  if ("arrayValue" in value) return (value.arrayValue.values ?? []).map(decodeValue);
  if ("mapValue" in value) return decodeFields(value.mapValue.fields);
  return null;
}

function decodeFields(fields: Record<string, FirestoreValue>) {
  return Object.fromEntries(Object.entries(fields).map(([key, value]) => [key, decodeValue(value)]));
}

function documentsBase() {
  const { projectId } = firebaseConfig();
  return `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents`;
}

function documentName(path: string) {
  const { projectId } = firebaseConfig();
  return `projects/${projectId}/databases/(default)/documents/${path}`;
}

async function firestoreFetch(url: string, init: RequestInit = {}) {
  const token = await getAccessToken();
  return fetch(url, {
    ...init,
    headers: {
      authorization: `Bearer ${token}`,
      "content-type": "application/json",
      ...init.headers,
    },
    cache: "no-store",
  });
}

export async function createDocument<T extends Record<string, unknown>>(
  collection: string,
  id: string,
  data: T,
) {
  const response = await firestoreFetch(
    `${documentsBase()}/${encodeURIComponent(collection)}?documentId=${encodeURIComponent(id)}`,
    { method: "POST", body: JSON.stringify({ fields: encodeFields(data) }) },
  );

  if (!response.ok) {
    throw new Error(`Firestore create failed (${response.status}).`);
  }
}

export async function getDocument<T>(path: string): Promise<StoredDocument<T> | null> {
  const response = await firestoreFetch(`${documentsBase()}/${path}`);

  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`Firestore read failed (${response.status}).`);

  const document = (await response.json()) as FirestoreDocument;
  return { data: decodeFields(document.fields) as T, updateTime: document.updateTime };
}

export async function queryByField<T>(collection: string, field: string, value: string) {
  const response = await firestoreFetch(`${documentsBase()}:runQuery`, {
    method: "POST",
    body: JSON.stringify({
      structuredQuery: {
        from: [{ collectionId: collection }],
        where: {
          fieldFilter: {
            field: { fieldPath: field },
            op: "EQUAL",
            value: { stringValue: value },
          },
        },
        limit: 100,
      },
    }),
  });

  if (!response.ok) throw new Error(`Firestore query failed (${response.status}).`);
  const rows = (await response.json()) as { document?: FirestoreDocument }[];

  return rows
    .filter((row): row is { document: FirestoreDocument } => Boolean(row.document))
    .map((row) => ({
      data: decodeFields(row.document.fields) as T,
      updateTime: row.document.updateTime,
    }));
}

export async function listDocuments<T>(collection: string, pageSize = 100) {
  const response = await firestoreFetch(
    `${documentsBase()}/${encodeURIComponent(collection)}?pageSize=${pageSize}&orderBy=createdAt%20desc`,
  );

  if (!response.ok) throw new Error(`Firestore list failed (${response.status}).`);
  const payload = (await response.json()) as { documents?: FirestoreDocument[] };
  return (payload.documents ?? []).map((document) => decodeFields(document.fields) as T);
}

export async function commitDocumentUpdate<T extends Record<string, unknown>>({
  path,
  data,
  updateTime,
  event,
}: {
  path: string;
  data: T;
  updateTime?: string;
  event?: { id: string; data: Record<string, unknown> };
}) {
  const writes: Record<string, unknown>[] = [
    {
      update: { name: documentName(path), fields: encodeFields(data) },
      ...(updateTime ? { currentDocument: { updateTime } } : {}),
    },
  ];

  if (event) {
    writes.push({
      update: {
        name: documentName(`webhookEvents/${event.id}`),
        fields: encodeFields(event.data),
      },
      currentDocument: { exists: false },
    });
  }

  const response = await firestoreFetch(`${documentsBase()}:commit`, {
    method: "POST",
    body: JSON.stringify({ writes }),
  });

  if (!response.ok) {
    const error = new Error(`Firestore commit failed (${response.status}).`);
    Object.assign(error, { status: response.status });
    throw error;
  }
}
