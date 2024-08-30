"use client";
import { useEffect, useState } from "react";
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
import { Bar, Line, Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  RadialLinearScale,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  RadialLinearScale
);

import {
  PawPrint,
  Utensils,
  Activity,
  Weight,
  Pill,
  Calendar,
  Info,
  Clock,
  TrendingUp,
  MapPin,
  Apple,
  Dog,
  Droplet,
  Scissors,
  BarChart,
  Bath,
  Heart,
  Moon,
  Sun,
  Zap,
} from "lucide-react";

import Link from "next/link";
import Appointment from "../appointments/appointment";
import { useSelectedPet } from "@/contexts/selectedPetContext";
import FinalAppointment from "./general-components/final-appointment";
import { TooltipProvider } from "../ui/tooltip";
// Simulamos datos de paseos para la demostración
const pendingWalks = [
  { id: 1, date: "2023-06-10", duration: 30 },
  { id: 2, date: "2023-06-11", duration: 45 },
  { id: 3, date: "2023-06-12", duration: 20 },
];

const weeklyActivity = [
  { day: "L", km: 2.1 },
  { day: "M", km: 1.8 },
  { day: "M", km: 2.5 },
  { day: "J", km: 1.9 },
  { day: "V", km: 2.2 },
  { day: "S", km: 3.0 },
  { day: "D", km: 2.7 },
];
export default function CareGeneral() {
  const [foodAmount, setFoodAmount] = useState(200);
  const [exerciseMinutes, setExerciseMinutes] = useState(30);
  const { selectedPet } = useSelectedPet();
  // Datos de ejemplo - reemplaza con datos reales en tu aplicación
  const totalKm = 23.5;
  const totalTime = 240;
  const weeklyActivity = [
    { day: "L", km: 3.2 },
    { day: "M", km: 4.5 },
    { day: "X", km: 2.8 },
    { day: "J", km: 5.1 },
    { day: "V", km: 3.9 },
    { day: "S", km: 2.3 },
    { day: "D", km: 1.7 },
  ];
  const maxKm = Math.max(...weeklyActivity.map((day) => day.km));
  const pendingWalks = [
    { id: 1, date: "2023-06-15", duration: 30 },
    { id: 2, date: "2023-06-17", duration: 45 },
    { id: 3, date: "2023-06-20", duration: 60 },
  ];

  const chartDataActivity = {
    labels: weeklyActivity.map((day) => day.day),
    datasets: [
      {
        label: "Kilómetros caminados",
        data: weeklyActivity.map((day) => day.km),
        backgroundColor: "rgba(34, 197, 94, 0.5)", // Tailwind green-500 with opacity
        borderColor: "rgb(34, 197, 94)", // Tailwind green-500
        borderWidth: 1,
      },
    ],
  };

  const chartOptionsActivity = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Kilómetros",
        },
      },
    },
  };
  // Datos de ejemplo - reemplaza con datos reales en tu aplicación
  const totalGrams = 2350;
  const totalMeals = 21;
  const weeklyFeeding = [
    { day: "L", grams: 320 },
    { day: "M", grams: 350 },
    { day: "X", grams: 280 },
    { day: "J", grams: 410 },
    { day: "V", grams: 390 },
    { day: "S", grams: 330 },
    { day: "D", grams: 270 },
  ];
  const nextMeals = [
    { id: 1, date: "2023-06-15", time: "08:00", type: "Desayuno" },
    { id: 2, date: "2023-06-15", time: "13:00", type: "Almuerzo" },
    { id: 3, date: "2023-06-15", time: "19:00", type: "Cena" },
  ];

  const chartData = {
    labels: weeklyFeeding.map((day) => day.day),
    datasets: [
      {
        label: "Gramos de comida",
        data: weeklyFeeding.map((day) => day.grams),
        backgroundColor: "rgba(34, 197, 94, 0.5)", // Tailwind green-500 with opacity
        borderColor: "rgb(34, 197, 94)", // Tailwind green-500
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Gramos",
        },
      },
    },
  };

  ///
  const [weight, setWeight] = useState(70);
  const [weightData, setWeightData] = useState([]);

  useEffect(() => {
    // Generate sample data for the last 12 months
    const sampleData = Array.from({ length: 12 }, () =>
      Math.floor(Math.random() * (80 - 60 + 1) + 60)
    );
    setWeightData(sampleData);
  }, []);

  const handleWeightSubmit = (e) => {
    e.preventDefault();
    setWeightData([...weightData.slice(1), weight]);
  };

  const chartDataWeight = {
    labels: Array.from({ length: 12 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (11 - i));
      return date.toLocaleString("default", { month: "short" });
    }),
    datasets: [
      {
        label: "Peso (kg)",
        data: weightData,
        fill: false,
        borderColor: "rgb(34, 197, 94)", // Tailwind green-500
        tension: 0.1,
      },
    ],
  };

  const chartOptionsWeight = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text: "Peso (kg)",
        },
      },
    },
  };

  const optionsSleep = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Horas de sueño por día",
      },
    },
  };

  const labels = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

  const dataSleep = {
    labels,
    datasets: [
      {
        label: "Horas de sueño",
        data: [12, 13, 14, 11, 13, 15, 14],
        backgroundColor: "rgba(136, 132, 216, 0.5)",
      },
    ],
  };
  const optionsEmotions = {
    responsive: true,
    scales: {
      r: {
        angleLines: {
          display: false,
        },
        suggestedMin: 0,
        suggestedMax: 10,
      },
    },
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Emociones del perro promedio",
      },
    },
  };

  const dataEmotions = {
    labels: [
      "Felicidad",
      "Energía",
      "Calma",
      "Curiosidad",
      "Afecto",
      "Confianza",
    ],
    datasets: [
      {
        label: "Nivel emocional",
        data: [8, 7, 6, 9, 8, 7],
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  };
  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">
        Monitor de salud de {selectedPet?.name || "Ninguna"}
      </h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <PawPrint className="mr-2" />
            Resumen de salud
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <span>Estado general:</span>
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
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center text-primary">
              <Utensils className="mr-2 " />
              Actividad de alimentación
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <p className="text-sm font-medium">Total semanal</p>
                <p className="text-2xl font-bold">{totalGrams} g</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Comidas</p>
                <p className="text-2xl font-bold">{totalMeals}</p>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold flex items-center">
                <Apple className="mr-2 h-4 w-4" />
                Alimentación semanal
              </h3>
              <div>
                <Bar data={chartData} options={chartOptions} />
              </div>
            </div>

            <div className="space-y-2 ">
              <h3 className="font-semibold flex items-center">
                <Calendar className="mr-2 h-4 w-4" />
                Próxima comida
              </h3>
              {nextMeals.length > 0 ? (
                <div className="flex justify-between items-center bg-muted p-2 rounded">
                  <span className="flex items-center">
                    <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                    {nextMeals[0].time}
                  </span>
                  <span>{nextMeals[0].type}</span>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No hay comidas programadas
                </p>
              )}
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold flex items-center">
                <Apple className="mr-2 h-4 w-4" />
                Próximas comidas
              </h3>
              <ul className="space-y-2">
                {nextMeals.slice(1).map((meal) => (
                  <li
                    key={meal.id}
                    className="flex justify-between items-center text-sm"
                  >
                    <span className="flex items-center">
                      <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                      {meal.time}
                    </span>
                    <span>{meal.type}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Link href="/dashboard/feeding" className="block">
              <Button variant="outline" className="w-full">
                Administrar alimentación
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center text-primary">
              <Activity className="mr-2 " />
              Actividad de paseos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <p className="text-sm font-medium">Distancia semanal</p>
                <p className="text-2xl font-bold">{totalKm.toFixed(1)} km</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Tiempo total</p>
                <p className="text-2xl font-bold">{totalTime} min</p>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold flex items-center">
                <Activity className="mr-2 h-4 w-4" />
                Actividad semanal
              </h3>
              <div>
                <Bar data={chartDataActivity} options={chartOptionsActivity} />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold flex items-center">
                <Calendar className="mr-2 h-4 w-4" />
                Próximo paseo
              </h3>
              {pendingWalks.length > 0 ? (
                <div className="flex justify-between items-center bg-muted p-2 rounded">
                  <span className="flex items-center">
                    <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                    {new Date(pendingWalks[0].date).toLocaleDateString()}
                  </span>
                  <span>{pendingWalks[0].duration} min</span>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No hay paseos programados
                </p>
              )}
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold flex items-center">
                <MapPin className="mr-2 h-4 w-4" />
                Paseos pendientes
              </h3>
              <ul className="space-y-2">
                {pendingWalks.slice(1).map((walk) => (
                  <li
                    key={walk.id}
                    className="flex justify-between items-center text-sm"
                  >
                    <span className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                      {new Date(walk.date).toLocaleDateString()}
                    </span>
                    <span>{walk.duration} min</span>
                  </li>
                ))}
              </ul>
            </div>

            <Link href="/dashboard/walk" className="block">
              <Button variant="outline" className="w-full">
                Administrar paseos
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center text-pr">
            <Weight className="mr-2" />
            Control de peso
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <span>Peso actual:</span>
            <span className="text-2xl font-bold">{weight} kg</span>
          </div>
          <div className="h-64 mb-4">
            <Line data={chartDataWeight} options={chartOptionsWeight} />
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Gráfico de peso en los últimos 12 meses
          </p>
        </CardContent>
        <CardFooter>
          <form onSubmit={handleWeightSubmit} className="w-full">
            <Label htmlFor="newWeight">Registrar nuevo peso:</Label>
            <div className="flex mt-2">
              <Input
                id="newWeight"
                type="number"
                placeholder="Peso en kg"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                className="mr-2"
                step="0.1"
                min="0"
                max="500"
                required
                aria-label="Nuevo peso en kilogramos"
              />
              <Button type="submit">Guardar</Button>
            </div>
          </form>
        </CardFooter>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-primary">
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
            <Link href="/dashboard/medical">
              <Button variant="outline" className="w-96">
                Administrar medicamentos
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-primary">
              <Calendar className="mr-2" />
              Próximas citas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex justify-between items-center">
                <span>Revisión general</span>
                <Badge variant="outline">15 de Julio</Badge>
              </li>
              <li className="flex justify-between items-center">
                <span>Vacunación</span>
                <Badge variant="outline">3 de Agosto</Badge>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <TooltipProvider delayDuration={0}>
              <FinalAppointment />
            </TooltipProvider>
          </CardFooter>
        </Card>
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle className="flex items-center text-primary">
              <Bath className="mr-2" />
              Aseo y cuidado
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Próximos baños</h3>
              <ul className="space-y-2">
                <li className="flex justify-between items-center">
                  <span>Baño y corte</span>
                  <Badge variant="outline">10 de Julio</Badge>
                </li>
                <li className="flex justify-between items-center">
                  <span>Baño y desparasitación</span>
                  <Badge variant="outline">25 de Julio</Badge>
                </li>
                <li className="flex justify-between items-center">
                  <span>Baño y cepillado</span>
                  <Badge variant="outline">8 de Agosto</Badge>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">
                Estadísticas de aseo
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center">
                  <Droplet className="mr-2 h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Baños totales
                    </p>
                    <p className="text-2xl font-bold">16</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Scissors className="mr-2 h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Cortes</p>
                    <p className="text-2xl font-bold">4</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <BarChart className="mr-2 h-5 w-5 text-purple-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Promedio mensual
                    </p>
                    <p className="text-2xl font-bold">2.7</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              <Calendar className="mr-2 h-4 w-4" /> Administrar aseo
            </Button>
          </CardFooter>
        </Card>
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle className="flex items-center text-primary">
              <Moon className="mr-2 " />
              Resumen de sueño
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Resumen de sueño</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center">
                  <Clock className="mr-2 h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Promedio diario
                    </p>
                    <p className="text-2xl font-bold">13 horas</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Sun className="mr-2 h-5 w-5 text-yellow-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Siestas diurnas
                    </p>
                    <p className="text-2xl font-bold">3-4</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Zap className="mr-2 h-5 w-5 text-purple-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Calidad de sueño
                    </p>
                    <p className="text-2xl font-bold">Buena</p>
                  </div>
                </div>
              </div>
            </div>
            <div className=" w-full">
              <Bar options={optionsSleep} data={dataSleep} />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" className="w-full">
              <Moon className="mr-2 h-4 w-4" /> Registrar sueño
            </Button>
          </CardFooter>
        </Card>
      </div>
      <div className="grid grid-cols-1  gap-6 mt-6">
        <Card className="w-full ">
          <CardHeader>
            <CardTitle className="flex items-center text-primary">
              <Dog className="mr-2 " />
              Emociones del perro
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Resumen emocional</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center">
                  <Heart className="mr-2 h-5 w-5 text-red-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Felicidad promedio
                    </p>
                    <p className="text-2xl font-bold">7.8/10</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Zap className="mr-2 h-5 w-5 text-yellow-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Energía promedio
                    </p>
                    <p className="text-2xl font-bold">6.9/10</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Dog className="mr-2 h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Estado general
                    </p>
                    <p className="text-2xl font-bold">Muy bueno</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="h-96 w-full flex justify-center ">
              <Radar options={optionsEmotions} data={dataEmotions} />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant={"outline"} className="w-full">
              <Dog className="mr-2 h-4 w-4" /> Registrar emociones
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
