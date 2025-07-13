import React from "react";

import Link from "next/link";

import { getTimestamp } from "@/lib/utils";

import Metric from "../Metric";

import TagCard from "./TagCard";

import { ROUTES } from "@/constants/routes";
import { Question } from "@/types/global";

const QuestionCard = ({
  question: { _id, title, author, createdAt, answers, upvotes, views, tags },
}: {
  question: Question;
}) => {
  return (
    <div className="card-wrapper rounded-2 p-9 sm:px-11">
      <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
        <div>
          <span className="subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden">
            {getTimestamp(createdAt)}
          </span>

          <Link href={`${ROUTES.QUESTION(_id)}`}>
            <h3 className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1">
              {title}
            </h3>
          </Link>
        </div>
      </div>

      <div className="mt-3.5 flex w-full flex-wrap gap-2">
        {tags.map((tag) => (
          <TagCard key={tag._id} name={tag.name} />
        ))}
      </div>

      <div className="flex-between mt-6 w-full flex-wrap gap-3">
        <Metric
          imgUrl={author.image}
          alt={author.name}
          value={author.name}
          title={` - asked ${getTimestamp(createdAt)}`}
          href={`${ROUTES.PROFILE(author._id)}`}
          textStyles="body-medium text-dark400_light700"
          isAuthor
        />

        <div className="flex items-center gap-3 max-sm:flex-wrap max-sm:justify-start">
          <Metric
            imgUrl={"/icons/like.svg"}
            alt="upvotes"
            value={upvotes}
            title=" Votes"
            textStyles="small-medium text-dark400_light800"
          />
          <Metric
            imgUrl={"/icons/message.svg"}
            alt="message"
            value={answers}
            title=" Answers"
            textStyles="small-medium text-dark400_light800"
          />
          <Metric
            imgUrl={"/icons/eye.svg"}
            alt="views"
            value={views}
            title=" Views"
            textStyles="small-medium text-dark400_light800"
          />
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
