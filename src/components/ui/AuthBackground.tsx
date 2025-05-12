"use client";

import { useEffect, useState } from "react";

import Image from "next/image";
import { useTheme } from "next-themes";

interface AuthBackgroundProps {
  children: React.ReactNode;
}

const AuthBackground = ({ children }: AuthBackgroundProps) => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 py-10">
        {children}
      </div>
    );
  }

  const bgImage =
    resolvedTheme === "dark"
      ? "/images/auth-dark.png"
      : "/images/auth-light.png";

  return (
    <main className="relative flex min-h-screen items-center justify-center px-4 py-10">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <Image
          src={bgImage}
          alt="Auth background"
          fill
          priority
          sizes="100vw"
          quality={100}
          className="object-cover object-center"
        />
      </div>
      <section className="light-border background-light800_dark200 shadow-light100_dark100 relative z-10 min-w-full rounded-2xl border px-4 py-10 shadow-md sm:min-w-xl sm:px-8">
        {children}
      </section>
    </main>
  );
};

export default AuthBackground;
