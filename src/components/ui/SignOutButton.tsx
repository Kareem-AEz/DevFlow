"use client";

import React from "react";

import { signOut } from "next-auth/react";

import { LucideDoorOpen } from "lucide-react";

import { Button } from "./button";

function SignOutButton() {
  return (
    <Button
      onClick={() => {
        signOut();
      }}
      className="background-dark400_light900 body-medium text-dark200_light800 rounded-2 min-h-12 px-4 py-3.5"
    >
      <LucideDoorOpen />
      <span className="max-lg:hidden">Sign Out</span>
    </Button>
  );
}

export default SignOutButton;
