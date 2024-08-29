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
import { useEffect, useState } from "react";

interface Raza {
  id: number;
  name: string;
}

const FormSchema = z.object({
  raza: z.string({
    required_error: "Por favor selecciona una raza.",
  }),
});

interface SearchBarPetsProps {
  onRazaSelect: (razaId: string) => void;
  selectedRazaId: string; // Añadido para manejar el valor seleccionado
}

export function SearchBarPets({
  onRazaSelect,
  selectedRazaId,
}: SearchBarPetsProps) {
  const [open, setOpen] = useState(false);
  const supabase = createClient();
  const [razas, setRazas] = useState<Raza[]>([]);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      raza: selectedRazaId, // Establecer el valor inicial
    },
  });

  useEffect(() => {
    const fetchRazas = async () => {
      const { data, error } = await supabase.from("breeds").select("*");
      if (error) {
        console.error("Error fetching breeds:", error);
      } else {
        setRazas(data);
      }
    };

    fetchRazas();
  }, [supabase]);

  useEffect(() => {
    // Actualizar el valor del formulario cuando cambia el selectedRazaId
    form.setValue("raza", selectedRazaId);
  }, [selectedRazaId, form]);

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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 ">
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
                            value={raza.id.toString()}
                            key={raza.id}
                            onSelect={() => {
                              form.setValue("raza", raza.id.toString());
                              onRazaSelect(raza.id.toString()); // Pasar el ID al componente padre
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
    </Form>
  );
}
