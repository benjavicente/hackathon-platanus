import { httpAction } from "./_generated/server";

import { internal } from "./_generated/api";
import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { getModel } from "./ai";
export const getMath = httpAction(async (ctx, request) => {
  const model = getModel();
  const result = streamText({
    model: model,
    prompt: "Write a poem about embedding models.",
  });

  return result.toDataStreamResponse({
    headers: {
      // e.g. https://mywebsite.com, configured on your Convex dashboard
      "Access-Control-Allow-Origin": "*",
      Vary: "origin",
    },
  });
});

export const createMath = httpAction(async (ctx, request) => {
  const model = getModel();
  const result = streamText({
    model: model,
  });
});
