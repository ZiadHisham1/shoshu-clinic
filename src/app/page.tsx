import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageTransition from "@/components/layout/PageTransition";
import Hero from "@/components/Hero";
import BookingSection from "@/components/sections/BookingSection";
import ServicesSection from "@/components/sections/ServicesSection";
import NutritionSection from "@/components/sections/NutritionSection";
import PhysioSection from "@/components/sections/PhysioSection";
import HijamaSection from "@/components/sections/HijamaSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import StickyCTA from "@/components/sections/StickyCTA";
import LotusDivider from "@/components/ui/LotusDivider";

const HomePage = () => (
  <>
    <Navbar />
    <PageTransition className="w-full">
      <Hero />

      <div className="mx-auto w-full max-w-7xl space-y-8 px-4 pt-8 sm:px-6 sm:pt-10 lg:px-8 lg:pt-12">
        <BookingSection />
        <ServicesSection />
        <NutritionSection />
        <LotusDivider />
        <PhysioSection />
        <HijamaSection />
        <TestimonialsSection />
      </div>

      <Footer />
    </PageTransition>
    <StickyCTA />
  </>
);

export default HomePage;