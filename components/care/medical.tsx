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
  ResponsiveContainer,
  Tooltip as RechartsTooltip, // Renombramos el Tooltip de recharts
} from "recharts";
import {
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
import { createClient } from "@/utils/supabase/client";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { toast } from "../ui/use-toast";

export default function Medical() {
  const [medicalRecords, setMedicalRecords] = useState({
    vacunas: [],
    medicamentos: [],
    alergias: [],
    enfermedades: [{ id: 1, name: "Otitis - 2023-05-10" }],
    citas: [],
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
  const [userRange, setUserRange] = useState(null);

  const addItem = (category) => {
    if (userRange === 1) {
      toast({
        title: "Error",
        description:
          "No tienes permisos para agregar elementos, consulta a tu veterinario",
        variant: "destructive",
      });
      return;
    }
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
    if (userRange === 1) {
      alert("No tienes permiso para eliminar elementos.");
      return;
    }
    setMedicalRecords((prev) => ({
      ...prev,
      [category]: prev[category].filter((item) => item.id !== id),
    }));
  };

  const editItem = (category, id, newValue) => {
    if (userRange === 1) {
      alert("No tienes permiso para editar elementos.");
      return;
    }
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
    <ScrollArea className="h-[400px] w-full rounded-md border">
      <div className="p-4 space-y-4">
        {items.map((item) => {
          const isItemOverdue = isOverdue(item.nextDue || item.next_due);
          return (
            <Card
              key={item.id}
              className={`p-4 transition-colors ${
                isItemOverdue
                  ? "bg-destructive/10 hover:bg-destructive/20"
                  : "hover:bg-accent"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-sm font-medium flex items-center">
                    {item.name}
                    {isItemOverdue && (
                      <TooltipProvider>
                        <Tooltip></Tooltip>
                      </TooltipProvider>
                    )}
                  </h3>
                  {item.date && (
                    <p className="text-xs text-muted-foreground">
                      Fecha de aplicación: {item.date}
                    </p>
                  )}
                  {(item.nextDue || item.next_due) && (
                    <p
                      className={`text-xs ${
                        isItemOverdue
                          ? "text-destructive font-semibold"
                          : "text-muted-foreground"
                      }`}
                    >
                      Próxima aplicación: {item.nextDue || item.next_due}
                    </p>
                  )}
                  {category === "medicamentos" && item.frequency && (
                    <p className="text-xs text-muted-foreground">
                      Frecuencia: {item.frequency}
                    </p>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingItem(item)}
                    className="hover:bg-primary/20"
                    disabled={userRange === 1}
                  >
                    <Edit size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteItem(category, item.id)}
                    className="hover:bg-destructive/20"
                    disabled={userRange === 1}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </ScrollArea>
  );

  const { selectedPet } = useSelectedPet();

  // Estado para los datos del dueño
  const [ownerData, setOwnerData] = useState({
    userFullName: null,
    city: null,
    email: null,
    cellphone: null,
  });

  useEffect(() => {
    const fetchUserAndProfile = async () => {
      const supabase = createClient();
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        console.error("Error fetching user:", userError.message);
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileError) {
        console.error("Error fetching profile:", profileError.message);
      } else {
        setOwnerData({
          userFullName: profile?.full_name ?? null,
          city: profile?.city ?? null,
          email: profile?.email ?? null,
          cellphone: profile?.cellphone ?? null,
        });
        setUserRange(profile?.range ?? null);
      }
    };
    fetchUserAndProfile();
  }, []);

  useEffect(() => {
    const fetchAppointments = async () => {
      const supabase = createClient();
      const { data: appointments, error } = await supabase
        .from("appointments")
        .select("*")
        .eq("pet_id", selectedPet.id); // Filtrar por pet_id

      if (error) {
        console.error("Error fetching appointments:", error.message);
      } else {
        setMedicalRecords((prev) => ({
          ...prev,
          citas: appointments,
        }));
      }
    };

    if (selectedPet) {
      fetchAppointments();
    }
  }, [selectedPet]); // Dependencia en selectedPet

  useEffect(() => {
    const fetchVaccinations = async () => {
      const supabase = createClient();
      const { data: vaccinations, error } = await supabase
        .from("vaccinations")
        .select("*")
        .eq("pet_id", selectedPet.id); // Filtrar por pet_id

      if (error) {
        console.error("Error fetching vaccinations:", error.message);
      } else {
        setMedicalRecords((prev) => ({
          ...prev,
          vacunas: vaccinations,
        }));
      }
    };

    if (selectedPet) {
      fetchVaccinations();
    }
  }, [selectedPet]); // Dependencia en selectedPet

  useEffect(() => {
    const fetchMedications = async () => {
      const supabase = createClient();
      const { data: medications, error } = await supabase
        .from("medications")
        .select("*")
        .eq("pet_id", selectedPet.id); // Filtrar por pet_id

      if (error) {
        console.error("Error fetching vaccinations:", error.message);
      } else {
        setMedicalRecords((prev) => ({
          ...prev,
          medicamentos: medications,
        }));
      }
    };

    if (selectedPet) {
      fetchMedications();
    }
  }, [selectedPet]); // Dependencia en selectedPet

  useEffect(() => {
    const fetchAllergies = async () => {
      const supabase = createClient();
      const { data: allergies, error } = await supabase
        .from("allergies")
        .select("*")
        .eq("pet_id", selectedPet.id); // Filtrar por pet_id

      if (error) {
        console.error("Error fetching allergies:", error.message);
      } else {
        setMedicalRecords((prev) => ({
          ...prev,
          alergias: allergies,
        }));
      }
    };

    if (selectedPet) {
      fetchAllergies();
    }
  }, [selectedPet]); // Dependencia en selectedPet

  useEffect(() => {
    const fetchDiseases = async () => {
      const supabase = createClient();
      const { data: diseases, error } = await supabase
        .from("diseases")
        .select("*")
        .eq("pet_id", selectedPet.id); // Filtrar por pet_id

      if (error) {
        console.error("Error fetching diseases:", error.message);
      } else {
        setMedicalRecords((prev) => ({
          ...prev,
          enfermedades: diseases,
        }));
      }
    };

    if (selectedPet) {
      fetchDiseases();
    }
  }, [selectedPet]); // Dependencia en selectedPet
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
                ? `Raza: ${selectedPet.breed} | Edad: ${selectedPet.age} | Peso actual: ${selectedPet.weight} kg`
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
                              Historial de {category} de {selectedPet.name}
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
                        Seguimiento del peso de {selectedPet.name}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={medicalRecords.weightHistory}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <RechartsTooltip />
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
                      Datos de la clínica
                    </TabsTrigger>
                    <TabsTrigger value="pet">Datos de la mascota</TabsTrigger>
                    <TabsTrigger value="owner">Datos del dueño</TabsTrigger>
                  </TabsList>
                  <TabsContent value="clinic">
                    <ClinicData />
                  </TabsContent>
                  <TabsContent value="pet">
                    <PetData />
                  </TabsContent>
                  <TabsContent value="owner">
                    <OwnerData ownerData={ownerData} />
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
          Datos de la mascota
        </h2>
        <PawPrint className="absolute top-4 right-4 w-24 h-24 text-primary/20 dark:text-primary-foreground/20" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InfoItem icon={User} label="Nombre" value={selectedPet.name} />
        <InfoItem icon={Dna} label="Especie" value="Canino" />
        <InfoItem icon={Dna} label="Raza" value={selectedPet.breed} />
        <InfoItem icon={Palette} label="Color" value="Dorado" />
        <InfoItem
          icon={User}
          label="Sexo"
          value={
            selectedPet.gender === "Male"
              ? "Macho"
              : selectedPet.gender === "Female"
              ? "Hembra"
              : selectedPet.gender
          }
        />
        <InfoItem
          icon={Calendar}
          label="Fecha de Nacimiento"
          value={selectedPet.birthdate}
        />
        <InfoItem icon={Fingerprint} label="Número de Microchip" value="N/A" />
        <InfoItem
          icon={FileText}
          label="Señas Particulares"
          value="Mancha blanca en el pecho"
        />
      </div>
    </div>
  );
}

function OwnerData({ ownerData }) {
  const { selectedPet } = useSelectedPet();
  return (
    <div className="space-y-6 p-6 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+CjxyZWN0IHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgZmlsbD0id2hpdGUiPjwvcmVjdD4KPHBhdGggZD0iTTAgMEw2MCA2ME0wIDYwTDYwIDAiIHN0cm9rZT0iI2YwZjBmMCIgc3Ryb2tlLXdpZHRoPSIxIj48L3BhdGg+Cjwvc3ZnPg==')] dark:bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+CjxyZWN0IHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgZmlsbD0iIzFmMjkzNyI+PC9yZWN0Pgo8cGF0aCBkPSJNMCAwTDYwIDYwTTAgNjBMNjAgMCIgc3Ryb2tlPSIjMmEzNjQ2IiBzdHJva2Utd2lkdGg9IjEiPjwvcGF0aD4KPC9zdmc+')]">
      <div className="bg-primary/10 dark:bg-primary/20 p-6 rounded-lg relative">
        <h2 className="text-3xl font-bold text-primary dark:text-primary-foreground">
          Datos del dueño
        </h2>
        <User className="absolute top-4 right-4 w-24 h-24 text-primary/20 dark:text-primary-foreground/20" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InfoItem icon={User} label="Nombre" value={selectedPet.ownerName} />
        <InfoItem icon={MapPin} label="Dirección" value={selectedPet.city} />
        <InfoItem icon={Phone} label="Teléfono" value={selectedPet.cellphone} />
        <InfoItem
          icon={Mail}
          label="Correo Electrónico"
          value={selectedPet.email}
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
function setUserRange(arg0: any) {
  throw new Error("Function not implemented.");
}
