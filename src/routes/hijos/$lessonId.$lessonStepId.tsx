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

  const navigate = Route.useNavigate();
  const markAsDone = useConvexMutation(api.steps.markAsDone);
  const markAsDoneMutation = useMutation({
    mutationFn: async (event: any) => {
      await markAsDone({ stepId: lessonStepId });
    },
    onSuccess: async () => {
      if (nextActivity) {
        return navigate({ to: Route.fullPath, params: { lessonStepId: nextActivity._id }, search: { pregunta: 0 } });
      } else {
        return navigate({ to: "../end" });
      }
    },
  });

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

  const endStep = null;

  if (state.type === "explanation") {
    return (
      <>
        <div>Aqui va un chat</div>
        {nextActivity ? (
          <button onClick={markAsDoneMutation.mutate}>Siguiente actividad</button>
        ) : (
          <button onClick={markAsDoneMutation.mutate}>Terminar leccion</button>
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
              <div key={index} className="col-span-1">
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
                <button onClick={markAsDoneMutation.mutate}>Siguiente actividad</button>
              ) : (
                <button onClick={markAsDoneMutation.mutate}>Terminar leccion</button>
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
