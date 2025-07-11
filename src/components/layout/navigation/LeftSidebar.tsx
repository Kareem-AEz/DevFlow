import React from "react";

import { auth } from "@/lib/auth";

import SignOutButton from "@/components/ui/SignOutButton";

import AuthButtons from "../forms/AuthButtons";

import NavLinks from "./navbar/NavLinks";

async function LeftSidebar() {
  const session = await auth();
  const userId = session?.user?.id;

  return (
    <aside className="background-light900_dark200 no-scrollbar light-border sticky top-0 flex h-screen w-full max-w-72 flex-col justify-between overflow-y-auto p-6 px-5 pt-36 max-lg:max-w-24 max-lg:items-center max-sm:hidden">
      <div>
        <NavLinks userId={userId} />
      </div>

      {!session && <AuthButtons />}
      {session && <SignOutButton />}
    </aside>
  );
}

export default LeftSidebar;
