import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, Dog, Edit, Trash2 } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useSelectedPet } from "@/contexts/selectedPetContext";
import { motion } from "framer-motion";

export default function Medical() {
  const [dogInfo, setDogInfo] = useState({
    name: "Teddy",
    breed: "Labrador",
    age: 5,
    weight: 30,
  });

  const [medicalRecords, setMedicalRecords] = useState({
    vacunas: [
      { id: 1, name: "Rabia", date: "2023-01-01", nextDue: "2024-01-01" },
      { id: 2, name: "Parvovirus", date: "2023-03-15", nextDue: "2024-03-15" },
    ],
    medicamentos: [
      {
        id: 1,
        name: "Antiparasitario",
        frequency: "Mensual",
        nextDue: "2023-07-01",
      },
      { id: 2, name: "Vitaminas", frequency: "Diario" },
    ],
    alergias: [
      { id: 1, name: "Pollo" },
      { id: 2, name: "Polen" },
    ],
    enfermedades: [{ id: 1, name: "Otitis - 2023-05-10" }],
    citas: [
      { id: 1, date: "2023-07-15", reason: "Chequeo anual", completed: false },
      {
        id: 2,
        date: "2023-05-10",
        reason: "Tratamiento otitis",
        completed: true,
      },
    ],
    weightHistory: [
      { date: "2023-01-01", weight: 28 },
      { date: "2023-03-01", weight: 29 },
      { date: "2023-05-01", weight: 30 },
    ],
    notes:
      " tiene tendencia a comer muy rápido. Considerar usar un comedero lento.",
  });

  const [newItem, setNewItem] = useState("");
  const [editingItem, setEditingItem] = useState(null);
  const [vetInfo, setVetInfo] = useState({
    name: "Dr. García",
    phone: "123-456-7890",
    email: "dr.garcia@vetclinic.com",
  });

  const addItem = (category) => {
    if (newItem.trim() !== "") {
      setMedicalRecords((prev) => ({
        ...prev,
        [category]: [
          ...prev[category],
          {
            id: Date.now(),
            name: newItem,
            date: new Date().toISOString().split("T")[0],
          },
        ],
      }));
      setNewItem("");
    }
  };

  const deleteItem = (category, id) => {
    setMedicalRecords((prev) => ({
      ...prev,
      [category]: prev[category].filter((item) => item.id !== id),
    }));
  };

  const editItem = (category, id, newValue) => {
    setMedicalRecords((prev) => ({
      ...prev,
      [category]: prev[category].map((item) =>
        item.id === id ? { ...item, name: newValue } : item
      ),
    }));
    setEditingItem(null);
  };

  const isOverdue = (date) => {
    return new Date(date) < new Date();
  };

  const renderList = (category, items) => (
    <ScrollArea className="h-[200px] w-full rounded-md border p-4">
      <ul className="space-y-2">
        {items.map((item) => (
          <li
            key={item.id}
            className="flex items-center justify-between text-sm"
          >
            <span>
              {item.name}
              {item.date && ` - ${item.date}`}
              {item.nextDue && isOverdue(item.nextDue) && (
                <AlertCircle
                  className="inline ml-2 text-destructive"
                  size={16}
                />
              )}
            </span>
            <div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setEditingItem(item)}
              >
                <Edit size={16} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteItem(category, item.id)}
              >
                <Trash2 size={16} />
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </ScrollArea>
  );
  const { selectedPet } = useSelectedPet();
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardHeader className="bg-primary text-primary-foreground">
            <CardTitle className="text-2xl flex items-center gap-2">
              <Dog className="w-6 h-6" />
              {selectedPet
                ? `Historial médico de ${selectedPet.name}`
                : "Historial médico"}
            </CardTitle>
            <CardDescription className="text-primary-foreground/80">
              {selectedPet
                ? `Raza: Chow Chow | Edad: ${dogInfo.age} años | Peso actual: ${dogInfo.weight} kg`
                : " Mantén a tu perro saludable y feliz."}
            </CardDescription>
          </CardHeader>
        </Card>
        <CardContent className="p-6">
          <Tabs defaultValue="vacunas" className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="vacunas">Vacunas</TabsTrigger>
              <TabsTrigger value="medicamentos">Medicamentos</TabsTrigger>
              <TabsTrigger value="alergias">Alergias</TabsTrigger>
              <TabsTrigger value="enfermedades">Enfermedades</TabsTrigger>
              <TabsTrigger value="citas">Citas</TabsTrigger>
              <TabsTrigger value="weight">Peso</TabsTrigger>
            </TabsList>
            {Object.entries(medicalRecords).map(([category, items]) => {
              if (category === "weightHistory" || category === "notes")
                return null;
              return (
                <TabsContent key={category} value={category}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <Card>
                      {!selectedPet ? (
                        <div className="text-center p-8">
                          <Dog className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                          <p className="text-lg text-gray-500">
                            Por favor, selecciona una mascota para ver los
                            detalles.
                          </p>
                        </div>
                      ) : (
                        <>
                          <CardHeader>
                            <CardTitle>
                              {category.charAt(0).toUpperCase() +
                                category.slice(1)}
                            </CardTitle>
                            <CardDescription>
                              Historial de {category} de {dogInfo.name}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            {renderList(category, items)}
                            <div className="flex space-x-2">
                              <div className="grid w-full max-w-sm items-center gap-1.5">
                                <Label htmlFor={`new-${category}`}>
                                  Nuevo {category.slice(0, -1)}
                                </Label>
                                <Input
                                  type="text"
                                  id={`new-${category}`}
                                  value={newItem}
                                  onChange={(e) => setNewItem(e.target.value)}
                                  placeholder={`Agregar nueva ${category.slice(
                                    0,
                                    -1
                                  )}...`}
                                />
                              </div>
                              <Button
                                className="mt-auto"
                                onClick={() => addItem(category)}
                              >
                                Agregar
                              </Button>
                            </div>
                          </CardContent>
                        </>
                      )}
                    </Card>
                  </motion.div>
                </TabsContent>
              );
            })}
            <TabsContent value="weight">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {" "}
                {selectedPet && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Historial de peso</CardTitle>
                      <CardDescription>
                        Seguimiento del peso de {dogInfo.name}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={medicalRecords.weightHistory}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Line
                              type="monotone"
                              dataKey="weight"
                              stroke="#8884d8"
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            </TabsContent>
          </Tabs>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {selectedPet && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Notas generales</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={medicalRecords.notes}
                    onChange={(e) =>
                      setMedicalRecords((prev) => ({
                        ...prev,
                        notes: e.target.value,
                      }))
                    }
                    placeholder="Agregar notas o observaciones generales..."
                  />
                </CardContent>
              </Card>
            )}
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            {selectedPet && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Información del veterinario</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    <strong>Nombre:</strong> {vetInfo.name}
                  </p>
                  <p>
                    <strong>Teléfono:</strong> {vetInfo.phone}
                  </p>
                  <p>
                    <strong>Email:</strong> {vetInfo.email}
                  </p>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </CardContent>
      </motion.div>
    </Card>
  );
}
