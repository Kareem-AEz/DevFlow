"use client";

import React, { useEffect, useState } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import { AnimatePresence, motion } from "framer-motion";
import { CheckIcon } from "lucide-react";

import { formUrlQuery, removeUrlQueryParams } from "@/lib/url";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";

const MotionButton = motion(Button);

const filters = [
  {
    label: "All",
    value: "all",
  },
  {
    label: "Newest",
    value: "newest",
  },
  {
    label: "Popular",
    value: "popular",
  },
  {
    label: "Unanswered",
    value: "unanswered",
  },
  {
    label: "Recommended",
    value: "recommended",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07,
    },
  },
};

const buttonVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3,
    },
  },
};

const HomeFilter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const paramFilter = searchParams.get("filter") || "all";
  const [selectedFilter, setSelectedFilter] = useState(paramFilter);

  // Keep filter state in sync with URL when navigation occurs
  useEffect(() => {
    const currentFilter = searchParams.get("filter") || "all";
    setSelectedFilter(currentFilter);
  }, [searchParams]);

  const handleFilterChange = (value: string) => {
    if (value === selectedFilter) return;
    let newUrl = "/";

    if (value === "all") {
      newUrl = removeUrlQueryParams({
        params: searchParams.toString(),
        keys: ["filter"],
      });
    } else {
      newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "filter",
        value: value.toLowerCase(),
      });
    }

    router.push(newUrl, { scroll: false });
  };

  return (
    <motion.div
      className="mt-10 hidden flex-wrap items-center gap-2 sm:flex"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {filters.map((filter) => {
        const isSelected = selectedFilter === filter.value;

        return (
          <MotionButton
            key={filter.value}
            layout
            variants={buttonVariants}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 24,
            }}
            className={cn(
              "body-medium overflow-hidden rounded-lg px-6 py-3 capitalize shadow-none transition-colors will-change-transform",
              isSelected
                ? "bg-primary-100 text-primary-500 hover:bg-primary-100 dark:bg-dark-400 dark:text-primary-500 dark:hover:bg-dark-400"
                : "bg-light-800 text-light-500 hover:bg-light-800 dark:bg-dark-300 dark:text-light-800 dark:hover:bg-dark-300",
            )}
            onClick={() => handleFilterChange(filter.value)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.span
              layout
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 24,
                mass: 1.4,
              }}
            >
              {filter.label}
            </motion.span>
            <AnimatePresence mode="popLayout">
              {isSelected && (
                <motion.span
                  key={`${filter.value}-indicator`}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 24,
                  }}
                  className="ml-2"
                >
                  <CheckIcon className="aspect-square size-4" />
                </motion.span>
              )}
            </AnimatePresence>
          </MotionButton>
        );
      })}
    </motion.div>
  );
};

export default HomeFilter;
