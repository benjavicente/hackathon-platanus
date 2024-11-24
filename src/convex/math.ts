import { httpAction } from "./_generated/server";

import { internal } from "./_generated/api";
import { streamText, tool } from "ai";
import { openai } from "@ai-sdk/openai";
import { getModel } from "./ai";
import { type Message } from "ai/react";
import { z } from "zod";

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
    messages: messages,
    onFinish: (messages) => {
      console.log("Guardar messages");
    },
    tools: {
      getLatex: tool({
        description:
          "Si el ejercicio tiene que ver con formulas mateticas, quiero que me devuelvas  un atributo aparte que sea solo la formula en Latex. Por ejemplo si te dicen 2+2, quiero que me devuelvas en sintaxis de latex.",
        parameters: z.object({
          latex: z.string(),
        }),
        execute: async (props) => {
          return {
            type: "latex",
            latex: props.latex,
          };
        },
      }),
    },
  });

  return result.toDataStreamResponse({
    headers: {
      // e.g. https://mywebsite.com, configured on your Convex dashboard
      "Access-Control-Allow-Origin": "*",
    },
  });
});
