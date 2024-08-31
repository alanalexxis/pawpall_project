"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { createClient } from "@/utils/supabase/client";

interface UserContextType {
  user: any;
  setUser: (user: any) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchUser = async () => {
      // Obtener la información básica del usuario autenticado
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (authUser) {
        // Consultar la tabla profiles para obtener detalles adicionales del perfil
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", authUser.id) // Suponiendo que el perfil tiene el mismo id que el authUser
          .single();

        if (error) {
          console.error(
            "Error al obtener el perfil del usuario:",
            error.message
          );
        } else {
          // Combinar los datos de autenticación con el perfil
          setUser({ ...authUser, ...profile });
        }
      }
    };

    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
