"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CheckIcon } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";

export default function CompletedWalkDialog({ walkId, fetchScheduledWalks }) {
  const supabase = createClient();
  const [isOpen, setIsOpen] = useState(false);
  const [newCompletedWalk, setNewCompletedWalk] = useState({
    date: "",
    distance: "",
    mood: "",
    notes: "",
  });

  const handleCompletedWalkInputChange = (e) => {
    const { name, value } = e.target;
    setNewCompletedWalk((prev) => ({ ...prev, [name]: value }));
  };

  const handleCompletedWalkSelectChange = (name, value) => {
    setNewCompletedWalk((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const fetchWalkDetails = async () => {
      if (walkId) {
        const { data, error } = await supabase
          .from("walks")
          .select("day, distance")
          .eq("id", walkId)
          .single();

        if (error) {
          console.error("Error fetching walk details:", error);
        } else {
          setNewCompletedWalk((prev) => ({
            ...prev,
            date: data.day,
            distance: data.distance,
          }));
        }
      }
    };

    fetchWalkDetails();
  }, [walkId]);

  const formattedDate = new Date(newCompletedWalk.date)
    .toLocaleString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
    .toLowerCase();

  const addCompletedWalk = async (e) => {
    e.preventDefault();

    // Validation to ensure 'notes' and 'mood' are not null or empty
    if (!newCompletedWalk.mood) {
      toast({
        title: "Error",
        description: "Por favor selecciona el estado de ánimo del perro.",
        variant: "destructive",
      });
      return;
    }

    if (!newCompletedWalk.notes.trim()) {
      toast({
        title: "Error",
        description: "Por favor ingresa algunas notas adicionales.",
        variant: "destructive",
      });
      return;
    }

    // Update the walk in the database
    const { error } = await supabase
      .from("walks")
      .update({
        notes: newCompletedWalk.notes,
        mood: parseInt(newCompletedWalk.mood, 10), // Convert mood to integer
        completed: 3,
      })
      .eq("id", walkId);

    if (error) {
      console.error("Error updating walk:", error);
    } else {
      toast({
        title: "¡Éxito!",
        description: "Información registrada con éxito.",
      });
      // Clear the form fields
      setNewCompletedWalk({
        date: "",
        distance: "",
        mood: "",
        notes: "",
      });
      setIsOpen(false); // Close the dialog after submission
      fetchScheduledWalks();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          className="text-green-600 hover:text-green-700 hover:bg-green-50"
        >
          <CheckIcon className="h-4 w-4 mr-2" />
          Aceptar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Registrar paseo completado</DialogTitle>
          <DialogDescription>
            Ingresa los detalles del paseo realizado
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={addCompletedWalk} className="space-y-4 mt-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Fecha y hora</Label>
              <Input
                type="text"
                id="date"
                name="date"
                value={formattedDate}
                onChange={handleCompletedWalkInputChange}
                disabled
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="distance">Distancia (km)</Label>
              <Input
                type="text"
                id="distance"
                name="distance"
                value={newCompletedWalk.distance}
                onChange={handleCompletedWalkInputChange}
                step="0.1"
                min="0"
                disabled
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="mood">Estado de ánimo del perro</Label>
            <Select
              name="mood"
              onValueChange={(value) =>
                handleCompletedWalkSelectChange("mood", value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona el estado de ánimo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Feliz</SelectItem>
                <SelectItem value="2">Neutral</SelectItem>
                <SelectItem value="3">Triste</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notas adicionales</Label>
            <Textarea
              id="notes"
              name="notes"
              value={newCompletedWalk.notes}
              onChange={handleCompletedWalkInputChange}
              placeholder="Observaciones, incidentes, etc."
            />
          </div>
        </form>
        <DialogFooter className="mt-4">
          <Button onClick={addCompletedWalk}>Registrar paseo</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
