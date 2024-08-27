import { Card, CardContent } from "../ui/card";
import ProfilePet from "../profile-pet/profile-pet";

export default function PetPro() {
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
