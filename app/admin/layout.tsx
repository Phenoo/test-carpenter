import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentFirebaseUser } from "@/lib/commerce/firebase-auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentFirebaseUser();
  if (!user) redirect("/login");
  if (!user.admin) redirect("/account");

  return (
    <main id="main-content" className="min-h-screen bg-[#f5f5f5] px-5 py-8 text-black">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-wrap items-center justify-between gap-5 bg-black p-5 text-white">
          <p className="instrument-serif text-3xl">demutzhair admin</p>
          <p className="text-[12px]">{user.email}</p>
        </header>
        <nav className="flex flex-wrap gap-5 border border-t-0 border-black/15 bg-white p-4 text-[13px]">
          <Link href="/admin">Overview</Link><Link href="/admin/orders">Orders</Link><Link href="/admin/products">Products</Link><Link href="/admin/customers">Customers</Link><Link href="/admin/shipping">Shipping</Link><Link href="/admin/settings">Settings</Link>
        </nav>
        {children}
      </div>
    </main>
  );
}
