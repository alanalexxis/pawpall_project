import Branding from "@/components/profile-pet/branding";
import ContentBlock from "@/components/profile-pet/content-block";
import PetButton from "@/components/profile-pet/pet-button";
import PetDetails from "@/components/profile-pet/pet-details";
import PetList from "@/components/profile-pet/pet-list";
import SearchForm from "@/components/profile-pet/search-form";
import Stats from "@/components/profile-pet/stats";
import { Card, CardContent } from "../ui/card";
import ProfilePet from "../profile-pet/profile-pet";

export default async function PetPro() {
  return (
    <Card className="rounded-lg border-none mt-6">
      <CardContent className="p-6">
        <div className="relative min-h-[calc(100vh-56px-64px-20px-24px-56px-48px)]">
          <div className="absolute top-0 left-0 p-4"></div>
          <ProfilePet />
        </div>
      </CardContent>
    </Card>
  );
}
