"use client";

import { useState, useMemo } from "react";

// 🎯 Simple diff algorithm that compares texts word by word
interface DiffItem {
  type: "added" | "removed" | "unchanged";
  value: string;
}

function computeDiff(text1: string, text2: string): DiffItem[] {
  const words1 = text1.split(/(\s+)/);
  const words2 = text2.split(/(\s+)/);

  const result: DiffItem[] = [];
  let i = 0,
    j = 0;

  while (i < words1.length || j < words2.length) {
    if (i >= words1.length) {
      // 🚨 Remaining words in text2 are additions
      result.push({ type: "added", value: words2[j] });
      j++;
    } else if (j >= words2.length) {
      // 🚨 Remaining words in text1 are removals
      result.push({ type: "removed", value: words1[i] });
      i++;
    } else if (words1[i] === words2[j]) {
      // ✨ Words match - unchanged
      result.push({ type: "unchanged", value: words1[i] });
      i++;
      j++;
    } else {
      // 🔍 Look ahead to find matching word
      let foundMatch = false;

      // Check if current word1 appears later in text2
      for (let k = j + 1; k < Math.min(j + 5, words2.length); k++) {
        if (words1[i] === words2[k]) {
          // Add the words in between as additions
          for (let l = j; l < k; l++) {
            result.push({ type: "added", value: words2[l] });
          }
          result.push({ type: "unchanged", value: words1[i] });
          i++;
          j = k + 1;
          foundMatch = true;
          break;
        }
      }

      if (!foundMatch) {
        // Check if current word2 appears later in text1
        for (let k = i + 1; k < Math.min(i + 5, words1.length); k++) {
          if (words2[j] === words1[k]) {
            // Add the words in between as removals
            for (let l = i; l < k; l++) {
              result.push({ type: "removed", value: words1[l] });
            }
            result.push({ type: "unchanged", value: words2[j] });
            i = k + 1;
            j++;
            foundMatch = true;
            break;
          }
        }
      }

      if (!foundMatch) {
        // No match found, treat as removal and addition
        result.push({ type: "removed", value: words1[i] });
        result.push({ type: "added", value: words2[j] });
        i++;
        j++;
      }
    }
  }

  return result;
}

export default function TextDiffPage() {
  const [text1, setText1] = useState("");
  const [text2, setText2] = useState("");

  // 🧩 Memoized diff computation for performance
  const diffResult = useMemo(() => {
    if (!text1.trim() && !text2.trim()) return [];
    return computeDiff(text1, text2);
  }, [text1, text2]);

  // 🎯 Sample texts for quick testing
  const loadSampleTexts = () => {
    setText1(
      "The quick brown fox jumps over the lazy dog. This is a test sentence.",
    );
    setText2(
      "The quick red fox leaps over the sleepy dog. This is a test paragraph.",
    );
  };

  const clearTexts = () => {
    setText1("");
    setText2("");
  };

  return (
    <div className="container mx-auto max-w-6xl p-6">
      {/* 📌 Header */}
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">🔍 Text Diff Tool</h1>
        <p className="text-muted-foreground">
          Compare two texts side by side and see the differences highlighted.
        </p>
      </div>

      {/* ✨ Action buttons */}
      <div className="mb-6 flex gap-3">
        <button
          onClick={loadSampleTexts}
          className="rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
        >
          📝 Load Sample Texts
        </button>
        <button
          onClick={clearTexts}
          className="rounded-md bg-gray-600 px-4 py-2 text-white transition-colors hover:bg-gray-700"
        >
          🗑️ Clear All
        </button>
      </div>

      {/* 🧩 Input sections */}
      <div className="mb-8 grid gap-6 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-semibold">
            📄 Original Text
          </label>
          <textarea
            value={text1}
            onChange={(e) => setText1(e.target.value)}
            placeholder="Enter the original text here..."
            className="h-40 w-full resize-none rounded-md border p-3 focus:border-transparent focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-muted-foreground mt-1 text-xs">
            {text1.split(/\s+/).filter(Boolean).length} words
          </p>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold">
            📝 Modified Text
          </label>
          <textarea
            value={text2}
            onChange={(e) => setText2(e.target.value)}
            placeholder="Enter the modified text here..."
            className="h-40 w-full resize-none rounded-md border p-3 focus:border-transparent focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-muted-foreground mt-1 text-xs">
            {text2.split(/\s+/).filter(Boolean).length} words
          </p>
        </div>
      </div>

      {/* 🎯 Diff result */}
      {diffResult.length > 0 && (
        <div className="rounded-lg border bg-gray-50 p-6">
          <h2 className="mb-4 text-xl font-semibold">🔍 Diff Result</h2>

          {/* 📊 Statistics */}
          <div className="mb-6 grid grid-cols-3 gap-4 text-sm">
            <div className="rounded bg-red-100 p-3 text-center">
              <div className="font-semibold text-red-700">
                {diffResult.filter((item) => item.type === "removed").length}
              </div>
              <div className="text-red-600">Removed</div>
            </div>
            <div className="rounded bg-green-100 p-3 text-center">
              <div className="font-semibold text-green-700">
                {diffResult.filter((item) => item.type === "added").length}
              </div>
              <div className="text-green-600">Added</div>
            </div>
            <div className="rounded bg-gray-100 p-3 text-center">
              <div className="font-semibold text-gray-700">
                {diffResult.filter((item) => item.type === "unchanged").length}
              </div>
              <div className="text-gray-600">Unchanged</div>
            </div>
          </div>

          {/* ✨ Visual diff display */}
          <div className="rounded border bg-white p-4">
            <div className="flex flex-wrap gap-0 leading-relaxed">
              {diffResult.map((item, index) => (
                <span
                  key={index}
                  className={` ${
                    item.type === "added"
                      ? "bg-green-200 text-green-800"
                      : item.type === "removed"
                        ? "bg-red-200 text-red-800 line-through"
                        : "text-gray-800"
                  } ${item.type !== "unchanged" ? "rounded px-1" : ""} `}
                >
                  {item.value}
                </span>
              ))}
            </div>
          </div>

          {/* 💡 Legend */}
          <div className="mt-4 flex gap-6 text-sm">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded bg-red-200"></span>
              <span>Removed text</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded bg-green-200"></span>
              <span>Added text</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded bg-gray-200"></span>
              <span>Unchanged text</span>
            </div>
          </div>
        </div>
      )}

      {/* 📌 Footer note */}
      <div className="mt-8 rounded-md border border-yellow-200 bg-yellow-50 p-4">
        <p className="text-sm text-yellow-800">
          🚨 <strong>Temporary Tool:</strong> This is a temporary diffing tool
          for testing purposes. The algorithm performs word-by-word comparison
          and may not be as sophisticated as dedicated diff tools.
        </p>
      </div>
    </div>
  );
}
