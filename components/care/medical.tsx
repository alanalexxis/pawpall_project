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
import { AlertCircle, Dog, Edit, PawPrint, Trash2 } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Building2,
  User,
  FileText,
  MapPin,
  Phone,
  PhoneCall,
  Mail,
  Dna,
  Calendar,
  Fingerprint,
  Palette,
} from "lucide-react";
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
          <CardHeader className="bg-[conic-gradient(at_bottom_left,_var(--tw-gradient-stops))] from-yellow-200 via-emerald-200 to-yellow-200 text-primary-foreground">
            <CardTitle className="text-2xl flex items-center gap-2">
              <Dog className="w-6 h-6" />
              {selectedPet
                ? `Historial médico de ${selectedPet.name}`
                : "Historial médico"}
            </CardTitle>
            <CardDescription className="text-primary-foreground/80">
              {selectedPet
                ? `Raza: Chow Chow | Edad: ${selectedPet.age} años | Peso actual: ${selectedPet.weight} kg`
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
              <Card className="w-full mt-6 mx-auto overflow-hidden">
                <Tabs defaultValue="clinic" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="clinic">
                      Datos de la Clínica
                    </TabsTrigger>
                    <TabsTrigger value="pet">Datos de la Mascota</TabsTrigger>
                    <TabsTrigger value="owner">Datos del Dueño</TabsTrigger>
                  </TabsList>
                  <TabsContent value="clinic">
                    <ClinicData />
                  </TabsContent>
                  <TabsContent value="pet">
                    <PetData />
                  </TabsContent>
                  <TabsContent value="owner">
                    <OwnerData />
                  </TabsContent>
                </Tabs>
              </Card>
            )}
          </motion.div>
        </CardContent>
      </motion.div>
    </Card>
  );
}

function ClinicData() {
  return (
    <div className="space-y-6 p-6 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+CjxyZWN0IHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgZmlsbD0id2hpdGUiPjwvcmVjdD4KPHBhdGggZD0iTTAgMEw2MCA2ME0wIDYwTDYwIDAiIHN0cm9rZT0iI2YwZjBmMCIgc3Ryb2tlLXdpZHRoPSIxIj48L3BhdGg+Cjwvc3ZnPg==')] dark:bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+CjxyZWN0IHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgZmlsbD0iIzFmMjkzNyI+PC9yZWN0Pgo8cGF0aCBkPSJNMCAwTDYwIDYwTTAgNjBMNjAgMCIgc3Ryb2tlPSIjMmEzNjQ2IiBzdHJva2Utd2lkdGg9IjEiPjwvcGF0aD4KPC9zdmc+')]">
      <div className="bg-primary/10 dark:bg-primary/20 p-6 rounded-lg relative">
        <h2 className="text-3xl font-bold text-primary dark:text-primary-foreground">
          Clínica Veterinaria San Francisco
        </h2>
        <PawPrint className="absolute top-4 right-4 w-24 h-24 text-primary/20 dark:text-primary-foreground/20" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InfoItem
          icon={User}
          label="Médico Veterinario"
          value="Dra. Griselda Gutiérrez Ramírez"
        />
        <InfoItem icon={FileText} label="Cédula Profesional" value="12345678" />
        <InfoItem
          icon={MapPin}
          label="Dirección"
          value="Calle Vicente Guerrero #3, Barrio San Felipe, Tila, Chiapas, CP 29910"
        />
        <InfoItem icon={Phone} label="Teléfono" value="+52 99-8346-2585" />
        <InfoItem
          icon={PhoneCall}
          label="Emergencias"
          value="+52 91-9145-5929"
        />
        <InfoItem
          icon={Mail}
          label="Correo Electrónico"
          value="GriseldithaGutierrez@gmail.com"
        />
      </div>
    </div>
  );
}

