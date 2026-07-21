import { clearAuthCookies } from "@/lib/commerce/firebase-auth";

export async function POST() {
  return clearAuthCookies(Response.json({ ok: true }));
}
