import { Separator } from "@/components/ui/separator";
import { AccountForm } from "./account-form";

export default function SettingsProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Perfil</h3>
        <p className="text-sm text-muted-foreground">
          Así es como los demás te verán en pawpal.
        </p>
      </div>
      <Separator />
      <AccountForm />
    </div>
  );
}
