import React from "react";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import NavLinks from "./NavLinks";

import { ROUTES } from "@/constants/routes";

function MobileNavigation() {
  return (
    <Sheet>
      <SheetTrigger aria-label="Open menu">
        <span className="hidden">Menu</span>
        {/*  eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={"/icons/hamburger.svg"}
          alt="Menu"
          className="invert-colors size-9 sm:hidden"
        />
      </SheetTrigger>
      <SheetContent
        side="left"
        className="background-light900_dark200 border-none"
      >
        <SheetHeader>
          <SheetTitle className="hidden">Navigation</SheetTitle>
          <Link href={"/"} className="flex items-center gap-1">
            {/*  eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="size-6"
              src="/images/site-logo.svg"
              alt="DevFlow Logo"
            />
            <p className="h2-bold font-space-grotesk text-dark-100 dark:text-light-900">
              Dev<span className="text-primary-500">Flow</span>
            </p>
          </Link>
          <SheetDescription className="hidden">
            Mobile Navigation
          </SheetDescription>
        </SheetHeader>

        <div className="mx-8 mb-8 flex h-[calc(100vh-80px)] flex-col justify-between gap-6 overflow-y-auto pt-16">
          <SheetClose asChild>
            <section className="flex h-full flex-col">
              <NavLinks isMobileNav />
            </section>
          </SheetClose>

          <div className="flex flex-col gap-3">
            <SheetClose asChild>
              <Link href={ROUTES.SIGN_IN} className="button-primary">
                <Button className="small-medium btn-secondary min-h-11 w-full rounded-lg px-4 py-3 shadow-none">
                  <span className="primary-text-gradient">Sign In</span>
                </Button>
              </Link>
            </SheetClose>

            <SheetClose asChild>
              <Link href={ROUTES.SIGN_UP} className="button-primary">
                <Button className="small-medium light-border-2 btn-tertiary text-dark400_light900 min-h-11 w-full rounded-lg border px-4 py-3 shadow-none">
                  <span className="primary-text-gradient">Sign Up</span>
                </Button>
              </Link>
            </SheetClose>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default MobileNavigation;
