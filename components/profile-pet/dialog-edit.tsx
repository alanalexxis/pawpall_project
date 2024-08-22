import { createClient } from "@/utils/supabase/client";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { es } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { Edit, Plus } from "lucide-react";
import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { SearchBarPets } from "./search";
import Dropzone from "./dropzone";
import { Tag, TagInput } from "emblor";
import { Textarea } from "../ui/textarea";
import { useUser } from "@/contexts/userContext";
import { z } from "zod";
import { toast } from "../ui/use-toast";

// Define el esquema de validación con Zod
const petSchema = z.object({
  petName: z.string().min(1, "El nombre de la mascota es obligatorio"),
  isOwner: z.boolean(),
  description: z.string().min(1, "Introduce una descripción de tu mascota"),
  ownerName: z
    .string()
    .optional()
    .refine(
      (value) => !value || value.trim().length > 0,
      "El nombre del dueño es obligatorio si no eres el dueño"
    ),
  date: z.date().optional(),
  gender: z.enum(["Male", "Female"], {
    required_error: "Género es obligatorio",
  }), // Agrega validación para el género
  razaId: z.string().optional(), // Agrega validación para el ID de la raza
  tags: z.array(z.object({ id: z.string(), text: z.string() })).optional(), // Asegúrate de que 'tags' esté definido aquí
});

export function DialogEdit({ pet }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const supabase = createClient();
  const { user } = useUser();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isOwner, setIsOwner] = useState(true); // Estado para saber si el usuario es el dueño
  const [ownerName, setOwnerName] = useState(""); // Estado para el nombre del dueño
  const [description, setDescription] = useState(""); // Estado para el nombre del dueño
  const [tags, setTags] = useState<Tag[]>([]);
  const [activeTagIndex, setActiveTagIndex] = useState<number | null>(null);
  const [selectedRazaId, setSelectedRazaId] = useState<string | null>(null);
  const [gender, setGender] = useState(""); // Valor predeterminado "male" o "female"
  const [petName, setPetName] = useState(""); // Estado para el nombre de la mascota
  const [imagePath, setImagePath] = useState<string | null>(null);

  useEffect(() => {
    if (pet) {
      setPetName(pet.name);
      setIsOwner(pet.isOwner);
      setOwnerName(pet.owner_name || "");
      setDate(pet.birthdate ? new Date(pet.birthdate) : undefined);
      setGender(pet.gender);
      setDescription(pet.description);
      setSelectedRazaId(pet.breed_id);
      setTags(pet.tags || []);
      setImagePath(pet.image_url || null);
    }
  }, [pet]);

  const handleFileUpload = async (filePath: string) => {
    setImagePath(filePath);
  };
  const handleSubmit = async () => {
    if (!pet) {
      console.error("No se ha proporcionado una mascota para editar.");
      return;
    }

    const result = petSchema.safeParse({
      petName,
      isOwner,
      ownerName,
      date,
      gender,
      description,
      razaId: selectedRazaId,
      profile_id: user.id,
      tags: tagsJson,
    });

    if (!result.success) {
      const errors = result.error.format();
      alert(`Error: ${JSON.stringify(errors)}`);
      return;
    }

    const { data, error } = await supabase
      .from("pets")
      .update({
        name: result.data.petName,
        owner_name: result.data.ownerName,
        birthdate: result.data.date,
        gender: result.data.gender,
        description: result.data.description,
        breed_id: result.data.razaId,
        profile_id: user.id,
        tags: result.data.tags,
        image_url: imagePath,
      })
      .eq("id", pet.id);

    if (error) {
      console.error("Error al actualizar mascota:", error);
      alert("Hubo un problema al actualizar la mascota.");
    } else {
      toast({
        title: "¡Éxito!",
        description: "Información actualizada con éxito.",
      });
      setIsDialogOpen(false);
    }
  };
  // Convert the tags to a JSON structure
  const tagsJson = tags.map((tag) => ({ id: tag.id, text: tag.text }));

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger
        asChild
        className="bg-primary transition-all duration-200 shadow-lg hover:shadow-xl"
      >
        <button className="absolute top-2 right-2 p-2 rounded-full bg-white shadow-lg hover:bg-gray-200">
          <Edit className="h-4 w-4 text-gray-600" />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar mascota</DialogTitle>
          <DialogDescription>
            Edita la información de tu mascota a continuación.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre de la mascota</Label>
              <Input
                id="name"
                placeholder="Ingrese un nombre"
                value={petName}
                onChange={(e) => setPetName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="owner">¿Eres el dueño?</Label>
              <RadioGroup
                name="isOwner"
                onValueChange={(value) => setIsOwner(value === "true")}
                value={isOwner ? "true" : "false"}
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="true" id="owner-yes" />
                  <Label htmlFor="owner-yes">Sí</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="false" id="owner-no" />
                  <Label htmlFor="owner-no">No</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
          {!isOwner && (
            <div className="space-y-2">
              <Label htmlFor="ownerName">Nombre del dueño</Label>
              <Input
                id="ownerName"
                placeholder="Ingrese el nombre del dueño"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
              />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="dob">Fecha de nacimiento</Label>
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="pl-3 text-left font-normal text-muted-foreground ml-1"
                >
                  {date ? (
                    format(date, "PPP", { locale: es })
                  ) : (
                    <span>Selecciona una fecha</span>
                  )}
                  <CalendarDaysIcon className="ml-2 h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  disabled={(day) => day > new Date()}
                  locale={es}
                  mode="single"
                  captionLayout="dropdown-buttons"
                  selected={date}
                  onSelect={(e) => {
                    setDate(e);
                    setIsCalendarOpen(false);
                  }}
                  fromYear={1999}
                  toYear={2024}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="space-y-2">
            <Label>Género de la mascota</Label>
            <RadioGroup
              name="gender"
              value={gender}
              onValueChange={(value) => setGender(value)}
              className="flex items-center gap-4"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="Male" id="male" />
                <Label htmlFor="Male">Macho</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="Female" id="female" />
                <Label htmlFor="Female">Hembra</Label>
              </div>
            </RadioGroup>
          </div>
          <div className="space-y-2">
            <SearchBarPets
              onRazaSelect={(razaId) => setSelectedRazaId(razaId)}
            />{" "}
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Detalla a tu mascota</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Añade una descripcion de tu mascota."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Añade tags a tu mascota</Label>
            <TagInput
              placeholder="Añade una etiqueta"
              tags={tags}
              setTags={(newTags) => {
                setTags(newTags);
              }}
              activeTagIndex={activeTagIndex}
              setActiveTagIndex={setActiveTagIndex}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Foto de la mascota</Label>
            <Dropzone onFileUpload={handleFileUpload} />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" onClick={handleSubmit}>
            Editar mascota
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function CalendarDaysIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
      <path d="M8 14h.01" />
      <path d="M12 14h.01" />
      <path d="M16 14h.01" />
      <path d="M8 18h.01" />
      <path d="M12 18h.01" />
      <path d="M16 18h.01" />
    </svg>
  );
}
