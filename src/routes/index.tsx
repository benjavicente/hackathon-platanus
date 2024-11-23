import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "../convex/_generated/api";

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

function HomeComponent() {
  const { data: lessons } = useSuspenseQuery(convexQuery(api.lessons.list, {}));

  return (
    <div className="p-2">
      <h3>Lecciones disponibles</h3>
      {lessons.map((lesson) => (
        <div key={lesson._id} className="p-2 border-b">
          {lesson.name}
        </div>
      ))}
    </div>
  );
}
