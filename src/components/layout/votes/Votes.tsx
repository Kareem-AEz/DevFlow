"use client";

import React, { startTransition, use, useOptimistic } from "react";

import Image from "next/image";
import { useSession } from "next-auth/react";

import { toast } from "sonner";

import { createVote } from "@/lib/actions/vote.action";
import { formatNumber } from "@/lib/utils";
import { HasVotedResponseType } from "@/lib/validations";

import { ActionResponse } from "@/types/global";

interface Props {
  upvotes: number;
  downvotes: number;
  targetId: string;
  targetType: "question" | "answer";
  hasVotedPromise: Promise<ActionResponse<HasVotedResponseType>>;
}

const Votes = ({
  upvotes,
  downvotes,
  targetId,
  targetType,
  hasVotedPromise,
}: Props) => {
  const session = useSession();
  const user = session.data?.user?.id;

  const { success: hasVotedSuccess, data: hasVotedData } = use(hasVotedPromise);
  const { hasDownvoted, hasUpvoted } = hasVotedData || {};

  const votingState = {
    upvotes,
    downvotes,
    hasUpvoted,
    hasDownvoted,
  };

  // 🎯 Alternative approach: Using useOptimistic directly with server actions
  // This would replace the current useOptimistic + startTransition pattern
  /*
  const [optimisticVotes, voteAction] = useOptimistic(
    votingState,
    (state, formData: FormData) => {
      const action = formData.get("action") as "upvote" | "downvote";
      
      switch (action) {
        case "upvote":
          return {
            ...state,
            upvotes: state.hasUpvoted ? state.upvotes - 1 : state.upvotes + 1,
            hasUpvoted: !state.hasUpvoted,
          };
        case "downvote":
          return {
            ...state,
            downvotes: state.hasDownvoted ? state.downvotes - 1 : state.downvotes + 1,
            hasDownvoted: !state.hasDownvoted,
          };
      }
    }
  );

  // Server action that would be called directly
  const handleVoteAction = async (formData: FormData) => {
    const action = formData.get("action") as "upvote" | "downvote";
    
    if (!user) {
      toast.error("Please sign in to vote!");
      return;
    }

    const result = await createVote({
      targetId,
      targetType,
      voteType: action,
    });

    if (!result.success) {
      toast.error("Vote failed!");
    } else {
      toast.success("Vote recorded!");
    }
  };

  // Usage in JSX would be:
  // <form action={voteAction}>
  //   <input type="hidden" name="action" value="upvote" />
  //   <button type="submit">Upvote</button>
  // </form>
  */

  const [optimisticVotes, setOptimisticVotes] = useOptimistic(
    votingState,
    (state, action: "upvote" | "downvote") => {
      switch (action) {
        case "upvote":
          return {
            ...state,
            upvotes: state.hasUpvoted ? state.upvotes - 1 : state.upvotes + 1,
            hasUpvoted: !state.hasUpvoted,

            downvotes: state.hasDownvoted
              ? state.downvotes - 1
              : state.downvotes,
            hasDownvoted: false,
          };
        case "downvote":
          return {
            ...state,
            downvotes: state.hasDownvoted
              ? state.downvotes - 1
              : state.downvotes + 1,
            hasDownvoted: !state.hasDownvoted,

            upvotes: state.hasUpvoted ? state.upvotes - 1 : state.upvotes,
            hasUpvoted: false,
          };
      }
    },
  );

  //
  //
  //
  //
  // Handle Vote
  const handleVote = async (type: "upvote" | "downvote") => {
    if (!user)
      return toast.error("Hold up there, anonymous voter!", {
        description:
          "Even democracy needs ID verification - please sign in to cast your vote!",
      });

    try {
      startTransition(() => {
        setOptimisticVotes(type);
      });

      const result = await createVote({
        targetId,
        targetType,
        voteType: type,
      });

      if (!result.success) {
        return toast.error("Oops! The vote gremlins struck again!", {
          description:
            result.error?.message ||
            "Your vote got lost in the digital mail. Give it another shot!",
        });
      }

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
    }
  };

  return (
    <div className="flex-center gap-2.5">
      <div className="flex-center gap-1.5">
        <Image
          src={
            optimisticVotes.hasUpvoted
              ? "/icons/upvoted.svg"
              : "/icons/upvote.svg"
          }
          alt="upvote"
          width={18}
          height={18}
          className={`cursor-pointer`}
          aria-label="upvote"
          onClick={() => handleVote("upvote")}
        />
        <div className="flex-center background-light700_dark400 min-w-5 rounded-sm p-1">
          <p className="subtle-medium text-dark400_light900">
            {formatNumber(optimisticVotes.upvotes)}
          </p>
        </div>
      </div>

      <div className="flex-center gap-1.5">
        <Image
          src={
            optimisticVotes.hasDownvoted
              ? "/icons/downvoted.svg"
              : "/icons/downvote.svg"
          }
          alt="downvote"
          width={18}
          height={18}
          className={`cursor-pointer`}
          aria-label="downvote"
          onClick={() => handleVote("downvote")}
        />
        <div className="flex-center background-light700_dark400 min-w-5 rounded-sm p-1">
          <p className="subtle-medium text-dark400_light900">
            {formatNumber(optimisticVotes.downvotes)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Votes;
