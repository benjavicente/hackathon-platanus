import * as React from "react";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { queryClient } from "@/client";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

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
  return <Outlet />;
}
