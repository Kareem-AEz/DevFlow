"use client";

import React from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { motion } from "motion/react";

import SocialAuthForm from "@/components/layout/forms/SocialAuthForm";

import { ROUTES } from "@/constants/routes";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="background-light900_dark200 flex min-h-screen flex-col items-center justify-center">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ type: "spring", bounce: 0.14, duration: 0.8 }}
        className="bg-light-850 dark:bg-dark-300 m-8 flex w-full max-w-md flex-col rounded-lg p-8 shadow-md"
      >
        <div className="flex items-center justify-between gap-2">
          <div className="space-y-2.5">
            <Link href={ROUTES.HOME}>
              <h1 className="h2-bold text-dark100_light900 inline-block">
                Join DevFlow
              </h1>
            </Link>
            <p className="paragraph-regular text-dark500_light400">
              To get your question answered
            </p>
          </div>

          <Link href={ROUTES.HOME} className="flex items-center gap-1">
            {/*  eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={"/images/site-logo.svg"}
              className="size-16 object-contain"
              alt="DevFlow Logo"
            />
          </Link>
        </div>

        {children}

        <div>
          <SocialAuthForm />
        </div>
      </motion.div>
    </div>
  );
}
