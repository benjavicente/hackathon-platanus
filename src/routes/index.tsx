import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { convexQuery, useConvexMutation } from "@convex-dev/react-query";
import { api } from "../convex/_generated/api";

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

function HomeComponent() {
  const { data: lessons } = useSuspenseQuery(convexQuery(api.lessons.list, {}));

  return (
    <div className="p-2 flex flex-col mx-auto max-w-64 items-center justify-center h-full gap-2">
      <Link className="bg-sky-50 w-full p-4 text-center rounded shadow-sky-200 shadow" to="/papas">
        Página papás
      </Link>
      <Link className="bg-sky-50 w-full p-4 text-center rounded shadow-sky-200 shadow" to="/hijos">
        Página hijos
      </Link>
    </div>
  );
}
