"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { useEffect, useRef, useState } from "react";

type GoogleCredentialResponse = { credential?: string };

type GoogleIdentity = {
  initialize(config: {
    client_id: string;
    callback: (response: GoogleCredentialResponse) => void;
  }): void;
  renderButton(
    parent: HTMLElement,
    options: {
      theme: "outline";
      size: "large";
      shape: "rectangular";
      text: "continue_with";
      width: number;
    },
  ): void;
};

declare global {
  interface Window {
    google?: { accounts: { id: GoogleIdentity } };
  }
}

export function AuthForm({ mode }: { mode: "login" | "register" | "forgot" }) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [googleReady, setGoogleReady] = useState(false);
  const googleButtonRef = useRef<HTMLDivElement>(null);
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  useEffect(() => {
    if (mode === "forgot" || !googleReady || !googleClientId || !window.google || !googleButtonRef.current) return;

    const button = googleButtonRef.current;
    const renderButton = () => {
      if (!window.google || !button) return;
      button.replaceChildren();
      window.google.accounts.id.renderButton(button, {
        theme: "outline",
        size: "large",
        shape: "rectangular",
        text: "continue_with",
        width: Math.min(Math.max(button.clientWidth, 240), 400),
      });
    };

    window.google.accounts.id.initialize({
      client_id: googleClientId,
      callback: async ({ credential }) => {
        if (!credential) {
          setMessage("Google sign-in did not return a valid credential.");
          return;
        }

        setSubmitting(true);
        setMessage(null);
        try {
          const response = await fetch("/api/auth/google", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ credential }),
          });
          const result = (await response.json()) as { error?: string };
          if (!response.ok) throw new Error(result.error ?? "Please try again.");
          router.push("/account");
          router.refresh();
        } catch (error) {
          setMessage(error instanceof Error ? error.message : "Please try again.");
          setSubmitting(false);
        }
      },
    });

    renderButton();
    const observer = new ResizeObserver(renderButton);
    observer.observe(button);
    return () => observer.disconnect();
  }, [googleClientId, googleReady, mode, router]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setMessage(null);
    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(form.entries());

    try {
      const endpoint = mode === "forgot" ? "forgot-password" : mode;
      const response = await fetch(`/api/auth/${endpoint}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error ?? "Please try again.");
      if (mode === "forgot") {
        setMessage("If an account exists, a password-reset email is on its way.");
        setSubmitting(false);
        return;
      }
      router.push("/account");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <main id="main-content" className="min-h-screen bg-white px-5 py-16 text-black">
      <div className="mx-auto max-w-md">
        <p className="text-[12px] uppercase tracking-[0.2em]">Customer account</p>
        <h1 className="instrument-serif mt-3 text-6xl tracking-[-0.04em]">
          {mode === "login" ? "Welcome back." : mode === "register" ? "Create account." : "Reset password."}
        </h1>
        {mode !== "forgot" && googleClientId ? (
          <>
            <Script
              src="https://accounts.google.com/gsi/client"
              strategy="afterInteractive"
              onReady={() => setGoogleReady(true)}
            />
            <div className="mt-10 grid gap-5">
              <div
                ref={googleButtonRef}
                className={submitting ? "pointer-events-none min-h-11 opacity-50" : "min-h-11"}
                aria-label="Continue with Google"
              />
              <div className="flex items-center gap-4 text-[11px] uppercase tracking-[0.18em] text-black/50">
                <span className="h-px flex-1 bg-black/15" />
                <span>or use email</span>
                <span className="h-px flex-1 bg-black/15" />
              </div>
            </div>
          </>
        ) : null}
        <form onSubmit={submit} className={`${mode !== "forgot" && googleClientId ? "mt-0" : "mt-10"} grid gap-5`}>
          {mode === "register" ? (
            <>
              <AuthInput name="fullName" label="Full name" autoComplete="name" />
              <AuthInput name="phone" label="Phone number" autoComplete="tel" type="tel" />
            </>
          ) : null}
          <AuthInput name="email" label="Email address" autoComplete="email" type="email" />
          {mode !== "forgot" ? (
            <AuthInput name="password" label="Password" autoComplete={mode === "register" ? "new-password" : "current-password"} type="password" />
          ) : null}
          {message ? <p role="status" className="border border-black/20 bg-[#f5f5f5] p-4 text-[13px] leading-6">{message}</p> : null}
          <button disabled={submitting} className="h-13 bg-black px-5 text-[14px] text-white disabled:opacity-50">
            {submitting ? "Please wait..." : mode === "login" ? "Log in" : mode === "register" ? "Create account" : "Send reset link"}
          </button>
        </form>
        <div className="mt-6 flex flex-wrap gap-4 text-[13px] underline underline-offset-4">
          {mode !== "login" ? <Link href="/login">Log in</Link> : null}
          {mode !== "register" ? <Link href="/register">Create account</Link> : null}
          {mode !== "forgot" ? <Link href="/forgot-password">Forgot password?</Link> : null}
          <Link href="/shop">Back to shop</Link>
        </div>
      </div>
    </main>
  );
}

function AuthInput({ name, label, type = "text", autoComplete }: { name: string; label: string; type?: string; autoComplete: string }) {
  return (
    <label className="grid gap-2 text-[13px] font-medium">
      <span>{label}</span>
      <input name={name} type={type} autoComplete={autoComplete} required minLength={type === "password" ? 8 : undefined} className="h-12 border border-black/20 px-4 outline-none focus:border-black focus:ring-1 focus:ring-black" />
    </label>
  );
}
