import { Separator } from "@/components/ui/separator";
import { DisplayForm } from "@/app/(demo)/profile/display/display-form";

export default function SettingsDisplayPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Visualización</h3>
        <p className="text-sm text-muted-foreground">
          Activa o desactiva los elementos para controlar lo que se muestra en
          la aplicación.
        </p>
      </div>
      <Separator />
      <DisplayForm />
    </div>
  );
}
