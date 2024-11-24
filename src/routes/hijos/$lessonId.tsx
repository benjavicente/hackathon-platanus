import * as React from "react";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { queryClient } from "@/client";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useSuspenseQuery } from "@tanstack/react-query";

import { cva } from "cva";

const progresStyles = cva({
  base: "h-2 grow rounded-full my-4",
  variants: {
    completed: {
      true: "bg-sky-400",
      false: "bg-sky-200",
    },
  },
});

export const Route = createFileRoute("/hijos/$lessonId")({
  params: {
    parse: (params) => {
      return {
        lessonId: params.lessonId as Id<"lessons">,
      };
    },
  },
  loader: async ({ params: { lessonId } }) => {
    await Promise.all([queryClient.ensureQueryData(convexQuery(api.lessons.get, { id: lessonId }))]);
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { lessonId } = Route.useParams();
  const { data: lesson } = useSuspenseQuery(convexQuery(api.lessons.get, { id: lessonId }));
  return (
    <>
      <div className="flex gap-1 w-full justify-center">
        {lesson.steps.map((step) => (
          <div className={progresStyles({ completed: step.completed })} key={step._id}></div>
        ))}
      </div>
      <Outlet />
    </>
  );
}
