import React from "react";

import { Params } from "@/types/global";

async function page({ params }: { params: Params }) {
  const { id } = await params;

  return <div>Question: {id}</div>;
}

export default page;
