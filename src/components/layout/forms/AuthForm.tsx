"use client";

import React from "react";
import {
  DefaultValues,
  FieldValues,
  Path,
  SubmitHandler,
  useForm,
} from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface Field<T> {
  name: keyof T;
  label: string;
  type: React.HTMLInputTypeAttribute;
  defaultValue: T[keyof T];
}

interface AuthFormProps<T extends FieldValues> {
  schema: z.ZodType<T>;
  fields: Field<T>[];
  buttonText: {
    default: string;
    loading: string;
  };
  onSubmit: (data: T) => Promise<{ success: boolean }>;
}

export default function AuthForm<T extends FieldValues>({
  schema,
  fields,
  buttonText,
  onSubmit,
}: AuthFormProps<T>) {
  // 1. Define your form.
  const form = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues: fields.reduce(
      (acc, field) => ({ ...acc, [field.name]: field.defaultValue }),
      {} as DefaultValues<T>,
    ),
  });

  const handleSubmit: SubmitHandler<T> = async () => {};

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-10 space-y-5">
        {fields.map((formField) => (
          <FormField
            key={formField.name as string}
            control={form.control}
            name={formField.name as Path<T>}
            render={({ field }) => (
              <FormItem className="flex w-full flex-col gap-2">
                <FormLabel className="paragraph-medium text-dark400_light700">
                  {formField.label}
                </FormLabel>
                <FormControl>
                  <Input
                    type={formField.type}
                    {...field}
                    className="paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 rounded-1.5 min-h-12 border"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
        <Button
          className="primary-gradient paragraph-medium rounded-2 text-light-900 min-h-12 w-full px-4 py-3"
          disabled={form.formState.isSubmitting}
          type="submit"
        >
          {form.formState.isSubmitting
            ? buttonText.loading
            : buttonText.default}
        </Button>
      </form>
    </Form>
  );
}
