"use client";

import { Suspense, useEffect } from "react";

import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";

import { toast } from "sonner";

function AuthSuccessToastInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    // Check for sign-in success
    const isRegisterSuccess = searchParams.get("register") === "true";
    // Check for sign-out success
    const isSignoutSuccess = searchParams.get("signout") === "true";

    // Handle sign-in success toast
    if (isRegisterSuccess && status === "authenticated" && session?.user) {
      toast.success("Welcome to DevFlow!", {
        description: `Successfully signed in as ${session.user.name || session.user.email}`,
        duration: 5000, // Show for 5 seconds
      });

      // Clean up the URL by removing the register parameter
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.delete("register");

      const newUrl = newSearchParams.toString()
        ? `${window.location.pathname}?${newSearchParams.toString()}`
        : window.location.pathname;

      router.replace(newUrl);
    }

    // Handle sign-out success toast
    if (isSignoutSuccess && status === "unauthenticated") {
      toast.success("Signed out successfully!", {
        description: "You have been logged out of your account",
        duration: 3000,
      });

      // Clean up the URL by removing the signout parameter
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.delete("signout");

      const newUrl = newSearchParams.toString()
        ? `${window.location.pathname}?${newSearchParams.toString()}`
        : window.location.pathname;

      router.replace(newUrl);
    }
  }, [searchParams, session, status, router]);

  return null; // This component doesn't render anything visual
}

export default function AuthSuccessToast() {
  return (
    <Suspense fallback={null}>
      <AuthSuccessToastInner />
    </Suspense>
  );
}
