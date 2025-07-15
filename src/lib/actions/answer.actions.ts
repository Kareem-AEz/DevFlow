"use server";

import { revalidatePath } from "next/cache";

import mongoose from "mongoose";

import { action } from "../handlers/action";
import handleError from "../handlers/error";
import { NotFoundError } from "../http-errors";
import {
  CreateAnswerParamsSchema,
  CreateAnswerParamsType,
} from "../validations";

import { Question } from "@/database";
import Answer, { IAnswerDocument } from "@/database/answer.model";
import { ActionResponse, ErrorResponse } from "@/types/global";

export async function createAnswer(
  params: CreateAnswerParamsType,
): Promise<ActionResponse<IAnswerDocument>> {
  const validatedResult = await action({
    params,
    schema: CreateAnswerParamsSchema,
    authorize: true,
  });

  if (validatedResult instanceof Error)
    return handleError(validatedResult) as ErrorResponse;

  const { questionId, content } = validatedResult.params!;
  const userId = validatedResult?.session?.user?.id;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Find the question
    const question = await Question.findById(questionId).session(session);
    if (!question) throw new NotFoundError("Question");

    // Create the answer
    const [answer] = await Answer.create(
      [
        {
          question: questionId,
          content,
          author: userId,
        },
      ],
      { session },
    );

    if (!answer) throw new Error("Failed to create answer");

    // Update the question
    question.answers += 1;
    await question.save({ session });

    await session.commitTransaction();
    revalidatePath(`/question/${questionId}`);
    return {
      success: true,
      data: JSON.parse(JSON.stringify(answer)),
    };
  } catch (error) {
    await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    session.endSession();
  }
}
