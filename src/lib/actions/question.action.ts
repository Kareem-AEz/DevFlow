"use server";

import mongoose, { FilterQuery, Types } from "mongoose";

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
  IncrementQuestionViewsSchema,
  IncrementQuestionViewsSchemaType,
  PaginatedSearchParamsSchema,
  PaginatedSearchParamsType,
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
      // 🔍 Check if tag already exists
      const existingTag = await Tag.findOne({
        name: { $regex: new RegExp(`^${tag}$`, "i") },
      }).session(session);

      let tagId;
      if (existingTag) {
        // 📊 Increment question count for existing tag
        await Tag.findByIdAndUpdate(
          existingTag._id,
          { $inc: { questions: 1 } },
          { session },
        );
        tagId = existingTag._id;
      } else {
        // 🆕 Create new tag with initial count of 1
        const newTag = new Tag({
          name: tag,
          questions: 1,
        });
        await newTag.save({ session });
        tagId = newTag._id;
      }

      tagQuestionDocuments.push({
        tag: tagId,
        question: question._id,
      });

      tagIds.push(tagId);
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
    // 🔍 Find the question and populate tags for comparison
    const question = await Question.findById(questionId).populate("tags");
    if (!question) throw new NotFoundError("Question");

    // 🔐 Check if the user is the author of the question
    if (question.author.toString() !== userId) throw new UnauthorizedError();

    // 📝 Update title/content if changed (no need to save yet)
    let hasContentChanges = false;
    if (question.title !== title || question.content !== content) {
      question.title = title;
      question.content = content;
      hasContentChanges = true;
    }

    // 🏷️ Process tag updates with corrected logic
    const existingTagNames = question.tags.map((tag: ITag) =>
      tag.name.toLowerCase(),
    );
    const newTagNames = tags.map((tag) => tag.toLowerCase());

    // ✨ Find tags to add/remove by comparing tag names (not ObjectIds)
    const tagsToAdd = tags.filter(
      (tag) => !existingTagNames.includes(tag.toLowerCase()),
    );
    const tagsToRemove = question.tags.filter(
      (tag: ITag) => !newTagNames.includes(tag.name.toLowerCase()),
    );

    // 🔄 Process tag additions
    const newTagIds = [];
    const newTagQuestionDocuments = [];

    if (tagsToAdd.length > 0) {
      for (const tagName of tagsToAdd) {
        // 🎯 Find existing tag or create new one
        const existingTag = await Tag.findOne({
          name: { $regex: `^${tagName}$`, $options: "i" },
        }).session(session);

        let tagId;
        if (existingTag) {
          // 📊 Increment question count for existing tag
          await Tag.findByIdAndUpdate(
            existingTag._id,
            { $inc: { questions: 1 } },
            { session },
          );
          tagId = existingTag._id;
        } else {
          // 🆕 Create new tag with initial count of 1
          const newTag = new Tag({
            name: tagName,
            questions: 1,
          });
          await newTag.save({ session });
          tagId = newTag._id;
        }

        newTagIds.push(tagId);
        newTagQuestionDocuments.push({
          tag: tagId,
          question: question._id,
        });
      }
    }

    // 🗑️ Process tag removals
    if (tagsToRemove.length > 0) {
      const tagIdsToRemove = tagsToRemove.map((tag: ITagDoc) => tag._id);

      // 📉 Decrement question count for removed tags
      await Tag.updateMany(
        { _id: { $in: tagIdsToRemove } },
        { $inc: { questions: -1 } },
        { session },
      );

      // 🔗 Remove tag-question relationships
      await TagQuestion.deleteMany(
        { tag: { $in: tagIdsToRemove }, question: questionId },
        { session },
      );

      // 🧹 Filter out removed tags from question.tags array
      question.tags = question.tags.filter(
        (tag: ITagDoc) =>
          !tagIdsToRemove.some((removedId: Types.ObjectId) =>
            removedId.equals(tag._id as Types.ObjectId),
          ),
      );
    }

    // 🔗 Add new tag-question relationships
    if (newTagQuestionDocuments.length > 0) {
      await TagQuestion.insertMany(newTagQuestionDocuments, { session });
    }

    // 🔄 Update question tags array with new tags
    question.tags.push(...newTagIds);

    // 💾 Single save operation for all changes
    if (hasContentChanges || tagsToAdd.length > 0 || tagsToRemove.length > 0) {
      await question.save({ session });
    }

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
    const question = await Question.findById(questionId)
      .populate("tags")
      .populate("author", "_id name image");

    if (!question) throw new NotFoundError("Question");

    return {
      success: true,
      data: JSON.parse(JSON.stringify(question)),
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

/**
 * 🔍 Fetches questions with flexible filtering, search, and pagination
 *
 * This is the main workhorse for the questions page - handles everything from
 * simple browsing to complex search queries. The filtering system is designed
 * to be intuitive for users while being efficient for the database.
 *
 * @param params - Search and filter parameters
 * @returns Paginated questions with metadata for infinite scroll/pagination
 */
export async function getQuestions(
  params: PaginatedSearchParamsType,
): Promise<ActionResponse<{ questions: QuestionType[]; isNext: boolean }>> {
  const validationResult = await action({
    params,
    schema: PaginatedSearchParamsSchema,
  });

  if (validationResult instanceof Error)
    return handleError(validationResult) as ErrorResponse;

  const { page = 1, pageSize = 10, query, filter } = validationResult.params!;

  // 📊 Standard pagination math - skip records for previous pages
  const skip = (Number(page) - 1) * Number(pageSize);
  const limit = Number(pageSize);

  // 🎯 Start with empty filter - we'll build this based on user intent
  const queryFilter: FilterQuery<typeof Question> = {};

  // 🚨 Recommended filter is a placeholder for future ML-based recommendations
  // For now, we return empty results to avoid breaking the UI
  if (filter === "recommended") {
    return {
      success: true,
      data: {
        questions: [],
        isNext: false,
      },
    };
  }

  // 🔍 Search functionality - match either title OR content
  // Using regex with 'i' flag for case-insensitive search
  if (query) {
    queryFilter.$or = [
      { title: { $regex: new RegExp(query, "i") } },
      { content: { $regex: new RegExp(query, "i") } },
    ];
  }

  // 📈 Sorting strategy varies by filter type
  let sortCriteria = {};

  switch (filter) {
    case "newest":
      // Simple chronological sort - most recent first
      sortCriteria = { createdAt: -1 };
      break;

    case "unanswered":
      // 🎯 Two-step filter: only show questions with 0 answers, then sort by newest
      // This helps users find questions that still need help
      queryFilter.answers = 0;
      sortCriteria = { createdAt: -1 };
      break;

    case "popular":
      // Community-driven sort - let upvotes determine relevance
      sortCriteria = { upvotes: -1 };
      break;

    default:
      // Default to newest - safest fallback for unknown filters
      sortCriteria = { createdAt: -1 };
      break;
  }

  try {
    // 🔗 Populate related data for rich question display
    // Only fetch essential fields to keep response size reasonable
    const questions = await Question.find(queryFilter)
      .populate("tags", "name") // Tag names for filtering/display
      .populate("author", "name image") // Author info for attribution
      .lean() // Return plain objects (faster)
      .sort(sortCriteria)
      .skip(skip)
      .limit(limit);

    // 📊 Count total matches for pagination metadata
    const totalQuestions = await Question.countDocuments(queryFilter);

    // ✨ Calculate if there are more pages (for infinite scroll/pagination)
    const isNext = skip + limit < totalQuestions;

    return {
      success: true,
      data: {
        // 🔄 Convert Mongoose documents to plain objects for serialization
        questions: JSON.parse(JSON.stringify(questions)),
        isNext,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function incrementQuestionViews({
  params,
}: {
  params: IncrementQuestionViewsSchemaType;
}): Promise<ActionResponse<{ views: number }>> {
  const validationResult = await action({
    params,
    schema: IncrementQuestionViewsSchema,
  });

  if (validationResult instanceof Error)
    return handleError(validationResult) as ErrorResponse;

  const { questionId } = validationResult.params!;

  try {
    const question = await Question.findByIdAndUpdate(questionId, {
      $inc: { views: 1 },
    });

    return {
      success: true,
      data: { views: question?.views || 0 },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
