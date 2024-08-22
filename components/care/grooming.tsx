import { useState, useMemo } from "react";
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
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BathIcon, ScissorsIcon, BoneIcon } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";

export default function Grooming() {
  const [activities, setActivities] = useState([
    { type: "Baño", date: "2023-05-15" },
    { type: "Cepillado", date: "2023-05-14" },
    { type: "Corte de uñas", date: "2023-05-10" },
    { type: "Baño", date: "2023-04-15" },
    { type: "Cepillado", date: "2023-04-14" },
    { type: "Corte de uñas", date: "2023-04-10" },
    { type: "Baño", date: "2023-03-15" },
    { type: "Cepillado", date: "2023-03-14" },
    { type: "Corte de uñas", date: "2023-03-10" },
  ]);

  const [newActivity, setNewActivity] = useState({ type: "", date: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newActivity.type && newActivity.date) {
      setActivities([newActivity, ...activities]);
      setNewActivity({ type: "", date: "" });
    }
  };

  const getLastActivityDate = (type: string) => {
    const activity = activities.find((a) => a.type === type);
    return activity ? activity.date : "No registrado";
  };

  const barChartData = useMemo(() => {
    const counts = activities.reduce((acc, curr) => {
      acc[curr.type] = (acc[curr.type] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts).map(([type, count]) => ({ type, count }));
  }, [activities]);

  const lineChartData = useMemo(() => {
    const monthlyData = activities.reduce((acc, curr) => {
      const month = curr.date.substring(0, 7); // YYYY-MM
      if (!acc[month]) {
        acc[month] = { month, Baño: 0, Cepillado: 0, "Corte de uñas": 0 };
      }
      acc[month][curr.type]++;
      return acc;
    }, {});
    return Object.values(monthlyData).sort((a, b) =>
      a.month.localeCompare(b.month)
    );
  }, [activities]);

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Monitor de aseo canino</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Registrar nueva actividad</CardTitle>
          <CardDescription>
            Añade una nueva actividad de aseo para tu perro
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="activity-type">Tipo de actividad</Label>
                <Select
                  onValueChange={(value) =>
                    setNewActivity({ ...newActivity, type: value })
                  }
                  value={newActivity.type}
                >
                  <SelectTrigger id="activity-type">
                    <SelectValue placeholder="Selecciona una actividad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Baño">Baño</SelectItem>
                    <SelectItem value="Cepillado">Cepillado</SelectItem>
                    <SelectItem value="Corte de uñas">Corte de uñas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="activity-date">Fecha</Label>
                <Input
                  id="activity-date"
                  type="date"
                  value={newActivity.date}
                  onChange={(e) =>
                    setNewActivity({ ...newActivity, date: e.target.value })
                  }
                />
              </div>
            </div>
            <Button type="submit">Registrar actividad</Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Resumen de aseo</CardTitle>
            <CardDescription>
              Estado actual de las actividades de aseo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <BathIcon className="mr-2" />
                  <span>Último baño</span>
                </div>
                <span>{getLastActivityDate("Baño")}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <BoneIcon className="mr-2" />
                  <span>Último cepillado</span>
                </div>
                <span>{getLastActivityDate("Cepillado")}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <ScissorsIcon className="mr-2" />
                  <span>Último corte de uñas</span>
                </div>
                <span>{getLastActivityDate("Corte de uñas")}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Actividades recientes</CardTitle>
            <CardDescription>Últimas 5 actividades registradas</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {activities.slice(0, 5).map((activity, index) => (
                <li key={index} className="flex justify-between items-center">
                  <span>{activity.type}</span>
                  <span className="text-sm text-muted-foreground">
                    {activity.date}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Frecuencia de actividades</CardTitle>
            <CardDescription>
              Número total de cada tipo de actividad
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tendencia de actividades</CardTitle>
            <CardDescription>
              Actividades de aseo a lo largo del tiempo
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="Baño" stroke="#8884d8" />
                <Line type="monotone" dataKey="Cepillado" stroke="#82ca9d" />
                <Line
                  type="monotone"
                  dataKey="Corte de uñas"
                  stroke="#ffc658"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
