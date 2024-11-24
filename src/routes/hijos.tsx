import { createFileRoute } from "@tanstack/react-router";
import { Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/hijos")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="max-w-96 px-4 py-2 mx-auto border-x border-x-sky-400 flex flex-col h-full bg-sky-50">
      <Outlet />
    </div>
  );
}
