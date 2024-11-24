import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { convexQuery, useConvexMutation } from "@convex-dev/react-query";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { zodValidator } from "@tanstack/zod-adapter";
import { z } from "zod";

const lessonStepSchema = z.object({
  pregunta: z.optional(z.number()).default(0),
});

export const Route = createFileRoute("/hijos/$lessonId/$lessonStepId")({
  component: RouteComponent,
  validateSearch: zodValidator(lessonStepSchema),
  parseParams: ({ lessonStepId }) => {
    return { lessonStepId: lessonStepId as Id<"lessonSteps"> };
  },
});

function RouteComponent() {
  // getAnswers
  const { lessonId, lessonStepId } = Route.useParams();
  const { pregunta } = Route.useSearch();
  const { data: state } = useSuspenseQuery(convexQuery(api.steps.get, { stepId: lessonStepId }));
  const { data: lesson } = useSuspenseQuery(convexQuery(api.lessons.get, { id: lessonId as Id<"lessons"> }));

  const nextActivityIndex = lesson.steps.findIndex((step) => step._id === lessonStepId) + 1;
  const nextActivity = lesson.steps.at(nextActivityIndex);

  const answerMutation = useConvexMutation(api.steps.makeAnswer);
  const sendAnswer = useMutation({
    mutationFn: async (valueIndex: number) => {
      return await answerMutation({ stepId: lessonStepId, choice: { index: pregunta, value: valueIndex } });
    },
    onError: (error) => {
      console.error(error);
    },
    onSuccess: (isCorrect) => {
      if (isCorrect) {
        playCorrectSound();
      } else {
        playIncorrectSound();
      }
    },
  });

  if (state.type === "explanation") {
    return (
      <>
        <div>Aqui va un chat</div>
        {nextActivity ? (
          <Link
            from={Route.fullPath}
            to={Route.fullPath}
            params={{ lessonStepId: nextActivity._id }}
            search={{ pregunta: undefined }}
          >
            Siguiente actividad
          </Link>
        ) : (
          <Link from={Route.fullPath} to="/hijos/$lessonId/end">
            Terminar leccion
          </Link>
        )}
      </>
    );
  }

  const actualQuestion = state.questionsStates[pregunta];

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="grow ">
        <div className="border-green-400 bg-green-50 px-4 py-16 rounded-lg shadow-sm">{actualQuestion.question}</div>
      </div>

      <div className="flex flex-col w-full  gap-2">
        {sendAnswer.isPending ? (
          "Cargando..."
        ) : actualQuestion.isCorrect === null ? (
          actualQuestion.options.map((option, index) => {
            return (
              <div className="col-span-1">
                <button
                  className="bg-gray-50 hover:outline-gray-200  hover:outline w-full hover:cursor-pointer text-4xl transform transition hover:scale-115 py-2l"
                  onClick={() => sendAnswer.mutate(index)}
                >
                  {option}
                </button>
              </div>
            );
          })
        ) : (
          <div>
            {actualQuestion.isCorrect ? <h1>Correcto</h1> : <h1>Incorrecto</h1>}
            {pregunta === state.questionsStates.length - 1 ? (
              nextActivity ? (
                <Link
                  from={Route.fullPath}
                  to={Route.fullPath}
                  params={{ lessonStepId: nextActivity._id }}
                  search={{ pregunta: undefined }}
                >
                  Siguiente actividad
                </Link>
              ) : (
                <Link from={Route.fullPath} to="/hijos/$lessonId/end">
                  Terminar leccion
                </Link>
              )
            ) : (
              <Link from={Route.fullPath} to={Route.fullPath} search={{ pregunta: pregunta + 1 }}>
                Siguiente pregunta
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

import correctSound from "../../assets/correct.mp3";
import wrongSound from "../../assets/wrong.mp3";

async function playCorrectSound() {
  const audio = new Audio(correctSound);
  await audio.play();
}

async function playIncorrectSound() {
  const audio = new Audio(wrongSound);
  await audio.play();
}
