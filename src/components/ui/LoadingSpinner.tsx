import React from "react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  variant?: "default" | "minimal" | "pulse" | "skeleton";
  size?: "sm" | "md" | "lg" | "xl";
  text?: string;
  className?: string;
}

const LoadingSpinner = ({
  variant = "default",
  size = "md",
  text = "Loading...",
  className,
}: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  };

  const textSizes = {
    sm: "text-sm",
    md: "paragraph-regular",
    lg: "base-medium",
    xl: "h3-semibold",
  };

  if (variant === "skeleton") {
    return (
      <div
        className={cn(
          "mx-auto flex w-full max-w-4xl flex-col gap-4 p-6",
          className,
        )}
      >
        {/* Header skeleton */}
        <div className="flex items-center gap-4">
          <div className="bg-light-800 dark:bg-dark-300 h-12 w-12 animate-pulse rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="bg-light-800 dark:bg-dark-300 h-4 w-1/3 animate-pulse rounded" />
            <div className="bg-light-700 dark:bg-dark-400 h-3 w-1/2 animate-pulse rounded" />
          </div>
        </div>

        {/* Content skeleton */}
        <div className="space-y-3">
          <div className="bg-light-800 dark:bg-dark-300 h-4 animate-pulse rounded" />
          <div className="bg-light-800 dark:bg-dark-300 h-4 w-5/6 animate-pulse rounded" />
          <div className="bg-light-800 dark:bg-dark-300 h-4 w-4/6 animate-pulse rounded" />
        </div>

        {/* Card skeletons */}
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-light-900 dark:bg-dark-200 border-light-800 dark:border-dark-300 rounded-lg border p-4"
            >
              <div className="space-y-3">
                <div className="bg-light-800 dark:bg-dark-300 h-3 animate-pulse rounded" />
                <div className="bg-light-700 dark:bg-dark-400 h-3 w-3/4 animate-pulse rounded" />
                <div className="bg-light-700 dark:bg-dark-400 h-2 w-1/2 animate-pulse rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (variant === "pulse") {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center gap-4",
          className,
        )}
      >
        <div className="relative">
          <div
            className={cn(
              "bg-primary-500 animate-ping rounded-full",
              sizeClasses[size],
            )}
          />
          <div
            className={cn(
              "bg-primary-500 absolute inset-0 rounded-full opacity-75",
              sizeClasses[size],
            )}
          />
        </div>
        {text && (
          <p
            className={cn(
              "text-dark400_light700 animate-pulse font-medium",
              textSizes[size],
            )}
          >
            {text}
          </p>
        )}
      </div>
    );
  }

  if (variant === "minimal") {
    return (
      <div className={cn("flex items-center justify-center gap-2", className)}>
        <div className="flex gap-1">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "bg-primary-500 animate-bounce rounded-full",
                size === "sm"
                  ? "h-2 w-2"
                  : size === "md"
                    ? "h-3 w-3"
                    : size === "lg"
                      ? "h-4 w-4"
                      : "h-5 w-5",
              )}
              style={{
                animationDelay: `${i * 0.1}s`,
                animationDuration: "0.6s",
              }}
            />
          ))}
        </div>
        {text && (
          <span
            className={cn(
              "text-dark400_light700 ml-2 font-medium",
              textSizes[size],
            )}
          >
            {text}
          </span>
        )}
      </div>
    );
  }

  // Default spinner variant
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4",
        className,
      )}
    >
      <div className="relative">
        {/* Outer rotating ring */}
        <div
          className={cn(
            "border-light-700 dark:border-dark-400 animate-spin rounded-full border-4",
            sizeClasses[size],
          )}
          style={{
            borderTopColor: "#ff7000",
            animationDuration: "1s",
          }}
        />

        {/* Inner pulsing dot */}
        <div
          className={cn("absolute inset-0 flex items-center justify-center")}
        >
          <div
            className={cn(
              "bg-primary-500 animate-pulse rounded-full",
              size === "sm"
                ? "h-2 w-2"
                : size === "md"
                  ? "h-3 w-3"
                  : size === "lg"
                    ? "h-4 w-4"
                    : "h-6 w-6",
            )}
          />
        </div>
      </div>

      {text && (
        <div className="text-center">
          <p
            className={cn("text-dark400_light700 font-medium", textSizes[size])}
          >
            {text}
          </p>
          <div className="mt-2 flex justify-center gap-1">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="bg-primary-500 h-1 w-1 animate-bounce rounded-full"
                style={{
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: "1s",
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LoadingSpinner;
