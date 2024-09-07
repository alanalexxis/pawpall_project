import { useEffect, useRef, useState } from "react";
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
  XIcon,
  CheckIcon,
  NotebookPen,
  CheckCircle2Icon,
  XCircleIcon,
  CalculatorIcon,
  FootprintsIcon,
} from "lucide-react";
import { format, subDays } from "date-fns";
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
import CompletedWalkDialog from "./general-components/maps/walk-dialog";
import { Badge } from "../ui/badge";
import { Toast } from "@radix-ui/react-toast";

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
          completed: 1,
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
      await fetchScheduledWalks();
    } catch (error) {
      console.error("Error al programar el paseo:", error);
    }
  }

  const [walks, setWalks] = useState([]);

  const calculateWeeklySummary = () => {
    const now = new Date();
    const oneWeekAgo = subDays(now, 7);

    const weeklyCompletedWalks = walks.filter(
      (walk) =>
        walk.completed === 3 &&
        new Date(walk.day) >= oneWeekAgo &&
        new Date(walk.day) <= now
    );

    const totalDistance = weeklyCompletedWalks.reduce((sum, walk) => {
      const distanceValue = parseFloat(walk.distance.split(" ")[0]);
      return sum + distanceValue;
    }, 0);

    const averageDistance = totalDistance / weeklyCompletedWalks.length;

    const moodCounts = weeklyCompletedWalks.reduce(
      (counts, walk) => {
        counts[walk.mood] = (counts[walk.mood] || 0) + 1;
        return counts;
      },
      { 1: 0, 2: 0, 3: 0 }
    );

    const dominantMood = Object.keys(moodCounts).reduce((a, b) =>
      moodCounts[a] > moodCounts[b] ? a : b
    );

    return {
      totalDistance: totalDistance.toFixed(1),
      averageDistance: averageDistance.toFixed(1),
      totalWalks: weeklyCompletedWalks.length,
      dominantMood: parseInt(dominantMood, 10),
    };
  };

  const handleDistanceChange = (newDistance) => {
    setDistance(newDistance);
  };

  const weeklySummary = calculateWeeklySummary();

  const getMoodIcon = (mood) => {
    switch (mood) {
      case 1:
        return <SmileIcon className="text-green-500" />;
      case 2:
        return <MehIcon className="text-yellow-500" />;
      case 3:
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

  const fetchScheduledWalks = async () => {
    try {
      const { data, error } = await supabase
        .from("walks")
        .select("*")
        .eq("pet_id", selectedPet.id);

      if (error) throw error;

      setWalks(data);
    } catch (error) {
      console.error("Error al obtener los paseos programados:", error);
    }
  };

  useEffect(() => {
    if (selectedPet) {
      fetchScheduledWalks();
    }
  }, [selectedPet]);
  const moodLabels = {
    1: "Feliz",
    2: "Neutral",
    3: "Triste",
  };
  const getStatusBadge = (completed: number) => {
    if (completed === 3) {
      return (
        <Badge
          variant="outline"
          className="bg-green-50 text-green-700 border-green-200"
        >
          <CheckCircle2Icon className="w-3 h-3 mr-1" />
          Completado
        </Badge>
      );
    } else if (completed === 2) {
      return (
        <Badge
          variant="outline"
          className="bg-red-50 text-red-700 border-red-200"
        >
          <XCircleIcon className="w-3 h-3 mr-1" />
          Rechazado
        </Badge>
      );
    } else if (completed === 1) {
      return (
        <Badge
          variant="outline"
          className="bg-yellow-50 text-yellow-700 border-yellow-200"
        >
          <ClockIcon className="w-3 h-3 mr-1" />
          Pendiente
        </Badge>
      );
    }
    return null;
  };
  const handleReject = async (walkId) => {
    try {
      const { error } = await supabase
        .from("walks")
        .update({ completed: 2 })
        .eq("id", walkId);

      if (error) throw error;

      toast({
        title: "Paseo rechazado.",
        description: "El paseo ha sido marcado como rechazado.",
      });

      // Actualizar la lista de paseos programados
      await fetchScheduledWalks();
    } catch (error) {
      console.error("Error al rechazar el paseo:", error);
    }
  };
  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardHeader className="bg-[conic-gradient(at_bottom_left,_var(--tw-gradient-stops))] from-yellow-200 via-emerald-200 to-yellow-200 text-primary-foreground">
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
                  <div className="container mx-auto px-4 py-8">
                    <h2 className="text-2xl font-semibold mb-6">
                      Paseos programados
                    </h2>
                    <div className="space-y-4">
                      {walks.filter((walk) => walk.completed === 1).length >
                      0 ? (
                        walks
                          .filter((walk) => walk.completed === 1) // Filter walks with completed = 1
                          .map((walk) => (
                            <Card
                              key={walk.id}
                              className="overflow-hidden hover:shadow-md transition-shadow duration-200"
                            >
                              <div className="bg-[conic-gradient(at_top_left,_var(--tw-gradient-stops))] from-yellow-200 via-emerald-200 to-yellow-200 p-4 text-primary-foreground">
                                <div className="flex items-center justify-between flex-wrap gap-2">
                                  <div className="flex items-center space-x-2">
                                    <CalendarIcon className="h-5 w-5" />
                                    <p className="font-medium">
                                      {format(
                                        new Date(walk.day),
                                        "EEEE - dd/MM/yyyy",
                                        { locale: es }
                                      )}
                                    </p>
                                  </div>
                                  {getStatusBadge(walk.completed)}
                                </div>
                              </div>
                              <CardContent className="p-6">
                                <div className="flex flex-col space-y-4">
                                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
                                    <div className="flex items-start space-x-4">
                                      <div>
                                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                                          <ClockIcon className="mr-2 h-4 w-4" />
                                          <span>
                                            {format(
                                              new Date(walk.day),
                                              "h:mm a",
                                              { locale: es }
                                            )}{" "}
                                            - {walk.total_time} -{" "}
                                            {walk.distance}
                                          </span>
                                        </div>
                                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                                          <MapPinIcon className="mr-2 h-4 w-4" />
                                          <span>{walk.destination}</span>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <CompletedWalkDialog
                                        walkId={walk.id}
                                        fetchScheduledWalks={
                                          fetchScheduledWalks
                                        }
                                      />
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleReject(walk.id)}
                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                      >
                                        <XIcon className="h-4 w-4 mr-2" />
                                        Rechazar
                                      </Button>
                                      <Button
                                        size="icon"
                                        variant="outline"
                                        onClick={() => handleDelete(walk.id)}
                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                      >
                                        <TrashIcon className="h-4 w-4" />
                                        <span className="sr-only">
                                          Eliminar paseo
                                        </span>
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))
                      ) : (
                        <Card className="text-center p-8">
                          <Dog className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                          <p className="text-lg text-gray-500">
                            No hay paseos programados. ¡Empieza a registrar
                            paseos para verlos aquí!
                          </p>
                        </Card>
                      )}
                    </div>
                  </div>
                </motion.div>
              </TabsContent>
              <TabsContent value="monitor">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Card className="w-full max-w-3xl">
                    <CardHeader>
                      <CardTitle className="text-2xl font-bold">
                        Resumen semanal
                      </CardTitle>
                      <CardDescription>
                        Estadísticas de los paseos de esta semana
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-6">
                        <StatItem
                          icon={
                            <MapPinIcon className="h-6 w-6 text-blue-500" />
                          }
                          label="Distancia total"
                          value={`${weeklySummary.totalDistance} km`}
                        />
                        <StatItem
                          icon={
                            <CalculatorIcon className="h-6 w-6 text-green-500" />
                          }
                          label="Promedio por paseo"
                          value={`${weeklySummary.averageDistance} km`}
                        />
                        <StatItem
                          icon={
                            <FootprintsIcon className="h-6 w-6 text-purple-500" />
                          }
                          label="Total de paseos"
                          value={weeklySummary.totalWalks}
                        />
                        <StatItem
                          icon={
                            <SmileIcon className="h-6 w-6 text-yellow-500" />
                          }
                          label="Estado de ánimo dominante"
                          value={moodLabels[weeklySummary.dominantMood]}
                          extraContent={getMoodIcon(weeklySummary.dominantMood)}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <div className="container mx-auto px-4 py-8">
                    <h2 className="text-2xl font-semibold mb-6">
                      Paseos completados
                    </h2>
                    <div className="space-y-4">
                      {walks.filter(
                        (walk) => walk.completed === 2 || walk.completed === 3
                      ).length > 0 ? (
                        walks
                          .filter(
                            (walk) =>
                              walk.completed === 2 || walk.completed === 3
                          )
                          .map((walk) => (
                            <Card className="overflow-hidden transition-all hover:shadow-lg">
                              <CardContent className="p-0">
                                <div className="bg-[conic-gradient(at_top_left,_var(--tw-gradient-stops))] from-yellow-200 via-emerald-200 to-yellow-200 p-4 text-primary-foreground">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                      <CalendarIcon className="h-5 w-5" />
                                      <p className="font-semibold">
                                        {format(
                                          new Date(walk.day),
                                          "EEEE - dd/MM/yyyy",
                                          { locale: es }
                                        )}
                                      </p>
                                    </div>
                                    {getStatusBadge(walk.completed)}
                                  </div>
                                </div>
                                <div className="p-6 space-y-6">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                      {getMoodIcon(walk.mood)}
                                      <span className="text-sm font-medium capitalize">
                                        {moodLabels[walk.mood] || ""}
                                      </span>
                                    </div>
                                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                      <ActivityIcon className="h-4 w-4" />
                                      <span>
                                        {walk.distance} - {walk.total_time}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <div className="flex items-start space-x-2">
                                      <MapPinIcon className="h-4 w-4 mt-1 text-primary" />
                                      <p className="text-sm">
                                        {walk.destination}
                                      </p>
                                    </div>
                                    <div className="flex items-start space-x-2">
                                      <NotebookPen className="h-4 w-4 mt-1 text-primary" />
                                      <p className="text-sm line-clamp-3">
                                        {walk.notes}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))
                      ) : (
                        <Card className="text-center p-8">
                          <p className="text-lg text-muted-foreground">
                            No hay paseos recientes completados.
                          </p>
                        </Card>
                      )}
                    </div>
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
function StatItem({ icon, label, value, extraContent }) {
  return (
    <div className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg">
      {icon}
      <div>
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <div className="flex items-center space-x-2">
          <p className="text-2xl font-bold">{value}</p>
          {extraContent}
        </div>
      </div>
    </div>
  );
}
