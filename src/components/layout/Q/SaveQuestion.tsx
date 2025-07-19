"use client";

import React, { startTransition, use, useOptimistic } from "react";

import Image from "next/image";
import { useSession } from "next-auth/react";

import { toast } from "sonner";

import { toggleSaveQuestion } from "@/lib/actions/collection.action";

import { ActionResponse } from "@/types/global";

const SaveQuestion = ({
  questionId,
  hasSavedQuestion,
}: {
  questionId: string;
  hasSavedQuestion: Promise<ActionResponse<{ saved: boolean }>>;
}) => {
  const session = useSession();
  const user = session.data?.user?.id;

  const handleSave = async () => {
    if (!user) {
      return toast.error("You must be logged in to save a question");
    }

    startTransition(() => {
      saveAction(optimisticSaved);
    });

    try {
      const { success, data } = await toggleSaveQuestion({
        questionId,
      });

      if (success) {
        toast.success(data?.saved ? "Question saved" : "Question removed");
      }
    } catch (error) {
      toast.error("Something went wrong", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  const { data: hasSavedData } = use(hasSavedQuestion);
  const { saved } = hasSavedData || {};

  const [optimisticSaved, saveAction] = useOptimistic(saved, (state) => !state);

  return (
    <Image
      src={optimisticSaved ? "/icons/star-filled.svg" : "/icons/star.svg"}
      alt="star"
      width={20}
      height={20}
      className={`size-5 cursor-pointer`}
      onClick={handleSave}
    />
  );
};

export default SaveQuestion;
