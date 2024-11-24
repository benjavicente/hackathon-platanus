import { Id } from "@/convex/_generated/dataModel";
import { createFileRoute } from "@tanstack/react-router";
import { Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/papas/$lessonId")({
  component: RouteComponent,
  parseParams: (params) => {
    return {
      lessonId: params.lessonId as Id<"lessons">,
    };
  },
});

function RouteComponent() {
  return <Outlet />;
}
