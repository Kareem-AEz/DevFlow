import React from "react";

import Link from "next/link";

import { LogIn, UserPlus } from "lucide-react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";

import { ROUTES } from "@/constants/routes";

function AuthButtons({ isMobileNav }: { isMobileNav?: boolean }) {
  return (
    <div className="flex flex-col justify-center gap-3 max-lg:items-center">
      <Link href={ROUTES.SIGN_IN} className="button-primary">
        <Button
          className={cn(
            "small-medium btn-secondary text-dark400_light900 flex min-h-11 w-full items-center gap-2 rounded-lg px-4 py-3 shadow-none",
            isMobileNav && "!px-6 !py-4",
          )}
        >
          <LogIn className="size-5" />
          <span
            className={cn(
              "primary-text-gradient sm:hidden lg:block",
              isMobileNav && "block",
            )}
          >
            Sign In
          </span>
        </Button>
      </Link>

      <Link href={ROUTES.SIGN_UP} className="button-primary">
        <Button
          className={cn(
            "small-medium light-border-2 btn-tertiary text-dark400_light900 flex min-h-11 w-full items-center gap-2 rounded-lg border px-4 py-3 shadow-none",
            isMobileNav && "!px-6 !py-4",
          )}
        >
          <UserPlus className="size-5" />
          <span
            className={cn(
              "primary-text-gradient sm:hidden lg:block",
              isMobileNav && "block",
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
