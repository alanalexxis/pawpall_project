"use client";

import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import PetFormBtn from "./pet-form-btn";

type PetFormProps = {
  actionType: "add" | "edit";
};

export default function PetForm({ actionType }: PetFormProps) {
  return (
    <form className="flex flex-col space-y-3">
      <div className="space-y-1">
        <Label htmlFor="name">Name</Label>
        <Input id="name" />
      </div>

      <div className="space-y-1">
        <Label htmlFor="ownerName">Owner Name</Label>
        <Input id="ownerName" />
      </div>

      <div className="space-y-1">
        <Label htmlFor="imageUrl">Image Url</Label>
        <Input id="imageUrl" />
      </div>

      <div className="space-y-1">
        <Label htmlFor="age">Age</Label>
        <Input id="age" />
      </div>

      <div className="space-y-1">
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" />
      </div>

      <PetFormBtn actionType={actionType} />
    </form>
  );
}
