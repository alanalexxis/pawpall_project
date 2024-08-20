import {
  Tag,
  Users,
  Settings,
  Bookmark,
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
          ],
        },
      ],
    },
    {
      groupLabel: "Contenido",
      menus: [
        {
          href: "",
          label: "Posts",
          active: pathname.includes("/guides"),
          icon: SquarePen,
          submenus: [
            {
              href: "/posts",
              label: "All Posts",
              active: pathname === "/posts",
            },
            {
              href: "/posts/new",
              label: "New Post",
              active: pathname === "/posts/new",
            },
          ],
        },
        {
          href: "/guides",
          label: "Guías",
          active: pathname.includes("/guides"),
          icon: Bookmark,
          submenus: [],
        },
        {
          href: "/tags",
          label: "Tags",
          active: pathname.includes("/tags"),
          icon: Tag,
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
