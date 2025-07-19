import { z } from "zod";

export const SignInSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Please enter a valid email" }),

  password: z.string().min(1, { message: "Password is required" }),
});

export const SignUpSchema = SignInSchema.extend({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters" })
    .max(30, { message: "Username must be at most 30 characters" })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: "Username can only contain letters, numbers, and underscores",
    }),

  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters" })
    .max(30, { message: "Name must be at most 30 characters" })
    .regex(/^[a-zA-Z\s]+$/, {
      message: "Name can only contain letters and spaces",
    }),

  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Please enter a valid email address" }),

  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" })
    .max(30, { message: "Password must be at most 30 characters" })
    .regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/, {
      message:
        "Password must contain at least one letter, one number, and one special character",
    }),
});

export const AskQuestionSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Title is required" })
    .max(100, { message: "Title must be at most 100 characters" }),

  content: z.string().min(1, { message: "Content is required" }),

  tags: z
    .array(
      z
        .string()
        .min(3, { message: "Tag must be at least 3 characters" })
        .max(30, { message: "Tag must be at most 30 characters" }),
    )
    .min(1, { message: "At least one tag is required" })
    .max(3, { message: "You can only add up to 3 tags" }),
});

export const EditQuestionSchema = AskQuestionSchema.extend({
  questionId: z.string().min(1, { message: "Question ID is required" }),
});

export const GetQuestionSchema = z.object({
  questionId: z.string().min(1, { message: "Question ID is required" }),
});

export type GetQuestionSchemaType = z.infer<typeof GetQuestionSchema>;

export type EditQuestionSchemaType = z.infer<typeof EditQuestionSchema>;

export type AskQuestionSchemaType = z.infer<typeof AskQuestionSchema>;

// User schema
export const UserSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters" })
    .max(30, { message: "Name must be at most 30 characters" }),

  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters" })
    .max(30, { message: "Username must be at most 30 characters" }),

  email: z.string().email({ message: "Please enter a valid email address" }),

  bio: z.string().optional(),
  image: z
    .string()
    .url({ message: "Please enter a valid image URL" })
    .optional(),
  location: z.string().optional(),
  portfolio: z.string().optional(),
  reputation: z.number().optional(),
});

export const AccountSchema = z.object({
  userId: z.string().min(1, { message: "User ID is required" }),
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters" })
    .max(30, { message: "Name must be at most 30 characters" }),
  image: z
    .string()
    .url({ message: "Please enter a valid image URL" })
    .optional(),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" })
    .max(30, { message: "Password must be at most 30 characters" })
    .regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/, {
      message:
        "Password must contain at least one letter, one number, and one special character",
    })
    .optional(),
  provider: z
    .string()
    .min(1, { message: "Provider is required" })
    .max(30, { message: "Provider must be at most 30 characters" }),
  providerAccountId: z
    .string()
    .min(1, { message: "Provider Account ID is required" })
    .max(100, {
      message: "Provider Account ID must be at most 100 characters",
    }),
});

export const SignInWithOAuthSchema = z.object({
  provider: z.enum(["google", "github"]),
  providerAccountId: z.string().min(1, {
    message: "Provider Account ID is required",
  }),
  user: z.object({
    name: z.string().min(1, { message: "Name is required" }),
    username: z.string().min(1, { message: "Username is required" }),
    email: z.string().email({ message: "Please enter a valid email address" }),
    image: z.string().url({ message: "Please enter a valid image URL" }),
  }),
});

export const PaginatedSearchParamsSchema = z.object({
  page: z.number().int().positive().optional().default(1),
  pageSize: z.number().int().positive().default(10),
  query: z.string().optional(),
  filter: z.string().optional(),
  sortBy: z.string().optional(),
});

export const GetTagQuestionsSchema = PaginatedSearchParamsSchema.extend({
  tagId: z.string().min(1, { message: "Tag ID is required" }),
}).omit({
  filter: true,
  sortBy: true,
});

export type GetTagQuestionsSchemaType = z.infer<typeof GetTagQuestionsSchema>;

