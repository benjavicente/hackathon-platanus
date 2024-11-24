import { v } from "convex/values";
import { action, ActionCtx } from "./_generated/server";
import { createAmazonBedrock } from "@ai-sdk/amazon-bedrock";
import { createOpenAI } from "@ai-sdk/openai";
import { generateObject, generateText, tool } from "ai";
import { z } from "zod";
import * as mathjs from "mathjs";

const orchestratorModel = "";
const excerciseModel = "";
const explanationModel = "";

export function getModel(modelString: string) {
  const openai = createOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    compatibility: "strict", // strict mode, enable when using the OpenAI API
  });
  // const model = createAmazonBedrock({
  //   region: process.env.AWS_REGION,
  //   accessKeyId: process.env.AWS_ACESS_KEY,
  //   secretAccessKey: process.env.AWS_SECRET_KEY,
  // });

  return openai("gpt-4o-mini");
}

export const explanationSchema = z.object({
  prompt: z.string(),
});

export const exerciseSchema = z.object({
  questions: z.array(
    z.discriminatedUnion("type", [
      z.object({
        type: z.literal("choice").describe("type MUST be choice"),
        question: z.string(),
        options: z.array(z.string()).describe("Must be an array of strings"),
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
        Crea una lección estructurada de matemáticas basada en la siguiente descripción proporcionada por un padre: ${parentContextDescription}.

        La lección debe comenzar con un paso (step) de explicación seguido de cualquier número de pasos de los siguientes tipos:
        - **Explanation:** Debes proporcionar instrucciones para que otro agente genere una explicación simple y divertida del tema, personalizada según las necesidades e intereses del niño.
        - **Exercise:** Debes proporcionar instrucciones para que otro agente cree al menos tres problemas de práctica adaptados al nivel del niño, integrando elementos que se ajusten a sus intereses y desafíos.

        El resultado debe incluir:
        - **lessonGoalDescription:** Una descripción clara y concisa del objetivo general de la lección.
        - **lessonSteps:** Una lista de pasos, donde cada paso incluye:
          - **stepPrompt:** Una instrucción concisa para que otro agente genere la explicación (explanation) o el ejercicio (exercise).
          - **stepDescription:** Contexto y orientación detallada sobre cómo abordar la creación del contenido del paso, centrándose en el tono, el estilo y la relevancia.
          - **stepType:** Indica si el paso es una "explanation" o un "exercise".

        Enfócate en garantizar que la estructura sea clara y atractiva. El **stepPrompt** debe actuar como un comando directo para otro agente, mientras que el **stepDescription** proporciona razonamiento y orientación para crear el paso de manera efectiva.

        **Debes garantizar la alineación del contenido**, asegurándote de que cada paso construya sobre el anterior. Logra esto proporcionando el contexto y la orientación adecuados para cada paso.
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
      - **Question:** ¿Cuánto es 2+2?
      - **Options:**
        [2, 10, 4, 5]

      - **Correct Option:** 3
    `,
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
