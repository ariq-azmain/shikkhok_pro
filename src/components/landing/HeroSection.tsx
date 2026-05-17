"use client";

import { useEffect } from "react";
import { fadeUp } from "@/lib/gsap";
import Image from "next/image";

const HeroSection = () => {
  useEffect(() => {
    fadeUp(".hero-content");
  }, []);

  return (
    <section className="min-h-screen flex items-center pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
        <div className="hero-content">
          <div className="inline-flex px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 mb-6">
            AI Powered Education Platform
          </div>

          <h1 className="text-6xl font-black leading-tight mb-8">
            Create Smart Question Papers with AI
          </h1>

          <p className="text-slate-400 text-xl leading-relaxed mb-10">
            Shikkhok Pro helps Bangladeshi teachers generate secure,
            curriculum-based question papers instantly using AI.
          </p>

          <div className="flex gap-5">
            <button className="bg-blue-600 px-8 py-4 rounded-2xl font-semibold">
              Start Free
            </button>

            <button className="border border-white/10 px-8 py-4 rounded-2xl">
              Explore Features
            </button>
          </div>
        </div>

        <div className="relative">
          <Image
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f"
            alt="Education"
            width={700}
            height={700}
            className="rounded-3xl"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;