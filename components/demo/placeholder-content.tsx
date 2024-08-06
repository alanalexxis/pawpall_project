import { Card, CardContent } from "@/components/ui/card";

import Hero from "../search/hero";
import Sizes from "../search/sizes";
import Stadistics from "../search/stats";

export default function PlaceholderContent() {
  return (
    <Card className="rounded-lg border-none mt-6">
      <CardContent className="p-6">
        <div className="relative min-h-[calc(100vh-56px-64px-20px-24px-56px-48px)]">
          <div className="absolute top-0 left-0 p-4"></div>
          <Hero />
          <Sizes />
          <Stadistics />
        </div>
      </CardContent>
    </Card>
  );
}
