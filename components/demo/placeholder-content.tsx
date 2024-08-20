"use client";
import { Card, CardContent } from "@/components/ui/card";
import Hero from "../search/hero";
import Sizes from "../search/sizes";
import Stadistics from "../search/stats";
import BreedStandard from "../search/bread";
import About from "../search/about";
import Acordeon from "../search/accordeon";
import DidYouKnow from "../search/didyouknow";
import { RazaProvider, useRaza } from "@/contexts/razaContext";
import { SearchBar } from "../search/search";

function Content() {
  const { selectedRaza } = useRaza();

  return (
    <Card className="rounded-lg border-none mt-6">
      <CardContent className="p-6">
        <div className="relative min-h-[calc(100vh-56px-64px-20px-24px-56px-48px)]">
          <div className="absolute top-0 left-0 p-4"></div>
          {selectedRaza ? (
            <>
              <Hero />
              <Sizes />
              <Stadistics />
              <BreedStandard />
              <About />
              <Acordeon />
              <DidYouKnow />
            </>
          ) : (
            <div className="flex flex-col justify-center items-center h-full">
              <h2 className="text-4xl font-bold text-center text-primary mb-6">
                Seleccione una raza para empezar
              </h2>
              <p className="text-lg text-center text-gray-500 mb-8">
                Use la barra de búsqueda para encontrar la raza que desea
                explorar.
              </p>
              <div className="">
                <SearchBar />
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function PlaceholderContent() {
  return (
    <RazaProvider>
      <Content />
    </RazaProvider>
  );
}
