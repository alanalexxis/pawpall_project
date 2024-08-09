import { useState } from "react";
import {
  FaHeartbeat,
  FaCut,
  FaRunning,
  FaDog,
  FaUtensils,
} from "react-icons/fa";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

export default function Home() {
  return (
    <div className="max-w-5xl mx-auto my-8">
      <h1 className="text-2xl font-bold tracking-tight md:text-3xl text-primary mb-8 text-center">
        ¿Qué esperar al cuidar un Chow Chow?
      </h1>
      <p className="mb-8 text-md">
        Ser dueño de un perro{" "}
        <i>no es solo un privilegio; es una responsabilidad.</i> Ellos dependen
        de nosotros, al menos, para comida y refugio, y merecen mucho más.
        Cuando decides incorporar un perro a tu vida, necesitas comprender el
        compromiso que conlleva ser su dueño.
      </p>
      <Accordion type="multiple">
        <AccordionItem value="item-1">
          <AccordionTrigger>
            <div className="flex items-center space-x-2">
              <FaHeartbeat className="w-6 h-6 text-primary" />
              <h2 className="text-lg font-medium">Salud</h2>
            </div>
          </AccordionTrigger>
          <AccordionContent className="p-4">
            <p className="text-gray-400 text-base">
              Health issues for the Chow Chow may include eyelid entropion, hip
              dysplasia, elbow dysplasia, allergies, and thyroid function. These
              issues may be minimized by health screening, responsible breeding,
              and regular health care and can be diagnosed and managed with
              veterinary care. Extensive and detailed information on the breed's
              health can be found on the website of the Chow Chow Club, Inc.
            </p>

            <p className="mt-4 font-bold">
              Pruebas de salud recomendadas por el National Breed Club:
            </p>
            <ul className="list-disc list-inside mt-2 text-gray-400 text-base">
              <li>Patella Evaluation</li>
              <li>Hip Evaluation</li>
              <li>Thyroid Evaluation</li>
              <li>Elbow Evaluation</li>
              <li>Ophthalmologist Evaluation</li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2">
          <AccordionTrigger>
            <div className="flex items-center space-x-2">
              <FaCut className="w-6 h-6 text-primary" />
              <h2 className="text-lg font-medium">Higiene</h2>
            </div>
          </AccordionTrigger>
          <AccordionContent className="p-4">
            <p className="text-gray-400 text-base">
              Health issues for the Chow Chow may include eyelid entropion, hip
              dysplasia, elbow dysplasia, allergies, and thyroid function. These
              issues may be minimized by health screening, responsible breeding,
              and regular health care and can be diagnosed and managed with
              veterinary care. Extensive and detailed information on the breed's
              health can be found on the website of the Chow Chow Club, Inc.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-3">
          <AccordionTrigger>
            <div className="flex items-center space-x-2">
              <FaRunning className="w-6 h-6 text-primary" />
              <h2 className="text-lg font-medium">Ejercicio</h2>
            </div>
          </AccordionTrigger>
          <AccordionContent className="p-4">
            <p className="text-gray-400 text-base">
              Health issues for the Chow Chow may include eyelid entropion, hip
              dysplasia, elbow dysplasia, allergies, and thyroid function. These
              issues may be minimized by health screening, responsible breeding,
              and regular health care and can be diagnosed and managed with
              veterinary care. Extensive and detailed information on the breed's
              health can be found on the website of the Chow Chow Club, Inc.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-4">
          <AccordionTrigger>
            <div className="flex items-center space-x-2">
              <FaDog className="w-6 h-6 text-primary" />
              <h2 className="text-lg font-medium">Entrenamiento</h2>
            </div>
          </AccordionTrigger>
          <AccordionContent className="p-4">
            <p className="text-gray-400 text-base">
              Health issues for the Chow Chow may include eyelid entropion, hip
              dysplasia, elbow dysplasia, allergies, and thyroid function. These
              issues may be minimized by health screening, responsible breeding,
              and regular health care and can be diagnosed and managed with
              veterinary care. Extensive and detailed information on the breed's
              health can be found on the website of the Chow Chow Club, Inc.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-5">
          <AccordionTrigger>
            <div className="flex items-center space-x-2">
              <FaUtensils className="w-6 h-6 text-primary" />
              <h2 className="text-lg font-medium">Nutrición</h2>
            </div>
          </AccordionTrigger>
          <AccordionContent className="p-4">
            <p className="text-gray-400 text-base">
              Health issues for the Chow Chow may include eyelid entropion, hip
              dysplasia, elbow dysplasia, allergies, and thyroid function. These
              issues may be minimized by health screening, responsible breeding,
              and regular health care and can be diagnosed and managed with
              veterinary care. Extensive and detailed information on the breed's
              health can be found on the website of the Chow Chow Club, Inc.
            </p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
