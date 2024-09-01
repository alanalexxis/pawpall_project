import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  SmilePlus,
  Frown,
  Meh,
  Smile,
  Dog,
  PawPrint,
  RocketIcon,
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
export default function Emotions() {
  const [mood, setMood] = useState(20);
  const [moodHistory, setMoodHistory] = useState([]);
  const [dailyMood, setDailyMood] = useState(null);
  const [energyLevel, setEnergyLevel] = useState(null);
  const [calmLevel, setCalmLevel] = useState(null); // Nuevo estado para el nivel de calma
  const [affectionLevel, setAffectionLevel] = useState(null); // Nuevo estado para el nivel de calma
  const [curiosityLevel, setCuriosityLevel] = useState(null); // Nuevo estado para el nivel de calma
  const [trustLevel, setTrustLevel] = useState(null); // Nuevo estado para el nivel de calma
  const [happinessLevel, setHappinessLevel] = useState(null); // Nuevo estado para el nivel de calma
  const { width, height } = useWindowSize();
  const [showConfetti, setShowConfetti] = useState(false);
  const handleHappinessChange = (level) => {
    setHappinessLevel(level);
    setShowConfetti(true);
  };
  setHappinessLevel;

  useEffect(() => {
    const mockData = Array.from({ length: 7 }, (_, i) => ({
      date: new Date(
        Date.now() - (6 - i) * 24 * 60 * 60 * 1000
      ).toLocaleDateString(),
      mood: Math.floor(Math.random() * 100),
    }));
    setMoodHistory(mockData);
  }, []);

  const updateMood = (value) => {
    setMood((prevMood) => {
      const newMood = Math.max(0, Math.min(100, prevMood + value));
      setMoodHistory((prev) => [
        ...prev.slice(-6),
        { date: new Date().toLocaleDateString(), mood: newMood },
      ]);
      return newMood;
    });
  };

  const addActivity = (activity) => {
    setActivities((prev) => [
      ...prev,
      { name: activity, time: new Date().toLocaleTimeString() },
    ]);
    updateMood(activity === "Paseo" ? 10 : activity === "Golosina" ? 5 : 15);
  };

  const getMoodIcon = (moodValue) => {
    if (moodValue < 33) return <Frown className="w-16 h-16 text-red-500" />;
    if (moodValue < 66) return <Meh className="w-16 h-16 text-yellow-500" />;
    return <Smile className="w-16 h-16 text-green-500" />;
  };

  const getRecommendation = (mood) => {
    if (mood <= 20) {
      return "Tu perro está muy triste. Intenta pasar más tiempo con él, tal vez un largo paseo o un rato de juego. Si su tristeza persiste, considera consultar a un veterinario para descartar problemas de salud.";
    }
    if (mood <= 33) {
      return "Tu perro parece estar triste. Considera darle un paseo o jugar con él para levantar su ánimo. Si su tristeza continúa, puede ser útil consultar con un veterinario.";
    }
    if (mood <= 50) {
      return "Tu perro está bien, pero podrías mejorar su día con una golosina o un poco de atención extra. Si notas algún cambio inusual en su comportamiento, no dudes en hablar con un veterinario.";
    }
    if (mood <= 66) {
      return "Tu perro está en un buen estado de ánimo. ¿Por qué no intentas mantenerlo así con un poco de juego?";
    }
    if (mood <= 80) {
      return "¡Tu perro está feliz! Sigue así con los cuidados que le das.";
    }
    return "¡Tu perro está en un estado de ánimo excelente! Continúa con las buenas prácticas y tu perro estará muy contento.";
  };

  const { selectedPet } = useSelectedPet();
  const attributes = [
    { name: "Energía", value: energyLevel },
    { name: "Calma", value: calmLevel },
    { name: "Curiosidad", value: curiosityLevel },
    { name: "Afecto", value: affectionLevel },
    { name: "Confianza", value: trustLevel },
    { name: "Felicidad", value: happinessLevel },
  ];
  return (
    <>
      {showConfetti && (
        <Confetti width={width} height={height} recycle={false} />
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
                      {getMoodIcon(mood)}
                    </motion.div>
                  </div>
                  <Progress value={mood} className="w-full h-4 mb-4" />
                  <p className="text-center mb-6 text-lg font-semibold">
                    Estado de ánimo actual: {mood}%
                  </p>
                  {selectedPet &&
                    (mood <= 50 ? (
                      <Alert variant="destructive">
                        <ExclamationTriangleIcon className="h-4 w-4" />
                        <AlertTitle>Alerta de estado de ánimo</AlertTitle>
                        <AlertDescription>
                          {getRecommendation(mood)}
                        </AlertDescription>
                      </Alert>
                    ) : (
                      <Alert>
                        <RocketIcon className="h-4 w-4" />
                        <AlertTitle>Recomendación</AlertTitle>
                        <AlertDescription>
                          {getRecommendation(mood)}
                        </AlertDescription>
                      </Alert>
                    ))}
                  <Card className="mb-6">
                    <CardHeader>
                      <CardTitle className="text-lg">
                        Estado de ánimo en los últimos 7 días
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={moodHistory}>
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip />
                          <Line
                            type="monotone"
                            dataKey="mood"
                            stroke="#8884d8"
                            strokeWidth={2}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {dailyMood === null ? (
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
                              value: "sad",
                              icon: Frown,
                              color: "text-red-500",
                            },
                            {
                              value: "neutral",
                              icon: Meh,
                              color: "text-yellow-500",
                            },
                            {
                              value: "happy",
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
                  ) : (
                    <>
                      {energyLevel === null && (
                        <Card className="mb-6">
                          <CardHeader>
                            <CardTitle className="text-lg">
                              ¿Cómo fue el nivel de energía de tu perro hoy?
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <RadioGroup
                              onValueChange={setEnergyLevel}
                              className="flex justify-between"
                            >
                              {["Bajo", "Moderado", "Alto"].map((level) => (
                                <div
                                  key={level}
                                  className="flex flex-col items-center"
                                >
                                  <RadioGroupItem
                                    value={level.toLowerCase()}
                                    id={level}
                                    className="sr-only"
                                  />
                                  <Label
                                    htmlFor={level}
                                    className="cursor-pointer"
                                  >
                                    <span className="text-lg font-semibold">
                                      {level}
                                    </span>
                                  </Label>
                                </div>
                              ))}
                            </RadioGroup>
                          </CardContent>
                        </Card>
                      )}

                      {energyLevel !== null && calmLevel === null && (
                        <Card className="mb-6">
                          <CardHeader>
                            <CardTitle className="text-lg">
                              ¿Cómo fue el nivel de calma de tu perro hoy?
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <RadioGroup
                              onValueChange={setCalmLevel}
                              className="flex justify-between"
                            >
                              {["Bajo", "Moderado", "Alto"].map((level) => (
                                <div
                                  key={level}
                                  className="flex flex-col items-center"
                                >
                                  <RadioGroupItem
                                    value={level.toLowerCase()}
                                    id={level}
                                    className="sr-only"
                                  />
                                  <Label
                                    htmlFor={level}
                                    className="cursor-pointer"
                                  >
                                    <span className="text-lg font-semibold">
                                      {level}
                                    </span>
                                  </Label>
                                </div>
                              ))}
                            </RadioGroup>
                          </CardContent>
                        </Card>
                      )}

                      {calmLevel !== null && curiosityLevel === null && (
                        <Card className="mb-6">
                          <CardHeader>
                            <CardTitle className="text-lg">
                              ¿Cómo fue el nivel de curiosidad de tu perro hoy?
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <RadioGroup
                              onValueChange={setCuriosityLevel}
                              className="flex justify-between"
                            >
                              {["Bajo", "Moderado", "Alto"].map((level) => (
                                <div
                                  key={level}
                                  className="flex flex-col items-center"
                                >
                                  <RadioGroupItem
                                    value={level.toLowerCase()}
                                    id={level}
                                    className="sr-only"
                                  />
                                  <Label
                                    htmlFor={level}
                                    className="cursor-pointer"
                                  >
                                    <span className="text-lg font-semibold">
                                      {level}
                                    </span>
                                  </Label>
                                </div>
                              ))}
                            </RadioGroup>
                          </CardContent>
                        </Card>
                      )}

                      {curiosityLevel !== null && affectionLevel === null && (
                        <Card className="mb-6">
                          <CardHeader>
                            <CardTitle className="text-lg">
                              ¿Cómo fue el nivel de afecto de tu perro hoy?
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <RadioGroup
                              onValueChange={setAffectionLevel}
                              className="flex justify-between"
                            >
                              {["Bajo", "Moderado", "Alto"].map((level) => (
                                <div
                                  key={level}
                                  className="flex flex-col items-center"
                                >
                                  <RadioGroupItem
                                    value={level.toLowerCase()}
                                    id={level}
                                    className="sr-only"
                                  />
                                  <Label
                                    htmlFor={level}
                                    className="cursor-pointer"
                                  >
                                    <span className="text-lg font-semibold">
                                      {level}
                                    </span>
                                  </Label>
                                </div>
                              ))}
                            </RadioGroup>
                          </CardContent>
                        </Card>
                      )}

                      {affectionLevel !== null && trustLevel === null && (
                        <Card className="mb-6">
                          <CardHeader>
                            <CardTitle className="text-lg">
                              ¿Cómo fue el nivel de confianza de tu perro hoy?
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <RadioGroup
                              onValueChange={setTrustLevel}
                              className="flex justify-between"
                            >
                              {["Bajo", "Moderado", "Alto"].map((level) => (
                                <div
                                  key={level}
                                  className="flex flex-col items-center"
                                >
                                  <RadioGroupItem
                                    value={level.toLowerCase()}
                                    id={level}
                                    className="sr-only"
                                  />
                                  <Label
                                    htmlFor={level}
                                    className="cursor-pointer"
                                  >
                                    <span className="text-lg font-semibold">
                                      {level}
                                    </span>
                                  </Label>
                                </div>
                              ))}
                            </RadioGroup>
                          </CardContent>
                        </Card>
                      )}

                      {trustLevel !== null && happinessLevel === null && (
                        <Card className="mb-6">
                          <CardHeader>
                            <CardTitle className="text-lg">
                              ¿Cómo fue el nivel de felicidad de tu perro hoy?
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <RadioGroup
                              onValueChange={handleHappinessChange}
                              className="flex justify-between"
                            >
                              {["Bajo", "Moderado", "Alto"].map((level) => (
                                <div
                                  key={level}
                                  className="flex flex-col items-center"
                                >
                                  <RadioGroupItem
                                    value={level.toLowerCase()}
                                    id={level}
                                    className="sr-only"
                                  />
                                  <Label
                                    htmlFor={level}
                                    className="cursor-pointer"
                                  >
                                    <span className="text-lg font-semibold">
                                      {level}
                                    </span>
                                  </Label>
                                </div>
                              ))}
                            </RadioGroup>
                          </CardContent>
                        </Card>
                      )}

                      {happinessLevel !== null && (
                        <Card className="w-full  mx-auto">
                          <CardHeader className="text-center">
                            <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
                              <PawPrint className="w-6 h-6" />
                              Resumen de salud emocional
                              <PawPrint className="w-6 h-6" />
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-center mb-4">
                              <p className="text-lg font-semibold text-primary">
                                ¡Gracias por registrar la salud emocional de tu
                                perro!
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
                                        {attribute.value}
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </>
                  )}
                </>
              ) : (
                <p className="text-center text-lg font-semibold">
                  Selecciona una mascota para ver el estado de ánimo.
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  );
}
