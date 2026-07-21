import { sendPasswordReset } from "@/lib/commerce/firebase-auth";
import { z } from "zod";

export async function POST(request: Request) {
  try {
    const { email } = z.object({ email: z.email() }).parse(await request.json());
    await sendPasswordReset(email);
  } catch {
    // Always return the same response to avoid disclosing registered emails.
  }

  return Response.json({ ok: true });
}
