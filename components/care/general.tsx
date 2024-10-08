"use client";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { calculateSleepByDayOfWeek, SleepEntry } from "@/lib/utils"; // Importar la función y la interfaz
import { differenceInMonths } from "date-fns"; // Asegúrate de tener date-fns instalado
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Bar, Line, Radar } from "react-chartjs-2";
import {
  TooltipContent,
  Tooltip as Tooltipp,
  TooltipTrigger,
} from "../ui/tooltip";

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
  CheckCircle,
  XCircle,
  X,
  Paintbrush,
} from "lucide-react";

import Link from "next/link";
import Appointment from "../appointments/appointment";
import { useSelectedPet } from "@/contexts/selectedPetContext";
import FinalAppointment from "./general-components/final-appointment";
import { TooltipProvider } from "../ui/tooltip";
import { createClient } from "@/utils/supabase/client";
import { toast } from "../ui/use-toast";
export default function CareGeneral() {
  const supabase = createClient();
  const { selectedPet } = useSelectedPet();
  const [totalgrams, setTotalgrams] = useState(0);
  const [totalMeals, setTotalMeals] = useState(0);
  const [totalKm, setTotalKm] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [pendingWalks, setPendingWalks] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [groomingActivities, setGroomingActivities] = useState([]);
  const [totalBaths, setTotalBaths] = useState(0);
  const [totalCuts, setTotalCuts] = useState(0);
  const [totalBrushings, setTotalBrushings] = useState(0);
  const [sleepLog, setSleepLog] = useState<SleepEntry[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [averageHappiness, setAverageHappiness] = useState(0);
  const [happinessDescription, setHappinessDescription] = useState("");
  const [averageEmotions, setAverageEmotions] = useState({
    happiness: 0,
    energy: 0,
    calm: 0,
    curiosity: 0,
    affection: 0,
    trust: 0,
  });
  const [weeklyFeeding, setWeeklyFeeding] = useState([
    { day: "L", grams: 0 },
    { day: "M", grams: 0 },
    { day: "X", grams: 0 },
    { day: "J", grams: 0 },
    { day: "V", grams: 0 },
    { day: "S", grams: 0 },
    { day: "D", grams: 0 },
  ]);
  const [weeklyActivity, setWeeklyActivity] = useState([
    { day: "L", km: 0 },
    { day: "M", km: 0 },
    { day: "X", km: 0 },
    { day: "J", km: 0 },
    { day: "V", km: 0 },
    { day: "S", km: 0 },
    { day: "D", km: 0 },
  ]);
  //obtener gramos, comidas semanales y llenar grafica de comidas
  useEffect(() => {
    const fetchTotalGramsAndMeals = async () => {
      if (!selectedPet) return;

      const { id: petId } = selectedPet;
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      const { data, error } = await supabase
        .from("pet_nutrition")
        .select("food_amount, created_at")
        .eq("pet_id", petId)
        .gte("created_at", oneWeekAgo.toISOString());

      if (error) {
        console.error("Error fetching pet nutrition data:", error);
        return;
      }

      const total = data.reduce((sum, record) => sum + record.food_amount, 0);
      setTotalgrams(total);
      setTotalMeals(data.length);

      // Inicializar un objeto para almacenar la cantidad de comida por día
      const feedingByDay = {
        L: 0,
        M: 0,
        X: 0,
        J: 0,
        V: 0,
        S: 0,
        D: 0,
      };

      // Iterar sobre los datos y sumar la cantidad de comida a los días correspondientes
      data.forEach((record) => {
        const date = new Date(record.created_at);
        const day = date.getDay(); // 0 (Domingo) - 6 (Sábado)
        const dayMap = ["D", "L", "M", "X", "J", "V", "S"];
        const dayLetter = dayMap[day];
        feedingByDay[dayLetter] += record.food_amount;
      });

      // Actualizar el estado weeklyFeeding con los datos procesados
      setWeeklyFeeding([
        { day: "L", grams: feedingByDay.L },
        { day: "M", grams: feedingByDay.M },
        { day: "X", grams: feedingByDay.X },
        { day: "J", grams: feedingByDay.J },
        { day: "V", grams: feedingByDay.V },
        { day: "S", grams: feedingByDay.S },
        { day: "D", grams: feedingByDay.D },
      ]);
    };

    fetchTotalGramsAndMeals();
  }, [selectedPet]);
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

  const calculateAgeInMonths = (birthdate) => {
    const birthDate = new Date(birthdate);
    const currentDate = new Date();
    return differenceInMonths(currentDate, birthDate);
  };

  const ageInMonths = selectedPet
    ? calculateAgeInMonths(selectedPet.birthdate)
    : 0;

  let nextMeals = [];

  if (ageInMonths <= 3) {
    nextMeals = [
      { id: 1, date: "2023-06-15", time: "07:00", type: "Desayuno" },
      { id: 2, date: "2023-06-15", time: "11:00", type: "Almuerzo" },
      { id: 3, date: "2023-06-15", time: "15:00", type: "Merienda" },
      { id: 4, date: "2023-06-15", time: "19:00", type: "Cena" },
    ];
  } else if (ageInMonths <= 11) {
    nextMeals = [
      { id: 1, date: "2023-06-15", time: "08:00", type: "Desayuno" },
      { id: 2, date: "2023-06-15", time: "13:00", type: "Almuerzo" },
      { id: 3, date: "2023-06-15", time: "18:00", type: "Cena" },
    ];
  } else {
    nextMeals = [
      { id: 1, date: "2023-06-15", time: "08:00", type: "Desayuno" },
      { id: 2, date: "2023-06-15", time: "18:00", type: "Cena" },
    ];
  }

  // Obtener la fecha y hora actual
  const currentTime = new Date();
  const currentHour = currentTime.getHours();

  // Filtrar comidas pendientes del día actual
  const pendingMealsToday = nextMeals.filter((meal) => {
    const mealTime = new Date();
    const [hours, minutes] = meal.time.split(":").map(Number);
    mealTime.setHours(hours, minutes);
    return mealTime > currentTime;
  });

  // Si no hay comidas pendientes, mostrar las del día siguiente
  const mealsToShow =
    pendingMealsToday.length > 0
      ? pendingMealsToday
      : nextMeals.map((meal) => {
          const tomorrow = new Date();
          tomorrow.setDate(currentTime.getDate() + 1);
          meal.date = tomorrow.toISOString().split("T")[0]; // Actualizar la fecha a mañana
          return meal;
        });

  // Obtener kilómetros caminados y tiempo total en la semana
  useEffect(() => {
    const fetchTotalKm = async () => {
      if (!selectedPet) return;

      const { id: petId } = selectedPet;
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      const { data, error } = await supabase
        .from("walks")
        .select("distance, total_time, day")
        .eq("pet_id", petId)
        .eq("completed", 3)
        .gte("day", oneWeekAgo.toISOString());

      if (error) {
        console.error("Error fetching walks data:", error);
        return;
      }

      const totalKm = data.reduce((sum, record) => {
        const distance = parseFloat(record.distance.replace(" km", ""));
        return sum + distance;
      }, 0);

      const totalTime = data.reduce((sum, record) => {
        const timeParts = record.total_time.split(" ");
        let minutes = 0;
        for (let i = 0; i < timeParts.length; i += 2) {
          const value = parseInt(timeParts[i]);
          const unit = timeParts[i + 1];
          if (unit === "h") {
            minutes += value * 60;
          } else if (unit === "min") {
            minutes += value;
          }
        }
        return sum + minutes;
      }, 0);

      // Inicializar un objeto para almacenar los kilómetros por día
      const activityByDay = {
        L: 0,
        M: 0,
        X: 0,
        J: 0,
        V: 0,
        S: 0,
        D: 0,
      };

      // Iterar sobre los datos y sumar los kilómetros a los días correspondientes
      data.forEach((record) => {
        const date = new Date(record.day);
        const day = date.getDay(); // 0 (Domingo) - 6 (Sábado)
        const dayMap = ["D", "L", "M", "X", "J", "V", "S"];
        const dayLetter = dayMap[day];
        const distance = parseFloat(record.distance.replace(" km", ""));
        activityByDay[dayLetter] += distance;
      });

      // Actualizar el estado weeklyActivity con los datos procesados
      setWeeklyActivity([
        { day: "L", km: activityByDay.L },
        { day: "M", km: activityByDay.M },
        { day: "X", km: activityByDay.X },
        { day: "J", km: activityByDay.J },
        { day: "V", km: activityByDay.V },
        { day: "S", km: activityByDay.S },
        { day: "D", km: activityByDay.D },
      ]);

      setTotalKm(totalKm);
      setTotalTime(totalTime);
    };

    fetchTotalKm();
  }, [selectedPet]);
  // Obtener paseos pendientes
  useEffect(() => {
    const fetchPendingWalks = async () => {
      if (!selectedPet) return;

      const { id: petId } = selectedPet;

      const { data, error } = await supabase
        .from("walks")
        .select("id, day, total_time, completed")
        .eq("pet_id", petId)
        .eq("completed", 1);

      if (error) {
        console.error("Error fetching pending walks data:", error);
        return;
      }

      setPendingWalks(data);
    };

    fetchPendingWalks();
  }, [selectedPet]);

  const maxKm = Math.max(...weeklyActivity.map((day) => day.km));

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

  ///
  const [weight, setWeight] = useState(0);
  const [weightData, setWeightData] = useState([]);
  // Obtener datos de peso
  useEffect(() => {
    const fetchWeightData = async () => {
      if (!selectedPet) return;

      const { id: petId } = selectedPet;

      const { data, error } = await supabase
        .from("weight_history")
        .select("weight, created_at")
        .eq("pet_id", petId) // No se ordena por fecha de creación
        .order("created_at", { ascending: true }); // Mantén el orden que prefieras

      if (error) {
        console.error("Error fetching weight data:", error);
        return;
      }

      if (data.length > 0) {
        // Establece el peso más reciente
        setWeight(data[data.length - 1].weight); // Usa el último registro como el más reciente
      }

      // Procesar los datos obtenidos
      const processedData = data.map((record) => ({
        weight: record.weight,
        date: new Date(record.created_at).toLocaleDateString("default", {
          month: "short",
          year: "numeric",
        }),
      }));

      setWeightData(processedData);
    };

    fetchWeightData();
  }, [selectedPet]);

  // Función para obtener los datos de peso
  const fetchWeightData = async () => {
    if (!selectedPet) return;

    const { id: petId } = selectedPet;

    const { data, error } = await supabase
      .from("weight_history")
      .select("weight, created_at")
      .eq("pet_id", petId)
      .order("created_at", { ascending: true }); // Mantén el orden que prefieras

    if (error) {
      console.error("Error fetching weight data:", error);
      return;
    }

    if (data.length > 0) {
      setWeight(data[data.length - 1].weight); // Usar el último registro para el peso más reciente
    }

    // Procesar los datos obtenidos
    const processedData = data.map((record) => ({
      weight: record.weight,
      date: new Date(record.created_at).toLocaleDateString("default", {
        month: "short",
        year: "numeric",
      }),
    }));

    setWeightData(processedData);
  };

  // Función para manejar la inserción o actualización del peso
  const handleWeightSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPet) return;

    const { id: petId } = selectedPet;
    const currentDate = new Date().toISOString().split("T")[0]; // Obtiene solo la fecha (YYYY-MM-DD)

    // Verificar si ya existe un registro para el mismo día usando date_trunc
    const { data: existingRecord, error: fetchError } = await supabase
      .from("weight_history")
      .select("*")
      .eq("pet_id", petId)
      .gte("created_at", `${currentDate}T00:00:00.000Z`)
      .lte("created_at", `${currentDate}T23:59:59.999Z`); // Comparación explícita por fecha

    if (fetchError) {
      console.error("Error fetching weight data:", fetchError);
      return;
    }

    if (existingRecord.length > 0) {
      // Actualizar el registro existente si ya hay un registro en la fecha actual
      const { error: updateError } = await supabase
        .from("weight_history")
        .update({ weight })
        .eq("id", existingRecord[0].id); // Actualiza el registro por ID

      if (updateError) {
        console.error("Error updating weight data:", updateError);
        return;
      }
    } else {
      // Insertar un nuevo registro si no hay uno existente para hoy
      const createdAt = new Date().toISOString();
      const { error: insertError } = await supabase
        .from("weight_history")
        .insert([{ pet_id: petId, weight, created_at: createdAt }]);
      toast({
        title: "¡Éxito!",
        description: "Información de peso guardada con éxito.",
      });

      if (insertError) {
        console.error("Error inserting weight data:", insertError);
        return;
      }
    }

    // Actualizar el campo weight en la tabla pets
    const { error: petUpdateError } = await supabase
      .from("pets")
      .update({ weight })
      .eq("id", petId); // Actualiza el campo weight del pet en la tabla pets

    if (petUpdateError) {
      console.error("Error updating pet weight data:", petUpdateError);
      return;
    }

    // Mostrar notificación de éxito para la actualización de pets
    toast({
      title: "¡Éxito!",
      description: "El peso de la mascota se ha actualizado correctamente.",
    });

    // Llamar a fetchWeightData después de la inserción o actualización
    await fetchWeightData();
  };

  const chartDataWeight = {
    labels: weightData.map((data) => data.date),
    datasets: [
      {
        label: "Peso (kg)",
        data: weightData.map((data) => data.weight),
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
  useEffect(() => {
    fetchAppointments();
  }, [selectedPet]);

  const fetchAppointments = async () => {
    if (!selectedPet) return;

    const { id: petId } = selectedPet;

    const { data, error } = await supabase
      .from("appointments")
      .select("id, reason, date, status")
      .eq("pet_id", petId);

    if (error) {
      console.error("Error fetching appointments:", error);
      return;
    }

    setAppointments(data);
  };

  const cancelAppointment = async (appointmentId) => {
    const { error } = await supabase
      .from("appointments")
      .update({ status: 3 })
      .eq("id", appointmentId);

    if (error) {
      console.error("Error cancelling appointment:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          "No se pudo cancelar la cita. Por favor, intente de nuevo.",
      });
      return;
    }

    toast({
      title: "Cita cancelada",
      description: "La cita ha sido cancelada exitosamente.",
    });

    fetchAppointments();
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 1:
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 2:
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 3:
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 1:
        return "Pendiente";
      case 2:
        return "Aprobada";
      case 3:
        return "Rechazada";
      default:
        return "Desconocido";
    }
  };
  // Obtener actividades de aseo
  // Obtener actividades de aseo
  useEffect(() => {
    const fetchGroomingActivities = async () => {
      if (!selectedPet) return;

      const { id: petId } = selectedPet;

      const { data, error } = await supabase
        .from("grooming_activities")
        .select("type, date, completed")
        .eq("pet_id", petId);

      if (error) {
        console.error("Error fetching grooming activities:", error);
        return;
      }

      // Asegurarse de que las fechas se traten correctamente sin horas
      const adjustedData = data.map((activity) => ({
        ...activity,
        date: new Date(activity.date + "T00:00:00"), // Añade un tiempo fijo para evitar problemas
      }));

      setGroomingActivities(adjustedData);

      // Contar el total de baños completados
      const bathsCount = adjustedData.filter(
        (activity) => activity.type === "Baño" && activity.completed === 2
      ).length;

      setTotalBaths(bathsCount);

      // Contar el total de cortes de pelo y uñas completados
      const cutsCount = adjustedData.filter(
        (activity) =>
          (activity.type === "Corte de pelo" ||
            activity.type === "Corte de uñas") &&
          activity.completed === 2
      ).length;

      setTotalCuts(cutsCount);

      // Contar el total de cepillados completados
      const brushingsCount = adjustedData.filter(
        (activity) => activity.type === "Cepillado" && activity.completed === 2
      ).length;

      setTotalBrushings(brushingsCount);
    };

    fetchGroomingActivities();
  }, [selectedPet]);

  //calcular sueño
  const fetchSleepLogs = async () => {
    if (!selectedPet || !selectedPet.id) {
      return; // No hacer nada si no hay una mascota seleccionada
    }

    const { data, error } = await supabase
      .from("sleep_patterns")
      .select("*")
      .eq("pet_id", selectedPet.id)
      .order("date", { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Hubo un error al obtener los registros de sueño.",
        variant: "destructive",
      });
    } else {
      const formattedLogs = data.map((entry) => ({
        id: entry.id,
        duration: formatTimeFromSupabase(entry.total_time), // Convertir el formato
        timestamp: new Date(entry.date).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
        date: new Date(entry.date), // Formato ISO para comparaciones
        displayDate: new Date(entry.date).toLocaleDateString("es-ES"),
      }));
      setSleepLog(formattedLogs);
    }
  };

  useEffect(() => {
    if (selectedPet && selectedPet.id) {
      fetchSleepLogs();
    }
  }, [selectedPet]);
  const getCurrentDateTimeForSupabase = () => {
    return new Date().toISOString(); // Formato ISO 8601
  };
  const calculateNapsPerDay = (logs: SleepEntry[]) => {
    const napsPerDay: Record<string, number> = {};

    logs.forEach((entry) => {
      const date = entry.displayDate;
      if (!napsPerDay[date]) {
        napsPerDay[date] = 0;
      }
      napsPerDay[date] += 1; // Contar una siesta para este día
    });

    return napsPerDay;
  };
  const getAgeInYears = (birthDate: Date) => {
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      return age - 1;
    }
    return age;
  };

  const formatTimeFromSupabase = (timeFloat: number) => {
    // Convertir el número float en horas y minutos
    const hours = Math.floor(timeFloat); // Parte entera como horas
    const minutes = Math.round((timeFloat - hours) * 100); // Parte decimal como minutos

    // Formatear horas y minutos para tener siempre dos dígitos
    const formattedHours = hours.toString().padStart(2, "0");
    const formattedMinutes = minutes.toString().padStart(2, "0");

    // Combinar horas y minutos en el formato deseado
    return `${formattedHours}:${formattedMinutes}`;
  };

  // Calcular el promedio de siestas por día
  const calculateAverageNapsPerDay = (napsPerDay: Record<string, number>) => {
    const totalDays = Object.keys(napsPerDay).length;
    const totalNaps = Object.values(napsPerDay).reduce(
      (acc, naps) => acc + naps,
      0
    );
    const averageNaps = totalDays > 0 ? totalNaps / totalDays : 0;

    return averageNaps.toFixed(1); // Redondear a un decimal
  };

  // Usar las funciones en tu componente
  const napsPerDay = calculateNapsPerDay(sleepLog);
  const averageNapsPerDay = calculateAverageNapsPerDay(napsPerDay);

  //calular calidad del sueño
  const getRecommendedSleep = (age: number) => {
    let recommendedHours;
    if (age < 1) {
      recommendedHours = 18; // Horas recomendadas para cachorros
    } else if (age < 7) {
      recommendedHours = 12; // Horas recomendadas para adultos
    } else {
      recommendedHours = 14; // Horas recomendadas para mayores
    }

    return {
      range: age < 1 ? "18-20 horas" : age < 7 ? "12-14 horas" : "14-18 horas",
      nightly: age < 1 ? "10-12 horas" : age < 7 ? "8-10 horas" : "10-12 horas",
      recommendedHours,
    };
  };
  const getRecommendedNaps = (age: number) => {
    if (age < 1) {
      return "6-10 siestas de 30 minutos a 2 horas ";
    } else if (age < 7) {
      return "3-5 siestas, desde unos minutos hasta un par de horas";
    } else {
      return "4-6 siestas";
    }
  };

  const age = selectedPet ? getAgeInYears(new Date(selectedPet.birthdate)) : 0;
  const recommendedNaps = getRecommendedNaps(age);
  const {
    range: recommendedSleep,
    nightly: nightlySleep,
    recommendedHours,
  } = getRecommendedSleep(age);

  useEffect(() => {
    // Inicializa la fecha seleccionada en la fecha de hoy
    const today = new Date();
    setSelectedDate(today);
  }, []);
  const calculateDailySleep = (logs: SleepEntry[]) => {
    const dailySleep: Record<string, number> = {};

    logs.forEach((entry) => {
      const [hours, minutes] = entry.duration.split(":").map(Number);
      const sleepMinutes =
        (isNaN(hours) ? 0 : hours * 60) + (isNaN(minutes) ? 0 : minutes);
      const date = entry.displayDate;

      if (!dailySleep[date]) {
        dailySleep[date] = 0;
      }
      dailySleep[date] += sleepMinutes;
    });

    return dailySleep;
  };
  const calculateAverageSleep = (dailySleep: Record<string, number>) => {
    const totalDays = Object.keys(dailySleep).length;
    const totalMinutes = Object.values(dailySleep).reduce(
      (acc, minutes) => acc + minutes,
      0
    );
    const averageMinutes = totalDays > 0 ? totalMinutes / totalDays : 0;
    const averageHours = Math.floor(averageMinutes / 60);
    const averageRemainingMinutes = Math.round(averageMinutes % 60); // Cambiado el nombre a averageRemainingMinutes

    return { averageHours, averageRemainingMinutes };
  };
  const dailySleep = calculateDailySleep(sleepLog);
  const { averageHours, averageRemainingMinutes } =
    calculateAverageSleep(dailySleep);

  const calculateSleepQuality = (
    averageHours: number,
    averageRemainingMinutes: number,
    recommendedHours: number
  ) => {
    // Convertir promedio de sueño a un número decimal
    const averageSleepHours = averageHours + averageRemainingMinutes / 60;

    // Calcular porcentaje de sueño registrado respecto a las horas recomendadas
    const percentage = Math.min(
      Math.round((averageSleepHours / recommendedHours) * 100),
      100
    );

    // Determinar la calidad del sueño basada en el porcentaje
    let qualityMessage = "";

    if (percentage >= 90) {
      qualityMessage = "Excelente";
    } else if (percentage >= 75) {
      qualityMessage = "Bueno";
    } else if (percentage >= 50) {
      qualityMessage = "Aceptable";
    } else {
      qualityMessage = "Necesita mejorar";
    }

    return { percentage, qualityMessage };
  };

  // Usar la función en tu componente
  const { percentage, qualityMessage } = calculateSleepQuality(
    averageHours,
    averageRemainingMinutes,
    recommendedHours
  );

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
  // Preparar los datos para la gráfica
  const sleepByDay = calculateSleepByDayOfWeek(sleepLog);

  const dataSleep = {
    labels: ["L", "M", "X", "J", "V", "S", "D"],
    datasets: [
      {
        label: "Horas de sueño",
        data: [
          sleepByDay.Mon,
          sleepByDay.Tue,
          sleepByDay.Wed,
          sleepByDay.Thu,
          sleepByDay.Fri,
          sleepByDay.Sat,
          sleepByDay.Sun,
        ],
        backgroundColor: "rgba(34, 197, 94, 0.5)", // Tailwind green-500 with opacity
      },
    ],
  };

  //calculae emociones

  useEffect(() => {
    const fetchAverageHappiness = async () => {
      if (!selectedPet) return;

      const { id: petId } = selectedPet;

      const { data, error } = await supabase
        .from("emotions")
        .select("happiness_level")
        .eq("pet_id", petId);

      if (error) {
        console.error("Error fetching happiness data:", error);
        return;
      }

      if (data.length > 0) {
        const totalHappiness = data.reduce(
          (sum, record) => sum + record.happiness_level,
          0
        );
        const average = totalHappiness / data.length;
        const scaledAverage = average * 3.33; // Escalar de 1-3 a 0-10
        setAverageHappiness(scaledAverage);
        setHappinessDescription(mapHappinessToDescription(scaledAverage));
      }
    };

    fetchAverageHappiness();
  }, [selectedPet]);

  const mapHappinessToDescription = (average) => {
    if (average <= 2) return "Muy malo";
    if (average <= 4) return "Malo";
    if (average <= 6) return "Regular";
    if (average <= 8) return "Bueno";
    if (average <= 9) return "Muy bueno";
    return "Excelente";
  };
  useEffect(() => {
    const fetchAverageEmotions = async () => {
      if (!selectedPet) return;

      const { id: petId } = selectedPet;

      const { data, error } = await supabase
        .from("emotions")
        .select(
          "happiness_level, energy_level, calm_level, curiosity_level, affection_level, trust_level"
        )
        .eq("pet_id", petId);

      if (error) {
        console.error("Error fetching emotions data:", error);
        return;
      }

      if (data.length > 0) {
        const totalEmotions = data.reduce(
          (totals, record) => {
            totals.happiness += record.happiness_level;
            totals.energy += record.energy_level;
            totals.calm += record.calm_level;
            totals.curiosity += record.curiosity_level;
            totals.affection += record.affection_level;
            totals.trust += record.trust_level;
            return totals;
          },
          {
            happiness: 0,
            energy: 0,
            calm: 0,
            curiosity: 0,
            affection: 0,
            trust: 0,
          }
        );

        const averages = {
          happiness: (totalEmotions.happiness / data.length) * 3.33,
          energy: (totalEmotions.energy / data.length) * 3.33,
          calm: (totalEmotions.calm / data.length) * 3.33,
          curiosity: (totalEmotions.curiosity / data.length) * 3.33,
          affection: (totalEmotions.affection / data.length) * 3.33,
          trust: (totalEmotions.trust / data.length) * 3.33,
        };

        setAverageEmotions(averages);
      }
    };

    fetchAverageEmotions();
  }, [selectedPet]);
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
        data: [
          averageEmotions.happiness.toFixed(1),
          averageEmotions.energy.toFixed(1),
          averageEmotions.calm.toFixed(1),
          averageEmotions.curiosity.toFixed(1),
          averageEmotions.affection.toFixed(1),
          averageEmotions.trust.toFixed(1),
        ],
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
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
  const [medications, setMedications] = useState([]);
  const fetchMedications = async () => {
    if (!selectedPet || !selectedPet.id) return;

    const supabase = createClient();
    const { data, error } = await supabase
      .from("medications")
      .select("id, name, frequency")
      .eq("pet_id", selectedPet.id);

    if (error) {
      console.error("Error fetching medications:", error.message);
      return;
    }

    setMedications(data);
  };
  useEffect(() => {
    fetchMedications();
  }, [selectedPet]);
  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card className="mb-6">
        <CardHeader className="bg-[conic-gradient(at_bottom_left,_var(--tw-gradient-stops))] from-yellow-200 via-emerald-200 to-yellow-200  text-primary-foreground">
          <CardTitle className="text-2xl flex items-center gap-2">
            <Dog className="w-6 h-6" />
            {selectedPet
              ? `Monitoreo de salud de ${selectedPet.name}`
              : "Monitoreo de salud"}
          </CardTitle>
          <CardDescription className="text-primary-foreground/80">
            Mantén a tu perro saludable y feliz.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!selectedPet ? (
            <div className="text-center p-8">
              <Dog className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <p className="text-lg text-gray-500">
                Por favor, selecciona una mascota para ver los detalles de
                salud.
              </p>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-4 mt-4">
                <span>Estado general:</span>
                <Badge
                  variant="outline"
                  className="bg-green-100 text-green-800"
                >
                  Saludable
                </Badge>
              </div>
              <Progress value={80} className="mb-2" />
              <p className="text-sm text-muted-foreground">
                Tu perro está en buena forma. Mantén el buen trabajo.
              </p>
            </>
          )}
        </CardContent>
      </Card>
      {selectedPet && (
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
                  <p className="text-2xl font-bold">{totalgrams} g</p>
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

              <div className="space-y-2">
                <h3 className="font-semibold flex items-center">
                  <Calendar className="mr-2 h-4 w-4" />
                  Próxima comida
                </h3>
                {pendingMealsToday.length > 0 ? (
                  <div>
                    {pendingMealsToday.slice(0, 1).map((meal) => (
                      <div
                        key={meal.id}
                        className="flex justify-between items-center bg-muted p-2 rounded"
                      >
                        <span className="flex items-center">
                          <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                          {meal.time}
                        </span>
                        <span>{meal.type}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="flex justify-between items-center bg-muted p-2 rounded">
                    No hay comidas pendientes
                  </p>
                )}
              </div>

              {/* Próximas comidas */}
              <div className="space-y-2">
                <h3 className="font-semibold flex items-center">
                  <Apple className="mr-2 h-4 w-4" />
                  Próximas comidas
                </h3>
                <ul className="space-y-2">
                  {mealsToShow.slice(0).map((meal) => (
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

              <Link href="/dashboard/nutrition" className="block">
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
                  <p className="text-2xl font-bold">
                    {Math.floor(totalTime / 60)} h {totalTime % 60} min
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold flex items-center">
                  <Activity className="mr-2 h-4 w-4" />
                  Actividad semanal
                </h3>
                <div>
                  <Bar
                    data={chartDataActivity}
                    options={chartOptionsActivity}
                  />
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
                      {new Date(pendingWalks[0].day).toLocaleDateString()}
                    </span>
                    <span>{pendingWalks[0].total_time}</span>
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
                {pendingWalks.length > 0 ? (
                  <ul className="space-y-2">
                    {pendingWalks.map((walk) => (
                      <li
                        key={walk.id}
                        className="flex justify-between items-center text-sm"
                      >
                        <span className="flex items-center">
                          <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                          {new Date(walk.day).toLocaleDateString()}
                        </span>
                        <span>{walk.total_time}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No hay paseos pendientes
                  </p>
                )}
              </div>

              <Link href="/dashboard/walk" className="block">
                <Button variant="outline" className="w-full">
                  Administrar paseos
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      )}
      {selectedPet && (
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
      )}
      {selectedPet && (
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
                {medications.map((medication) => (
                  <li
                    key={medication.id}
                    className="flex justify-between items-center"
                  >
                    <span>{medication.name}</span>
                    <Badge>{medication.frequency}</Badge>
                  </li>
                ))}
              </ul>
              <Link href="/dashboard/medical" className="block mt-6">
                <Button variant="outline" className="w-full">
                  Administrar medicamentos
                </Button>
              </Link>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-primary">
                <Calendar className="mr-2" />
                Próximas citas
              </CardTitle>
            </CardHeader>
            <CardContent>
              {appointments.length > 0 ? (
                <ul className="space-y-2">
                  {appointments.map((appointment) => (
                    <li
                      key={appointment.id}
                      className="flex justify-between items-center"
                    >
                      <span className="flex items-center">
                        <TooltipProvider>
                          <Tooltipp>
                            <TooltipTrigger>
                              {getStatusIcon(appointment.status)}
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{getStatusText(appointment.status)}</p>
                            </TooltipContent>
                          </Tooltipp>
                        </TooltipProvider>
                        <span className="ml-2">{appointment.reason}</span>
                      </span>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">
                          {new Date(appointment.date).toLocaleDateString(
                            "es-ES",
                            {
                              day: "numeric",
                              month: "long",
                            }
                          )}
                        </Badge>
                        {appointment.status !== 3 && (
                          <TooltipProvider>
                            <Tooltipp>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() =>
                                    cancelAppointment(appointment.id)
                                  }
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Cancelar cita</p>
                              </TooltipContent>
                            </Tooltipp>
                          </TooltipProvider>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No hay citas programadas
                </p>
              )}
              <TooltipProvider delayDuration={0}>
                <FinalAppointment />
              </TooltipProvider>
            </CardContent>
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
                  {groomingActivities.map((activity, index) => (
                    <li
                      key={index}
                      className="flex justify-between items-center"
                    >
                      <span>{activity.type}</span>
                      <Badge variant="outline">
                        {new Date(activity.date).toLocaleDateString("es-ES", {
                          day: "numeric",
                          month: "long",
                        })}
                      </Badge>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Estadísticas de aseo mensual
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex items-center">
                    <Droplet className="mr-2 h-5 w-5 text-blue-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">Baños</p>
                      <p className="text-2xl font-bold">{totalBaths}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Scissors className="mr-2 h-5 w-5 text-green-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">Cortes</p>
                      <p className="text-2xl font-bold">{totalCuts}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Paintbrush className="mr-2 h-5 w-5 text-purple-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Cepillados
                      </p>
                      <p className="text-2xl font-bold">{totalBrushings}</p>
                    </div>
                  </div>
                </div>
              </div>
              <Link href="/dashboard/grooming" className="block">
                <Button variant="outline" className="w-full">
                  <Calendar className="mr-2 h-4 w-4" /> Administrar aseo
                </Button>
              </Link>
            </CardContent>
            <CardFooter></CardFooter>
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <Clock className="mr-2 h-5 w-5 text-blue-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Promedio diario
                      </p>
                      <p className="text-xl font-bold">
                        {averageHours}.
                        {averageRemainingMinutes.toString().padStart(2, "0")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Sun className="mr-2 h-5 w-5 text-yellow-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Siestas promedio
                      </p>
                      <p className="text-xl font-bold">{averageNapsPerDay}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Zap className="mr-2 h-5 w-5 text-purple-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Calidad de sueño
                      </p>
                      <p className="text-xl font-bold">{qualityMessage}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className=" w-full">
                <Bar options={optionsSleep} data={dataSleep} />
              </div>
              <Link href="/dashboard/sleep" className="block">
                <Button variant="outline" className="w-full">
                  <Moon className="mr-2 h-4 w-4" /> Registrar sueño
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      )}
      {selectedPet && (
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
                <h3 className="text-lg font-semibold mb-2">
                  Resumen emocional
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex items-center">
                    <Heart className="mr-2 h-5 w-5 text-red-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Felicidad promedio
                      </p>
                      <p className="text-2xl font-bold">
                        {averageHappiness.toFixed(1)}/10
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Zap className="mr-2 h-5 w-5 text-yellow-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Energía promedio
                      </p>
                      <p className="text-2xl font-bold">
                        {averageEmotions.energy.toFixed(1)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Dog className="mr-2 h-5 w-5 text-blue-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Estado general
                      </p>
                      <p className="text-2xl font-bold">
                        {happinessDescription}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="h-96 w-full flex justify-center ">
                <Radar options={optionsEmotions} data={dataEmotions} />
              </div>
              <Link href="/dashboard/emotions" className="block">
                <Button variant={"outline"} className="w-full">
                  <Dog className="mr-2 h-4 w-4" /> Registrar emociones
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
