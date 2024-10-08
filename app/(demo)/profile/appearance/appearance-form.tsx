"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/components/ui/use-toast";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";

const appearanceFormSchema = z.object({
  id: z.string().optional(),
  profile_id: z.string().optional(),
  theme: z.enum(["light", "dark"], {
    required_error: "Por favor, selecciona un tema.",
  }),
  font: z.enum(["inter"]).optional(),
});

type AppearanceFormValues = z.infer<typeof appearanceFormSchema>;

const defaultValues: Partial<AppearanceFormValues> = {
  theme: "light",
};

export function AppearanceForm() {
  const supabase = createClient();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const form = useForm<AppearanceFormValues>({
    resolver: zodResolver(appearanceFormSchema),
    defaultValues,
  });

  useEffect(() => {
    setMounted(true);

    const fetchUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        console.error("Error fetching user:", error.message);
        return;
      }

      setUserId(user?.id || null);
    };

    fetchUser();
  }, [supabase]);

  if (!mounted) return null;

  async function onSubmit(data: AppearanceFormValues) {
    console.log("Data antes de enviar:", data);
    console.log("Usuario ID:", userId);

    if (!userId) {
      toast({
        title: "Error",
        description: "No se pudo identificar al usuario.",
        variant: "destructive",
      });
      return;
    }

    if (data.theme !== theme) {
      setTheme(data.theme);
    }

    const { error } = await supabase.from("appearance_preferences").upsert({
      profile_id: userId,
      theme: data.theme,
    });

    if (error) {
      console.error("Error saving theme:", error.message);
      toast({
        title: "Error",
        description: "Hubo un problema al guardar las preferencias.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Preferencias guardadas",
        description: "Tus preferencias han sido actualizadas correctamente.",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="font"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fuente</FormLabel>
              <div className="relative w-max">
                <FormControl>
                  <select
                    className={cn("w-[200px] appearance-none font-normal")}
                    {...field}
                  >
                    <option value="inter">Inter</option>
                  </select>
                </FormControl>
                <ChevronDownIcon className="absolute right-3 top-2.5 h-4 w-4 opacity-50" />
              </div>
              <FormDescription>
                Configura la fuente que deseas usar en el panel.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="theme"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel>Tema</FormLabel>
              <FormDescription>
                Selecciona el tema para el panel.
              </FormDescription>
              <FormMessage />
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="grid max-w-md grid-cols-2 gap-8 pt-2"
              >
                <FormItem>
                  <FormLabel className="[&:has([data-state=checked])>div]:border-primary">
                    <FormControl>
                      <RadioGroupItem value="light" className="sr-only" />
                    </FormControl>
                    <div className="items-center rounded-md border-2 border-muted p-1 hover:border-accent">
                      <div className="space-y-2 rounded-sm bg-[#ecedef] p-2">
                        <div className="space-y-2 rounded-md bg-white p-2 shadow-sm">
                          <div className="h-2 w-[80px] rounded-lg bg-[#ecedef]" />
                          <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                        </div>
                        <div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
                          <div className="h-4 w-4 rounded-full bg-[#ecedef]" />
                          <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                        </div>
                        <div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
                          <div className="h-4 w-4 rounded-full bg-[#ecedef]" />
                          <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                        </div>
                      </div>
                    </div>
                    <span className="block w-full p-2 text-center font-normal">
                      Claro
                    </span>
                  </FormLabel>
                </FormItem>
                <FormItem>
                  <FormLabel className="[&:has([data-state=checked])>div]:border-primary">
                    <FormControl>
                      <RadioGroupItem value="dark" className="sr-only" />
                    </FormControl>
                    <div className="items-center rounded-md border-2 border-muted bg-popover p-1 hover:bg-accent hover:text-accent-foreground">
                      <div className="space-y-2 rounded-sm bg-slate-950 p-2">
                        <div className="space-y-2 rounded-md bg-slate-800 p-2 shadow-sm">
                          <div className="h-2 w-[80px] rounded-lg bg-slate-400" />
                          <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                        </div>
                        <div className="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm">
                          <div className="h-4 w-4 rounded-full bg-slate-400" />
                          <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                        </div>
                        <div className="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm">
                          <div className="h-4 w-4 rounded-full bg-slate-400" />
                          <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                        </div>
                      </div>
                    </div>
                    <span className="block w-full p-2 text-center font-normal">
                      Oscuro
                    </span>
                  </FormLabel>
                </FormItem>
              </RadioGroup>
            </FormItem>
          )}
        />

        <Button type="submit">Actualizar preferencias</Button>
      </form>
    </Form>
  );
}
