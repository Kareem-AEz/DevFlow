import { NextRequest, NextResponse } from "next/server";

import books from "../db";

// GET - Get all books
export async function GET() {
	return NextResponse.json(books);
}

// POST - Add a new book
export async function POST(request: NextRequest) {
	const body = await request.json();

	// Create new book with next available ID
	const newBook = {
		id: books.length + 1,
		name: body.name,
	};

	// Add to books array (in a real app, you'd persist this to a database)
	books.push(newBook);

	return NextResponse.json(newBook, { status: 201 });
}

// PUT - Update a book by ID
export async function PUT(request: NextRequest) {
	const body = await request.json();
	const { id, name } = body;

	// Find the book index
	const bookIndex = books.findIndex((book) => book.id === id);

	// Book not found
	if (bookIndex === -1) {
		return NextResponse.json(
			{ error: `Book with id ${id} not found` },
			{ status: 404 }
		);
	}

	// Update the book
	books[bookIndex].name = name;

	return NextResponse.json(books[bookIndex]);
}

// DELETE - Delete a book by ID
export async function DELETE(request: NextRequest) {
	const url = new URL(request.url);
	const id = parseInt(url.searchParams.get("id") || "0");

	// Find the book index
	const bookIndex = books.findIndex((book) => book.id === id);

	// Book not found
	if (bookIndex === -1) {
		return NextResponse.json(
			{ error: `Book with id ${id} not found` },
			{ status: 404 }
		);
	}

	// Remove the book
	const deletedBook = books[bookIndex];
	books.splice(bookIndex, 1);

	return NextResponse.json(deletedBook);
}
