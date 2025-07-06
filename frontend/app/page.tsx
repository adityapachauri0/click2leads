import HeroSection from '@/components/HeroSection'
import StatsSection from '@/components/StatsSection'
import VisualSection3D from '@/components/VisualSection3D'
import FeaturesSection from '@/components/FeaturesSection'
import GrowthMethodology3D from '@/components/GrowthMethodology3D'
import PlatformsSection from '@/components/PlatformsSection'
import TestimonialsSection from '@/components/TestimonialsSection'
import PricingSection from '@/components/PricingSection'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <VisualSection3D />
      <GrowthMethodology3D />
      <PlatformsSection />
      <TestimonialsSection />
      <PricingSection />
      <Footer />
    </>
  )
}