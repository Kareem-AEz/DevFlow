import React from "react";

import Link from "next/link";

import { cn } from "@/lib/utils";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { ROUTES } from "@/constants/routes";

interface Props {
  userId: string;
  name: string;
  imageUrl?: string | null;
  className?: string;
  fallbackClassName?: string;
}

const UserAvatar = ({
  userId,
  name,
  imageUrl,
  className = "h-9 w-9",
  fallbackClassName,
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
        {imageUrl && (
          <AvatarImage
            src={imageUrl}
            alt={name}
            className="w-full object-cover"
          />
        )}
        <AvatarFallback
          className={cn(
            "primary-gradient font-space-grotesk font-bold tracking-wider text-white",
            fallbackClassName,
          )}
        >
          {initials}
        </AvatarFallback>
      </Avatar>
    </Link>
  );
};

export default UserAvatar;
