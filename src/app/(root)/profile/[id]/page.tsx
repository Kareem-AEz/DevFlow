import React from "react";

import Link from "next/link";
import { notFound } from "next/navigation";

import dayjs from "dayjs";

import {
  getUserAnswers,
  getUserProfile,
  getUserQuestions,
  getUserTopTags,
} from "@/lib/actions/user.actions";
import { auth } from "@/lib/auth";

import AnswerCard from "@/components/layout/answers/AnswerCard";
import QuestionCard from "@/components/layout/cards/QuestionCard";
import Pagination from "@/components/layout/Pagination";
import Stats from "@/components/layout/search/Stats";
import ProfileLink from "@/components/layout/user/ProfileLink";
import { Button } from "@/components/ui/button";
import DataRenderer from "@/components/ui/DataRenderer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserAvatar from "@/components/ui/UserAvatar";

import { STATES } from "@/constants/states";
import TagCard from "@/components/layout/cards/TagCard";

async function Profile({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page: string; pageSize: string }>;
}) {
  const { id } = await params;

  const { page = 1, pageSize = 10 } = await searchParams;

  if (!id) notFound();

  const loggedInUser = await auth();
  const {
    data: userProfile,
    success: userProfileSuccess,
    error: userProfileError,
  } = await getUserProfile({ userId: id });

  const {
    data: userAnswers,
    success: userAnswersSuccess,
    error: userAnswersError,
  } = await getUserAnswers({
    userId: id,
    page: Number(page),
    pageSize: Number(pageSize),
  });

  if (!userProfileSuccess || !userAnswersSuccess)
    return (
      <div>
        <div className="h1-bold text-dark100_light900">
          {userProfileError?.message}
        </div>
      </div>
    );

  const { user, totalQuestions, totalAnswers } = userProfile!;

  const {
    _id,
    name,
    username,
    image,
    bio,
    location,
    portfolio,
    reputation,
    createdAt,
  } = user;

  const {
    data: userQuestions,
    success: userQuestionsSuccess,
    error: userQuestionsError,
  } = await getUserQuestions({
    userId: id,
    page: Number(page),
    pageSize: Number(pageSize),
  });

  const {
    data: userTopTags,
    success: userTopTagsSuccess,
    error: userTopTagsError,
  } = await getUserTopTags({
    userId: id,
    page: Number(page),
    pageSize: Number(pageSize),
  });

  const { tags } = userTopTags!;

  return (
    <>
      <section className="flex flex-col-reverse items-start justify-between sm:flex-row">
        <div className="flex flex-col items-start gap-4 lg:flex-row">
          <UserAvatar
            userId={_id}
            name={name}
            imageUrl={image}
            className="size-36 rounded-full object-cover"
            fallbackClassName=" text-6xl font-bold"
            size={140}
          />
          <div className="mt-3">
            <h2 className="h2-bold text-dark100_light900">{name}</h2>
            <p className="paragraph-regular text-dark200_light800">
              @{username}
            </p>

            <div className="mt-5 flex flex-wrap items-center justify-start gap-5">
              {portfolio && (
                <ProfileLink
                  title={portfolio}
                  href={portfolio}
                  imageUrl="/icons/link.svg"
                />
              )}
              {location && (
                <ProfileLink title={location} imageUrl="/icons/location.svg" />
              )}
              <ProfileLink
                title={dayjs(createdAt).format("MMMM YYYY")}
                imageUrl="/icons/calendar.svg"
              />
            </div>

            {bio && (
              <p className="paragraph-regular text-dark400_light800 mt-8">
                {bio}
              </p>
            )}
          </div>

          <div className="flex justify-end max-sm:mb-5 max-sm:w-full sm:mt-3">
            {loggedInUser?.user?.id === id && (
              <Link href={`/profile/edit`}>
                <Button className="btn-secondary paragraph-medium text-dark300_light900 min-h-12 min-w-44 px-4 py-3">
                  Edit Profile
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>
      <Stats
        totalQuestions={totalQuestions}
        totalAnswers={totalAnswers}
        badges={{
          GOLD: 0,
          SILVER: 0,
          BRONZE: 0,
        }}
      />

      <section className="mt-10 flex gap-10">
        <Tabs defaultValue="top-posts" className="flex-[2]">
          <TabsList className="min-h-[42px] p-1">
            <TabsTrigger value="top-posts" className="tab">
              Top Posts
            </TabsTrigger>
            <TabsTrigger value="top-answers" className="tab">
              Top Answers
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="top-posts"
            className="mt-5 flex w-full flex-col gap-6"
          >
            <DataRenderer
              empty={STATES.DEFAULT_EMPTY}
              success={userQuestionsSuccess}
              error={userQuestionsError}
              data={userQuestions?.questions}
              render={(questions) => (
                <div className="flex flex-col gap-6">
                  {questions.map((question) => (
                    <QuestionCard key={question._id} question={question} />
                  ))}
                </div>
              )}
            />

            <Pagination
              page={Number(page)}
              isNext={userQuestions?.isNext || false}
            />
          </TabsContent>
          <TabsContent
            value="top-answers"
            className="mt-5 flex w-full flex-col gap-6"
          >
            <DataRenderer
              empty={STATES.DEFAULT_EMPTY}
              success={userAnswersSuccess}
              error={userAnswersError}
              data={userAnswers?.answers}
              render={(answers) => (
                <div className="flex flex-col gap-6">
                  {answers.map((answer) => (
                    <AnswerCard key={answer._id} {...answer} />
                  ))}
                </div>
              )}
            />
            <Pagination
              page={Number(page)}
              isNext={userAnswers?.isNext || false}
            />
          </TabsContent>
        </Tabs>

        <div className="flex w-full min-w-[250px] flex-1 flex-col max-lg:hidden">
          <h3 className="h3-bold text-dark200_light900">Top Tags</h3>
          <div className="mt-7 flex flex-col gap-4">
            <DataRenderer
              empty={STATES.DEFAULT_EMPTY}
              success={userTopTagsSuccess}
              error={userTopTagsError}
              data={tags}
              render={(tags) => (
                <div className="flex flex-col gap-6">
                  {tags.map((tag) => (
                    <TagCard key={tag._id} {...tag} compact showCount />
                  ))}
                </div>
              )}
            />
          </div>
        </div>
      </section>
    </>
  );
}

export default Profile;
