import React from "react";

import Image from "next/image";
import Link from "next/link";

import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";

import { cn } from "@/lib/utils";

interface Props {
  imgUrl: string;
  alt: string;
  value: string | number;
  title: string;
  href?: string;
  textStyles: string;
  imgStyles?: string;
  isAuthor?: boolean;
  titleStyles?: string;
}

const Metric = ({
  imgUrl,
  alt,
  value,
  title,
  href,
  textStyles,
  imgStyles,
  titleStyles,
}: Props) => {
  const metricContent = (
    <>
      <Avatar className={cn("relative", imgStyles)}>
        {imgUrl ? (
          <Image
            src={imgUrl}
            alt={alt}
            className="w-full object-cover"
            width={16}
            height={16}
            quality={100}
          />
        ) : (
          <AvatarFallback
            className={cn(
              "primary-gradient font-space-grotesk rounded-full font-bold tracking-wider text-white",
            )}
          >
            {alt
              .split(" ")
              .map((word) => word[0])
              .join("")
              .toUpperCase()}
          </AvatarFallback>
        )}
      </Avatar>

      <p className={`${textStyles} flex items-center gap-1`}>
        {value}

        {title ? (
          <span className={cn(`small-regular line-clamp-1`, titleStyles)}>
            {title}
          </span>
        ) : null}
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
