import { v } from "convex/values";
import { action, ActionCtx } from "./_generated/server";
import { createAmazonBedrock } from "@ai-sdk/amazon-bedrock";
import { generateObject, generateText } from "ai";
import { z } from "zod";

export const getModel = () => {
  const model = createAmazonBedrock({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  });

  return model("anthropic.claude-3-5-haiku-20241022-v1:0");
};

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
  const model = getModel();

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
                "Guidance on how to approach creating the content for this step, providing context and structure.",
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

        The lesson should include:

        1. Engaging Explanation: Provide instructions for another agent to generate a simple and fun explanation of the topic, personalized based on the child's needs and interests.
        2. Interactive Exercises: Provide instructions for another agent to create at least three practice problems tailored to the child's level, integrating elements that match the child's interests and challenges.

        The output should include:
        - **lessonGoalDescription:** A clear and concise description of the overall goal of the lesson.
        - **lessonSteps:** An array of steps, where each step includes:
          - **stepPrompt:** A concise instructional prompt for another agent to generate the explanation or exercise.
          - **stepDescription:** Context and detailed guidance for how to approach creating the step content, focusing on tone, style, and relevance.
          - **stepType:** Indicating whether the step is an "explanation" or an "exercise."

        Focus on ensuring the structure is clear and engaging. The stepPrompt should act as a direct command for another agent, while the stepDescription provides reasoning and guidance for creating the step effectively.
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
  const model = getModel();

  const { object } = await generateObject({
    model: model,
    schema: exerciseSchema,
    prompt: stepPrompt,
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
  const model = getModel();

  const { object } = await generateObject({
    model: model,
    schema: explanationSchema,
    prompt: stepPrompt,
  });

  if (!object) throw Error("No object in result");
  return object;
};