function PetData() {
  const { selectedPet } = useSelectedPet();
  return (
    <div className="space-y-6 p-6 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+CjxyZWN0IHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgZmlsbD0id2hpdGUiPjwvcmVjdD4KPHBhdGggZD0iTTAgMEw2MCA2ME0wIDYwTDYwIDAiIHN0cm9rZT0iI2YwZjBmMCIgc3Ryb2tlLXdpZHRoPSIxIj48L3BhdGg+Cjwvc3ZnPg==')] dark:bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+CjxyZWN0IHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgZmlsbD0iIzFmMjkzNyI+PC9yZWN0Pgo8cGF0aCBkPSJNMCAwTDYwIDYwTTAgNjBMNjAgMCIgc3Ryb2tlPSIjMmEzNjQ2IiBzdHJva2Utd2lkdGg9IjEiPjwvcGF0aD4KPC9zdmc+')]">
      <div className="bg-primary/10 dark:bg-primary/20 p-6 rounded-lg relative">
        <h2 className="text-3xl font-bold text-primary dark:text-primary-foreground">
          Datos de la Mascota
        </h2>
        <PawPrint className="absolute top-4 right-4 w-24 h-24 text-primary/20 dark:text-primary-foreground/20" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InfoItem icon={User} label="Nombre" value={selectedPet.name} />
        <InfoItem icon={Dna} label="Especie" value="Canino" />
        <InfoItem icon={Dna} label="Raza" value={selectedPet.breed} />
        <InfoItem icon={Palette} label="Color" value="Dorado" />
        <InfoItem icon={User} label="Sexo" value={selectedPet.gender} />
        <InfoItem
          icon={Calendar}
          label="Fecha de Nacimiento"
          value="15/05/2020"
        />
        <InfoItem
          icon={Fingerprint}
          label="Número de Microchip"
          value="123456789012345"
        />
        <InfoItem
          icon={FileText}
          label="Señas Particulares"
          value="Mancha blanca en el pecho"
        />
      </div>
    </div>
  );
}

function OwnerData() {
  return (
    <div className="space-y-6 p-6 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+CjxyZWN0IHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgZmlsbD0id2hpdGUiPjwvcmVjdD4KPHBhdGggZD0iTTAgMEw2MCA2ME0wIDYwTDYwIDAiIHN0cm9rZT0iI2YwZjBmMCIgc3Ryb2tlLXdpZHRoPSIxIj48L3BhdGg+Cjwvc3ZnPg==')] dark:bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+CjxyZWN0IHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgZmlsbD0iIzFmMjkzNyI+PC9yZWN0Pgo8cGF0aCBkPSJNMCAwTDYwIDYwTTAgNjBMNjAgMCIgc3Ryb2tlPSIjMmEzNjQ2IiBzdHJva2Utd2lkdGg9IjEiPjwvcGF0aD4KPC9zdmc+')]">
      <div className="bg-primary/10 dark:bg-primary/20 p-6 rounded-lg relative">
        <h2 className="text-3xl font-bold text-primary dark:text-primary-foreground">
          Datos del Dueño
        </h2>
        <User className="absolute top-4 right-4 w-24 h-24 text-primary/20 dark:text-primary-foreground/20" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InfoItem icon={User} label="Nombre" value="Ana García Rodríguez" />
        <InfoItem
          icon={MapPin}
          label="Dirección"
          value="Av. Insurgentes Sur 1234, Col. Del Valle, Ciudad de México, CP 03100"
        />
        <InfoItem icon={Phone} label="Teléfono" value="+52 (55) 9876-5432" />
        <InfoItem
          icon={Mail}
          label="Correo Electrónico"
          value="ana.garcia@email.com"
        />
      </div>
    </div>
  );
}

function InfoItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start space-x-3 p-3 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
      <Icon className="w-5 h-5 text-primary dark:text-primary-foreground mt-0.5" />
      <div>
        <p className="font-semibold text-sm text-muted-foreground dark:text-gray-400">
          {label}
        </p>
        <p className="text-sm dark:text-gray-200">{value}</p>
      </div>
    </div>
  );
}
