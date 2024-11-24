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
  prompt: z.string().describe("Este este es el contexto para la lección"),
  initialMessage: z.string().describe("Este es el mensaje inicial que enviará el agente"),
});

export const exerciseSchema = z.object({
  questions: z.array(
    z.discriminatedUnion("type", [
      z.object({
        type: z.literal("choice").describe("type MUST be choice"),
        question: z.string(),
        options: z.array(z.string()).describe("Debe ser un array de strings"),
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
            stepTitle: z
              .string()
              .describe("El título del paso. Debe ser descriptivo del contenido de este. Máximo 5 palabras."),
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
        Tu eres un orquestador de contenido educativo. Tu objetivo es crear una leccion estructurada de matematicas para un niño de educacion basica en Chile

        Uno de los padres de un niño te ha proporcionado la siguiente descripción: ${parentContextDescription}.

        La lección debe comenzar con un paso (step) de explicación seguido de cualquier número de pasos (debe incluir al menos 2 de tipo exercises y 2 de explanation) de los siguientes tipos:

        - **Explanation:** Debes entregarle solamente el contexto de las preguntas anteriores (y en caso de que no hayan, entonces sobre la lección en general). El agente usará este conocimiento para responder las dudas del estudiante,
          por lo que es muy importante que la explicación sea clara y concisa, y sobre todo que no repita preguntas anteriores o entregue más ejercicios.

        - **Exercise:** Debes proporcionar instrucciones para que otro agente cree problemas de práctica adaptados al nivel del niño, integrando elementos que se ajusten a sus intereses y desafíos.
        Es importante que los tipos de pasos se alternen de manera que el contenido sea atractivo y efectivo.

        El resultado debe incluir:
        - **lessonGoalDescription:** Una descripción clara y concisa del objetivo general de la lección.
        - **lessonSteps:** Una lista de pasos, donde cada paso incluye:
          - **stepPrompt:** Una instrucción concisa para que otro agente genere la explicación (explanation) o el ejercicio (exercise).
          - **stepDescription:** Descripcion de los contenidos específicos que se deben incluir en el paso y del contexto necesario para crearlo.
          - **stepType:** Indica si el paso es una "explanation" o un "exercise".

        Enfócate en garantizar que la estructura sea clara y atractiva. El **stepPrompt** debe actuar como un comando directo para otro agente, mientras que el **stepDescription** proporciona razonamiento y orientación para crear el paso de manera efectiva.

        **Debes garantizar la alineación dasel contenido**, asegurándote de que cada paso construya sobre el anterior. Logra esto proporcionando el contexto y la orientación adecuados para cada paso.
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

      A continuación, basado en el contexto anterior, diseña preguntas matemáticas claras, concisas e independientes entre sí, relacionadas con la temática de la lección y su objetivo. Considera las siguientes reglas:

      Las preguntas deben ser independientes; no se relacionan entre sí.

      No uses metapreguntas. Se debe responder directamente sin requerir la formulación de otras preguntas.

      Las respuestas correctas son únicas y no se repiten.

      Evita ambigüedades; cada pregunta debe tener una interpretación única.

      Asegúrate de que cada pregunta sea clara y concisa.

      No hagas preguntas ambiguas. Por ejemplo: "Es probable que llueva hoy" es una pregunta invalida.

      Los siguientes son ejemplos de preguntas válidas, no te enfoques en las tematicas ni en el nivel de dificultad exacto, sino en la estructura de las preguntas:
      <example>
      Pregunta:
      Si en un torneo de ajedrez hay 4 mesas y en cada mesa se juegan 2 partidas simultáneamente, ¿cuántas partidas se juegan en total?

      Opciones:
      ["6","8","4","10"]

      Opción Correcta:
      1
      </example>

      <example>
      Pregunta:
      Jesús mide 15 cm más que Luisa y 6 cm menos que Rocío. Si Jesús mide 152 cm, ¿cuánto miden Luisa y Rocío?

      Opciones:
      ["137 y 158", "140 y 158", "137 y 160", "140 y 160"]

      Opción Correcta:
      0
      </example>
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

  object.prompt =
    `
  Eres un profesor de educacion basica y tu objetivo es explicar la materia de la lección de matemáticas a un estudiante de entre 6 y 12 años.

  Debes tener una conversación clara y concisa con el estudiante, asegurándote de que pueda entender la materia.

  Desde el primer mensaje, guia al estudiante a través de la materia de la lección, asegurándote de que pueda comprender los conceptos.s

  ` + object.prompt;

  object.prompt += `
    No generes textos que sean bloques de código Markdown, es decir que no tengan el caracter de backtick (\`).
    Las fórmulas de latex deben ir entre signos de dólar (\$) y no entre backticks (\`).
    `;

  return object;
};
