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
      <h1>Tus lecciones</h1>
      <div className="flex flex-col gap-2 overflow-y-auto">
        {lessons.map((lesson) => (
          <Link
            key={lesson._id}
            from={Route.fullPath}
            to="./$lessonId"
            params={{ lessonId: lesson._id }}
            className="bg-gray-200"
          >
            {lesson.lessonGoalDescription}
          </Link>
        ))}
      </div>
    </>
  );
}
