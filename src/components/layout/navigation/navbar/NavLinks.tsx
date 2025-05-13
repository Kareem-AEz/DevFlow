"use client";
import React from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

import { SheetClose } from "@/components/ui/sheet";

import { sidebarLinks } from "@/constants/sideBarLinks";

function NavLinks({ isMobileNav = false }: { isMobileNav?: boolean }) {
  const pathName = usePathname();
  const userId = "1";

  return (
    <>
      {sidebarLinks.map((link) => {
        const isActive =
          pathName === link.PATH ||
          (pathName.includes(link.PATH) && link.PATH.length > 1);

        if (link.PATH === "/profile" && userId) {
          link.PATH = `${link.PATH}/${userId}`;
        }

        const LinkComponent = (
          <Link
            href={link.PATH}
            key={link.PATH}
            className={cn(
              isActive
                ? "primary-gradient text-light-900 rounded-lg"
                : "text-dark300_light900",
              "flex items-center justify-start gap-4 bg-transparent p-4 max-lg:justify-center",
            )}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={link.ImgURL}
              alt={`${link.LABEL} icon`}
              className={cn({ "invert-colors": !isActive })}
            />
            <p
              className={cn(
                isActive ? "base-bold" : "base-medium",
                !isMobileNav && "max-lg:hidden",
              )}
            >
              {link.LABEL}
            </p>
          </Link>
        );

        return isMobileNav ? (
          <SheetClose asChild>{LinkComponent}</SheetClose>
        ) : (
          LinkComponent
        );
      })}
    </>
  );
}

export default NavLinks;
