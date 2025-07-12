"use server";

import mongoose from "mongoose";

import { action } from "../handlers/action";
import handleError from "../handlers/error";
import { NotFoundError, UnauthorizedError } from "../http-errors";
import {
  AskQuestionSchema,
  AskQuestionSchemaType,
  EditQuestionSchema,
  EditQuestionSchemaType,
  GetQuestionSchema,
  GetQuestionSchemaType,
} from "../validations";

import Question from "@/database/question.model";
import Tag, { ITag, ITagDoc } from "@/database/tag.model";
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
        { name: { $regex: new RegExp(`^${tag}$`, "i") } },
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

export async function editQuestion({
  params,
}: {
  params: EditQuestionSchemaType;
}): Promise<ActionResponse<QuestionType>> {
  const validationResult = await action({
    params,
    schema: EditQuestionSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { questionId, title, content, tags } = validationResult.params!;
  const userId = validationResult.session?.user?.id;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Find the question
    const question = await Question.findById(questionId).populate("tags");
    if (!question) throw new NotFoundError("Question");

    // Check if the user is the author of the question
    if (question.author.toString() !== userId) throw new UnauthorizedError();

    // Update the question if the title or content has changed
    if (question.title !== title || question.content !== content) {
      question.title = title;
      question.content = content;
      await question.save({ session });
    }

    // Update the tags
    const tagsToAdd = tags.filter(
      (tag) => !question.tags.includes(tag.toLowerCase()),
    );

    const tagsToRemove = question.tags.filter(
      (tag: ITag) => !tags.includes(tag.name.toLowerCase()),
    );

    const newTagQuestionDocuments = [];

    if (tagsToAdd.length > 0) {
      for (const tag of tagsToAdd) {
        const existingTag = await Tag.findOneAndUpdate(
          { name: { $regex: new RegExp(`^${tag}$`, "i") } },
          { $setOnInsert: { name: tag }, $inc: { questions: 1 } },
          { upsert: true, new: true, session },
        );

        if (existingTag) {
          newTagQuestionDocuments.push({
            tag: existingTag._id,
            question: question._id,
          });
        }

        question.tags.push(existingTag._id);
      }
    }

    if (tagsToRemove.length > 0) {
      const tagIdsToRemove = tagsToRemove.map((tag: ITagDoc) => tag._id);

      await Tag.updateMany(
        { _id: { $in: tagIdsToRemove } },
        { $inc: { questions: -1 } },
        { session },
      );

      await TagQuestion.deleteMany(
        { tag: { $in: tagIdsToRemove }, question: questionId },
        { session },
      );

      question.tags = question.tags.filter(
        (tag: ITagDoc) => !tagIdsToRemove.includes(tag._id),
      );
    }

    if (newTagQuestionDocuments.length > 0) {
      await TagQuestion.insertMany(newTagQuestionDocuments, { session });
    }

    await question.save({ session });

    // Update the question
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



export async function getQuestion({
  params,
}: {
  params: GetQuestionSchemaType;
}): Promise<ActionResponse<QuestionType>> {
  const validationResult = await action({
    params,
    schema: GetQuestionSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { questionId } = validationResult.params!;

  try {
    const question = await Question.findById(questionId).populate("tags");
    if (!question) throw new NotFoundError("Question");

    return {
      success: true,
      data: JSON.parse(JSON.stringify(question)),
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
