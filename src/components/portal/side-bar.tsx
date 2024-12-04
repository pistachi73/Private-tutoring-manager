"use client";

import { buttonVariants } from "@/components/ui/button";
import ThemeSwitch from "@/components/ui/theme-switch";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useCurrentUser } from "@/hooks/use-current-user";
import { cn } from "@/lib/utils";
import {
  Calendar02Icon,
  DashboardSquare01Icon,
  Folder02Icon,
  Invoice03Icon,
  UserGroupIcon,
} from "@hugeicons/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const sidebarLinks = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: DashboardSquare01Icon,
  },
  {
    label: "Calendar",
    href: "/calendar",
    icon: Calendar02Icon,
  },
  {
    label: "Hubs",
    href: "/hubs",
    icon: Folder02Icon,
  },
  {
    label: "Clients",
    href: "/clients",
    icon: UserGroupIcon,
  },
  {
    label: "Billing",
    href: "/billing",
    icon: Invoice03Icon,
  },
];

export const SideBar = () => {
  const pathname = usePathname();
  const user = useCurrentUser();

  return (
    <div className="flex flex-col justify-between items-center px-5 py-4 rounded-full">
      <Link href={"/"}>
        <Image src={"/Logo.svg"} alt="Logo" width={24} height={48} />
      </Link>

      <div className="flex flex-col gap-3 shrink-0 grow-0">
        {sidebarLinks.map(({ label, href, icon: Icon }) => {
          const isActive = pathname.includes(href);
          return (
            <Tooltip key={label}>
              <TooltipTrigger>
                <Link
                  href={href}
                  className={cn(
                    buttonVariants({
                      variant: "outline",
                      size: "default",
                      iconOnly: true,
                    }),
                    isActive &&
                      "bg-background-reverse text-responsive-light pointer-events-none",
                  )}
                >
                  <Icon
                    size={18}
                    strokeWidth={1.5}
                    variant={isActive ? "bulk" : "stroke"}
                    type="rounded"
                  />
                </Link>
              </TooltipTrigger>
              <TooltipContent
                sideOffset={8}
                side="right"
                align="center"
                className="w-fit"
              >
                <p className="text-sm">{label}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
      <ThemeSwitch />
    </div>
  );
};
