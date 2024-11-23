import { createFileRoute } from "@tanstack/react-router";
import { Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/hijos")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="max-w-84 px-2 mx-auto border-x h-full">
      <Outlet />
    </div>
  );
}
