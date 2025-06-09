import { NextResponse } from "next/server";

import tickets from "@/app/database";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const ticket = tickets.find((ticket) => ticket.id === parseInt(id));

  if (!ticket) {
    return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
  }

  return NextResponse.json(ticket);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const { name, status, type } = await request.json();

  const updatedTicket = tickets.find((ticket) => ticket.id === parseInt(id));

  if (!updatedTicket) {
    return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
  }

  if (name) updatedTicket.name = name;
  if (status) updatedTicket.status = status;
  if (type) updatedTicket.type = type;

  return NextResponse.json(updatedTicket);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const ticketIndex = tickets.findIndex((ticket) => ticket.id === parseInt(id));

  if (ticketIndex === -1)
    return NextResponse.json({ error: "Ticket not found" }, { status: 404 });

  tickets.splice(ticketIndex, 1);

  return NextResponse.json(tickets);
}
