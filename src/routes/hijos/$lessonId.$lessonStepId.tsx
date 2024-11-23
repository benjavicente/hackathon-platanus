import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
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
  parseParams: ({ lessonStepId, lessonId }) => {
    return { lessonStepId: lessonStepId as Id<"lessonSteps">, lessonId: lessonId as Id<"lessons"> };
  },
});

function RouteComponent() {
  // getAnswers
  const { lessonId, lessonStepId } = Route.useParams();
  const { pregunta } = Route.useSearch();
  const { data: state } = useSuspenseQuery(convexQuery(api.steps.get, { stepId: lessonStepId }));

  const answerMutation = useConvexMutation(api.steps.makeAnswer);
  const sendAnswer = useMutation({
    mutationFn: answerMutation,
    onError: (error) => {
      console.error(error);
    },
    onSuccess: () => {
      console.log("esta todo bien");
    },
  });

  return (
    <div>
      {JSON.stringify(state)}
      {/* <h1>{question}</h1>
      <div>
        {options.map((option, index) => (
          <button
            key={index}
            value={index}
            onClick={() => {
              sendAnswer.mutate({ type, question, answer: index });
            }}
          >
            {option}
          </button>
        ))}
      </div> */}
    </div>
  );
  return <>hola</>;
}
