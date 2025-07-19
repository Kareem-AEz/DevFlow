import { NextResponse } from "next/server";

import { xai } from "@ai-sdk/xai";
import { generateText } from "ai";

import { auth } from "@/lib/auth";
import handleError from "@/lib/handlers/error";
import { UnauthorizedError, ValidationError } from "@/lib/http-errors";
import { AIAnswerSchema } from "@/lib/validations";

import { APIErrorResponse, APIResponse } from "@/types/global";

// 🎯 Use grok-3-latest for better search capabilities
const model = xai("grok-3-mini");

// 🧪 Testing Tips: To verify web search is working, try these types of questions:
// - "What happened in tech news this week?"
// - "What's the latest version of Next.js?"
// - "Current weather in San Francisco"
// - "Recent AI breakthroughs in 2024"
// These require real-time data and should trigger web search

export async function POST(req: Request): Promise<
  APIResponse<{
    text: string;
    tokens: {
      promptTokens: number;
      completionTokens: number;
      reasoningTokens: number;
      totalTokens: number;
    };
    cost: {
      inputCost: number;
      outputCost: number;
      reasoningCost: number;
      totalCost: number;
      currency: string;
    };
    providerMetadata?: unknown;
  }>
> {
  const session = await auth();

  if (!session) {
    throw new UnauthorizedError();
  }

  try {
    const { question, content, userAnswer } = await req.json();

    const validatedData = AIAnswerSchema.safeParse({
      question,
      content,
      userAnswer,
    });

    if (!validatedData.success)
      throw new ValidationError(validatedData.error.flatten().fieldErrors);

    // 🔍 Enable online search with comprehensive configuration
    const { text, usage, providerMetadata } = await generateText({
      model,
      system: `
        You're an expert, friendly assistant who crafts clear, engaging, and concise answers in markdown.
        - Write as if you're helping a curious peer—be approachable, not robotic.
        - Use markdown for structure: headings, lists, code blocks, and emphasis where it helps understanding.
        - For code, use short, lowercase language tags (e.g., 'js', 'py', 'ts', 'html', 'css').
        - If the question is ambiguous, clarify assumptions and focus on practical, actionable info.
        - If you reference recent events or facts, be specific and cite sources if possible.
        - Never invent facts—if unsure, say so briefly.
        - 🚨 Your answer MUST be at most 1000 characters. Prioritize clarity and usefulness over length.
      `,
      prompt: `
        Someone asked: "${question}"

        Here's extra context to help you answer:
        ---
        ${content}
        ---

        The user also suggested this answer:
        ---
        ${userAnswer}
        ---

        🎯 Your job:
        - If the user's answer is correct and complete, polish it for clarity and add any helpful details.
        - If it's incomplete or has mistakes, gently correct and improve it.
        - If it's missing, write a concise, helpful answer from scratch.
        - Always keep it human, practical, and easy to read.

        Respond in markdown only. No preambles or closing remarks—just the answer.
        🚨 Do not exceed 1000 characters.
      `,
    });

    const { reasoningTokens } =
      (providerMetadata?.xai as {
        reasoningTokens?: number;
        cachedPromptTokens?: number;
      }) || {};

    // 🔍 Clean token usage calculation with reasoning tokens
    const tokens = {
      promptTokens: usage.promptTokens,
      completionTokens: usage.completionTokens,
      reasoningTokens: reasoningTokens || 0, // From xAI provider metadata
      totalTokens: usage.totalTokens + (reasoningTokens || 0),
    };

    // 💰 Calculate cost for Grok 3 Mini
    // Pricing: $0.30 per 1M input tokens, $0.50 per 1M output tokens
    // 🚨 Reasoning tokens: worst-case pricing (same as output tokens)
    const GROK_3_MINI_INPUT_COST = 0.3 / 1_000_000; // $0.30 per million tokens
    const GROK_3_MINI_OUTPUT_COST = 0.5 / 1_000_000; // $0.50 per million tokens
    const GROK_3_MINI_REASONING_COST = 0.5 / 1_000_000; // Worst-case: same as output

    const cost = {
      inputCost: tokens.promptTokens * GROK_3_MINI_INPUT_COST,
      outputCost: tokens.completionTokens * GROK_3_MINI_OUTPUT_COST,
      reasoningCost: tokens.reasoningTokens * GROK_3_MINI_REASONING_COST,
      totalCost:
        tokens.promptTokens * GROK_3_MINI_INPUT_COST +
        tokens.completionTokens * GROK_3_MINI_OUTPUT_COST +
        tokens.reasoningTokens * GROK_3_MINI_REASONING_COST,
      currency: "USD",
    };

    return NextResponse.json(
      {
        success: true,
        data: { text, tokens, cost },
      },
      { status: 200 },
    );
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
