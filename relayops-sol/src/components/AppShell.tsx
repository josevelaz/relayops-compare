import * as stylex from '@stylexjs/stylex'
import type { ReactNode } from 'react'
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Bell,
  Box,
  CalendarClock,
  ChevronDown,
  CircleGauge,
  FileCheck2,
  GitCommitHorizontal,
  Menu,
  Plus,
  Radio,
  Search,
  Settings,
  Siren,
  Users,
  X,
  Zap,
} from 'lucide-react'
import { s } from '../styles'
import { Avatar, IconButton } from './ui'

export const sectionTitles: Record<string, string> = {
  overview: 'Overview',
  incidents: 'Incidents',
  alerts: 'Alerts',
  services: 'Services',
  deployments: 'Deployments',
  'on-call': 'On-call',
  analytics: 'Analytics',
  postmortems: 'Postmortems',
  teams: 'Teams',
  settings: 'Settings',
}

const navGroups = [
  {
    label: 'Operations',
    items: [
      { id: 'overview', label: 'Overview', icon: CircleGauge },
      { id: 'incidents', label: 'Incidents', icon: Siren, count: 3 },
      { id: 'alerts', label: 'Alerts', icon: AlertTriangle, count: 17 },
      { id: 'services', label: 'Services', icon: Box },
      { id: 'deployments', label: 'Deployments', icon: GitCommitHorizontal },
      { id: 'on-call', label: 'On-call', icon: CalendarClock },
    ],
  },
  {
    label: 'Improve',
    items: [
      { id: 'analytics', label: 'Analytics', icon: BarChart3 },
      { id: 'postmortems', label: 'Postmortems', icon: FileCheck2 },
      { id: 'teams', label: 'Teams', icon: Users },
    ],
  },
  {
    label: 'Workspace',
    items: [{ id: 'settings', label: 'Settings', icon: Settings }],
  },
]

function Sidebar({
  current,
  mobile,
  onNavigate,
  onClose,
  onWorkspace,
}: {
  current: string
  mobile?: boolean
  onNavigate: (section: string) => void
  onClose?: () => void
  onWorkspace: () => void
}) {
  return (
    <aside {...stylex.props(s.sidebar, mobile && s.sidebarMobile)}>
      <div {...stylex.props(s.brandWrap)}>
        <div {...stylex.props(s.brand)}>
          <span {...stylex.props(s.brandMark)}><Radio size={16} strokeWidth={2.5} /></span>
          RelayOps
        </div>
        {mobile && onClose ? <button type="button" aria-label="Close navigation" onClick={onClose} {...stylex.props(s.navItem)}><X size={15} /></button> : <span {...stylex.props(s.envTag)}>Live</span>}
      </div>
      <button type="button" {...stylex.props(s.workspace)} onClick={onWorkspace}>
        <span {...stylex.props(s.workspaceIcon)}><Activity size={14} /></span>
        <span {...stylex.props(s.workspaceText)}>
          <span {...stylex.props(s.workspaceName)}>Production Engineering</span>
          <span {...stylex.props(s.workspaceOrg)}>Northstar Labs</span>
        </span>
        <ChevronDown size={13} />
      </button>
      <nav aria-label="Main navigation" {...stylex.props(s.nav)}>
        {navGroups.map((group) => (
          <div key={group.label}>
            <div {...stylex.props(s.navLabel)}>{group.label}</div>
            {group.items.map(({ id, label, icon: Icon, count }) => (
              <a
                key={id}
                href={`/?section=${id}`}
                aria-label={label}
                aria-current={current === id ? 'page' : undefined}
                {...stylex.props(s.navItem, current === id && s.navItemActive)}
                onClick={(event) => { event.preventDefault(); onNavigate(id); onClose?.() }}
              >
                <Icon {...stylex.props(s.navIcon)} />
                {label}
                {count ? <span {...stylex.props(s.navCount)}>{count}</span> : null}
              </a>
            ))}
          </div>
        ))}
      </nav>
      <div {...stylex.props(s.sidebarFooter)}>
        <div {...stylex.props(s.statusLine)}><span {...stylex.props(s.statusDot)} />Platform systems operational</div>
      </div>
    </aside>
  )
}

export function AppShell({
  children,
  current,
  mobileNavOpen,
  notificationOpen,
  unreadCount,
  onNavigate,
  onMobileNav,
  onSearch,
  onQuickActions,
  onNotifications,
  onWorkspace,
  onAccount,
  notificationPanel,
}: {
  children: ReactNode
  current: string
  mobileNavOpen: boolean
  notificationOpen: boolean
  unreadCount: number
  onNavigate: (section: string) => void
  onMobileNav: (open: boolean) => void
  onSearch: () => void
  onQuickActions: () => void
  onNotifications: () => void
  onWorkspace: () => void
  onAccount: () => void
  notificationPanel?: ReactNode
}) {
  return (
    <div {...stylex.props(s.app, s.shell)}>
      <Sidebar current={current} onNavigate={onNavigate} onWorkspace={onWorkspace} />
      {mobileNavOpen ? (
        <>
          <button type="button" aria-label="Close navigation" {...stylex.props(s.sidebarBackdrop)} onClick={() => onMobileNav(false)} />
          <Sidebar mobile current={current} onNavigate={onNavigate} onClose={() => onMobileNav(false)} onWorkspace={onWorkspace} />
        </>
      ) : null}
      <main {...stylex.props(s.main)}>
        <header {...stylex.props(s.topbar)}>
          <span {...stylex.props(s.mobileMenu)}><IconButton icon={Menu} label="Open navigation" onClick={() => onMobileNav(true)} /></span>
          <button type="button" {...stylex.props(s.searchButton)} onClick={onSearch}>
            <Search size={14} />
            <span {...stylex.props(s.searchText)}>Search incidents, services, people…</span>
            <kbd {...stylex.props(s.shortcut)}>⌘ K</kbd>
          </button>
          <span {...stylex.props(s.hideMobile)}><IconButton icon={Plus} label="Quick create" onClick={onQuickActions} /></span>
          <button type="button" aria-label={`Notifications, ${unreadCount} unread`} title="Notifications" {...stylex.props(s.iconButton)} onClick={onNotifications}>
            <Bell {...stylex.props(s.icon)} />
            {unreadCount ? <span {...stylex.props(s.notificationDot)} /> : null}
          </button>
          <button type="button" aria-label="Open account menu" {...stylex.props(s.avatarButton)} onClick={onAccount}>
            <Avatar name="Alex Morgan" />
          </button>
          {notificationOpen ? notificationPanel : null}
        </header>
        <div {...stylex.props(s.content)}>{children}</div>
      </main>
      <button type="button" aria-label="Open quick actions" title="Quick actions" onClick={onQuickActions} {...stylex.props(s.fab)}>
        <Zap size={17} />
      </button>
    </div>
  )
}
