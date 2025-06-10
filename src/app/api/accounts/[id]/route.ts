import { NextResponse } from "next/server";

import { isValidObjectId } from "mongoose";

import handleError from "@/lib/handlers/error";
import { NotFoundError, ValidationError } from "@/lib/http-errors";
import dbConnect from "@/lib/mongoose";
import { AccountSchema } from "@/lib/validations";

import Account from "@/database/account.model";
import { APIErrorResponse } from "@/types/global";

// GET /api/accounts/:id
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    if (!id || !isValidObjectId(id)) throw new NotFoundError("Account");

    await dbConnect();

    const account = await Account.findById(id, {
      password: 0,
      __v: 0,
      createdAt: 0,
      updatedAt: 0,
    });
    if (!account) throw new NotFoundError("Account");

    return NextResponse.json({ success: true, data: account }, { status: 200 });
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}

// DELETE /api/accounts/:id
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    if (!id || !isValidObjectId(id)) throw new NotFoundError("Account");

    await dbConnect();

    const account = await Account.findByIdAndDelete(id, {
      password: 0,
      __v: 0,
      createdAt: 0,
      updatedAt: 0,
    });
    if (!account) throw new NotFoundError("Account");

    return NextResponse.json({ success: true, data: account }, { status: 200 });
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}

// PUT /api/accounts/:id
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    if (!id || !isValidObjectId(id)) throw new NotFoundError("Account");

    const data = await request.json();

    // Validate account schema
    const validatedAccount = AccountSchema.partial().safeParse(data);
    if (!validatedAccount.success)
      throw new ValidationError(validatedAccount.error.flatten().fieldErrors);

    await dbConnect();

    // Update account
    const account = await Account.findByIdAndUpdate(id, validatedAccount.data, {
      new: true,
      password: 0,
      __v: 0,
      createdAt: 0,
      updatedAt: 0,
    });
    if (!account) throw new NotFoundError("Account");

    return NextResponse.json({ success: true, data: account }, { status: 200 });
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
