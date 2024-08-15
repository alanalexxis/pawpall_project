import { Separator } from "@/components/ui/separator";
import { AccountForm } from "@/app/(demo)/profile/account/account-form";

export default function SettingsAccountPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Cuenta</h3>
        <p className="text-sm text-muted-foreground">
          Actualiza la configuración de tu cuenta. Establece tu idioma y zona
          horaria preferidos.
        </p>
      </div>
      <Separator />
      <AccountForm />
    </div>
  );
}
