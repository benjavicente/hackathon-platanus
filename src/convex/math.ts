import { httpAction } from "./_generated/server";

import { internal } from "./_generated/api";
import { streamText, tool } from "ai";
import { openai } from "@ai-sdk/openai";
import { getModel } from "./ai";
import { type Message } from "ai/react";
import { z } from "zod";
import { countNumberPrompt } from "@/math/constants/math";
import { PLOTS, PLOT_PROMPT } from "@/math/constants/plots";
import { MOVEMENT_PROMPT } from "@/math/constants/movement";

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
      console.log("Guardar messages", messages);
    },
    toolChoice: "auto",
    tools: {
      getInfiniteNumber: tool({
        description:
          "Usa esta herramienta para mostrar una visualización del infinito, puedes utilizarla como parte de una explicación",
        parameters: z.object({}),
        execute: async (props) => {
          return {};
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
      createPlot: tool({
        description: PLOT_PROMPT,
        parameters: z.object({
          figure: z
            .enum(PLOTS)
            .describe("Esto representa la forma geometrica. Puede ser un cuadrado circulo o triangulo."),
        }),
        execute: async (props) => {
          return {
            type: "createPlot",
            figure: props.figure,
          };
        },
      }),
      createSVG: tool({
        description: `Usa esta herramienta cuando te pidan crear un SVG, que puede ser usado para visualizar cualquier cosa.
        Esta herramienta debe ser utilizanda cuando te digan el concepto de ILUSTRAR.
        O tambien es valido dibujar. Por ejemplo: si te dicen DIBUJAME UN CIRCULO AZUL, tu corres esta herramienta`,
        parameters: z
          .object({ svg: z.array(svgShapeSchema), height: z.number(), width: z.number() })
          .describe("Objeto de SVG. Lo puedes usar para dibujar cualquier cosa, usando circulos, rectangulos o lineas"),
        execute: async (props) => {
          return {
            type: "svg",
            svg: props,
          };
        },
      }),
      showCatapult: tool({
        description: MOVEMENT_PROMPT,
        parameters: z.object({}),
        execute: async (props) => {
          return {
            type: "showCatapult",
          };
        },
      }),
      showMultiplication: tool({
        description: "Esta herramienta tienes que utilizarla cuando te pidan multiplicar o hacer ejercicios.",
        parameters: z.object({
          group1: z.number().describe("Esto corresponde al primer grupo de numeros"),
          group2: z.number().describe("Esto corresponde al segundo grupo de numeros"),
        }),
        execute: async (props) => {
          return {
            group1: props.group1,
            group2: props.group2,
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

const baseShapeSchema = z.object({
  type: z.string(),
  fill: z.string().optional(),
  stroke: z.string().optional(),
  strokeWidth: z.number().optional(),
});

// Define specific shape schemas
const circleSchema = baseShapeSchema.extend({
  type: z.literal("circle"),
  cx: z.number(),
  cy: z.number(),
  r: z.number(),
});

const rectangleSchema = baseShapeSchema.extend({
  type: z.literal("rectangle"),
  x: z.number(),
  y: z.number(),
  width: z.number(),
  height: z.number(),
});

const lineSchema = baseShapeSchema.extend({
  type: z.literal("line"),
  x1: z.number(),
  y1: z.number(),
  x2: z.number(),
  y2: z.number(),
});

export const svgShapeSchema = z.discriminatedUnion("type", [circleSchema, rectangleSchema, lineSchema]);
