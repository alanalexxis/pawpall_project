import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Textarea } from "@/components/ui/textarea";

import { UserPlus, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PhoneInput } from "../phone-input";

import * as React from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../ui/tooltip";

type Guest = {
  email: string;
};

export function FormPanel() {
  const router = useRouter();

  const [guests, setGuests] = React.useState<Guest[]>([]);

  const addGuest = () => {
    setGuests([...guests, { email: "" }]);
  };

  const removeGuest = (index: number) => {
    setGuests(guests.filter((_, i) => i !== index));
  };

  const handleChange = (index: number, email: string) => {
    setGuests(guests.map((guest, i) => (i === index ? { email } : guest)));
  };

  const hasGuests = guests.length > 0;

  return (
    <form className="flex flex-col gap-5 w-[360px]">
      <div className="flex flex-col space-y-1.5">
        <Label htmlFor="name">Tu nombre *</Label>
        <Input id="name" defaultValue="Introduce tu nombre" />
      </div>
      <div className="flex flex-col space-y-1.5">
        <Label htmlFor="email">Email *</Label>
        <Input id="email" type="email" defaultValue="Introduce tu email" />
      </div>
      <div className="flex flex-col space-y-1.5">
        <Label htmlFor="phone">Número de teléfono *</Label>
        <PhoneInput id="phone" />
      </div>
      <div className="flex flex-col space-y-1.5">
        <Label htmlFor="email">Notas adicionales</Label>
        <Textarea
          id="notes"
          placeholder="Añade cualquier detalle adicional de relevancia para la cita veterinaria"
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
          variant="ghost"
          onClick={() => {
            router.back();
          }}
        >
          Regresar
        </Button>
        <Button asChild type="button">
          <Link href="https://github.com/damianricobelli/shadcn-cal-com">
            Continuar
          </Link>
        </Button>
      </div>
    </form>
  );
}
