import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/lecciones/$lessonId/paso/$lessonStepId")(
  {
    component: RouteComponent,
  },
);

function RouteComponent() {}
