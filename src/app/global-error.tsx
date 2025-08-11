"use client"; // Error boundaries must be Client Components

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { AlertTriangle, Home, RefreshCcw, Bug, ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  // Log error for debugging and monitoring
  React.useEffect(() => {
    console.error("Global Error:", {
      message: error.message,
      digest: error.digest,
      stack: error.stack,
      timestamp: new Date().toISOString(),
    });

    // Here you could send to error reporting service like Sentry
    // reportError(error);
  }, [error]);

  const handleReportError = () => {
    // Create error report data
    const errorReport = {
      message: error.message,
      digest: error.digest,
      stack: error.stack,
      userAgent: navigator?.userAgent,
      url: window?.location?.href,
      timestamp: new Date().toISOString(),
    };

    // Copy to clipboard for user to report
    navigator.clipboard?.writeText(JSON.stringify(errorReport, null, 2));
    alert("Error details copied to clipboard. Please share with support team.");
  };

  return (
    // global-error must include html and body tags
    <html lang="en" className="scroll-smooth">
      <head>
        <title>DevFlow - Application Error</title>
        <meta
          name="description"
          content="An unexpected error occurred in DevFlow"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="bg-light-850 dark:bg-dark-100 font-inter min-h-screen antialiased">
        <div className="background-light850_dark100 flex min-h-screen items-center justify-center">
          <div className="flex w-full max-w-2xl flex-col items-center justify-center px-6 py-12">
            {/* Error Illustration */}
            <div className="relative mb-8">
              <div className="bg-primary-500/10 absolute -inset-4 rounded-full blur-xl" />
              <div className="bg-destructive/10 relative rounded-full p-6">
                <AlertTriangle className="text-destructive size-16" />
              </div>
            </div>

            {/* Error Content */}
            <div className="space-y-6 text-center">
              <div className="space-y-3">
                <h1 className="h1-bold text-dark100_light900">
                  Oops! Something went wrong
                </h1>
                <p className="paragraph-regular text-dark500_light700 max-w-lg">
                  We encountered an unexpected error in DevFlow. Our team has
                  been notified and is working to fix this issue. Please try
                  refreshing the page or return to the homepage.
                </p>
              </div>

              {/* Error Details (collapsed by default) */}
              <details className="group mx-auto w-full max-w-md">
                <summary className="text-dark400_light800 hover:text-primary-500 flex cursor-pointer items-center justify-center gap-2 text-sm transition-colors">
                  <Bug className="size-4" />
                  Technical Details
                  <span className="text-xs transition-transform group-open:rotate-180">
                    ▼
                  </span>
                </summary>
                <div className="bg-light-800 dark:bg-dark-300 border-light-700 dark:border-dark-400 mt-4 rounded-lg border p-4">
                  <div className="space-y-2 text-left">
                    <div className="text-dark400_light700 text-xs">
                      <span className="font-medium">Error:</span>{" "}
                      {error.message}
                    </div>
                    {error.digest && (
                      <div className="text-dark400_light700 text-xs">
                        <span className="font-medium">ID:</span> {error.digest}
                      </div>
                    )}
                    <div className="text-dark400_light700 text-xs">
                      <span className="font-medium">Time:</span>{" "}
                      {new Date().toLocaleString()}
                    </div>
                  </div>
                </div>
              </details>

              {/* Action Buttons */}
              <div className="flex flex-col items-center justify-center gap-4 pt-4 sm:flex-row">
                <Button
                  onClick={reset}
                  className="primary-gradient paragraph-medium text-light-900 shadow-light100_dark100 min-w-[140px] rounded-lg px-6 py-3"
                >
                  <RefreshCcw className="size-4" />
                  Try Again
                </Button>

                <Link href="/">
                  <Button
                    variant="outline"
                    className="paragraph-medium text-dark100_light900 bg-light-900 dark:bg-dark-300 border-light-700 dark:border-dark-400 hover:bg-light-800 dark:hover:bg-dark-200 min-w-[140px] rounded-lg px-6 py-3"
                  >
                    <Home className="size-4" />
                    Go Home
                  </Button>
                </Link>
              </div>

              {/* Additional Help Options */}
              <div className="border-light-700 dark:border-dark-400 space-y-4 border-t pt-6">
                <div className="flex flex-col items-center justify-center gap-4 text-sm sm:flex-row">
                  <button
                    onClick={handleReportError}
                    className="text-dark400_light700 hover:text-primary-500 flex items-center gap-2 transition-colors"
                  >
                    <Bug className="size-4" />
                    Copy Error Details
                  </button>

                  <span className="text-dark400_light700 hidden sm:inline">
                    •
                  </span>

                  <Link
                    href="/"
                    className="text-dark400_light700 hover:text-primary-500 flex items-center gap-2 transition-colors"
                  >
                    <ArrowLeft className="size-4" />
                    Back to DevFlow
                  </Link>
                </div>

                <p className="text-dark400_light700 mx-auto max-w-md text-xs">
                  If this problem persists, please contact our support team with
                  the error details above.
                </p>
              </div>
            </div>

            {/* DevFlow Branding */}
            <div className="text-dark400_light700 mt-12 flex items-center gap-2">
              <Image
                src="/images/site-logo.svg"
                alt="DevFlow Logo"
                width={24}
                height={24}
                className="size-6"
              />
              <span className="small-medium">DevFlow</span>
            </div>
          </div>
        </div>

        {/* Add some basic styles for better visual consistency */}
        <style jsx global>{`
          html {
            color-scheme: light dark;
          }

          @media (prefers-color-scheme: dark) {
            html {
              color-scheme: dark;
            }
          }

          * {
            box-sizing: border-box;
          }

          body {
            margin: 0;
            line-height: 1.6;
          }
        `}</style>
      </body>
    </html>
  );
}
