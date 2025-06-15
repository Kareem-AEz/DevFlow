"use server";

import bcrypt from "bcryptjs";
import mongoose from "mongoose";

import { signIn } from "../auth";
import { action } from "../handlers/action";
import handleError from "../handlers/error";
import { NotFoundError, UnauthorizedError } from "../http-errors";
import {
  SignInSchema,
  SignInWithCredentialsParamsType,
  SignUpSchema,
  SignUpWithCredentialsParamsType,
} from "../validations";

import Account from "@/database/account.model";
import User from "@/database/user.model";
import { ActionResponse, ErrorResponse } from "@/types/global";

export async function signUpWithCredentials(
  params: SignUpWithCredentialsParamsType,
): Promise<ActionResponse> {
  const validationResult = await action({
    params,
    schema: SignUpSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { name, username, email, password } = validationResult.params!;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const existingUser = await User.findOne({ email }).session(session);

    if (existingUser) {
      throw new Error("User already exists");
    }

    const existingUsername = await User.findOne({ username }).session(session);

    if (existingUsername) {
      throw new Error("Username already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const [newUser] = await User.create([{ username, name, email }], {
      session,
    });

    await Account.create(
      [
        {
          userId: newUser._id,
          name,
          provider: "credentials",
          providerAccountId: email,
          password: hashedPassword,
        },
      ],
      { session },
    );

    await session.commitTransaction();

    await signIn("credentials", { email, password, redirect: false });

    return { success: true };
  } catch (error) {
    await session.abortTransaction();

    return handleError(error) as ErrorResponse;
  } finally {
    await session.endSession();
  }
}

export async function signInWithCredentials(
  params: SignInWithCredentialsParamsType,
): Promise<ActionResponse> {
  const validationResult = await action({
    params,
    schema: SignInSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { email, password } = validationResult.params!;

  try {
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (!existingUser) throw new NotFoundError("User");

    // Check if account exists
    const existingAccount = await Account.findOne({
      providerAccountId: email,
      provider: "credentials",
    });
    if (!existingAccount) throw new NotFoundError("Account");

    // Check if password is correct
    const isValidPassword = await bcrypt.compare(
      password,
      existingAccount.password!,
    );
    if (!isValidPassword) throw new UnauthorizedError("Invalid credentials");

    await signIn("credentials", { email, password, redirect: false });

    return { success: true };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
