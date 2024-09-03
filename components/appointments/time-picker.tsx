import React from "react";
import { Clock } from "lucide-react";
import { Label } from "@/components/ui/label";
import { TimePickerInput } from "../ui/time-picker-input";

interface TimePickerDemoProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
}

export function TimePickerDemo({ date, setDate }: TimePickerDemoProps) {
  const minuteRef = React.useRef<HTMLInputElement>(null);
  const hourRef = React.useRef<HTMLInputElement>(null);

  const handleTimeChange = (hours: number, minutes: number) => {
    const newDate = date ? new Date(date) : new Date(); // Usa la fecha existente si está definida
    newDate.setHours(hours);
    newDate.setMinutes(minutes);
    newDate.setSeconds(0, 0); // Establece los segundos y milisegundos a 0

    setDate(newDate);
  };

  return (
    <div className="flex items-end gap-2">
      <div className="grid gap-1 text-center">
        <Label htmlFor="hours" className="text-xs">
          Horas
        </Label>
        <TimePickerInput
          picker="hours"
          date={date}
          setDate={(newDate) => {
            handleTimeChange(newDate?.getHours() || 0, date?.getMinutes() || 0);
          }}
          ref={hourRef}
          onRightFocus={() => minuteRef.current?.focus()}
        />
      </div>
      <div className="grid gap-1 text-center">
        <Label htmlFor="minutes" className="text-xs">
          Minutos
        </Label>
        <TimePickerInput
          picker="minutes"
          date={date}
          setDate={(newDate) => {
            handleTimeChange(date?.getHours() || 0, newDate?.getMinutes() || 0);
          }}
          ref={minuteRef}
          onLeftFocus={() => hourRef.current?.focus()}
        />
      </div>

      <div className="flex h-10 items-center">
        <Clock className="ml-2 h-4 w-4" />
      </div>
    </div>
  );
}
