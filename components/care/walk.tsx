import { useRef, useState } from "react";
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
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useSelectedPet } from "@/contexts/selectedPetContext";
import { motion } from "framer-motion";
import GoogleMapRouteComponent from "./general-components/maps/map-component";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Popover } from "@radix-ui/react-popover";
import { PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { TimePickerDemo } from "../appointments/time-picker";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";
import { toast } from "../ui/use-toast";
import { createClient } from "@/utils/supabase/client";
import { useLoadScript } from "@react-google-maps/api";

const formSchema = z.object({
  dateTime: z.date().refine((value) => value instanceof Date, {
    message: "Debe seleccionar una fecha y hora válidas.",
  }),
  total_time: z.string().min(1, "El tiempo total es requerido."),
});
export default function Walk() {
  const supabase = createClient();
  const { selectedPet } = useSelectedPet();
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [distance, setDistance] = useState("");
  const [total_time, setTotalTime] = useState("");
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });
  const { reset } = form;
  const clearDirectionsRef = useRef(null);
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // Convertir la fecha y hora seleccionada a formato ISO string
      const timestamp = values.dateTime.toISOString();

      // Enviar los datos a la tabla "walks" en Supabase
      const { error } = await supabase.from("walks").insert([
        {
          pet_id: selectedPet.id,
          day: timestamp, // Fecha y hora como timestamptz
          origin: origin, // Dirección de origen
          destination: destination, // Dirección de destino
          distance: distance,
          total_time: total_time,
        },
      ]);
      if (clearDirectionsRef.current) {
        clearDirectionsRef.current();
      }
      if (error) throw error;

      toast({
        title: "¡Éxito!",
        description: "Paseo programado con éxito.",
      });

      // Limpiar los campos del formulario
      reset(); // Resetea el formulario a sus valores por defecto
    } catch (error) {
      console.error("Error al programar el paseo:", error);
    }
  }

  const [walks, setWalks] = useState([
    {
      id: 1,
      day: "Lunes",
      time: "09:00",
      duration: "30",
      location: "Parque Central",
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

  const handleDistanceChange = (newDistance) => {
    setDistance(newDistance);
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
  // dance arounding to fix stupid performance warning
  const libraries = ["places"] as Libraries;
  const libRef = useRef(libraries);
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: libRef.current,
  });

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
                      <Form {...form}>
                        <form
                          onSubmit={form.handleSubmit(onSubmit)}
                          className="space-y-4"
                        >
                          <FormField
                            control={form.control}
                            name="dateTime"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Seleccione una fecha</FormLabel>
                                <Popover>
                                  <FormControl>
                                    <PopoverTrigger asChild>
                                      <Button
                                        variant="outline"
                                        className={cn(
                                          "w-full justify-start text-left font-normal",
                                          !field.value &&
                                            "text-muted-foreground"
                                        )}
                                      >
                                        <CalendarIcon className="mr-2 h-4 w-4" />

                                        {field.value ? (
                                          format(field.value, "PPP HH:mm:ss", {
                                            locale: es,
                                          })
                                        ) : (
                                          <span>Selecciona una fecha</span>
                                        )}
                                      </Button>
                                    </PopoverTrigger>
                                  </FormControl>
                                  <PopoverContent className="w-auto p-0">
                                    <Calendar
                                      mode="single"
                                      selected={field.value}
                                      onSelect={field.onChange}
                                      initialFocus
                                      locale={es}
                                    />
                                    <div className="p-3 border-t border-border">
                                      <TimePickerDemo
                                        setDate={field.onChange}
                                        date={field.value}
                                      />
                                    </div>
                                  </PopoverContent>
                                </Popover>
                              </FormItem>
                            )}
                          />
                          {isLoaded ? (
                            <>
                              <FormField
                                control={form.control}
                                name="total_time"
                                render={({ field, fieldState }) => (
                                  <FormItem>
                                    <FormControl>
                                      <GoogleMapRouteComponent
                                        onOriginChange={setOrigin}
                                        onDestinationChange={setDestination}
                                        onDistanceChange={handleDistanceChange}
                                        onTotalTimeChange={(value) => {
                                          field.onChange(value);
                                          setTotalTime(value);
                                        }}
                                        clearDirections={(clearFunc) => {
                                          clearDirectionsRef.current =
                                            clearFunc;
                                        }}
                                      />
                                    </FormControl>
                                    {fieldState.error && (
                                      <p className="text-red-700 text-sm">
                                        {"Seleccione una ubicación de destino."}
                                      </p>
                                    )}
                                  </FormItem>
                                )}
                              />
                            </>
                          ) : (
                            <div>loading...</div>
                          )}
                          <div className="grid grid-cols-2 gap-4"></div>
                          <CardFooter>
                            <Button type="submit">Programar paseo</Button>
                          </CardFooter>
                        </form>
                      </Form>
                    </CardContent>
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
