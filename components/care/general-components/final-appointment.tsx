import { Demo } from "@/components/appointments/demo";
import { Suspense, useState } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

export default function AppointmentDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleClose = () => {
    // Elimina los parámetros de la URL sin recargar la página
    const url = new URL(window.location.href);
    url.searchParams.delete("date");
    url.searchParams.delete("slot");

    // Usa la API history.pushState para actualizar la URL
    window.history.pushState({}, "", url.toString());

    setIsOpen(false);
  };

  return (
    <div>
      <Button
        variant="outline"
        className="w-96"
        onClick={() => setIsOpen(true)}
      >
        Administrar medicamentos
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={handleClose}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white dark:bg-black rounded-lg shadow-2xl max-w-7xl w-11/12 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-2">Cita veterinaria</h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                  Programa tu cita utilizando el formulario a continuación.
                </p>
                <div className="my-4 overflow-auto max-h-[70vh]">
                  <Suspense
                    fallback={
                      <div className="flex justify-center items-center h-64">
                        Loading...
                      </div>
                    }
                  >
                    <Demo onClose={handleClose} />
                  </Suspense>
                </div>
              </div>
              <div className="bg-white dark:bg-black px-6 py-4 flex justify-end">
                <Button variant="outline" onClick={handleClose}>
                  Cerrar
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
