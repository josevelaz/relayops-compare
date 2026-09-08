import * as stylex from '@stylexjs/stylex';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from '@tanstack/react-router';
import { Activity, ArrowUpRight, Bell, BookOpen, Box, ChartNoAxesCombined, Check, ChevronDown, ChevronRight, ChevronsUpDown, CircleHelp, Command, Compass, FileText, GitBranch, Headphones, LayoutDashboard, Menu, Plus, Search, Settings2, ShieldAlert, Users, X, Zap, type LucideIcon } from 'lucide-react';
import { useStore } from '../state/store';
import { ActionsContext, type CreateOptions } from '../state/actions';
import { Overview } from '../pages/Overview';
import { Incidents } from '../pages/Incidents';
import { IncidentDetail } from '../pages/IncidentDetail';
import { Alerts } from '../pages/Alerts';
import { Services, ServiceDetail } from '../pages/Services';
import { Deployments } from '../pages/Deployments';
import { OnCall } from '../pages/OnCall';
import { Analytics } from '../pages/Analytics';
import { Postmortems, PostmortemDetail } from '../pages/Postmortems';
import { Teams, TeamDetail } from '../pages/Teams';
import { Settings } from '../pages/Settings';
import { CreateIncident } from './CreateIncident';
import { CommandSearch } from './CommandSearch';
import { Notifications } from './Notifications';
import { AppLink, Avatar, Badge, Button, Modal, Panel, Person, ui } from './ui';

