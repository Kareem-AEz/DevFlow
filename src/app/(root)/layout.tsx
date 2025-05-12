import React from "react";

import Navbar from "@/components/layout/navigation/navbar/navbar";

function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <main>
      <Navbar />
      {children}
    </main>
  );
}

export default RootLayout;
