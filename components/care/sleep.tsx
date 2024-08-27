import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Bell, Dog, Moon, Sun } from "lucide-react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useSelectedPet } from "@/contexts/selectedPetContext";
import { motion } from "framer-motion";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Sleep() {
  const [sleepStart, setSleepStart] = useState("22:00");
  const [sleepEnd, setSleepEnd] = useState("06:00");

  const chartData = {
    labels: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
    datasets: [
      {
        label: "Horas de sueño",
        data: [8, 7.5, 9, 8.5, 7, 10, 9.5],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Patrón de sueño semanal",
      },
    },
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
              Monitoreo de sueño de {selectedPet?.name || "Ninguna"}
            </CardTitle>
            <CardDescription className="text-primary-foreground/80">
              Mantén a tu perro descansado y lleno de energía.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <Bar data={chartData} options={chartOptions} />
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Establecer horario de sueño</CardTitle>
              <CardDescription>
                Define los horarios ideales de sueño para tu perro
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="sleep-start">Hora de dormir</Label>
                  <div className="flex items-center space-x-2">
                    <Moon className="text-blue-600" />
                    <Input
                      id="sleep-start"
                      type="time"
                      value={sleepStart}
                      onChange={(e) => setSleepStart(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sleep-end">Hora de despertar</Label>
                  <div className="flex items-center space-x-2">
                    <Sun className="text-yellow-500" />
                    <Input
                      id="sleep-end"
                      type="time"
                      value={sleepEnd}
                      onChange={(e) => setSleepEnd(e.target.value)}
                    />
                  </div>
                </div>
                <Button className="w-full">Guardar horario</Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notificaciones</CardTitle>
              <CardDescription>
                Alertas y recordatorios sobre el sueño de tu perro
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2 p-2 bg-yellow-100 rounded-md">
                  <Bell className="text-yellow-500" />
                  <p className="text-sm">
                    Es hora de que tu perro vaya a dormir (22:00)
                  </p>
                </div>
                <div className="flex items-center space-x-2 p-2 bg-green-100 rounded-md">
                  <Bell className="text-green-500" />
                  <p className="text-sm">
                    Tu perro ha completado 8 horas de sueño
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Resumen de sueño</CardTitle>
            <CardDescription>
              Estadísticas generales del sueño de tu perro
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-blue-600">8.5</p>
                <p className="text-sm text-gray-600">
                  Promedio de horas de sueño
                </p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">95%</p>
                <p className="text-sm text-gray-600">Calidad del sueño</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-600">3</p>
                <p className="text-sm text-gray-600">Siestas por día</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-600">22:15</p>
                <p className="text-sm text-gray-600">Hora promedio de dormir</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
