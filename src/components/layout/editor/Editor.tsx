"use client";
import React, { useEffect, useState } from "react";

import dynamic from "next/dynamic";
import { useTheme } from "next-themes";

import rehypeSanitize from "rehype-sanitize";

import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), {
  ssr: false,
  loading: () => (
    <p className="flex h-[300px] w-full items-center justify-center rounded-md border bg-gray-100 dark:bg-gray-800">
      Loading...
    </p>
  ),
});

const Editor = ({
  value,
  onChange,
  enterBreak = false,
}: {
  value: string;
  onChange: (value: string) => void;
  enterBreak?: boolean;
}) => {
  // Start with a default theme and update after mounting
  const [colorMode, setColorMode] = useState<string>("light");
  const { resolvedTheme } = useTheme();

  // Update the color mode after the component mounts
  useEffect(() => {
    if (resolvedTheme) {
      setColorMode(resolvedTheme);
    }
  }, [resolvedTheme]);

  // Function to add line breaks in preview
  const formatContent = (content: string) => {
    return enterBreak ? content.replace(/\n/g, "  \n") : content;
  };

  return (
    <div data-color-mode={colorMode}>
      <MDEditor
        value={value}
        onChange={(val) => {
          // Apply double spaces at line endings for breaks
          const formattedValue = val ? formatContent(val) : "";
          onChange(formattedValue);
        }}
        height={300}
        textareaProps={{
          placeholder: "Write your question here...",
        }}
        previewOptions={{
          rehypePlugins: [[rehypeSanitize]],
        }}
      />
    </div>
  );
};

export default Editor;
