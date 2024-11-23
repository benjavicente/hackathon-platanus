import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

export const Route = createFileRoute("/papas/$lessonId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { lessonId } = Route.useParams();
  const { data: lesson } = useSuspenseQuery(convexQuery(api.lessons.get, { id: lessonId as Id<"lessons"> }));

  return (
    <>
      <h1>
        {lesson.name} - {lesson.createScheduled.state.kind}
      </h1>
      <p>{lesson.lessonGoalDescription}</p>
      <ul>
        {lesson.steps.map((step, i) => (
          <li key={step._id}>
            <h2>Paso {i}</h2>
            <div>{step.scheduledCreate?.state.kind}</div>
            {step.context ? <div>{JSON.stringify(step.context)}</div> : null}
          </li>
        ))}
      </ul>
    </>
  );

  return "Hello /papas/$lessonId!";
}
