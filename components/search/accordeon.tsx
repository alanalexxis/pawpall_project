import { useState } from "react";
import {
  FaHeartbeat,
  FaCut,
  FaRunning,
  FaDog,
  FaUtensils,
} from "react-icons/fa";

const CareSection = ({ title, icon: Icon, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-t border-gray-300">
      <div
        className="flex items-center justify-between p-4 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center space-x-2">
          <Icon className="w-6 h-6 text-primary" />
          <h2 className="text-lg font-medium">{title}</h2>
        </div>
        <span>{isOpen ? "-" : "+"}</span>
      </div>
      {isOpen && <div className="p-4">{children}</div>}
    </div>
  );
};

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
      <CareSection title="Salud" icon={FaHeartbeat}>
        <p className="text-gray-400">
          Health issues for the Chow Chow may include eyelid entropion, hip
          dysplasia, elbow dysplasia, allergies, and thyroid function. These
          issues may be minimized by health screening, responsible breeding, and
          regular health care and can be diagnosed and managed with veterinary
          care. Extensive and detailed information on the breed's health can be
          found on the website of the Chow Chow Club, Inc.
        </p>
        <p className="mt-4 font-bold">
          Pruebas de salud recomendadas por el National Breed Club:
        </p>
        <ul className="list-disc list-inside mt-2 text-gray-400">
          <li>Patella Evaluation</li>
          <li>Hip Evaluation</li>
          <li>Thyroid Evaluation</li>
          <li>Elbow Evaluation</li>
          <li>Ophthalmologist Evaluation</li>
        </ul>
      </CareSection>
      <CareSection title="Higiene" icon={FaCut}>
        <p className="text-gray-400">
          Health issues for the Chow Chow may include eyelid entropion, hip
          dysplasia, elbow dysplasia, allergies, and thyroid function. These
          issues may be minimized by health screening, responsible breeding, and
          regular health care and can be diagnosed and managed with veterinary
          care. Extensive and detailed information on the breed's health can be
          found on the website of the Chow Chow Club, Inc.
        </p>
      </CareSection>
      <CareSection title="Ejercicio" icon={FaRunning}>
        <p className="text-gray-400">
          Health issues for the Chow Chow may include eyelid entropion, hip
          dysplasia, elbow dysplasia, allergies, and thyroid function. These
          issues may be minimized by health screening, responsible breeding, and
          regular health care and can be diagnosed and managed with veterinary
          care. Extensive and detailed information on the breed's health can be
          found on the website of the Chow Chow Club, Inc.
        </p>
      </CareSection>
      <CareSection title="Entrenamiento" icon={FaDog}>
        <p className="text-gray-400">
          Health issues for the Chow Chow may include eyelid entropion, hip
          dysplasia, elbow dysplasia, allergies, and thyroid function. These
          issues may be minimized by health screening, responsible breeding, and
          regular health care and can be diagnosed and managed with veterinary
          care. Extensive and detailed information on the breed's health can be
          found on the website of the Chow Chow Club, Inc.
        </p>
      </CareSection>
      <CareSection title="Nutrición" icon={FaUtensils}>
        <p className="text-gray-400">
          Health issues for the Chow Chow may include eyelid entropion, hip
          dysplasia, elbow dysplasia, allergies, and thyroid function. These
          issues may be minimized by health screening, responsible breeding, and
          regular health care and can be diagnosed and managed with veterinary
          care. Extensive and detailed information on the breed's health can be
          found on the website of the Chow Chow Club, Inc.
        </p>
      </CareSection>
    </div>
  );
}
