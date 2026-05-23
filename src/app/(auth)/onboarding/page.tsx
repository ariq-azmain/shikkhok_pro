"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiArrowRight } from "react-icons/fi";
import { ACCOUNT_TYPES } from '@/constants'


export default function OnboardingPage() {
  const [selected, setSelected] = useState<string | null>(null);
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
        body: JSON.stringify({ accountType: selected }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong");
      }

      router.push(selected === "TEACHER" ? "/dashboard" : "/feed");
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <main
      className="relative min-h-screen overflow-x-hidden"
      style={{ background: "var(--bg-primary)", fontFamily: "inherit" }}
    >
      {/* Background glow */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(99,102,241,0.12) 0%, transparent 60%)",
          zIndex: 0,
        }}
      />

      <div
        className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-16"
        style={{ maxWidth: "960px", margin: "0 auto" }}
      >
        {/* Header */}
        <div className="text-center mb-12">
          <div
            className="inline-flex items-center gap-2 mb-5"
            style={{
              background: "rgba(99,102,241,0.08)",
              border: "1px solid rgba(99,102,241,0.25)",
              borderRadius: "100px",
              padding: "6px 16px",
            }}
          >
            <span style={{ fontSize: "11px", color: "#6366f1", fontWeight: 700, letterSpacing: "0.08em" }}>
              GETTING STARTED
            </span>
          </div>

          <h1
            style={{
              fontSize: "clamp(30px, 5vw, 46px)",
              fontWeight: 800,
              color: "var(--text-primary)",
              lineHeight: 1.15,
              marginBottom: "14px",
            }}
          >
            Who are you?
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "16px", maxWidth: "420px", margin: "0 auto", lineHeight: 1.6 }}>
            Choose your role so we can personalize your Shikkhok Pro experience.
          </p>
        </div>

        {/* Cards */}
        <div
          className="w-full mb-10"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "16px",
          }}
        >
          {ACCOUNT_TYPES.map(({ type, icon: Icon, title, description, perks, color, glow }) => {
            const isSelected = selected === type;
            return (
              <button
                key={type}
                onClick={() => setSelected(type)}
                style={{
                  background: isSelected ? `${color}0d` : "var(--bg-card)",
                  border: `2px solid ${isSelected ? color : "var(--border-subtle)"}`,
                  borderRadius: "20px",
                  padding: "28px 24px",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.2s ease",
                  boxShadow: isSelected ? `0 0 40px ${glow}` : "none",
                  transform: isSelected ? "translateY(-4px)" : "none",
                  position: "relative",
                }}
              >
                {/* Check indicator */}
                {isSelected && (
                  <div
                    style={{
                      position: "absolute",
                      top: "16px",
                      right: "16px",
                      width: "24px",
                      height: "24px",
                      borderRadius: "50%",
                      background: color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Check size={13} color="white" strokeWidth={3} />
                  </div>
                )}

                {/* Icon */}
                <div
                  style={{
                    width: "52px",
                    height: "52px",
                    borderRadius: "14px",
                    background: `${color}1a`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "20px",
                  }}
                >
                  <Icon size={26} color={color} />
                </div>

                {/* Title */}
                <h3
                  style={{
                    fontSize: "20px",
                    fontWeight: 800,
                    color: "var(--text-primary)",
                    marginBottom: "10px",
                  }}
                >
                  {title}
                </h3>

                {/* Description */}
                <p
                  style={{
                    color: "var(--text-secondary)",
                    fontSize: "14px",
                    lineHeight: 1.6,
                    marginBottom: "20px",
                  }}
                >
                  {description}
                </p>

                {/* Perks */}
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
                  {perks.map((perk) => (
                    <li
                      key={perk}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        color: "var(--text-secondary)",
                        fontSize: "13px",
                      }}
                    >
                      <span
                        style={{
                          width: "5px",
                          height: "5px",
                          borderRadius: "50%",
                          background: color,
                          flexShrink: 0,
                        }}
                      />
                      {perk}
                    </li>
                  ))}
                </ul>
              </button>
            );
          })}
        </div>

        {/* Error */}
        {error && (
          <p style={{ color: "#f87171", fontSize: "14px", marginBottom: "16px" }}>{error}</p>
        )}

        {/* CTA */}
        <button
          onClick={handleContinue}
          disabled={!selected || loading}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: selected ? "var(--color-primary)" : "var(--bg-card)",
            color: selected ? "white" : "var(--text-muted)",
            border: `1px solid ${selected ? "transparent" : "var(--border-subtle)"}`,
            borderRadius: "14px",
            padding: "15px 40px",
            fontSize: "15px",
            fontWeight: 700,
            cursor: selected && !loading ? "pointer" : "not-allowed",
            transition: "all 0.2s ease",
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? "Please wait..." : "Continue"}
          {!loading && <FiArrowRight size={18} />}
        </button>
      </div>
    </main>
  );
}
