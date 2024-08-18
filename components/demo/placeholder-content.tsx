"use client";
import { Card, CardContent } from "@/components/ui/card";

import Hero from "../search/hero";
import Sizes from "../search/sizes";
import Stadistics from "../search/stats";
import BreedStandard from "../search/bread";
import About from "../search/about";
import Acordeon from "../search/accordeon";
import DidYouKnow from "../search/didyouknow";
import { RazaProvider } from "@/contexts/razaContext";

export default function PlaceholderContent() {
  return (
    <RazaProvider>
      <Card className="rounded-lg border-none mt-6">
        <CardContent className="p-6">
          <div className="relative min-h-[calc(100vh-56px-64px-20px-24px-56px-48px)]">
            <div className="absolute top-0 left-0 p-4"></div>
            <Hero />
            <Sizes />
            <Stadistics />
            <BreedStandard />
            <About />
            <Acordeon />
            <DidYouKnow />
          </div>
        </CardContent>
      </Card>
    </RazaProvider>
  );
}
