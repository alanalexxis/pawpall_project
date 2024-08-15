import {
  data_fetching_article,
  entrenamientoCachorros,
} from "./articles/entrenamiento";
import { html_article_rendering } from "./articles/html-redering";
import { alimentacion } from "./articles/alimentacion";

export interface Blog {
  id: number;
  name: string;
  description: string;
  title: string;
  image: string;
  slug: string;
  created_at: String;
  link: string;
  article: string;
  keywords: string[];
  category?: string;
}
export const blogs: Blog[] = [
  {
    id: 1,
    name: "Entrenamiento básico para cachorros",
    description:
      "Consejos y técnicas para entrenar a tu cachorro desde una edad temprana.",
    title: "Entrenamiento Básico para Cachorros",
    slug: "entrenamiento-cachorros",
    created_at: new Date("8/1/2024").toLocaleString(),
    link: "guides/entrenamiento-cachorros",
    article: entrenamientoCachorros,
    image:
      "https://images.unsplash.com/photo-1586671267731-da2cf3ceeb80?q=80&w=3389&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    keywords: ["cachorros", "entrenamiento", "perros"],
  },
  {
    id: 2,
    name: "Alimentación adecuada para perros",
    description:
      "Guía sobre cómo elegir el mejor alimento para mantener a tu perro saludable.",
    title: "Alimentación Adecuada para Perros",
    slug: "alimentacion-perros",
    created_at: new Date("8/5/2024").toLocaleString(),
    link: "guides/alimentacion-perros",
    article: alimentacion,
    image:
      "https://images.unsplash.com/photo-1601758228006-964e41e5e8eb?q=80&w=3388&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    keywords: ["alimentación", "salud", "perros"],
  },
  {
    id: 3,
    name: "Cuidado dental para perros",
    description:
      "Consejos para mantener la salud dental de tu perro y prevenir problemas.",
    title: "Cuidado Dental para Perros",
    slug: "cuidado-dental-perros",
    created_at: new Date("8/10/2024").toLocaleString(),
    link: "guides/cuidado-dental-perros",
    article: "Cuidado dental para perros...",
    image:
      "https://images.unsplash.com/photo-1552401601-33db828218aa?q=80&w=3189&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    keywords: ["cuidado dental", "perros", "salud"],
  },
  {
    id: 4,
    name: "Cómo elegir el mejor veterinario",
    description:
      "Guía para encontrar un veterinario que se adapte a las necesidades de tu perro.",
    title: "Cómo Elegir el Mejor Veterinario",
    slug: "elegir-veterinario",
    created_at: new Date("8/15/2024").toLocaleString(),
    link: "guides/elegir-veterinario",
    article: "Cómo elegir el mejor veterinario...",
    image:
      "https://images.unsplash.com/photo-1654895716780-b4664497420d?q=80&w=3387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    keywords: ["veterinario", "salud", "perros"],
  },
  {
    id: 5,
    name: "Ejercicio y juegos para perros",
    description:
      "Actividades y juegos que ayudan a mantener a tu perro activo y feliz.",
    title: "Ejercicio y Juegos para Perros",
    slug: "ejercicio-juegos-perros",
    created_at: new Date("8/20/2024").toLocaleString(),
    link: "guides/ejercicio-juegos-perros",
    article: "Ejercicio y juegos para perros...",
    image:
      "https://images.unsplash.com/photo-1650062417088-bad764861441?q=80&w=3387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    keywords: ["ejercicio", "juegos", "perros"],
  },
];
