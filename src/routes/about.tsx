import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "../convex/_generated/api";

export const Route = createFileRoute("/about")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: ejemplo } = useSuspenseQuery(
    convexQuery(api.ejemplo.obtener, {}),
  );
  return ejemplo;
}
