// components/BreedStandard.js
import React from "react";
import { Card } from "../ui/card";
import { PawPrintIcon } from "lucide-react";
import { useRaza } from "@/contexts/razaContext";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const BreedStandard = () => {
  const { selectedRaza } = useRaza();
  return (
    <div className="flex flex-col md:flex-row p-4 gap-8">
      <Card className="w-full md:max-w-md p-6 bg-[conic-gradient(at_top,_var(--tw-gradient-stops))] from-yellow-200 via-emerald-200 to-yellow-200 text-card-foreground">
        <div className="flex flex-col items-center gap-6">
          <img
            src={selectedRaza?.image_url || "/labrador.jpg"}
            alt="Golden Retriever"
            width={300}
            height={300}
            className="rounded-full"
            style={{ aspectRatio: "300/300", objectFit: "cover" }}
          />
          <h2 className="text-3xl font-bold">
            El {selectedRaza?.name || "CARGANDO NOMBRE"} fue reconocido como
            raza por el AKC en{" "}
            {selectedRaza?.recognized_date
              ? new Date(selectedRaza.recognized_date).getFullYear()
              : "CARGANDO FECHA"}
          </h2>

          <div className="flex items-center gap-2">
            <PawPrintIcon className="w-5 h-5 fill-black dark:fill-white" />
            <span className="text-sm font-medium">
              Breed recognized in{" "}
              {selectedRaza?.recognized_date
                ? new Date(selectedRaza.recognized_date).getFullYear()
                : "CARGANDO FECHA"}
            </span>
          </div>
        </div>
      </Card>

      <section className="w-full">
        <div className="container px-4 md:px-6">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl text-primary">
              Estándar de raza
            </h2>
            <p className="max-w-[650px] text-gray-400">
              Una descripción del perro ideal de cada raza reconocida, que sirve
              como un ideal contra el cual los perros son juzgados en
              exposiciones. Este estándar es originalmente establecido por un
              club de raza progenitor y aceptado oficialmente por organismos
              nacionales o internacionales.
            </p>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <h3 className="mb-4 text-lg font-medium">Colores de la raza</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Descripción</TableHead>
                      <TableHead>Código de registro</TableHead>
                      <TableHead>Color estándar </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Piebald</TableCell>
                      <TableCell>025</TableCell>
                      <TableCell>Blanco y negro</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
              <div className="mt-0">
                <h3 className="mb-4 text-lg font-medium">Marcas de la raza</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Descripción</TableHead>
                      <TableHead className="">Código de registro</TableHead>
                      <TableHead>Color estándar</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Saddle-Back</TableCell>
                      <TableCell>026</TableCell>
                      <TableCell>Marrón y negro</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BreedStandard;
