# RelayOps

A connected incident management and operational intelligence workspace for Northstar Labs.

## Run locally

Requires Node.js 22.12 or later.

```sh
npm install
npm run dev
```

Open **http://localhost:3000**.

From the parent benchmark directory, you can also run `npm run dev:verdant` after installing this app's dependencies. This implementation is isolated in `relayops-verdant`; it does not use the sibling applications.

## Checks

```sh
npm run build
npm run typecheck
```

Both Vite and the type-check command generate TanStack Router's route tree automatically.

## Included workflows

- Organization overview with incident response, service health, on-call coverage, deployment activity, and reliability trends.
- Incident creation, filtering, sorting, list and board views, and detailed response workspaces.
- Incident updates, notes, severity and status changes, responder and commander assignment, response tasks, resolution, and status communications.
- Alert triage, bulk acknowledgment, ownership, incident association, and incident creation from an alert.
- Service catalog and detail pages with shared incident, alert, ownership, deployment, and dependency data.
- Deployment inspection, production and staging filters, release checks, and incident correlations.
- Weekly on-call schedules, current rosters, escalation policies, and shift overrides.
- Operational analytics with adjustable periods and CSV export.
- Postmortem creation, reading, editing, publication status, and corrective actions.
- Team directory, membership, owned services, incident history, and team activity.
- Workspace, members, integration, incident, and notification settings.
- Global search, quick actions, workspace selection, account controls, and read/unread notifications.

Use **⌘K** or **Ctrl+K** for global search and quick actions. Use arrow keys and Enter to choose a result. Use **⌘Enter** or **Ctrl+Enter** to post an incident update.

## Demo state

The seeded scenario is set on **September 8, 2026 at 11:08 AM UTC**. INC-1042 is an active SEV1 incident with checkout error rates at 8.7% after a rollback.

Changes persist in browser local storage under `relayops-v1`. To restore the seeded scenario, clear this key in your browser's developer tools and reload the page.

No database, external account, API key, or authentication service is required. Integration connections, invitations, pages, and customer communications are local simulations. Repository and pull request links point to sample external URLs.

## Implementation

- React and TypeScript
- TanStack Start with server rendering and TanStack Router
- StyleX, compiled through its Vite plugin
- Lucide icons and purpose-built SVG charts
- Native HTML forms, dialogs, and semantic tables

`src/data/model.ts` defines the related seed data. `src/state/store.tsx` manages shared state and persistence. `src/components` contains the shell, shared controls, search, and dialogs. `src/pages` contains the ten product areas and their detail views.
