import { NextRequest, NextResponse } from "next/server";

import tickets from "@/app/database";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("query");

  if (!query)
    return NextResponse.json({ error: "Query is required" }, { status: 400 });

  const filteredTickets = tickets.filter((ticket) =>
    ticket.name.toLowerCase().includes(query.toLowerCase()),
  );

  return NextResponse.json(filteredTickets);
}
