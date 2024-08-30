import { useState, useMemo } from "react";
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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BathIcon,
  ScissorsIcon,
  BoneIcon,
  Dog,
  CalendarDaysIcon,
  Cookie,
  CalendarDays,
  Scissors,
  Droplet,
  PawPrint,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";
import { useSelectedPet } from "@/contexts/selectedPetContext";
import { motion } from "framer-motion";
import { createClient } from "@/utils/supabase/client";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import React from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "../ui/use-toast";
export default function Grooming() {
  const [activities, setActivities] = useState([
    { type: "Baño", date: "2023-05-15" },
    { type: "Cepillado", date: "2023-05-14" },
    { type: "Corte de uñas", date: "2023-05-10" },
    { type: "Baño", date: "2023-04-15" },
    { type: "Cepillado", date: "2023-04-14" },
    { type: "Corte de uñas", date: "2023-04-10" },
    { type: "Baño", date: "2023-03-15" },
    { type: "Cepillado", date: "2023-03-14" },
    { type: "Corte de uñas", date: "2023-03-10" },
  ]);
  const [newActivity, setNewActivity] = useState({ type: "", date: "" });
  const supabase = createClient();

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newActivity.type && newActivity.date && selectedPet) {
      // Verifica que la fecha esté en formato string correcto
      const formattedDate = date ? format(date, "yyyy-MM-dd") : "";

      // Inserta la nueva actividad en la base de datos
      const { error } = await supabase.from("grooming_activities").insert([
        {
          pet_id: selectedPet.id,
          type: newActivity.type,
          date: formattedDate, // Usa la fecha formateada
        },
      ]);

      if (error) {
        console.error("Error inserting data: ", error);
      } else {
        // Actualiza el estado local si la inserción fue exitosa
        setActivities([
          { type: newActivity.type, date: formattedDate },
          ...activities,
        ]);
        setNewActivity({ type: "", date: "" });
        setDate(undefined); // Limpia la fecha después del envío
        toast({
          title: "¡Éxito!",
          description: "Información actualizada con éxito.",
        });
      }
    }
  };

  const getLastActivityDate = (type: string) => {
    const activity = activities.find((a) => a.type === type);
    return activity ? activity.date : "No registrado";
  };

  const barChartData = useMemo(() => {
    const counts = activities.reduce((acc, curr) => {
      acc[curr.type] = (acc[curr.type] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts).map(([type, count]) => ({ type, count }));
  }, [activities]);

  const lineChartData = useMemo(() => {
    const monthlyData = activities.reduce((acc, curr) => {
      const month = curr.date.substring(0, 7); // YYYY-MM
      if (!acc[month]) {
        acc[month] = { month, Baño: 0, Cepillado: 0, "Corte de uñas": 0 };
      }
      acc[month][curr.type]++;
      return acc;
    }, {});
    return Object.values(monthlyData).sort((a, b) =>
      a.month.localeCompare(b.month)
    );
  }, [activities]);

  const { selectedPet } = useSelectedPet();
  const bathRecommendations = {
    Áspero: {
      frequency: "Cada 6-8 semanas",
      reason:
        "El pelaje áspero es más propenso a enredarse, por lo que es importante cepillarlo regularmente y bañarlo de forma menos frecuente para mantener su textura natural.",
    },
    "Sin pelo": {
      frequency: "Cada 1-2 semanas",
      reason:
        "Los perros sin pelo necesitan baños más frecuentes para eliminar la acumulación de aceite y proteger su piel, ya que carecen de la protección que ofrece el pelaje.",
    },
    Liso: {
      frequency: "Cada 4-6 semanas",
      reason:
        "El pelaje liso es fácil de mantener y no se ensucia rápidamente, por lo que no requiere baños demasiado frecuentes.",
    },
    Rugoso: {
      frequency: "Cada 6-8 semanas",
      reason:
        "Similar al pelaje áspero, el pelaje rugoso debe mantenerse en su estado natural, y los baños frecuentes podrían dañarlo.",
    },
    Doble: {
      frequency: "Cada 6-12 semanas",
      reason:
        "Los perros con pelaje doble necesitan menos baños para evitar eliminar los aceites naturales que protegen sus dos capas de pelaje. Es importante cepillarlos regularmente para evitar enredos.",
    },
    Rizado: {
      frequency: "Cada 4-6 semanas",
      reason:
        "El pelaje rizado puede enredarse fácilmente, por lo que es importante mantener una rutina regular de baños y cepillados.",
    },
    Ondulado: {
      frequency: "Cada 4-8 semanas",
      reason:
        "Similar al pelaje rizado, el pelaje ondulado requiere una buena rutina de cuidado para evitar enredos y mantener su forma natural.",
    },
    Cordado: {
      frequency: "Cada 8-12 semanas",
      reason:
        "Este tipo de pelaje se forma en cordones o rastas que necesitan un cuidado especializado. El baño debe ser menos frecuente para evitar dañar la estructura del pelaje.",
    },
    Sedoso: {
      frequency: "Cada 4-6 semanas",
      reason:
        "El pelaje sedoso necesita mantenimiento regular para mantener su brillo y evitar enredos, pero los baños demasiado frecuentes pueden hacer que pierda su suavidad natural.",
    },
  };

  // Asume que `selectedPet.coat_type` es el tipo de pelaje de la mascota seleccionada
  let recommendation = {}; // Inicializa como un objeto vacío por defecto

  if (selectedPet) {
    const selectedCoatType = selectedPet.coat_type;
    recommendation = bathRecommendations[selectedCoatType] || {};
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-4xl mx-auto">
          <CardHeader className="bg-primary text-primary-foreground">
            <CardTitle className="text-2xl flex items-center gap-2">
              <Dog className="w-8 h-8" />
              {selectedPet
                ? `Monitoreo de aseo de ${selectedPet.name}`
                : "Monitoreo de aseo"}
            </CardTitle>
            <CardDescription className="text-primary-foreground/80">
              Mantén a tu perro limpio y bien cuidado
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {!selectedPet ? (
              <div className="text-center p-8">
                <Dog className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <p className="text-lg text-gray-500">
                  Por favor, selecciona una mascota para ver los detalles de
                  aseo.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <CardTitle>Programar estética</CardTitle>
                      <Label
                        htmlFor="activity-type"
                        className="text-lg font-semibold mb-2 block mt-4"
                      >
                        Tipo de actividad
                      </Label>
                      <Select
                        onValueChange={(value) =>
                          setNewActivity({ ...newActivity, type: value })
                        }
                        value={newActivity.type}
                      >
                        <SelectTrigger id="activity-type" className="w-full">
                          <SelectValue placeholder="Selecciona una actividad" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Baño">
                            <Droplet className="w-4 h-4 inline-block mr-2" />{" "}
                            Baño
                          </SelectItem>
                          <SelectItem value="Cepillado">
                            <Scissors className="w-4 h-4 inline-block mr-2" />{" "}
                            Cepillado
                          </SelectItem>
                          <SelectItem value="Corte de uñas">
                            <PawPrint className="w-4 h-4 inline-block mr-2" />{" "}
                            Corte de uñas
                          </SelectItem>
                          <SelectItem value="Corte de pelo">
                            <Scissors className="w-4 h-4 inline-block mr-2" />{" "}
                            Corte de pelo
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label
                        htmlFor="dob"
                        className="text-lg font-semibold mb-2 block"
                      >
                        Fecha de la actividad
                      </Label>
                      <Popover
                        open={isCalendarOpen}
                        onOpenChange={setIsCalendarOpen}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            {date
                              ? format(date, "PPP", { locale: es })
                              : "Selecciona una fecha"}
                            <CalendarDays className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            disabled={(day) => day > new Date()}
                            locale={es}
                            mode="single"
                            selected={date}
                            onSelect={(e) => {
                              if (e) {
                                setDate(e); // Actualiza el estado con la fecha seleccionada
                                setNewActivity({
                                  ...newActivity,
                                  date: format(e, "yyyy-MM-dd"),
                                }); // Actualiza `newActivity.date`
                                setIsCalendarOpen(false);
                              }
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                  <div className="space-y-6 bg-secondary/20 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4">
                      Información de la mascota
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Droplet className="w-5 h-5 text-primary" />
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Tipo de pelaje
                          </p>
                          <p className="font-medium">{selectedPet.coat_type}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Scissors className="w-5 h-5 text-primary" />
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Largo del pelaje
                          </p>
                          <p className="font-medium">
                            {selectedPet.coat_length}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <CalendarDays className="w-5 h-5 text-primary" />
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Frecuencia de baño recomendada
                          </p>
                          <p className="font-medium">
                            {recommendation.frequency}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-4">
                  <Button type="submit" className="w-full max-w-md">
                    Registrar actividad
                  </Button>
                  <div className="flex items-start gap-3 bg-primary/10 p-4 rounded-lg max-w-2xl">
                    <div>
                      <p className="font-semibold text-primary mb-1">
                        Importante:
                      </p>
                      <p className="text-sm">{recommendation.reason}</p>
                    </div>
                  </div>
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        {selectedPet && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Resumen de aseo</CardTitle>
                  <CardDescription>
                    Estado actual de las actividades de aseo
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <BathIcon className="mr-2" />
                        <span>Último baño</span>
                      </div>
                      <span>{getLastActivityDate("Baño")}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <BoneIcon className="mr-2" />
                        <span>Último cepillado</span>
                      </div>
                      <span>{getLastActivityDate("Cepillado")}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <ScissorsIcon className="mr-2" />
                        <span>Último corte de uñas</span>
                      </div>
                      <span>{getLastActivityDate("Corte de uñas")}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Actividades recientes</CardTitle>
                  <CardDescription>
                    Últimas 5 actividades registradas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {activities.slice(0, 5).map((activity, index) => (
                      <li
                        key={index}
                        className="flex justify-between items-center"
                      >
                        <span>{activity.type}</span>
                        <span className="text-sm text-muted-foreground">
                          {activity.date}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}

        {selectedPet && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Frecuencia de actividades</CardTitle>
                  <CardDescription>
                    Número total de cada tipo de actividad
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="type" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="count" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Tendencia de actividades</CardTitle>
                  <CardDescription>
                    Actividades de aseo a lo largo del tiempo
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={lineChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="Baño" stroke="#8884d8" />
                      <Line
                        type="monotone"
                        dataKey="Cepillado"
                        stroke="#82ca9d"
                      />
                      <Line
                        type="monotone"
                        dataKey="Corte de uñas"
                        stroke="#ffc658"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
