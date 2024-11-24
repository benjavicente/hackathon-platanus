import { httpAction } from "./_generated/server";

import { internal } from "./_generated/api";
import { streamText, tool } from "ai";
import { openai } from "@ai-sdk/openai";
import { getModel } from "./ai";
import { type Message } from "ai/react";
import { z } from "zod";
import { countNumberPrompt } from "@/math/constants/math";

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

  // OJO CON EL MODELO ESTO ES LEGACY. DA LO MISMO QUE LE PASES UN STRING.
  const model = getModel("legacy-deprecated-ignore-this-value");
  const result = streamText({
    model: model,
    messages: messages,
    onFinish: (messages) => {
      console.log("Guardar messages");
    },
    toolChoice: "auto",
    tools: {
      getInfiniteNumber: tool({
        description: "Usa esta herramienta cuando quieras explicar que es infinito",
        parameters: z.object({
          description: z.string(),
        }),
        execute: async (props) => {
          return {
            type: "getInfiniteNumber",
            description: props.description,
          };
        },
      }),

      showNextActivityButton: tool({
        description: `Usa esta herramienta para mostrar el boton para ir a la proxima actividad.
           Debes mostrarlo cuando el estudiante haya comprendido el tema que le estas enseñando
           o cuando el estudiante no quiera continuar la conversación`,
        parameters: z.object({}),
        execute: async (props) => {
          return {
            type: "showNextActivityButton",
          };
        },
      }),
    },
  });

  console.log(result);

  return result.toDataStreamResponse({
    headers: {
      // e.g. https://mywebsite.com, configured on your Convex dashboard
      "Access-Control-Allow-Origin": "*",
    },
  });
});
