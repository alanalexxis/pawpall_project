// components/SearchBar.tsx
"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "@/components/ui/use-toast";
import React from "react";
import { useRaza } from "@/contexts/razaContext"; // Importar el hook del contexto
import { Spinner } from "../ui/spinner";

interface Raza {
  id: number;
  name: string;
  popularity: string;
  image_url: string;
  breed_group: string;
  country_of_origin: string;
  height_male: string;
  height_female: string;
  min_weight_male: string;
  min_weight_female: string;
  max_weight_male: string;
  max_weight_female: string;
  life_expectancy: string;
  recognized_date: string;
  about: string;
  history: string;
  health_description: string;
  grooming_description: string;
  exercise_description: string;
  training_description: string;
  nutrition_description: string;
  characteristics: string;
  affectionate_with_family: number;
  good_with_other_dogs: number;
  good_with_small_children: number;
  shedding: number;
  grooming_frequency: number;
  salivation_level: number;
  open_to_strangers: number;
  protective_natural_guard: number;
  playfulness_level: number;
  adaptability_level: number;
  trainability_level: number;
  barking_level: number;
  energy_level: number;
  mental_stimulation: number;
}

const FormSchema = z.object({
  raza: z.string({
    required_error: "Please select a breed.",
  }),
});

export function SearchBar() {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = useState(false); // Estado de carga
  const supabase = createClient();
  const [razas, setRazas] = useState<Raza[]>([]);
  const {
    selectedRaza,
    setSelectedRaza,
    setFacts,
    setCoatLengths,
    setCoatTypes,
  } = useRaza();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  useEffect(() => {
    const fetchRazas = async () => {
      setLoading(true); // Inicia el estado de carga
      const { data, error } = await supabase.from("breeds").select("*");
      setLoading(false); // Finaliza el estado de carga
      if (error) {
        console.error("Error fetching breeds:", error);
      } else {
        setRazas(data);
      }
    };

    fetchRazas();
  }, []);

  useEffect(() => {
    const fetchFactsAndCoatData = async (breedId: number) => {
      setLoading(true); // Inicia el estado de carga
      try {
        const [factsResponse, coatLengthsResponse, coatTypesResponse] =
          await Promise.all([
            supabase.from("curiosities").select("*").eq("breed_id", breedId),
            supabase
              .from("breed_coat_length")
              .select("*")
              .eq("breed_id", breedId),
            supabase
              .from("breed_coat_types")
              .select("*")
              .eq("breed_id", breedId),
          ]);

        if (factsResponse.error) {
          console.error("Error fetching facts:", factsResponse.error);
        } else {
          setFacts(factsResponse.data);
        }

        if (coatLengthsResponse.error) {
          console.error(
            "Error fetching coat lengths:",
            coatLengthsResponse.error
          );
        } else {
          setCoatLengths(coatLengthsResponse.data);
        }

        if (coatTypesResponse.error) {
          console.error("Error fetching coat types:", coatTypesResponse.error);
        } else {
          setCoatTypes(coatTypesResponse.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false); // Finaliza el estado de carga
      }
    };

    if (selectedRaza) {
      fetchFactsAndCoatData(selectedRaza.id);
    }
  }, [selectedRaza]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="raza"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-[200px] justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value
                        ? razas.find((raza) => raza.id === Number(field.value))
                            ?.name
                        : "Seleccione una raza"}
                      <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput
                      placeholder="Buscar raza..."
                      className="h-9"
                    />
                    <CommandList>
                      <CommandEmpty>Raza no encontrada.</CommandEmpty>
                      <CommandGroup>
                        {razas.map((raza) => (
                          <CommandItem
                            value={raza.name}
                            key={raza.id}
                            onSelect={() => {
                              form.setValue("raza", raza.id.toString());
                              setSelectedRaza(raza); // Actualizar el contexto con la raza completa
                              setOpen(false);
                            }}
                          >
                            {raza.name}
                            <CheckIcon
                              className={cn(
                                "ml-auto h-4 w-4",
                                raza.id === Number(field.value)
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

              <FormMessage />
            </FormItem>
          )}
        />
      </form>
      {loading && (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-white/80 dark:bg-black/80 bg-opacity-80 flex items-center justify-center z-50">
          <Spinner size="medium" />
        </div>
      )}
    </Form>
  );
}
