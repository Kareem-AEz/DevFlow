import React from "react";

import Link from "next/link";

import { UserIcon } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { ROUTES } from "@/constants/routes";
const UserAvatar = ({
  userId,
  name,
  image,
  className = "size-9",
}: {
  userId: string;
  name: string;
  image: string;
  className?: string;
}) => {
  return (
    <Link href={ROUTES.PROFILE(userId ?? "")}>
      <Avatar className={className}>
        <AvatarImage src={image} alt={name ?? "User Avatar"} />
        <AvatarFallback className="bg-primary-500">
          <UserIcon className="size-4" />
        </AvatarFallback>
      </Avatar>
    </Link>
  );
};

export default UserAvatar;
