import LoginButton from "@/components/LoginLogoutButton";
import UserGreetText from "@/components/UserGreetText";
import { Main, Section, Container } from "@/components/craft";
import Footer from "@/components/home-page/footer";
import CTA from "@/components/home-page/cta";
import FeatureLeft from "@/components/home-page/feature-left";
import FeatureRight from "@/components/home-page/feature-right";
import FeatureSet from "@/components/home-page/feature-set";
import Hero from "@/components/home-page/hero";

export default function Page() {
  return (
    <Main>
      <Section>
        <Container>
          <Hero />
          <FeatureLeft />
          <FeatureRight />
          <FeatureSet />
          <CTA />
          <Footer />
          <UserGreetText />
          <LoginButton />
        </Container>
      </Section>
    </Main>
  );
}
