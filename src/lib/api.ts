import { LanguageModelUsage } from "ai";

import { fetchHandler } from "./handlers/fetch";
import { SignInWithOAuthResponseType } from "./validations";

import { IAccount } from "@/database/account.model";
import { IUser } from "@/database/user.model";
import { APIResponse } from "@/types/global";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

const createCrud = <T>(basePath: string) => ({
  getAll: async () => fetchHandler<T[]>(`${basePath}`),
  getById: async (id: string) => fetchHandler<T>(`${basePath}/${id}`),
  create: async (data: Partial<T>) =>
    fetchHandler<T>(`${basePath}`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: async (id: string, data: Partial<T>) =>
    fetchHandler<T>(`${basePath}/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: async (id: string) =>
    fetchHandler<T>(`${basePath}/${id}`, {
      method: "DELETE",
    }),
});

export const api = {
  auth: {
    signInWithOAuth: async ({
      provider,
      providerAccountId,
      user,
    }: SignInWithOAuthResponseType) =>
      fetchHandler<SignInWithOAuthResponseType>(
        `${API_BASE_URL}/auth/sign-in-with-oauth`,
        {
          method: "POST",
          body: JSON.stringify({ provider, providerAccountId, user }),
        },
      ),
  },
  users: {
    ...createCrud<IUser>(`${API_BASE_URL}/users`),
    getByEmail: async (email: string) =>
      fetchHandler<IUser>(`${API_BASE_URL}/users/email`, {
        method: "POST",
        body: JSON.stringify({ email }),
      }),
  },
  accounts: {
    ...createCrud<IAccount>(`${API_BASE_URL}/accounts`),
    getByProviderId: async (providerAccountId: string) =>
      fetchHandler<IAccount>(`${API_BASE_URL}/accounts/provider`, {
        method: "POST",
        body: JSON.stringify({ providerAccountId }),
      }),
  },
  ai: {
    answers: async (question: string, content: string, userAnswer: string) =>
      fetchHandler<
        APIResponse<{
          text: string;
          usage: LanguageModelUsage;
          reasoning: string | undefined;
          providerMetadata: unknown;
          sources: unknown;
        }>
      >(`${API_BASE_URL}/ai/answers`, {
        method: "POST",
        body: JSON.stringify({ question, content, userAnswer }),
        timeout: 100000,
      }),
  },
};
