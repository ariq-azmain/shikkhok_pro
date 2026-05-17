import Navbar from "@/components/Navbar";
import HeroSection from "@/section/HeroSection";
import StatsSection from "@/section/StatsSection";
import FeaturesSection from "@/section/FeaturesSection";
import HowItWorksSection from "@/section/HowItWorksSection";
import SecuritySection from "@/section/SecuritySection";
import CurriculumSection from "@/section/CurriculumSection";
import TestimonialsSection from "@/section/TestimonialsSection";
import FAQSection from "@/section/FAQSection";
import CTASection from "@/section/CTASection";
import Footer from "@/section/Footer";

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
