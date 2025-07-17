import React, { Suspense } from "react";

import Link from "next/link";
import { redirect } from "next/navigation";
import { after } from "next/server";

import { getAnswers } from "@/lib/actions/answer.actions";
import {
  getQuestion,
  incrementQuestionViews,
} from "@/lib/actions/question.action";
import { hasVoted } from "@/lib/actions/vote.action";
import { formatNumber, getTimestamp } from "@/lib/utils";

import AllAnswers from "@/components/layout/answers/All-Answers";
import TagCard from "@/components/layout/cards/TagCard";
import Preview from "@/components/layout/editor/Preview";
import AnswerForm from "@/components/layout/forms/AnswerForm";
import Metric from "@/components/layout/Metric";
import Votes from "@/components/layout/votes/Votes";
import UserAvatar from "@/components/ui/UserAvatar";

import { ROUTES } from "@/constants/routes";
import { Params, Tag } from "@/types/global";

const QuestionDetails = async ({ params }: { params: Params }) => {
  const { id } = await params;

  after(async () => {
    incrementQuestionViews({
      params: { questionId: id },
    });
  });

  const { success, data: question } = await getQuestion({
    params: { questionId: id },
  });

  if (!success || !question) {
    return redirect("/404");
  }

  const {
    success: answersSuccess,
    data: answersData,
    error: answersError,
  } = await getAnswers({
    questionId: id,
    page: 1,
    pageSize: 10,
    filter: "latest",
  });

  const hasVotedPromise = hasVoted({
    targetId: id,
    targetType: "question",
  });

  const { author, createdAt, views, tags, content, title, answers } = question;

  return (
    <>
      <div className="flex-start w-full flex-col">
        <div className="flex w-full flex-col-reverse justify-between">
          <div className="flex items-center justify-start gap-1">
            <UserAvatar
              userId={author._id}
              name={author.name}
              className="size-[22px]"
              fallbackClassName="text-[10px]"
            />
            <Link href={ROUTES.PROFILE(author._id)}>
              <p className="paragraph-semibold text-dark300_light700">
                {author.name}
              </p>
            </Link>
          </div>

          <div className="flex justify-end">
            <Suspense fallback={<div>Loading...</div>}>
              <Votes
                upvotes={question.upvotes}
                downvotes={question.downvotes}
                targetId={id}
                targetType="question"
                hasVotedPromise={hasVotedPromise}
              />
            </Suspense>
          </div>
        </div>

        <h2 className="h2-semibold text-dark200_light900 mt-3.5 w-full">
          {title}
        </h2>
      </div>

      <div className="mt-5 mb-8 flex flex-wrap gap-4">
        <Metric
          imgUrl="/icons/clock.svg"
          alt="clock icon"
          value={` asked ${getTimestamp(new Date(createdAt))}`}
          title=""
          textStyles="small-regular text-dark400_light700"
        />
        <Metric
          imgUrl="/icons/message.svg"
          alt="message icon"
          value={answers}
          title=""
          textStyles="small-regular text-dark400_light700"
        />
        <Metric
          imgUrl="/icons/eye.svg"
          alt="eye icon"
          value={formatNumber(views)}
          title=""
          textStyles="small-regular text-dark400_light700"
        />
      </div>

      <Preview content={content} />

      <div className="mt-8 flex flex-wrap gap-2">
        {tags.map((tag: Tag) => (
          <TagCard
            key={tag._id}
            _id={tag._id as string}
            name={tag.name}
            compact
          />
        ))}
      </div>

      <section className="my-10">
        <AllAnswers
          data={answersData?.answers}
          success={answersSuccess}
          error={answersError}
          totalAnswers={answersData?.totalAnswers || 0}
        />
      </section>

      <section className="my-5">
        <AnswerForm
          questionId={id}
          questionTitle={title}
          questionContent={content}
        />
      </section>
    </>
  );
};

export default QuestionDetails;
