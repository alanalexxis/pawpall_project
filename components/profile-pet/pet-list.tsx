"use client";

import Image from "next/image";

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
    <ul className="bg-white border-b border-light">
      {pets.map((pet) => (
        <li key={pet.id}>
          <div className="flex items-center h-[70px] w-full cursor-pointer px-5 text-base gap-3 hover:bg-[#EFF1F2] focus:bg-[#EFF1F2] transition">
            <Image
              src={pet.imageUrl}
              alt="Pet image"
              width={45}
              height={45}
              className="w-[45px] h-[45px] rounded-full object-cover"
            />
            <p className="font-semibold">{pet.name}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
