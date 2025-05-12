import React from "react";

import SocialAuthForm from "@/components/layout/forms/SocialAuthForm";
import AuthBackground from "@/components/ui/AuthBackground";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthBackground>
      <div className="flex items-center justify-between gap-2">
        <div className="space-y-2.5">
          <h1 className="h2-bold text-dark100_light900">Join DevFlow</h1>
          <p className="paragraph-regular text-dark500_light400">
            To get your question answered
          </p>
        </div>

        {/*  eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={"/images/site-logo.svg"}
          className="size-16 object-contain"
          alt="DevFlow Logo"
        />
      </div>
      {children}

      <SocialAuthForm />
    </AuthBackground>
  );
}
