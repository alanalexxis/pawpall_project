import Branding from "@/components/profile-pet/branding";
import ContentBlock from "@/components/profile-pet/content-block";
import PetButton from "@/components/profile-pet/pet-button";
import PetDetails from "@/components/profile-pet/pet-details";
import PetList from "@/components/profile-pet/pet-list";
import SearchForm from "@/components/profile-pet/search-form";
import Stats from "@/components/profile-pet/stats";
import { Card, CardContent } from "../ui/card";

export default async function PetPro() {
  return (
    <Card className="rounded-lg border-none mt-6">
      <CardContent className="p-6">
        <div className="relative min-h-[calc(100vh-56px-64px-20px-24px-56px-48px)]">
          <div className="absolute top-0 left-0 p-4"></div>
          <main>
            <div className="flex items-center justify-between py-8">
              <Branding />
              <Stats />
            </div>

            <div className="grid md:grid-cols-3 grid-rows-[45px_300px_500px] md:grid-rows-[45px_1fr] gap-4 md:h-[600px]">
              <div className="md:row-start-1 md:row-span-1 md:col-start-1 md:col-span-1">
                <SearchForm />
              </div>

              <div className="relative md:row-start-2 md:row-span-full md:col-start-1 md:col-span-1">
                <ContentBlock>
                  <PetList />
                  <div className="absolute bottom-4 right-4">
                    <PetButton actionType="add" />
                  </div>
                </ContentBlock>
              </div>
              <div className="md:row-start-1 md:row-span-full md:col-start-2 md:col-span-full">
                <ContentBlock>
                  <PetDetails />
                </ContentBlock>
              </div>
            </div>
          </main>
        </div>
      </CardContent>
    </Card>
  );
}
