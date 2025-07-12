import React from "react";

import { notFound, redirect } from "next/navigation";

import { getQuestion } from "@/lib/actions/question.action";
import { auth } from "@/lib/auth";

import QuestionForm from "@/components/layout/forms/QuestionForm";

import { Params } from "@/types/global";

async function EditQuestion({ params }: { params: Params }) {
  const { id } = await params;
  if (!id) return notFound();

  const session = await auth();
  if (!session?.user) return redirect("/sign-in");

  const { data: question, success } = await getQuestion({
    params: { questionId: id },
  });

  if (!success || !question) return notFound();

  return <QuestionForm question={question} isEdit />;
}

export default EditQuestion;
