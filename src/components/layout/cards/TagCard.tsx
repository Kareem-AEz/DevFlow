import React from "react";

import Link from "next/link";

import { getDevIconClassName } from "@/lib/utils";

import { Badge } from "@/components/ui/badge";

import { ROUTES } from "@/constants/routes";

interface TagCardProps {
  name: string;
  questions: number;
  showCount?: boolean;
  compact?: boolean;
}

function TagCard({ name, questions, showCount, compact }: TagCardProps) {
  const devIconClassName = getDevIconClassName(name);

  return (
    <Link href={ROUTES.TAGS(name)} className="flex justify-between gap-2">
      <Badge className="subtle-medium background-light800_dark300 text-light400_light500 rounded-md border-none px-4 py-2 uppercase">
        <div className="flex-center space-x-2">
          {!compact && <i className={`${devIconClassName} text-base`} />}
          <span>{name}</span>
        </div>
      </Badge>

      {showCount && (
        <p className="small-medium text-dark500_light700">{questions}</p>
      )}
    </Link>
  );
}

export default TagCard;
