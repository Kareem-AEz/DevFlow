import Link from "next/link";

import { getSearchParams } from "@/lib/searchParams";

import QuestionCard from "@/components/layout/cards/QuestionCard";
import HomeFilter from "@/components/layout/filters/HomeFilter";
import LocalSearch from "@/components/layout/search/LocalSearch";
import { Button } from "@/components/ui/button";

import { ROUTES } from "@/constants/routes";

const questions = [
  {
    _id: "1",
    title: "How to use Next.js?",
    description: "I want to learn how to use Next.js",
    tags: [
      {
        _id: "1",
        name: "nextjs",
      },
      {
        _id: "2",
        name: "react",
      },
    ],
    author: {
      _id: "1",
      name: "John Doe",
      image: "https://github.com/shadcn.png",
    },
    upvotes: 10,
    views: 100,
    answers: 10,
    createdAt: new Date(),
  },
  {
    _id: "2",
    title: "How to use Tailwind CSS?",
    description: "I want to learn how to use Tailwind CSS",
    tags: [{ _id: "1", name: "tailwindcss" }],
    author: {
      _id: "2",
      name: "Jane Doe",
      image: "https://github.com/shadcn.png",
    },
    upvotes: 12,
    views: 22,
    answers: 10,
    createdAt: new Date(),
  },
  {
    _id: "3",
    title: "How to implement WebSockets in a Node.js application?",
    description:
      "I'm building a real-time chat application and need guidance on implementing WebSockets efficiently in Node.js with Express.",
    tags: [
      { _id: "1", name: "nodejs" },
      { _id: "2", name: "express" },
    ],
    author: {
      _id: "2",
      name: "Jane Doe",
      image: "https://github.com/shadcn.png",
    },
    upvotes: 12,
    views: 22,
    answers: 10,
    createdAt: new Date(`2025-02-30T22:00:00.000Z`),
  },
];

// const test = async () => {
//   try {
//     throw new ValidationError({
//       title: ["Required"],
//       tags: ['"JavaScript" is not a valid tag'],
//     });
//   } catch (error) {
//     return handleError(error);
//   }
// };

export default async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // await test();

  const { query } = await getSearchParams(searchParams);

  // Convert query to string whether it's a string or an array
  const queryString = Array.isArray(query) ? query[0] : query || "";

  const filteredQuestions = questions.filter((question) =>
    question.title.toLowerCase().includes(queryString.toLowerCase()),
  );

  return (
    <>
      <section className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">All Questions</h1>

        <Button
          className="primary-gradient !text-light-900 min-h-11 px-4 py-3"
          asChild
        >
          <Link href={ROUTES.ASK_A_QUESTION}>Ask a Question</Link>
        </Button>
      </section>
      <section className="mt-11">
        <LocalSearch
          imgSrc="/icons/search.svg"
          placeholder="Search questions..."
          className="flex-1"
          route={ROUTES.HOME}
        />
      </section>
      {/*   */}
      <HomeFilter />
      {/*  */}
      <p></p>
      <div className="mt-10 flex w-full flex-col gap-6">
        {filteredQuestions.map((question) => (
          <QuestionCard key={question._id} question={question} />
        ))}
      </div>
    </>
  );
}
