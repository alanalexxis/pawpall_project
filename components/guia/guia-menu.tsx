"use client";
import { JSX, SetStateAction, SVGProps, useState } from "react";
import { Button } from "@/components/ui/button";
import { blogs } from "@/content/article";
import Link from "next/link";
export default function Guias() {
  const [activeFilter, setActiveFilter] = useState("all");
  const handleFilterChange = (filter: SetStateAction<string>) => {
    setActiveFilter(filter);
  };
  const filteredItems =
    activeFilter === "all"
      ? blogs
      : blogs.filter((item) => item.category === activeFilter);
  return (
    <div className="container mx-auto px-4 ">
      <div className="mb-8 flex justify-center">
        <div className="flex gap-4">
          <Button
            variant={activeFilter === "all" ? "ghost" : "outline"}
            onClick={() => handleFilterChange("all")}
          >
            All
          </Button>
          <Button
            variant={activeFilter === "nature" ? "ghost" : "outline"}
            onClick={() => handleFilterChange("nature")}
          >
            Nutrición
          </Button>
          <Button
            variant={activeFilter === "urban" ? "ghost" : "outline"}
            onClick={() => handleFilterChange("urban")}
          >
            Salud
          </Button>
          <Button
            variant={activeFilter === "architecture" ? "ghost" : "outline"}
            onClick={() => handleFilterChange("architecture")}
          >
            Entrenamiento
          </Button>
          <Button
            variant={activeFilter === "art" ? "ghost" : "outline"}
            onClick={() => handleFilterChange("art")}
          >
            Ejercicio
          </Button>
          <Button
            variant={activeFilter === "design" ? "ghost" : "outline"}
            onClick={() => handleFilterChange("design")}
          >
            Cuidado personal
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filteredItems.map((item) => (
          <Link href={`/guides/${item.slug}`} key={item?.id}>
            <div
              key={item.id}
              className="relative overflow-hidden rounded-lg shadow-lg transition-transform duration-300 ease-in-out hover:-translate-y-2 hover:shadow-xl"
            >
              <img
                src={item.image}
                alt={item.title}
                width={600}
                height={400}
                className="h-64 w-full object-cover"
                style={{ aspectRatio: "600/400", objectFit: "cover" }}
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 dark:bg-white/50 opacity-0 transition-opacity duration-300 ease-in-out hover:opacity-100">
                <EyeIcon className="h-12 w-12 text-white" />
              </div>
              <div className="p-4 bg-background">
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
function EyeIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
