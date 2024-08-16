// PetButton Component for Design Only

import { PlusIcon } from "@radix-ui/react-icons";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogTitle,
} from "../ui/dialog";

type PetButtonProps = {
  children?: React.ReactNode;
  actionType: "add" | "edit" | "checkout";
};

import PetForm from "./pet-form";
export default function PetButton({ actionType, children }: PetButtonProps) {
  return actionType === "checkout" ? (
    <Button variant="secondary">{children}</Button>
  ) : (
    <Dialog>
      <DialogTrigger asChild>
        {actionType === "add" ? (
          <Button size="icon">
            <PlusIcon className="h-6 w-6" />
          </Button>
        ) : (
          <Button variant="secondary">{children}</Button>
        )}
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {actionType === "add" ? "Add a new pet" : "Edit pet"}
          </DialogTitle>
        </DialogHeader>
        <PetForm actionType={actionType} />
      </DialogContent>
    </Dialog>
  );
}
