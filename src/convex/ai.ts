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
        correctOption: z.number(),
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
      lessonGoalDescription: z.string().describe("The goal of the lesson"),
      lessonSteps: z
        .array(
          z.object({
            stepPrompt: z
              .string()
              .describe(
                "An instructional prompt for another agent to generate the actual content (explanation or exercise) for this step.",
              ),
            stepDescription: z
              .string()
              .describe(
                "Context and detailed guidance for how to approach creating the step content, focusing on tone, style, and relevance.",
              ),
            stepType: z
              .enum(["explanation", "exercise"])
              .describe("The type of step in the lesson, either an explanation or an exercise."),
          }),
        )
        .describe("The steps of the lesson."),
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
    prompt: stepDescription + stepPrompt,
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
