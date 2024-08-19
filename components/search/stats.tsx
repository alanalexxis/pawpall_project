"use client";
import React, { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { FaCheck, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useRaza } from "@/contexts/razaContext";

type Section = "FAMILIAR" | "FISICO" | "SOCIAL" | "PERSONALIDAD";
const Stadistics = () => {
  const [activeSection, setActiveSection] = useState<Section>("FAMILIAR");
  const [expandedInfo, setExpandedInfo] = useState<string | null>(null);
  const { selectedRaza, coatLengths, coatTypes } = useRaza();

  // Determina el coat_length_id del selectedRaza si está disponible
  const coatLengthId = selectedRaza
    ? coatLengths.find((cl) => cl.breed_id === selectedRaza.id)?.coat_length_id
    : null;

  // Determina el coat_type_id del selectedRaza si está disponible
  const coatTypeId = selectedRaza
    ? coatTypes.find((ct) => ct.breed_id === selectedRaza.id)?.coat_type_id
    : null;
  const renderRating = (
    rating: number,
    leftLabel: string,
    rightLabel: string
  ) => {
    return (
      <div className="relative mb-6">
        <div className="flex justify-between mb-1">
          <span className="text-secondary text-xs">{leftLabel}</span>
          <span className="text-secondary text-xs">{rightLabel}</span>
        </div>
        <div className="flex items-center space-x-1 relative">
          <div className="flex-1 flex space-x-1">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`flex-1 h-2 rounded ${
                  i < rating ? "bg-primary" : "bg-secondary"
                }`}
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderIconRating = (isChecked: boolean, label: string) => {
    return (
      <div className="flex items-center mb-2">
        {isChecked ? (
          <FaCheck className="text-primary mr-2 text-xl" />
        ) : (
          <FaTimes className="text-secondary mr-2 text-l" />
        )}
        <span
          className={`text-xs ${isChecked ? "text-primary" : "text-secondary"}`}
        >
          <div className=" text-md font-bold ">{label}</div>
        </span>
      </div>
    );
  };
  const toggleInfo = (section: string) => {
    setExpandedInfo(expandedInfo === section ? null : section);
  };
  // Define los anchos relativos para cada sección.
  const sectionWidths: Record<Section, number> = {
    FAMILIAR: 0,
    FISICO: 100,
    SOCIAL: 200,
    PERSONALIDAD: 300,
  };

  const renderSectionContent = () => {
    switch (activeSection) {
      case "FAMILIAR":
        return (
          <motion.div
            key="FAMILIAR"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:gap-36 md:gap:0 mt-10">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-xl">CARIÑOSO CON LA FAMILIA</h2>
                  <button
                    className="relative left-4 text-primary text-3xl"
                    onClick={() => toggleInfo("FAMILIAR_FAMILIAR")}
                  >
                    {expandedInfo === "FAMILIAR_FAMILIAR" ? "-" : "+"}
                  </button>
                </div>
                {renderRating(
                  selectedRaza?.affectionate_with_family ?? 0, // Proporciona un valor predeterminado si es undefined
                  "Independiente",
                  "Muy cariñoso"
                )}
                <AnimatePresence>
                  {expandedInfo === "FAMILIAR_FAMILIAR" && (
                    <motion.p
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden mt-2 text-md text-gray-400"
                    >
                      La probabilidad de que una raza sea cariñosa con los
                      miembros de la familia o con otras personas que conoce
                      bien. Algunas razas pueden ser distantes con todos excepto
                      con su dueño, mientras que otras razas tratan a todos los
                      que conocen como su mejor amigo.
                    </motion.p>
                  )}
                </AnimatePresence>
                <Separator />
                <div className="flex justify-between items-center mb-2 mt-10">
                  <h2 className="text-xl">BUENO CON NIÑOS PEQUEÑOS</h2>
                  <button
                    className="relative left-4 text-primary text-3xl"
                    onClick={() => toggleInfo("FAMILIAR_NINOS")}
                  >
                    {expandedInfo === "FAMILIAR_NINOS" ? "-" : "+"}
                  </button>
                </div>
                {renderRating(
                  selectedRaza?.good_with_small_children ?? 0,
                  "No recomendado",
                  "Bueno con niños pequeños"
                )}
                <AnimatePresence>
                  {expandedInfo === "FAMILIAR_NINOS" && (
                    <motion.p
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden mt-2 text-md text-gray-400"
                    >
                      El nivel de tolerancia y paciencia de una raza con el
                      comportamiento de los niños y su naturaleza amigable en
                      general con la familia. Los perros siempre deben ser
                      supervisados cuando están cerca de niños pequeños, o niños
                      de cualquier edad que tengan poca experiencia con perros.
                    </motion.p>
                  )}
                </AnimatePresence>
                <Separator />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2 mt-10 md:mt-0">
                  <h2 className="text-xl">BUENO CON OTROS PERROS</h2>
                  <button
                    className="relative left-4 text-primary text-3xl"
                    onClick={() => toggleInfo("FAMILIAR_PERROS")}
                  >
                    {expandedInfo === "FAMILIAR_PERROS" ? "-" : "+"}
                  </button>
                </div>
                {renderRating(
                  selectedRaza?.good_with_other_dogs ?? 0,
                  "No Recomendado",
                  "Bueno con otros perros"
                )}
                <AnimatePresence>
                  {expandedInfo === "FAMILIAR_PERROS" && (
                    <motion.p
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden mt-2 text-md text-gray-400"
                    >
                      Que tan amigable es una raza en general con otros perros.
                      Los perros siempre deben ser supervisados durante las
                      interacciones y presentaciones con otros perros, pero
                      algunas razas tienen una mayor predisposición a llevarse
                      bien con otros perros, tanto en casa como en público.
                    </motion.p>
                  )}
                </AnimatePresence>
                <Separator />
              </div>
            </div>
          </motion.div>
        );

      case "FISICO":
        return (
          <motion.div
            key="FISICO"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:gap-36 md:gap:0 mt-10">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-xl">DESPRENDIMIENTO DE PELO</h2>
                  <button
                    className="relative left-4 text-primary text-3xl"
                    onClick={() => toggleInfo("FISICO_PELO")}
                  >
                    {expandedInfo === "FISICO_PELO" ? "-" : "+"}
                  </button>
                </div>
                {renderRating(
                  selectedRaza?.shedding ?? 0,
                  "Sin caída del pelo",
                  "Pelo por todas partes"
                )}
                <AnimatePresence>
                  {expandedInfo === "FISICO_PELO" && (
                    <motion.p
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden mt-2 text-md text-gray-400"
                    >
                      La cantidad de pelo que puedes esperar que deje una raza.
                      Las razas con alta pérdida de pelo necesitarán ser
                      cepilladas con más frecuencia, son más propensas a
                      desencadenar ciertos tipos de alergias y es más probable
                      que requieran una aspiración y un uso de rodillos
                      quitapelusas más constante.
                    </motion.p>
                  )}
                </AnimatePresence>
                <Separator />
                <div className="flex justify-between items-center mb-2 mt-10">
                  <h2 className="text-xl">FRECUENCIA DE CUIDADO DEL PELO</h2>
                  <button
                    className="relative left-4 text-primary text-3xl"
                    onClick={() => toggleInfo("FISICO_CUIDADO")}
                  >
                    {expandedInfo === "FISICO_CUIDADO" ? "-" : "+"}
                  </button>
                </div>
                {renderRating(
                  selectedRaza?.grooming_frequency ?? 0,
                  "Mensual",
                  "Diario"
                )}
                <AnimatePresence>
                  {expandedInfo === "FISICO_CUIDADO" && (
                    <motion.p
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden mt-2 text-md text-gray-400"
                    >
                      La frecuencia con la que una raza necesita baños,
                      cepillados, recortes u otros tipos de mantenimiento del
                      pelaje. Considera cuánto tiempo, paciencia y presupuesto
                      tienes para este tipo de cuidado al evaluar el esfuerzo
                      necesario para el aseo. Todas las razas requieren un
                      recorte regular de uñas.
                    </motion.p>
                  )}
                </AnimatePresence>
                <Separator />
                <div className="flex justify-between items-center mb-2 mt-10">
                  <h2 className="text-xl">NIVEL DE SALIVACIÓN</h2>
                  <button
                    className="relative left-4 text-primary text-3xl"
                    onClick={() => toggleInfo("FISICO_BABEO")}
                  >
                    {expandedInfo === "FISICO_BABEO" ? "-" : "+"}
                  </button>
                </div>
                {renderRating(
                  selectedRaza?.salivation_level ?? 0,
                  "Menos propenso a babeo",
                  "Siempre tener una toalla"
                )}
                <AnimatePresence>
                  {expandedInfo === "FISICO_BABEO" && (
                    <motion.p
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden mt-2 text-md text-gray-400"
                    >
                      Que tan propensa es una raza a babear. Si eres muy
                      ordenado, los perros que pueden dejar hilos de baba en tu
                      brazo o grandes manchas húmedas en tu ropa pueden no ser
                      la elección adecuada para ti.
                    </motion.p>
                  )}
                </AnimatePresence>
                <Separator />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-xl">TIPO DE PELAJE</h2>
                  <button
                    className="relative left-4 text-primary text-3xl"
                    onClick={() => toggleInfo("FISICO_PELAJE")}
                  >
                    {expandedInfo === "FISICO_PELAJE" ? "-" : "+"}
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-4 mb-6  ">
                  {renderIconRating(coatTypeId === 1, "Áspero")}
                  {renderIconRating(coatTypeId === 2, "Sin pelo")}
                  {renderIconRating(coatTypeId === 3, "Liso")}
                  {renderIconRating(coatTypeId === 4, "Rugoso")}
                  {renderIconRating(coatTypeId === 5, "Doble")}
                  {renderIconRating(coatTypeId === 6, "Rizado")}
                  {renderIconRating(coatTypeId === 7, "Ondulado")}
                  {renderIconRating(coatTypeId === 8, "Cordado")}
                  {renderIconRating(coatTypeId === 9, "Sedoso")}
                </div>
                <AnimatePresence>
                  {expandedInfo === "FISICO_PELAJE" && (
                    <motion.p
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden mt-2 text-md text-gray-400"
                    >
                      Los pelajes de los perros vienen en muchos tipos
                      diferentes, dependiendo del propósito de la raza. Cada
                      tipo de pelaje tiene diferentes necesidades de aseo,
                      potencial alérgeno y nivel de desprendimiento de pelo.
                      También puede que prefieras la apariencia o la sensación
                      de ciertos tipos de pelaje sobre otros al elegir una
                      mascota para la familia.
                    </motion.p>
                  )}
                </AnimatePresence>
                <Separator />
                <div className="flex justify-between items-center mb-2 mt-10">
                  <h2 className="text-xl">LARGO DEL PELAJE</h2>
                  <button
                    className="relative left-4 text-primary text-3xl"
                    onClick={() => toggleInfo("FISICO_LARGO")}
                  >
                    {expandedInfo === "FISICO_LARGO" ? "-" : "+"}
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {renderIconRating(coatLengthId === 1, "Corto")}
                  {renderIconRating(coatLengthId === 2, "Medio")}
                  {renderIconRating(coatLengthId === 3, "Largo")}
                </div>
                <AnimatePresence>
                  {expandedInfo === "FISICO_LARGO" && (
                    <motion.p
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden mt-2 text-md text-gray-400"
                    >
                      La longitud esperada del pelaje de la raza. Algunas razas
                      de pelo largo pueden ser recortadas, pero esto requerirá
                      un mantenimiento adicional para conservar el corte.
                    </motion.p>
                  )}
                </AnimatePresence>
                <Separator />
              </div>
            </div>
          </motion.div>
        );
      case "SOCIAL":
        return (
          <motion.div
            key="SOCIAL"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:gap-36 md:gap:0 mt-10">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-xl">APERTURA A EXTRAÑOS</h2>
                  <button
                    className="relative left-4 text-primary text-3xl"
                    onClick={() => toggleInfo("SOCIAL_APERTURA")}
                  >
                    {expandedInfo === "SOCIAL_APERTURA" ? "-" : "+"}
                  </button>
                </div>
                {renderRating(
                  selectedRaza?.open_to_strangers ?? 0,
                  "Reservado",
                  "Todos son mis mejores amigos"
                )}
                <AnimatePresence>
                  {expandedInfo === "SOCIAL_APERTURA" && (
                    <motion.p
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden mt-2 text-md text-gray-400"
                    >
                      Que tan acogedora es una raza con los extraños. Algunas
                      razas serán reservadas o cautelosas con todos los
                      desconocidos, sin importar el lugar, mientras que otras
                      razas estarán felices de conocer a un nuevo humano siempre
                      que haya uno cerca.
                    </motion.p>
                  )}
                </AnimatePresence>
                <Separator />
                <div className="flex justify-between items-center mb-2 mt-10">
                  <h2 className="text-xl">NIVEL DE JUEGO</h2>
                  <button
                    className="relative left-4 text-primary text-3xl"
                    onClick={() => toggleInfo("SOCIAL_JUEGO")}
                  >
                    {expandedInfo === "SOCIAL_JUEGO" ? "-" : "+"}
                  </button>
                </div>
                {renderRating(
                  selectedRaza?.playfulness_level ?? 0,
                  "Sólo cuando quieras jugar",
                  "Sin parar"
                )}
                <AnimatePresence>
                  {expandedInfo === "SOCIAL_JUEGO" && (
                    <motion.p
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden mt-2 text-md text-gray-400"
                    >
                      Que tan entusiasta es una raza con el juego, incluso
                      después de la etapa de cachorro. Algunas razas seguirán
                      queriendo jugar al tira y afloja o a buscar la pelota
                      hasta bien entrada su edad adulta, mientras que otras
                      estarán felices de simplemente relajarse en el sofá
                      contigo la mayor parte del tiempo.
                    </motion.p>
                  )}
                </AnimatePresence>
                <Separator />
              </div>
              <div>
                <div className="flex justify-between items-center mb-2 mt-10 md:mt-0">
                  <h2 className="text-xl">NATURALEZA PROTECTORA/VIGILANTE</h2>
                  <button
                    className="relative left-4 text-primary text-3xl"
                    onClick={() => toggleInfo("SOCIAL_PROTECTOR")}
                  >
                    {expandedInfo === "SOCIAL_PROTECTOR" ? "-" : "+"}
                  </button>
                </div>
                {renderRating(
                  selectedRaza?.protective_natural_guard ?? 0,
                  "Lo mío es tuyo",
                  "Vigilante"
                )}
                <AnimatePresence>
                  {expandedInfo === "SOCIAL_PROTECTOR" && (
                    <motion.p
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden mt-2 text-md text-gray-400"
                    >
                      La tendencia de una raza a alertarte cuando hay extraños
                      cerca. Estas razas son más propensas a reaccionar ante
                      cualquier amenaza potencial, ya sea el cartero o una
                      ardilla fuera de la ventana. Es probable que estas razas
                      se muestren amigables con los extraños que entren en la
                      casa y sean aceptados por su familia.
                    </motion.p>
                  )}
                </AnimatePresence>
                <Separator />
                <div className="flex justify-between items-center mb-2 mt-10">
                  <h2 className="text-xl">NIVEL DE ADAPTABILIDAD</h2>
                  <button
                    className="relative left-4 text-primary text-3xl"
                    onClick={() => toggleInfo("SOCIAL_ADAP")}
                  >
                    {expandedInfo === "SOCIAL_ADAP" ? "-" : "+"}
                  </button>
                </div>
                {renderRating(
                  selectedRaza?.adaptability_level ?? 0,
                  "Vive para la rutina",
                  "Altamente adaptable"
                )}
                <AnimatePresence>
                  {expandedInfo === "SOCIAL_ADAP" && (
                    <motion.p
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden mt-2 text-md text-gray-400"
                    >
                      Que tan fácilmente maneja una raza los cambios. Esto puede
                      incluir cambios en las condiciones de vida, ruido, clima,
                      rutina diaria y otras variaciones en la vida cotidiana.
                    </motion.p>
                  )}
                </AnimatePresence>
                <Separator />
              </div>
            </div>
          </motion.div>
        );
      case "PERSONALIDAD":
        return (
          <motion.div
            key="PERSONALIDAD"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:gap-36 md:gap:0 mt-10">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-xl">NIVEL DE ENTRENABILIDAD</h2>
                  <button
                    className="relative left-4 text-primary text-3xl"
                    onClick={() => toggleInfo("PERSONALIDAD_ENTRE")}
                  >
                    {expandedInfo === "PERSONALIDAD_ENTRE" ? "-" : "+"}
                  </button>
                </div>
                {renderRating(
                  selectedRaza?.trainability_level ?? 0,
                  "Independiente",
                  "Cooperativo"
                )}
                <AnimatePresence>
                  {expandedInfo === "PERSONALIDAD_ENTRE" && (
                    <motion.p
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden mt-2 text-md text-gray-400"
                    >
                      Que tan fácil será entrenar a tu perro y cuán dispuesto
                      estará a aprender cosas nuevas. Algunas razas solo quieren
                      hacer sentir orgulloso a su dueño, mientras que otras
                      prefieren hacer lo que quieren, cuando quieren, ¡donde
                      quieren!
                    </motion.p>
                  )}
                </AnimatePresence>
                <Separator />
                <div className="flex justify-between items-center mb-2 mt-10">
                  <h2 className="text-xl">NIVEL DE ENERGÍA</h2>
                  <button
                    className="relative left-4 text-primary text-3xl"
                    onClick={() => toggleInfo("PERSONALIDAD_ENERGIA")}
                  >
                    {expandedInfo === "PERSONALIDAD_ENERGIA" ? "-" : "+"}
                  </button>
                </div>
                {renderRating(
                  selectedRaza?.energy_level ?? 0,
                  "Amante del sofá",
                  "Alta energía"
                )}
                <AnimatePresence>
                  {expandedInfo === "PERSONALIDAD_ENERGIA" && (
                    <motion.p
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden mt-2 text-md text-gray-400"
                    >
                      La cantidad de ejercicio y estimulación mental que
                      necesita una raza. Las razas de alta energía están listas
                      para la acción y ansiosas por su próxima aventura. Pasarán
                      su tiempo corriendo, saltando y jugando durante el día.
                      Las razas de baja energía son como los perezosos en el
                      sofá: están contentas simplemente recostadas y durmiendo.
                    </motion.p>
                  )}
                </AnimatePresence>
                <Separator />
              </div>
              <div>
                <div className="flex justify-between items-center mb-2 mt-10 md:mt-0">
                  <h2 className="text-xl">NIVEL DE LADRIDO</h2>
                  <button
                    className="relative left-4 text-primary text-3xl"
                    onClick={() => toggleInfo("PERSONALIDAD_LADRIDO")}
                  >
                    {expandedInfo === "PERSONALIDAD_LADRIDO" ? "-" : "+"}
                  </button>
                </div>
                {renderRating(
                  selectedRaza?.barking_level ?? 0,
                  "Solo para alertar",
                  "Muy hablador"
                )}
                <AnimatePresence>
                  {expandedInfo === "PERSONALIDAD_LADRIDO" && (
                    <motion.p
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden mt-2 text-md text-gray-400"
                    >
                      Con que frecuencia vocaliza esta raza, ya sea con ladridos
                      o aullidos. Mientras que algunas razas ladrarán a cada
                      transeúnte o ave en la ventana, otras solo ladrarán en
                      situaciones particulares. Algunas razas que no ladran
                      pueden aún ser vocales, usando otros sonidos para
                      expresarse.
                    </motion.p>
                  )}
                </AnimatePresence>
                <Separator />
                <div className="flex justify-between items-center mb-2 mt-10">
                  <h2 className="text-xl">ESTIMULACIÓN MENTAL</h2>
                  <button
                    className="relative left-4 text-primary text-3xl"
                    onClick={() => toggleInfo("PERSONALIDAD_MENTAL")}
                  >
                    {expandedInfo === "PERSONALIDAD_MENTAL" ? "-" : "+"}
                  </button>
                </div>
                {renderRating(
                  selectedRaza?.mental_stimulation ?? 0,
                  "Feliz de descansar",
                  "Necesita un trabajo o actividad"
                )}
                <AnimatePresence>
                  {expandedInfo === "PERSONALIDAD_MENTAL" && (
                    <motion.p
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden mt-2 text-md text-gray-400"
                    >
                      Cuanta estimulación mental necesita una raza para
                      mantenerse feliz y saludable. Los perros criados con un
                      propósito pueden tener trabajos que requieren toma de
                      decisiones, resolución de problemas, concentración u otras
                      cualidades. Sin el ejercicio mental que necesitan, crearán
                      sus propios proyectos para mantener sus mentes ocupadas, y
                      probablemente no serán el tipo de proyectos que te
                      gustaría.
                    </motion.p>
                  )}
                </AnimatePresence>
                <Separator />
              </div>
            </div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full p-6 mt-4">
      <h1 className="text-2xl font-bold tracking-tight md:text-3xl text-primary mb-8 text-center">
        Rasgos y características de la raza
      </h1>
      <div className="relative mb-6">
        {/* Borde animado */}
        <motion.div
          className="absolute bottom-0 h-1 bg-primary"
          style={{ width: "25%" }} // Asegúrate de que el borde tenga el mismo ancho que los botones
          initial={{ transform: `translateX(${sectionWidths["FAMILIAR"]}%)` }}
          animate={{
            transform: `translateX(${sectionWidths[activeSection]}%)`,
          }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        />
        {/* Botones de sección */}
        <div className="flex mb-6 relative">
          {["FAMILIAR", "FISICO", "SOCIAL", "PERSONALIDAD"].map((section) => (
            <button
              key={section}
              className={`w-1/4 py-2 text-center relative z-10 ${
                activeSection === section ? "text-primary" : "text-secondary"
              }`}
              onClick={() => setActiveSection(section as Section)}
            >
              {section}
            </button>
          ))}
        </div>
      </div>
      {renderSectionContent()}
    </div>
  );
};
export default Stadistics;
