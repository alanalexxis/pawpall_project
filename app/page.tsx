import { Main, Section, Container } from "@/components/craft";
import Footer from "@/components/home-page/footer";
import CTA from "@/components/home-page/cta";
import FeatureLeft from "@/components/home-page/feature-left";
import FeatureRight from "@/components/home-page/feature-right";
import FeatureSet from "@/components/home-page/feature-set";
import Hero from "@/components/home-page/hero";
import { AuroraBackgroundDemo } from "@/components/home-page/back";
import PricingSectionCards from "@/components/home-page/pricing";
import { MarqueeDemo } from "@/components/home-page/tweetInfinite";
import Background from "@/components/background";
import { NavBar } from "@/components/navbar";

export default function Page() {
  return (
    <>
      <NavBar />
      <Main>
        {/* Sección hero */}
        <AuroraBackgroundDemo />
        <Section id="history" className="relative">
          <Background />
          <Container>
            {/* Sección historia */}
            <Hero />
          </Container>
        </Section>
        <Section id="features">
          <Container>
            {/* Sección características */}
            <FeatureRight />
            <FeatureLeft />
            <FeatureSet />
          </Container>
        </Section>
        <Section id="pricing">
          <Container>
            {/* Sección precios */}
            <PricingSectionCards />
          </Container>
        </Section>
        <Section id="contact">
          <Container>
            {/* Sección contacto */}
            <CTA />
          </Container>
        </Section>
        <MarqueeDemo />
        <Section>
          <Footer />
        </Section>
      </Main>
    </>
  );
}
