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
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newActivity.type && newActivity.date && selectedPet) {
      // Inserta la nueva actividad en la base de datos
      const { error } = await supabase.from("grooming_activities").insert([
        {
          pet_id: selectedPet.id,
          type: newActivity.type,
          date: newActivity.date,
        },
      ]);

      if (error) {
        console.error("Error inserting data: ", error);
      } else {
        // Actualiza el estado local si la inserción fue exitosa
        setActivities([newActivity, ...activities]);
        setNewActivity({ type: "", date: "" });
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

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="mb-6">
          <CardHeader className="bg-primary text-primary-foreground">
            <CardTitle className="text-2xl flex items-center gap-2">
              <Dog className="w-6 h-6" />
              {selectedPet
                ? `Monitoreo de aseo de ${selectedPet.name}`
                : "Monitoreo de aseo"}
            </CardTitle>
            <CardDescription className="text-primary-foreground/80">
              Mantén a tu perro limpio y bien cuidado.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {!selectedPet ? (
              <p className="text-center text-gray-500">
                Por favor, selecciona una mascota para ver los detalles de aseo.
              </p>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8 ">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <Label htmlFor="activity-type">Tipo de actividad</Label>
                    <Select
                      onValueChange={(value) =>
                        setNewActivity({ ...newActivity, type: value })
                      }
                      value={newActivity.type}
                    >
                      <SelectTrigger id="activity-type">
                        <SelectValue placeholder="Selecciona una actividad" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Baño">Baño</SelectItem>
                        <SelectItem value="Cepillado">Cepillado</SelectItem>
                        <SelectItem value="Corte de uñas">
                          Corte de uñas
                        </SelectItem>
                        <SelectItem value="Corte de pelo">
                          Corte de pelo
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="space-y-2 flex flex-col ">
                      <Label htmlFor="dob">Fecha de la actividad</Label>
                      <Popover
                        open={isCalendarOpen}
                        onOpenChange={setIsCalendarOpen}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="pl-3 text-right font-normal text-muted-foreground ml-1"
                          >
                            {date ? (
                              format(date, "PPP", { locale: es })
                            ) : (
                              <span>Selecciona una fecha</span>
                            )}
                            <CalendarDaysIcon className="ml-2 h-4 w-4 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            disabled={(day) => day > new Date()}
                            locale={es}
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
                  </div>
                  <div className="flex items-center gap-2">
                    <Cookie className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Tipo de pelaje:
                      </p>
                      <p className="font-medium">28</p>
                    </div>
                  </div>
                </div>
                <Button type="submit">Registrar actividad</Button>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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
