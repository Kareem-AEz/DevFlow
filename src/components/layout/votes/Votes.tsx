"use client";

import React, { useState } from "react";

import Image from "next/image";
import { useSession } from "next-auth/react";

import { toast } from "sonner";

import { formatNumber } from "@/lib/utils";

interface Props {
  upvotes: number;
  downvotes: number;
  hasUpvoted: boolean;
  hasDownvoted: boolean;
}

const Votes = ({ upvotes, downvotes, hasUpvoted, hasDownvoted }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const session = useSession();
  const user = session.data?.user?.id;

  const handleVote = async (type: "upvote" | "downvote") => {
    if (!user)
      return toast.error("Hold up there, anonymous voter!", {
        description:
          "Even democracy needs ID verification - please sign in to cast your vote!",
      });

    try {
      setIsLoading(true);

      const successMessage =
        type === "upvote"
          ? `Upvote ${!hasUpvoted ? "added" : "removed"} successfully`
          : `Downvote ${!hasDownvoted ? "added" : "removed"} successfully`;

      toast.success(successMessage, {
        description: "Thank you for your contribution!",
      });

      //
    } catch {
      toast.error("Oops! The vote gremlins struck again!", {
        description:
          "Your vote got lost in the digital mail. Give it another shot!",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-center gap-2.5">
      <div className="flex-center gap-1.5">
        <Image
          src={hasUpvoted ? "/icons/upvoted.svg" : "/icons/upvote.svg"}
          alt="upvote"
          width={18}
          height={18}
          className={`cursor-pointer ${isLoading && "opacity-50"}`}
          aria-label="upvote"
          onClick={() => !isLoading && handleVote("upvote")}
        />
        <div className="flex-center background-light700_dark400 min-w-5 rounded-sm p-1">
          <p className="subtle-medium text-dark400_light900">
            {formatNumber(upvotes)}
          </p>
        </div>
      </div>

      <div className="flex-center gap-1.5">
        <Image
          src={hasDownvoted ? "/icons/downvoted.svg" : "/icons/downvote.svg"}
          alt="downvote"
          width={18}
          height={18}
          className={`cursor-pointer ${isLoading && "opacity-50"}`}
          aria-label="downvote"
          onClick={() => !isLoading && handleVote("downvote")}
        />
        <div className="flex-center background-light700_dark400 min-w-5 rounded-sm p-1">
          <p className="subtle-medium text-dark400_light900">
            {formatNumber(downvotes)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Votes;
