import { useState } from "react";
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
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  PencilIcon,
  TrashIcon,
  ActivityIcon,
  SmileIcon,
  FrownIcon,
  MehIcon,
  Dog,
} from "lucide-react";
import { useSelectedPet } from "@/contexts/selectedPetContext";
import { motion } from "framer-motion";

export default function Walk() {
  const [walks, setWalks] = useState([
    {
      id: 1,
      day: "Lunes",
      time: "09:00",
      duration: "30",
      location: "Parque Central",
    },
    {
      id: 2,
      day: "Miércoles",
      time: "16:00",
      duration: "45",
      location: "Playa Canina",
    },
    {
      id: 3,
      day: "Sábado",
      time: "10:00",
      duration: "60",
      location: "Sendero del Bosque",
    },
  ]);

  const [completedWalks, setCompletedWalks] = useState([
    {
      id: 1,
      date: "2023-05-01",
      distance: 2.5,
      mood: "feliz",
      notes: "Jugó mucho con otros perros",
    },
    {
      id: 2,
      date: "2023-05-03",
      distance: 3.0,
      mood: "neutral",
      notes: "Día caluroso, se cansó rápido",
    },
    {
      id: 3,
      date: "2023-05-06",
      distance: 4.0,
      mood: "feliz",
      notes: "Excelente energía hoy",
    },
  ]);

  const [newWalk, setNewWalk] = useState({
    day: "",
    time: "",
    duration: "",
    location: "",
  });

  const [newCompletedWalk, setNewCompletedWalk] = useState({
    date: "",
    distance: "",
    mood: "",
    notes: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewWalk((prev) => ({ ...prev, [name]: value }));
  };

  const handleCompletedWalkInputChange = (e) => {
    const { name, value } = e.target;
    setNewCompletedWalk((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setNewWalk((prev) => ({ ...prev, [name]: value }));
  };

  const handleCompletedWalkSelectChange = (name, value) => {
    setNewCompletedWalk((prev) => ({ ...prev, [name]: value }));
  };

  const addWalk = (e) => {
    e.preventDefault();
    if (newWalk.day && newWalk.time && newWalk.duration && newWalk.location) {
      setWalks((prev) => [...prev, { id: Date.now(), ...newWalk }]);
      setNewWalk({ day: "", time: "", duration: "", location: "" });
    }
  };

  const addCompletedWalk = (e) => {
    e.preventDefault();
    if (
      newCompletedWalk.date &&
      newCompletedWalk.distance &&
      newCompletedWalk.mood
    ) {
      setCompletedWalks((prev) => [
        ...prev,
        { id: Date.now(), ...newCompletedWalk },
      ]);
      setNewCompletedWalk({ date: "", distance: "", mood: "", notes: "" });
    }
  };

  const deleteWalk = (id) => {
    setWalks((prev) => prev.filter((walk) => walk.id !== id));
  };

  const calculateWeeklySummary = () => {
    const totalDistance = completedWalks.reduce(
      (sum, walk) => sum + Number(walk.distance),
      0
    );
    const averageDistance = totalDistance / completedWalks.length;
    const moodCounts = completedWalks.reduce((counts, walk) => {
      counts[walk.mood] = (counts[walk.mood] || 0) + 1;
      return counts;
    }, {});
    const dominantMood = Object.entries(moodCounts).reduce((a, b) =>
      a[1] > b[1] ? a : b
    )[0];

    return {
      totalDistance: totalDistance.toFixed(1),
      averageDistance: averageDistance.toFixed(1),
      totalWalks: completedWalks.length,
      dominantMood,
    };
  };

  const weeklySummary = calculateWeeklySummary();

  const getMoodIcon = (mood) => {
    switch (mood) {
      case "feliz":
        return <SmileIcon className="text-green-500" />;
      case "neutral":
        return <MehIcon className="text-yellow-500" />;
      case "triste":
        return <FrownIcon className="text-red-500" />;
      default:
        return null;
    }
  };
  const { selectedPet } = useSelectedPet();
  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardHeader className="bg-primary text-primary-foreground">
            <CardTitle className="text-2xl flex items-center gap-2">
              <Dog className="w-6 h-6" />
              {selectedPet
                ? `Monitoreo de paseos de ${selectedPet.name}`
                : "Monitoreo de paseos"}
            </CardTitle>
            <CardDescription className="text-primary-foreground/80">
              Mantén a tu perro activo y contento con caminatas regulares.
            </CardDescription>
          </CardHeader>
        </Card>
        <CardContent className="p-6">
          {selectedPet ? (
            <Tabs defaultValue="schedule" className="mb-8  ">
              <TabsList>
                <TabsTrigger value="schedule">Programar</TabsTrigger>
                <TabsTrigger value="monitor">Monitorear</TabsTrigger>
              </TabsList>
              <TabsContent value="schedule">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>Programar nuevo paseo</CardTitle>
                      <CardDescription>
                        Ingresa los detalles para el nuevo paseo de tu perro
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={addWalk} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="day">Día</Label>
                            <Select
                              name="day"
                              onValueChange={(value) =>
                                handleSelectChange("day", value)
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Selecciona un día" />
                              </SelectTrigger>
                              <SelectContent>
                                {[
                                  "Lunes",
                                  "Martes",
                                  "Miércoles",
                                  "Jueves",
                                  "Viernes",
                                  "Sábado",
                                  "Domingo",
                                ].map((day) => (
                                  <SelectItem key={day} value={day}>
                                    {day}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="time">Hora</Label>
                            <Input
                              type="time"
                              id="time"
                              name="time"
                              value={newWalk.time}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="duration">Duración (minutos)</Label>
                            <Input
                              type="number"
                              id="duration"
                              name="duration"
                              value={newWalk.duration}
                              onChange={handleInputChange}
                              min="15"
                              max="120"
                              step="15"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="location">Ubicación</Label>
                            <Input
                              type="text"
                              id="location"
                              name="location"
                              value={newWalk.location}
                              onChange={handleInputChange}
                              placeholder="Ej: Parque Central"
                            />
                          </div>
                        </div>
                      </form>
                    </CardContent>
                    <CardFooter>
                      <Button onClick={addWalk}>Agregar paseo</Button>
                    </CardFooter>
                  </Card>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <h2 className="text-xl font-semibold my-4">
                    Paseos programados
                  </h2>
                  <div className="space-y-4">
                    {walks.map((walk) => (
                      <Card key={walk.id}>
                        <CardContent className="flex items-center justify-between p-4">
                          <div className="flex items-center space-x-4">
                            <CalendarIcon className="text-blue-500" />
                            <div>
                              <p className="font-medium">{walk.day}</p>
                              <div className="flex items-center text-sm text-gray-500">
                                <ClockIcon className="mr-1 h-4 w-4" />
                                <span>
                                  {walk.time} - {walk.duration} min
                                </span>
                              </div>
                              <div className="flex items-center text-sm text-gray-500">
                                <MapPinIcon className="mr-1 h-4 w-4" />
                                <span>{walk.location}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="icon">
                              <PencilIcon className="h-4 w-4" />
                              <span className="sr-only">Editar paseo</span>
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => deleteWalk(walk.id)}
                            >
                              <TrashIcon className="h-4 w-4" />
                              <span className="sr-only">Eliminar paseo</span>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </motion.div>
              </TabsContent>
              <TabsContent value="monitor">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Card className="mb-8">
                    <CardHeader>
                      <CardTitle>Registrar paseo completado</CardTitle>
                      <CardDescription>
                        Ingresa los detalles del paseo realizado
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={addCompletedWalk} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="date">Fecha</Label>
                            <Input
                              type="date"
                              id="date"
                              name="date"
                              value={newCompletedWalk.date}
                              onChange={handleCompletedWalkInputChange}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="distance">Distancia (km)</Label>
                            <Input
                              type="number"
                              id="distance"
                              name="distance"
                              value={newCompletedWalk.distance}
                              onChange={handleCompletedWalkInputChange}
                              step="0.1"
                              min="0"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="mood">
                            Estado de ánimo del perro
                          </Label>
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
                              <SelectItem value="feliz">Feliz</SelectItem>
                              <SelectItem value="neutral">Neutral</SelectItem>
                              <SelectItem value="triste">Triste</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="notes">Notas adicionales</Label>
                          <Input
                            type="text"
                            id="notes"
                            name="notes"
                            value={newCompletedWalk.notes}
                            onChange={handleCompletedWalkInputChange}
                            placeholder="Observaciones, incidentes, etc."
                          />
                        </div>
                      </form>
                    </CardContent>
                    <CardFooter>
                      <Button onClick={addCompletedWalk}>
                        Registrar paseo
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <Card className="mb-8">
                    <CardHeader>
                      <CardTitle>Resumen semanal</CardTitle>
                      <CardDescription>
                        Estadísticas de los paseos de esta semana
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-500">
                            Distancia total
                          </p>
                          <p className="text-2xl font-bold">
                            {weeklySummary.totalDistance} km
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">
                            Promedio por paseo
                          </p>
                          <p className="text-2xl font-bold">
                            {weeklySummary.averageDistance} km
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">
                            Total de paseos
                          </p>
                          <p className="text-2xl font-bold">
                            {weeklySummary.totalWalks}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">
                            Estado de ánimo dominante
                          </p>
                          <div className="flex items-center">
                            <p className="text-2xl font-bold mr-2">
                              {weeklySummary.dominantMood}
                            </p>
                            {getMoodIcon(weeklySummary.dominantMood)}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <h2 className="text-xl font-semibold mb-4">
                  Historial de paseos recientes
                </h2>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <div className="space-y-4">
                    {completedWalks.map((walk) => (
                      <Card key={walk.id}>
                        <CardContent className="flex items-center justify-between p-4">
                          <div className="flex items-center space-x-4">
                            <CalendarIcon className="text-blue-500" />
                            <div>
                              <p className="font-medium">{walk.date}</p>
                              <div className="flex items-center text-sm text-gray-500">
                                <ActivityIcon className="mr-1 h-4 w-4" />
                                <span>{walk.distance} km</span>
                              </div>
                              <div className="flex items-center text-sm text-gray-500">
                                {getMoodIcon(walk.mood)}
                                <span className="ml-1 capitalize">
                                  {walk.mood}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-sm text-gray-500">
                            <p>{walk.notes}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </motion.div>
              </TabsContent>
            </Tabs>
          ) : (
            <div className="text-center p-8">
              <Dog className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <p className="text-lg text-gray-500">
                Por favor, selecciona una mascota para ver los detalles de
                paseos.
              </p>
            </div>
          )}
        </CardContent>
      </motion.div>
    </div>
  );
}
