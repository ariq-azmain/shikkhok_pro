// src/app/(auth)/onboarding/page.tsx
// ─────────────────────────────────────────────────────────────────
// Fix করা হয়েছে:
//   1. Page load এ DB check — onboardingComplete: true হলে redirect
//   2. API থেকে alreadyDone: true এলেও redirect (409 handle)
//   3. Loading state যোগ করা হয়েছে initial check এর জন্য
// ─────────────────────────────────────────────────────────────────
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { GraduationCap, BookOpen, Users, ArrowRight, Check } from "lucide-react";
import { ACCOUNT_TYPES } from "@/constants";

export default function OnboardingPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true); // ← initial DB check
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // ── Bug Fix 4: Page load এ onboarding status check ──────────────
  // /api/profile/me থেকে নিজের profile fetch করো।
  // onboardingComplete: true হলে সরাসরি redirect।
  // এতে existing user কখনো এই page এ আটকে থাকবে না।
  useEffect(() => {
    let cancelled = false;

    async function checkOnboarding() {
      try {
        const res = await fetch("/api/profile/me");
        if (cancelled) return;

        if (res.ok) {
          const data = await res.json();
          if (data.onboardingComplete === true) {
            // আগেই onboarding সম্পন্ন — proper page এ redirect
            const dest = data.accountType === "TEACHER" ? "/dashboard" : "/feed";
            router.replace(dest);
            return;
          }
        }
        // 401 বা 404 = নতুন user, এখানেই থাকুক
      } catch {
        // Network error হলেও page show করো
      } finally {
        if (!cancelled) setChecking(false);
      }
    }

    checkOnboarding();
    return () => { cancelled = true; };
  }, [router]);

  async function handleContinue() {
    if (!selected || loading) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accountType: selected, bio: bio.trim() }),
      });

      let data: { error?: string; success?: boolean; alreadyDone?: boolean } = {};
      const text = await res.text();
      if (text) {
        try { data = JSON.parse(text); } catch { /* non-JSON */ }
      }

      // ── Bug Fix 5: 409 alreadyDone handle ──────────────────────
      if (res.status === 409 && data.alreadyDone) {
        // Onboarding complete আছে — overwrite না করে redirect
        router.replace(selected === "TEACHER" ? "/dashboard" : "/feed");
        return;
      }

      if (!res.ok) {
        throw new Error(data.error || `Request failed (${res.status})`);
      }

      router.push(selected === "TEACHER" ? "/dashboard" : "/feed");
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  }

  // Initial check চলছে — blank screen বা spinner দেখাও
  if (checking) {
    return (
      <main
        className="h-screen w-screen flex items-center justify-center"
        style={{ background: "var(--bg-primary)" }}
      >
        <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-x-hidden" style={{ background: "var(--bg-primary)" }}>
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(99,102,241,0.12) 0%, transparent 60%)",
        }}
      />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-16 max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5"
            style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.25)" }}
          >
            <span className="text-indigo-400 text-xs font-bold tracking-widest">GETTING STARTED</span>
          </div>
          <h1
            className="font-extrabold leading-tight mb-3"
            style={{ fontSize: "clamp(30px, 5vw, 46px)", color: "var(--text-primary)" }}
          >
            Who are you?
          </h1>
          <p className="text-base leading-relaxed max-w-md mx-auto" style={{ color: "var(--text-secondary)" }}>
            Choose your role so we can personalize your Shikkhok Pro experience.
          </p>
        </div>

        {/* Role Cards */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {ACCOUNT_TYPES.map(({ type, icon: Icon, title, description, perks, iconBg, iconColor, dotColor, selectedBorder, selectedBg, selectedShadow, checkBg }) => {
            const isSelected = selected === type;
            return (
              <button
                key={type}
                onClick={() => setSelected(type)}
                className={`relative text-left rounded-2xl p-7 cursor-pointer transition-all duration-200 border-2 ${
                  isSelected
                    ? `${selectedBg} ${selectedBorder} -translate-y-1 shadow-2xl ${selectedShadow}`
                    : "border-white/5 hover:border-white/10 hover:-translate-y-0.5"
                }`}
                style={{ background: isSelected ? undefined : "var(--bg-card)" }}
              >
                {isSelected && (
                  <div className={`absolute top-4 right-4 w-6 h-6 rounded-full flex items-center justify-center ${checkBg}`}>
                    <Check size={13} color="white" strokeWidth={3} />
                  </div>
                )}

                <div
                  className={`rounded-xl flex items-center justify-center mb-5 ${iconBg}`}
                  style={{ width: 52, height: 52 }}
                >
                  <Icon size={26} className={iconColor} />
                </div>

                <h3 className="text-xl font-extrabold mb-2" style={{ color: "var(--text-primary)" }}>
                  {title}
                </h3>
                <p className="text-sm leading-relaxed mb-5" style={{ color: "var(--text-secondary)" }}>
                  {description}
                </p>

                <ul className="flex flex-col gap-2">
                  {perks.map((perk) => (
                    <li key={perk} className="flex items-center gap-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dotColor}`} />
                      {perk}
                    </li>
                  ))}
                </ul>
              </button>
            );
          })}
        </div>

        {/* Bio */}
        <div className="w-full max-w-lg mb-8">
          <label className="block text-sm font-semibold mb-2" style={{ color: "var(--text-secondary)" }}>
            Bio <span className="font-normal opacity-60">(optional)</span>
          </label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            maxLength={160}
            rows={3}
            placeholder="Tell others a little about yourself..."
            className="w-full rounded-xl px-4 py-3 text-sm resize-none outline-none transition-all duration-200 focus:ring-1 focus:ring-indigo-500"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-subtle)",
              color: "var(--text-primary)",
            }}
          />
          <p className="text-xs mt-1 text-right" style={{ color: "var(--text-muted)" }}>
            {bio.length}/160
          </p>
        </div>

        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

        {/* CTA */}
        <button
          onClick={handleContinue}
          disabled={!selected || loading}
          className={`inline-flex items-center gap-2 px-10 py-4 rounded-xl text-base font-bold transition-all duration-200 ${
            selected && !loading
              ? "bg-indigo-500 text-white hover:bg-indigo-600 hover:scale-[1.02] cursor-pointer"
              : "cursor-not-allowed opacity-40"
          }`}
          style={{ background: !selected || loading ? "var(--bg-card)" : undefined, color: !selected ? "var(--text-muted)" : undefined }}
        >
          {loading ? "Please wait..." : "Continue"}
          {!loading && <ArrowRight size={18} />}
        </button>
      </div>
    </main>
  );
}
