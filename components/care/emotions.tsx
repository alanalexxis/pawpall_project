import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  SmilePlus,
  Frown,
  Meh,
  Smile,
  Dog,
  RocketIcon,
  Trash,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useSelectedPet } from "@/contexts/selectedPetContext";
import { motion } from "framer-motion";
import useWindowSize from "react-use/lib/useWindowSize";
import Confetti from "react-confetti";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { createClient } from "@/utils/supabase/client";
import { toast } from "../ui/use-toast";
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
import { Badge } from "../ui/badge";

export default function Emotions() {
  const supabase = createClient();
  const { selectedPet } = useSelectedPet();
  const [energyLevel, setEnergyLevel] = useState(null);
  const [calmLevel, setCalmLevel] = useState(null);
  const [affectionLevel, setAffectionLevel] = useState(null);
  const [curiosityLevel, setCuriosityLevel] = useState(null);
  const [trustLevel, setTrustLevel] = useState(null);
  const [happinessLevel, setHappinessLevel] = useState(null);
  const { width, height } = useWindowSize();
  const [showConfetti, setShowConfetti] = useState(false);

  const [moodHistory, setMoodHistory] = useState([]);
  const [dailyMood, setDailyMood] = useState(null);
  const [hasEntryForToday, setHasEntryForToday] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false); // Estado para el modal
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [reload, setReload] = useState(false); // Estado de recarga

  useEffect(() => {
    if (!selectedPet || !selectedPet.id) {
      return; // No hacer nada si no hay una mascota seleccionada
    }

    const fetchData = async () => {
      const today = new Date().toISOString().split("T")[0];
      const { data, error } = await supabase
        .from("emotions")
        .select("*")
        .eq("pet_id", selectedPet.id)
        .eq("date", today);

      if (error) {
        console.error("Error fetching data:", error);
      } else {
        if (data.length > 0) {
          setHasEntryForToday(true);
          const latestEntry = data[0]; // Suponiendo que solo hay una entrada por día
          setEnergyLevel(latestEntry.energy_level);
          setCalmLevel(latestEntry.calm_level);
          setCuriosityLevel(latestEntry.curiosity_level);
          setAffectionLevel(latestEntry.affection_level);
          setTrustLevel(latestEntry.trust_level);
          setHappinessLevel(latestEntry.happiness_level);
          setDailyMood(latestEntry.mood_level);
        } else {
          setHasEntryForToday(false);
        }
      }
    };

    fetchData();
  }, [selectedPet, reload]); // Cambia `selectedPet.id` por `selectedPet` en la dependencia

  useEffect(() => {
    if (happinessLevel !== null) {
      insertEmotions();
    }
  }, [happinessLevel]);

  const getMoodIcon = (moodValue) => {
    if (moodValue == 0) return <Smile className="w-16 h-16 text-green-500" />;
    if (moodValue <= 33) return <Frown className="w-16 h-16 text-red-500" />;
    if (moodValue < 66) return <Meh className="w-16 h-16 text-yellow-500" />;
    return <Smile className="w-16 h-16 text-green-500" />;
  };

  const getRecommendation = (moodPercentage) => {
    if (calculateMoodPercentage() <= 20) {
      return "Tu perro está muy triste. Intenta pasar más tiempo con él, tal vez un largo paseo o un rato de juego. Si su tristeza persiste, considera consultar a un veterinario para descartar problemas de salud.";
    }
    if (moodPercentage <= 33) {
      return "Tu perro parece estar triste. Considera darle un paseo o jugar con él para levantar su ánimo. Si su tristeza continúa, puede ser útil consultar con un veterinario.";
    }
    if (moodPercentage <= 50) {
      return "Tu perro está bien, pero podrías mejorar su día con una golosina o un poco de atención extra. Si notas algún cambio inusual en su comportamiento, no dudes en hablar con un veterinario.";
    }
    if (moodPercentage <= 66) {
      return "Tu perro está en un buen estado de ánimo. ¿Por qué no intentas mantenerlo así con un poco de juego?";
    }
    if (moodPercentage <= 80) {
      return "¡Tu perro está feliz! Sigue así con los cuidados que le das.";
    }
    return "¡Tu perro está en un estado de ánimo excelente! Continúa con las buenas prácticas y tu perro estará muy contento.";
  };

  const attributes = [
    { name: "Energía", value: energyLevel },
    { name: "Calma", value: calmLevel },
    { name: "Curiosidad", value: curiosityLevel },
    { name: "Afecto", value: affectionLevel },
    { name: "Confianza", value: trustLevel },
    { name: "Felicidad", value: happinessLevel },
  ];

  const descriptionMap = {
    1: "Bajo",
    2: "Moderado",
    3: "Alto",
  };

  const handleHappinessChange = (level) => {
    setHappinessLevel(level);
    setShowConfetti(true);
  };

  const insertEmotions = async () => {
    if (!hasEntryForToday) {
      // Solo insertar si no hay entrada para hoy
      const today = new Date().toISOString().split("T")[0];

      const { data, error } = await supabase.from("emotions").insert([
        {
          date: today,
          pet_id: selectedPet.id,
          energy_level: energyLevel,
          calm_level: calmLevel,
          curiosity_level: curiosityLevel,
          affection_level: affectionLevel,
          trust_level: trustLevel,
          happiness_level: happinessLevel,
          mood_level: dailyMood,
        },
      ]);

      if (error) {
        toast({
          variant: "destructive",
          title: "¡Ups! Algo salió mal.",
          description: "Hubo un problema con tu solicitud.",
        });
      } else {
        toast({
          title: "¡Éxito!",
          description: "La información de emociones se guardó con éxito.",
        });
        setHasEntryForToday(true);
        setReload(!reload); // Cambia el estado de recarga
      }
    }
  };

  const calculateMoodPercentage = () => {
    const totalAttributes =
      energyLevel +
      calmLevel +
      curiosityLevel +
      affectionLevel +
      trustLevel +
      happinessLevel +
      dailyMood;

    // El valor máximo posible es 18 (6 atributos * 3)
    const maxPossibleValue = 21;

    // Calcula el porcentaje
    const moodPercentage = (totalAttributes / maxPossibleValue) * 100;

    return Math.round(moodPercentage);
  };
  const moodPercentage = calculateMoodPercentage();
  const handleDelete = async () => {
    const today = new Date().toISOString().split("T")[0];
    const { error } = await supabase
      .from("emotions")
      .delete()
      .eq("pet_id", selectedPet.id)
      .eq("date", today);

    if (error) {
      toast({
        variant: "destructive",
        title: "¡Error al eliminar!",
        description: "No se pudo eliminar el registro de emociones.",
      });
    } else {
      toast({
        title: "¡Éxito!",
        description: "Información eliminada con éxito.",
      });
      // Restablecer los estados locales
      setEnergyLevel(null);
      setCalmLevel(null);
      setCuriosityLevel(null);
      setAffectionLevel(null);
      setTrustLevel(null);
      setHappinessLevel(null);
      setDailyMood(null);
      setHasEntryForToday(false);
      setReload(!reload); // Cambia el estado de recarga
    }
  };
  // Formatear la fecha seleccionada
  const formattedDate = selectedDate.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  useEffect(() => {
    if (!selectedPet || !selectedPet.id) {
      return; // No hacer nada si no hay una mascota seleccionada
    }
    const fetchMoodHistory = async () => {
      const today = new Date();
      const sevenDaysAgo = new Date(today);
      sevenDaysAgo.setDate(today.getDate() - 6);

      const { data, error } = await supabase
        .from("emotions")
        .select(
          "date, energy_level, calm_level, curiosity_level, affection_level, trust_level, happiness_level, mood_level"
        )
        .eq("pet_id", selectedPet.id)
        .gte("date", sevenDaysAgo.toISOString().split("T")[0]);

      if (error) {
        console.error("Error fetching mood history:", error);
      } else {
        // Crear un array para asegurarse de que cada día tenga un registro, incluso si está vacío
        const moodHistoryData = Array.from({ length: 7 }, (_, i) => {
          const date = new Date(
            Date.now() - (6 - i) * 24 * 60 * 60 * 1000
          ).toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          });

          // Buscar si hay datos para la fecha actual
          const entry = data.find((item) => {
            const entryDate = new Date(item.date).toLocaleDateString("es-ES", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            });
            return entryDate === date;
          });

          if (entry) {
            const totalAttributes =
              entry.energy_level +
              entry.calm_level +
              entry.curiosity_level +
              entry.affection_level +
              entry.trust_level +
              entry.happiness_level +
              entry.mood_level;

            const maxPossibleValue = 21;
            const moodPercentage = Math.round(
              (totalAttributes / maxPossibleValue) * 100
            );

            return {
              date,
              ánimo: moodPercentage,
            };
          } else {
            // Si no hay datos para ese día, devuelve un valor de humor predeterminado (por ejemplo, 0)
            return {
              date,
              ánimo: 0, // O el valor que consideres apropiado
            };
          }
        });

        setMoodHistory(moodHistoryData);
      }
    };

    fetchMoodHistory();
  }, [selectedPet, reload]); // C
  return (
    <>
      {showConfetti && (
        <div
          className="fixed inset-0 z-50 pointer-events-none"
          style={{ overflow: "hidden" }}
        >
          <Confetti width={width} height={height} recycle={false} />
        </div>
      )}
      <div className="w-full max-w-4xl mx-auto space-y-6 p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="w-full max-w-4xl mx-auto mb-8">
            <CardHeader className="bg-primary text-primary-foreground">
              <CardTitle className="text-2xl flex items-center gap-2">
                <Dog className="w-8 h-8" />
                {selectedPet
                  ? `Salud emocional de ${selectedPet.name}`
                  : "Monitoreo de salud emocional"}
              </CardTitle>
              <CardDescription className="text-primary-foreground/80">
                Mantén a tu perro equilibrado y feliz
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {selectedPet ? (
                <>
                  <div className="flex justify-center mb-6">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 260,
                        damping: 20,
                      }}
                    >
                      {getMoodIcon(moodPercentage)}
                    </motion.div>
                  </div>
                  <Progress
                    value={moodPercentage}
                    className="w-full h-4 mb-4"
                  />
                  <p className="text-center mb-6 text-lg font-semibold">
                    Estado de ánimo actual: {moodPercentage}%
                  </p>
                  {hasEntryForToday &&
                    selectedPet &&
                    (moodPercentage <= 50 ? (
                      <Alert variant="destructive">
                        <ExclamationTriangleIcon className="h-4 w-4" />
                        <AlertTitle>Alerta de estado de ánimo</AlertTitle>
                        <AlertDescription>
                          {getRecommendation(moodPercentage)}
                        </AlertDescription>
                      </Alert>
                    ) : (
                      <Alert>
                        <RocketIcon className="h-4 w-4" />
                        <AlertTitle>Recomendación</AlertTitle>
                        <AlertDescription>
                          {getRecommendation(moodPercentage)}
                        </AlertDescription>
                      </Alert>
                    ))}
                  <Card className="mb-6 mt-6">
                    <CardHeader>
                      <CardTitle className="text-lg">
                        Estado de ánimo en los últimos 7 días
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={moodHistory}>
                          <XAxis dataKey="date" />
                          <YAxis domain={[0, 100]} />
                          <Tooltip />
                          <Line
                            type="monotone"
                            dataKey="ánimo"
                            stroke="#8884d8"
                            strokeWidth={2}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {!hasEntryForToday && dailyMood === null ? (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      <Card className="mb-6">
                        <CardHeader>
                          <CardTitle className="text-lg">
                            ¿Cómo se sintió tu perro hoy?
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <RadioGroup
                            onValueChange={(value) => {
                              setDailyMood(value);
                              setEnergyLevel(null); // Reset energy level when mood is selected
                              setCalmLevel(null); // Reset calm level when mood is selected
                              setCuriosityLevel(null); // Reset curiosity level when mood is selected
                              setAffectionLevel(null);
                              setTrustLevel(null);
                            }}
                            className="flex justify-between"
                          >
                            {[
                              {
                                value: 1,
                                icon: Frown,
                                color: "text-red-500",
                              },
                              {
                                value: 2,
                                icon: Meh,
                                color: "text-yellow-500",
                              },
                              {
                                value: 3,
                                icon: Smile,
                                color: "text-green-500",
                              },
                            ].map((item) => (
                              <div
                                key={item.value}
                                className="flex flex-col items-center"
                              >
                                <RadioGroupItem
                                  value={item.value}
                                  id={item.value}
                                  className="sr-only"
                                />
                                <Label
                                  htmlFor={item.value}
                                  className="cursor-pointer"
                                >
                                  <item.icon
                                    className={`w-12 h-12 ${item.color}`}
                                  />
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ) : (
                    <>
                      {!hasEntryForToday && energyLevel === null && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.2 }}
                        >
                          <Card className="mb-6">
                            <CardHeader>
                              <CardTitle className="text-lg">
                                ¿Cómo fue el nivel de energía de tu perro hoy?
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <RadioGroup
                                onValueChange={(value) =>
                                  setEnergyLevel(Number(value))
                                }
                                className="flex justify-between"
                              >
                                {[
                                  { label: "Bajo", value: 1 },
                                  { label: "Moderado", value: 2 },
                                  { label: "Alto", value: 3 },
                                ].map(({ label, value }) => (
                                  <div
                                    key={value}
                                    className="flex flex-col items-center"
                                  >
                                    <RadioGroupItem
                                      value={value.toString()}
                                      id={label}
                                      className="sr-only"
                                    />
                                    <Label
                                      htmlFor={label}
                                      className="cursor-pointer"
                                    >
                                      <span className="text-lg font-semibold">
                                        {label}
                                      </span>
                                    </Label>
                                  </div>
                                ))}
                              </RadioGroup>
                            </CardContent>
                          </Card>
                        </motion.div>
                      )}

                      {!hasEntryForToday &&
                        energyLevel !== null &&
                        calmLevel === null && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                          >
                            <Card className="mb-6">
                              <CardHeader>
                                <CardTitle className="text-lg">
                                  ¿Cómo fue el nivel de calma de tu perro hoy?
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <RadioGroup
                                  onValueChange={(value) =>
                                    setCalmLevel(Number(value))
                                  }
                                  className="flex justify-between"
                                >
                                  {[
                                    { label: "Bajo", value: 1 },
                                    { label: "Moderado", value: 2 },
                                    { label: "Alto", value: 3 },
                                  ].map(({ label, value }) => (
                                    <div
                                      key={value}
                                      className="flex flex-col items-center"
                                    >
                                      <RadioGroupItem
                                        value={value.toString()}
                                        id={label}
                                        className="sr-only"
                                      />
                                      <Label
                                        htmlFor={label}
                                        className="cursor-pointer"
                                      >
                                        <span className="text-lg font-semibold">
                                          {label}
                                        </span>
                                      </Label>
                                    </div>
                                  ))}
                                </RadioGroup>
                              </CardContent>
                            </Card>
                          </motion.div>
                        )}

                      {!hasEntryForToday &&
                        calmLevel !== null &&
                        curiosityLevel === null && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                          >
                            <Card className="mb-6">
                              <CardHeader>
                                <CardTitle className="text-lg">
                                  ¿Cómo fue el nivel de curiosidad de tu perro
                                  hoy?
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <RadioGroup
                                  onValueChange={(value) =>
                                    setCuriosityLevel(Number(value))
                                  }
                                  className="flex justify-between"
                                >
                                  {[
                                    { label: "Bajo", value: 1 },
                                    { label: "Moderado", value: 2 },
                                    { label: "Alto", value: 3 },
                                  ].map(({ label, value }) => (
                                    <div
                                      key={value}
                                      className="flex flex-col items-center"
                                    >
                                      <RadioGroupItem
                                        value={value.toString()}
                                        id={label}
                                        className="sr-only"
                                      />
                                      <Label
                                        htmlFor={label}
                                        className="cursor-pointer"
                                      >
                                        <span className="text-lg font-semibold">
                                          {label}
                                        </span>
                                      </Label>
                                    </div>
                                  ))}
                                </RadioGroup>
                              </CardContent>
                            </Card>
                          </motion.div>
                        )}

                      {!hasEntryForToday &&
                        curiosityLevel !== null &&
                        affectionLevel === null && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                          >
                            <Card className="mb-6">
                              <CardHeader>
                                <CardTitle className="text-lg">
                                  ¿Cómo fue el nivel de afecto de tu perro hoy?
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <RadioGroup
                                  onValueChange={(value) =>
                                    setAffectionLevel(Number(value))
                                  }
                                  className="flex justify-between"
                                >
                                  {[
                                    { label: "Bajo", value: 1 },
                                    { label: "Moderado", value: 2 },
                                    { label: "Alto", value: 3 },
                                  ].map(({ label, value }) => (
                                    <div
                                      key={value}
                                      className="flex flex-col items-center"
                                    >
                                      <RadioGroupItem
                                        value={value.toString()}
                                        id={label}
                                        className="sr-only"
                                      />
                                      <Label
                                        htmlFor={label}
                                        className="cursor-pointer"
                                      >
                                        <span className="text-lg font-semibold">
                                          {label}
                                        </span>
                                      </Label>
                                    </div>
                                  ))}
                                </RadioGroup>
                              </CardContent>
                            </Card>
                          </motion.div>
                        )}

                      {!hasEntryForToday &&
                        affectionLevel !== null &&
                        trustLevel === null && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                          >
                            <Card className="mb-6">
                              <CardHeader>
                                <CardTitle className="text-lg">
                                  ¿Cómo fue el nivel de confianza de tu perro
                                  hoy?
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <RadioGroup
                                  onValueChange={(value) =>
                                    setTrustLevel(Number(value))
                                  }
                                  className="flex justify-between"
                                >
                                  {[
                                    { label: "Bajo", value: 1 },
                                    { label: "Moderado", value: 2 },
                                    { label: "Alto", value: 3 },
                                  ].map(({ label, value }) => (
                                    <div
                                      key={value}
                                      className="flex flex-col items-center"
                                    >
                                      <RadioGroupItem
                                        value={value.toString()}
                                        id={label}
                                        className="sr-only"
                                      />
                                      <Label
                                        htmlFor={label}
                                        className="cursor-pointer"
                                      >
                                        <span className="text-lg font-semibold">
                                          {label}
                                        </span>
                                      </Label>
                                    </div>
                                  ))}
                                </RadioGroup>
                              </CardContent>
                            </Card>
                          </motion.div>
                        )}
                      {!hasEntryForToday &&
                        trustLevel !== null &&
                        happinessLevel === null && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                          >
                            <Card className="mb-6">
                              <CardHeader>
                                <CardTitle className="text-lg">
                                  ¿Cómo fue el nivel de felicidad de tu perro
                                  hoy?
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <RadioGroup
                                  onValueChange={(value) =>
                                    handleHappinessChange(Number(value))
                                  }
                                  className="flex justify-between"
                                >
                                  {[
                                    { label: "Bajo", value: 1 },
                                    { label: "Moderado", value: 2 },
                                    { label: "Alto", value: 3 },
                                  ].map(({ label, value }) => (
                                    <div
                                      key={value}
                                      className="flex flex-col items-center"
                                    >
                                      <RadioGroupItem
                                        value={value.toString()}
                                        id={label}
                                        className="sr-only"
                                      />
                                      <Label
                                        htmlFor={label}
                                        className="cursor-pointer"
                                      >
                                        <span className="text-lg font-semibold">
                                          {label}
                                        </span>
                                      </Label>
                                    </div>
                                  ))}
                                </RadioGroup>
                              </CardContent>
                            </Card>
                          </motion.div>
                        )}

                      {hasEntryForToday && happinessLevel !== null && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.2 }}
                        >
                          <Card className="w-full  mx-auto">
                            <CardHeader className="text-center">
                              <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
                                Resumen de salud emocional{" "}
                                <Badge className="text-sm">
                                  {formattedDate}
                                </Badge>
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="text-center mb-4">
                                <p className="text-lg font-semibold text-primary">
                                  ¡Gracias por registrar la salud emocional de
                                  tu perro, vuelve mañana!
                                </p>
                              </div>

                              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4">
                                {attributes.map((attribute) => (
                                  <Card
                                    key={attribute.name}
                                    className="overflow-hidden transition-all duration-300 ease-in-out hover:shadow-lg hover:bg-primary/5 hover:-translate-y-1"
                                  >
                                    <CardContent className="p-4">
                                      <div className="text-center">
                                        <strong className="text-lg">
                                          {attribute.name}:
                                        </strong>
                                        <div className="mt-2 text-md">
                                          {descriptionMap[attribute.value] ||
                                            attribute.value}
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                ))}
                              </div>
                            </CardContent>
                            <div className="flex justify-end pr-4 pb-4">
                              <button
                                onClick={() => {
                                  setIsAlertOpen(true);
                                }}
                                className="text-red-500 hover:text-red-700 text-sm"
                              >
                                <Trash className="h-4 w-4" />
                              </button>
                            </div>
                          </Card>
                        </motion.div>
                      )}
                    </>
                  )}
                </>
              ) : (
                <div className="text-center p-8">
                  <Dog className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <p className="text-lg text-muted-foreground">
                    Por favor, selecciona una mascota para ver los detalles de
                    sueño.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
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
      </div>
    </>
  );
}
