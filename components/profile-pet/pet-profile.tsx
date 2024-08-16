import React, { useState } from "react";

function PetProfile() {
  const [pets, setPets] = useState([
    { name: "teddy", owner: "Alan", age: 2, notes: "Ninguna nota" },
    { name: "Luis", owner: "Alan", age: 3, notes: "" },
  ]);
  const [selectedPet, setSelectedPet] = useState(null);

  const addPet = () => {
    const newPet = { name: "", owner: "", age: "", notes: "" };
    setPets([...pets, newPet]);
    setSelectedPet(newPet);
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/4 bg-green-500 text-white p-4">
        <h1 className="text-xl font-bold mb-4">PetSoft</h1>
        <p className="mb-6">Manage your pet daycare with ease</p>
        <input
          type="text"
          placeholder="Search pets"
          className="w-full p-2 rounded mb-4"
        />
        <div className="overflow-y-auto">
          {pets.map((pet, index) => (
            <div
              key={index}
              className={`p-4 mb-2 cursor-pointer rounded ${
                selectedPet === pet ? "bg-gray-200 text-black" : ""
              }`}
              onClick={() => setSelectedPet(pet)}
            >
              {pet.name}
            </div>
          ))}
        </div>
        <button
          onClick={addPet}
          className="mt-4 p-2 bg-black text-white rounded-full"
        >
          +
        </button>
      </div>

      {selectedPet && (
        <div className="w-3/4 p-8">
          <h2 className="text-3xl mb-4">{selectedPet.name}</h2>
          <p className="mb-2">
            <strong>Owner Name:</strong> {selectedPet.owner}
          </p>
          <p className="mb-2">
            <strong>Age:</strong> {selectedPet.age}
          </p>
          <textarea
            className="w-full p-4 border rounded"
            placeholder="Notes"
            value={selectedPet.notes}
            onChange={(e) =>
              setSelectedPet({ ...selectedPet, notes: e.target.value })
            }
          />
          <div className="mt-4">
            <button className="mr-2 p-2 bg-blue-500 text-white rounded">
              Edit
            </button>
            <button className="p-2 bg-red-500 text-white rounded">
              Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PetProfile;
