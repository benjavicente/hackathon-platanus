import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { api } from "@/convex/_generated/api";
import { queryClient } from "@/client";

export const Route = createFileRoute("/papas/$lessonId/resultados")({
  loader: async ({ params: { lessonId } }) => {
    await queryClient.ensureQueryData(convexQuery(api.lessons.results, { lessonId }));
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { lessonId } = Route.useParams();
  const { data: results } = useSuspenseQuery(convexQuery(api.lessons.results, { lessonId }));
  return (
    <div className="w-124 mx-auto mw-full">
      <h1 className="text-2xl my-4">Resultados</h1>

      <div className="flex flex-col gap-2 py-2">
        {results.map((result) => (
          <div className="bg-sky-50 p-2 rounded">
            <h2 className="flex justify-between">
              <div>{result.stepTitle}</div>
              <div>{result.completed ? "Completado" : "Incompleto"}</div>
            </h2>
            {result.type === "exercise" && result.context.type === "exercise" ? (
              <div className="flex flex-col gap-2 mt-2">
                {result.context.questions.map((question, index) => (
                  <div className="border-sky-200 bg-white border rounded-sm p-2">
                    <div>Pregunta: {question.question}</div>
                    {result.state.responses.length > index ? (
                      <>
                        <div>
                          Correcta: {question.options[question.correctOption]}
                          <span>{result.state.responses[index] === question.correctOption ? "✅" : "❌"}</span>
                        </div>
                        {result.state.responses[index] !== question.correctOption ? (
                          <div>Respondio: {question.options[result.state.responses[index]]}</div>
                        ) : null}
                      </>
                    ) : (
                      <div>No respondio</div>
                    )}
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
