"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import LoginImage from "./login-image.jpg";
import LoginImage2 from "./login-image2.jpg";
import LoginImage3 from "./login-image3.jpg";
import { signup } from "@/lib/auth-actions";

import Footer from "@/components/footer/Footer";
import { useTheme } from "next-themes";
import { IoMoon, IoSunny } from "react-icons/io5";
import { AlertDestructive } from "@/components/AlertError";
import { AlertDemo } from "@/components/AlertSucces";
import { motion } from "framer-motion";
export function SignUpForm() {
  // Lista de imágenes para la transición
  const images = [
    LoginImage,
    LoginImage2,
    LoginImage3 /* Agrega más imágenes aquí */,
  ];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    // Cambiar la imagen cada 5 segundos
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  //manejamos el error de login de auth-actions.ts
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const errorMessage = await signup(formData);
    if (errorMessage) {
      setError(errorMessage);
    } else {
      setSuccess(true);
    }
  };

  const { theme, setTheme } = useTheme();
  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Registrarse</h1>
            <p className="text-balance text-muted-foreground">
              Ingrese su información para crear una cuenta
            </p>
          </div>
          {success && <AlertDemo description="Registro exitoso" />}
          {error && (
            <AlertDestructive
              description={
                error === "Email rate limit exceeded"
                  ? "Límite de email alcanzado"
                  : error === "Password should be at least 6 characters."
                  ? "La contraseña debe tener al menos 6 caracteres."
                  : "Algo salió mal."
              }
            />
          )}
          <form onSubmit={handleLogin}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="first-name">Nombre</Label>
                    <Input
                      name="first-name"
                      id="first-name"
                      placeholder="Max"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="last-name">Apellido</Label>
                    <Input
                      name="last-name"
                      id="last-name"
                      placeholder="Robinson"
                      required
                    />
                  </div>
                </div>
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Contraseña</Label>
                  <Link
                    href="/forgot-password"
                    className="ml-auto inline-block text-sm underline"
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
                <Input id="password" name="password" type="password" required />
              </div>
              <Button type="submit" formAction={signup} className="w-full">
                Crear cuenta
              </Button>
            </div>
          </form>
          <div className="mt-4 text-center text-sm">
            ¿Ya tienes una cuenta?{" "}
            <Link href="/login" className="underline">
              Iniciar sesión
            </Link>
          </div>
        </div>
      </div>

      <div className="hidden bg-muted lg:block relative">
        {images.map((image, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{
              opacity: index === currentImageIndex ? 1 : 0,
              transition: { duration: 1 },
            }}
            exit={{ opacity: 0 }}
            className="absolute inset-0"
          >
            <Image
              src={image}
              alt="Imagen"
              width="1920"
              height="1080"
              className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </motion.div>
        ))}
        <div className="absolute w-[600px] top-2/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-center">
          <h2 className="text-3xl font-bold">
            "Haz que cada momento con tu mascota sea especial. Únete y descubre
            cómo hacerlo realidad."
          </h2>
          <blockquote className="text-sm italic mt-2">
            - Equipo de Pawpall
          </blockquote>
        </div>
      </div>
      <Footer />
      <Button
        className="absolute bottom-20 right-10 flex min-h-10 min-w-10 cursor-pointer rounded-full bg-zinc-950 p-0 text-xl text-white hover:bg-zinc-950 dark:bg-white dark:text-zinc-950 hover:dark:bg-white xl:bg-white xl:text-zinc-950 xl:hover:bg-white xl:dark:text-zinc-900"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      >
        {theme === "light" ? (
          <IoMoon className="h-4 w-4" />
        ) : (
          <IoSunny className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}