const nav: { label: string; path: string; icon: LucideIcon; group?: string }[] = [
  { label: 'Overview', path: '/', icon: LayoutDashboard, group: 'WORKSPACE' },
  { label: 'Incidents', path: '/incidents', icon: ShieldAlert },
  { label: 'Alerts', path: '/alerts', icon: Bell },
  { label: 'Services', path: '/services', icon: Box },
  { label: 'Deployments', path: '/deployments', icon: GitBranch },
  { label: 'On-call', path: '/on-call', icon: Headphones, group: 'COORDINATE' },
  { label: 'Teams', path: '/teams', icon: Users },
  { label: 'Analytics', path: '/analytics', icon: ChartNoAxesCombined, group: 'IMPROVE' },
  { label: 'Postmortems', path: '/postmortems', icon: FileText },
];
const s = stylex.create({
  app: { minHeight: '100dvh' },
  skip: { position: 'fixed', top: { default: -70, ':focus': 10 }, left: { default: 240, '@media (max-width: 650px)': 15 }, zIndex: 100, padding: 15, backgroundColor: '#fff', color: '#176d4b' },
  sidebar: { position: 'fixed', top: 0, left: 0, bottom: 0, width: { default: 220, '@media (max-width: 1150px)': 72, '@media (max-width: 650px)': 240 }, backgroundColor: '#103e34', color: '#d7e5db', zIndex: 50, display: { default: 'flex', '@media (max-width: 650px)': 'none' }, flexDirection: 'column', borderRight: '1px solid #143e33' },
  sidebarOpen: { display: 'flex', width: 240 },
  brand: { display: 'flex', alignItems: 'center', gap: 10, padding: { default: '26px 23px', '@media (max-width: 1150px)': '24px 19px' }, height: 79 },
  wordmark: { fontFamily: 'Manrope, sans-serif', fontSize: 22, fontWeight: 750, letterSpacing: '-.9px', color: '#f0f7f1' },
  logo: { width: 29, height: 29, flexShrink: 0 },
  text: { display: { default: 'block', '@media (max-width: 1150px)': 'none' } },
  expanded: { display: 'block' },
  workspace: { border: '1px solid #38604f', borderRadius: 7, margin: { default: '8px 15px 18px', '@media (max-width: 1150px)': '5px 13px 18px' }, backgroundColor: { default: '#194b3e', ':hover': '#205544' }, padding: { default: '12px 10px', '@media (max-width: 1150px)': '10px 6px' }, display: 'flex', alignItems: 'center', gap: 9, color: '#dceadf', textAlign: 'left' },
  workspaceIcon: { width: 27, height: 27, backgroundColor: '#e3eddf', color: '#315b40', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  orgName: { fontSize: 11, fontWeight: 600, marginBottom: 4, color: '#e2ede4' },
  workspaceSub: { fontSize: 9, color: '#8caf9b', whiteSpace: 'nowrap' },
  nav: { flex: 1, padding: '0 13px', overflowY: 'auto' },
  navGroup: { fontSize: 8, fontWeight: 500, letterSpacing: '1.4px', color: '#92b49d', padding: '17px 11px 10px', display: { default: 'block', '@media (max-width: 1150px)': 'none' } },
  navLink: { display: 'flex', alignItems: 'center', gap: 11, padding: { default: '11px 12px', '@media (max-width: 1150px)': '12px 13px' }, color: { default: '#a6c0af', ':hover': '#e1eee3' }, backgroundColor: { default: 'transparent', ':hover': '#1b4d3d' }, borderRadius: 6, fontSize: 12, marginBottom: 3, fontWeight: 450, minHeight: 38, position: 'relative', whiteSpace: 'nowrap', transition: 'background-color .15s' },
  navActive: { backgroundColor: { default: '#285b47', ':hover': '#2d654e' }, color: '#edf7ed' },
  activeMark: { position: 'absolute', left: 0, top: 13, bottom: 13, width: 2, backgroundColor: '#a9d8ae', borderRadius: 2 },
  navCount: { marginLeft: 'auto', backgroundColor: '#8c5145', border: '1px solid #a06856', borderRadius: 4, color: '#ffe9da', minWidth: 18, height: 17, display: { default: 'flex', '@media (max-width: 1150px)': 'none' }, alignItems: 'center', justifyContent: 'center', fontSize: 9, padding: '0 4px' },
  alertCount: { backgroundColor: '#365c48', color: '#c6d9c4', borderColor: '#476e54' },
  sidebarBottom: { padding: '0 13px 16px' },
  sync: { margin: '15px 6px 19px', padding: '12px 11px', border: '1px solid #2b5440', borderRadius: 7, backgroundColor: '#174532' },
  syncTitle: { display: 'flex', alignItems: 'center', gap: 7, fontSize: 10, color: '#b1ccb5' },
  syncText: { marginTop: 5, fontSize: 9, color: '#709779' },
  user: { display: 'flex', gap: 9, alignItems: 'center', padding: '13px 8px 0', width: '100%', backgroundColor: 'transparent', border: 0, borderTop: '1px solid #2e5541', textAlign: 'left', color: '#cde0cf' },
  frame: { marginLeft: { default: 220, '@media (max-width: 1150px)': 72, '@media (max-width: 650px)': 0 }, minWidth: 0 },
  topbar: { height: 65, backgroundColor: '#ffffffee', backdropFilter: 'blur(8px)', borderBottom: '1px solid #e5eaea', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: { default: '0 30px', '@media (max-width: 650px)': '0 16px' }, position: 'sticky', top: 0, zIndex: 30, gap: 10 },
  breadcrumb: { display: 'flex', alignItems: 'center', gap: 12, fontSize: 11, color: '#939f98', whiteSpace: 'nowrap', minWidth: 0 },
  breadcrumbOrg: { display: { default: 'inline', '@media (max-width: 850px)': 'none' } },
  topActions: { display: 'flex', alignItems: 'center', gap: 14 },
  topSearch: { display: 'flex', alignItems: 'center', gap: 9, border: '1px solid #e9edeb', backgroundColor: { default: '#f8faf9', ':hover': '#f1f5f2' }, color: '#93a099', padding: '7px 9px', borderRadius: 6, width: { default: 232, '@media (max-width: 850px)': 180, '@media (max-width: 650px)': 33 }, height: 33, textAlign: 'left', fontSize: 11 },
  searchText: { flex: 1, display: { default: 'inline', '@media (max-width: 650px)': 'none' } },
  key: { display: { default: 'inline-flex', '@media (max-width: 650px)': 'none' }, alignItems: 'center', gap: 2, border: '1px solid #e0e7e2', backgroundColor: '#fff', borderRadius: 3, padding: '2px 4px', fontSize: 9, color: '#9caaa1' },
  topDivider: { width: 1, height: 20, backgroundColor: '#e7ece8', display: { default: 'block', '@media (max-width: 650px)': 'none' } },
  notifyButton: { position: 'relative' },
  unread: { position: 'absolute', right: 6, top: 6, width: 5, height: 5, backgroundColor: '#bf735c', borderRadius: '50%', border: '1px solid white' },
  menuButton: { display: { default: 'none', '@media (max-width: 650px)': 'inline-flex' } },
  main: { maxWidth: 1660, padding: { default: '28px 30px 30px', '@media (max-width: 1150px)': '25px 24px', '@media (max-width: 650px)': '24px 16px' }, margin: '0 auto', minHeight: 'calc(100dvh - 65px)' },
  toast: { position: 'fixed', bottom: 25, left: { default: 'calc(50% + 80px)', '@media (max-width: 650px)': '50%' }, transform: 'translateX(-50%)', zIndex: 100, backgroundColor: '#204b36', color: '#e6f2e7', border: '1px solid #53775d', padding: '13px 19px', borderRadius: 9, boxShadow: '0 5px 25px #233a3020', display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, maxWidth: 'calc(100vw - 24px)', width: 'max-content' },
  drawerBackdrop: { position: 'fixed', inset: 0, border: 0, backgroundColor: '#18352d70', backdropFilter: 'blur(2px)', zIndex: 45, display: { default: 'none', '@media (max-width: 650px)': 'block' } },
  workspaceOption: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, width: '100%', padding: 17, backgroundColor: { default: '#f8fbf9', ':hover': '#eff7f1' }, border: '1px solid #e0eae2', borderRadius: 7, textAlign: 'left', marginTop: 12 },
  helpRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 0', borderBottom: '1px solid #ecf1ed', color: '#738b79', fontSize: 12 },
});

