"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import React from "react";
import { Spinner } from "@/components/ui/spinner";
import { createClient } from "@/utils/supabase/client";
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

const LogoutPage = () => {
  const router = useRouter();
  useEffect(() => {
    const signOut = async () => {
      const result = await handleSignout();
      if (result) {
        setTimeout(() => {
          window.location.href = "/";
        }, 2000);
      }
    };

    signOut();
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4">
      <Spinner size="medium" />
    </div>
  );
};

export default LogoutPage;
