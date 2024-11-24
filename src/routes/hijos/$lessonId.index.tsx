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
      <div className="grow flex flex-col">
        <h1 className="text-center text-2xl">{lesson.name}</h1>
        <p className="text-center px-2 my-auto">{lesson.lessonGoalDescription}</p>
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
