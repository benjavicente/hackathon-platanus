import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { QueryClientProvider } from "@tanstack/react-query";
import { convex, queryClient } from "./client";
import { Suspense } from "react";
import { ConvexProvider } from "convex/react";

// Set up a Router instance
const router = createRouter({
  routeTree,
  defaultPreload: "intent",
});

// Register things for typesafety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export function App() {
  return (
    <Suspense>
      <ConvexProvider client={convex}>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </ConvexProvider>
    </Suspense>
  );
}
