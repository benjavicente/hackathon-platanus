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

  const { questionsStates } = state;

  const answerMutation = useConvexMutation(api.steps.makeAnswer);
  const sendAnswer = useMutation({
    mutationFn: async (valueIndex: number) => {
      await answerMutation({ stepId: lessonStepId, choice: { index: pregunta, value: valueIndex } });
    },
    onError: (error) => {
      console.error(error);
    },
    onSuccess: () => {
      console.log("esta todo bien");
    },
  });

  const actualQuestion = questionsStates[pregunta];

  return (
    <div>
      <h1>{actualQuestion.question}</h1>

      <div className="grid grid-cols-2 gap-2">
        {sendAnswer.isPending ? (
          "Cargando..."
        ) : actualQuestion.isCorrect === null ? (
          actualQuestion.options.map((option, index) => {
            return (
              <div className="col-span-1">
                <button className="bg-green-600 hover:bg-green-500 w-full" onClick={() => sendAnswer.mutate(index)}>
                  {option}
                </button>
              </div>
            );
          })
        ) : (
          <div>
            {actualQuestion.isCorrect ? <h1>Correcto</h1> : <h1>Incorrecto</h1>}
            <Link from={Route.fullPath} search={{ pregunta: pregunta + 1 }}>
              Siguiente
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
