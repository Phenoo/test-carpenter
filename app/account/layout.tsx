import Link from "next/link";
import { redirect } from "next/navigation";
import { LogoutButton } from "@/components/account/logout-button";
import { getCurrentFirebaseUser } from "@/lib/commerce/firebase-auth";

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentFirebaseUser();
  if (!user) redirect("/login");

  return (
    <main id="main-content" className="min-h-screen bg-white px-5 py-10 text-black">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-wrap items-center justify-between gap-5 border-b border-black pb-6">
          <div>
            <p className="text-[12px] uppercase tracking-[0.18em]">Customer account</p>
            <p className="instrument-serif mt-1 text-4xl">{user.displayName}</p>
          </div>
          <LogoutButton />
        </header>
        <nav className="flex flex-wrap gap-5 border-b border-black/10 py-4 text-[13px]">
          <Link href="/account">Overview</Link>
          <Link href="/account/orders">Orders</Link>
          <Link href="/account/profile">Profile</Link>
          <Link href="/shop">Shop</Link>
        </nav>
        {children}
      </div>
    </main>
  );
}
