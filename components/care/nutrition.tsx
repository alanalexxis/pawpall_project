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

export default function Nutrition() {
  const [weight, setWeight] = useState(10);
  const [targetWeight, setTargetWeight] = useState(10);
  const [foodAmount, setFoodAmount] = useState(200);
  const [activityLevel, setActivityLevel] = useState("Moderado");
  const [foodType, setFoodType] = useState("dry");
  const [age, setAge] = useState(3);

  // Datos simulados para el gráfico de peso
  const weightData = [
    { date: "1 May", weight: 9.8 },
    { date: "8 May", weight: 9.9 },
    { date: "15 May", weight: 10 },
    { date: "22 May", weight: 10.1 },
    { date: "29 May", weight: 10 },
  ];

  const calculateRecommendedFood = () => {
    const baseAmount = weight * 20; // 20g por kg de peso como base
    const activityMultiplier = {
      low: 0.8,
      moderate: 1,
      high: 1.2,
    };
    const ageMultiplier = age < 1 ? 1.2 : age > 7 ? 0.9 : 1;
    const foodTypeMultiplier = foodType === "wet" ? 3 : 1; // La comida húmeda suele requerir más cantidad

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
  return (
    <div className="w-full max-w-4xl mx-auto space-y-4 p-4">
      <Card>
        <CardHeader>
          <CardTitle>Monitoreo de nutrición canina</CardTitle>
          <CardDescription>Mantén a tu perro saludable y feliz</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="text-lg font-semibold mb-2">Resumen</h3>
              <p>Peso actual: {weight} kg</p>
              <p>Peso objetivo: {targetWeight} kg</p>
              <p>Alimento diario recomendado: {foodAmount} g</p>
              <p>Nivel de actividad: {activityLevel}</p>
              <p>Tipo de alimento: {foodType === "dry" ? "Seco" : "Húmedo"}</p>
              <p>Edad: {age} años</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Gráfico de peso</h3>
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
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Registro de alimentación</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
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
      <Card>
        <CardHeader>
          <CardTitle>Ajustes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="weight">Peso actual (kg)</Label>
              <Input
                type="number"
                id="weight"
                value={weight}
                onChange={(e) => setWeight(parseFloat(e.target.value))}
              />
            </div>

            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="targetWeight">Peso objetivo (kg)</Label>
              <Input
                type="number"
                id="targetWeight"
                value={targetWeight}
                onChange={(e) => setTargetWeight(parseFloat(e.target.value))}
              />
            </div>

            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="age">Edad (años)</Label>
              <Input
                type="number"
                id="age"
                value={age}
                onChange={(e) => setAge(parseInt(e.target.value))}
              />
            </div>

            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="activity">Nivel de actividad</Label>
              <Select value={activityLevel} onValueChange={setActivityLevel}>
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

            <div className="grid w-full max-w-sm items-center gap-1.5">
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

      <Card>
        <CardHeader>
          <CardTitle>Recomendaciones</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            Basado en el peso actual, objetivo y nivel de actividad de tu perro:
          </p>
          <ul className="list-disc list-inside mt-2">
            {getRecommendations().map((recommendation, index) => (
              <li key={index}>{recommendation}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
