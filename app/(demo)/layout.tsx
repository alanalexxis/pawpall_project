// components/admin-panel/demo-layout.tsx
import AdminPanelLayout from "@/components/admin-panel/admin-panel-layout";
import { UserProvider } from "@/contexts/userContext";

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserProvider>
      <AdminPanelLayout>{children}</AdminPanelLayout>
    </UserProvider>
  );
}
