"use client";

import React from "react";

import Link from "next/link";

import { SignUpSchema } from "@/lib/validations";

import AuthForm from "@/components/layout/forms/AuthForm";

export const SIGN_UP_FIELDS = {
  TYPE: "signup",
  FIELDS: ["username", "name", "email", "password"],
};

function SignUp() {
  return (
    <>
      <AuthForm
        schema={SignUpSchema}
        fields={[
          {
            name: "username",
            label: "Username",
            type: "text",
            defaultValue: "",
          },
          {
            name: "name",
            label: "Name",
            type: "text",
            defaultValue: "",
          },
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
        buttonText={{ default: "Sign Up", loading: "Signing Up..." }}
        onSubmit={(data) => Promise.resolve({ success: true, data })}
      />

      <p className="mt-4">
        Already have an account?{" "}
        <Link
          href="/sign-in"
          className="paragraph-semibold primary-text-gradient"
        >
          Sign In
        </Link>
      </p>
    </>
  );
}

export default SignUp;
