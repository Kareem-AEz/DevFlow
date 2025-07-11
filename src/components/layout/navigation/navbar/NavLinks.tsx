"use client";
import React from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { motion } from "motion/react";

import { cn } from "@/lib/utils";

import { SheetClose } from "@/components/ui/sheet";

import { sidebarLinks } from "@/constants/sideBarLinks";

function NavLinks({
  isMobileNav = false,
  userId,
}: {
  isMobileNav?: boolean;
  userId?: string;
}) {
  const pathName = usePathname();

  return (
    <>
      {sidebarLinks.map((link) => {
        const isActive =
          pathName === link.PATH ||
          (pathName.includes(link.PATH) && link.PATH.length > 1);

        // 🎯 Compute href dynamically instead of mutating link.PATH
        const href =
          link.PATH === "/profile" && userId
            ? `${link.PATH}/${userId}`
            : link.PATH;

        const LinkComponent = (
          <Link className="group relative" key={link.PATH} href={href}>
            <div
              className={cn(
                isActive ? "text-light-900" : "text-dark300_light900",
                "text-dark300_light900 relative z-10 flex items-center justify-start gap-4 rounded-lg bg-transparent p-4",
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={link.ImgURL}
                alt={`${link.LABEL} icon`}
                width={20}
                height={20}
                className={cn("invert-colors", "size-5")}
              />
              <p className={cn(!isMobileNav && "max-lg:hidden", "base-medium")}>
                {link.LABEL}
              </p>
            </div>

            {isActive && (
              <motion.div
                layoutId={isMobileNav ? "activeMobileLink" : "activeLink"}
                transition={{ type: "spring", bounce: 0.12, duration: 0.8 }}
                className="primary-gradient absolute inset-0 h-full w-full rounded-lg"
              />
            )}
            <div className="background-light800_dark400 absolute inset-0 h-full w-full rounded-lg opacity-0 transition-opacity duration-300" />
          </Link>
        );

        return isMobileNav ? (
          <SheetClose key={link.PATH} asChild>
            {LinkComponent}
          </SheetClose>
        ) : (
          LinkComponent
        );
      })}
    </>
  );
}

export default NavLinks;
