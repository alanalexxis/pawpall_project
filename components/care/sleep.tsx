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
  ChevronLeft,
  ChevronRight,
  BedDouble,
  Trash,
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
import { Progress } from "../ui/progress";
import { createClient } from "@/utils/supabase/client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";

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
  const supabase = createClient();
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [sleepLog, setSleepLog] = useState<SleepEntry[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const { selectedPet } = useSelectedPet();
  const [logToDelete, setLogToDelete] = useState<number | null>(null); // Estado para el log a eliminar
  const [isAlertOpen, setIsAlertOpen] = useState(false); // Estado para el modal
  useEffect(() => {
    const fetchSleepLogs = async () => {
      const { data, error } = await supabase
        .from("sleep_patterns")
        .select("*")
        .eq("pet_id", selectedPet.id)
        .order("date", { ascending: false });

      if (error) {
        toast({
          title: "Error",
          description: "Hubo un error al obtener los registros de sueño.",
          variant: "destructive",
        });
      } else {
        const formattedLogs = data.map((entry) => ({
          id: entry.id,
          duration: formatTimeFromSupabase(entry.total_time), // Convertir el formato
          timestamp: new Date(entry.date).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }),
          date: new Date(entry.date).toLocaleDateString("es-ES"), // Guardar la fecha en formato de cadena
        }));
        setSleepLog(formattedLogs);
      }
    };

    fetchSleepLogs();
  }, [selectedPet.id]);

  const getCurrentDateTimeForSupabase = () => {
    return new Date().toISOString(); // Formato ISO 8601
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (date) {
      // Obtener la fecha y hora actual en formato ISO 8601
      const isoDateTime = getCurrentDateTimeForSupabase();

      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");
      const totalHours = `${hours}.${minutes}`;

      const newEntry: SleepEntry = {
        id: Date.now(),
        duration: `${hours}:${minutes}`,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
        date: new Date().toLocaleDateString("es-ES"), // Guardar la fecha en formato de cadena
      };

      // Guardar en la tabla 'sleep_patterns'
      const { error } = await supabase.from("sleep_patterns").insert([
        {
          pet_id: selectedPet.id,
          date: isoDateTime, // Fecha y hora en formato ISO 8601 para `timestampz`
          total_time: totalHours,
        },
      ]);

      if (error) {
        toast({
          title: "Error",
          description: "Hubo un error al registrar el sueño.",
          variant: "destructive",
        });
      } else {
        // Actualiza el estado local con el nuevo registro
        setSleepLog((prevLog) => [newEntry, ...prevLog]);
        setDate(undefined);

        toast({
          title: "Sueño registrado",
          description: `Tu perro durmió durante ${hours} horas y ${minutes} minutos.`,
        });
      }
    } else {
      toast({
        title: "Error",
        description: "Por favor, selecciona la duración del sueño.",
        variant: "destructive",
      });
    }
  };
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
    let recommendedHours;
    if (age < 1) {
      recommendedHours = 18; // Horas recomendadas para cachorros
    } else if (age < 7) {
      recommendedHours = 12; // Horas recomendadas para adultos
    } else {
      recommendedHours = 14; // Horas recomendadas para mayores
    }

    return {
      range: age < 1 ? "18-20 horas" : age < 7 ? "12-14 horas" : "14-18 horas",
      nightly: age < 1 ? "10-12 horas" : age < 7 ? "8-10 horas" : "10-12 horas",
      recommendedHours,
    };
  };

  const age = selectedPet ? getAgeInYears(new Date(selectedPet.birthdate)) : 0;
  const recommendedNaps = getRecommendedNaps(age);
  const {
    range: recommendedSleep,
    nightly: nightlySleep,
    recommendedHours,
  } = getRecommendedSleep(age);

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

  const calculateTotalSleepToday = (logs: SleepEntry[]) => {
    let totalMinutes = 0;

    logs
      .filter((entry) => entry.date === new Date().toLocaleDateString("es-ES"))
      .forEach((entry) => {
        const durationString =
          typeof entry.duration === "string" ? entry.duration : "";
        if (durationString) {
          const [hours, minutes] = durationString.split(":").map(Number);
          totalMinutes +=
            (isNaN(hours) ? 0 : hours) * 60 + (isNaN(minutes) ? 0 : minutes);
        }
      });

    const totalHours = Math.floor(totalMinutes / 60);
    const remainingMinutes = totalMinutes % 60;

    return { totalHours, remainingMinutes };
  };

  // En tu componente
  const { totalHours, remainingMinutes } = calculateTotalSleepToday(sleepLog);

  const calculateSleepProgress = (
    totalHours: number,
    remainingMinutes: number,
    recommendedHours: number
  ) => {
    // Convertir los minutos restantes a horas
    const totalSleepHours = totalHours + remainingMinutes / 60;

    // Calcular el porcentaje de sueño registrado
    const percentage = Math.min(
      Math.round((totalSleepHours / recommendedHours) * 100),
      100
    );

    return percentage; // Devolver el porcentaje como número entero
  };

  // Calcular el porcentaje de progreso
  const progressPercentage = calculateSleepProgress(
    totalHours,
    remainingMinutes,
    recommendedHours
  );
  const formatTimeFromSupabase = (timeFloat: number) => {
    // Convertir el número float en horas y minutos
    const hours = Math.floor(timeFloat); // Parte entera como horas
    const minutes = Math.round((timeFloat - hours) * 100); // Parte decimal como minutos

    // Formatear horas y minutos para tener siempre dos dígitos
    const formattedHours = hours.toString().padStart(2, "0");
    const formattedMinutes = minutes.toString().padStart(2, "0");

    // Combinar horas y minutos en el formato deseado
    return `${formattedHours}:${formattedMinutes}`;
  };

  const calculateDailySleep = (logs: SleepEntry[]) => {
    const dailySleep: Record<string, number> = {};

    logs.forEach((entry) => {
      const [hours, minutes] = entry.duration.split(":").map(Number);
      const sleepMinutes =
        (isNaN(hours) ? 0 : hours * 60) + (isNaN(minutes) ? 0 : minutes);
      const date = entry.date;

      if (!dailySleep[date]) {
        dailySleep[date] = 0;
      }
      dailySleep[date] += sleepMinutes;
    });

    return dailySleep;
  };

  const calculateAverageSleep = (dailySleep: Record<string, number>) => {
    const totalDays = Object.keys(dailySleep).length;
    const totalMinutes = Object.values(dailySleep).reduce(
      (acc, minutes) => acc + minutes,
      0
    );
    const averageMinutes = totalDays > 0 ? totalMinutes / totalDays : 0;
    const averageHours = Math.floor(averageMinutes / 60);
    const averageRemainingMinutes = Math.round(averageMinutes % 60); // Cambiado el nombre a averageRemainingMinutes

    return { averageHours, averageRemainingMinutes };
  };

  const dailySleep = calculateDailySleep(sleepLog);
  const { averageHours, averageRemainingMinutes } =
    calculateAverageSleep(dailySleep);

  const calculateSleepQuality = (
    averageHours: number,
    averageRemainingMinutes: number,
    recommendedHours: number
  ) => {
    // Convertir promedio de sueño a un número decimal
    const averageSleepHours = averageHours + averageRemainingMinutes / 60;

    // Calcular porcentaje de sueño registrado respecto a las horas recomendadas
    const percentage = Math.min(
      Math.round((averageSleepHours / recommendedHours) * 100),
      100
    );

    // Determinar la calidad del sueño basada en el porcentaje
    let qualityMessage = "";

    if (percentage >= 90) {
      qualityMessage = "Excelente";
    } else if (percentage >= 75) {
      qualityMessage = "Bueno";
    } else if (percentage >= 50) {
      qualityMessage = "Aceptable";
    } else {
      qualityMessage = "Necesita mejorar";
    }

    return { percentage, qualityMessage };
  };

  // Usar la función en tu componente
  const { percentage, qualityMessage } = calculateSleepQuality(
    averageHours,
    averageRemainingMinutes,
    recommendedHours
  );

  const calculateNapsPerDay = (logs: SleepEntry[]) => {
    const napsPerDay: Record<string, number> = {};

    logs.forEach((entry) => {
      const date = entry.date;
      if (!napsPerDay[date]) {
        napsPerDay[date] = 0;
      }
      napsPerDay[date] += 1; // Contar una siesta para este día
    });

    return napsPerDay;
  };

  // Calcular el promedio de siestas por día
  const calculateAverageNapsPerDay = (napsPerDay: Record<string, number>) => {
    const totalDays = Object.keys(napsPerDay).length;
    const totalNaps = Object.values(napsPerDay).reduce(
      (acc, naps) => acc + naps,
      0
    );
    const averageNaps = totalDays > 0 ? totalNaps / totalDays : 0;

    return averageNaps.toFixed(1); // Redondear a un decimal
  };

  // Usar las funciones en tu componente
  const napsPerDay = calculateNapsPerDay(sleepLog);
  const averageNapsPerDay = calculateAverageNapsPerDay(napsPerDay);
  const handleDelete = async () => {
    if (logToDelete !== null) {
      const { error } = await supabase
        .from("sleep_patterns")
        .delete()
        .match({ id: logToDelete });

      if (error) {
        toast({
          title: "Error",
          description: "Hubo un error al eliminar el registro de sueño.",
          variant: "destructive",
        });
      } else {
        setSleepLog((prevLog) =>
          prevLog.filter((entry) => entry.id !== logToDelete)
        );
        toast({
          title: "Registro eliminado",
          description: "El registro de sueño ha sido eliminado con éxito.",
        });
      }
      setIsAlertOpen(false);
    }
  };
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
                      value: `${averageHours}.${averageRemainingMinutes
                        .toString()
                        .padStart(2, "0")}`,
                      icon: Moon,
                      color: "text-blue-500",
                    },
                    {
                      label: "Calidad del sueño",
                      value: (
                        <div>
                          <span>{percentage}%</span>
                          <span className="text-base block -mt-2">
                            {qualityMessage}
                          </span>
                        </div>
                      ),
                      icon: BedDouble,
                      color: "text-green-500",
                    },

                    {
                      label: "Promedio de siestas por día",
                      value: averageNapsPerDay,
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
                        Total de sueño registrado hoy:
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {totalHours} horas y {remainingMinutes} minutos
                      </p>
                    </div>
                    <ul className="space-y-4">
                      {sleepLog
                        .filter(
                          (entry) =>
                            entry.date ===
                            selectedDate.toLocaleDateString("es-ES")
                        )
                        .map((entry) => (
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
                            <button
                              onClick={() => {
                                setLogToDelete(entry.id);
                                setIsAlertOpen(true);
                              }}
                              className="text-red-500 hover:text-red-700 ml-4"
                            >
                              <Trash className="h-4 w-4" />
                            </button>
                          </li>
                        ))}
                    </ul>
                  </>
                ) : (
                  <p className="text-muted-foreground">
                    No hay registros de sueño hoy.
                  </p>
                )}
                <AlertDialog
                  open={isAlertOpen} // Abre el modal si isAlertOpen es true
                  onOpenChange={(open) => setIsAlertOpen(open)} // Controla el estado del modal
                >
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        ¿Estás absolutamente seguro?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta acción no se puede deshacer. Esto eliminará
                        permanentemente el registro de actividad.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel onClick={() => setIsAlertOpen(false)}>
                        Cancelar
                      </AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete}>
                        Eliminar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardContent>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">
                        Progreso de sueño diario
                      </span>
                      <span className="text-sm font-medium">
                        {progressPercentage}%
                      </span>
                    </div>
                    <Progress value={progressPercentage} className="w-full" />
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Recomendado: {recommendedHours}h</span>
                  </div>
                </div>
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
