import { useState } from "react";
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
} from "recharts";

export default function Nutrition() {
  const [weight, setWeight] = useState(10);
  const [foodAmount, setFoodAmount] = useState(200);
  const [activityLevel, setActivityLevel] = useState("moderate");

  // Datos simulados para el gráfico de peso
  const weightData = [
    { date: "1 May", weight: 9.8 },
    { date: "8 May", weight: 9.9 },
    { date: "15 May", weight: 10 },
    { date: "22 May", weight: 10.1 },
    { date: "29 May", weight: 10 },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Monitoreo de Nutrición Canina</CardTitle>
          <CardDescription>Mantén a tu perro saludable y feliz</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="text-lg font-semibold mb-2">Resumen</h3>
              <p>Peso actual: {weight} kg</p>
              <p>Alimento diario: {foodAmount} g</p>
              <p>Nivel de actividad: {activityLevel}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Gráfico de Peso</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={weightData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="weight" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Registro de Alimentación</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span>Desayuno</span>
              <span>100g - 8:00 AM</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Cena</span>
              <span>100g - 6:00 PM</span>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={() => alert("Añadir comida")}>Añadir comida</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ajustes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="weight">Peso (kg)</Label>
              <Input
                type="number"
                id="weight"
                value={weight}
                onChange={(e) => setWeight(parseFloat(e.target.value))}
              />
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="food">Cantidad de comida diaria (g)</Label>
              <Input
                type="number"
                id="food"
                value={foodAmount}
                onChange={(e) => setFoodAmount(parseInt(e.target.value))}
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
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recomendaciones</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Basado en el peso actual y nivel de actividad de tu perro:</p>
          <ul className="list-disc list-inside mt-2">
            <li>Mantén la porción de comida actual</li>
            <li>
              Asegúrate de que tu perro tenga acceso a agua fresca en todo
              momento
            </li>
            <li>
              Considera aumentar ligeramente la actividad física para mantener
              un peso saludable
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
