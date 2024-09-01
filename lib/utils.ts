import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
// utils.ts
export interface SleepEntry {
  id: number;
  duration: string;
  date: Date;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateScale({
  name,
  isOverlay = false,
}: {
  name: string;
  isOverlay?: boolean;
}) {
  const scale = Array.from({ length: 12 }, (_, i) => {
    const id = i + 1;
    if (isOverlay) {
      return [[`a${id}`, `var(--${name}-a${id})`]];
    }
    return [
      [id, `var(--${name}-${id})`],
      [`a${id}`, `var(--${name}-a${id})`],
    ];
  }).flat();

  return Object.fromEntries(scale);
}
export const calculateSleepByDayOfWeek = (logs: SleepEntry[]) => {
  const sleepByDay = {
    Mon: 0,
    Tue: 0,
    Wed: 0,
    Thu: 0,
    Fri: 0,
    Sat: 0,
    Sun: 0,
  };

  logs.forEach((entry) => {
    const dayOfWeek = entry.date.toLocaleDateString("en-US", {
      weekday: "short",
    });

    const [hours, minutes] = entry.duration.split(":").map(Number);
    const totalMinutes =
      (isNaN(hours) ? 0 : hours * 60) + (isNaN(minutes) ? 0 : minutes);

    if (dayOfWeek in sleepByDay) {
      sleepByDay[dayOfWeek] += totalMinutes / 60; // Convertir minutos a horas
    }
  });

  return sleepByDay;
};
