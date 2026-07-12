"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { STEPS } from "@/constants";

export default function HowItWorksSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          scrollTrigger: { trigger: titleRef.current, start: "top 85%" },
        },
      );
      stepsRef.current.forEach((el, i) => {
        if (!el) return;
        gsap.fromTo(
          el,
          { opacity: 0, x: i % 2 === 0 ? -40 : 40 },
          {
            opacity: 1,
            x: 0,
            duration: 0.7,
            delay: i * 0.1,
            ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 85%" },
          },
        );
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="how-it-works" ref={sectionRef} className="relative py-24 px-6">
      <div
        className="absolute top-0 left-0 w-[500px] h-[400px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse, rgba(99,102,241,0.07) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />
      <div className="max-w-6xl mx-auto">
        <div ref={titleRef} className="text-center mb-20">
          <p
            className="text-sm font-semibold uppercase tracking-widest mb-3"
            style={{ color: "#818cf8" }}
          >
            How It Works
          </p>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            Up and Running in{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #818cf8 0%, #22d3ee 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              4 Simple Steps
            </span>
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: "#94a3b8" }}>
            Get your school on Shikkhok Pro and start generating professional
            question papers today.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {STEPS.map((step, i) => (
            <div
              key={step.number}
              ref={(el) => {
                stepsRef.current[i] = el;
              }}
              className="relative p-8 rounded-2xl group"
              style={{
                background: "rgba(18,18,31,0.7)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <div className="flex items-start gap-5">
                <div
                  className="flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(99,102,241,0.2) 0%, rgba(168,85,247,0.2) 100%)",
                    border: "1px solid rgba(99,102,241,0.3)",
                    color: "#818cf8",
                  }}
                >
                  {step.number}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="leading-relaxed" style={{ color: "#64748b" }}>
                    {step.description}
                  </p>
                </div>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-0.5 h-6 hidden md:block"
                  style={{ background: "rgba(99,102,241,0.2)" }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
