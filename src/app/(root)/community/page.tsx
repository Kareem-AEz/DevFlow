import React from "react";

import { getUsers } from "@/lib/actions/user.actions";

import UserCard from "@/components/layout/cards/UserCard";
import CommonFilter from "@/components/layout/filters/CommonFilter";
import LocalSearch from "@/components/layout/search/LocalSearch";
import DataRenderer from "@/components/ui/DataRenderer";

import { UserFilters } from "@/constants/filters";
import { ROUTES } from "@/constants/routes";
import { STATES } from "@/constants/states";
import { SearchParams } from "@/types/global";

async function Community({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { page, pageSize, query, filter } = await searchParams;

  const { success, data, error } = await getUsers({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query,
    filter,
  });

  const { users } = data || {};

  return (
    <div>
      <h1 className="h1-bold text-dark100_light900">All Users</h1>
      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearch
          imgSrc="/icons/search.svg"
          placeholder="Search for a user"
          route={ROUTES.COMMUNITIES}
          iconPosition="left"
          className="flex-1"
        />
        <CommonFilter
          filters={UserFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
        />
      </div>

      <DataRenderer
        data={users || []}
        error={error}
        empty={STATES.EMPTY_USERS}
        success={success}
        render={(users) => {
          return (
            <div className="flex flex-wrap gap-4">
              {users.map((user) => (
                <UserCard key={user._id} {...user} />
              ))}
            </div>
          );
        }}
      />
    </div>
  );
}

export default Community;
