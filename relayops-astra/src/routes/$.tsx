import { createFileRoute } from "@tanstack/react-router";
import { WorkspacePage } from "../pages/WorkspacePage";
export const Route = createFileRoute("/$")({
  validateSearch: (search: Record<string, unknown>): Record<string, string> =>
    Object.fromEntries(
      Object.entries(search).map(([key, value]) => [key, String(value)]),
    ),
  component: WorkspacePage,
});
