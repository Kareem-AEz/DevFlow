"use server";

import { Session } from "next-auth";

import { ZodError, ZodSchema } from "zod";

import { auth } from "../auth";
import { UnauthorizedError, ValidationError } from "../http-errors";
import dbConnect from "../mongoose";

type ActionOptionsType<T> = {
  params?: T;
  schema?: ZodSchema<T>;
  authorize?: boolean;
};

export async function action<T>({
  params,
  schema,
  authorize = false,
}: ActionOptionsType<T>) {
  let validatedParams = params;

  if (params && schema) {
    try {
      validatedParams = schema.parse(params);
    } catch (error) {
      if (error instanceof ZodError) {
        return new ValidationError(
          error.flatten().fieldErrors as Record<string, string[]>,
        );
      } else {
        return new Error("Schema validation failed");
      }
    }
  }

  let session: Session | null = null;

  if (authorize) {
    session = await auth();

    if (!session) {
      return new UnauthorizedError();
    }
  }

  await dbConnect();

  return { params: validatedParams, session };
}
