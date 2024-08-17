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
export function DialogDemo() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  return (
    <Dialog defaultOpen>
      <DialogTrigger
        asChild
        className="bg-primary  transition-all duration-200 shadow-lg hover:shadow-xl"
      >
        <Button variant="outline">
          <Plus className="h-5 w-5 mr-2" />
          Añadir mascota
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="">Añadir mascota</DialogTitle>
          <DialogDescription>
            Añade la información de tu mascota a continuación.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre de la mascota</Label>
              <Input id="name" placeholder="Ingrese un nombre" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="owner">Nombre del dueño</Label>
              <Input id="owner" placeholder="Ingrese un nombre" />
            </div>
          </div>
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
                    <span>Pick a date</span>
                  )}
                  <CalendarDaysIcon className="ml-2 h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  locale={es}
                  className="pointer-events-auto "
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
            <RadioGroup name="gender" className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <RadioGroupItem value="male" id="male" />
                <Label htmlFor="male">Macho</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="female" id="female" />
                <Label htmlFor="female">Hembra</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Create Project</Button>
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
