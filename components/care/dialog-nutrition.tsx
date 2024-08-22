import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export const DialogNutrition = () => {
  const [foodAmount, setFoodAmount] = useState(0);
  const [foodType, setFoodType] = useState("");
  const [feedingTime, setFeedingTime] = useState("");

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Añadir comida</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Registrar comida</DialogTitle>
            <DialogDescription>
              Registra la cantidad, tipo de comida y momento del día en que se
              la diste a tu perro.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="foodAmount">Cantidad de comida (g)</Label>
              <Input
                type="number"
                id="foodAmount"
                value={foodAmount}
                onChange={(e) => setFoodAmount(parseInt(e.target.value))}
              />
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="foodType">Tipo de comida</Label>
              <Select value={foodType} onValueChange={setFoodType}>
                <SelectTrigger id="foodType">
                  <SelectValue placeholder="Selecciona un tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Tipo de alimentación</SelectLabel>
                    <SelectItem value="Seca">Seca</SelectItem>
                    <SelectItem value="Húmeda">Húmeda</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="feedingTime">Momento del día</Label>
              <Select value={feedingTime} onValueChange={setFeedingTime}>
                <SelectTrigger id="feedingTime">
                  <SelectValue placeholder="Selecciona un momento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Momento del día</SelectLabel>
                    <SelectItem value="Desayuno">Desayuno</SelectItem>
                    <SelectItem value="Merienda">Merienda</SelectItem>
                    <SelectItem value="Cena">Cena</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Guardar comida</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
