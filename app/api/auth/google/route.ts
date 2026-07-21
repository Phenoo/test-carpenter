import { setAuthCookies, signInWithGoogleIdToken } from "@/lib/commerce/firebase-auth";
import { z } from "zod";

const schema = z.object({
  credential: z.string().min(100).max(10_000),
});

export async function POST(request: Request) {
  try {
    const { credential } = schema.parse(await request.json());
    const configuredOrigin = process.env.APP_URL?.replace(/\/$/, "");
    const requestUri = configuredOrigin || new URL(request.url).origin;
    const account = await signInWithGoogleIdToken(credential, requestUri);
    return setAuthCookies(Response.json({ ok: true }), account);
  } catch {
    return Response.json(
      { error: "Google sign-in could not be completed." },
      { status: 401 },
    );
  }
}
