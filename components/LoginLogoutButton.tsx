"use client";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";

const LoginButton = () => {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const supabase = createClient();
  const handleSignout = async () => {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.log(error);
      // En vez de redirigir, podrías mostrar un mensaje de error o hacer otra cosa
      return false;
    }
    return true;
  };
  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();
  }, []);
  if (user) {
    return (
      <Link href="/logout">
        <Button onClick={handleSignout}>Cerrar sesión</Button>
      </Link>
    );
  }
  return (
    <Link href="/login">
      <Button
        variant="expandIcon"
        Icon={ArrowRightIcon}
        iconPlacement="right"
        className="flex items-center"
      >
        Iniciar sesión
      </Button>
    </Link>
  );
};

export default LoginButton;
