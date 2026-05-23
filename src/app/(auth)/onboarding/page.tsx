"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GraduationCap, BookOpen, Users, ArrowRight, Check } from "lucide-react";
import { ACCOUNT_TYPES } from '@/constants'

export default function OnboardingPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleContinue() {
    if (!selected) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accountType: selected,
          bio: bio.trim() || null,
        }),
      });

      let data: any = {};
      try { data = await res.json(); } catch { /* empty body */ }
      if (!res.ok) throw new Error(data.error || `Server error ${res.status}`);

      router.push(selected === "TEACHER" ? "/dashboard" : "/feed");
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-x-hidden" style={{ background: "var(--bg-primary)" }}>
      {/* Background glow */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(99,102,241,0.12) 0%, transparent 60%)",
        }}
      />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-16 max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5"
            style={{
              background: "rgba(99,102,241,0.08)",
              border: "1px solid rgba(99,102,241,0.25)",
            }}
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

        {/* Cards */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {ACCOUNT_TYPES.map(({ type, icon: Icon, title, description, perks, iconBg, iconColor, dotColor, border, cardBg, glow }) => {
            const isSelected = selected === type;
            return (
              <button
                key={type}
                onClick={() => setSelected(type)}
                className={`relative text-left rounded-2xl p-7 cursor-pointer transition-all duration-200 border-2 ${
                  isSelected
                    ? `${cardBg} ${border} -translate-y-1 shadow-2xl ${glow}`
                    : "border-white/5 hover:border-white/10 hover:-translate-y-0.5"
                }`}
                style={{ background: isSelected ? undefined : "var(--bg-card)" }}
              >
                {/* Check */}
                {isSelected && (
                  <div className={`absolute top-4 right-4 w-6 h-6 rounded-full flex items-center justify-center ${iconBg} ${iconColor}`}>
                    <Check size={13} strokeWidth={3} />
                  </div>
                )}

                {/* Icon */}
                <div className={`w-13 h-13 rounded-xl flex items-center justify-center mb-5 ${iconBg}`}
                  style={{ width: "52px", height: "52px" }}>
                  <Icon size={26} className={iconColor} />
                </div>

                {/* Title */}
                <h3 className="text-xl font-extrabold mb-2" style={{ color: "var(--text-primary)" }}>
                  {title}
                </h3>

                {/* Description */}
                <p className="text-sm leading-relaxed mb-5" style={{ color: "var(--text-secondary)" }}>
                  {description}
                </p>

                {/* Perks */}
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

        {/* Bio field */}
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

        {/* Error */}
        {error && (
          <p className="text-red-400 text-sm mb-4">{error}</p>
        )}

        {/* CTA */}
        <button
          onClick={handleContinue}
          disabled={!selected || loading}
          className={`inline-flex items-center gap-2 px-10 py-4 rounded-xl text-base font-bold transition-all duration-200 ${
            selected && !loading
              ? "bg-indigo-500 text-white hover:bg-indigo-600 hover:scale-[1.02]"
              : "cursor-not-allowed opacity-50"
          }`}
          style={{ background: selected && !loading ? undefined : "var(--bg-card)", color: selected ? undefined : "var(--text-muted)" }}
        >
          {loading ? "Please wait..." : "Continue"}
          {!loading && <ArrowRight size={18} />}
        </button>
      </div>
    </main>
  );
}
