"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SUBJECTS, CLASSES } from "@/constants";
import { RiBookLine } from "react-icons/ri";

export default function CurriculumSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(titleRef.current, { opacity: 0, y: 30 }, {
        opacity: 1, y: 0, duration: 0.7,
        scrollTrigger: { trigger: titleRef.current, start: "top 85%" },
      });
      gsap.fromTo(contentRef.current, { opacity: 0, y: 40 }, {
        opacity: 1, y: 0, duration: 0.8, delay: 0.2,
        scrollTrigger: { trigger: contentRef.current, start: "top 85%" },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="curriculum" ref={sectionRef} className="relative py-24 px-6">
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse, rgba(168,85,247,0.07) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />
      <div className="max-w-6xl mx-auto">
        <div ref={titleRef} className="text-center mb-14">
          <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: "#818cf8" }}>
            Curriculum
          </p>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            Built for{" "}
            <span style={{
              background: "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              Bangladesh
            </span>
            , Inside Out
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: "#94a3b8" }}>
            Every subject, every class, every topic — from the official NCTB textbooks. Our AI knows
            the Bangladesh curriculum so you don't have to explain it.
          </p>
        </div>

        <div ref={contentRef} className="grid md:grid-cols-2 gap-8">
          {/* Classes */}
          <div
            className="p-7 rounded-2xl"
            style={{
              background: "rgba(18,18,31,0.7)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)" }}
              >
                <RiBookLine style={{ color: "#818cf8" }} className="text-lg" />
              </div>
              <h3 className="text-lg font-bold text-white">Classes Supported</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {CLASSES.map((cls) => (
                <span
                  key={cls}
                  className="px-3 py-1.5 rounded-lg text-sm font-medium"
                  style={{
                    background: "rgba(99,102,241,0.1)",
                    border: "1px solid rgba(99,102,241,0.2)",
                    color: "#a5b4fc",
                  }}
                >
                  {cls}
                </span>
              ))}
            </div>
            <p className="mt-5 text-sm" style={{ color: "#475569" }}>
              Full NCTB curriculum coverage from Grade 1 through HSC
            </p>
          </div>

          {/* Subjects */}
          <div
            className="p-7 rounded-2xl"
            style={{
              background: "rgba(18,18,31,0.7)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: "rgba(168,85,247,0.15)", border: "1px solid rgba(168,85,247,0.3)" }}
              >
                <RiBookLine style={{ color: "#c084fc" }} className="text-lg" />
              </div>
              <h3 className="text-lg font-bold text-white">Subjects Covered</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {SUBJECTS.map((subject) => (
                <span
                  key={subject}
                  className="px-3 py-1.5 rounded-lg text-sm font-medium"
                  style={{
                    background: "rgba(168,85,247,0.1)",
                    border: "1px solid rgba(168,85,247,0.2)",
                    color: "#c084fc",
                  }}
                >
                  {subject}
                </span>
              ))}
            </div>
            <p className="mt-5 text-sm" style={{ color: "#475569" }}>
              All major subjects with chapter-level question targeting
            </p>
          </div>
        </div>

        {/* Bottom callout */}
        <div
          className="mt-8 p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4"
          style={{
            background: "linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(168,85,247,0.1) 100%)",
            border: "1px solid rgba(99,102,241,0.2)",
          }}
        >
          <div>
            <h3 className="text-lg font-bold text-white mb-1">Custom Syllabus Support</h3>
            <p className="text-sm" style={{ color: "#94a3b8" }}>
              Using a custom curriculum or textbook? Add custom prompts and our AI adapts instantly.
            </p>
          </div>
          <span
            className="flex-shrink-0 px-5 py-2.5 rounded-xl text-sm font-semibold text-white whitespace-nowrap"
            style={{
              background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
            }}
          >
            Try it Free
          </span>
        </div>
      </div>
    </section>
  );
}
