import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router';
import * as React from 'react';
import { AppProvider, useApp } from '../data/store';
import { Shell } from '../components/Shell';
import { CommandPalette } from '../components/CommandPalette';
import { CreateIncidentModal } from '../components/CreateIncidentModal';
import '../styles/globals.css';

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'RelayOps — Incident management & operational intelligence' },
      { name: 'description', content: 'RelayOps by Northstar Labs: incidents, alerts, services, deployments, on-call, analytics and postmortems.' },
    ],
    links: [
      // StyleX dev middleware serves compiled app CSS here; production
      // builds inline it into the app CSS asset instead.
      ...(import.meta.env.DEV ? [{ rel: 'stylesheet', href: '/virtual:stylex.css' }] : []),
    ],
  }),
  shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
        <style>{`@keyframes relayops-pulse{0%{box-shadow:0 0 0 0 rgba(220,38,38,.5)}70%{box-shadow:0 0 0 6px rgba(220,38,38,0)}100%{box-shadow:0 0 0 0 rgba(220,38,38,0)}}`}</style>
      </head>
      <body>
        <AppProvider>
          <GlobalKeys />
          <Shell>{children}</Shell>
          <CommandPalette />
          <CreateIncidentModal />
        </AppProvider>
        <Scripts />
      </body>
    </html>
  );
}

function GlobalKeys() {
  const { openPalette, openCreate, paletteOpen } = useApp();
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      const typing = tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || (e.target as HTMLElement)?.isContentEditable;
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        openPalette('search');
        return;
      }
      if (typing || paletteOpen) return;
      if (e.key.toLowerCase() === 'c') {
        e.preventDefault();
        openCreate();
      }
      if (e.key === '/') {
        e.preventDefault();
        openPalette('search');
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [openPalette, openCreate, paletteOpen]);
  return null;
}
