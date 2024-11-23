import { v } from "convex/values";
import { action } from "./_generated/server";
import { createAmazonBedrock } from "@ai-sdk/amazon-bedrock";
import { generateObject, generateText } from "ai";
import { z } from "zod";

export const getModel = () => {
  const model = createAmazonBedrock({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  });

  return model("anthropic.claude-3-sonnet-20240229-v1:0");
};

export const probar = action({
  args: {
    parentDescription: v.string(),
  },
  handler: async (ctx, { parentDescription }) => {
    const model = getModel();

    const result = await generateObject({
      model: model,
      schema: z.object({
        text: z.string(),
      }),
      prompt: `
      Create a mathematics lesson based on the following description provided by a parent: ${parentDescription}.

      The lesson should include:

      1. Engaging Explanation: A simple and fun explanation of the topic, personalized based on the child's needs and interests as described.
      2. Interactive Exercises: Provide at least three practice problems tailored to the child's level, integrating elements that match the child's interests and challenges.
      3. Challenge Activity: Include a slightly advanced exercise to build confidence and encourage problem-solving skills.
      4. Positive Reinforcement: Suggestions for encouraging feedback and rewards for correct answers or good effort.

      Make the tone friendly, encouraging, and fun!

      `,
    });

    if (!result) throw Error("No result");
    if (!result?.text) throw Error("No object in result");

    return result.text;
  },
});

export const generateLessonPlan = action({
  args: {
    parentDescription: v.string(),
  },
  handler: async (ctx, { parentDescription }) => {
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
                .describe("The prompt for the step in the lesson"),
              stepDescription: z
                .string()
                .describe("The description of the step in the lesson"),
              stepType: z
                .enum(["explanation", "exercise"])
                .describe(
                  "The type of step in the lesson, either an explanation or an exercise",
                ),
            }),
          )
          .describe("The steps of the lesson"),
      }),
      prompt: `
      Create a mathematics lesson based on the following description provided by a parent: ${parentDescription}.

      The lesson should include:

      1. Engaging Explanation: A simple and fun explanation of the topic, personalized based on the child's needs and interests as described.
      2. Interactive Exercises: Provide at least three practice problems tailored to the child's level, integrating elements that match the child's interests and challenges.

      Make the tone friendly, encouraging, and fun!
      `,
    });

    if (object) throw Error("No object in result");

    return object;
  },
});
