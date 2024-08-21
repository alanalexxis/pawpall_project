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
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
export default function ProfilePet() {
  const supabase = createClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPet, setSelectedPet] = useState(null);
  const [pets, setPets] = useState([]);

  useEffect(() => {
    async function fetchPets() {
      const { data, error } = await supabase.from("pets").select("*");

      if (error) {
        console.error("Error fetching pets:", error);
        return;
      }

      const petsWithImages = data.map((pet) => {
        const { data: imageUrlData } = supabase.storage
          .from("image_upload")
          .getPublicUrl(pet.image_url);

        return { ...pet, image_url: imageUrlData.publicUrl };
      });

      setPets(petsWithImages);
    }

    fetchPets();
  }, []);

  const filteredPets = pets.filter(
    (pet) =>
      pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pet.owner.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const { data } = supabase.storage
    .from("image_upload")
    .getPublicUrl("folder/avatar1.png");
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
            <DialogDemo />
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
                onClick={() => setSelectedPet(pet)}
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
                </div>
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage
                        src={`https://api.dicebear.com/6.x/initials/svg?seed=${pet.owner}`}
                        alt={pet.owner}
                      />
                      <AvatarFallback>{pet.owner_name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-gray-700">{pet.owner}</p>
                      <p className="text-sm text-gray-500">{pet.location}</p>
                    </div>
                  </div>
                  <dl className="grid grid-cols-2 gap-4 text-sm mb-4">
                    <div className="flex items-center">
                      <Heart className="h-4 w-4 text-pink-500 mr-2" />
                      <div>
                        <dt className="sr-only">Type and Breed</dt>
                        <dd>
                          {pet.type} - {pet.breed}
                        </dd>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-blue-500 mr-2" />
                      <div>
                        <dt className="sr-only">Age</dt>
                        <dd>{pet.age} years old</dd>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 text-green-500 mr-2" />
                      <div>
                        <dt className="sr-only">Next Appointment</dt>
                        <dd>Next visit: {pet.nextAppointment}</dd>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Activity className="h-4 w-4 text-yellow-500 mr-2" />
                      <div>
                        <dt className="sr-only">Health Status</dt>
                        <dd>Salud: {pet.health}</dd>
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
                  src={selectedPet.image}
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
                  {selectedPet.breed} • {selectedPet.age} years old
                </p>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <h3 className="font-semibold text-gray-700">Owner</h3>
                    <p>{selectedPet.owner}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-700">Location</h3>
                    <p>{selectedPet.location}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-700">
                      Next Appointment
                    </h3>
                    <p>{selectedPet.nextAppointment}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-700">
                      Health Status
                    </h3>
                    <p>{selectedPet.health}</p>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white transition-all duration-200">
                    View Full Profile
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
