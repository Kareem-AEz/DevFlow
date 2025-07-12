"use server";

import mongoose from "mongoose";

import { action } from "../handlers/action";
import handleError from "../handlers/error";
import { AskQuestionSchema, AskQuestionSchemaType } from "../validations";

import Question from "@/database/question.model";
import Tag from "@/database/tag.model";
import TagQuestion from "@/database/tag-question.model";
import {
  ActionResponse,
  ErrorResponse,
  Question as QuestionType,
} from "@/types/global";

export async function createQuestion({
  params,
}: {
  params: AskQuestionSchemaType;
}): Promise<ActionResponse<QuestionType>> {
  const validationResult = await action({
    params,
    schema: AskQuestionSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { title, content, tags } = validationResult.params!;
  const userId = validationResult.session?.user?.id;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const [question] = await Question.create(
      [
        {
          title,
          content,
          author: userId,
        },
      ],
      { session },
    );

    const tagQuestionDocuments = [];
    const tagIds = [];

    for (const tag of tags) {
      const existingTag = await Tag.findOneAndUpdate(
        { name: tag },
        { $setOnInsert: { name: tag } },
        { upsert: true, new: true, session },
      );

      tagQuestionDocuments.push({
        tag: existingTag._id,
        question: question._id,
      });

      tagIds.push(existingTag._id);
    }

    await TagQuestion.insertMany(tagQuestionDocuments, { session });

    await Question.findByIdAndUpdate(
      question._id,
      {
        $push: {
          tags: { $each: tagIds },
        },
      },
      { session },
    );

    await session.commitTransaction();

    return {
      success: true,
      data: JSON.parse(JSON.stringify(question)),
    };
  } catch (error) {
    await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    await session.endSession();
  }
}