export type PaginatedSearchParamsType = z.infer<
  typeof PaginatedSearchParamsSchema
>;

export type SignInWithOAuthResponseType = z.infer<typeof SignInWithOAuthSchema>;

export type SignUpWithCredentialsParamsType = z.infer<typeof SignUpSchema>;

export type SignInWithCredentialsParamsType = z.infer<typeof SignInSchema>;

export const IncrementQuestionViewsSchema = z.object({
  questionId: z.string().min(1, { message: "Question ID is required" }),
});

export type IncrementQuestionViewsSchemaType = z.infer<
  typeof IncrementQuestionViewsSchema
>;

export const AnswerSchema = z.object({
  content: z
    .string()
    .min(100, { message: "Content must be at least 100 characters" })
    .max(1500, { message: "Content must be at most 1500 characters" }),
});

export type AnswerSchemaType = z.infer<typeof AnswerSchema>;

export const CreateAnswerParamsSchema = AnswerSchema.extend({
  questionId: z.string().min(1, { message: "Question ID is required" }),
});

export type CreateAnswerParamsType = z.infer<typeof CreateAnswerParamsSchema>;

export const GetAnswersParamsSchema = PaginatedSearchParamsSchema.extend({
  questionId: z.string().min(1, { message: "Question ID is required" }),
});

export type GetAnswersParamsType = z.infer<typeof GetAnswersParamsSchema>;

export const AIAnswerSchema = z.object({
  question: z
    .string()
    .min(1, { message: "Question must be at least 5 characters" })
    .max(150, { message: "Question must be at most 150 characters" }),

  content: z
    .string()
    .min(100, { message: "Content must be at least 100 characters" }),
  userAnswer: z.string().optional(),
});

export type AIAnswerSchemaType = z.infer<typeof AIAnswerSchema>;

export const CreateVoteSchema = z.object({
  targetId: z.string().min(1, { message: "Target ID is required" }),
  targetType: z.enum(["question", "answer"], {
    message: "Target type must be either question or answer",
  }),
  voteType: z.enum(["upvote", "downvote"], {
    message: "Vote type must be either upvote or downvote",
  }),
});

export type CreateVoteSchemaType = z.infer<typeof CreateVoteSchema>;

export const UpdateVoteCountSchema = CreateVoteSchema.extend({
  change: z
    .number()
    .int()
    .min(-1, { message: "Change must be -1 or 1" })
    .max(1, { message: "Change must be -1 or 1" }),
});

export type UpdateVoteCountSchemaType = z.infer<typeof UpdateVoteCountSchema>;

export const HasVotedSchema = CreateVoteSchema.pick({
  targetId: true,
  targetType: true,
});

export type HasVotedSchemaType = z.infer<typeof HasVotedSchema>;

export const HasVotedResponseSchema = z.object({
  hasUpvoted: z.boolean(),
  hasDownvoted: z.boolean(),
});

export type HasVotedResponseType = z.infer<typeof HasVotedResponseSchema>;

export const CollectionBaseSchema = z.object({
  questionId: z.string().min(1, { message: "Question ID is required" }),
});

export type CollectionBaseSchemaType = z.infer<typeof CollectionBaseSchema>;

export const GetUserProfileSchema = z.object({
  userId: z.string().min(1, { message: "User ID is required" }),
});

export type GetUserProfileSchemaType = z.infer<typeof GetUserProfileSchema>;

export const GetUserQuestionsSchema = PaginatedSearchParamsSchema.omit({
  filter: true,
  sortBy: true,
  query: true,
}).extend({
  userId: z.string().min(1, { message: "User ID is required" }),
});

export type GetUserQuestionsSchemaType = z.infer<typeof GetUserQuestionsSchema>;

export const GetUserAnswersSchema = PaginatedSearchParamsSchema.omit({
  filter: true,
  sortBy: true,
  query: true,
}).extend({
  userId: z.string().min(1, { message: "User ID is required" }),
});

export type GetUserAnswersSchemaType = z.infer<typeof GetUserAnswersSchema>;
