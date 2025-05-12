"use client";

import React from "react";

import { signIn, useSession } from "next-auth/react";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import ROUTES from "@/constants/routes";

const buttonClassName =
  "background-dark400_light900 body-medium text-dark200_light800 rounded-2 min-h-12 flex-1 px-4 py-3.5";

function SocialAuthForm() {
  const { data: session } = useSession();
  console.log(session);
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
    <div className="mt-10 flex flex-wrap gap-2.5">
      <Button
        className={buttonClassName}
        onClick={() => handleSignIn("github")}
      >
        {/*  eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="invert-colors mr-2.5 object-contain"
          src="/icons/github.svg"
          alt="Github Logo"
        />
        <span>Sign in with Github</span>
      </Button>

      <Button
        className={buttonClassName}
        onClick={() => handleSignIn("google")}
      >
        {/*  eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="mr-2.5 object-contain"
          src="/icons/google.svg"
          alt="Github Logo"
        />
        <span>Sign in with Google</span>
      </Button>
    </div>
  );
}

export default SocialAuthForm;
