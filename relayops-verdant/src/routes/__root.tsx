import { createRootRoute, HeadContent, Scripts } from '@tanstack/react-router';
import type { ReactNode } from 'react';
import { StoreProvider } from '../state/store';
import { App } from '../components/App';
import resetCss from '../reset.css?url';
export const Route = createRootRoute({
  head: () => ({ meta: [{ charSet: 'utf-8' }, { name: 'viewport', content: 'width=device-width, initial-scale=1' }, { title: 'RelayOps · Northstar Labs' }, { name: 'description', content: 'Your operations, in sync. Incident management and operational intelligence.' }], links: [{ rel: 'stylesheet', href: resetCss }, { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' }] }),
  component: () => <StoreProvider><App /></StoreProvider>, shellComponent: Document,
});
function Document({ children }: { children: ReactNode }) { return <html lang="en"><head><HeadContent /></head><body>{children}<Scripts /></body></html>; }
