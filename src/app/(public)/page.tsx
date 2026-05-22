import Navbar from "@/components/lending/Navbar";
import HeroSection from "@/section/lending/HeroSection";
import StatsSection from "@/section/lending/StatsSection";
import FeaturesSection from "@/section/lending/FeaturesSection";
import HowItWorksSection from "@/section/lending/HowItWorksSection";
import SecuritySection from "@/section/lending/SecuritySection";
import CurriculumSection from "@/section/lending/CurriculumSection";
import TestimonialsSection from "@/section/lending/TestimonialsSection";
import FAQSection from "@/section/lending/FAQSection";
import CTASection from "@/section/lending/CTASection";
import Footer from "@/section/lending/Footer";

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(99,102,241,0.12) 0%, transparent 60%)",
          zIndex: 0,
        }}
      />
      <Navbar />
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <HowItWorksSection />
      <SecuritySection />
      <CurriculumSection />
      <TestimonialsSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </main>
  );
}
