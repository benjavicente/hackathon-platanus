import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useConvexMutation } from "@convex-dev/react-query";
import { api } from "../../convex/_generated/api";
import { useMutation } from "@tanstack/react-query";

export const Route = createFileRoute("/papas/")({
  component: RouteComponent,
});

function RouteComponent() {
  const createLesson = useConvexMutation(api.lessons.create);
  const navigate = Route.useNavigate();
  const createLessonMutation = useMutation({
    mutationFn: createLesson,
    onSuccess: async ({ lessonId }) => {
      await navigate({ to: "$lessonId", params: { lessonId } });
    },
  });
  return (
    <button onClick={() => createLessonMutation.mutate({ name: "hola" })}>
      Crear lección
    </button>
  );
}
