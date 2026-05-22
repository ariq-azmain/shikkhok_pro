"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FEATURES } from "@/constants";
import {
  RiBrainLine,
  RiDatabase2Line,
  RiShieldLine,
  RiGroupLine,
  RiBuildingLine,
  RiTaskLine,
  RiDownloadLine,
  RiMessage2Line,
} from "react-icons/ri";

const ICON_MAP: Record<string, React.ElementType> = {
  brain: RiBrainLine,
  database: RiDatabase2Line,
  shield: RiShieldLine,
  users: RiGroupLine,
  building: RiBuildingLine,
  clipboard: RiTaskLine,
  download: RiDownloadLine,
  message: RiMessage2Line,
};

export default function FeaturesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

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
          ease: "power2.out",
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 85%",
          },
        }
      );

      cardsRef.current.forEach((el, i) => {
        if (!el) return;
        gsap.fromTo(
          el,
          { opacity: 0, y: 40, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            delay: (i % 4) * 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
              toggleActions: "play none none none",
            },
          }
        );
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="features" ref={sectionRef} className="relative py-24 px-6">
      {/* Section glow */}
      <div
        className="absolute top-1/2 right-0 w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse, rgba(168,85,247,0.08) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <div ref={titleRef} className="text-center mb-16">
          <p
            className="text-sm font-semibold uppercase tracking-widest mb-3"
            style={{ color: "#818cf8" }}
          >
            Features
          </p>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            Everything You Need to
            <br />
            <span
              style={{
                background:
                  "linear-gradient(135deg, #818cf8 0%, #a855f7 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Run a Modern School
            </span>
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: "#94a3b8" }}>
            From AI question generation to secure distribution, task management
            to real-time messaging — Shikkhok Pro has it all.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map((feature, i) => {
            const Icon = ICON_MAP[feature.icon] || RiBrainLine;
            return (
              <div
                key={feature.id}
                ref={(el) => { cardsRef.current[i] = el; }}
                className="group relative p-6 rounded-2xl transition-all duration-300 cursor-default"
                style={{
                  background: "rgba(18,18,31,0.7)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.border = `1px solid ${feature.color}40`;
                  (e.currentTarget as HTMLDivElement).style.background = "rgba(22,22,42,0.9)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.border = "1px solid rgba(255,255,255,0.06)";
                  (e.currentTarget as HTMLDivElement).style.background = "rgba(18,18,31,0.7)";
                }}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                  style={{
                    background: `${feature.color}18`,
                    border: `1px solid ${feature.color}30`,
                  }}
                >
                  <Icon
                    className="text-xl"
                    style={{ color: feature.color }}
                  />
                </div>
                <h3 className="text-base font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "#64748b" }}>
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
