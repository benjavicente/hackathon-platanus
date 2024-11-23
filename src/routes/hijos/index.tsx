import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { api } from "../../convex/_generated/api";

export const Route = createFileRoute("/hijos/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: lessons } = useSuspenseQuery(convexQuery(api.lessons.list, {}));

  return (
    <>
      {lessons.map((lesson) => (
        <Link
          key={lesson._id}
          from={Route.fullPath}
          to="./$lessonId"
          params={{ lessonId: lesson._id }}
        >
          {lesson.name}
        </Link>
      ))}
    </>
  );
}
