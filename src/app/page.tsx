import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Nav } from '@/components/layout/Nav';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/sections/Hero';
import { TrustBar } from '@/components/sections/TrustBar';
import { Problem } from '@/components/sections/Problem';
import { HowItWorks } from '@/components/sections/HowItWorks';
import { Products } from '@/components/sections/Products';
import { Comparison } from '@/components/sections/Comparison';
import { Manifesto } from '@/components/sections/Manifesto';
import { FAQ } from '@/components/sections/FAQ';
import { CTA } from '@/components/sections/CTA';
import { MarqueeDivider } from '@/components/ui/MarqueeDivider';

export default function Page() {
  return (
    <>
      <AnnouncementBar />
      <Nav />
      <main>
        <Hero />
        <TrustBar />
        <Problem />
        <MarqueeDivider text="INTENT · POLICY · AUDIT" />
        <HowItWorks />
        <Products />
        <MarqueeDivider text="STOP AI AGENTS FROM GOING ROGUE" reverse />
        <Comparison />
        <Manifesto />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
