import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Nav } from '@/components/layout/Nav';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/sections/Hero';
import { TrustBar } from '@/components/sections/TrustBar';
import { Problem } from '@/components/sections/Problem';
import { HowItWorks } from '@/components/sections/HowItWorks';
import { Products } from '@/components/sections/Products';
import { Comparison } from '@/components/sections/Comparison';
import { FAQ } from '@/components/sections/FAQ';
import { CTA } from '@/components/sections/CTA';
import { MarqueeDivider } from '@/components/ui/MarqueeDivider';
import { GapMarker } from '@/components/ui/GapMarker';
import { ScrollProgress } from '@/components/ScrollProgress';
import { ProximityInit } from '@/components/ProximityInit';

export default function Page() {
  return (
    <>
      <ProximityInit />
      <ScrollProgress />
      <AnnouncementBar />
      <Nav />
      <main>
        <Hero />
        <GapMarker from="hero" to="divider" />
        <MarqueeDivider text="INTENT · POLICY · AUDIT" />
        <TrustBar />
        <GapMarker from="trust" to="problem" />
        <Problem />
        <MarqueeDivider text="FIREWALL · INTENT · FIREWALL" reverse />
        <HowItWorks />
        <MarqueeDivider text="STOP AI AGENTS FROM GOING ROGUE" />
        <Products />
        <MarqueeDivider text="POLICY · COMPLIANCE · AUDIT" reverse />
        <Comparison />
        <GapMarker from="comparison" to="faq" />
        <FAQ />
        <GapMarker from="faq" to="cta" />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
