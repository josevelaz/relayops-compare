import * as React from 'react';
import * as stylex from '@stylexjs/stylex';
import { Link, useLocation, useNavigate } from '@tanstack/react-router';
import {
  Activity, AlertTriangle, BarChart3, Bell, CheckCircle2, ChevronDown, CircleDot,
  ClipboardList, GitBranch, HeartPulse, LayoutDashboard, Moon, Plus, Search, Settings, Users, Zap,
} from 'lucide-react';
import { tokens } from '../styles/tokens.stylex';
import { useApp } from '../data/store';

const NAV = [
  { to: '/', label: 'Overview', icon: LayoutDashboard, exact: true },
  { to: '/incidents', label: 'Incidents', icon: Zap },
  { to: '/alerts', label: 'Alerts', icon: AlertTriangle },
  { to: '/services', label: 'Services', icon: HeartPulse },
  { to: '/deployments', label: 'Deployments', icon: GitBranch },
  { to: '/on-call', label: 'On-call', icon: Moon },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/postmortems', label: 'Postmortems', icon: ClipboardList },
  { to: '/teams', label: 'Teams', icon: Users },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export function Shell({ children }: { children: React.ReactNode }) {
  const { incidents, alerts, notifications } = useApp();
  const [mobileNav, setMobileNav] = React.useState(false);
  const [notifOpen, setNotifOpen] = React.useState(false);
  const [acctOpen, setAcctOpen] = React.useState(false);
  const [wsOpen, setWsOpen] = React.useState(false);
  const loc = useLocation();
  const activeIncidents = incidents.filter((i) => i.status !== 'Resolved').length;
  const firing = alerts.filter((a) => a.state === 'Firing').length;
  const unread = notifications.filter((n) => !n.read).length;

  React.useEffect(() => {
    setMobileNav(false);
    setNotifOpen(false);
    setAcctOpen(false);
  }, [loc.pathname]);

  return (
    <div {...stylex.props(shell.page)}>
      <a href="#main" {...stylex.props(shell.skip)}>Skip to main content</a>
      <aside {...stylex.props(shell.side)} aria-label="Primary">
        <SidebarBody
          activeIncidents={activeIncidents}
          firing={firing}
          pathname={loc.pathname}
          onNavigate={() => setMobileNav(false)}
        />
      </aside>

      <div {...stylex.props(shell.main)}>
        <Topbar
          unread={unread}
          notifOpen={notifOpen}
          setNotifOpen={setNotifOpen}
          acctOpen={acctOpen}
          setAcctOpen={setAcctOpen}
          wsOpen={wsOpen}
          setWsOpen={setWsOpen}
          onMenu={() => setMobileNav((v) => !v)}
        />
        <main id="main" {...stylex.props(shell.content)} tabIndex={-1}>
          {children}
        </main>
        <nav {...stylex.props(shell.bottomNav)} aria-label="Primary mobile">
          {NAV.slice(0, 5).map((n) => (
            <Link key={n.to} to={n.to} {...stylex.props(shell.bottomLink)} activeProps={{ style: { color: '#fff' } }}>
              <n.icon size={19} />
              <span {...stylex.props(shell.bottomLabel)}>{n.label}</span>
            </Link>
          ))}
        </nav>
      </div>

      {mobileNav && (
        <div {...stylex.props(shell.drawerWrap)}>
          <div {...stylex.props(shell.scrim)} onClick={() => setMobileNav(false)} />
          <div {...stylex.props(shell.drawer)}>
            <SidebarBody activeIncidents={activeIncidents} firing={firing} pathname={loc.pathname} onNavigate={() => setMobileNav(false)} />
          </div>
        </div>
      )}
    </div>
  );
}

function SidebarBody({ activeIncidents, firing, pathname, onNavigate }: { activeIncidents: number; firing: number; pathname: string; onNavigate: () => void }) {
  const { openCreate } = useApp();
  const isActive = (to: string, exact?: boolean) => (exact ? pathname === '/' : pathname === to || pathname.startsWith(`${to}/`));
  return (
    <div {...stylex.props(side.inner)}>
      <div {...stylex.props(side.brand)}>
        <span {...stylex.props(side.logo)} aria-hidden><Activity size={18} strokeWidth={2.5} /></span>
        <span>
          <span {...stylex.props(side.brandName)}>RelayOps</span>
          <span {...stylex.props(side.brandSub)}>Northstar Labs</span>
        </span>
      </div>
      <button {...stylex.props(side.create)} onClick={() => { onNavigate(); openCreate(); }}>
        <Plus size={15} /> New incident
        <kbd {...stylex.props(side.kbd)}>C</kbd>
      </button>
      <nav aria-label="Sections" {...stylex.props(side.nav)}>
        {NAV.map((n) => {
          const active = isActive(n.to, n.exact);
          return (
            <Link key={n.to} to={n.to} onClick={onNavigate} {...stylex.props(side.link, active && side.linkActive)} aria-current={active ? 'page' : undefined}>
              <n.icon size={17} />
              <span {...stylex.props(side.linkLabel)}>{n.label}</span>
              {n.label === 'Incidents' && activeIncidents > 0 && <span {...stylex.props(side.count)}>{activeIncidents}</span>}
              {n.label === 'Alerts' && firing > 0 && <span {...stylex.props(side.countWarn)}>{firing}</span>}
            </Link>
          );
        })}
      </nav>
      <div {...stylex.props(side.foot)}>
        <div {...stylex.props(side.health)}>
          <CircleDot size={14} color="#f87171" />
          <span>SEV1 active · INC-1042</span>
        </div>
        <p {...stylex.props(side.footText)}>Production Engineering · 47 services · 1.8M rpm peak</p>
      </div>
    </div>
  );
}

function Topbar({ unread, notifOpen, setNotifOpen, acctOpen, setAcctOpen, wsOpen, setWsOpen, onMenu }: {
  unread: number;
  notifOpen: boolean; setNotifOpen: (v: boolean | ((p: boolean) => boolean)) => void;
  acctOpen: boolean; setAcctOpen: (v: boolean | ((p: boolean) => boolean)) => void;
  wsOpen: boolean; setWsOpen: (v: boolean | ((p: boolean) => boolean)) => void;
  onMenu: () => void;
}) {
  const { openPalette, notifications, markRead, markAllRead, openCreate } = useApp();
  const navigate = useNavigate();
  const notifRef = React.useRef<HTMLDivElement>(null);
  const acctRef = React.useRef<HTMLDivElement>(null);
  const wsRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (acctRef.current && !acctRef.current.contains(e.target as Node)) setAcctOpen(false);
      if (wsRef.current && !wsRef.current.contains(e.target as Node)) setWsOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [setNotifOpen, setAcctOpen, setWsOpen]);

  return (
    <header {...stylex.props(top.bar)}>
      <button {...stylex.props(top.menu)} onClick={onMenu} aria-label="Open navigation">☰</button>
      <div ref={wsRef} {...stylex.props(top.wsWrap)}>
        <button {...stylex.props(top.ws)} onClick={() => setWsOpen((v) => !v)} aria-haspopup="listbox" aria-expanded={wsOpen}>
          <span {...stylex.props(top.wsDot)} aria-hidden />
          <span {...stylex.props(top.wsText)}>Production Engineering</span>
          <ChevronDown size={14} />
        </button>
        {wsOpen && (
          <div role="listbox" aria-label="Workspaces" {...stylex.props(pop.box)} style={{ left: 0 }}>
            {['Production Engineering', 'Staging Sandbox', 'Mobile Release'].map((w) => (
              <button key={w} role="option" aria-selected={w === 'Production Engineering'} {...stylex.props(pop.item)} onClick={() => setWsOpen(false)}>
                <span {...stylex.props(pop.itemTop)}>{w} {w === 'Production Engineering' && <CheckCircle2 size={14} color="#059669" />}</span>
                <span {...stylex.props(pop.itemSub)}>{w === 'Production Engineering' ? '85 engineers · current' : 'Switch workspace'}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <button {...stylex.props(top.search)} onClick={() => openPalette('search')} aria-label="Search (Command K)">
        <Search size={15} />
        <span {...stylex.props(top.searchText)}>Search incidents, services, people…</span>
        <kbd {...stylex.props(top.kbd)}>⌘K</kbd>
      </button>

      <div {...stylex.props(top.actions)}>
        <button {...stylex.props(top.iconBtn)} onClick={() => openPalette('actions')} aria-label="Quick actions" title="Quick actions">
          <Zap size={17} />
        </button>
        <div ref={notifRef} {...stylex.props(top.rel)}>
          <button {...stylex.props(top.iconBtn)} onClick={() => setNotifOpen((v) => !v)} aria-label={`Notifications, ${unread} unread`} aria-expanded={notifOpen}>
            <Bell size={17} />
            {unread > 0 && <span {...stylex.props(top.dot)}>{unread}</span>}
          </button>
          {notifOpen && (
            <div {...stylex.props(pop.box)} role="dialog" aria-label="Notifications" style={{ right: 0, width: 360 }}>
              <div {...stylex.props(pop.head)}>
                <strong>Notifications</strong>
                <button {...stylex.props(pop.link)} onClick={markAllRead}>Mark all read</button>
              </div>
              <div {...stylex.props(pop.list)}>
                {notifications.slice(0, 8).map((n) => (
                  <button
                    key={n.id}
                    {...stylex.props(pop.item, !n.read && pop.unread)}
                    onClick={() => { markRead(n.id); setNotifOpen(false); if (n.link) navigate({ to: n.link }); }}
                  >
                    <span {...stylex.props(pop.itemTop)}>{!n.read && <span {...stylex.props(pop.unreadDot)} />} {n.text}</span>
                    <span {...stylex.props(pop.itemSub)}>{n.detail}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        <div ref={acctRef} {...stylex.props(top.rel)}>
          <button {...stylex.props(top.acct)} onClick={() => setAcctOpen((v) => !v)} aria-haspopup="menu" aria-expanded={acctOpen}>
            <span {...stylex.props(top.avatar)} aria-hidden>YO</span>
            <span {...stylex.props(top.acctText)}>You</span>
            <ChevronDown size={14} />
          </button>
          {acctOpen && (
            <div role="menu" {...stylex.props(pop.box)} style={{ right: 0 }}>
              <div {...stylex.props(pop.head)}><div><strong>Your On-call</strong><div {...stylex.props(pop.itemSub)}>Secondary · Payments · starts 12:00 PM</div></div></div>
              <button {...stylex.props(pop.item)} role="menuitem" onClick={() => { setAcctOpen(false); navigate({ to: '/on-call' }); }}>View my schedule</button>
              <button {...stylex.props(pop.item)} role="menuitem" onClick={() => { setAcctOpen(false); navigate({ to: '/settings' }); }}>Profile & preferences</button>
              <button {...stylex.props(pop.item)} role="menuitem" onClick={() => { setAcctOpen(false); openCreate(); }}>Declare an incident</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

const shell = stylex.create({
  page: { display: 'flex', minHeight: '100vh', backgroundColor: tokens.bg },
  skip: {
    position: 'absolute', left: -9999, top: 8, backgroundColor: tokens.accent, color: '#fff',
    padding: '8px 14px', borderRadius: 8, zIndex: 200, ':focus': { left: 8 },
  },
  side: {
    width: 248, flexShrink: 0, backgroundColor: tokens.sidebar, color: '#e2e8f0',
    position: 'sticky', top: 0, height: '100vh', display: { default: 'block', '@media (max-width: 900px)': 'none' },
  },
  main: { flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' },
  content: { padding: 24, maxWidth: 1280, width: '100%', marginLeft: 'auto', marginRight: 'auto', paddingBottom: 96 },
  bottomNav: {
    display: { default: 'none', '@media (max-width: 900px)': 'flex' },
    position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: tokens.sidebar,
    padding: '8px 4px calc(8px + env(safe-area-inset-bottom))', zIndex: 50, justifyContent: 'space-around',
  },
  bottomLink: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, color: tokens.sidebarMuted, textDecoration: 'none', fontSize: 11, padding: '4px 8px' },
  bottomLabel: { fontSize: 10, fontWeight: 600 },
  drawerWrap: { position: 'fixed', top: 0, right: 0, bottom: 0, left: 0, zIndex: 80, display: { default: 'none', '@media (max-width: 900px)': 'block' } },
  scrim: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, backgroundColor: 'rgba(15,23,42,0.55)' },
  drawer: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 272, backgroundColor: tokens.sidebar, overflowY: 'auto' },
});

const side = stylex.create({
  inner: { display: 'flex', flexDirection: 'column', height: '100vh', padding: 16, gap: 14, overflowY: 'auto' },
  brand: { display: 'flex', alignItems: 'center', gap: 10 },
  logo: {
    width: 34, height: 34, borderRadius: 10, backgroundColor: tokens.accent, color: '#fff',
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  brandName: { display: 'block', fontWeight: 800, fontSize: 16, color: '#fff', letterSpacing: '-0.01em' },
  brandSub: { display: 'block', fontSize: 11, color: tokens.sidebarMuted },
  create: {
    display: 'flex', alignItems: 'center', gap: 8, backgroundColor: '#fff', color: tokens.sidebar,
    borderWidth: 0, borderRadius: 9, padding: '9px 12px', fontWeight: 700, fontSize: 13, cursor: 'pointer',
    width: '100%', ':hover': { backgroundColor: '#e0e7ff' },
  },
  kbd: {
    marginLeft: 'auto', fontSize: 11, backgroundColor: 'rgba(12,19,34,0.08)', borderRadius: 5,
    padding: '1px 7px', fontFamily: 'inherit',
  },
  nav: { display: 'flex', flexDirection: 'column', gap: 2 },
  link: {
    display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 8,
    color: tokens.sidebarMuted, textDecoration: 'none', fontSize: 13.5, fontWeight: 600,
    ':hover': { backgroundColor: tokens.sidebar2, color: '#fff' },
  },
  linkActive: { backgroundColor: tokens.sidebar2, color: '#fff' },
  linkLabel: { flex: 1 },
  count: { fontSize: 11, fontWeight: 800, backgroundColor: tokens.danger, color: '#fff', borderRadius: 999, minWidth: 20, height: 20, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', paddingLeft: 6, paddingRight: 6 },
  countWarn: { fontSize: 11, fontWeight: 800, backgroundColor: '#b45309', color: '#fff', borderRadius: 999, minWidth: 20, height: 20, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', paddingLeft: 6, paddingRight: 6 },
  foot: { marginTop: 'auto', borderTopWidth: 1, borderTopStyle: 'solid', borderTopColor: tokens.sidebarLine, paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 8 },
  health: { display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: 700, color: '#fca5a5' },
  footText: { fontSize: 11, color: tokens.sidebarMuted, margin: 0, lineHeight: 1.5 },
});

const top = stylex.create({
  bar: {
    display: 'flex', alignItems: 'center', gap: 12, padding: '12px 24px',
    backgroundColor: tokens.surface, borderBottomWidth: 1, borderBottomStyle: 'solid', borderBottomColor: tokens.line,
    position: 'sticky', top: 0, zIndex: 40,
  },
  menu: {
    display: { default: 'none', '@media (max-width: 900px)': 'inline-flex' },
    borderWidth: 1, borderStyle: 'solid', borderColor: tokens.line, backgroundColor: '#fff',
    borderRadius: 8, width: 36, height: 36, alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
  },
  wsWrap: { position: 'relative' },
  ws: { display: 'flex', alignItems: 'center', gap: 8, borderWidth: 0, backgroundColor: 'transparent', cursor: 'pointer', padding: '6px 8px', borderRadius: 8, fontWeight: 700, fontSize: 14, color: tokens.ink },
  wsDot: { width: 10, height: 10, borderRadius: 3, backgroundColor: tokens.ok },
  wsText: { maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: { default: 'inline', '@media (max-width: 640px)': 'none' } },
  search: {
    display: 'flex', alignItems: 'center', gap: 8, flex: 1, maxWidth: 520, marginLeft: 'auto', marginRight: 'auto',
    borderWidth: 1, borderStyle: 'solid', borderColor: tokens.line, backgroundColor: tokens.surface2,
    borderRadius: 9, padding: '8px 12px', cursor: 'pointer', color: tokens.muted, fontSize: 13,
  },
  searchText: { flex: 1, textAlign: 'left', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: { default: 'block', '@media (max-width: 640px)': 'none' } },
  kbd: { fontSize: 11, backgroundColor: '#fff', borderWidth: 1, borderStyle: 'solid', borderColor: tokens.line, borderRadius: 5, padding: '1px 7px', fontFamily: 'inherit' },
  actions: { display: 'flex', alignItems: 'center', gap: 6, marginLeft: 'auto' },
  rel: { position: 'relative' },
  iconBtn: {
    position: 'relative', width: 36, height: 36, borderRadius: 9, borderWidth: 1, borderStyle: 'solid',
    borderColor: tokens.line, backgroundColor: '#fff', cursor: 'pointer', display: 'inline-flex',
    alignItems: 'center', justifyContent: 'center', color: tokens.ink2, ':hover': { backgroundColor: tokens.surface2 },
  },
  dot: { position: 'absolute', top: -6, right: -6, backgroundColor: tokens.danger, color: '#fff', fontSize: 10, fontWeight: 800, borderRadius: 999, minWidth: 18, height: 18, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', paddingLeft: 4, paddingRight: 4 },
  acct: { display: 'flex', alignItems: 'center', gap: 7, borderWidth: 0, backgroundColor: 'transparent', cursor: 'pointer', padding: 4, borderRadius: 8 },
  avatar: { width: 30, height: 30, borderRadius: '50%', backgroundColor: '#0d9488', color: '#fff', fontSize: 11, fontWeight: 800, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' },
  acctText: { fontSize: 13, fontWeight: 700, color: tokens.ink, display: { default: 'inline', '@media (max-width: 640px)': 'none' } },
});

const pop = stylex.create({
  box: {
    position: 'absolute', top: 'calc(100% + 8px)', width: 300, backgroundColor: '#fff',
    borderWidth: 1, borderStyle: 'solid', borderColor: tokens.line, borderRadius: 12, overflow: 'hidden',
    boxShadow: '0 16px 48px rgba(15,23,42,0.18)', zIndex: 60,
  },
  head: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', borderBottomWidth: 1, borderBottomStyle: 'solid', borderBottomColor: tokens.line, fontSize: 13 },
  link: { borderWidth: 0, backgroundColor: 'transparent', color: tokens.accent, fontWeight: 700, fontSize: 12, cursor: 'pointer' },
  list: { maxHeight: 380, overflowY: 'auto' },
  item: { display: 'block', width: '100%', textAlign: 'left', borderWidth: 0, backgroundColor: 'transparent', padding: '10px 14px', cursor: 'pointer', borderBottomWidth: 1, borderBottomStyle: 'solid', borderBottomColor: '#f1f5f9', ':hover': { backgroundColor: tokens.surface2 } },
  unread: { backgroundColor: '#f5f7ff' },
  itemTop: { display: 'flex', gap: 7, alignItems: 'flex-start', fontSize: 13, fontWeight: 600, color: tokens.ink, lineHeight: 1.4 },
  itemSub: { display: 'block', fontSize: 12, color: tokens.muted, marginTop: 2, fontWeight: 400 },
  unreadDot: { width: 8, height: 8, borderRadius: '50%', backgroundColor: tokens.accent, marginTop: 5, flexShrink: 0 },
});
