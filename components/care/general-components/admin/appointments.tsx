"use client";
import { differenceInYears, differenceInMonths } from "date-fns";
import * as React from "react";
import {
  CaretSortIcon,
  ChevronDownIcon,
  DotsHorizontalIcon,
} from "@radix-ui/react-icons";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dog } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useSelectedPet } from "@/contexts/selectedPetContext";
import Link from "next/link";

type Appointment = {
  id: number;
  date: string;
  reason: string;
  status: number;
  note: string;
  hour: string;
  petName: string;
  ownerName: string;
  index: number;
  medical_note: string;
};

const data: Appointment[] = [];

export const columns: ColumnDef<Appointment>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "index",
    header: "Id",
    cell: ({ row }) => row.original.index,
  },
  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Fecha
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "hour",
    header: "Hora",
  },
  {
    accessorKey: "petName",
    header: "Nombre de mascota",
  },
  {
    accessorKey: "ownerName",
    header: "Dueño",
  },
  {
    accessorKey: "reason",
    header: "Razón",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const statusValue = row.getValue("status") as number;
      let status: string;

      switch (statusValue) {
        case 1:
          status = "Pendiente";
          break;
        case 2:
          status = "Aprobada";
          break;
        case 3:
          status = "Rechazada";
          break;
        default:
          status = "Unknown";
      }

      return (
        <Badge
          variant={
            status === "Aprobada"
              ? "default"
              : status === "Rechazada"
              ? "destructive"
              : "success"
          }
        >
          {status}
        </Badge>
      );
    },
  },

  {
    accessorKey: "note",
    header: "Nota adicional",
  },
  {
    accessorKey: "medical_note",
    header: "Nota médica",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const supabase = createClient();

      const appointment = row.original;
      const { setSelectedPet } = useSelectedPet(); // Usar el contexto
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <DotsHorizontalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() =>
                navigator.clipboard.writeText(appointment.id.toString())
              }
            >
              Copiar ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <Link href="/admin/dashboard/medical">
              <DropdownMenuItem
                onClick={async () => {
                  const { data: petData, error: petError } = await supabase
                    .from("pets")
                    .select("*")
                    .eq("id", appointment.pet_id) // Filtrar por el pet_id seleccionado
                    .single();

                  if (petError) {
                    console.error("Error fetching pet details:", petError);
                    return;
                  }

                  let ownerName = petData.owner_name;
                  let city = petData.city;
                  let email = "";
                  let weight = petData.weight;
                  let gender = petData.gender;
                  let cellphone = "";
                  let breedName = "";
                  let age = "";

                  const { data: profileData, error: profileError } =
                    await supabase
                      .from("profiles")
                      .select("full_name, city, email, cellphone")
                      .eq("id", petData.profile_id)
                      .single();

                  if (profileError) {
                    console.error("Error fetching profile:", profileError);
                  } else {
                    {
                      ownerName = profileData.full_name;
                      city = profileData.city;
                      email = profileData.email;
                      cellphone = profileData.cellphone;
                    }
                  }

                  const { data: breedData, error: breedError } = await supabase
                    .from("breeds")
                    .select("*")
                    .eq("id", petData.breed_id)
                    .single();

                  if (breedError) {
                    console.error("Error fetching breed:", breedError);
                  } else {
                    breedName = breedData.name;
                  }

                  const birthdate = new Date(petData.birthdate);
                  const years = differenceInYears(new Date(), birthdate);
                  const months = differenceInMonths(new Date(), birthdate) % 12;

                  const yearText = years === 1 ? "año" : "años";
                  const monthText = months === 1 ? "mes" : "meses";

                  age = `${years} ${yearText}${
                    months > 0 ? ` y ${months} ${monthText}` : ""
                  }`;

                  // Establecer los detalles de la mascota en el contexto seleccionado
                  setSelectedPet({
                    id: appointment.pet_id,
                    name: petData.name,
                    owner_name: ownerName,
                    location: location,
                    breed: breedName,
                    profileId: petData.profile_id,
                    age: age,
                    birthdate: petData.birthdate,
                    weight: weight,
                    gender: gender,
                    ownerName: ownerName,
                    email: email,
                    city: city,
                    cellphone: cellphone,
                  });

                  console.log("Mascota seleccionada:", appointment.pet_id);
                }}
              >
                Ver detalles de mascota
              </DropdownMenuItem>
            </Link>
            <DropdownMenuItem>Ver detalles de dueño</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export function AdvancedAppointmentTable() {
  const { selectedPet, setSelectedPet } = useSelectedPet();
  const supabase = createClient();
  const [appointments, setAppointments] = React.useState<Appointment[]>(data);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [pets, setPets] = useState([]);
  const [isPetsUpdated, setIsPetsUpdated] = useState(false);
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [medicalNote, setMedicalNote] = React.useState("");
  const [actionType, setActionType] = React.useState<
    "approve" | "reject" | null
  >(null);
  useEffect(() => {
    const fetchAppointments = async () => {
      const { data, error } = await supabase
        .from("appointments")
        .select(
          `
        id,
        date,
        reason,
        status,
        note,
        hour,
        pet_id,
        profile_id,
        pets (name),
        profiles (full_name),
        medical_note
      `
        )
        .order("id", { ascending: false }); // Orden descendente por ID

      if (error) {
        console.error("Error fetching appointments:", error);
      } else {
        const mappedAppointments = data.map((appointment, index) => ({
          ...appointment,
          petName: appointment.pets.name,
          ownerName: appointment.profiles.full_name,
          index: index + 1,
        }));
        setAppointments(mappedAppointments);
      }
    };

    fetchAppointments();
  }, []);

  const table = useReactTable({
    data: appointments,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const handleAction = (type: "approve" | "reject") => {
    setActionType(type);
    setIsDialogOpen(true);
  };

  const handleConfirmAction = async () => {
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    const newStatus = actionType === "approve" ? 2 : 3;

    const updatedAppointments = appointments.map((appointment) => {
      if (selectedRows.some((row) => row.original.id === appointment.id)) {
        return { ...appointment, status: newStatus, medical_note: medicalNote };
      }
      return appointment;
    });

    // Update appointments in Supabase
    for (const appointment of updatedAppointments) {
      if (selectedRows.some((row) => row.original.id === appointment.id)) {
        const { error } = await supabase
          .from("appointments")
          .update({ status: newStatus, medical_note: medicalNote })
          .eq("id", appointment.id);

        if (error) {
          console.error("Error updating appointment:", error);
          toast({
            title: "Error",
            description: `Failed to update appointment ${appointment.id}`,
            variant: "destructive",
          });
        }
      }
    }

    setAppointments(updatedAppointments);
    setRowSelection({});
    setIsDialogOpen(false);
    setMedicalNote("");

    toast({
      title: actionType === "approve" ? "Citas aprobadas" : "Citas rechazadas",
      description: `${selectedRows.length} cita(s) han sido ${
        actionType === "approve" ? "aprobadas" : "rechazadas"
      }.`,
      variant: actionType === "approve" ? "default" : "destructive",
    });
  };

  return (
    <div className="w-full">
      <CardHeader className="bg-[conic-gradient(at_bottom_left,_var(--tw-gradient-stops))] from-yellow-200 via-emerald-200 to-yellow-200  text-primary-foreground">
        <CardTitle className="text-2xl flex items-center gap-2">
          <Dog className="w-6 h-6" />
          Citas veterinarias
        </CardTitle>
        <CardDescription className="text-primary-foreground/80">
          Organiza y controla las consultas veterinarias.
        </CardDescription>
      </CardHeader>
      <div className="flex justify-end space-x-2 mt-4">
        <Button
          onClick={() => handleAction("approve")}
          disabled={table.getFilteredSelectedRowModel().rows.length === 0}
        >
          Aprobar cita
        </Button>
        <Button
          onClick={() => handleAction("reject")}
          disabled={table.getFilteredSelectedRowModel().rows.length === 0}
          variant="destructive"
        >
          Rechazar cita
        </Button>
      </div>
      <div className="flex items-center py-4">
        <Input
          placeholder="Filtrar por nombre..."
          value={
            (table.getColumn("ownerName")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("ownerName")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Ocultar <ChevronDownIcon className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Sin resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} de{" "}
          {table.getFilteredRowModel().rows.length} fila(s) seleccionadas.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Siguiente
          </Button>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === "approve" ? "Aprobar" : "Rechazar"} Cita(s)
            </DialogTitle>
            <DialogDescription>
              Añade una nota médica para{" "}
              {table.getFilteredSelectedRowModel().rows.length} cita(s)
              seleccionada(s).
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="medical-note" className="text-right">
                Nota Médica
              </Label>
              <Textarea
                id="medical-note"
                className="col-span-3"
                value={medicalNote}
                onChange={(e) => setMedicalNote(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleConfirmAction}>
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
