"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { z } from "zod";

import { createQuestion, editQuestion } from "@/lib/actions/question.action";
import { AskQuestionSchema } from "@/lib/validations";

import Editor from "@/components/layout/editor/Editor";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import TagCard from "../cards/TagCard";

import { ROUTES } from "@/constants/routes";
import { Question } from "@/types/global";

const MotionTagCard = motion.create(TagCard);

type QuestionFormProps =
  | {
      isEdit: false;
      question?: never;
    }
  | {
      isEdit: true;
      question: Question;
    };

const QuestionForm = ({ isEdit = false, question }: QuestionFormProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof AskQuestionSchema>>({
    resolver: zodResolver(AskQuestionSchema),
    defaultValues: {
      title: question?.title || "",
      content: question?.content || "",
      tags: question?.tags.map((tag) => tag.name) || [],
    },
  });

  function handleInputKeyDown(
    e: React.KeyboardEvent<HTMLInputElement>,
    field: {
      value: string[];
    },
  ) {
    if (e.key === "Enter") {
      e.preventDefault();
      const tagInput = e.currentTarget.value.trim();

      if (tagInput.length < 3) {
        form.setError("tags", {
          type: "manual",
          message: "Tag must be at least 3 characters",
        });
      } else if (tagInput.length > 30) {
        form.setError("tags", {
          type: "manual",
          message: "Tag must be less than 30 characters",
        });
      } else if (field.value.includes(tagInput)) {
        form.setError("tags", {
          type: "manual",
          message: "Tag already exists",
        });
      } else {
        form.setValue("tags", [...field.value, tagInput]);
        e.currentTarget.value = "";
        form.clearErrors("tags");
      }
    }
  }

  function handleRemoveTag(tag: string, field: { value: string[] }) {
    const newTags = field.value.filter((t) => t !== tag);
    form.setValue("tags", newTags);

    if (newTags.length === 0) {
      form.setError("tags", {
        type: "manual",
        message: "Tags are required",
      });
    }
  }

  async function onSubmit(data: z.infer<typeof AskQuestionSchema>) {
    startTransition(async () => {
      const response = isEdit
        ? await editQuestion({
            params: { ...data, questionId: question?._id || "" },
          })
        : await createQuestion({ params: data });

      if (response.success) {
        if (response.data) {
          toast.success(
            isEdit
              ? "Question updated successfully"
              : "Question created successfully",
          );
          router.push(`${ROUTES.QUESTION(response.data._id)}`);
        }
      } else {
        toast.error(response.error?.message || "Something went wrong");
      }
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col gap-10"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Question Title
                <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Title"
                  {...field}
                  className="paragraph-regular background-light700_dark300 light-border-2 text-dark300_light700 min-h-14 border"
                />
              </FormControl>
              <FormDescription className="body-regular text-light-500">
                Be specific and imagine you&apos;re asking a question to another
                person.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Question Description
                <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl>
                <Editor value={field.value} onChange={field.onChange} />
              </FormControl>
              <FormDescription className="body-regular text-light-500">
                Write a detailed description of your question.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel
                htmlFor="question-tags"
                className="paragraph-semibold text-dark400_light800"
              >
                Question Tags
                <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl>
                <div className="flex flex-col items-start justify-center gap-3">
                  <Input
                    id="question-tags"
                    placeholder="Add tags"
                    className="paragraph-regular background-light700_dark300 light-border-2 text-dark300_light700 min-h-14 border"
                    onKeyDown={(e) => handleInputKeyDown(e, field)}
                  />
                  {field.value.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      <AnimatePresence initial={false} mode="popLayout">
                        {field.value.map((tag) => (
                          <MotionTagCard
                            key={tag}
                            layout
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{
                              opacity: 0,
                              scale: 0.8,
                              transition: { duration: 0.2 },
                            }}
                            transition={{
                              type: "spring",
                              duration: 0.6,
                              bounce: 0.3,
                            }}
                            _id={tag}
                            name={tag}
                            compact
                            remove
                            isButton
                            handleRemove={() => handleRemoveTag(tag, field)}
                          />
                        ))}
                      </AnimatePresence>
                    </div>
                  )}
                </div>
              </FormControl>
              <FormDescription className="body-regular text-light-500">
                Add up to 3 tags to describe what your question is about. You
                need to press enter to add a tag.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="mt-16 flex justify-end">
          <Button
            type="submit"
            className="primary-gradient !text-light-900 w-fit"
            disabled={isPending}
          >
            {isPending
              ? isEdit
                ? "Updating question..."
                : "Creating question..."
              : isEdit
                ? "Update question"
                : "Ask a question"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default QuestionForm;
