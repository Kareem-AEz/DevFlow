import { NextResponse } from "next/server";

import mongoose from "mongoose";
import slugify from "slugify";

import handleError from "@/lib/handlers/error";
import { ValidationError } from "@/lib/http-errors";
import dbConnect from "@/lib/mongoose";
import { SignInWithOAuthSchema } from "@/lib/validations";

import Account, { IAccountDoc } from "@/database/account.model";
import User from "@/database/user.model";
import { APIErrorResponse, APIResponse } from "@/types/global";

export async function POST(
  request: Request,
): Promise<APIResponse<IAccountDoc>> {
  const { provider, providerAccountId, user } = await request.json();
  await dbConnect();
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const validatedData = SignInWithOAuthSchema.safeParse({
      provider,
      providerAccountId,
      user,
    });

    if (!validatedData.success) {
      throw new ValidationError(validatedData.error.flatten().fieldErrors);
    }

    const { name, username, email, image } = validatedData.data.user;
    const slugifiedUserName = slugify(username, {
      lower: true,
      strict: true,
      trim: true,
    });

    let existingUser = await User.findOne({
      email,
    }).session(session);

    if (!existingUser) {
      [existingUser] = await User.create(
        [
          {
            name,
            username: slugifiedUserName,
            email,
            image,
          },
        ],
        { session },
      );
    } else {
      const updatedData: { name?: string; image?: string } = {};

      if (existingUser.name !== name) updatedData.name = name;
      if (existingUser.image !== image) updatedData.image = image;

      if (Object.keys(updatedData).length > 0) {
        await User.updateOne(
          { _id: existingUser._id },
          { $set: updatedData },
        ).session(session);
      }
    }

    let existingAccount = await Account.findOne({
      userId: existingUser._id,
      provider,
      providerAccountId,
    }).session(session);

    if (!existingAccount) {
      [existingAccount] = await Account.create(
        [
          {
            userId: existingUser._id,
            provider,
            providerAccountId,
            name,
            username: slugifiedUserName,
          },
        ],
        { session },
      );
    }

    await session.commitTransaction();

    return NextResponse.json(
      { success: true, data: existingAccount },
      { status: 200 },
    );
  } catch (error) {
    await session.abortTransaction();
    return handleError(error, "api") as APIErrorResponse;
  } finally {
    session.endSession();
  }
}
