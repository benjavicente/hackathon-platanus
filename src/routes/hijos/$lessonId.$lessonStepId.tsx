import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { convexQuery, useConvexMutation } from "@convex-dev/react-query";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export const Route = createFileRoute("/hijos/$lessonId/$lessonStepId")({
  component: RouteComponent,
  parseParams: ({ lessonStepId, lessonId }) => {
    return { lessonStepId: lessonStepId as Id<"lessonSteps">, lessonId };
  },
  search: ({ lessonStepId }) => {},
});

function RouteComponent() {
  // getAnswers
  const { lessonId, lessonStepId } = Route.useParams();
  const { data: state } = useSuspenseQuery(convexQuery(api.steps.get, { lessonStepId }));

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
      <h1>{question}</h1>
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
      </div>
    </div>
  );
  return <>hola</>;
}
