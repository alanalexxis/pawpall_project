"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";

const items = [
  { id: "recents", label: "Dashboard" },
  { id: "home", label: "Guías" },
  { id: "applications", label: "Salud" },
  { id: "desktop", label: "Cuidado" },
] as const;

const displayFormSchema = z.object({
  items: z.array(z.string()).nonempty({
    message: "Debes seleccionar al menos un ítem.",
  }),
});

type DisplayFormValues = z.infer<typeof displayFormSchema>;

// Estos valores pueden venir de tu base de datos o API.
const defaultValues: DisplayFormValues = {
  items: ["recents", "home"],
};

export function DisplayForm() {
  const form = useForm<DisplayFormValues>({
    resolver: zodResolver(displayFormSchema),
    defaultValues,
  });

  function onSubmit(data: DisplayFormValues) {
    toast({
      title: "Has enviado los siguientes valores:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="items"
          render={({ field }) => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Barra Lateral</FormLabel>
                <FormDescription>
                  Selecciona los elementos que quieres mostrar en la barra
                  lateral.
                </FormDescription>
              </div>
              {items.map((item) => (
                <FormItem
                  key={item.id}
                  className="flex flex-row items-start space-x-3 space-y-0"
                >
                  <FormControl>
                    <Checkbox
                      checked={field.value.includes(item.id)}
                      onCheckedChange={(checked) => {
                        const newItems = checked
                          ? [...field.value, item.id]
                          : field.value.filter((value) => value !== item.id);
                        field.onChange(newItems);
                      }}
                    />
                  </FormControl>
                  <FormLabel className="font-normal">{item.label}</FormLabel>
                </FormItem>
              ))}
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Actualizar visualización</Button>
      </form>
    </Form>
  );
}
