"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { gsap } from "gsap";
import { HiArrowRight, HiPlay } from "react-icons/hi";
import { RiStarLine } from "react-icons/ri";

const FLOATING_BADGES = [
  { label: "Class 10 Math", top: "18%", left: "6%", delay: 0 },
  { label: "SSC Physics", top: "60%", left: "3%", delay: 0.4 },
  { label: "HSC Biology", top: "30%", right: "5%", delay: 0.2 },
  { label: "Class 7 English", top: "72%", right: "4%", delay: 0.6 },
];

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const floatingRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        badgeRef.current,
        { opacity: 0, y: 20, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6 },
      )
        .fromTo(
          headingRef.current,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.8 },
          "-=0.3",
        )
        .fromTo(
          subRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.7 },
          "-=0.5",
        )
        .fromTo(
          ctaRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6 },
          "-=0.4",
        )
        .fromTo(
          imageRef.current,
          { opacity: 0, y: 60, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 1, ease: "power2.out" },
          "-=0.6",
        );

      floatingRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.fromTo(
          el,
          { opacity: 0, y: 20, scale: 0.8 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.5,
            delay: 1.2 + i * 0.15,
            ease: "back.out(1.7)",
          },
        );
        gsap.to(el, {
          y: "-=10",
          duration: 2.5 + i * 0.3,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: i * 0.5,
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex flex-col items-center pt-32 pb-16 px-6 overflow-hidden"
    >
      {/* Ambient glow blobs */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse, rgba(99,102,241,0.15) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
      <div
        className="absolute top-1/3 left-1/4 w-[400px] h-[300px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse, rgba(168,85,247,0.1) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      {/* Floating badges */}
      {FLOATING_BADGES.map((b, i) => (
        <div
          key={b.label}
          ref={(el) => {
            floatingRefs.current[i] = el;
          }}
          className="absolute hidden lg:flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium"
          style={{
            top: b.top,
            left: b.left,
            right: b.right,
            background: "rgba(18,18,31,0.9)",
            border: "1px solid rgba(99,102,241,0.3)",
            color: "#c7d2fe",
            backdropFilter: "blur(8px)",
          }}
        >
          <span
            className="w-2 h-2 rounded-full"
            style={{ background: "#6366f1" }}
          />
          {b.label}
        </div>
      ))}

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        {/* Badge */}
        <div
          ref={badgeRef}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-8 animate-fadein"
          style={{
            background: "rgba(99,102,241,0.1)",
            border: "1px solid rgba(99,102,241,0.3)",
            color: "#a5b4fc",
          }}
        >
          <RiStarLine className="text-base" />
          AI-Powered for NCTB Curriculum · Bangladesh
        </div>

        {/* Headline */}
        <h1
          ref={headingRef}
          className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight mb-6 animate-fadein-delay1"
        >
          <span className="text-white">Create Perfect</span>
          <br />
          <span
            style={{
              background:
                "linear-gradient(135deg, #818cf8 0%, #a855f7 50%, #22d3ee 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Exam Papers
          </span>
          <br />
          <span className="text-white">with AI</span>
        </h1>

        {/* Subtitle */}
        <p
          ref={subRef}
          className="text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed animate-fadein-delay2"
          style={{ color: "#94a3b8" }}
        >
          The complete platform for Bangladesh teachers. Generate NCTB-aligned
          question papers in minutes, manage secure question banks, and
          collaborate with your school — all in one place.
        </p>

        {/* CTA Buttons */}
        <div
          ref={ctaRef}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fadein-delay3"
        >
          <Link
            href="/sign-up"
            className="group flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-white text-base transition-all duration-200 hover:opacity-90 hover:scale-[1.02]"
            style={{
              background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
              boxShadow: "0 0 30px rgba(99,102,241,0.4)",
            }}
          >
            Start for Free
            <HiArrowRight className="group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
          <button
            className="flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-base transition-all duration-200"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#e2e8f0",
            }}
          >
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center"
              style={{ background: "rgba(99,102,241,0.2)" }}
            >
              <HiPlay className="text-indigo-400 text-xs ml-0.5" />
            </div>
            Watch Demo
          </button>
        </div>

        {/* Hero Image / Dashboard Preview */}
        <div
          ref={imageRef}
          className="relative max-w-4xl mx-auto animate-fadein-delay4"
        >
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow:
                "0 40px 120px rgba(0,0,0,0.6), 0 0 60px rgba(99,102,241,0.15)",
            }}
          >
            <div
              className="flex items-center gap-2 px-4 py-3"
              style={{
                background: "rgba(14,14,26,0.95)",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              {["#ef4444", "#f59e0b", "#22c55e"].map((c) => (
                <div
                  key={c}
                  className="w-3 h-3 rounded-full"
                  style={{ background: c }}
                />
              ))}
              <div
                className="ml-2 flex-1 h-5 rounded max-w-xs text-xs flex items-center px-3"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  color: "#475569",
                }}
              >
                app.shikkhokpro.com/dashboard
              </div>
            </div>
            <Image
              src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&h=600&fit=crop"
              alt="Shikkhok Pro Dashboard — teachers working with AI question papers"
              width={1200}
              height={600}
              className="w-full object-cover"
              priority
            />
          </div>
          {/* Bottom glow */}
          <div
            className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-2/3 h-20 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse, rgba(99,102,241,0.25) 0%, transparent 70%)",
              filter: "blur(20px)",
            }}
          />
        </div>
      </div>
    </section>
  );
}
