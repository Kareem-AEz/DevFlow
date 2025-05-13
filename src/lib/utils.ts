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
