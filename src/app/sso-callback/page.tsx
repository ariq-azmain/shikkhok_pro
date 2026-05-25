// src/app/sso-callback/page.tsx
// ─────────────────────────────────────────────────────────────────
// OAuth (Google/Facebook/GitHub) sign-in/sign-up এর পরে
// Clerk এই URL এ redirect করে।
// AuthenticateWithCallback component টা session complete করে
// তারপর redirectUrl এ পাঠায়।
// ─────────────────────────────────────────────────────────────────

import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";

export default function SSOCallbackPage() {
  return (
    <main
      className="min-h-screen w-full flex items-center justify-center"
      style={{ background: "var(--bg-primary)" }}
    >
      {/* Clerk handles the callback and redirects automatically */}
      <AuthenticateWithRedirectCallback
        signInFallbackRedirectUrl="/profile"
        signUpFallbackRedirectUrl="/onboarding"
      />

      {/* Visual feedback while processing */}
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          Signing you in…
        </p>
      </div>
    </main>
  );
}
