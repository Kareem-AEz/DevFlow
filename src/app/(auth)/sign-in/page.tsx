"use client";

import React from "react";

import Link from "next/link";

import { SignInSchema } from "@/lib/validations";

import AuthForm from "@/components/layout/forms/AuthForm";

export const SIGN_IN_FIELDS = {
  TYPE: "signin",
  FIELDS: ["email", "password"],
};

function SignIn() {
  return (
    <>
      <AuthForm
        schema={SignInSchema}
        fields={[
          {
            name: "email",
            label: "Email Address",
            type: "text",
            defaultValue: "",
          },
          {
            name: "password",
            label: "Password",
            type: "password",
            defaultValue: "",
          },
        ]}
        buttonText={{ default: "Sign In", loading: "Signing In..." }}
        onSubmit={(data) => Promise.resolve({ success: true, data })}
      />

      <p className="mt-4">
        Don&apos;t have an account?{" "}
        <Link
          href="/sign-up"
          className="paragraph-semibold primary-text-gradient"
        >
          Sign Up
        </Link>
      </p>
    </>
  );
}

export default SignIn;
