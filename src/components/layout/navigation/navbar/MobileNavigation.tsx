import React from "react";

import Link from "next/link";

import { auth } from "@/lib/auth";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import SignOutButton from "@/components/ui/SignOutButton";

import AuthButtons from "../../forms/AuthButtons";

import NavLinks from "./NavLinks";

async function MobileNavigation() {
  const session = await auth();
  const userId = session?.user?.id;

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

        <div className="mx-3 flex h-[calc(100vh-80px)] flex-col justify-between gap-6 overflow-y-auto pt-16">
          <SheetClose asChild>
            <section className="flex h-full flex-col">
              <NavLinks isMobileNav userId={userId} />
            </section>
          </SheetClose>

          <div className="mb-8 flex flex-col gap-3">
            <SheetClose asChild>
              {!session ? <AuthButtons isMobileNav /> : <SignOutButton />}
            </SheetClose>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default MobileNavigation;
