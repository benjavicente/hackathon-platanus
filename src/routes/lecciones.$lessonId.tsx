import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/lecciones/$lessonId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { lessonId } = Route.useParams();
  return lessonId;
}
