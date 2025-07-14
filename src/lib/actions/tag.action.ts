import { FilterQuery } from "mongoose";

import {
  PaginatedSearchParamsSchema,
  PaginatedSearchParamsType,
} from "@/lib/validations";

import { action } from "../handlers/action";
import handleError from "../handlers/error";

import { Tag } from "@/database";
import { ActionResponse, ErrorResponse, Tag as TagType } from "@/types/global";

export const getTags = async (
  params: PaginatedSearchParamsType,
): Promise<
  ActionResponse<{
    tags: TagType[];
    isNext: boolean;
  }>
> => {
  const validatedResults = await action({
    params,
    schema: PaginatedSearchParamsSchema,
  });

  if (validatedResults instanceof Error) {
    return handleError(validatedResults) as ErrorResponse;
  }

  const { page = 1, pageSize = 10, query, filter } = validatedResults.params!;

  const skip = (Number(page) - 1) * Number(pageSize);
  const limit = Number(pageSize);

  const filterQuery: FilterQuery<typeof Tag> = {};

  if (query) {
    filterQuery.$or = [
      { name: { $regex: query, $options: "i" } },
      { description: { $regex: query, $options: "i" } },
    ];
  }

  let sortCriteria = {};

  switch (filter) {
    case "popular":
      sortCriteria = {
        questions: -1,
      };
      break;

    case "recent":
      sortCriteria = { createdAt: -1 };
      break;

    case "oldest":
      sortCriteria = { createdAt: 1 };
      break;

    case "name":
      sortCriteria = { name: 1 };
      break;

    default:
      break;
  }

  try {
    const totalCount = await Tag.countDocuments(filterQuery);
    const tags = await Tag.find(filterQuery)
      .sort(sortCriteria)
      .skip(skip)
      .limit(limit)
      .lean();

    const isNext = totalCount > skip + limit;

    return {
      success: true,
      data: {
        tags: JSON.parse(JSON.stringify(tags)),
        isNext,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};
