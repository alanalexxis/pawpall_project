"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Bell,
  Dog,
  Moon,
  Sun,
  AlertTriangle,
  Clock,
  Calendar,
} from "lucide-react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useSelectedPet } from "@/contexts/selectedPetContext";
import { motion } from "framer-motion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "../ui/use-toast";
import { TimePickerDemo } from "../appointments/time-picker";
import React from "react";
import { Badge } from "../ui/badge";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
interface SleepEntry {
  id: number;
  duration: string;
  timestamp: string;
}

export default function Sleep() {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [sleepLog, setSleepLog] = useState<SleepEntry[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (date) {
      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");
      const duration = `${hours}:${minutes}`;
      const newEntry: SleepEntry = {
        id: Date.now(),
        duration: duration,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true, // Usa el formato de 12 horas con AM/PM
        }),
      };

      setSleepLog((prevLog) => [newEntry, ...prevLog]);
      setDate(undefined);

      toast({
        title: "Sueño registrado",
        description: `Tu perro durmió durante ${hours} horas y ${minutes} minutos.`,
      });
    } else {
      toast({
        title: "Error",
        description: "Por favor, selecciona la duración del sueño.",
        variant: "destructive",
      });
    }
  };
  const { selectedPet } = useSelectedPet();

  const chartData = {
    labels: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
    datasets: [
      {
        label: "Horas de sueño",
        data: [8, 7.5, 9, 8.5, 7, 10, 9.5],
        backgroundColor: "rgba(34, 197, 94, 0.5)", // Tailwind green-500 with opacity
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Patrón de sueño semanal",
      },
    },
  };
  const getAgeInYears = (birthDate: Date) => {
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      return age - 1;
    }
    return age;
  };

  const getRecommendedNaps = (age: number) => {
    if (age < 1) {
      return "6-10 siestas de 30 minutos a 2 horas ";
    } else if (age < 7) {
      return "3-5 siestas, desde unos minutos hasta un par de horas";
    } else {
      return "4-6 siestas";
    }
  };

  const getRecommendedSleep = (age: number) => {
    if (age < 1) {
      return { range: "18-20 horas", nightly: "10-12 horas" };
    } else if (age < 7) {
      return { range: "12-14 horas", nightly: "8-10 horas" };
    } else {
      return { range: "14-18 horas", nightly: "10-12 horas" };
    }
  };
  const age = selectedPet ? getAgeInYears(new Date(selectedPet.birthdate)) : 0;
  const recommendedNaps = getRecommendedNaps(age);
  const { range: recommendedSleep, nightly: nightlySleep } =
    getRecommendedSleep(age);

  useEffect(() => {
    // Inicializa la fecha seleccionada en la fecha de hoy
    const today = new Date();
    setSelectedDate(today);
  }, []);

  // Formatear la fecha seleccionada
  const formattedDate = selectedDate.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const calculateTotalSleep = (logs: SleepEntry[]) => {
    let totalMinutes = 0;

    logs.forEach((entry) => {
      const [hours, minutes] = entry.duration.split(":").map(Number);
      totalMinutes += hours * 60 + minutes;
    });

    const totalHours = Math.floor(totalMinutes / 60);
    const remainingMinutes = totalMinutes % 60;

    return { totalHours, remainingMinutes };
  };
  const { totalHours, remainingMinutes } = calculateTotalSleep(sleepLog);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-4xl mx-auto mb-8">
          <CardHeader className="bg-primary text-primary-foreground">
            <CardTitle className="text-2xl flex items-center gap-2">
              <Dog className="w-8 h-8" />
              {selectedPet
                ? `Monitoreo de sueño de ${selectedPet.name}`
                : "Monitoreo de sueño"}
            </CardTitle>
            <CardDescription className="text-primary-foreground/80">
              Mantén a tu perro descansado y lleno de energía.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {selectedPet ? (
              <div className="space-y-6">
                <div className="mb-4">
                  <h2 className="text-2xl font-bold text-foreground">
                    Resumen de sueño
                  </h2>
                  <p className="text-muted-foreground">
                    Estadísticas generales del sueño de tu perro
                  </p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {[
                    {
                      label: "Promedio de horas de sueño",
                      value: "8.5",
                      icon: Moon,
                      color: "text-blue-500",
                    },
                    {
                      label: "Calidad del sueño",
                      value: "95%",
                      icon: Sun,
                      color: "text-green-500",
                    },
                    {
                      label: "Siestas por día",
                      value: "3",
                      icon: Dog,
                      color: "text-purple-500",
                    },
                    {
                      label: "Hora promedio de dormir",
                      value: "22:15",
                      icon: Bell,
                      color: "text-orange-500",
                    },
                  ].map((item, index) => (
                    <Card key={index} className="p-4 text-center">
                      <item.icon
                        className={`w-8 h-8 mx-auto mb-2 ${item.color}`}
                      />
                      <p className={`text-2xl font-bold ${item.color}`}>
                        {item.value}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {item.label}
                      </p>
                    </Card>
                  ))}
                </div>
                <div className="mt-6  ">
                  <div className="mb-4">
                    <h2 className="text-xl font-bold text-foreground">
                      Recomendaciones de sueño
                    </h2>
                  </div>
                  <div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-3">
                        <Clock className="w-6 h-6 text-primary" />
                        <div>
                          <p className="font-semibold">
                            Horas de sueño recomendadas:
                          </p>
                          <p className="text-muted-foreground">
                            {recommendedSleep} al día
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Calendar className="w-6 h-6 text-primary" />
                        <div>
                          <p className="font-semibold">
                            Siestas al día recomendadas:
                          </p>
                          <p className="text-muted-foreground">
                            {recommendedNaps}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Moon className="w-6 h-6 text-primary" />
                        <div>
                          <p className="font-semibold">
                            Sueño nocturno recomendado:
                          </p>
                          <p className="text-muted-foreground">
                            {nightlySleep} continuas
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center p-8">
                <Dog className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <p className="text-lg text-muted-foreground">
                  Por favor, selecciona una mascota para ver los detalles de
                  sueño.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {selectedPet && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8"
          >
            <Card className="w-full max-w-md mx-auto">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Moon className="w-6 h-6 text-primary" />
                  Registrar sueño del perro
                </CardTitle>
                <CardDescription>
                  Ingresa cuánto tiempo durmió tu perro
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="sleep-duration">Duración del sueño</Label>
                    <div className="flex items-center space-x-2">
                      <TimePickerDemo setDate={setDate} date={date} />
                    </div>
                  </div>
                  <Button type="submit" className="w-full">
                    Registrar sueño
                  </Button>
                </form>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">
                  Registro de sueño{" "}
                  <Badge className="text-sm">{formattedDate}</Badge>
                </CardTitle>
                <CardDescription>
                  Historial de sueños registrados
                </CardDescription>
              </CardHeader>
              <CardContent>
                {sleepLog.length > 0 ? (
                  <>
                    <div className="mb-4">
                      <p className="font-semibold">
                        Total de sueño registrado:
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {totalHours} horas y {remainingMinutes} minutos
                      </p>
                    </div>
                    <ul className="space-y-4">
                      {sleepLog.map((entry) => (
                        <li
                          key={entry.id}
                          className="flex items-start justify-between border-b pb-2"
                        >
                          <div className="flex items-start space-x-2">
                            <Clock className="w-5 h-5 text-primary mt-1" />
                            <div>
                              <span className="font-semibold">
                                {entry.duration}
                              </span>
                            </div>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {entry.timestamp}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <p className="text-muted-foreground">
                    No hay registros de sueño aún.
                  </p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                Patrón de sueño semanal
              </CardTitle>
              <CardDescription>
                Visualización de las horas de sueño por día
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <Bar
                data={chartData}
                options={chartOptions}
                className="max-h-80"
              />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-8"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                Recomendaciones de sueño
              </CardTitle>
              <CardDescription>
                Consejos para mejorar el descanso de tu perro
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                <li className="flex items-start space-x-2">
                  <Moon className="w-5 h-5 text-primary mt-1" />
                  <span>Mantén un horario de sueño constante</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Sun className="w-5 h-5 text-primary mt-1" />
                  <span>
                    Asegúrate de que tenga suficiente ejercicio durante el día
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <Dog className="w-5 h-5 text-primary mt-1" />
                  <span>
                    Proporciona un lugar cómodo y tranquilo para dormir
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mt-8"
      >
        <Alert className="max-w-screen-lg">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Atención</AlertTitle>
          <AlertDescription>
            Si notas cambios significativos en los patrones de sueño de tu
            perro, consulta con tu veterinario.
          </AlertDescription>
        </Alert>
      </motion.div>
    </div>
  );
}
