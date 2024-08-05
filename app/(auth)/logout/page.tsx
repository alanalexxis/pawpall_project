"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import React from "react";
import { Spinner } from "@/components/ui/spinner";

const LogoutPage = () => {
  const router = useRouter();
  useEffect(() => {
    setTimeout(() => router.push("/"), 2000);
  }, []);
  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4">
      <Spinner size="medium" />
    </div>
  );
};

export default LogoutPage;
