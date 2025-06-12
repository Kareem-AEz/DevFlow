import { RequestError } from "../http-errors";
import logger from "../logger";

import handleError from "./error";

import { ActionResponse, ErrorResponse } from "@/types/global";

interface FetchOptions extends RequestInit {
  timeout?: number;
}

function isError(error: unknown): error is Error {
  return error instanceof Error;
}

export async function fetchHandler<T>(
  url: string,
  options: FetchOptions = {},
): Promise<ActionResponse<T>> {
  const {
    timeout = 5000,
    headers: customHeaders = {},
    ...restOptions
  } = options;

  // Abort the request if it takes too long
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  const defaultHeaders: HeadersInit = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  // Merge headers
  const headers = { ...defaultHeaders, ...customHeaders };
  const config: RequestInit = {
    ...restOptions,
    headers,
    signal: controller.signal,
  };

  // Fetch data
  try {
    const response = await fetch(url, config);

    if (!response.ok)
      throw new RequestError(
        `HTTP Error: ${response.statusText}`,
        response.status,
      );

    return await response.json();
  } catch (err) {
    const error = isError(err) ? err : new Error("Unknown error");

    if (error.name === "AbortError") {
      logger.warn(`Request to ${url} timed out after ${timeout}ms`);
    } else {
      logger.error(`Request to ${url} failed`);
    }

    return handleError(err) as ErrorResponse;
  } finally {
    clearTimeout(timeoutId);
  }
}
