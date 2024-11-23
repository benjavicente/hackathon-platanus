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
    <div className="p-2">
      <h3>Lecciones que tienes</h3>
      {lessons.map((lesson) => (
        <div key={lesson._id} className="p-2 border-b">
          <div>{lesson.lessonGoalDescription}</div>

          <Link
            from={Route.fullPath}
            to="./lecciones/$lessonId"
            params={{ lessonId: lesson._id }}
          >
            Ir a la lección
          </Link>
        </div>
      ))}
      <button onClick={() => playSound()}>Play sound</button>
    </div>
  );
}

import correctSound from "../assets/duolingo-correct.mp3";

async function playSound() {
  const audio = new Audio(correctSound);
  await audio.play();
}
