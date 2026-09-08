import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from "@tanstack/react-router";
import { StoreProvider } from "../state";
import { AppShell } from "../components/Shell";
import "@fontsource-variable/inter";
import "../base.css";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "RelayOps · Northstar Labs" },
      { name: "theme-color", content: "#f7f8fa" },
    ],
  }),
  component: Root,
  notFoundComponent: () => (
    <div style={{ padding: 40 }}>
      This page could not be found.{" "}
      <a href={import.meta.env.BASE_URL}>Return to overview</a>
    </div>
  ),
});

function Root() {
  return (
    <html lang="en">
      <head>
        <HeadContent />
        {import.meta.env.DEV && (
          <>
            <link rel="stylesheet" href="/virtual:stylex.css" />
            <script type="module" src="/@id/virtual:stylex:runtime" />
          </>
        )}
      </head>
      <body>
        <StoreProvider>
          <AppShell>
            <Outlet />
          </AppShell>
        </StoreProvider>
        <Scripts />
      </body>
    </html>
  );
}
