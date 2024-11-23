import { createFileRoute } from "@tanstack/react-router";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "../convex/_generated/api";
import { useSuspenseQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/lecciones/$lessonId/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { lessonId } = Route.useParams();
  const { data: lesson } = useSuspenseQuery(
    convexQuery(api.lessons.get, { id: lessonId }),
  );

  return JSON.stringify(lesson);
}
