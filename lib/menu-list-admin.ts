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
              label: "Citas veterinarias",
              active: pathname === "/dashboard",
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
