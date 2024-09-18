import {
  Tag,
  Users,
  Settings,
  Dog,
  SquarePen,
  LayoutGrid,
  LucideIcon,
  BookA,
} from "lucide-react";

type Submenu = {
  href: string;
  label: string;
  active: boolean;
};

type Menu = {
  href: string;
  label: string;
  active: boolean;
  icon: LucideIcon;
  submenus: Submenu[];
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

export function getMenuList(pathname: string): Group[] {
  return [
    {
      groupLabel: "",
      menus: [
        {
          href: "/dashboard",
          label: "Dashboard",
          active: pathname.includes("/dashboard"),
          icon: LayoutGrid,
          submenus: [
            {
              href: "/dashboard",
              label: "Monitoreo de salud",
              active: pathname === "/dashboard",
            },
            {
              href: "/dashboard/nutrition",
              label: "Nutrición",
              active: pathname === "/dashboard/nutrition",
            },
            {
              href: "/dashboard/grooming",
              label: "Estética",
              active: pathname === "/dashboard/grooming",
            },
            {
              href: "/dashboard/sleep",
              label: "Sueño",
              active: pathname === "/dashboard/sleep",
            },
            {
              href: "/dashboard/emotions",
              label: "Emociones",
              active: pathname === "/dashboard/emotions",
            },
            {
              href: "/dashboard/walk",
              label: "Paseos",
              active: pathname === "/dashboard/walk",
            },
            {
              href: "/dashboard/medical",
              label: "Historial médico",
              active: pathname === "/dashboard/medical",
            },
          ],
        },
      ],
    },

    {
      groupLabel: "Ajustes",
      menus: [
        {
          href: "/profile",
          label: "Perfil",
          active: pathname.includes("/profile"),
          icon: Settings,
          submenus: [],
        },
      ],
    },
  ];
}
