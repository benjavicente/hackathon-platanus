import { v } from "convex/values";
import { action, ActionCtx } from "./_generated/server";
import { createAmazonBedrock } from "@ai-sdk/amazon-bedrock";
import { generateObject, generateText, tool } from "ai";
import { z } from "zod";
import * as mathjs from "mathjs";

const orchestratorModel = "us.anthropic.claude-3-5-sonnet-20241022-v2:0";
const excerciseModel = "anthropic.claude-3-sonnet-20240229-v1:0";
const explanationModel = "anthropic.claude-3-haiku-20240307-v1:0";

export function getModel(modelString: string) {
  const model = createAmazonBedrock({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  });

  return model(modelString);
}

export const explanationSchema = z.object({
  prompt: z.string(),
});

export const exerciseSchema = z.object({
  questions: z.array(
    z.discriminatedUnion("type", [
      z.object({
        type: z.literal("choice"),
        question: z.string(),
        options: z.array(z.string()),
        correctOption: z.number().describe("El index de la opción correcta en el array de opciones."),
      }),
    ]),
  ),
});

export const generateLessonPlanTest = action({
  args: {
    parentContextDescription: v.string(),
  },
  handler: async (ctx, { parentContextDescription }) => {
    return generateLessonPlan({ parentContextDescription });
  },
});

export async function generateLessonPlan({ parentContextDescription }: { parentContextDescription: string }) {
  const model = getModel(orchestratorModel);

  const { object } = await generateObject({
    model: model,
    schema: z.object({
      lessonGoalDescription: z.string().describe("El objetivo de la clase"),
      lessonSteps: z
        .array(
          z.object({
            stepPrompt: z
              .string()
              .describe(
                "Un prompt con instrucciones para que el agente genere el contenido de este step, sea tipo explanation o excercise.",
              ),
            stepDescription: z
              .string()
              .describe(
                "Contexto y guía detallada de como crear el contenido para este step, centrándose en el tono, estilo y relevancia.",
              ),
            stepType: z
              .enum(["explanation", "exercise"])
              .describe("El tipo de step en la clase. Puede ser explanation o excercise."),
          }),
        )
        .describe("Los pasos de la clase."),
    }),
    prompt: `
      Create a structured mathematics lesson based on the following description provided by a parent: ${parentContextDescription}.

        The lesson should start with an explanation step followed by any number of steps of the following types:
        - Explanation: Provide instructions for another agent to generate a simple and fun explanation of the topic, personalized based on the child's needs and interests.
        - Exercises: Provide instructions for another agent to create at least three practice problems tailored to the child's level, integrating elements that match the child's interests and challenges.

        The output should include:
        - **lessonGoalDescription:** A clear and concise description of the overall goal of the lesson.
        - **lessonSteps:** An array of steps, where each step includes:
          - **stepPrompt:** A concise instructional prompt for another agent to generate the explanation or exercise.
          - **stepDescription:** Context and detailed guidance for how to approach creating the step content, focusing on tone, style, and relevance.
          - **stepType:** Indicating whether the step is an "explanation" or an "exercise."

        Focus on ensuring the structure is clear and engaging. The stepPrompt should act as a direct command for another agent, while the stepDescription provides reasoning and guidance for creating the step effectively.

        You MUST ensure content alignment, each step should build on the previous one. Do this by giving the appropriate context and guidance for each step.
      `,
  });

  if (!object) throw Error("No object in result");
  return object;
}

export const generateExercise = async ({
  stepPrompt,
  stepDescription,
}: {
  stepPrompt: string;
  stepDescription: string;
}) => {
  const model = getModel(excerciseModel);

  const { object } = await generateObject({
    model: model,
    schema: exerciseSchema,
    prompt:
      stepDescription +
      stepPrompt +
      `

    **Example:**
    - **Question:** What is 2 + 2?
    - **Options:**
      [2, 10, 4, 5]

    - **Correct Option:** 3



    `,
    tools: {
      calculate: tool({
        description:
          "A tool for evaluating mathematical expressions. " +
          "Example expressions: " +
          "'1.2 * (2 + 4.5)', '12.7 cm to inch', 'sin(45 deg) ^ 2'.",
        parameters: z.object({ expression: z.string() }),
        execute: async ({ expression }) => mathjs.evaluate(expression),
      }),
    },
    toolChoice: "required",
  });

  if (!object) throw Error("No object in result");
  return object;
};

export const generateExplanation = async ({
  stepPrompt,
  stepDescription,
}: {
  stepPrompt: string;
  stepDescription: string;
}) => {
  const model = getModel(explanationModel);

  const { object } = await generateObject({
    model: model,
    schema: explanationSchema,
    prompt: stepDescription + stepPrompt,
  });

  if (!object) throw Error("No object in result");
  return object;
};
