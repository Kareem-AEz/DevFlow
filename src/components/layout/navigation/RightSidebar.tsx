import React from "react";

import Link from "next/link";

import TagCard from "../cards/TagCard";

const hotQuestions = [
  {
    id: 1,
    title: "What is the best way to learn programming?",
  },
  {
    id: 2,
    title: "How to create a custom hook in React?",
  },
  {
    id: 3,
    title: "What is the difference between props and state in React?",
  },
  {
    id: 4,
    title: "How to handle form validation in React?",
  },
  {
    id: 5,
    title:
      "What is the difference between useEffect and useLayoutEffect in React?",
  },
];

const popularTags = [
  {
    id: 1,
    name: "react",
    questions: 10,
  },
  {
    id: 2,
    name: "javascript",
    questions: 8,
  },
  {
    id: 3,
    name: "typescript",
    questions: 6,
  },
  {
    id: 4,
    name: "css",
    questions: 4,
  },
  {
    id: 5,
    name: "html",
    questions: 2,
  },
];

function RightSidebar() {
  return (
    <aside className="no-scrollbar background-light900_dark200 light-border shadow-light-300 sticky top-0 right-0 flex h-screen w-full max-w-72 flex-col gap-6 overflow-y-auto border-l p-6 pt-36 max-xl:hidden dark:shadow-none">
      <div>
        <h2 className="h2-bold text-dark200_light900">Top Question</h2>

        <div className="mt-7 flex w-full flex-col gap-4 px-4 py-2 pr-0">
          {hotQuestions.map((question) => (
            <Link
              href={`/question/${question.id}`}
              key={question.id}
              className="rounded-2 group relative flex items-center justify-between gap-4"
            >
              <p className="body-medium text-dark500_light700">
                {question.title}
              </p>

              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={"/icons/chevron-right.svg"}
                width={24}
                height={24}
                className="invert-colors size-6 transition-transform duration-200 group-hover:translate-x-1"
                alt="Chevron Right"
              />
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-10">
        <h2 className="h2-bold text-dark200_light900">Popular Tags</h2>

        <div className="mt-7 flex flex-col gap-4 px-4 py-2 pr-0">
          {popularTags.map((tag) => {
            return (
              <TagCard
                key={tag.id}
                name={tag.name}
                questions={tag.questions}
                showCount
              />
            );
          })}
        </div>
      </div>
    </aside>
  );
}

export default RightSidebar;
