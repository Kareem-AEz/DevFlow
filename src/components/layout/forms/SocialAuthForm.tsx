"use client";

import React from "react";

import { signIn } from "next-auth/react";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import { ROUTES } from "@/constants/routes";

const buttonClassName =
  "background-dark400_light900 body-medium text-dark200_light800 rounded-2 min-h-12 flex-1 px-4 py-3.5 flex items-center justify-center gap-3.5";

function SocialAuthForm() {
  /*
   * This function handles the sign-in process for the specified provider (GitHub or Google).
   * It uses the `signIn` function from `next-auth/react` to initiate the sign-in process.
   * The `callbackUrl` is set to the home page, and `redirect` is set to false,
   * which means the user will not be redirected immediately after signing in.
   */
  const handleSignIn = async (provider: "github" | "google") => {
    try {
      await signIn(provider, {
        redirectTo: ROUTES.HOME,
      });
      // Success toast removed - will be handled by the callback or session change
    } catch (error) {
      console.error(error);

      toast.error("Failed to sign in", {
        description:
          error instanceof Error
            ? error.message
            : "An error occurred while signing in",
      });
    }
  };

  return (
    <div className="mt-10 flex flex-wrap gap-2.5 max-lg:flex-col">
      <Button
        className={buttonClassName}
        onClick={() => handleSignIn("github")}
      >
        {/*  eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="invert-colors size-5 object-contain"
          src="/icons/github.svg"
          alt="Github Logo"
        />
        <span className="max-lg:hidden">Sign in with Github</span>
      </Button>

      <Button
        className={buttonClassName}
        onClick={() => handleSignIn("google")}
      >
        {/*  eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="size-5 object-contain"
          src="/icons/google.svg"
          alt="Github Logo"
        />
        <span className="max-lg:hidden">Sign in with Google</span>
      </Button>
    </div>
  );
}

export default SocialAuthForm;
