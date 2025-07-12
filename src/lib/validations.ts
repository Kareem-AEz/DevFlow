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

export type SignInWithOAuthResponseType = z.infer<typeof SignInWithOAuthSchema>;

export type SignUpWithCredentialsParamsType = z.infer<typeof SignUpSchema>;

export type SignInWithCredentialsParamsType = z.infer<typeof SignInSchema>;
