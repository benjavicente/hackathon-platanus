import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useConvexAction } from "@convex-dev/react-query";
import { api } from "../convex/_generated/api";
import { useMutation } from "@tanstack/react-query";

export const Route = createFileRoute("/ai")({
  component: RouteComponent,
});

function RouteComponent() {
  const callAI = useConvexAction(api.ai.generateLessonPlanTest);

  const callAIMutation = useMutation({
    mutationFn: callAI,
  });

  return (
    <>
      <button
        onClick={() =>
          callAIMutation.mutate({
            parentDescription: "my kids loves math but is having a hard time with fractions",
          })
        }
      >
        Probar AI
      </button>
      {JSON.stringify(callAIMutation.data)}
    </>
  );
}
