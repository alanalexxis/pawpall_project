// React and Next.js imports
import Image from "next/image";
import Link from "next/link";

// Third-party library imports
import Balancer from "react-wrap-balancer";

// UI component imports
import { Button } from "../ui/button";

// Icon imports
import { Github, Twitter, Facebook } from "lucide-react";

// Local component imports
import { Section, Container } from "../craft";

// Asset imports
import Logo from "@/public/Black_Paw.svg";

export default function Footer() {
  return (
    <footer>
      <Section>
        <Container className="grid gap-12 md:grid-cols-[1.5fr_0.5fr_0.5fr]">
          <div className="not-prose flex flex-col gap-6">
            <Link href="/">
              <h3 className="sr-only">pawpal</h3>
              <Image
                src={Logo}
                alt="Logo"
                width={50}
                height={27.27}
                className="transition-all hover:opacity-75 dark:invert"
              ></Image>
            </Link>
            <p>
              <Balancer>
                Pawpal: la app esencial para gestionar la salud, dieta y
                diversión de tu perro.
              </Balancer>
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <h5>Sitio web</h5>
            <Link href="/">Historia</Link>
            <Link href="/">Características</Link>
            <Link href="/">Precio</Link>
            <Link href="/">Contacto</Link>
          </div>
          <div className="flex flex-col gap-2">
            <h5>Legal</h5>
            <Link href="/privacy-policy">Política de privacidad</Link>
            <Link href="/terms-of-service">Términos y condiciones</Link>
            <Link href="/cookie-policy">Política de cookies</Link>
          </div>
        </Container>
        <Container className="not-prose flex flex-col justify-between gap-6 border-t md:flex-row md:items-center md:gap-2">
          <div className="flex gap-2">
            <Button variant="outline" size="icon">
              <Github />
            </Button>
            <Button variant="outline" size="icon">
              <Twitter />
            </Button>
            <Button variant="outline" size="icon">
              <Facebook />
            </Button>
          </div>
          <p className="text-muted-foreground">
            © <a href="https://github.com/brijr/components">pawpal</a>. Todos
            los derechos reservados. 2024-presente.
          </p>
        </Container>
      </Section>
    </footer>
  );
}
