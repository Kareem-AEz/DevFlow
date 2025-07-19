import React from "react";

import Image from "next/image";
import Link from "next/link";

interface ProfileLinkProps {
  title: string;
  href?: string;
  imageUrl: string;
}

const ProfileLink = ({ title, href, imageUrl }: ProfileLinkProps) => {
  return (
    <div className="flex-center gap-1">
      <Image
        src={imageUrl}
        alt={title}
        width={20}
        height={20}
        className="size-5 object-contain"
      />

      {href ? (
        <Link
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="paragraph-medium text-link-100"
        >
          {title}
        </Link>
      ) : (
        <p className="paragraph-medium text-dark400_light700">{title}</p>
      )}
    </div>
  );
};

export default ProfileLink;
