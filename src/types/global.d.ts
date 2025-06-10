import { NextResponse } from "next/server";

// Tag type
type Tag = {
  readonly _id: string;
  name: string;
};

// Author type
type author = {
  readonly _id: string;
  name: string;
  username?: string;
  image: string;
};

// Question type
type Question = {
  readonly _id: string;
  title: string;
  tags: Tag[];
  author: author;
  createdAt: Date;
  answers: number;
  upvotes: number;
  views: number;
};

// Action response type
type ActionResponse<T = null> = {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    details?: Record<string, string[]>;
  };
  status?: number;
};

// Success response type
type SuccessResponse<T = null> = ActionResponse<T> & { success: true };

// Error response type
type ErrorResponse = ActionResponse<undefined> & { success: false };

// API response type
type APIErrorResponse = NextResponse<ErrorResponse>;

type APIResponse<T = null> = NextResponse<SuccessResponse<T>> | ErrorResponse;
