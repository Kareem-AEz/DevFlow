"use client";

import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";

import Image from "next/image";
import { useSession } from "next-auth/react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import z from "zod";

import { createAnswer } from "@/lib/actions/answer.actions";
import { api } from "@/lib/api";
import { AnswerSchema } from "@/lib/validations";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import Editor from "../editor/Editor";

interface AnswerFormProps {
  questionId: string;
  questionTitle: string;
  questionContent: string;
}

function AnswerForm({
  questionId,
  questionTitle,
  questionContent,
}: AnswerFormProps) {
  const [isAnswering, startTransition] = useTransition();
  const [isAISubmitting, setIsAISubmitting] = useState(false);
  const { data: session } = useSession();

  // 1. Define your form.
  const form = useForm<z.infer<typeof AnswerSchema>>({
    resolver: zodResolver(AnswerSchema),
    defaultValues: {
      content: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof AnswerSchema>) {
    startTransition(async () => {
      const { success, error } = await createAnswer({
        questionId,
        content: values.content,
      });

      if (success) {
        form.reset();
        toast.success("Answer created successfully");
      } else {
        toast.error(error?.message);
      }
    });
  }

  async function generateAnswer() {
    if (!session?.user) {
      toast.error("Please login to generate an answer");
      return;
    }

    setIsAISubmitting(true);

    try {
      const userAnswer = form.getValues("content");

      const { success, data } = await api.ai.answers(
        questionTitle,
        questionContent,
        userAnswer,
      );

      if (!success) {
        // 🚨 AI failed to deliver the goods! Let's let the user know with a little humor.
        toast.error("Error generating answer", {
          description:
            "Looks like our AI took a coffee break. Try again in a moment!",
        });
        return;
      }

      if (data?.text) {
        const formattedAnswer = data.text
          .toString()
          .replace(/<br>/g, "\n") // Use newlines instead of spaces for better formatting
          .trim();

        // ✨ Set the generated content to the form field
        form.reset();
        form.setValue("content", formattedAnswer);
        form.trigger("content");

        toast.success("AI answer generated successfully!");
      } else {
        toast.error("No content received from AI");
      }
    } catch (error) {
      toast.error("Something went wrong", {
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
      });
    } finally {
      setIsAISubmitting(false);
    }
  }

  return (
    <div>
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
        <h4 className="paragraph-semibold text-dark400_light800">
          Write your answer here
        </h4>
        <Button
          className="btn light-border-2 text-primary-500 dark:text-primary-500 gap-1.5 rounded-md border px-4 py-2.5 shadow-none"
          disabled={isAISubmitting}
          onClick={() => generateAnswer()}
        >
          {isAISubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              <span>Generating...</span>
            </>
          ) : (
            <Image
              src={"/icons/stars.svg"}
              alt="Generate AI Answer"
              width={12}
              height={12}
              className="object-contain"
            />
          )}
        </Button>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mt-6 flex w-full flex-col gap-10"
        >
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col gap-3">
                <FormLabel>Content</FormLabel>
                <FormControl className="mt-3.5">
                  <Editor {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <Button type="submit" className="primary-gradient w-fit">
              {isAnswering ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                "Submit"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default AnswerForm;
