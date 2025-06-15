"use client";

import React from "react";

import Link from "next/link";

import { signUpWithCredentials } from "@/lib/actions/auth.action";
import { SignUpSchema } from "@/lib/validations";

import AuthForm from "@/components/layout/forms/AuthForm";

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
        formType={"SIGN_UP"}
        buttonText={{ default: "Sign Up", loading: "Signing Up..." }}
        onSubmit={signUpWithCredentials}
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
