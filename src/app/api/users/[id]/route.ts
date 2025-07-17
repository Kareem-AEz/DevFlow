import { NextResponse } from "next/server";

import { isValidObjectId } from "mongoose";

import handleError from "@/lib/handlers/error";
import { NotFoundError, ValidationError } from "@/lib/http-errors";
import dbConnect from "@/lib/mongoose";
import { UserSchema } from "@/lib/validations";

import User, { IUserDoc } from "@/database/user.model";
import { APIErrorResponse, APIResponse } from "@/types/global";

// GET /api/users/:id
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<APIResponse<IUserDoc>> {
  try {
    const { id } = await params;
    if (!id || !isValidObjectId(id)) throw new NotFoundError("User");

    await dbConnect();

    const user = await User.findById(id, {
      password: 0,
      __v: 0,
      createdAt: 0,
      updatedAt: 0,
    });
    if (!user) throw new NotFoundError("User");

    return NextResponse.json({ success: true, data: user }, { status: 200 });
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}

// DELETE /api/users/:id
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<APIResponse<IUserDoc>> {
  try {
    const { id } = await params;
    if (!id || !isValidObjectId(id)) throw new NotFoundError("User");

    await dbConnect();

    const user = await User.findByIdAndDelete(id, {
      password: 0,
      __v: 0,
      createdAt: 0,
      updatedAt: 0,
    });
    if (!user) throw new NotFoundError("User");

    return NextResponse.json({ success: true, data: user }, { status: 200 });
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}

// PUT /api/users/:id
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<APIResponse<IUserDoc>> {
  try {
    const { id } = await params;
    if (!id || !isValidObjectId(id)) throw new NotFoundError("User");

    const data = await request.json();

    // Validate user schema
    const validatedUser = UserSchema.partial().safeParse(data);
    if (!validatedUser.success)
      throw new ValidationError(validatedUser.error.flatten().fieldErrors);

    await dbConnect();

    // Update user
    const user = await User.findByIdAndUpdate(id, validatedUser.data, {
      new: true,
      password: 0,
      __v: 0,
      createdAt: 0,
      updatedAt: 0,
    });
    if (!user) throw new NotFoundError("User");

    return NextResponse.json({ success: true, data: user }, { status: 200 });
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
