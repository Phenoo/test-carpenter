"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function LogoutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  return (
    <button
      type="button"
      disabled={pending}
      onClick={async () => {
        setPending(true);
        await fetch("/api/auth/logout", { method: "POST" });
        router.push("/");
        router.refresh();
      }}
      className="border border-black px-4 py-2 text-[13px] transition hover:bg-black hover:text-white disabled:opacity-50"
    >
      {pending ? "Logging out..." : "Log out"}
    </button>
  );
}
