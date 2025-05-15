import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import { techMap } from "@/constants/DevIconTechMap";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getDevIconClassName = (techName: string) => {
  const normalizedTechName = techName.replaceAll(/[ .-]/g, "").toLowerCase();

  if (normalizedTechName in techMap) {
    return `${techMap[normalizedTechName]} colored`;
  } else {
    return `devicon-devicon-plain`;
  }
};

export const getTimestamp = (date: Date): string => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  // Convert time differences to appropriate units
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  // Return appropriate string based on time difference
  if (years > 0) {
    return `${years} year${years === 1 ? "" : "s"} ago`;
  } else if (months > 0) {
    return `${months} month${months === 1 ? "" : "s"} ago`;
  } else if (days > 0) {
    return `${days} day${days === 1 ? "" : "s"} ago`;
  } else if (hours > 0) {
    return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  } else if (minutes > 0) {
    return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  } else if (seconds > 30) {
    return `${seconds} second${seconds === 1 ? "" : "s"} ago`;
  } else {
    return "just now";
  }
};
