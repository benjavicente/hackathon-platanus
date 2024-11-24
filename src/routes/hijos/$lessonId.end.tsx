import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/hijos/$lessonId/end")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="m-auto text-center">
      <div className="text-2xl mb-2">Felicitaciones 🎉</div>
      <Link
        from={Route.fullPath}
        to="/papas/$lessonId/resultados"
        className="bg-sky-600 px-2 py-1 rounded-sm text-white"
      >
        Ver resultados
      </Link>
    </div>
  );
}
