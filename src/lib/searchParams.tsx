import { createLoader, parseAsString } from "nuqs/server";

export const searchParams = {
  query: parseAsString,
};

export const getSearchParams = createLoader(searchParams);
