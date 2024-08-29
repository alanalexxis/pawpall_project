import React, { useState, useEffect } from "react";
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
import { Edit, Trash } from "lucide-react";

export const DialogNutritionEdit = ({
  feedingLogs,
  setFeedingLogs,
  editLog,
  setEditLog,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [foodAmount, setFoodAmount] = useState(0);
  const [foodType, setFoodType] = useState("");
  const supabase = createClient();
  const { selectedPet } = useSelectedPet();

  useEffect(() => {
    if (editLog) {
      setFoodAmount(editLog.amount);
      setFoodType(editLog.type);
      setIsDialogOpen(true);
    }
  }, [editLog]);

  const handleSubmit = async () => {
    if (!selectedPet || !editLog) {
      console.error(
        "No se ha proporcionado un ID de mascota o registro para editar."
      );
      return;
    }

    const { data, error } = await supabase
      .from("pet_nutrition")
      .update({
        food_amount: foodAmount,
        food_type: foodType,
      })
      .eq("id", editLog.id);

    if (error) {
      console.error("Error al editar el registro:", error);
      toast({
        variant: "destructive",
        title: "¡Ups! Algo salió mal.",
        description: "Hubo un problema al actualizar el registro.",
      });
    } else {
      // Fetch actualizado después de editar
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
        const formattedLogs = updatedLogs.map((log) => ({
          id: log.id,
          time: new Date(log.created_at), // Convierte la cadena a un objeto Date
          amount: log.food_amount,
          type: log.food_type,
        }));

        setFeedingLogs(formattedLogs);
        setFoodAmount(0);
        setFoodType("");
        setIsDialogOpen(false);
        setEditLog(null); // Limpia el registro a editar
        toast({
          title: "¡Éxito!",
          description: "Registro actualizado con éxito.",
        });
      }
    }
  };

  const handleDialogClose = (open) => {
    if (!open) {
      setEditLog(null); // Limpia el registro si el diálogo se cierra sin guardar
    }
    setIsDialogOpen(open);
  };

  return (
    <div>
      <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
        <DialogTrigger asChild></DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar registro de comida</DialogTitle>
            <DialogDescription>
              Modifica la cantidad y el tipo de comida que diste a tu perro.
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
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleSubmit}>
              Guardar cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
