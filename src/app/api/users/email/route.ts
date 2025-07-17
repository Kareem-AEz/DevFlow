import { NextResponse } from "next/server";

import handleError from "@/lib/handlers/error";
import { NotFoundError, ValidationError } from "@/lib/http-errors";
import dbConnect from "@/lib/mongoose";
import { UserSchema } from "@/lib/validations";

import User, { IUserDoc } from "@/database/user.model";
import { APIErrorResponse, APIResponse } from "@/types/global";

// POST /api/users/email - Find user by email (email in request body for security)
export async function POST(
  request: Request,
): Promise<APIResponse<IUserDoc | null>> {
  const { email } = await request.json();

  try {
    const validatedEmail = UserSchema.partial().safeParse({ email });
    if (!validatedEmail.success)
      throw new ValidationError(validatedEmail.error.flatten().fieldErrors);

    await dbConnect();

    const user = await User.findOne(
      { email: validatedEmail.data.email },
      { password: 0, __v: 0, createdAt: 0, updatedAt: 0 },
    );
    if (!user) throw new NotFoundError("User");

    return NextResponse.json({ success: true, data: user }, { status: 200 });
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
