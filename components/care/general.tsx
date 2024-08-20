"use client";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  PawPrint,
  Utensils,
  Activity,
  Weight,
  Pill,
  Calendar,
} from "lucide-react";

export default function CareGeneral() {
  const [weight, setWeight] = useState(15);
  const [foodAmount, setFoodAmount] = useState(200);
  const [exerciseMinutes, setExerciseMinutes] = useState(30);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Monitor de salud de</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <PawPrint className="mr-2" />
            Resumen de Salud
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <span>Estado General:</span>
            <Badge variant="outline" className="bg-green-100 text-green-800">
              Saludable
            </Badge>
          </div>
          <Progress value={80} className="mb-2" />
          <p className="text-sm text-muted-foreground">
            Tu perro está en buena forma. Mantén el buen trabajo.
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Utensils className="mr-2" />
              Alimentación
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-2">
              <span>Cantidad Diaria:</span>
              <span>{foodAmount}g</span>
            </div>
            <Input
              type="range"
              min="100"
              max="500"
              value={foodAmount}
              onChange={(e) => setFoodAmount(Number(e.target.value))}
              className="w-full"
            />
            <Button variant="outline" className="w-full">
              Administrar alimentación
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="mr-2" />
              Ejercicio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-2">
              <span>Minutos Diarios:</span>
              <span>{exerciseMinutes} min</span>
            </div>
            <Input
              type="range"
              min="0"
              max="120"
              value={exerciseMinutes}
              onChange={(e) => setExerciseMinutes(Number(e.target.value))}
              className="w-full"
            />
            <Button variant="outline" className="w-full">
              Administrar ejercicio
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Weight className="mr-2" />
            Control de Peso
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <span>Peso Actual:</span>
            <span className="text-2xl font-bold">{weight} kg</span>
          </div>
          <div className="h-40 bg-muted rounded-md flex items-end">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="flex-1 bg-primary mr-1 rounded-t-sm"
                style={{ height: `${Math.random() * 100}%` }}
              ></div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Gráfico de peso en los últimos 12 meses
          </p>
        </CardContent>
        <CardFooter>
          <div className="w-full">
            <Label htmlFor="newWeight">Registrar nuevo peso:</Label>
            <div className="flex mt-2">
              <Input
                id="newWeight"
                type="number"
                placeholder="Peso en kg"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                className="mr-2"
              />
              <Button>Guardar</Button>
            </div>
          </div>
        </CardFooter>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Pill className="mr-2" />
              Medicamentos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex justify-between items-center">
                <span>Antiparasitario</span>
                <Badge>Cada 3 meses</Badge>
              </li>
              <li className="flex justify-between items-center">
                <span>Vitaminas</span>
                <Badge>Diario</Badge>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              Agregar Medicamento
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2" />
              Próximas Citas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex justify-between items-center">
                <span>Revisión General</span>
                <Badge variant="outline">15 de Julio</Badge>
              </li>
              <li className="flex justify-between items-center">
                <span>Vacunación</span>
                <Badge variant="outline">3 de Agosto</Badge>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              Agendar Nueva Cita
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
