// src/app/(auth)/sign-in/[[...sign-in]]/page.tsx
"use client";

import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

// ── Provider icons ────────────────────────────────────────────
function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#1877F2">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="2" y="4" width="20" height="16" rx="3" />
      <path d="M2 7l10 7 10-7" />
    </svg>
  );
}

// ── Shared input style ────────────────────────────────────────
const inputCls =
  "w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200 " +
  "bg-white/5 border border-white/8 text-white placeholder:text-gray-600 " +
  "focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30 focus:bg-white/8";

// ── OTP Input ─────────────────────────────────────────────────
function OTPInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const digits = Array.from({ length: 6 }, (_, i) => value[i] ?? "");

  const handleChange = (i: number, v: string) => {
    if (!/^\d*$/.test(v)) return;
    const arr = [...digits];
    arr[i] = v.slice(-1);
    onChange(arr.join(""));
    if (v && i < 5) {
      const next = document.getElementById(`otp-${i + 1}`);
      next?.focus();
    }
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) {
      document.getElementById(`otp-${i - 1}`)?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    onChange(text);
  };

  return (
    <div className="flex gap-2 justify-center">
      {digits.map((d, i) => (
        <input
          key={i}
          id={`otp-${i}`}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={d}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          className={
            "w-11 h-13 text-center text-xl font-bold rounded-xl border transition-all duration-200 " +
            "bg-white/5 text-white outline-none " +
            (d
              ? "border-indigo-500 ring-1 ring-indigo-500/30"
              : "border-white/10 focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30")
          }
        />
      ))}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────
export default function SignInPage() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const router = useRouter();

  // view: "start" | "email_form" | "verify"
  const [view, setView] = useState<"start" | "email_form" | "verify">("start");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState<string | null>(null); // which button is loading

  if (!isLoaded) return null;

  // ── OAuth providers ───────────────────────────────────────
  const handleOAuth = async (provider: "oauth_google" | "oauth_facebook" | "oauth_github") => {
    setError("");
    setLoading(provider);
    try {
      await signIn.authenticateWithRedirect({
        strategy: provider,
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/profile",
      });
    } catch (err: any) {
      setError(err.errors?.[0]?.message ?? "Something went wrong");
      setLoading(null);
    }
  };

  // ── Email OTP: send code ──────────────────────────────────
  const handleEmailSubmit = async () => {
    if (!email.trim()) return;
    setError("");
    setLoading("email");
    try {
      await signIn.create({
        strategy: "email_code",
        identifier: email.trim(),
      });
      setView("verify");
    } catch (err: any) {
      setError(err.errors?.[0]?.message ?? "Failed to send code");
    } finally {
      setLoading(null);
    }
  };

  // ── Email OTP: verify code ────────────────────────────────
  const handleVerify = async () => {
    if (otp.length < 6) return;
    setError("");
    setLoading("verify");
    try {
      const result = await signIn.attemptFirstFactor({
        strategy: "email_code",
        code: otp,
      });
      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/profile");
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message ?? "Invalid code");
      setLoading(null);
    }
  };

  // ── Shared layout wrapper ─────────────────────────────────
  return (
    <main
      className="min-h-screen w-full flex items-center justify-center px-4 py-12"
      style={{ background: "var(--bg-primary)" }}
    >
      {/* Ambient glow */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 45% at 50% -10%, rgba(99,102,241,0.13) 0%, transparent 65%)",
        }}
      />

      <div className="relative z-10 w-full max-w-[400px]">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{ background: "var(--color-primary)" }}
          >
            <span className="text-white font-black text-xl">S</span>
          </div>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-8"
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-subtle)",
          }}
        >
          {/* ── START VIEW ─────────────────────────────────── */}
          {view === "start" && (
            <>
              <div className="text-center mb-7">
                <h1 className="text-2xl font-bold text-white mb-1.5">Welcome back</h1>
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                  Sign in to your Shikkhok Pro account
                </p>
              </div>

              {/* OAuth buttons */}
              <div className="flex flex-col gap-3 mb-6">
                <button
                  onClick={() => handleOAuth("oauth_google")}
                  disabled={!!loading}
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 hover:bg-white/8 active:scale-[0.98] disabled:opacity-50"
                  style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-light)" }}
                >
                  {loading === "oauth_google" ? <Spinner /> : <GoogleIcon />}
                  <span className="text-gray-200">Continue with Google</span>
                </button>

                <button
                  onClick={() => handleOAuth("oauth_facebook")}
                  disabled={!!loading}
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 hover:bg-white/8 active:scale-[0.98] disabled:opacity-50"
                  style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-light)" }}
                >
                  {loading === "oauth_facebook" ? <Spinner /> : <FacebookIcon />}
                  <span className="text-gray-200">Continue with Facebook</span>
                </button>

                <button
                  onClick={() => handleOAuth("oauth_github")}
                  disabled={!!loading}
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 hover:bg-white/8 active:scale-[0.98] disabled:opacity-50"
                  style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-light)" }}
                >
                  {loading === "oauth_github" ? <Spinner /> : <GitHubIcon />}
                  <span className="text-gray-200">Continue with GitHub</span>
                </button>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex-1 h-px" style={{ background: "var(--border-subtle)" }} />
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>or</span>
                <div className="flex-1 h-px" style={{ background: "var(--border-subtle)" }} />
              </div>

              {/* Email option */}
              <button
                onClick={() => setView("email_form")}
                className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 hover:bg-white/8 active:scale-[0.98]"
                style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-light)" }}
              >
                <EmailIcon />
                <span className="text-gray-200">Continue with Email</span>
              </button>

              {error && <ErrorMsg msg={error} />}
            </>
          )}

          {/* ── EMAIL FORM VIEW ─────────────────────────────── */}
          {view === "email_form" && (
            <>
              <button
                onClick={() => { setView("start"); setError(""); }}
                className="flex items-center gap-1.5 text-sm mb-6 transition-colors hover:text-white"
                style={{ color: "var(--text-secondary)" }}
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5M12 5l-7 7 7 7" />
                </svg>
                Back
              </button>

              <div className="mb-7">
                <h1 className="text-2xl font-bold text-white mb-1.5">Sign in with email</h1>
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                  We'll send a verification code to your inbox
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email address
                  </label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleEmailSubmit()}
                    className={inputCls}
                    autoFocus
                  />
                </div>

                {error && <ErrorMsg msg={error} />}

                <button
                  onClick={handleEmailSubmit}
                  disabled={!email.trim() || loading === "email"}
                  className="w-full py-3 rounded-xl text-sm font-semibold transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  style={{ background: "var(--color-primary)", color: "white" }}
                >
                  {loading === "email" ? <><Spinner /> Sending…</> : "Send Code"}
                </button>
              </div>
            </>
          )}

          {/* ── VERIFY VIEW ────────────────────────────────── */}
          {view === "verify" && (
            <>
              <button
                onClick={() => { setView("email_form"); setOtp(""); setError(""); }}
                className="flex items-center gap-1.5 text-sm mb-6 transition-colors hover:text-white"
                style={{ color: "var(--text-secondary)" }}
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5M12 5l-7 7 7 7" />
                </svg>
                Back
              </button>

              <div className="text-center mb-8">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                  style={{ background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.2)" }}
                >
                  <svg viewBox="0 0 24 24" className="w-7 h-7 text-indigo-400" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <rect x="2" y="4" width="20" height="16" rx="3" />
                    <path d="M2 7l10 7 10-7" />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold text-white mb-1.5">Check your inbox</h1>
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                  We sent a 6-digit code to{" "}
                  <span className="text-indigo-400 font-medium">{email}</span>
                </p>
              </div>

              <div className="flex flex-col gap-5">
                <OTPInput value={otp} onChange={setOtp} />

                {error && <ErrorMsg msg={error} />}

                <button
                  onClick={handleVerify}
                  disabled={otp.length < 6 || loading === "verify"}
                  className="w-full py-3 rounded-xl text-sm font-semibold transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  style={{ background: "var(--color-primary)", color: "white" }}
                >
                  {loading === "verify" ? <><Spinner /> Verifying…</> : "Verify & Sign In"}
                </button>

                <p className="text-center text-xs" style={{ color: "var(--text-muted)" }}>
                  Didn't receive it?{" "}
                  <button
                    onClick={() => { setOtp(""); handleEmailSubmit(); }}
                    className="text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    Resend code
                  </button>
                </p>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-sm mt-6" style={{ color: "var(--text-muted)" }}>
          Don't have an account?{" "}
          <Link href="/sign-up" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}

// ── Micro-components ──────────────────────────────────────────
function Spinner() {
  return (
    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" />
  );
}

function ErrorMsg({ msg }: { msg: string }) {
  return (
    <div className="flex items-start gap-2 px-3 py-2.5 rounded-xl text-sm text-red-400 bg-red-500/8 border border-red-500/15">
      <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8v4M12 16h.01" />
      </svg>
      {msg}
    </div>
  );
}
