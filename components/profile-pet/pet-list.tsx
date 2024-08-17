"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "../ui/card";
export default function PetList() {
  const pets = [
    {
      id: 1,
      name: "Buddy",
      imageUrl: "/images/pet1.jpg",
    },
    {
      id: 2,
      name: "Molly",
      imageUrl: "/images/pet2.jpg",
    },
  ];

  return (
    <Card>
      <ul className="border-b ">
        {pets.map((pet) => (
          <li key={pet.id}>
            <div className="flex items-center h-[70px] w-full cursor-pointer px-5 text-base gap-3 hover:bg-secondary dark:hover:bg-secondary focus:bg-[#EFF1F2] transition ">
              <Avatar className="w-[45px] h-[45px] rounded-full object-cover">
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <p className="font-semibold">{pet.name}</p>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}