"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Home, Crown, PawPrint } from "lucide-react";
import useWindowSize from "react-use/lib/useWindowSize";
import Confetti from "react-confetti";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Page() {
  const { width, height } = useWindowSize();
  const [showConfetti, setShowConfetti] = useState(false);
  // Espera unos segundos antes de mostrar el confeti
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowConfetti(true);
    }, 1000); // Espera 1 segundos

    return () => clearTimeout(timer); // Limpiar el temporizador al desmontar
  }, []);

  return (
    <>
      {showConfetti && (
        <div
          className="fixed inset-0 z-50 pointer-events-none"
          style={{ overflow: "hidden" }}
        >
          <Confetti width={width} height={height} recycle={true} />
        </div>
      )}
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary/20 via-background to-secondary/20 p-4">
        <Card className="w-full max-w-[450px] text-center shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-secondary to-primary" />
          <Badge
            variant="secondary"
            className="absolute top-4 right-4 text-sm px-3 py-1 font-semibold"
          >
            <Crown className="w-4 h-4 mr-1" />
            Premium
          </Badge>
          <CardHeader className="pt-16 pb-6">
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 rounded-full animate-pulse" />
                <ShoppingBag className="w-28 h-28 text-primary relative z-10 animate-bounce" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-8 px-6">
            <div>
              <h2 className="text-4xl font-bold mb-3 text-primary">
                ¡Gracias por tu compra!
              </h2>
              <p className="text-xl text-muted-foreground">
                Ahora eres miembro Premium
              </p>
            </div>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Tu pedido ha sido procesado con éxito. Recibirás un correo
              electrónico con los detalles de tu compra.
            </p>
            <div className="bg-secondary/30 p-6 rounded-lg shadow-inner">
              <PawPrint className="w-8 h-8 text-primary mx-auto mb-4" />
              <p className="text-md italic text-muted-foreground">
                "Un perro feliz es un perro bien cuidado. Gracias por confiar en
                nosotros para el cuidado de tu mejor amigo."
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center pb-8 px-6">
            <Link href="/dashboard" className="w-full">
              <Button className="w-full text-lg font-semibold" size="lg">
                <Home className="mr-2 h-5 w-5" /> Volver al menú principal
              </Button>
            </Link>
          </CardFooter>
          <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-secondary to-primary" />
        </Card>
      </div>
    </>
  );
}
