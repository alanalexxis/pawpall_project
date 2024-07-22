import LoginButton from "@/components/LoginLogoutButton";
import { Main, Section, Container, Article } from "@/components/craft";
import Footer from "@/components/home-page/footer";
import CTA from "@/components/home-page/cta";
import FeatureLeft from "@/components/home-page/feature-left";
import FeatureRight from "@/components/home-page/feature-right";
import FeatureSet from "@/components/home-page/feature-set";
import Hero from "@/components/home-page/hero";
import { AuroraBackgroundDemo } from "@/components/home-page/back";
import PricingSectionCards from "@/components/home-page/pricing";

export default function Page() {
  return (
    <Main>
      <AuroraBackgroundDemo />
      <Section>
        <Container>
          <Hero />
          <FeatureRight />
          <FeatureLeft />
          <FeatureSet />
          <CTA />
          <Footer />
          <LoginButton />
        </Container>
      </Section>
    </Main>
  );
}
