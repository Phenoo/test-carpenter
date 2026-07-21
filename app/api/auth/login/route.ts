import { setAuthCookies, signInWithPassword } from "@/lib/commerce/firebase-auth";
import { z } from "zod";

const schema = z.object({ email: z.email(), password: z.string().min(8).max(128) });

export async function POST(request: Request) {
  try {
    const input = schema.parse(await request.json());
    const account = await signInWithPassword(input.email, input.password);
    return setAuthCookies(Response.json({ ok: true }), account);
  } catch {
    return Response.json({ error: "Email or password is incorrect." }, { status: 401 });
  }
}
