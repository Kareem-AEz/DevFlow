import React from "react";

import { getTags } from "@/lib/actions/tag.action";
import { PaginatedSearchParamsType } from "@/lib/validations";

import TagCard from "@/components/layout/cards/TagCard";
import LocalSearch from "@/components/layout/search/LocalSearch";
import DataRenderer from "@/components/ui/DataRenderer";

import { ROUTES } from "@/constants/routes";
import { STATES } from "@/constants/states";

async function Tags({
  searchParams,
}: {
  searchParams: Promise<PaginatedSearchParamsType>;
}) {
  const { page = 1, pageSize = 10, query, filter } = await searchParams;

  const { success, data, error } = await getTags({
    page: Number(page),
    pageSize: Number(pageSize),
    query,
    filter,
  });

  const { tags } = data || {};

  return (
    <>
      <h1 className="h1-bold text-dark-100_light-900 text-3xl">Tags</h1>

      <section className="mt-11">
        <LocalSearch
          route={ROUTES.TAGS}
          imgSrc="/icons/search.svg"
          placeholder="Search tags..."
          iconPosition="left"
          className="flex-1"
        />
      </section>

      <DataRenderer
        success={success}
        error={error}
        data={tags}
        empty={STATES.EMPTY_TAG}
        render={(tags) => (
          <div className="mt-10 flex w-full flex-wrap gap-4">
            {tags.map((tag) => (
              <TagCard key={tag._id} {...tag} />
            ))}
          </div>
        )}
      />
    </>
  );
}

export default Tags;
