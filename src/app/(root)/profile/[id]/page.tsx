import React from "react";

import Link from "next/link";
import { notFound } from "next/navigation";

import dayjs from "dayjs";

import { getUserProfile } from "@/lib/actions/user.actions";
import { auth } from "@/lib/auth";

import Stats from "@/components/layout/search/Stats";
import ProfileLink from "@/components/layout/user/ProfileLink";
import { Button } from "@/components/ui/button";
import UserAvatar from "@/components/ui/UserAvatar";

async function Profile({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  if (!id) notFound();

  const loggedInUser = await auth();
  const {
    data: userProfile,
    success: userProfileSuccess,
    error: userProfileError,
  } = await getUserProfile({ userId: id });

  if (!userProfileSuccess)
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
    </>
  );
}

export default Profile;
