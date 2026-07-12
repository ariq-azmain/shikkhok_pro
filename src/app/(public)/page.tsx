import Navbar from "@/components/lending/Navbar";
import HeroSection from "@/components/lending/HeroSection";
import StatsSection from "@/components/lending/StatsSection";
import FeaturesSection from "@/components/lending/FeaturesSection";
import HowItWorksSection from "@/components/lending/HowItWorksSection";
import SecuritySection from "@/components/lending/SecuritySection";
import CurriculumSection from "@/components/lending/CurriculumSection";
import TestimonialsSection from "@/components/lending/TestimonialsSection";
import FAQSection from "@/components/lending/FAQSection";
import CTASection from "@/components/lending/CTASection";
import Footer from "@/components/lending/Footer";

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
