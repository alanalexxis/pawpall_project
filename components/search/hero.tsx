import React from "react";
import { Badge } from "../ui/badge";
import { SearchBar } from "./search";
import { useRaza } from "@/contexts/razaContext";

function Hero() {
  const { selectedRaza } = useRaza();
  // Formatear el texto de popularidad
  const popularidadText = selectedRaza?.popularity
    ? `#${selectedRaza.popularity} EN POPULARIDAD`
    : "#3 EN POPULARIDAD";

  return (
    <div className="bg-[conic-gradient(at_top,_var(--tw-gradient-stops))] from-yellow-200 via-emerald-200 to-yellow-200 flex items-center justify-center h-auto py-10 relative">
      <div className="absolute top-4 left-4 right-4">
        <SearchBar />
      </div>
      <div className="container mx-auto px-4 max-w-4xl flex flex-col md:flex-row items-center justify-between pt-6">
        <div className="flex-1 text-center md:text-left mb-6 md:mb-0">
          <h1 className="text-5xl font-extrabold mb-4 leading-tight">
            {selectedRaza?.name || "Golden Retriever"}
          </h1>
          <p className="text-xl mb-4 text-gray-700">
            inteligente / amigable / devoto
          </p>
          <Badge className="bg-yellow-300 text-black">CANADÁ</Badge>
          <Badge className="bg-yellow-200 text-black ml-1">
            GRUPO DEPORTIVO
          </Badge>
          <Badge className="bg-red-200 text-black">{popularidadText}</Badge>
        </div>
        <div className="flex-1 relative mt-6 md:mt-0">
          <img
            src={selectedRaza?.image_url || "/labrador.jpg"} // Usa la URL de la imagen de la raza o una imagen por defecto
            alt={selectedRaza?.name || "Raza"}
            className="w-[450px] h-[300px] object-cover rounded-lg shadow-lg transition-transform transform hover:scale-105"
          />
          <button className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white text-black rounded-full p-3 shadow-md transition-transform hover:scale-110">
            &lsaquo;
          </button>
          <button className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white text-black rounded-full p-3 shadow-md transition-transform hover:scale-110">
            &rsaquo;
          </button>
        </div>
      </div>
    </div>
  );
}

export default Hero;
