"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "../ui/card";
import { useRaza } from "@/contexts/razaContext";
type Section = "ACERCA" | "HISTORIA";
export default function About() {
  const { selectedRaza } = useRaza();
  const [activeSection, setActiveSection] = useState<Section>("ACERCA");

  const sectionWidths: Record<Section, number> = {
    ACERCA: 0,
    HISTORIA: 100,
  };

  const renderSectionContent = () => {
    const contentVariants = {
      initial: { opacity: 0, y: 10 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -10 },
    };

    if (activeSection === "ACERCA") {
      return (
        <motion.div
          key="ACERCA"
          initial="initial"
          animate="animate"
          exit="exit"
          variants={contentVariants}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          <Card className="overflow-hidden p-2">
            <section className="w-full py-6 md:py-12 lg:py-24">
              <div className="container mx-auto px-4 md:px-6 lg:px-8">
                <div className="grid gap-8">
                  <div className="grid gap-4">
                    <h2 className="text-3xl font-bold tracking-tighter text-primary md:text-4xl lg:text-5xl">
                      Acerca de la raza{" "}
                      {selectedRaza?.name || "CARGANDO NOMBRE"}
                    </h2>
                    <p className="text-gray-600 md:text-xl lg:text-2xl leading-relaxed">
                      {selectedRaza?.about || "CARGANDO NOMBRE"}
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </Card>
        </motion.div>
      );
    } else if (activeSection === "HISTORIA") {
      return (
        <motion.div
          key="HISTORIA"
          initial="initial"
          animate="animate"
          exit="exit"
          variants={contentVariants}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          <Card className="rounded-lg overflow-hidden p-2">
            <section className="w-full py-6 md:py-12 lg:py-24">
              <div className="container mx-auto px-4 md:px-6 lg:px-8">
                <div className="grid gap-8">
                  <div className="grid gap-4">
                    <h2 className="text-3xl font-bold tracking-tighter text-primary md:text-4xl lg:text-5xl">
                      Historia de la raza{" "}
                      {selectedRaza?.name || "CARGANDO NOMBRE"}
                    </h2>
                    <p className="text-gray-600 md:text-xl lg:text-2xl leading-relaxed">
                      {selectedRaza?.history || "CARGANDO NOMBRE"}
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </Card>
        </motion.div>
      );
    }
  };

  return (
    <div className="w-full p-6 mt-4">
      <h1 className="text-2xl font-bold tracking-tight md:text-3xl text-primary mb-8 text-center">
        Información de la raza
      </h1>
      <div className="relative mb-6">
        {/* Borde animado */}
        <motion.div
          className="absolute bottom-0 h-1 bg-primary"
          style={{ width: "50%" }} // Asegúrate de que el borde tenga el mismo ancho que los botones
          initial={{ x: `${sectionWidths["ACERCA"]}%` }}
          animate={{ x: `${sectionWidths[activeSection]}%` }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        />
        {/* Botones de sección */}
        <div className="flex mb-6 relative">
          {["ACERCA", "HISTORIA"].map((section) => (
            <button
              key={section}
              className={`w-1/2 py-2 text-center relative z-10 ${
                activeSection === section ? "text-primary" : "text-secondary"
              }`}
              onClick={() => setActiveSection(section as Section)}
            >
              {section}
            </button>
          ))}
        </div>
      </div>
      <motion.div
        key={activeSection}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        {renderSectionContent()}
      </motion.div>
    </div>
  );
}
