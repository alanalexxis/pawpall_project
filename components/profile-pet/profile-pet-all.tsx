"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { DialogDemo } from "./dialog";
import {
  Search,
  Plus,
  Heart,
  Calendar,
  MapPin,
  Activity,
  X,
  Edit,
} from "lucide-react";
import { Trash } from "lucide-react"; // Importa el icono de basura
import { differenceInYears, differenceInMonths } from "date-fns";
import { createClient } from "@/utils/supabase/client";
import { DialogEdit } from "./dialog-edit";
import Link from "next/link";
export default function ProfilePet() {
  const supabase = createClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPet, setSelectedPet] = useState(null);
  const [selectedPett, setSelectedPett] = useState(null);
  const [pets, setPets] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false); // Estado para controlar la apertura del diálogo
  const [isPetsUpdated, setIsPetsUpdated] = useState(false);
  useEffect(() => {
    async function fetchPets() {
      // Obtener los datos de las mascotas
      const { data: petsData, error: petsError } = await supabase
        .from("pets")
        .select("*");

      if (petsError) {
        console.error("Error fetching pets:", petsError);
        return;
      }

      // Procesar cada mascota para obtener detalles adicionales
      const petsWithDetails = await Promise.all(
        petsData.map(async (pet) => {
          let ownerName = pet.owner_name;
          let location = pet.location;
          let breedName = "";
          let age = "";
          let avatarUrl = "";

          // Si no hay owner_name o location, obtener datos desde la tabla de perfiles
          if (!ownerName || !location) {
            const { data: profileData, error: profileError } = await supabase
              .from("profiles")
              .select("full_name, city, avatar_url")
              .eq("id", pet.profile_id)
              .single();

            if (profileError) {
              console.error("Error fetching profile:", profileError);
            } else {
              if (!ownerName) {
                ownerName = profileData.full_name;
              }
              if (!location) {
                location = profileData.city;
              }
              avatarUrl = profileData.avatar_url; // Guardar el avatar_url
            }
          }

          // Obtener el nombre de la raza utilizando el breed_id
          const { data: breedData, error: breedError } = await supabase
            .from("breeds")
            .select("name")
            .eq("id", pet.breed_id)
            .single();

          if (breedError) {
            console.error("Error fetching breed:", breedError);
          } else {
            breedName = breedData.name;
          }

          // Calcular la edad en años y meses
          const birthdate = new Date(pet.birthdate);
          const years = differenceInYears(new Date(), birthdate);
          const months = differenceInMonths(new Date(), birthdate) % 12;

          // Manejar el caso singular/plural para "año"
          const yearText = years === 1 ? "año" : "años";
          const monthText = months === 1 ? "mes" : "meses";

          age = `${years} ${yearText}${
            months > 0 ? ` y ${months} ${monthText}` : ""
          }`;

          // Obtener la URL pública de la imagen
          const { data: imageUrlData } = supabase.storage
            .from("image_upload")
            .getPublicUrl(pet.image_url);

          return {
            ...pet,
            owner_name: ownerName,
            location: location,
            breed: breedName,
            age: age,
            image_url: imageUrlData.publicUrl,
            avatar_url: avatarUrl || pet.avatar_url, // Añadir avatar_url al objeto
          };
        })
      );

      setPets(petsWithDetails);
    }

    fetchPets();
    setIsPetsUpdated(false); // Resetea el estado de actualización
  }, [isPetsUpdated]); // Ejecuta useEffect cuando isPetsUpdated cambie

  const filteredPets = pets.filter(
    (pet) =>
      pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pet.owner_name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const { data } = supabase.storage
    .from("image_upload")
    .getPublicUrl("folder/avatar1.png");
  async function handleDeletePet(petId) {
    // Confirmar la eliminación
    if (window.confirm("¿Estás seguro de que quieres eliminar esta mascota?")) {
      const { error } = await supabase.from("pets").delete().eq("id", petId);

      if (error) {
        console.error("Error deleting pet:", error);
        alert("Error al eliminar la mascota.");
      } else {
        // Actualizar el estado local para eliminar la mascota de la lista
        setPets(pets.filter((pet) => pet.id !== petId));
        alert("Mascota eliminada con éxito.");
      }
    }
  }
  return (
    <div className="min-h-screen  p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 space-y-4 md:space-y-0">
          <div>
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-primary mb-2">
              Tus mascotas
            </h1>

            <p className="text-gray-600">
              Gestiona a tus amigos peludos con facilidad
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Badge
              variant="secondary"
              className="text-lg bg-secondary px-4 py-2 rounded-full"
            >
              {filteredPets.length} mascotas
            </Badge>
            <DialogDemo onPetAdded={() => setIsPetsUpdated(true)} />
          </div>
        </div>

        <div className="mb-8">
          <Input
            type="search"
            placeholder="Buscar mascotas o dueños..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:max-w-md shadow-inner py-2 pl-10 pr-4"
            icon={
              <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            }
          />
        </div>

        <motion.div
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
        >
          {filteredPets.map((pet) => (
            <motion.div
              key={pet.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <Card
                className="overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 cursor-pointer bg-white/80 backdrop-blur-sm"
                onClick={() => {
                  setSelectedPet(pet);
                  setSelectedPett(pet);
                }}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={pet.image_url}
                    alt={pet.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-black opacity-60"></div>
                  <h3 className="absolute bottom-4 left-4 text-2xl font-bold text-white">
                    {pet.name}
                  </h3>
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Evitar la propagación del clic
                      handleDeletePet(pet.id); // Llamar a la función para eliminar la mascota
                    }}
                    className="absolute bottom-28 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <Trash className="h-4 w-4" />
                  </button>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Evitar la propagación del clic
                    setSelectedPett(pet); // Establece la mascota seleccionada
                  }}
                >
                  <DialogEdit pet={selectedPett} />
                </button>
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage src={pet.avatar_url} alt={pet.owner_name} />
                      <AvatarFallback>{pet.owner_name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-gray-700">
                        {pet.owner_name}
                      </p>
                      <p className="text-sm text-gray-500">{pet.location}</p>
                    </div>
                  </div>
                  <dl className="grid grid-cols-2 gap-4 text-sm mb-4">
                    <div className="flex items-center">
                      <Heart className="h-4 w-4 text-pink-500 mr-2" />
                      <div>
                        <dt className="sr-only">Type and Breed</dt>
                        <dd>{pet.breed}</dd>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-blue-500 mr-2" />
                      <div>
                        <dt className="sr-only">Age</dt>
                        <dd>{pet.age} de edad</dd>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 text-green-500 mr-2" />
                      <div>
                        <dt className="sr-only">Next Appointment</dt>
                        <dd>Próxima visita: {pet.nextAppointment}</dd>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Activity className="h-4 w-4 text-yellow-500 mr-2" />
                      <div>
                        <dt className="sr-only">Health Status</dt>
                        <dd>Salud: Buena {pet.health}</dd>
                      </div>
                    </div>
                  </dl>
                  <div className="flex flex-wrap gap-2">
                    {pet.tags.map((tag, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-yellow-200"
                      >
                        {tag.text}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <AnimatePresence>
        {selectedPet && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedPet(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white rounded-lg shadow-2xl max-w-2xl w-full overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <img
                  src={selectedPet.image_url}
                  alt={selectedPet.name}
                  className="w-full h-64 object-cover"
                />
                <Button
                  variant="ghost"
                  className="absolute top-2 right-2 text-white hover:bg-white/20"
                  onClick={() => setSelectedPet(null)}
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>
              <div className="p-6">
                <h2 className="text-3xl font-bold mb-4">{selectedPet.name}</h2>
                <p className="text-gray-600 mb-4">
                  {selectedPet.breed} • {selectedPet.age} de edad
                </p>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <h3 className="font-semibold text-gray-700">
                      Dueño de la mascota
                    </h3>
                    <p>{selectedPet.owner_name}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-700">Ciudad</h3>
                    <p>{selectedPet.location}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-700">
                      Próxima visita
                    </h3>
                    <p>{selectedPet.nextAppointment}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-700">
                      Estado de salud
                    </h3>
                    <p>Buena</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-700">
                      Descripción de la mascota
                    </h3>
                    <p>{selectedPet.description}</p>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Link href="/dashboard/">
                    <Button className="bg-primary transition-all duration-200">
                      Ver seguimiento completo
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
