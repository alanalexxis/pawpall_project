"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "@/components/ui/use-toast";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { es } from "date-fns/locale";
import { Textarea } from "@/components/ui/textarea";

const accountFormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "El nombre debe tener al menos 2 caracteres.",
    })
    .max(30, {
      message: "El nombre no debe tener más de 30 caracteres.",
    }),
  dob: z.date({
    required_error: "Se requiere una fecha de nacimiento.",
  }),
  city: z.string().optional(), // Campo opcional para la ciudad
  biography: z.string().optional(), // Campo opcional para la biografía
  cellphone: z.string().optional(), // Campo opcional para la biografía
});

type AccountFormValues = z.infer<typeof accountFormSchema>;

const defaultValues: Partial<AccountFormValues> = {
  // name: "Tu nombre",
  // dob: new Date("2023-01-23"),
  // city: "Tu ciudad", // Valor por defecto opcional
  // bio: "Tu biografía", // Valor por defecto opcional
};

export function AccountForm() {
  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues,
  });

  const [user, setUser] = useState<any>(null);
  const [dob, setDob] = useState<Date | null>(null);
  const [city, setCity] = useState<string | null>(null);
  const [biography, setBiography] = useState<string | null>(null); // Estado para la biografía
  const [cellphone, setCellphone] = useState<string | null>(null); // Estado para la biografía
  const supabase = createClient();
  const [userFullName, setUserFullName] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserAndProfile = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        console.error("Error fetching user:", userError.message);
        return;
      }

      setUser(user);

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileError) {
        console.error("Error fetching profile:", profileError.message);
      } else {
        setUserFullName(profile?.full_name ?? null);
        setDob(profile?.date_of_birth ? new Date(profile.date_of_birth) : null);
        setCity(profile?.city ?? null);
        setBiography(profile?.biography ?? null);
        setCellphone(profile?.cellphone ?? null);

        form.reset({
          name: profile?.full_name ?? "",
          dob: profile?.date_of_birth ? new Date(profile.date_of_birth) : null,
          city: profile?.city ?? "",
          biography: profile?.biography ?? "", // Valor predeterminado para la biografía
          cellphone: profile?.cellphone ?? "",
        });
      }
    };

    fetchUserAndProfile();
  }, [supabase, form]);

  async function updateProfile(
    name: string,
    dob: Date | null,
    city: string | null,
    biography: string | null, // Incluir bio en la actualización
    cellphone: string | null
  ) {
    if (!user) {
      console.error("No user is logged in");
      return;
    }

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: name,
        date_of_birth: dob,
        city,
        biography: biography,
        cellphone: cellphone,
      })
      .eq("id", user.id);

    if (error) {
      console.error("Error updating profile:", error.message);
      toast({
        title: "Error",
        description: "Hubo un error al actualizar tu perfil.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Perfil actualizado",
        description: "Tus datos se han actualizado correctamente.",
      });
    }
  }

  function onSubmit(data: AccountFormValues) {
    if (
      data.name !== userFullName ||
      data.dob !== dob ||
      data.city !== city ||
      data.biography !== biography || // Comparar también el campo bio
      data.cellphone !== cellphone
    ) {
      updateProfile(
        data.name,
        data.dob,
        data.city,
        data.biography,
        data.cellphone
      );
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input {...field} value={field.value ?? userFullName ?? ""} />
              </FormControl>
              <FormDescription>
                Este es el nombre que se mostrará en tu perfil y en los correos
                electrónicos.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="dob"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Fecha de nacimiento</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP", { locale: es })
                      ) : (
                        <span>
                          {dob
                            ? format(dob, "PPP", { locale: es })
                            : "Seleccionar fecha"}
                        </span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={(date) => {
                      if (date) {
                        field.onChange(date);
                        setDob(date);
                      }
                    }}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>
                Tu fecha de nacimiento se utiliza para calcular tu edad.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dirección</FormLabel>
              <FormControl>
                <Input {...field} value={field.value ?? city ?? ""} />
              </FormControl>
              <FormDescription>
                Tu ciudad actual para personalizar tu perfil.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="biography"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Biografía</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Cuéntanos un poco sobre ti"
                  className="resize-none"
                  {...field}
                  value={field.value ?? biography ?? ""} // Muestra la biografía actual o vacío
                />
              </FormControl>
              <FormDescription>
                Una breve descripción sobre ti que será visible en tu perfil.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="cellphone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Número de teléfono</FormLabel>
              <FormControl>
                <Input {...field} value={field.value ?? cellphone ?? ""} />
              </FormControl>
              <FormDescription>
                Tu número de teléfono para contacto adicional.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Actualizar cuenta</Button>
      </form>
    </Form>
  );
}
