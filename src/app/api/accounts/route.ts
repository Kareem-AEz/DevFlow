import { NextResponse } from "next/server";

import handleError from "@/lib/handlers/error";
import { ForbiddenError } from "@/lib/http-errors";
import dbConnect from "@/lib/mongoose";
import { AccountSchema } from "@/lib/validations";

import Account from "@/database/account.model";
import { APIErrorResponse } from "@/types/global";

export async function GET() {
  try {
    await dbConnect();

    const accounts = await Account.find();

    return NextResponse.json(
      { success: true, data: accounts },
      { status: 200 },
    );
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();

    const body = await request.json();

    // Validate account schema
    const validatedAccount = AccountSchema.parse(body);

    // Check if user already exists
    const existingAccount = await Account.findOne({
      provider: validatedAccount.provider,
      providerAccountId: validatedAccount.providerAccountId,
    });
    if (existingAccount) throw new ForbiddenError("Account already exists");

    // Create account
    const newAccount = await Account.create(validatedAccount);

    return NextResponse.json(
      { success: true, data: newAccount },
      { status: 201 },
    );
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
