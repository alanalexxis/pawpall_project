import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { DialogNutrition } from "./dialog-nutrition";
import { useSelectedPet } from "@/contexts/selectedPetContext";
import { motion } from "framer-motion";
import {
  Dog,
  Activity,
  Droplet,
  Scale,
  Target,
  Calendar,
  Cookie,
  RocketIcon,
  Trash,
  Edit,
} from "lucide-react";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
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
import { toast } from "../ui/use-toast";
import { DialogNutritionEdit } from "./dialog-nutrition-edit";

export default function Nutrition() {
  const supabase = createClient();
  const [feedingLogs, setFeedingLogs] = useState([]);
  const [weight, setWeight] = useState(10);
  const [targetWeight, setTargetWeight] = useState(10);
  const [isAlertOpen, setIsAlertOpen] = useState(false); // Estado para el modal
  const [selectedLog, setSelectedLog] = useState(null);
  const [editLog, setEditLog] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  // Simulated weight data
  const weightData = [
    { date: "1 May", weight: 9.8 },
    { date: "8 May", weight: 9.9 },
    { date: "15 May", weight: 10 },
    { date: "22 May", weight: 10.1 },
    { date: "29 May", weight: 10 },
  ];

  const { selectedPet } = useSelectedPet();
  const calculateIdealWeight = (selectedPet) => {
    if (!selectedPet) return null; // Verifica si selectedPet está definido
    const {
      birthdate,
      weight,
      min_weight_male,
      max_weight_male,
      min_weight_female,
      max_weight_female,
      gender,
    } = selectedPet;

    // Paso 1: Calcula la edad en meses
    const birthDate = new Date(birthdate);
    const currentDate = new Date();
    const ageInMonths =
      (currentDate.getFullYear() - birthDate.getFullYear()) * 12 +
      currentDate.getMonth() -
      birthDate.getMonth();

    // Determina el rango de peso adulto basado en el sexo del perro
    let minWeightAdult, maxWeightAdult;

    if (gender === "Male") {
      minWeightAdult = min_weight_male;
      maxWeightAdult = max_weight_male;
    } else if (gender === "Female") {
      minWeightAdult = min_weight_female;
      maxWeightAdult = max_weight_female;
    } else {
      throw new Error("Género no especificado o no válido.");
    }

    // Paso 2: Verifica si el perro ha alcanzado la madurez
    const isAdult = ageInMonths >= 12;

    // Si es adulto, usa el peso ideal adulto directamente
    if (isAdult) {
      return {
        minWeightCurrent: minWeightAdult,
        maxWeightCurrent: maxWeightAdult,
        currentWeight: weight,
        ageInMonths,
      };
    }

    let weightFactorMin, weightFactorMax;
    if (ageInMonths <= 2) {
      weightFactorMin = 0.2;
      weightFactorMax = 0.25;
    } else if (ageInMonths <= 4) {
      weightFactorMin = 0.4;
      weightFactorMax = 0.5;
    } else if (ageInMonths <= 6) {
      weightFactorMin = 0.6;
      weightFactorMax = 0.7;
    } else if (ageInMonths <= 9) {
      weightFactorMin = 0.75;
      weightFactorMax = 0.9;
    } else {
      weightFactorMin = 0.9;
      weightFactorMax = 1.0;
    }

    // Paso 4: Calcula el peso ideal actual
    const minWeightCurrent = minWeightAdult * weightFactorMin;
    const maxWeightCurrent = maxWeightAdult * weightFactorMax;

    return {
      minWeightCurrent,
      maxWeightCurrent,
      currentWeight: weight,
      ageInMonths,
    };
  };

  const idealWeight = calculateIdealWeight(selectedPet);
  const calculateActivityLevel = (
    weight,
    minWeightCurrent,
    maxWeightCurrent
  ) => {
    if (weight < minWeightCurrent) {
      return "Bajo";
    } else if (weight >= minWeightCurrent && weight <= maxWeightCurrent) {
      return "Normal";
    } else if (weight > maxWeightCurrent && weight <= maxWeightCurrent * 1.2) {
      return "Alto";
    } else {
      return "Muy alto";
    }
  };

  const activityLevel = selectedPet
    ? calculateActivityLevel(
        selectedPet.weight,
        idealWeight.minWeightCurrent,
        idealWeight.maxWeightCurrent
      )
    : null;

  const calculateFoodAmount = (selectedPet, idealWeight) => {
    if (!selectedPet) return null;

    const { weight, birthdate } = selectedPet;

    // Paso 1: Calcula la edad en meses
    const birthDate = new Date(birthdate);
    const currentDate = new Date();
    const ageInMonths =
      (currentDate.getFullYear() - birthDate.getFullYear()) * 12 +
      currentDate.getMonth() -
      birthDate.getMonth();

    // Paso 2: Determina el porcentaje basado en la edad
    const foodPercentage = ageInMonths < 12 ? 0.05 : 0.03; // 5% para cachorros menores de 12 meses, 3% para adultos

    // Paso 3: Calcula la cantidad base de comida en gramos
    const baseFoodAmount = weight * foodPercentage * 1000; // Convertir de kg a gramos

    // Paso 4: Ajusta la cantidad de comida basada en el peso en relación al peso ideal
    const { minWeightCurrent, maxWeightCurrent } = idealWeight;
    let adjustedFoodAmount = baseFoodAmount;

    if (weight < minWeightCurrent) {
      // Aumentar la cantidad si está por debajo del peso ideal
      adjustedFoodAmount *= 1.2; // Ajusta el factor según necesidad
    } else if (weight > maxWeightCurrent) {
      // Reducir la cantidad si está por encima del peso ideal
      adjustedFoodAmount *= 0.7; // Ajusta el factor según necesidad
    }

    // Retorna la cantidad ajustada en gramos, redondeado a dos decimales
    return adjustedFoodAmount.toFixed(2);
  };

  const foodAmount = calculateFoodAmount(selectedPet, idealWeight);
  const calculateMealsPerDay = (birthdate) => {
    if (!birthdate) return null;

    // Paso 1: Calcula la edad en meses
    const birthDate = new Date(birthdate);
    const currentDate = new Date();
    const ageInMonths =
      (currentDate.getFullYear() - birthDate.getFullYear()) * 12 +
      currentDate.getMonth() -
      birthDate.getMonth();

    // Paso 2: Determina la frecuencia de comidas basada en la edad
    if (ageInMonths < 4) {
      return 4; // Cachorros de 0-4 meses necesitan 4 comidas al día
    } else if (ageInMonths < 6) {
      return 3; // Cachorros de 4-6 meses necesitan 3 comidas al día
    } else if (ageInMonths < 12) {
      return 2; // Cachorros de 6-12 meses necesitan 2-3 comidas al día, pero usaremos 2 para simplificar
    } else {
      return 2; // Perros adultos necesitan 2 comidas al día
    }
  };
  const mealsPerDay = selectedPet
    ? calculateMealsPerDay(selectedPet.birthdate)
    : null;

  // Define la función fetchFeedingLogs
  const fetchFeedingLogs = async () => {
    if (!selectedPet) return;

    const { data, error } = await supabase
      .from("pet_nutrition")
      .select("*")
      .eq("pet_id", selectedPet.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error al obtener los registros:", error);
    } else {
      const formattedLogs = data.map((log) => ({
        id: log.id,
        time: new Date(log.created_at).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        amount: log.food_amount,
        type: log.food_type,
      }));
      setFeedingLogs(formattedLogs);
    }
  };

  const handleDelete = async () => {
    if (!selectedLog) return;

    const { error } = await supabase
      .from("pet_nutrition")
      .delete()
      .eq("id", selectedLog.id);

    if (error) {
      console.error("Error al eliminar el registro:", error);
      alert("Hubo un error al eliminar el registro.");
    } else {
      const updatedLogs = feedingLogs.filter(
        (log) => log.id !== selectedLog.id
      );
      setFeedingLogs(updatedLogs);
      setIsAlertOpen(false); // Cierra el modal después de eliminar
      toast({
        title: "¡Éxito!",
        description: "Información eliminada con éxito.",
      });
    }
  };

  const getRecommendations = () => {
    if (!idealWeight) return [];

    const recommendations = [
      "Asegúrate de que tu perro tenga acceso a agua fresca en todo momento",
    ];

    if (selectedPet.weight < idealWeight.minWeightCurrent) {
      recommendations.push(
        "Considera aumentar la cantidad de comida para ayudar a alcanzar el peso ideal",
        "Añade snacks saludables entre comidas para ayudar a ganar peso"
      );
    } else if (selectedPet.weight > idealWeight.maxWeightCurrent) {
      recommendations.push(
        "Reduce la cantidad de comida para evitar el aumento de peso",
        "Aumenta gradualmente la actividad física para ayudar a perder peso"
      );
    } else {
      recommendations.push(
        "Mantén la porción actual de comida",
        "Sigue monitoreando el peso de tu perro regularmente"
      );
    }

    return recommendations;
  };

  useEffect(() => {
    fetchFeedingLogs();
  }, [selectedPet]);

  const handleEditClick = (log) => {
    setEditLog(log);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="overflow-hidden">
          <CardHeader className="bg-primary text-primary-foreground">
            <CardTitle className="text-2xl flex items-center gap-2">
              <Dog className="w-6 h-6" />
              {selectedPet
                ? `Monitoreo de nutrición de ${selectedPet.name}`
                : "Monitoreo de nutrición"}
            </CardTitle>
            <CardDescription className="text-primary-foreground/80">
              Mantén a tu perro saludable y feliz.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {!selectedPet ? (
              <p className="text-center text-gray-500">
                Por favor, selecciona una mascota para ver los detalles de
                nutrición.
              </p>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="mt-4">
                    {selectedPet.weight < idealWeight.minWeightCurrent ? (
                      <Alert variant="destructive">
                        <ExclamationTriangleIcon className="h-4 w-4" />
                        <AlertTitle>Alerta</AlertTitle>
                        <AlertDescription>
                          Tu mascota está por debajo del peso recomendado.
                          Considera ajustar su dieta o consultar con un
                          veterinario.
                        </AlertDescription>
                      </Alert>
                    ) : selectedPet.weight > idealWeight.maxWeightCurrent ? (
                      <Alert variant="destructive">
                        <ExclamationTriangleIcon className="h-4 w-4" />
                        <AlertTitle>Alerta</AlertTitle>
                        <AlertDescription>
                          Tu mascota está por encima del peso recomendado.
                          Considera ajustar su dieta o consultar con un
                          veterinario.
                        </AlertDescription>
                      </Alert>
                    ) : (
                      <Alert>
                        <RocketIcon className="h-4 w-4" />
                        <AlertTitle>Enhorabuena!</AlertTitle>
                        <AlertDescription>
                          El peso de tu mascota está dentro del rango
                          recomendado.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                  <h3 className="text-xl font-semibold mb-4">Resumen</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Scale className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Peso actual
                        </p>
                        <p className="font-medium">
                          {selectedPet?.weight || "Ninguna"} kg
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Target className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Peso recomendado
                        </p>
                        <p className="font-medium">
                          {idealWeight.minWeightCurrent} kg y{" "}
                          {idealWeight.maxWeightCurrent} kg
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Droplet className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Alimento recomendado
                        </p>
                        <p className="font-medium"> {foodAmount} gramos</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Activity className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Actividad recomendada
                        </p>
                        <p className="font-medium ">{activityLevel}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Cookie className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Comidas diarias recomendadas
                        </p>
                        <p className="font-medium">{mealsPerDay}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Cookie className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Edad en meses
                        </p>
                        <p className="font-medium">
                          {" "}
                          {idealWeight.ageInMonths} meses
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4">
                    Gráfico de peso
                  </h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={weightData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis domain={["dataMin - 0.5", "dataMax + 0.5"]} />
                      <Tooltip />
                      <ReferenceLine
                        y={targetWeight}
                        stroke="red"
                        strokeDasharray="3 3"
                      />
                      <Line type="monotone" dataKey="weight" stroke="#8884d8" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <blockquote className="text-xs">
                  *El cálculo del peso recomendado incluye factores basados en
                  la edad en meses, el género y el peso adulto promedio de la
                  raza.
                </blockquote>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {" "}
        {selectedPet && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Registro de alimentación
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {feedingLogs.map((log, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center py-2 border-b"
                  >
                    <span className="text-sm font-medium">{log.time}</span>
                    <span className="text-sm text-muted-foreground">
                      {log.type}: {log.amount}g
                    </span>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditClick(log)}
                        className="flex items-center text-gray-500 hover:text-gray-700 text-sm"
                      >
                        <Edit className="h-4 w-4 " />
                      </button>

                      <button
                        onClick={() => {
                          setSelectedLog(log);
                          setIsAlertOpen(true); // Abre el modal
                        }}
                        className="text-red-500 hover:text-red-700 text-sm flex items-center"
                      >
                        <Trash className="h-4 w-4 " />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <DialogNutrition
                feedingLogs={feedingLogs}
                setFeedingLogs={setFeedingLogs}
              />
              <DialogNutritionEdit
                feedingLogs={feedingLogs}
                setFeedingLogs={setFeedingLogs}
                editLog={editLog}
                setEditLog={setEditLog}
                isDialogOpen={isDialogOpen}
                setIsDialogOpen={setIsDialogOpen}
              />
            </CardFooter>
          </Card>
        )}
      </motion.div>
      <AlertDialog
        open={isAlertOpen} // Abre el modal si isAlertOpen es true
        onOpenChange={(open) => setIsAlertOpen(open)} // Controla el estado del modal
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente
              el registro de alimentación.
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

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        {selectedPet && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Recomendaciones
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Basado en el peso actual, objetivo y nivel de actividad de tu
                perro:
              </p>
              <ul className="space-y-2">
                {getRecommendations().map((recommendation, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="mt-1 bg-primary rounded-full p-1">
                      <Activity className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <span>{recommendation}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </motion.div>
    </div>
  );
}
