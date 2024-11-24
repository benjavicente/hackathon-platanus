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
      <h1 className="text-center py-6">Tus lecciones</h1>
      <div className="flex flex-col gap-2 overflow-y-auto h-full">
        {lessons.map((lesson) => (
          <Link
            key={lesson._id}
            from={Route.fullPath}
            to="./$lessonId"
            params={{ lessonId: lesson._id }}
            className="bg-white p-2 rounded shadow-sky-100 shadow"
          >
            <div className="flex justify-between">
              <div>{lesson.name}</div>
              <div>{lesson.completed ? "Completado" : "Pendiente"}</div>
            </div>
            <div>{lesson.lessonGoalDescription}</div>
          </Link>
        ))}
      </div>
    </>
  );
}
