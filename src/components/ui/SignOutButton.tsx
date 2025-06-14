"use client";

import React, { useState } from "react";

import { signOut } from "next-auth/react";

import { Loader2, LucideDoorOpen } from "lucide-react";
import { toast } from "sonner";

import { Button } from "./button";

import { ROUTES } from "@/constants/routes";

function SignOutButton() {
  const [loading, setLoading] = useState(false);
  //   const { ref } = useScramble({
  //     text: loading ? "Signing Out..." : "Sign Out",
  //     overflow: true,
  //     speed: 0.8,
  //   });

  const handleSignOut = async () => {
    try {
      setLoading(true);
      await signOut({
        redirectTo: `${ROUTES.HOME}?signout=true`, // Use NextAuth's redirect instead of manual redirect
      });
      // Don't clear loading state here - let it persist until redirect
    } catch (error) {
      console.error("Sign out error:", error);

      // Only clear loading state on error
      setLoading(false);

      toast.error("Failed to sign out", {
        description: "Please try again",
      });
    }
  };

  return (
    <Button
      onClick={handleSignOut}
      disabled={loading}
      className="background-dark400_light900 body-medium text-dark200_light800 rounded-2 min-h-12 px-4 py-3.5"
    >
      {loading ? <Loader2 className="animate-spin" /> : <LucideDoorOpen />}
      <span className="max-lg:hidden">
        {loading ? "Signing Out..." : "Sign Out"}
      </span>
    </Button>
  );
}

export default SignOutButton;
