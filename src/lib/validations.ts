import { z } from "zod";

export const SignInSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required." })
    .email({ message: "Please enter a valid email." }),

  password: z.string().min(1, { message: "Password is required." }),
});

export const SignUpSchema = SignInSchema.extend({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters." })
    .max(30, { message: "Username must be at most 30 characters." })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: "Username can only contain letters, numbers, and underscores.",
    }),

  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters." })
    .max(30, { message: "Name must be at most 30 characters." })
    .regex(/^[a-zA-Z\s]+$/, {
      message: "Name can only contain letters and spaces.",
    }),

  email: z
    .string()
    .min(1, { message: "Email is required." })
    .email({ message: "Please enter a valid email address." }),

  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." })
    .max(30, { message: "Password must be at most 30 characters." })
    .regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/, {
      message:
        "Password must contain at least one letter, one number, and one special character.",
    }),
});

export const AskQuestionSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Title is required." })
    .max(100, { message: "Title must be at most 100 characters." }),

  content: z.string().min(1, { message: "Content is required." }),

  tags: z
    .array(
      z
        .string()
        .min(3, { message: "Tag must be at least 3 characters." })
        .max(30, { message: "Tag must be at most 30 characters." }),
    )
    .min(1, { message: "At least one tag is required." })
    .max(3, { message: "You can only add up to 3 tags." }),
});
