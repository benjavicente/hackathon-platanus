import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

export const Route = createFileRoute("/hijos/$lessonId/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { lessonId } = Route.useParams();
  const { data: lesson } = useSuspenseQuery(convexQuery(api.lessons.get, { id: lessonId as Id<"lessons"> }));

  return (
    <>
      <div className="grow">
        <h1>{lesson.name}</h1>
        <p>{JSON.stringify(lesson)}</p>
      </div>
      <Link
        from={Route.fullPath}
        to="./$lessonStepId"
        params={{ lessonStepId: lesson.currentStepId! }}
        className="bg-sky-600 text-white rounded px-2 text-center"
      >
        Ir a actividad actual
      </Link>
    </>
  );
}
