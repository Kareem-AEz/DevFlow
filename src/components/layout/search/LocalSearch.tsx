"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { formUrlQuery, removeUrlQueryParams } from "@/lib/url";
import { cn } from "@/lib/utils";
import useKey from "@/hooks/useKey";

import { Input } from "@/components/ui/input";

interface LocalSearchProps {
  imgSrc: string;
  placeholder: string;
  route: string;
  className?: string;
  iconPosition?: "left" | "right";
}

const LocalSearch = ({
  imgSrc,
  placeholder,
  className,
  route,
  iconPosition = "left",
}: LocalSearchProps) => {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") ?? "";
  const pathname = usePathname();
  const router = useRouter();

  const inputRef = useRef<HTMLInputElement>(null);

  const [searchQuery, setSearchQuery] = useState(query ?? "");
  const [isMac, setIsMac] = useState(false);

  // Reset search state when Escape key is pressed
  useKey(
    useCallback(() => {
      setSearchQuery("");
      inputRef.current?.blur();
    }, []),
    { key: "Escape" },
  );

  // Focus on the search input when Ctrl+K is pressed
  useKey(
    useCallback((e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    }, []),
    { key: "k" },
  );

  // Sync with URL query when it changes externally
  useEffect(() => {
    setSearchQuery(query ?? "");
  }, [query]);

  // Reset search state when navigating to the same route without query params
  useEffect(() => {
    if (pathname === route && !searchParams.has("query")) {
      setSearchQuery("");
    }
  }, [pathname, route, searchParams]);

  useEffect(() => {
    setIsMac(/Mac|iPhone|iPad|iPod/i.test(navigator.platform));
  }, []);

  useEffect(() => {
    const debounceSearch = setTimeout(() => {
      if (searchQuery) {
        const newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: "query",
          value: searchQuery,
        });
        router.push(newUrl, { scroll: false });
      } else {
        if (pathname === route) {
          const newUrl = removeUrlQueryParams({
            params: searchParams.toString(),
            keys: ["query"],
          });
          router.push(newUrl, { scroll: false });
        }
      }
    }, 500);

    return () => clearTimeout(debounceSearch);
  }, [searchQuery, pathname, router, searchParams, route]);

  return (
    <div
      className={cn(
        "background-light800_darkgradient flex min-h-14 grow items-center gap-2 rounded-2xl border px-4 py-2 shadow-sm",
        className,
      )}
    >
      <div className="flex aspect-square size-6 items-center justify-center">
        <AnimatePresence mode="wait" initial={false}>
          {searchQuery ? (
            <motion.button
              key="clear-button"
              className="text-dark300_light700 hover:text-primary-500 flex size-6 items-center justify-center transition-colors"
              onClick={() => setSearchQuery("")}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", bounce: 0.4, duration: 0.5 }}
              aria-label="Clear search"
            >
              <X className="size-5" />
            </motion.button>
          ) : (
            iconPosition === "left" && (
              <motion.img
                key="search-icon"
                src={imgSrc}
                alt="search"
                width={24}
                height={24}
                className="invert-colors size-6"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: "spring", bounce: 0.4, duration: 0.5 }}
                aria-hidden="true"
              />
            )
          )}
        </AnimatePresence>
      </div>
      <Input
        type="text"
        ref={inputRef}
        placeholder={placeholder}
        value={searchQuery ?? ""}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="paragraph-regular no-focus placeholder:text-dark200_light700 text-dark400_light700 border-none !bg-transparent shadow-none outline-none"
        autoComplete="off"
      />
      {iconPosition === "right" && (
        <motion.img
          key="search-icon"
          src={imgSrc}
          alt="search"
          width={16}
          height={16}
          className="invert-colors size-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: "spring", bounce: 0.4, duration: 0.5 }}
          aria-hidden="true"
        />
      )}
      <div className="text-dark300_light700 border-dark-400/10 bg-dark-300/10 hidden items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium sm:flex">
        <AnimatePresence mode="wait" initial={false}>
          {searchQuery ? (
            <motion.div
              key="esc-shortcut"
              className="flex items-center gap-1"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ type: "spring", bounce: 0.4, duration: 0.5 }}
            >
              <span>ESC</span>
            </motion.div>
          ) : (
            <motion.div
              key="ctrl-k-shortcut"
              className="flex items-center gap-1"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ type: "spring", bounce: 0.4, duration: 0.5 }}
            >
              <span>{isMac ? "⌘" : "Ctrl"}</span>
              <span>+</span>
              <span>K</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LocalSearch;
