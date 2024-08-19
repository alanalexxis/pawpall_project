import React, { createContext, useContext, useState, ReactNode } from "react";

interface Raza {
  id: number;
  name: string;
  popularity: string;
  image_url: string;
  breed_group: string;
  country_of_origin: string;
  height_male: string;
  height_female: string;
  min_weight_male: string;
  min_weight_female: string;
  max_weight_male: string;
  max_weight_female: string;
  life_expectancy: string;
  recognized_date: string;
  about: string;
  history: string;
  health_description: string;
  grooming_description: string;
  exercise_description: string;
  training_description: string;
  nutrition_description: string;
  characteristics: string;
}
interface Fact {
  id: number;
  breed_id: number;
  fact: string;
}
interface RazaContextType {
  selectedRaza: Raza | null;
  setSelectedRaza: (raza: Raza | null) => void;
  facts: Fact[];
  setFacts: (facts: Fact[]) => void;
}

const RazaContext = createContext<RazaContextType | undefined>(undefined);

export const RazaProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [selectedRaza, setSelectedRaza] = useState<Raza | null>(null);
  const [facts, setFacts] = useState<Fact[]>([]);

  return (
    <RazaContext.Provider
      value={{ selectedRaza, setSelectedRaza, facts, setFacts }}
    >
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
