"use client";

import React from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { toast } from "sonner";

import { deleteAnswer } from "@/lib/actions/answer.actions";
import { deleteQuestion } from "@/lib/actions/question.action";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { ROUTES } from "@/constants/routes";

interface Props {
  type: "question" | "answer";
  id: string;
}

const EditDeleteAction = ({ type, id }: Props) => {
  const router = useRouter();
  const handleEdit = async () => {
    router.push(ROUTES.EDIT_QUESTION(id));
  };

  const handleDelete = async () => {
    if (type === "question") {
      await deleteQuestion({ questionId: id });
      toast.success("Question deleted successfully");
    } else if (type === "answer") {
      await deleteAnswer({ answerId: id });
      toast.success("Answer deleted successfully");
    }
  };

  return (
    <div
      className={`flex items-center justify-end gap-3 max-sm:w-full ${
        type === "answer" && "justify-center gap-0"
      }`}
    >
      {type === "question" && (
        <Image
          src={"/icons/edit.svg"}
          alt="edit"
          width={14}
          height={14}
          className="cursor-pointer object-contain"
          onClick={handleEdit}
        />
      )}

      <AlertDialog>
        <AlertDialogTrigger className="cursor-pointer">
          <Image
            src={"/icons/trash.svg"}
            alt="delete"
            width={14}
            height={14}
            className="cursor-pointer object-contain"
          />
        </AlertDialogTrigger>
        <AlertDialogContent className="background-light800_dark300">
          <AlertDialogHeader>
            <AlertDialogTitle className="h3-semibold text-dark200_light900">
              Delete {type}
            </AlertDialogTitle>
            <AlertDialogDescription className="body-regular text-dark500_light700">
              Are you sure you want to delete this {type}? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="btn">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-primary-500 text-dark-100 hover:bg-primary-500/90"
              onClick={handleDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default EditDeleteAction;
