import { NextResponse } from "next/server";

// Tag type
type Tag = {
  readonly _id: string;
  name: string;
  questions: number;
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
  content: string;
  author: author;
  createdAt: Date;
  answers: number;
  upvotes: number;
  downvotes: number;
  views: number;
};

// Answer type
type AnswerType = {
  readonly _id: string;
  content: string;
  author: author;
  createdAt: Date;
  upvotes: number;
  downvotes: number;
  1;
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

type APIResponse<T = null> =
  | NextResponse<SuccessResponse<T>>
  | APIErrorResponse;

//
type Params = Promise<Record<string, string>>;
type SearchParams = Promise<Record<string, string>>;

export type Collection = {
  readonly _id: string;
  author: string | author;
  questions: Question[];
};

// Collection type after aggregation pipeline with $unwind
export type AggregatedCollection = {
  readonly _id: string;
  author: string | author;
  questions: Question; // Single question after $unwind
};

export interface User {
  _id: string;
  name: string;
  username: string;
  email: string;
  bio?: string;
  image?: string;
  location?: string;
  portfolio?: string;
  reputation?: number;
  createdAt: Date;
}

interface BadgeCounts {
  GOLD: number;
  SILVER: number;
  BRONZE: number;
}
