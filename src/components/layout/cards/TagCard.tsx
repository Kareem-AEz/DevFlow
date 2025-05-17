import React, { forwardRef } from "react";

import Link from "next/link";

import { getDevIconClassName } from "@/lib/utils";

import { Badge } from "@/components/ui/badge";

import { ROUTES } from "@/constants/routes";

interface TagCardProps {
  name: string;
  questions?: number;
  showCount?: boolean;
  compact?: boolean;
  handleRemove?: () => void;
  isButton?: boolean;
  remove?: boolean;
}

const TagCard = forwardRef<HTMLDivElement, TagCardProps>(
  (
    { name, questions, showCount, compact, handleRemove, isButton, remove },
    ref,
  ) => {
    const devIconClassName = getDevIconClassName(name);

    const content = (
      <>
        <Badge className="subtle-medium background-light800_dark300 text-light400_light500 rounded-md border-none px-4 py-2 uppercase">
          <div className="flex-center space-x-2">
            {!compact && (
              <i className={`${devIconClassName} size-4 text-base`} />
            )}
            <span>{name}</span>
          </div>

          {remove && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src="/icons/close.svg"
              alt="close icon"
              width={12}
              height={12}
              className="size-3 cursor-pointer object-contain invert-0 dark:invert"
            />
          )}
        </Badge>

        {showCount && (
          <p className="small-medium text-dark500_light700">{questions}</p>
        )}
      </>
    );

    return isButton ? (
      <button
        type="button"
        ref={ref as React.Ref<HTMLButtonElement>}
        className="flex cursor-pointer justify-between gap-2"
        onClick={handleRemove}
      >
        {content}
      </button>
    ) : (
      <Link href={ROUTES.TAGS(name)} className="flex justify-between gap-2">
        {content}
      </Link>
    );
  },
);

TagCard.displayName = "TagCard";

export default TagCard;
