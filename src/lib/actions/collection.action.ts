"use server";

import { revalidatePath } from "next/cache";

import { action } from "../handlers/action";
import handleError from "../handlers/error";
import { NotFoundError } from "../http-errors";
import { CollectionBaseSchema, CollectionBaseSchemaType } from "../validations";

import { ROUTES } from "@/constants/routes";
import { Collection, Question } from "@/database";
import { ActionResponse, ErrorResponse } from "@/types/global";

export async function toggleSaveQuestion(
  params: CollectionBaseSchemaType,
): Promise<
  ActionResponse<{
    saved: boolean;
  }>
> {
  const validatedParams = await action({
    params,
    schema: CollectionBaseSchema,
    authorize: true,
  });

  if (validatedParams instanceof Error)
    return handleError(validatedParams) as ErrorResponse;

  const { questionId } = validatedParams.params!;
  const userId = validatedParams.session?.user?.id;

  try {
    const question = await Question.findById(questionId);
    if (!question) throw new NotFoundError("Question");

    const isSaved = await Collection.findOne({
      question: questionId,
      author: userId,
    });

    if (isSaved) {
      await Collection.deleteOne({ _id: isSaved._id });
      return {
        success: true,
        data: {
          saved: false,
        },
      };
    }

    await Collection.create({
      question: questionId,
      author: userId,
    });
    revalidatePath(ROUTES.QUESTION(questionId));
    return {
      success: true,
      data: {
        saved: true,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function hasSavedQuestion(
  params: CollectionBaseSchemaType,
): Promise<
  ActionResponse<{
    saved: boolean;
  }>
> {
  const validatedParams = await action({
    params,
    schema: CollectionBaseSchema,
    authorize: true,
  });

  if (validatedParams instanceof Error)
    return handleError(validatedParams) as ErrorResponse;

  const { questionId } = validatedParams.params!;
  const userId = validatedParams.session?.user?.id;

  try {
    const isSaved = await Collection.findOne({
      question: questionId,
      author: userId,
    });

    return {
      success: true,
      data: {
        saved: !!isSaved,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
