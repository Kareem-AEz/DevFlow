import React from "react";

import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

interface MetricProps {
  imgUrl: string;
  alt: string;
  value: string | number;
  title: string;
  href?: string;
  textStyles?: string;
  isAuthor?: boolean;
  imgStyles?: string;
}

const Metric = ({
  imgUrl,
  alt,
  value,
  title,
  href,
  textStyles,
  isAuthor,
  imgStyles,
}: MetricProps) => {
  const metricContent = (
    <>
      <Image
        src={imgUrl}
        alt={alt}
        width={isAuthor ? 24 : 12}
        height={isAuthor ? 24 : 12}
        className={cn(
          `rounded-full object-contain ${isAuthor ? "size-6" : ""}`,
          imgStyles,
        )}
      />
      <p className={cn("flex items-center gap-1", textStyles)}>
        {value}
        <span
          className={`small-regular line-clamp-1 ${
            isAuthor ? `max-sm:hidden` : ""
          }`}
        >
          {title}
        </span>
      </p>
    </>
  );

  return href ? (
    <Link href={href} className="flex-center gap-1">
      {metricContent}
    </Link>
  ) : (
    <div className="flex-center gap-1">{metricContent}</div>
  );
};

export default Metric;
