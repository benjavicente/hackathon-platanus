import { httpAction } from "./_generated/server";

import { internal } from "./_generated/api";
import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { getModel } from "./ai";
import { type Message } from "ai/react";

export const getMath = httpAction(async (ctx, request) => {
  const model = getModel("anthropic.claude-3-haiku-20240307-v1:0");
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

export const createExplanation = httpAction(async (ctx, request) => {
  const { messages } = await request.json();

  const model = getModel("anthropic.claude-3-haiku-20240307-v1:0");
  const result = streamText({
    model: model,
    prompt: "Eres un asistente qeu ayuda a la gente",
    messages: messages,
    onFinish: (messages) => {
      console.log("Guardar messages");
    },
  });

  return result.toDataStreamResponse({
    headers: {
      // e.g. https://mywebsite.com, configured on your Convex dashboard
      "Access-Control-Allow-Origin": "*",
    },
  });
});
