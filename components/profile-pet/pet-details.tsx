"use client";

import Image from "next/image";
import PetButton from "./pet-button";

export default function PetDetails() {
  const pets = [
    {
      id: 1,
      name: "Buddy",
      imageUrl: "/images/buddy.jpg",
      ownerName: "John Doe",
      age: "3 years",
      notes: "Buddy loves to play with balls and enjoys long walks.",
    },
    {
      id: 2,
      name: "Luna",
      imageUrl: "/images/luna.jpg",
      ownerName: "Jane Smith",
      age: "2 years",
      notes: "Luna is a very calm dog who enjoys napping in the sun.",
    },
  ];

  const selectedPet = pets[0]; // Simulate a selected pet (Buddy)

  return (
    <section className="flex flex-col h-full w-full">
      {!selectedPet ? (
        <EmptyView />
      ) : (
        <>
          <TopBar pet={selectedPet} />
          <OtherInfo pet={selectedPet} />
          <Notes pet={selectedPet} />
        </>
      )}
    </section>
  );
}

type PetProps = {
  pet: {
    id: number;
    name: string;
    imageUrl: string;
    ownerName: string;
    age: string;
    notes: string;
  };
};

function EmptyView() {
  return (
    <p className="h-full flex justify-center items-center text-2xl font-medium">
      No pet selected
    </p>
  );
}

function TopBar({ pet }: PetProps) {
  return (
    <div className="flex items-center bg-white px-8 py-5 border-b border-light">
      <Image
        src={pet.imageUrl}
        alt={`${pet.name} image`}
        height={75}
        width={75}
        className="h-[75px] w-[75px] rounded-full object-cover"
      />

      <h2 className="text-3xl font-semibold leading-7 ml-5">{pet.name}</h2>

      <div className="ml-auto space-x-2">
        <PetButton actionType="edit">Edit</PetButton>
        <PetButton actionType="checkout">Checkout</PetButton>
      </div>
    </div>
  );
}

function OtherInfo({ pet }: PetProps) {
  return (
    <div className="flex justify-around py-10 px-5 text-center">
      <div>
        <h3 className="text-[13px] font-medium uppercase text-zinc-700">
          Owner name
        </h3>
        <p className="mt-1 text-lg text-zinc-800">{pet.ownerName}</p>
      </div>

      <div>
        <h3 className="text-[13px] font-medium uppercase text-zinc-700">Age</h3>
        <p className="mt-1 text-lg text-zinc-800">{pet.age}</p>
      </div>
    </div>
  );
}

function Notes({ pet }: PetProps) {
  return (
    <section className="flex-1 bg-white px-7 py-5 rounded-md mb-9 mx-8 border border-light">
      {pet.notes}
    </section>
  );
}