export function App() {
  const { data, setData, toast, notify } = useStore(); const navigate = useNavigate(); const location = useLocation();
  const [mobileNav, setMobileNav] = useState(false); const [createOptions, setCreateOptions] = useState<CreateOptions | null>(null); const [searchQuery, setSearchQuery] = useState<string | null>(null); const [notifications, setNotifications] = useState(false); const [popover, setPopover] = useState<'workspace' | 'account' | 'help' | null>(null);
  const go = (path: string) => { if (path === '/') void navigate({ to: '/' }); else void navigate({ to: '/$', params: { _splat: path.replace(/^\//, '') } }); };
  const createIncident = (options: CreateOptions = {}) => setCreateOptions(options); const search = (query = '') => setSearchQuery(query);
  const [section, detail] = location.pathname.split('/').filter(Boolean); const title = nav.find(n => n.path === `/${section ?? ''}`)?.label ?? (section === 'settings' ? 'Settings' : 'Overview');
  useEffect(() => { setMobileNav(false); }, [location.pathname]);
  useEffect(() => { const handler = (e: KeyboardEvent) => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setSearchQuery(q => q === null ? '' : null); } if (e.key === 'Escape') setMobileNav(false); }; window.addEventListener('keydown', handler); return () => window.removeEventListener('keydown', handler); }, []);
  let page;
  switch (section) {
    case undefined: page = <Overview />; break;
    case 'incidents': page = detail ? <IncidentDetail key={detail} id={detail} /> : <Incidents />; break;
    case 'alerts': page = <Alerts selectedId={detail} />; break;
    case 'services': page = detail ? <ServiceDetail key={detail} slug={detail} /> : <Services />; break;
    case 'deployments': page = <Deployments selectedId={detail} />; break;
    case 'on-call': page = <OnCall />; break;
    case 'analytics': page = <Analytics />; break;
    case 'postmortems': page = detail && detail !== 'new' ? <PostmortemDetail key={detail} id={detail} /> : <Postmortems key={detail ?? 'list'} initiallyCreate={detail === 'new'} />; break;
    case 'teams': page = detail ? <TeamDetail key={detail} slug={detail} /> : <Teams />; break;
    case 'settings': page = <Settings section={detail ?? 'workspace'} />; break;
    default: page = <Panel title="This page could not be found"><AppLink to="/">Return to overview</AppLink></Panel>;
  }
  const navContent = (item: typeof nav[number], active: boolean) => <>{active && <span {...stylex.props(s.activeMark)} />}<item.icon size={17} strokeWidth={1.65} /><span {...stylex.props(s.text, mobileNav && s.expanded)}>{item.label}</span>{['Incidents', 'Alerts'].includes(item.label) && <span {...stylex.props(s.navCount, item.label === 'Alerts' && s.alertCount, mobileNav && s.expanded)}>{item.label === 'Incidents' ? data.incidents.filter(i => i.status !== 'Resolved').length : data.alerts.filter(a => a.state === 'Firing').length}</span>}</>;
  return <ActionsContext.Provider value={{ go, createIncident, search }}><div {...stylex.props(s.app)}><a href="#main-content" {...stylex.props(s.skip)}>Skip to main content</a>{mobileNav && <button aria-label="Close navigation" onClick={() => setMobileNav(false)} {...stylex.props(s.drawerBackdrop)} />}<aside aria-label="Application sidebar" {...stylex.props(s.sidebar, mobileNav && s.sidebarOpen)}><AppLink to="/" subtle><div {...stylex.props(s.brand)}><svg viewBox="0 0 32 32" aria-hidden="true" {...stylex.props(s.logo)}><path d="M3 4h15c6 0 10 4 10 9s-4 9-10 9h-5L3 12h14a3 3 0 0 0 0-6H5z" fill="#c1e2c1" /><path d="m12 23 7-2 10 10H16z" fill="#c1e2c1" /></svg><span {...stylex.props(s.wordmark, s.text, mobileNav && s.expanded)}>RelayOps<span style={{ color: '#93bf95' }}>.</span></span></div></AppLink><button onClick={() => setPopover('workspace')} aria-label="Select workspace" {...stylex.props(s.workspace)}><span {...stylex.props(s.workspaceIcon)}><Compass size={18} strokeWidth={1.5} /></span><div {...stylex.props(ui.grow, s.text, mobileNav && s.expanded)}><div {...stylex.props(s.orgName)}>{data.organization}</div><div {...stylex.props(s.workspaceSub)}>{data.workspace}</div></div><ChevronsUpDown size={12} {...stylex.props(s.text, mobileNav && s.expanded)} /></button><nav aria-label="Main navigation" {...stylex.props(s.nav)}>{nav.map(item => { const active = item.path === '/' ? !section : item.path === `/${section}`; return <div key={item.path}>{item.group && <p {...stylex.props(s.navGroup, mobileNav && s.expanded)}>{item.group}</p>}{item.path === '/' ? <Link to="/" aria-current={active ? 'page' : undefined} aria-label={item.label} title={item.label} {...stylex.props(s.navLink, active && s.navActive)}>{navContent(item, active)}</Link> : <Link to="/$" params={{ _splat: item.path.slice(1) }} aria-current={active ? 'page' : undefined} aria-label={item.label} title={item.label} {...stylex.props(s.navLink, active && s.navActive)}>{navContent(item, active)}</Link>}</div>; })}</nav><div {...stylex.props(s.sidebarBottom)}><Link to="/$" params={{ _splat: 'settings' }} aria-label="Settings" title="Settings" {...stylex.props(s.navLink, section === 'settings' && s.navActive)}><Settings2 size={17} strokeWidth={1.65} /><span {...stylex.props(s.text, mobileNav && s.expanded)}>Settings</span></Link><button aria-label="Help and keyboard shortcuts" onClick={() => setPopover('help')} {...stylex.props(s.navLink)} style={{ border: 0, width: '100%' }}><CircleHelp size={17} strokeWidth={1.65} /><span {...stylex.props(s.text, mobileNav && s.expanded)}>Help & shortcuts</span><ArrowUpRight size={12} {...stylex.props(s.text, mobileNav && s.expanded)} /></button><div {...stylex.props(s.sync, s.text, mobileNav && s.expanded)}><p {...stylex.props(s.syncTitle)}><span {...stylex.props(ui.dot)} />Your operations, in sync.</p><p {...stylex.props(s.syncText)}>Demo workspace · Local data</p></div><button onClick={() => setPopover('account')} aria-label="User account" {...stylex.props(s.user)}><Avatar name="Alex Morgan" size={29} /><div {...stylex.props(ui.grow, s.text, mobileNav && s.expanded)}><div {...stylex.props(s.orgName)}>Alex Morgan</div><div {...stylex.props(s.workspaceSub)}>Platform Engineer</div></div><ChevronsUpDown size={12} {...stylex.props(s.text, mobileNav && s.expanded)} /></button></div></aside><div {...stylex.props(s.frame)}><header {...stylex.props(s.topbar)}><div {...stylex.props(s.breadcrumb)}><button onClick={() => setMobileNav(!mobileNav)} aria-label="Open navigation" aria-expanded={mobileNav} {...stylex.props(ui.button, ui.ghost, ui.iconButton, s.menuButton)}><Menu size={19} /></button><span {...stylex.props(s.breadcrumbOrg)}>Workspace</span><ChevronRight size={12} {...stylex.props(s.breadcrumbOrg)} /><span {...stylex.props(ui.strong)}>{title}</span>{detail && <><ChevronRight size={12} /><span {...stylex.props(s.breadcrumbOrg)}>{detail.startsWith('INC') || detail.startsWith('PM') ? detail : detail.replaceAll('-', ' ')}</span></>}</div><div {...stylex.props(s.topActions)}><button onClick={() => search()} {...stylex.props(s.topSearch)} aria-label="Global search"><Search size={14} /><span {...stylex.props(s.searchText)}>Search anything…</span><kbd {...stylex.props(s.key)}>⌘ K</kbd></button><span {...stylex.props(s.topDivider)} /><Button icon variant="ghost" onClick={() => search()} aria-label="Quick actions"><Plus size={18} /></Button><div {...stylex.props(s.notifyButton)}><Button icon variant="ghost" onClick={() => setNotifications(true)} aria-label={`Notifications, ${data.notifications.filter(n => !n.read).length} unread`}><Bell size={17} /></Button>{data.notifications.some(n => !n.read) && <span {...stylex.props(s.unread)} />}</div></div></header><main id="main-content" tabIndex={-1} {...stylex.props(s.main)}>{page}</main></div>{toast && <div role="status" {...stylex.props(s.toast)}><Check size={16} />{toast}</div>}
  {createOptions && <CreateIncident options={createOptions} onClose={() => setCreateOptions(null)} />}{searchQuery !== null && <CommandSearch initialQuery={searchQuery} onClose={() => setSearchQuery(null)} />}{notifications && <Notifications onClose={() => setNotifications(false)} />}
  {popover === 'workspace' && <Modal title="Your workspaces" onClose={() => setPopover(null)}><Person name="Northstar Labs" subtitle="Organization · 85 engineers" />{['Production Engineering', 'Reliability Review'].map(name => <button key={name} {...stylex.props(s.workspaceOption)} onClick={() => { setData(d => ({ ...d, workspace: name })); setPopover(null); notify(`Switched to ${name}`); }}><div><strong>{name}</strong><p {...stylex.props(ui.tableSub)}>{name === 'Production Engineering' ? 'Incident response & operational intelligence' : 'Shared Northstar data · Reliability review workspace'}</p></div>{data.workspace === name && <Check size={17} color="#318d55" />}</button>)}<p {...stylex.props(ui.subtitle)}>Both demo workspaces share the Northstar operational dataset.</p></Modal>}
  {popover === 'account' && <Modal title="Your account" onClose={() => setPopover(null)}><div {...stylex.props(ui.stack)}><Person name="Alex Morgan" subtitle="alex.morgan@northstar.io" /><div {...stylex.props(ui.row)}><Badge tone="green">Admin</Badge><Badge>Platform</Badge></div><Panel title="Account preferences"><Button onClick={() => { setPopover(null); go('/settings/notifications'); }}><Bell size={14} />Notification preferences</Button><hr {...stylex.props(ui.divider)} /><p {...stylex.props(ui.small, ui.secondary)}>You are signed in to the local demo workspace. Your changes are saved in this browser.</p></Panel></div></Modal>}
  {popover === 'help' && <Modal title="A faster way to respond" onClose={() => setPopover(null)}><div {...stylex.props(ui.callout)}><Zap size={17} />RelayOps brings your incidents, services, and people into one workspace.</div>{[{ label: 'Search & quick actions', key: '⌘ / Ctrl + K' }, { label: 'Navigate search results', key: '↑ / ↓' }, { label: 'Open a search result', key: 'Enter' }, { label: 'Post an incident update', key: '⌘ / Ctrl + Enter' }, { label: 'Close a dialog', key: 'Esc' }].map(k => <div key={k.label} {...stylex.props(s.helpRow)}><span>{k.label}</span><Badge>{k.key}</Badge></div>)}<p {...stylex.props(ui.subtitle)}>This demo is set on September 8, 2026 at 11:08 AM UTC. All changes are local to your browser.</p></Modal>}
  </div></ActionsContext.Provider>;
}
