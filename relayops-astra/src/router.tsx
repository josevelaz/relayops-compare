import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export function getRouter() {
  const basepath = import.meta.env.BASE_URL.replace(/\/$/, "") || "/";
  return createRouter({
    routeTree,
    basepath,
    scrollRestoration: true,
    defaultPreload: "intent",
  });
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
