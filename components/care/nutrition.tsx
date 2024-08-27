import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Dog, Activity, Droplet, Scale, Target, Calendar } from "lucide-react";

export default function Nutrition() {
  const [weight, setWeight] = useState(10);
  const [targetWeight, setTargetWeight] = useState(10);
  const [foodAmount, setFoodAmount] = useState(200);
  const [activityLevel, setActivityLevel] = useState("moderate");
  const [foodType, setFoodType] = useState("dry");
  const [age, setAge] = useState(3);

  // Simulated weight data
  const weightData = [
    { date: "1 May", weight: 9.8 },
    { date: "8 May", weight: 9.9 },
    { date: "15 May", weight: 10 },
    { date: "22 May", weight: 10.1 },
    { date: "29 May", weight: 10 },
  ];

  const calculateRecommendedFood = () => {
    const baseAmount = weight * 20;
    const activityMultiplier = {
      low: 0.8,
      moderate: 1,
      high: 1.2,
    };
    const ageMultiplier = age < 1 ? 1.2 : age > 7 ? 0.9 : 1;
    const foodTypeMultiplier = foodType === "wet" ? 3 : 1;

    return Math.round(
      baseAmount *
        activityMultiplier[activityLevel] *
        ageMultiplier *
        foodTypeMultiplier
    );
  };

  useEffect(() => {
    setFoodAmount(calculateRecommendedFood());
  }, [weight, activityLevel, age, foodType]);

  const getWeightStatus = () => {
    const diff = weight - targetWeight;
    if (Math.abs(diff) <= 0.5) return "ideal";
    return diff > 0 ? "sobrepeso" : "bajo peso";
  };

  const getRecommendations = () => {
    const status = getWeightStatus();
    const recommendations = [
      `Mantén ${
        status === "ideal"
          ? "la porción actual de comida"
          : status === "sobrepeso"
          ? "una porción reducida de comida"
          : "una porción aumentada de comida"
      }`,
      "Asegúrate de que tu perro tenga acceso a agua fresca en todo momento",
    ];

    if (status === "sobrepeso") {
      recommendations.push(
        "Aumenta gradualmente la actividad física de tu perro"
      );
    } else if (status === "bajo peso") {
      recommendations.push("Considera añadir un snack saludable entre comidas");
    }

    return recommendations;
  };

  const [feedingLogs, setFeedingLogs] = useState([
    { time: "08:00", amount: 100 },
    { time: "18:00", amount: 100 },
  ]);

  const addFeedingLog = () => {
    const now = new Date();
    const time = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const newLog = { time, amount: foodAmount / 2 };
    setFeedingLogs([newLog, ...feedingLogs]);
  };

  const { selectedPet } = useSelectedPet();

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
                        <p className="font-medium">{targetWeight} kg</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Droplet className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Alimento recomendado
                        </p>
                        <p className="font-medium">{foodAmount} g</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Activity className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Actividad recomendada
                        </p>
                        <p className="font-medium capitalize">
                          {activityLevel}
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
                      {log.amount}g
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <DialogNutrition />
            </CardFooter>
          </Card>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        {selectedPet && (
          <Card>
            <CardHeader>
              <CardTitle>Ajustes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="weight">Peso actual (kg)</Label>
                  <Input
                    type="number"
                    id="weight"
                    value={weight}
                    onChange={(e) => setWeight(parseFloat(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="targetWeight">Peso objetivo (kg)</Label>
                  <Input
                    type="number"
                    id="targetWeight"
                    value={targetWeight}
                    onChange={(e) =>
                      setTargetWeight(parseFloat(e.target.value))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">Edad (años)</Label>
                  <Input
                    type="number"
                    id="age"
                    value={age}
                    onChange={(e) => setAge(parseInt(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="activity">Nivel de actividad</Label>
                  <Select
                    value={activityLevel}
                    onValueChange={setActivityLevel}
                  >
                    <SelectTrigger id="activity">
                      <SelectValue placeholder="Selecciona el nivel de actividad" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Bajo</SelectItem>
                      <SelectItem value="moderate">Moderado</SelectItem>
                      <SelectItem value="high">Alto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="foodType">Tipo de alimento</Label>
                  <Select value={foodType} onValueChange={setFoodType}>
                    <SelectTrigger id="foodType">
                      <SelectValue placeholder="Selecciona el tipo de alimento" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dry">Seco</SelectItem>
                      <SelectItem value="wet">Húmedo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
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
