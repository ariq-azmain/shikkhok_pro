"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import {
  RiShieldCheckLine,
  RiLockLine,
  RiEyeOffLine,
  RiKeyLine,
  RiAlertLine,
} from "react-icons/ri";

const SECURITY_POINTS = [
  {
    icon: RiLockLine,
    title: "Private by Default",
    description: "Every question generated is private. Only you can see it until you explicitly choose to share.",
    color: "#6366f1",
  },
  {
    icon: RiEyeOffLine,
    title: "Granular Visibility Control",
    description: "Choose between Private, School (org-only), or Public. You're always in control.",
    color: "#a855f7",
  },
  {
    icon: RiKeyLine,
    title: "Role-Based Access",
    description: "Teachers can only see questions from their subjects. Admins manage their own org only.",
    color: "#22d3ee",
  },
  {
    icon: RiAlertLine,
    title: "Zero Question Leaks",
    description: "No screenshot-to-share loopholes. Questions are served via secure, authenticated API calls.",
    color: "#f59e0b",
  },
];

export default function SecuritySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(leftRef.current, { opacity: 0, x: -50 }, {
        opacity: 1, x: 0, duration: 0.8, ease: "power2.out",
        scrollTrigger: { trigger: leftRef.current, start: "top 80%" },
      });
      gsap.fromTo(rightRef.current, { opacity: 0, x: 50 }, {
        opacity: 1, x: 0, duration: 0.8, ease: "power2.out",
        scrollTrigger: { trigger: rightRef.current, start: "top 80%" },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="security" ref={sectionRef} className="relative py-24 px-6 overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(99,102,241,0.06) 0%, transparent 70%)",
        }}
      />
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        {/* Left — Image */}
        <div ref={leftRef} className="relative">
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 20px 80px rgba(0,0,0,0.5)",
            }}
          >
            <Image
              src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=700&h=500&fit=crop"
              alt="Secure question paper storage and access control"
              width={700}
              height={500}
              className="w-full object-cover"
            />
          </div>
          {/* Overlay badges */}
          <div
            className="absolute -bottom-4 -right-4 flex items-center gap-3 px-5 py-4 rounded-xl"
            style={{
              background: "rgba(8,8,17,0.95)",
              border: "1px solid rgba(99,102,241,0.3)",
              backdropFilter: "blur(16px)",
            }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "rgba(99,102,241,0.2)" }}
            >
              <RiShieldCheckLine className="text-xl" style={{ color: "#818cf8" }} />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Zero Question Leaks</p>
              <p className="text-xs" style={{ color: "#64748b" }}>Guaranteed before every exam</p>
            </div>
          </div>
        </div>

        {/* Right — Content */}
        <div ref={rightRef}>
          <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: "#818cf8" }}>
            Security
          </p>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
            Questions Stay Secure{" "}
            <span style={{
              background: "linear-gradient(135deg, #818cf8 0%, #a855f7 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              Until Exam Day
            </span>
          </h2>
          <p className="text-lg mb-10 leading-relaxed" style={{ color: "#94a3b8" }}>
            Question paper leaks before exams are a major problem in Bangladesh. Shikkhok Pro is built
            from the ground up to prevent this — with multi-layer access control so your questions stay
            private until you choose to release them.
          </p>

          <div className="space-y-5">
            {SECURITY_POINTS.map((point) => {
              const Icon = point.icon;
              return (
                <div key={point.title} className="flex items-start gap-4">
                  <div
                    className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center mt-0.5"
                    style={{
                      background: `${point.color}15`,
                      border: `1px solid ${point.color}30`,
                    }}
                  >
                    <Icon style={{ color: point.color }} className="text-lg" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">{point.title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: "#64748b" }}>
                      {point.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
