import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { createClient } from "@/utils/supabase/client";
import { useSelectedPet } from "@/contexts/selectedPetContext";
import { toast } from "../ui/use-toast";

export const DialogNutrition = ({ feedingLogs, setFeedingLogs }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [foodAmount, setFoodAmount] = useState(0);
  const [foodType, setFoodType] = useState("");
  const supabase = createClient();
  const { selectedPet } = useSelectedPet(); // Obtiene la mascota seleccionada del contexto

  const handleSubmit = async () => {
    if (!selectedPet) {
      console.error("No se ha proporcionado un ID de mascota.");
      return;
    }

    const { data, error } = await supabase.from("pet_nutrition").insert([
      {
        pet_id: selectedPet.id,
        food_amount: foodAmount,
        food_type: foodType,
        created_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      console.error("Error al registrar la alimentación:", error);
      alert("Hubo un error al registrar la alimentación.");
    } else {
      // Fetch actualizado después de insertar
      const { data: updatedLogs, error: fetchError } = await supabase
        .from("pet_nutrition")
        .select("*")
        .eq("pet_id", selectedPet.id)
        .order("created_at", { ascending: false });

      if (fetchError) {
        toast({
          variant: "destructive",
          title: "¡Ups! Algo salió mal.",
          description: "Hubo un problema con tu solicitud.",
        });
      } else {
        // Formatear los registros para el componente
        const formattedLogs = updatedLogs.map((log) => ({
          id: log.id,
          time: new Date(log.created_at), // Convierte la cadena a un objeto Date
          amount: log.food_amount,
          type: log.food_type,
        }));

        setFeedingLogs(formattedLogs);
        setFoodAmount(0);
        setFoodType("");
        setIsDialogOpen(false); // Cierra el diálogo después de mostrar el toast
        toast({
          title: "¡Éxito!",
          description: "Información guardada con éxito.",
        });
      }
    }
  };

  return (
    <div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">Añadir comida</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Registrar comida</DialogTitle>
            <DialogDescription>
              Registra la cantidad, tipo de comida y momento del día en que se
              la diste a tu perro.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="foodAmount">Cantidad de comida (g)</Label>
              <Input
                type="number"
                id="foodAmount"
                value={foodAmount}
                onChange={(e) => setFoodAmount(parseInt(e.target.value))}
              />
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="foodType">Tipo de comida</Label>
              <Select value={foodType} onValueChange={setFoodType}>
                <SelectTrigger id="foodType">
                  <SelectValue placeholder="Selecciona un tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Tipo de alimentación</SelectLabel>
                    <SelectItem value="Seca">Seca</SelectItem>
                    <SelectItem value="Húmeda">Húmeda</SelectItem>
                    <SelectItem value="Semi-Húmeda">Semi-Húmeda</SelectItem>
                    <SelectItem value="Natural">Natural</SelectItem>
                    <SelectItem value="Carne">Carne</SelectItem>
                    <SelectItem value="Pescado">Pescado</SelectItem>
                    <SelectItem value="Pollo">Pollo</SelectItem>
                    <SelectItem value="Grano">Grano</SelectItem>
                    <SelectItem value="Vegetal">Vegetal</SelectItem>
                    <SelectItem value="Fruta">Fruta</SelectItem>
                    <SelectItem value="Suplemento">Suplemento</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleSubmit}>
              Registrar comida
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
