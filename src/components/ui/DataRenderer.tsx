import React from "react";

import Image from "next/image";
import Link from "next/link";

import { Button } from "./button";

import { STATES } from "@/constants/states";

interface Props<T> {
  success: boolean;
  error?: {
    message: string;
    details?: Record<string, string[]>;
  };
  data?: T[] | null | undefined;
  empty: typeof STATES.DEFAULT_EMPTY;
  render: (data: T[]) => React.ReactNode;
}

interface StateSkeletonProps {
  image: {
    light: string;
    dark: string;
    alt: string;
  };
  title: string;
  message: string;
  button?: { text: string; href: string };
}

function StateSkeleton({ image, title, message, button }: StateSkeletonProps) {
  return (
    <div className="mt-16 flex w-full flex-col items-center justify-center sm:mt-36">
      <>
        <Image
          src={image.dark}
          alt={image.alt}
          width={270}
          height={200}
          className="hidden object-contain dark:block"
        />
        <Image
          src={image.light}
          alt={image.alt}
          width={270}
          height={200}
          className="block object-contain dark:hidden"
        />
      </>

      <h2 className="h2-bold text-dark200_light900 mt-8">{title}</h2>

      <p className="body-regular text-dark500_light700 my-3.5 max-w-md text-center">
        {message}
      </p>

      {button && (
        <Link href={button.href}>
          <Button className="primary-gradient paragraph-medium text-light-900 mt-5 rounded-lg px-4 py-3">
            {button.text}
          </Button>
        </Link>
      )}
    </div>
  );
}

function DataRenderer<T>({
  success,
  error,
  data,
  empty = STATES.DEFAULT_EMPTY,
  render,
}: Props<T>) {
  if (!success) {
    return (
      <StateSkeleton
        image={{
          light: "/images/light-error.png",
          dark: "/images/dark-error.png",
          alt: "Error state illustration",
        }}
        title={error?.message || STATES.DEFAULT_ERROR.title}
        message={
          error?.details
            ? JSON.stringify(error.details, null, 2)
            : STATES.DEFAULT_ERROR.message
        }
        button={STATES.DEFAULT_ERROR.button}
      />
    );
  }

  if (!data || data.length === 0) {
    return (
      <StateSkeleton
        image={{
          light: "/images/light-illustration.png",
          dark: "/images/dark-illustration.png",
          alt: "Empty state illustration",
        }}
        title={empty.title}
        message={empty.message}
        button={empty.button}
      />
    );
  }

  return <div className="mt-10 flex w-full flex-col gap-6">{render(data)}</div>;
}

export default DataRenderer;
