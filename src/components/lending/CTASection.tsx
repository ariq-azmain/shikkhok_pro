"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HiArrowRight } from "react-icons/hi";
import { RiStarLine } from "react-icons/ri";

export default function CTASection() {
  const sectionRef = useRef<HTMLElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        boxRef.current,
        { opacity: 0, y: 50, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.9,
          ease: "power2.out",
          scrollTrigger: { trigger: boxRef.current, start: "top 85%" },
        },
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <div
          ref={boxRef}
          className="relative overflow-hidden rounded-3xl px-8 py-16 text-center"
          style={{
            background:
              "linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(168,85,247,0.15) 50%, rgba(34,211,238,0.1) 100%)",
            border: "1px solid rgba(99,102,241,0.25)",
          }}
        >
          {/* Background mesh */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(99,102,241,0.12) 0%, transparent 70%)",
            }}
          />
          {/* Decorative circles */}
          <div
            className="absolute -top-20 -left-20 w-64 h-64 rounded-full opacity-20 pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, #6366f1 0%, transparent 70%)",
              filter: "blur(40px)",
            }}
          />
          <div
            className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full opacity-20 pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, #a855f7 0%, transparent 70%)",
              filter: "blur(40px)",
            }}
          />

          <div className="relative z-10">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6"
              style={{
                background: "rgba(99,102,241,0.15)",
                border: "1px solid rgba(99,102,241,0.3)",
                color: "#a5b4fc",
              }}
            >
              <RiStarLine />
              Join 5,000+ Teachers Already Using Shikkhok Pro
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-5 leading-tight">
              Ready to Transform How
              <br />
              You Create Exams?
            </h2>
            <p
              className="text-lg mb-10 max-w-xl mx-auto"
              style={{ color: "#94a3b8" }}
            >
              Start for free today. No credit card required. Generate your first
              AI question paper in under 5 minutes.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/sign-up"
                className="group flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-white text-base transition-all duration-200 hover:opacity-90 hover:scale-[1.02]"
                style={{
                  background:
                    "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                  boxShadow: "0 0 40px rgba(99,102,241,0.4)",
                }}
              >
                Get Started for Free
                <HiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/sign-in"
                className="px-8 py-3.5 rounded-xl font-semibold text-base transition-all duration-200"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "#e2e8f0",
                }}
              >
                Sign In
              </Link>
            </div>
            <p className="mt-6 text-xs" style={{ color: "#475569" }}>
              Free plan includes 20 AI generations/month · No credit card
              required
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
