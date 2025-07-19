import React from "react";

import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import { ROUTES } from "@/constants/routes";

interface Props {
  userId: string;
  name: string;
  imageUrl?: string | null;
  className?: string;
  fallbackClassName?: string;
  size?: number;
}

const UserAvatar = ({
  userId,
  name,
  imageUrl,
  className = "h-9 w-9",
  fallbackClassName,
  size = 36,
}: Props) => {
  const initials = name
    .split(" ")
    .map((word: string) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Link href={ROUTES.PROFILE(userId)}>
      <Avatar className={cn("relative", className)}>
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            className="w-full object-cover"
            width={size}
            height={size}
            quality={100}
          />
        ) : (
          <AvatarFallback
            className={cn(
              "primary-gradient font-space-grotesk font-bold tracking-wider text-white",
              fallbackClassName,
            )}
          >
            {initials}
          </AvatarFallback>
        )}
      </Avatar>
    </Link>
  );
};

export default UserAvatar;
