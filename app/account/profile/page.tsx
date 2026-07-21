import { getCurrentFirebaseUser } from "@/lib/commerce/firebase-auth";

export default async function ProfilePage() {
  const user = await getCurrentFirebaseUser();
  return (
    <section className="py-10">
      <h1 className="instrument-serif text-5xl">Profile</h1>
      <dl className="mt-8 max-w-xl divide-y divide-black/10 border border-black/15 px-5">
        <Row label="Name" value={user?.displayName ?? ""} />
        <Row label="Email" value={user?.email ?? ""} />
        <Row label="Email verification" value={user?.emailVerified ? "Verified" : "Verification pending"} />
      </dl>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return <div className="grid gap-2 py-5 sm:grid-cols-[180px_1fr]"><dt className="text-[12px] uppercase tracking-[0.16em] text-black/50">{label}</dt><dd className="text-[14px]">{value}</dd></div>;
}
