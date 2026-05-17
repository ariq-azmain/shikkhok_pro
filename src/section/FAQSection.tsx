"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FAQ_ITEMS } from "@/constants";
import { RiAddLine, RiSubtractLine } from "react-icons/ri";

function FAQItem({ item, index }: { item: { id: string; question: string; answer: string }; index: number }) {
  const [open, setOpen] = useState(false);
  const answerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!answerRef.current) return;
    if (open) {
      gsap.fromTo(
        answerRef.current,
        { height: 0, opacity: 0 },
        { height: "auto", opacity: 1, duration: 0.3, ease: "power2.out" }
      );
    } else {
      gsap.to(answerRef.current, {
        height: 0, opacity: 0, duration: 0.25, ease: "power2.in",
      });
    }
  }, [open]);

  return (
    <div
      className="rounded-xl overflow-hidden transition-all duration-200"
      style={{
        background: open ? "rgba(22,22,42,0.9)" : "rgba(18,18,31,0.7)",
        border: open ? "1px solid rgba(99,102,241,0.25)" : "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <button
        className="w-full flex items-center justify-between px-6 py-5 text-left"
        onClick={() => setOpen(!open)}
      >
        <span className="text-sm md:text-base font-semibold text-white pr-4">
          {item.question}
        </span>
        <div
          className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
          style={{
            background: open ? "rgba(99,102,241,0.2)" : "rgba(255,255,255,0.05)",
            border: open ? "1px solid rgba(99,102,241,0.3)" : "1px solid rgba(255,255,255,0.08)",
          }}
        >
          {open ? (
            <RiSubtractLine style={{ color: "#818cf8" }} className="text-sm" />
          ) : (
            <RiAddLine style={{ color: "#64748b" }} className="text-sm" />
          )}
        </div>
      </button>
      <div ref={answerRef} style={{ height: 0, overflow: "hidden", opacity: 0 }}>
        <p className="px-6 pb-5 text-sm leading-relaxed" style={{ color: "#64748b" }}>
          {item.answer}
        </p>
      </div>
    </div>
  );
}

export default function FAQSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(titleRef.current, { opacity: 0, y: 30 }, {
        opacity: 1, y: 0, duration: 0.7,
        scrollTrigger: { trigger: titleRef.current, start: "top 85%" },
      });
      gsap.fromTo(listRef.current, { opacity: 0, y: 40 }, {
        opacity: 1, y: 0, duration: 0.8, delay: 0.2,
        scrollTrigger: { trigger: listRef.current, start: "top 88%" },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="faq" ref={sectionRef} className="relative py-24 px-6">
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse, rgba(99,102,241,0.08) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />
      <div className="max-w-3xl mx-auto">
        <div ref={titleRef} className="text-center mb-12">
          <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: "#818cf8" }}>
            FAQ
          </p>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            Common{" "}
            <span style={{
              background: "linear-gradient(135deg, #818cf8 0%, #a855f7 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              Questions
            </span>
          </h2>
          <p className="text-lg" style={{ color: "#94a3b8" }}>
            Everything you need to know about Shikkhok Pro.
          </p>
        </div>
        <div ref={listRef} className="space-y-3">
          {FAQ_ITEMS.map((item, i) => (
            <FAQItem key={item.id} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
