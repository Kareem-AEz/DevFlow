import React from "react";

import Link from "next/link";

import { auth } from "@/lib/auth";

import UserAvatar from "@/components/ui/UserAvatar";

import MobileNavigation from "./MobileNavigation";
import ModeToggle from "./mode-toggle";

async function Navbar() {
  const session = await auth();

  return (
    <nav className="flex-between background-light900_dark200 shadow-light-300 fixed z-50 w-full gap-5 p-6 sm:px-12 dark:shadow-2xl">
      <Link className="flex items-center gap-2" href="/">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="size-6"
          src={"/images/site-logo.svg"}
          alt="DevFlow Logo"
        />
        <p className="h2-bold font-space-grotesk text-dark-100 dark:text-light-900 max-sm:hidden">
          Dev<span className="text-primary-500">Flow</span>
        </p>
      </Link>

      <p>Global Search</p>

      <div className="flex-between gap-5">
        <ModeToggle />
        {session && (
          <UserAvatar
            userId={session.user?.id ?? ""}
            name={session.user?.name ?? ""}
            image={session.user?.image ?? ""}
          />
        )}

        <MobileNavigation />
      </div>
    </nav>
  );
}

export default Navbar;
