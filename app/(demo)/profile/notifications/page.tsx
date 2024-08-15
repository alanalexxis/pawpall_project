import { Separator } from "@/components/ui/separator";
import { NotificationsForm } from "@/app/(demo)/profile/notifications/notifications-form";

export default function SettingsNotificationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Notificaciones</h3>
        <p className="text-sm text-muted-foreground">
          Configura cómo recibes las notificaciones.
        </p>
      </div>
      <Separator />
      <NotificationsForm />
    </div>
  );
}
