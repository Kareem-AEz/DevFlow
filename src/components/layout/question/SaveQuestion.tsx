"use client";

import React from "react";

import Image from "next/image";
import { useSession } from "next-auth/react";

import { toast } from "sonner";

import { toggleSaveQuestion } from "@/lib/actions/collection.action";

const SaveQuestion = ({ questionId }: { questionId: string }) => {
  const session = useSession();
  const user = session.data?.user?.id;

  const handleSave = async () => {
    if (!user) {
      return toast.error("You must be logged in to save a question");
    }

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

  const hasSaved = false;

  return (
    <Image
      src={hasSaved ? "/icons/star-filled.svg" : "/icons/star.svg"}
      alt="star"
      width={20}
      height={20}
      className="cursor-pointer"
      onClick={handleSave}
    />
  );
};

export default SaveQuestion;
