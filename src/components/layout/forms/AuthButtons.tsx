import React from "react";

import Link from "next/link";

import { LogIn, UserPlus } from "lucide-react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";

import { ROUTES } from "@/constants/routes";

function AuthButtons({ isMobileNav }: { isMobileNav?: boolean }) {
  return (
    <div className="flex flex-col gap-3">
      <Link href={ROUTES.SIGN_IN} className="button-primary">
        <Button className="small-medium btn-secondary text-dark400_light900 flex min-h-11 w-full items-center gap-2 rounded-lg px-4 py-3 shadow-none">
          <LogIn className="size-5" />
          <span
            className={cn(
              "primary-text-gradient",
              isMobileNav && "max-lg:hidden",
            )}
          >
            Sign In
          </span>
        </Button>
      </Link>

      <Link href={ROUTES.SIGN_UP} className="button-primary">
        <Button className="small-medium light-border-2 btn-tertiary text-dark400_light900 flex min-h-11 w-full items-center gap-2 rounded-lg border px-4 py-3 shadow-none">
          <UserPlus className="size-5" />
          <span
            className={cn(
              "primary-text-gradient",
              isMobileNav && "max-lg:hidden",
            )}
          >
            Sign Up
          </span>
        </Button>
      </Link>
    </div>
  );
}

export default AuthButtons;
