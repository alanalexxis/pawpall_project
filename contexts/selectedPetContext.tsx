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
    // Inicializa el estado desde localStorage si existe
    const storedPet = localStorage.getItem("selectedPet");
    if (storedPet) {
      setSelectedPet(JSON.parse(storedPet));
    }
  }, []);

  useEffect(() => {
    // Guarda el valor de selectedPet en localStorage cuando cambie
    if (selectedPet) {
      localStorage.setItem("selectedPet", JSON.stringify(selectedPet));
    } else {
      localStorage.removeItem("selectedPet");
    }
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
