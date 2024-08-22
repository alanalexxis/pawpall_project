import {
  Tag,
  Users,
  Settings,
  Dog,
  SquarePen,
  LayoutGrid,
  LucideIcon,
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
          ],
        },
      ],
    },
    {
      groupLabel: "Contenido",
      menus: [
        {
          href: "/guides",
          label: "Guías",
          active: pathname.includes("/guides"),
          icon: SquarePen,
          submenus: [],
        },
        {
          href: "/breeds",
          label: "Razas",
          active: pathname.includes("/breeds"),
          icon: Dog,
          submenus: [],
        },
      ],
    },
    {
      groupLabel: "Settings",
      menus: [
        {
          href: "/users",
          label: "Users",
          active: pathname.includes("/users"),
          icon: Users,
          submenus: [],
        },
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
