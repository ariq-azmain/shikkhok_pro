"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { TESTIMONIALS } from "@/constants";
import { RiStarFill, RiDoubleQuotesL } from "react-icons/ri";

export default function TestimonialsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(titleRef.current, { opacity: 0, y: 30 }, {
        opacity: 1, y: 0, duration: 0.7,
        scrollTrigger: { trigger: titleRef.current, start: "top 85%" },
      });
      cardsRef.current.forEach((el, i) => {
        if (!el) return;
        gsap.fromTo(el, { opacity: 0, y: 50, scale: 0.95 }, {
          opacity: 1, y: 0, scale: 1, duration: 0.7, delay: i * 0.15,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 88%" },
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-24 px-6">
      <div
        className="absolute top-0 right-0 w-[500px] h-[400px] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse, rgba(34,211,238,0.06) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />
      <div className="max-w-7xl mx-auto">
        <div ref={titleRef} className="text-center mb-14">
          <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: "#818cf8" }}>
            Testimonials
          </p>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            Trusted by Teachers{" "}
            <span style={{
              background: "linear-gradient(135deg, #818cf8 0%, #22d3ee 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              Across Bangladesh
            </span>
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: "#94a3b8" }}>
            See what educators are saying about how Shikkhok Pro has changed their daily workflow.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={t.id}
              ref={(el) => { cardsRef.current[i] = el; }}
              className="relative p-7 rounded-2xl flex flex-col"
              style={{
                background: "rgba(18,18,31,0.8)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <RiDoubleQuotesL
                className="absolute top-5 right-5 text-4xl opacity-10"
                style={{ color: "#818cf8" }}
              />
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, si) => (
                  <RiStarFill key={si} className="text-sm" style={{ color: "#f59e0b" }} />
                ))}
              </div>
              {/* Quote */}
              <p className="text-sm leading-relaxed flex-1 mb-6" style={{ color: "#94a3b8" }}>
                &ldquo;{t.content}&rdquo;
              </p>
              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                  <Image
                    src={t.avatar}
                    alt={t.name}
                    fill
                    className="object-cover"
                    sizes="40px"
                  />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{t.name}</p>
                  <p className="text-xs" style={{ color: "#64748b" }}>
                    {t.role} · {t.school}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
