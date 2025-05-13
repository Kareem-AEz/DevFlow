import React from "react";

import { auth } from "@/lib/auth";

import SignOutButton from "@/components/ui/SignOutButton";

import SocialAuthForm from "../forms/SocialAuthForm";

import NavLinks from "./navbar/NavLinks";

async function LeftSidebar() {
  const session = await auth();
  console.log(session);

  return (
    <aside className="background-light900_dark200 no-scrollbar light-border sticky top-0 flex h-screen w-full max-w-72 flex-col justify-between overflow-y-auto p-6 px-5 pt-36 max-lg:max-w-24 max-lg:items-center max-sm:hidden">
      <div>
        <NavLinks />
      </div>

      {!session && <SocialAuthForm />}
      {session && <SignOutButton />}
    </aside>
  );
}

export default LeftSidebar;
