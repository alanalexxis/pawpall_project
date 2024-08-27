"use client";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

// Define la estructura del contexto
interface SelectedPetContextProps {
  selectedPet: any;
  setSelectedPet: (pet: any) => void;
}

// Crea el contexto
const SelectedPetContext = createContext<SelectedPetContextProps | undefined>(
  undefined
);

// Crea un proveedor para el contexto
export const SelectedPetProvider = ({ children }: { children: ReactNode }) => {
  const [selectedPet, setSelectedPet] = useState<any>(null);

  useEffect(() => {
    console.log("selectedPet ha cambiado:", selectedPet);
  }, [selectedPet]);

  return (
    <SelectedPetContext.Provider value={{ selectedPet, setSelectedPet }}>
      {children}
    </SelectedPetContext.Provider>
  );
};

// Hook para acceder al contexto de manera más sencilla
export const useSelectedPet = () => {
  const context = useContext(SelectedPetContext);
  if (!context) {
    throw new Error(
      "useSelectedPet debe ser usado dentro de un SelectedPetProvider"
    );
  }
  return context;
};
