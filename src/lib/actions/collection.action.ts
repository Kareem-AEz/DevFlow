"use server";

import { revalidatePath } from "next/cache";

import mongoose, { PipelineStage } from "mongoose";

import { action } from "../handlers/action";
import handleError from "../handlers/error";
import { NotFoundError } from "../http-errors";
import {
  CollectionBaseSchema,
  CollectionBaseSchemaType,
  PaginatedSearchParamsSchema,
  PaginatedSearchParamsType,
} from "../validations";

import { ROUTES } from "@/constants/routes";
import { Collection, Question } from "@/database";
import {
  ActionResponse,
  AggregatedCollection,
  ErrorResponse,
} from "@/types/global";

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

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const question = await Question.findById(questionId).session(session);
    if (!question) throw new NotFoundError("Question");

    const isSaved = await Collection.findOne({
      question: questionId,
      author: userId,
    }).session(session);

    if (isSaved) {
      await Collection.deleteOne({ _id: isSaved._id });
      revalidatePath(ROUTES.QUESTION(questionId));
      return {
        success: true,
        data: {
          saved: false,
        },
      };
    }

    await Collection.create(
      [
        {
          question: questionId,
          author: userId,
        },
      ],
      { session },
    );

    await session.commitTransaction();

    revalidatePath(ROUTES.QUESTION(questionId));

    return {
      success: true,
      data: {
        saved: true,
      },
    };
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    return handleError(error) as ErrorResponse;
  } finally {
    await session.endSession();
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

export async function getSavedCollections(
  params: PaginatedSearchParamsType,
): Promise<
  ActionResponse<{ collection: AggregatedCollection[]; isNext: boolean }>
> {
  const validatedParams = await action({
    params,
    schema: PaginatedSearchParamsSchema,
    authorize: true,
  });

  if (validatedParams instanceof Error)
    return handleError(validatedParams) as ErrorResponse;

  const { page = 1, pageSize = 10, query, filter } = validatedParams.params!;
  const userId = validatedParams.session?.user?.id;

  const skip = (Number(page) - 1) * Number(pageSize);
  const limit = Number(pageSize);

  const sortOptions: Record<string, Record<string, 1 | -1>> = {
    mostRecent: { "questions.createdAt": -1 },
    old: { "questions.createdAt": 1 },
    mostVotes: { "questions.upvotes": -1 },
    mostViewed: { "questions.views": -1 },
    mostAnswered: { "questions.answers": -1 },
  };

  const sortCriteria = sortOptions[filter as keyof typeof sortOptions] || {
    "questions.createdAt": -1,
  };

  try {
    const pipeline: PipelineStage[] = [
      {
        $match: {
          author: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: "questions",
          localField: "question",
          foreignField: "_id",
          as: "questions",
        },
      },
      {
        $unwind: "$questions",
      },
      {
        $lookup: {
          from: "users",
          localField: "questions.author",
          foreignField: "_id",
          as: "questions.author",
        },
      },
      {
        $unwind: "$questions.author",
      },
      {
        $lookup: {
          from: "tags",
          localField: "questions.tags",
          foreignField: "_id",
          as: "questions.tags",
        },
      },
    ];

    if (query) {
      pipeline.push({
        $match: {
          $or: [
            { "questions.title": { $regex: query, $options: "i" } },
            { "questions.content": { $regex: query, $options: "i" } },
            { "questions.tags.name": { $regex: query, $options: "i" } },
            { "questions.author.name": { $regex: query, $options: "i" } },
          ],
        },
      });
    }

    const [totalCount] = await Collection.aggregate([
      ...pipeline,
      { $count: "count" },
    ]);

    pipeline.push(
      {
        $sort: sortCriteria,
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
    );

    pipeline.push({
      $project: {
        questions: 1,
        author: 1,
      },
    });

    const questions = await Collection.aggregate(pipeline);

    const isNext = Number(totalCount?.count) > skip + limit;

    //
    return {
      success: true,
      data: {
        collection: JSON.parse(JSON.stringify(questions)),
        isNext,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
