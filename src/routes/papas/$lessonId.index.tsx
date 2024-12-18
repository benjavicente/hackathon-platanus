import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { queryClient } from "@/client";
import loadingGif from "@/assets/loading.gif"

export const Route = createFileRoute("/papas/$lessonId/")({
  component: RouteComponent,
  loader: async ({ params: { lessonId } }) => {
    await queryClient.ensureQueryData(convexQuery(api.lessons.get, { id: lessonId }));
  },
});

const thinkingMessages = [
  "Desarrollando algo genial para ti...",
  "Haciendo cálculos para sorprenderte...",
  "Buscando el reto perfecto...",
  "Conectando números mágicos...",
  "Trabajando en un desafío matemático único...",
  "Sumando ideas interesantes...",
  "Diseñando un problema hecho a tu medida...",
  "Trazando un camino lleno de números...",
  "Multiplicando opciones para ti...",
  "Explorando posibilidades matemáticas...",
  "Preparando un acertijo especial...",
  "Enfocándome en algo divertido y educativo...",
  "Mezclando creatividad con números...",
  "Ajustando los detalles para tu problema ideal...",
  "Calculando algo que te encantará resolver...",
  "Encontrando la pregunta perfecta para ti...",
  "Dándole forma a un desafío emocionante...",
  "Organizando los números en algo sorprendente...",
  "Imaginando una aventura matemática divertida...",
  "Pensando en cómo desafiar tu mente...",
];

function getMsgByString(msg: string) {
  let hash = msg.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  hash = hash % thinkingMessages.length;
  return thinkingMessages[hash];
}

function RouteComponent() {
  const { lessonId } = Route.useParams();
  const { data: lesson } = useSuspenseQuery(convexQuery(api.lessons.get, { id: lessonId as Id<"lessons"> }));

  return (
    <div className="max-w-120 mx-auto w-full">
      <h1 className="text-sky-800 my-4 text-2xl">Creando lección para {lesson.name}</h1>
      {lesson.createScheduled!.state.kind !== "success" && <img src={loadingGif} alt="loading" className="h-40 mx-auto" />}
      <div>{lesson.createScheduled!.state.kind !== "success" ? getMsgByString(lesson.createScheduledId!) : null}</div>
      {lesson.lessonGoalDescription ? <p>{lesson.lessonGoalDescription}</p> : null}
      <ul className="flex flex-col gap-2 py-4">
        {lesson.steps.map((step, i) => (
          <li key={step._id}>
            <h2>{step?.stepTitle || "Loading"}</h2>
            <div>{step.scheduledCreate?.state.kind === "success" ? "Lista!" : getMsgByString(step._id)}</div>
          </li>
        ))}
      </ul>
      {lesson.steps.length !== 0 && lesson.steps.every((l) => l.scheduledCreate?.state.kind === "success") ? (
        <div className="flex gap-2">
          <Link
            from={Route.fullPath}
            to="/hijos/$lessonId"
            className="block  text-center bg-sky-600 hover:bg-sky-500 text-white px-2 py-1 w-full rounded-sm"
          >
            Ir a la lección
          </Link>
          <Link
            from={Route.fullPath}
            to="/papas/$lessonId/resultados"
            className="block  text-center bg-sky-600 hover:bg-sky-500 text-white px-2 py-1 w-full rounded-sm"
          >
            Ver avances
          </Link>
        </div>
      ) : null}
    </div>
  );
}
