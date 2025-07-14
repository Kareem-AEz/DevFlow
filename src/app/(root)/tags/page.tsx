import React from "react";

import { getTags } from "@/lib/actions/tag.action";

async function Tags() {
  const { success, data, error } = await getTags({
    page: 1,
    pageSize: 10,
    query: "",
    filter: "",
    sortBy: "",
  });

  const { tags } = data || {};

  console.log("TAGS", JSON.stringify(tags, null, 2));

  return <div>Tags</div>;
}

export default Tags;
