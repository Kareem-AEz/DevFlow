import { NextRequest, NextResponse } from "next/server";

import handleError from "@/lib/handlers/error";
import { NotFoundError, ValidationError } from "@/lib/http-errors";
import dbConnect from "@/lib/mongoose";
import { AccountSchema } from "@/lib/validations";

import Account, { IAccountDoc } from "@/database/account.model";
import { APIErrorResponse, APIResponse } from "@/types/global";

// POST /api/accounts/provider
export async function POST(
  request: NextRequest,
): Promise<APIResponse<IAccountDoc>> {
  try {
    const { providerAccountId } = await request.json();

    const validatedData = AccountSchema.partial().safeParse({
      providerAccountId,
    });
    if (!validatedData.success)
      throw new ValidationError(validatedData.error.flatten().fieldErrors);

    await dbConnect();

    const account = await Account.findOne({
      providerAccountId: validatedData.data.providerAccountId,
    });
    if (!account) throw new NotFoundError("Account");

    return NextResponse.json({ success: true, data: account }, { status: 200 });
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
