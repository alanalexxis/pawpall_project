"use client";

import Link from "next/link";
import { Ellipsis, LogOut, Crown, Star } from "lucide-react";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { getMenuList } from "@/lib/menu-list";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CollapseMenuButton } from "@/components/admin-panel/collapse-menu-button";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { useUser } from "@/contexts/userContext";

interface MenuProps {
  isOpen: boolean | undefined;
}

export function Menu({ isOpen }: MenuProps) {
  const pathname = usePathname();
  const menuList = getMenuList(pathname);
  const { user, setUser } = useUser();
  const isPremium = user?.premium === "yes"; // Actualiza isPremium

  const handleFreePlanClick = async () => {
    if (!isPremium && user) {
      // Check if user exists and is not premium
      try {
        const res = await fetch("https://www.pawpal.site/api/checkout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user.id, // Sending user.id
          }),
        });

        if (!res.ok) {
          throw new Error(`Error: ${res.status}`);
        }

        const session = await res.json();
        if (session?.url) {
          window.location.href = session.url; // Redirect to Stripe Checkout
        }
      } catch (error) {
        console.error("Error during checkout:", error);
        // Optionally display an error message to the user
      }
    }
  };
  return (
    <ScrollArea className="[&>div>div[style]]:!block">
      <nav className="mt-7 h-full w-full">
        <ul className="flex flex-col min-h-[calc(100vh-48px-36px-16px-32px)] lg:min-h-[calc(100vh-32px-40px-32px)] items-start space-y-1 px-2">
          {menuList.map(({ groupLabel, menus }, index) => (
            <li className={cn("w-full", groupLabel ? "pt-5" : "")} key={index}>
              {(isOpen && groupLabel) || isOpen === undefined ? (
                <p className="text-sm font-medium text-muted-foreground px-4 pb-2 max-w-[248px] truncate">
                  {groupLabel}
                </p>
              ) : !isOpen && isOpen !== undefined && groupLabel ? (
                <TooltipProvider>
                  <Tooltip delayDuration={100}>
                    <TooltipTrigger className="w-full">
                      <div className="w-full flex justify-center items-center">
                        <Ellipsis className="h-5 w-5" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p>{groupLabel}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <p className="pb-2"></p>
              )}
              {menus.map(
                ({ href, label, icon: Icon, active, submenus }, index) =>
                  submenus.length === 0 ? (
                    <div className="w-full" key={index}>
                      <TooltipProvider disableHoverableContent>
                        <Tooltip delayDuration={100}>
                          <TooltipTrigger asChild>
                            <Button
                              variant={active ? "secondary" : "ghost"}
                              className="w-full justify-start h-10 mb-1"
                              asChild
                            >
                              <Link href={href}>
                                <span
                                  className={cn(isOpen === false ? "" : "mr-4")}
                                >
                                  <Icon size={18} />
                                </span>
                                <p
                                  className={cn(
                                    "max-w-[200px] truncate",
                                    isOpen === false
                                      ? "-translate-x-96 opacity-0"
                                      : "translate-x-0 opacity-100"
                                  )}
                                >
                                  {label}
                                </p>
                              </Link>
                            </Button>
                          </TooltipTrigger>
                          {isOpen === false && (
                            <TooltipContent side="right">
                              {label}
                            </TooltipContent>
                          )}
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  ) : (
                    <div className="w-full" key={index}>
                      <CollapseMenuButton
                        icon={Icon}
                        label={label}
                        active={active}
                        submenus={submenus}
                        isOpen={isOpen}
                      />
                    </div>
                  )
              )}
            </li>
          ))}
          <li className="w-full grow flex flex-col items-end justify-end space-y-2">
            <TooltipProvider disableHoverableContent>
              <Tooltip delayDuration={100}>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => {}}
                    variant="outline"
                    className="w-full justify-center h-10"
                  >
                    <span className={cn(isOpen === false ? "" : "mr-4")}>
                      <LogOut size={18} />
                    </span>
                    <p
                      className={cn(
                        "whitespace-nowrap",
                        isOpen === false ? "opacity-0 hidden" : "opacity-100"
                      )}
                    >
                      Cerrar sesión
                    </p>
                  </Button>
                </TooltipTrigger>
                {isOpen === false && (
                  <TooltipContent side="right">Cerrar sesión</TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider disableHoverableContent>
              <Tooltip delayDuration={100}>
                <TooltipTrigger asChild>
                  <div
                    className={cn(
                      "w-full h-8 rounded-full flex items-center justify-center cursor-default transition-all duration-300 ease-in-out",
                      isPremium
                        ? "bg-gradient-to-r from-yellow-200 to-yellow-500 text-black relative overflow-hidden"
                        : "bg-gradient-to-r from-gray-200 via-gray-300 to-gray-400 text-gray-800",
                      isOpen === false ? "px-2" : "px-4"
                    )}
                    onClick={handleFreePlanClick}
                  >
                    {isPremium && (
                      <div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer"
                        style={{ backgroundSize: "200% 100%" }}
                      />
                    )}
                    {isPremium ? (
                      <Crown
                        size={18}
                        className={cn(
                          "animate-pulse relative z-10",
                          isOpen === false ? "" : "mr-2"
                        )}
                      />
                    ) : (
                      <Star
                        size={18}
                        className={cn(isOpen === false ? "" : "mr-2")}
                      />
                    )}
                    <span
                      className={cn(
                        "font-semibold whitespace-nowrap relative z-10",
                        isOpen === false ? "sr-only" : ""
                      )}
                    >
                      {isPremium ? "Plan premium" : "Plan gratuito"}
                    </span>
                  </div>
                </TooltipTrigger>
                {isOpen === false && (
                  <TooltipContent side="right">
                    {isPremium ? "Plan premium" : "Plan gratuito"}
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          </li>
        </ul>
      </nav>
    </ScrollArea>
  );
}
