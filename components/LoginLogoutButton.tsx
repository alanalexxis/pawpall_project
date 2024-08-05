"use client";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { signout } from "@/lib/auth-actions";
import { ArrowRightIcon } from "lucide-react";

const LoginButton = () => {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const supabase = createClient();
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
      <Button
        onClick={() => {
          signout();
          setUser(null);
        }}
      >
        Cerrar sesión
      </Button>
    );
  }
  return (
    <Button
      variant="expandIcon"
      Icon={ArrowRightIcon}
      iconPlacement="right"
      onClick={() => {
        router.push("/login");
      }}
    >
      Iniciar sesión
    </Button>
  );
};

export default LoginButton;
