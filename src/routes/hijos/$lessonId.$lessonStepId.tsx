import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/hijos/$lessonId/$lessonStepId")({
  component: RouteComponent,
});

function RouteComponent() {
  return <>hola</>;
}
