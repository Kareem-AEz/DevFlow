import React from "react";

import LeftSidebar from "@/components/layout/navigation/LeftSidebar";
import Navbar from "@/components/layout/navigation/navbar/navbar";
import RightSidebar from "@/components/layout/navigation/RightSidebar";

function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="background-light850_dark100 relative min-h-screen">
      <Navbar />

      <div className="flex">
        <LeftSidebar />

        <section className="w-full p-6 pt-36 max-md:pb-14 sm:px-14">
          <div className="mx-auto w-full max-w-6xl">{children}</div>
        </section>

        <RightSidebar />
      </div>
    </main>
  );
}

export default RootLayout;
