"use client";

import { MenuIcon } from "lucide-react";
import Link from "next/link";
import * as React from "react";
import { Dialog, DialogClose } from "./ui/dialog";
import { Button } from "./ui/button";
import { NavigationMenu, NavigationMenuList } from "./ui/navigation-menu";
import {
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { ModeToggle } from "./Toggle";
import LoginButton from "./LoginLogoutButton";

export function NavBar() {
  const handleScrollToSection = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    sectionId: string
  ) => {
    event.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="flex items-center min-w-full w-full fixed justify-center p-2 z-[50] mt-[2rem]">
      <div className="flex justify-between md:w-[720px] w-[95%] border dark:border-zinc-900 dark:bg-black bg-opacity-10 relative backdrop-filter backdrop-blur-lg bg-white border-white border-opacity-20 rounded-xl p-2 shadow-lg">
        <Dialog>
          <SheetTrigger className="min-[825px]:hidden p-2 transition">
            <MenuIcon />
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle>Pawpal.</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col space-y-3 mt-[1rem] z-[99]">
              <DialogClose asChild>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={(e) => handleScrollToSection(e, "history")}
                >
                  Historia
                </Button>
              </DialogClose>
              <DialogClose asChild>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={(e) => handleScrollToSection(e, "features")}
                >
                  Características
                </Button>
              </DialogClose>
              <DialogClose asChild>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={(e) => handleScrollToSection(e, "pricing")}
                >
                  Precios
                </Button>
              </DialogClose>
              <DialogClose asChild>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={(e) => handleScrollToSection(e, "contact")}
                >
                  Contacto
                </Button>
              </DialogClose>
              <div className="absolute bottom-4 right-4 m-4">
                <ModeToggle />
              </div>
            </div>
          </SheetContent>
        </Dialog>
        <NavigationMenu>
          <NavigationMenuList className="max-[825px]:hidden">
            <Link href="/" className="pl-2">
              <h1 className="font-bold">Pawpal.</h1>
            </Link>
          </NavigationMenuList>
        </NavigationMenu>
        <div className="flex items-center gap-2 max-[825px]:hidden">
          <Button
            variant="ghost"
            onClick={(e) => handleScrollToSection(e, "history")}
          >
            Historia
          </Button>

          <Button
            variant="ghost"
            onClick={(e) => handleScrollToSection(e, "features")}
          >
            Características
          </Button>
          <Button
            variant="ghost"
            onClick={(e) => handleScrollToSection(e, "pricing")}
          >
            Precios
          </Button>
          <Button
            variant="ghost"
            onClick={(e) => handleScrollToSection(e, "contact")}
          >
            Contacto
          </Button>
          <ModeToggle />
        </div>
      </div>
      <div className="absolute right-4 top-4">
        <LoginButton />
      </div>
    </div>
  );
}
