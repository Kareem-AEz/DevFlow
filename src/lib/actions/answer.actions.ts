"use server";

import { revalidatePath } from "next/cache";

import mongoose from "mongoose";

import { action } from "../handlers/action";
import handleError from "../handlers/error";
import { NotFoundError } from "../http-errors";
import {
  CreateAnswerParamsSchema,
  CreateAnswerParamsType,
  DeleteAnswerSchema,
  DeleteAnswerSchemaType,
  GetAnswersParamsSchema,
  GetAnswersParamsType,
} from "../validations";

import { Answer, Question, Vote } from "@/database";
import { IAnswerDocument } from "@/database/answer.model";
import { ActionResponse, AnswerType, ErrorResponse } from "@/types/global";

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

export async function getAnswers(params: GetAnswersParamsType): Promise<
  ActionResponse<{
    answers: AnswerType[];
    hasNextPage: boolean;
    totalAnswers: number;
  }>
> {
  const validatedResult = await action({
    params,
    schema: GetAnswersParamsSchema,
  });

  if (validatedResult instanceof Error)
    return handleError(validatedResult) as ErrorResponse;

  const {
    questionId,
    page = 1,
    pageSize = 10,
    filter,
  } = validatedResult.params!;

  const skip = (Number(page) - 1) * Number(pageSize);
  const limit = Number(pageSize);

  let sortCriteria = {};

  const session = await mongoose.startSession();
  session.startTransaction();

  switch (filter) {
    case "latest":
      sortCriteria = { createdAt: -1 };
      break;
    case "oldest":
      sortCriteria = { createdAt: 1 };
      break;
    case "popular":
      sortCriteria = { upvotes: -1 };
      break;
    default:
      sortCriteria = { createdAt: -1 };
      break;
  }

  try {
    // total answers
    const totalAnswers = await Answer.countDocuments(
      { question: questionId },
      { session },
    );

    // has next page
    const hasNextPage = skip + limit < totalAnswers;

    // Find the answers
    const answers = await Answer.find({ question: questionId })
      .sort(sortCriteria)
      .skip(skip)
      .limit(limit)
      .populate("author", "_id name image")
      .session(session);

    return {
      success: true,
      data: {
        answers: JSON.parse(JSON.stringify(answers)),
        hasNextPage,
        totalAnswers,
      },
    };
  } catch (error) {
    await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    session.endSession();
  }
}

export async function deleteAnswer(
  params: DeleteAnswerSchemaType,
): Promise<ActionResponse> {
  const validationResult = await action({
    params,
    schema: DeleteAnswerSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { answerId } = validationResult.params!;
  const { user } = validationResult.session!;

  try {
    const answer = await Answer.findById(answerId);
    if (!answer) throw new Error("Answer not found");

    if (answer.author.toString() !== user?.id)
      throw new Error("You're not allowed to delete this answer");

    // reduce the question answers count
    await Question.findByIdAndUpdate(
      answer.question,
      { $inc: { answers: -1 } },
      { new: true },
    );

    // delete votes associated with answer
    await Vote.deleteMany({ actionId: answerId, actionType: "answer" });

    // delete the answer
    await Answer.findByIdAndDelete(answerId);

    revalidatePath(`/profile/${user?.id}`);

    return { success: true };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
