import { NextRequest, NextResponse } from "next/server";

import books from "../../db";

// GET - Get a book by ID
export async function GET(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	const id = parseInt(params.id);
	const book = books.find((book) => book.id === id);

	if (!book) {
		return NextResponse.json(
			{ error: `Book with id ${id} not found` },
			{ status: 404 }
		);
	}

	return NextResponse.json(book);
}
