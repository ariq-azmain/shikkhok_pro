import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import StatsSection from "@/components/landing/StatsSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import AISection from "@/components/landing/AISection";
import SecuritySection from "@/components/landing/SecuritySection";
import OrganizationSection from "@/components/landing/OrganizationSection";
import SocialFeedSection from "@/components/landing/SocialFeedSection";
import FAQSection from "@/components/landing/FAQSection";
import CTASection from "@/components/landing/CTASection";
import Footer from "@/components/landing/Footer";

export default function HomePage() {
  return (
    <main className="bg-[#020617] text-white overflow-hidden">
      <Navbar />
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <AISection />
      <SecuritySection />
      <OrganizationSection />
      <SocialFeedSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </main>
  );
}