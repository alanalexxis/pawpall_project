import { Metadata } from "next";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { SidebarNav } from "@/app/(demo)/profile/components/sidebar-nav";

import Link from "next/link";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Forms",
  description: "Advanced form example using react-hook-form and Zod.",
};

const sidebarNavItems = [
  {
    title: "Profile",
    href: "/profile",
  },
  {
    title: "Account",
    href: "/profile/account",
  },
  {
    title: "Appearance",
    href: "/profile/appearance",
  },
  {
    title: "Notifications",
    href: "/profile/notifications",
  },
  {
    title: "Display",
    href: "/profile/display",
  },
];

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <>
      <ContentLayout title="Account">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/dashboard">Dashboard</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Account</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <Card className="rounded-lg border-none mt-6">
          <CardContent className="p-6">
            <div className="relative min-h-[calc(100vh-56px-64px-20px-24px-56px-48px)]">
              <div className="absolute top-0 left-0 p-4"></div>
              <div className="md:hidden">
                <Image
                  src="/examples/forms-light.png"
                  width={1280}
                  height={791}
                  alt="Forms"
                  className="block dark:hidden"
                />
                <Image
                  src="/examples/forms-dark.png"
                  width={1280}
                  height={791}
                  alt="Forms"
                  className="hidden dark:block"
                />
              </div>
              <div className="hidden space-y-6 p-10 pb-16 md:block">
                <div className="space-y-0.5">
                  <h2 className="text-2xl font-bold tracking-tight">
                    Settings
                  </h2>
                  <p className="text-muted-foreground">
                    Manage your account settings and set e-mail preferences.
                  </p>
                </div>
                <Separator className="my-6" />
                <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
                  <aside className="-mx-4 lg:w-1/5">
                    <SidebarNav items={sidebarNavItems} />
                  </aside>
                  <div className="flex-1 lg:max-w-2xl">{children}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </ContentLayout>
    </>
  );
}
