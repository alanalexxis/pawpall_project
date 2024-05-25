import { Button } from "@/components/ui/button";
import { signInWithGoogle } from "@/lib/auth-actions";
import React from "react";
import { FcGoogle } from "react-icons/fc";

const SignInWithGoogleButton = () => {
  return (
    <Button
      type="button"
      variant="outline"
      className="w-full flex items-center"
      onClick={() => {
        signInWithGoogle();
      }}
    >
      <FcGoogle className="mr-2" /> Iniciar sesión con Google
    </Button>
  );
};

export default SignInWithGoogleButton;
