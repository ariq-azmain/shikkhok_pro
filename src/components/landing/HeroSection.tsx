"use client";

import Image from "next/image";
import { FaArrowRight, FaPlay } from "react-icons/fa";
import { gsap, useGSAP } from "@/lib/gsap";

const HeroSection = () => {
  useGSAP(() => {
    const tl = gsap.timeline();

    tl.from(".hero-badge", {
      opacity: 0,
      y: 30,
      duration: 0.7,
    })

      .from(
        ".hero-title",
        {
          opacity: 0,
          y: 60,
          duration: 1,
        },
        "-=0.4"
      )

      .from(
        ".hero-description",
        {
          opacity: 0,
          y: 40,
          duration: 0.8,
        },
        "-=0.5"
      )

      .from(
        ".hero-buttons",
        {
          opacity: 0,
          y: 30,
          duration: 0.8,
        },
        "-=0.4"
      )

      .from(
        ".hero-image",
        {
          opacity: 0,
          scale: 0.8,
          rotate: -6,
          duration: 1.2,
        },
        "-=0.8"
      );
  });

  return (
    <section className="relative min-h-screen overflow-hidden pt-36 pb-24 px-6 hero-grid">
      <div className="blue-glow top-[-100px] left-[-120px]" />

      <div className="purple-glow bottom-[-120px] right-[-120px]" />

      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
        <div>
          <div className="hero-badge inline-flex items-center gap-3 px-5 py-3 rounded-full glass-card mb-8">
            <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse" />

            <span className="text-sm text-slate-300">
              Bangladesh AI Education Platform
            </span>
          </div>

          <h1 className="hero-title text-6xl lg:text-8xl font-black leading-[1.05] mb-8">
            The Future of
            <span className="block text-gradient">
              AI Question
            </span>
            Generation
          </h1>

          <p className="hero-description text-slate-400 text-xl leading-relaxed max-w-2xl mb-10">
            Generate secure, curriculum-based question papers
            for Bangladesh schools and colleges using powerful AI.
            Built for teachers, organizations, and modern education.
          </p>

          <div className="hero-buttons flex flex-wrap gap-5">
            <button className="group h-16 px-8 rounded-2xl bg-blue-600 hover:bg-blue-500 transition-all font-semibold text-lg flex items-center gap-3 hero-shadow">
              Start Building

              <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>

            <button className="h-16 px-8 rounded-2xl glass-card text-lg flex items-center gap-3 hover:bg-white/10 transition-all">
              <FaPlay />

              Watch Demo
            </button>
          </div>

          <div className="flex items-center gap-10 mt-14">
            <div>
              <h3 className="text-4xl font-black text-blue-400">
                50K+
              </h3>

              <p className="text-slate-500 mt-2">
                Questions Generated
              </p>
            </div>

            <div>
              <h3 className="text-4xl font-black text-purple-400">
                10K+
              </h3>

              <p className="text-slate-500 mt-2">
                Active Teachers
              </p>
            </div>
          </div>
        </div>

        <div className="hero-image relative">
          <div className="absolute inset-0 rounded-[40px] bg-gradient-to-tr from-blue-500/20 to-purple-500/20 blur-3xl" />

          <div className="relative glass-card-strong rounded-[40px] p-5 gradient-border floating-animation">
            <Image
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f"
              alt="Shikkhok Pro"
              width={900}
              height={900}
              className="rounded-[30px] object-cover hero-shadow"
            />

            <div className="absolute -bottom-10 -left-10 glass-card rounded-3xl p-6 w-[260px] floating-animation-slow">
              <p className="text-sm text-slate-400 mb-3">
                AI Generated
              </p>

              <h4 className="text-2xl font-bold mb-2">
                SSC Physics
              </h4>

              <p className="text-slate-500 text-sm">
                Creative + MCQ Question Set
              </p>
            </div>

            <div className="absolute -top-8 -right-8 glass-card rounded-3xl p-5">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-blue-500/20 flex items-center justify-center">
                  🤖
                </div>

                <div>
                  <h4 className="font-bold text-lg">
                    AI Powered
                  </h4>

                  <p className="text-slate-400 text-sm">
                    NCTB Optimized
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;