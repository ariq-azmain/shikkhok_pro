"use client";

import SectionTitle from "./SectionTitle";

import {
  FaRobot,
  FaLock,
  FaUsers,
  FaFilePdf,
  FaComments,
  FaSchool,
} from "react-icons/fa";

import { gsap, useGSAP } from "@/lib/gsap";

const features = [
  {
    icon: FaRobot,
    title: "AI Question Generator",
    description:
      "Generate smart questions instantly with syllabus-aware AI.",
  },
  {
    icon: FaLock,
    title: "Leak Protection",
    description:
      "Private questions remain secured inside organizations.",
  },
  {
    icon: FaUsers,
    title: "Teacher Collaboration",
    description:
      "Teachers can collaborate securely inside institutions.",
  },
  {
    icon: FaFilePdf,
    title: "PDF Export",
    description:
      "Export beautiful exam papers instantly.",
  },
  {
    icon: FaComments,
    title: "Real-time Chat",
    description:
      "Stream Chat powered teacher communication.",
  },
  {
    icon: FaSchool,
    title: "Organization Dashboard",
    description:
      "Manage teachers, tasks, notices, and question banks.",
  },
];

const FeaturesSection = () => {
  useGSAP(() => {
    gsap.from(".feature-item", {
      opacity: 0,
      y: 60,
      duration: 1,
      stagger: 0.12,
      scrollTrigger: {
        trigger: ".features-wrapper",
        start: "top 75%",
      },
    });
  });

  return (
    <section className="py-36 px-6">
      <div className="max-w-7xl mx-auto">
        <SectionTitle
          title="Everything Modern Teachers Need"
          subtitle="Designed specifically for Bangladesh education ecosystem."
        />

        <div className="features-wrapper grid lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <div
                key={index}
                className="feature-item feature-card glass-card rounded-[32px] p-10"
              >
                <div className="w-20 h-20 rounded-3xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-8">
                  <Icon className="text-4xl text-blue-400" />
                </div>

                <h3 className="text-3xl font-bold mb-5">
                  {feature.title}
                </h3>

                <p className="text-slate-400 text-lg leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;