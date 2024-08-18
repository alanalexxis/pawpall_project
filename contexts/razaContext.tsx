import React, { createContext, useContext, useState, ReactNode } from "react";

interface Raza {
  id: number;
  name: string;
  popularity: string; // Añadido para manejar la popularidad
  image_url: string; // Añadido para manejar la URL de la imagen
}

interface RazaContextType {
  selectedRaza: Raza | null;
  setSelectedRaza: (raza: Raza | null) => void;
}

const RazaContext = createContext<RazaContextType | undefined>(undefined);

export const RazaProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [selectedRaza, setSelectedRaza] = useState<Raza | null>(null);

  return (
    <RazaContext.Provider value={{ selectedRaza, setSelectedRaza }}>
      {children}
    </RazaContext.Provider>
  );
};

export const useRaza = () => {
  const context = useContext(RazaContext);
  if (context === undefined) {
    throw new Error("useRaza must be used within a RazaProvider");
  }
  return context;
};
