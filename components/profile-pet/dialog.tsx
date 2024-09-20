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
import { Plus } from "lucide-react";
import React, { useState } from "react";
import { format } from "date-fns";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { SearchBarPets } from "./search";
import Dropzone from "./dropzone";
import { Tag, TagInput } from "emblor";
import { Textarea } from "../ui/textarea";
import { useUser } from "@/contexts/userContext";
import { z } from "zod";
import { toast } from "../ui/use-toast";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

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
  weight: z.number().min(0, "El peso debe ser un número positivo"), // Agrega validación para el peso
});
export function DialogDemo({ onPetAdded, isPremium }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const supabase = createClient();
  const { user } = useUser();
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isOwner, setIsOwner] = useState(true); // Estado para saber si el usuario es el dueño
  const [ownerName, setOwnerName] = useState(""); // Estado para el nombre del dueño
  const [description, setDescription] = useState(""); // Estado para el nombre del dueño
  const [tags, setTags] = React.useState<Tag[]>([]);
  const [activeTagIndex, setActiveTagIndex] = React.useState<number | null>(
    null
  );
  const [selectedRazaId, setSelectedRazaId] = useState<string | null>(null);
  const [gender, setGender] = useState(""); // Valor predeterminado "male" o "female"
  const [petName, setPetName] = useState("");
  const [petWeight, setPetWeight] = useState(0); // Estado para el nombre de la mascota
  const [imagePath, setImagePath] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<string | null>(null);
  const handleFileUpload = async (filePath: string) => {
    setImagePath(filePath);
  };

  const handleSubmit = async () => {
    const result = petSchema.safeParse({
      petName,
      isOwner,
      ownerName,
      date,
      gender,
      description,
      razaId: selectedRazaId, // Incluye el ID de la raza seleccionada
      profile_id: user.id, // Incluye el ID del usuario
      tags: tagsJson, // Include tags in the data
      weight: petWeight, // Incluye el peso aquí
    });

    if (!result.success) {
      // Muestra los errores al usuario
      const firstError = result.error.errors[0].message;
      setError(firstError);
      return;
    }

    const { data, error } = await supabase.from("pets").insert([
      {
        name: result.data.petName,
        owner_name: result.data.ownerName,
        birthdate: result.data.date,
        gender: result.data.gender, // Agrega el género en la inserción
        description: result.data.description,
        breed_id: result.data.razaId, // Agrega el ID de la raza en la inserción
        profile_id: user.id, // Incluye el ID del usuario
        tags: result.data.tags, // Insert the tags JSON directly
        image_url: imagePath, // Usa la ruta de la imagen subida
        weight: result.data.weight, // Agrega el peso en la inserción
      },
    ]);

    if (error) {
      toast({
        variant: "destructive",
        title: "¡Ups! Algo salió mal.",
        description: "Hubo un problema con tu solicitud.",
      });
    } else {
      toast({
        title: "¡Éxito!",
        description: "Información guardada con éxito.",
      });
      onPetAdded(); // Notificar que se ha agregado una nueva mascota
      setPetName(""); // Limpiar el estado después de la inserción
      setDate(undefined); // Limpiar la fecha después de la inserción
      setSelectedRazaId(null); // Limpiar la selección de raza después de la inserción
      setGender(""); // Limpiar el género después de la inserción
      setTags([]);
      setImagePath(null); // Limpiar la ruta de la imagen después de la inserción
      setDescription(""); // Limpiar la descripción después de la inserción
      setIsDialogOpen(false); // Cierra el diálogo después de mostrar el toast
      setIsOwner(true);
      setPetWeight(0);
    }
  };

  const handleOpenChange = async (open) => {
    if (!isPremium && open) {
      const { data: pets, error } = await supabase
        .from("pets")
        .select("*")
        .eq("profile_id", user.id);

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudo verificar el número de mascotas.",
        });
        return;
      }

      if (pets.length >= 1) {
        toast({
          variant: "destructive",
          title: "Adquiere premium",
          description:
            "Solo puedes añadir una mascota si no eres usuario premium.",
        });
        return;
      }
    }
    setIsDialogOpen(open);
  };
  // Convert the tags to a JSON structure
  const tagsJson = tags.map((tag) => ({ id: tag.id, text: tag.text }));

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger
        asChild
        className="bg-primary transition-all duration-200 shadow-lg hover:shadow-xl"
      >
        <Button variant="outline">
          <Plus className="h-5 w-5 mr-2" />
          Añadir mascota
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Añadir mascota</DialogTitle>
          <DialogDescription>
            Añade la información de tu mascota a continuación.
          </DialogDescription>
        </DialogHeader>
        {error && (
          <Alert variant="destructive">
            <ExclamationTriangleIcon className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

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
                defaultValue="true"
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
            <Label htmlFor="weight">Peso de la mascota</Label>
            <Input
              id="weight"
              type="number"
              placeholder="Ingrese un peso"
              value={petWeight}
              onChange={(e) => {
                // Convierte el valor de entrada a número antes de actualizar el estado
                const value = parseFloat(e.target.value);
                if (!isNaN(value)) {
                  setPetWeight(value);
                }
              }}
              min="0" // Opcional: Asegura que el valor sea un número positivo
              step="0.1" // Opcional: Permite valores decimales
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
            Agregar mascota
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
