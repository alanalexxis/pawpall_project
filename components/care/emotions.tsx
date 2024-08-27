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
  PawPrint,
  Bone,
  Heart,
  Dog,
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

export default function Emotions() {
  const [mood, setMood] = useState(70);
  const [activities, setActivities] = useState([]);
  const [moodHistory, setMoodHistory] = useState([]);
  const [dailyMood, setDailyMood] = useState(null);

  useEffect(() => {
    // Simular datos de estado de ánimo para los últimos 7 días
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
    updateMood(activity === "walk" ? 10 : activity === "treat" ? 5 : 15);
  };

  const getMoodIcon = (moodValue) => {
    if (moodValue < 33) return <Frown className="w-12 h-12 text-red-500" />;
    if (moodValue < 66) return <Meh className="w-12 h-12 text-yellow-500" />;
    return <Smile className="w-12 h-12 text-green-500" />;
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
        <Card className="mb-6">
          <CardHeader className="bg-primary text-primary-foreground">
            <CardTitle className="text-2xl flex items-center gap-2">
              <Dog className="w-6 h-6" />
              {selectedPet
                ? `Monitoreo de salud emocional de ${selectedPet.name}`
                : "Monitoreo de salud emocional"}
            </CardTitle>

            <CardDescription className="text-primary-foreground/80">
              Mantén a tu perro equilibrado y feliz.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {selectedPet ? (
              <>
                <div className="flex justify-center mb-4">
                  {getMoodIcon(mood)}
                </div>
                <Progress value={mood} className="w-full h-3 mb-4" />
                <p className="text-center mb-4">
                  Estado de ánimo actual: {mood}%
                </p>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <Button
                    onClick={() => addActivity("Paseo")}
                    className="flex items-center justify-center"
                  >
                    <PawPrint className="mr-2 h-4 w-4" /> Paseo
                  </Button>
                  <Button
                    onClick={() => addActivity("Golosina")}
                    className="flex items-center justify-center"
                  >
                    <Bone className="mr-2 h-4 w-4" /> Golosina
                  </Button>
                  <Button
                    onClick={() => addActivity("Jugar")}
                    className="flex items-center justify-center"
                  >
                    <Heart className="mr-2 h-4 w-4" /> Jugar
                  </Button>
                </div>
                <div className="bg-muted p-2 rounded-md mb-4">
                  <h3 className="font-semibold mb-2">Actividades recientes:</h3>
                  <ul className="text-sm">
                    {activities.slice(-3).map((activity, index) => (
                      <li key={index}>
                        {activity.time}: {activity.name}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mb-4">
                  <h3 className="font-semibold mb-2">
                    Estado de ánimo en los últimos 7 días:
                  </h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={moodHistory}>
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="mood" stroke="#8884d8" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">
                    ¿Cómo se sintió tu perro hoy?
                  </h3>
                  <RadioGroup
                    onValueChange={setDailyMood}
                    className="flex justify-between"
                  >
                    <div className="flex flex-col items-center">
                      <RadioGroupItem
                        value="sad"
                        id="sad"
                        className="sr-only"
                      />
                      <Label htmlFor="sad" className="cursor-pointer">
                        <Frown className="w-8 h-8 text-red-500" />
                      </Label>
                    </div>
                    <div className="flex flex-col items-center">
                      <RadioGroupItem
                        value="neutral"
                        id="neutral"
                        className="sr-only"
                      />
                      <Label htmlFor="neutral" className="cursor-pointer">
                        <Meh className="w-8 h-8 text-yellow-500" />
                      </Label>
                    </div>
                    <div className="flex flex-col items-center">
                      <RadioGroupItem
                        value="happy"
                        id="happy"
                        className="sr-only"
                      />
                      <Label htmlFor="happy" className="cursor-pointer">
                        <Smile className="w-8 h-8 text-green-500" />
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </>
            ) : (
              <p className="text-center text-gray-500">
                Selecciona una mascota para ver los datos de salud emocional.
              </p>
            )}
          </CardContent>
          <CardFooter>
            {selectedPet && (
              <p className="text-sm text-muted-foreground">
                {getRecommendation()}
              </p>
            )}
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
