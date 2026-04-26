import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Nav } from '@/components/layout/Nav';
import { Footer } from '@/components/layout/Footer';
import { FooterRevealWrapper } from '@/components/layout/FooterRevealWrapper';
import { HeroHandoff } from '@/components/sections/HeroHandoff';
import { TrustBar } from '@/components/sections/TrustBar';
import { Problem } from '@/components/sections/Problem';
import { HowItWorks } from '@/components/sections/HowItWorks';
import { Products } from '@/components/sections/Products';
import { Comparison } from '@/components/sections/Comparison';
import { DashboardPreview } from '@/components/sections/DashboardPreview';
import { Manifesto } from '@/components/sections/Manifesto';
import { FAQ } from '@/components/sections/FAQ';
import { CTA } from '@/components/sections/CTA';
import { MarqueeDivider } from '@/components/ui/MarqueeDivider';

export default function Page() {
  return (
    <>
      <AnnouncementBar />
      <main className="relative z-10 overflow-hidden bg-[var(--color-bg)] rounded-b-[40px] md:rounded-b-[80px]">
        <Nav />
        <HeroHandoff />
        <TrustBar />
        <Problem />
        <MarqueeDivider text="INTENT · POLICY · AUDIT" />
        <HowItWorks />
        <Products />
        <DashboardPreview />
        <MarqueeDivider text="STOP AI AGENTS FROM GOING ROGUE" reverse />
        <Comparison />
        <Manifesto />
        <FAQ />
        <CTA />
      </main>
      <FooterRevealWrapper className="bg-[var(--color-text-dark)] w-full">
        <Footer />
      </FooterRevealWrapper>
    </>
  );
}
