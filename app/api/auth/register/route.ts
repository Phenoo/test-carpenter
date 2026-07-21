import { registerWithPassword, setAuthCookies } from "@/lib/commerce/firebase-auth";
import { z } from "zod";

const schema = z.object({
  fullName: z.string().trim().min(3).max(120),
  email: z.email(),
  phone: z.string().trim().min(7).max(24),
  password: z.string().min(8).max(128),
});

export async function POST(request: Request) {
  try {
    const input = schema.parse(await request.json());
    const account = await registerWithPassword(input);
    return setAuthCookies(Response.json({ ok: true, verificationEmailSent: true }), account);
  } catch (error) {
    const message = error instanceof Error && error.message.includes("EMAIL_EXISTS")
      ? "An account already exists for this email."
      : "Your account could not be created.";
    return Response.json({ error: message }, { status: 400 });
  }
}
