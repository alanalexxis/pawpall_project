import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserPlus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../ui/tooltip";
import { useUser } from "@/contexts/userContext";
import { useSelectedPet } from "@/contexts/selectedPetContext";
import { createClient } from "@/utils/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { getLocalTimeZone } from "@internationalized/date";

type FormPanelProps = {
  selectedDate: CalendarDate;
  selectedTime: string; // Añade el tiempo seleccionado como prop
  onClose: () => void; // Añade prop para manejar el cierre
};

export function FormPanel({
  selectedDate,
  selectedTime,
  onClose,
}: FormPanelProps) {
  const router = useRouter();
  const [guests, setGuests] = React.useState<Guest[]>([]);
  const [appointmentReason, setAppointmentReason] = React.useState<string>("");
  const [notes, setNotes] = React.useState<string>("");

  const supabase = createClient();
  const { user } = useUser();
  const { selectedPet } = useSelectedPet();

  const addGuest = () => {
    setGuests([...guests, { email: "" }]);
  };

  const removeGuest = (index: number) => {
    setGuests(guests.filter((_, i) => i !== index));
  };

  const handleChange = (index: number, email: string) => {
    setGuests(guests.map((guest, i) => (i === index ? { email } : guest)));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase.from("appointments").insert({
      pet_id: selectedPet.id,
      date: selectedDate.toDate(getLocalTimeZone()).toISOString(),
      hour: selectedTime,
      note: notes,
      reason: appointmentReason,
      profile_id: user?.id,
      status: 1,
    });

    if (error) {
      console.error("Error al crear la cita:", error.message);
      toast({
        title: "Error",
        description: "No se pudo guardar la información.",
      });
    } else {
      toast({
        title: "¡Éxito!",
        description: "Información guardada con éxito.",
      });

      // Remover los parámetros `date` y `slot` de la URL
      const url = new URL(window.location.href);
      url.searchParams.delete("date");
      url.searchParams.delete("slot");
      router.replace(url.toString());

      onClose(); // Cierra el modal si la cita se guarda correctamente
    }
  };

  const hasGuests = guests.length > 0;

  return (
    <form className="flex flex-col gap-5 w-[360px]" onSubmit={handleFormSubmit}>
      <div className="flex flex-col space-y-1.5">
        <Label htmlFor="name">Tu nombre *</Label>
        <Input id="name" value={user?.full_name || ""} disabled />
      </div>
      <div className="flex flex-col space-y-1.5">
        <Label htmlFor="email">Email *</Label>
        <Input id="email" type="email" value={user?.email || ""} disabled />
      </div>
      <div className="flex flex-col space-y-1.5">
        <Label htmlFor="phone">Número de teléfono *</Label>
        <Input
          id="cellphone"
          type="tel"
          value={user?.cellphone || ""}
          disabled
        />
      </div>
      <div className="flex flex-col space-y-1.5">
        <Label htmlFor="reason">Motivo de la cita *</Label>
        <Select value={appointmentReason} onValueChange={setAppointmentReason}>
          <SelectTrigger className="w-fit">
            <SelectValue placeholder="Selecciona un motivo" />
          </SelectTrigger>
          <SelectContent className="w-fit dark:bg-gray-5">
            <SelectItem value="consulta">Consulta</SelectItem>
            <SelectItem value="vacunas">Vacunas</SelectItem>
            <SelectItem value="examen">Examen</SelectItem>
            <SelectItem value="cirugia">Cirugía</SelectItem>
            <SelectItem value="otro">Otro</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col space-y-1.5">
        <Label htmlFor="notes">Notas adicionales</Label>
        <Textarea
          id="notes"
          placeholder="Añade cualquier detalle adicional de relevancia para la cita veterinaria"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>
      {hasGuests && (
        <>
          <Label htmlFor="email">Añadir contacto</Label>
          <div className="flex flex-col gap-1">
            {guests.map((guest, index) => (
              <div key={index} className="flex items-center space-x-2 relative">
                <Input
                  id="guest"
                  type="email"
                  placeholder="Email"
                  value={guest.email}
                  onChange={(e) => handleChange(index, e.target.value)}
                />
                <Tooltip>
                  <TooltipTrigger asChild>
                    <X
                      className="cursor-pointer absolute right-2 top-1/2 transform -translate-y-1/2 size-4"
                      onClick={() => removeGuest(index)}
                    />
                  </TooltipTrigger>
                  <TooltipContent>Eliminar email</TooltipContent>
                </Tooltip>
              </div>
            ))}
          </div>
        </>
      )}
      <Button
        type="button"
        variant="ghost"
        onClick={() => addGuest()}
        className="w-fit"
      >
        <UserPlus className="mr-2 size-4" />
        Añadir contacto
      </Button>
      <p className="text-gray-11 text-xs my-4">
        Al continuar, reconoces que tu cita está sujeta a disponibilidad.
      </p>
      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="ghost"
          onClick={() => {
            router.back();
          }}
        >
          Regresar
        </Button>
        <Button type="submit">Continuar</Button>
      </div>
    </form>
  );
}
