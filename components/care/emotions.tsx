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
import { SmilePlus, Frown, Meh, Smile, Dog } from "lucide-react";
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

export default function Emotions() {
  const [mood, setMood] = useState(70);
  const [moodHistory, setMoodHistory] = useState([]);
  const [dailyMood, setDailyMood] = useState(null);
  const [energyLevel, setEnergyLevel] = useState(null);
  const [calmLevel, setCalmLevel] = useState(null); // Nuevo estado para el nivel de calma
  const [affectionLevel, setAffectionLevel] = useState(null); // Nuevo estado para el nivel de calma
  const [curiosityLevel, setCuriosityLevel] = useState(null); // Nuevo estado para el nivel de calma
  const [trustLevel, setTrustLevel] = useState(null); // Nuevo estado para el nivel de calma
  const [happinessLevel, setHappinessLevel] = useState(null); // Nuevo estado para el nivel de calma

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

  const getRecommendation = () => {
    if (mood < 33)
      return "Tu perro parece estar triste. Considera darle un paseo o jugar con él.";
    if (mood < 66)
      return "Tu perro está bien, pero podría estar mejor. ¿Qué tal si le das una golosina?";
    return "¡Tu perro está feliz! Sigue así con los cuidados que le das.";
  };

  const { selectedPet } = useSelectedPet();

  return (
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
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  >
                    {getMoodIcon(mood)}
                  </motion.div>
                </div>
                <Progress value={mood} className="w-full h-4 mb-4" />
                <p className="text-center mb-6 text-lg font-semibold">
                  Estado de ánimo actual: {mood}%
                </p>

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
                          { value: "sad", icon: Frown, color: "text-red-500" },
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
                            onValueChange={setHappinessLevel}
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
                      <Card className="mb-6">
                        <CardHeader>
                          <CardTitle className="text-lg">
                            Resumen de salud emocional
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-center">
                            ¡Gracias por registrar la salud emocional de tu
                            perro!
                          </p>
                          <p className="text-center mt-4">
                            <strong>Energía:</strong> {energyLevel} <br />
                            <strong>Calma:</strong> {calmLevel} <br />
                            <strong>Curiosidad:</strong> {curiosityLevel} <br />
                            <strong>Afecto:</strong> {affectionLevel} <br />
                            <strong>Confianza:</strong> {trustLevel} <br />
                            <strong>Felicidad:</strong> {happinessLevel}
                          </p>
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
  );
}
