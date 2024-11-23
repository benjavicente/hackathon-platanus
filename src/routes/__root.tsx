import { Link, Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { queryClient } from "../client";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "../convex/_generated/api";

export const Route = createRootRoute({
  loader: async () => {
    await Promise.all([await queryClient.ensureQueryData(convexQuery(api.lessons.list, {}))]);
  },
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      <Outlet />
      <TanStackRouterDevtools position="bottom-right" />
    </>
  );
}
