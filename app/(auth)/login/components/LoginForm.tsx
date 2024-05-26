"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import LoginImage from "./login-image.jpg";
import LoginImage2 from "./login-image2.jpg";
import { login } from "@/lib/auth-actions";
import SignInWithGoogleButton from "./SignInWithGoogleButton";
import Footer from "@/components/footer/Footer";
import { useTheme } from "next-themes";
import { IoMoon, IoSunny } from "react-icons/io5";
import { AlertDestructive } from "@/components/AlertError";
export function LoginForm() {
  //manejamos el error de login de auth-actions.ts
  const [error, setError] = useState<string | null>(null);
  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const errorMessage = await login(formData);
    if (errorMessage) {
      setError(errorMessage);
    }
  };
  const { theme, setTheme } = useTheme();
  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Iniciar sesión</h1>
            <p className="text-balance text-muted-foreground">
              Ingresa tu correo electrónico a continuación
            </p>
          </div>
          {error && <AlertDestructive />}
          <form onSubmit={handleLogin}>
            <div className="grid gap-4">
              <div className="grid gap-2">
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
              <Button type="submit" formAction={login} className="w-full">
                Iniciar sesión
              </Button>
              <SignInWithGoogleButton />
            </div>
          </form>
          <div className="mt-4 text-center text-sm">
            ¿No tienes una cuenta?{" "}
            <Link href="/signup" className="underline">
              Regístrate
            </Link>
          </div>
        </div>
      </div>

      <div className="hidden bg-muted lg:block relative">
        <Image
          src={LoginImage}
          alt="Imagen"
          width="1920"
          height="1080"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
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
