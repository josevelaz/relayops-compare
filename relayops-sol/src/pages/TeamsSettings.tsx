import * as stylex from '@stylexjs/stylex'
import { useState } from 'react'
import {
  AlertTriangle,
  Bell,
  Box,
  Check,
  ChevronRight,
  CircleUserRound,
  Cog,
  Database,
  ExternalLink,
  Github,
  Globe2,
  KeyRound,
  Link2,
  Mail,
  MessageSquare,
  MoreHorizontal,
  Plus,
  RadioTower,
  Save,
  Settings2,
  ShieldCheck,
  Siren,
  Slack,
  UserPlus,
  Users,
  Webhook,
} from 'lucide-react'
import { people, services, teams, type Incident } from '../data'
import { p, s } from '../styles'
import { Avatar, AvatarStack, Badge, Breadcrumb, Button, HealthBadge, IconButton, Metric, Panel, PanelHeader, PersonLine, Progress, SeverityBadge, StatusBadge } from '../components/ui'

export function TeamsPage({ initialQuery = '', onOpen }: { initialQuery?: string; onOpen: (slug: string) => void }) {
  const visible = teams.filter((team) => `${team.name} ${team.lead} ${team.services.join(' ')}`.toLowerCase().includes(initialQuery.replaceAll('-', ' ').toLowerCase()))
  return (
    <>
      <div {...stylex.props(s.pageHeader)}><div><p {...stylex.props(s.eyebrow)}>Organization</p><h1 {...stylex.props(s.title)}>Teams</h1><p {...stylex.props(s.subtitle)}>Ownership, coverage, and reliability across 12 engineering teams.</p></div><Button variant="primary" icon={Plus}>Create team</Button></div>
      <div {...stylex.props(s.grid3)}><Metric label="Engineers" value="85" footer="Across 12 teams" /><Metric label="Owned services" value="47" footer="100% assigned" trend="positive" /><Metric label="Teams on call" value="5" footer="All critical paths covered" trend="positive" /></div>
      <div {...stylex.props(p.servicesGrid, s.marginTop12)}>
        {visible.map((team) => <section key={team.slug} tabIndex={0} role="button" onClick={() => onOpen(team.slug)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); onOpen(team.slug) } }} {...stylex.props(s.panel, p.serviceCard)}><div {...stylex.props(s.inlineBetween)}><div {...stylex.props(s.inline)}><span {...stylex.props(p.serviceIcon)}><Users size={16} /></span><div><h2 {...stylex.props(s.panelTitle)}>{team.name}</h2><div {...stylex.props(s.rowSecondary)}>{team.members} members · {team.services.length} services</div></div></div><ChevronRight size={15} /></div><div {...stylex.props(s.marginTop16)}><PersonLine name={team.lead} detail="Team lead" /></div><div {...stylex.props(p.serviceHealthLine)}><div><div {...stylex.props(p.serviceStatLabel)}>On call</div><div {...stylex.props(p.serviceStatValue)}>{team.onCall.split(' ')[0]}</div></div><div><div {...stylex.props(p.serviceStatLabel)}>Incidents</div><div {...stylex.props(p.serviceStatValue)}>{team.openIncidents}</div></div><div><div {...stylex.props(p.serviceStatLabel)}>Reliability</div><div {...stylex.props(p.serviceStatValue)}>{team.reliability}</div></div></div><div {...stylex.props(s.wrap, s.marginTop12)}>{team.services.slice(0, 3).map((service) => <Badge key={service}>{service}</Badge>)}</div></section>)}
      </div>
    </>
  )
}

const paymentsMembers = people.slice(0, 6)

export function TeamDetail({ incident, onBack, onNavigate, onToast }: { incident: Incident; onBack: () => void; onNavigate: (section: string, id?: string) => void; onToast: (message: string) => void }) {
  return (
    <>
      <div {...stylex.props(p.detailToolbar)}><Breadcrumb items={['Teams', 'Payments']} onBack={onBack} /><div {...stylex.props(s.headerActions)}><Button icon={MessageSquare}>#team-payments</Button><Button icon={Settings2}>Team settings</Button><Button variant="primary" icon={UserPlus} onClick={() => onToast('Invite flow opened for the Payments team.')}>Add member</Button></div></div>
      <Panel><div {...stylex.props(p.teamHero, s.marginTop16)}><div {...stylex.props(s.inlineBetween)}><div {...stylex.props(s.inline)}><span {...stylex.props(p.serviceIcon)}><Users size={18} /></span><div><h1 {...stylex.props(p.detailTitle, s.noMargin)}>Payments</h1><p {...stylex.props(s.subtitle)}>Owns checkout, payment processing, and billing reliability.</p></div></div><Badge tone={incident.status === 'Resolved' ? 'green' : 'orange'} dot>{incident.status === 'Resolved' ? 'No active major incidents' : '1 active incident'}</Badge></div><div {...stylex.props(p.propertyGrid)}><div><div {...stylex.props(p.propertyLabel)}>Team lead</div><PersonLine name="Sarah Chen" /></div><div><div {...stylex.props(p.propertyLabel)}>Members</div><AvatarStack names={paymentsMembers.map((member) => member.name)} max={6} /></div><div><div {...stylex.props(p.propertyLabel)}>Current on-call</div><PersonLine name="Priya Patel" /></div><div><div {...stylex.props(p.propertyLabel)}>Owned services</div><div {...stylex.props(p.propertyValue)}>3 production</div></div><div><div {...stylex.props(p.propertyLabel)}>30-day reliability</div><div {...stylex.props(p.propertyValue)}>99.94%</div></div></div></div></Panel>
      <div {...stylex.props(s.grid4, s.marginTop12)}><Metric label="Reliability" value="99.94%" footer="Target 99.95%" trend="negative" /><Metric label="Open incidents" value={incident.status === 'Resolved' ? '0' : '1'} footer={incident.status === 'Resolved' ? 'INC-1042 resolved' : `INC-1042 · ${incident.severity}`} trend={incident.status === 'Resolved' ? 'positive' : 'negative'} /><Metric label="Firing alerts" value={incident.status === 'Resolved' ? '3' : '7'} footer={incident.status === 'Resolved' ? 'No critical alerts' : '3 critical · 2 high'} trend={incident.status === 'Resolved' ? 'positive' : 'negative'} /><Metric label="MTTR · quarter" value="39m" footer="11m faster than Q2" trend="positive" /></div>
      <div {...stylex.props(p.pageSplit, s.marginTop12)}>
        <div {...stylex.props(s.column, s.gap12)}>
          <Panel><PanelHeader title="Owned services" meta="3 services" /><div {...stylex.props(s.panelPad)}>{services.filter((service) => service.owner === 'Payments').map((service) => <button key={service.name} type="button" onClick={() => onNavigate('services', service.slug === 'payment-gateway' ? service.slug : undefined)} {...stylex.props(s.commandItem)}><span {...stylex.props(p.serviceIcon)}><Box size={15} /></span><span {...stylex.props(s.grow)}><span {...stylex.props(s.rowPrimary)}>{service.name}</span><span {...stylex.props(s.rowSecondary, s.mono)}>{service.repository} · {service.tier}</span></span><HealthBadge health={service.health} /><ChevronRight size={14} /></button>)}</div></Panel>
          <Panel><PanelHeader title="Team members" meta="6 people" /><div {...stylex.props(s.panelPad, p.servicesGrid)}>{paymentsMembers.map((person) => <div key={person.name} {...stylex.props(p.relationCard)}><Avatar name={person.name} /><div {...stylex.props(s.grow)}><div {...stylex.props(s.rowPrimary)}>{person.name}</div><div {...stylex.props(s.rowSecondary)}>{person.role}</div></div>{person.name === 'Priya Patel' ? <Badge tone="green" dot>On call</Badge> : null}</div>)}</div></Panel>
        </div>
        <aside {...stylex.props(s.column, s.gap12)}>
          <Panel><PanelHeader title={incident.status === 'Resolved' ? 'Recent incident' : 'Active incident'} /><div {...stylex.props(s.panelPad)}><div {...stylex.props(s.wrap)}><SeverityBadge severity={incident.severity} /><StatusBadge status={incident.status} /></div><h3 {...stylex.props(s.sectionTitle, s.marginTop12)}>{incident.title}</h3><p {...stylex.props(s.bodyText)}>{incident.status === 'Resolved' ? 'Customer impact ended. Follow-up work is in progress.' : 'Payment routing config differs across two gateway instances.'}</p><Button variant="primary" onClick={() => onNavigate('incidents', 'INC-1042')}>Open INC-1042</Button></div></Panel>
          <Panel><PanelHeader title="On-call coverage" /><div {...stylex.props(s.panelPad)}><PersonLine name="Priya Patel" detail="Primary · until 12:00 PM" /><hr {...stylex.props(s.divider)} /><PersonLine name="Marcus Johnson" detail="Secondary · until 12:00 PM" /><hr {...stylex.props(s.divider)} /><PersonLine name="Elena Rodriguez" detail="Next primary · starts 12:00 PM" /></div></Panel>
          <Panel><PanelHeader title="Quarterly reliability" /><div {...stylex.props(s.panelPad)}><div {...stylex.props(s.inlineBetween, s.tiny)}><span>SLO attainment</span><strong>97.6%</strong></div><div {...stylex.props(s.marginTop8)}><Progress value={97.6} /></div><div {...stylex.props(s.inlineBetween, s.marginTop16, s.tiny)}><span>Error budget used</span><strong>58%</strong></div><div {...stylex.props(s.marginTop8)}><Progress value={58} /></div></div></Panel>
        </aside>
      </div>
    </>
  )
}

const memberRows = [
  ['Alex Morgan', 'alex.morgan@northstar.dev', 'Admin', 'Active'],
  ['Sarah Chen', 'sarah.chen@northstar.dev', 'Admin', 'Active'],
  ['Marcus Johnson', 'marcus.johnson@northstar.dev', 'Member', 'Active'],
  ['Priya Patel', 'priya.patel@northstar.dev', 'Member', 'Active'],
  ['Liam Brooks', 'liam.brooks@northstar.dev', 'Member', 'Active'],
  ['Noah Williams', 'noah.williams@northstar.dev', 'Viewer', 'Invited'],
]

const integrations = [
  { name: 'GitHub', detail: 'relay-labs · 38 repositories', connected: true, icon: Github },
  { name: 'Slack', detail: 'northstar-labs.slack.com', connected: true, icon: MessageSquare },
  { name: 'Datadog', detail: 'Northstar Production', connected: true, icon: RadioTower },
  { name: 'PagerDuty', detail: '5 escalation policies', connected: true, icon: Bell },
  { name: 'Sentry', detail: '12 projects synced', connected: true, icon: AlertTriangle },
  { name: 'AWS', detail: '3 production accounts', connected: true, icon: Database },
  { name: 'Grafana', detail: 'Not connected', connected: false, icon: BarChartIcon },
]

function BarChartIcon() { return <span>G</span> }

export function SettingsPage({ onToast }: { onToast: (message: string) => void }) {
  const [section, setSection] = useState('Workspace')
  const settingSections = ['Workspace', 'Members', 'Integrations', 'Incident configuration', 'Notifications']
  return (
    <>
      <div {...stylex.props(s.pageHeader)}><div><p {...stylex.props(s.eyebrow)}>Administration</p><h1 {...stylex.props(s.title)}>Settings</h1><p {...stylex.props(s.subtitle)}>Configure the Production Engineering workspace.</p></div></div>
      <div {...stylex.props(p.settingsLayout)}>
        <nav aria-label="Settings sections" {...stylex.props(p.relationColumn)}>{settingSections.map((item) => <button type="button" key={item} onClick={() => setSection(item)} {...stylex.props(s.navItem, section === item && s.segmentActive)}>{item}</button>)}</nav>
        <div>
          {section === 'Workspace' ? <WorkspaceSettings onToast={onToast} /> : null}
          {section === 'Members' ? <MemberSettings onToast={onToast} /> : null}
          {section === 'Integrations' ? <IntegrationSettings onToast={onToast} /> : null}
          {section === 'Incident configuration' ? <IncidentSettings onToast={onToast} /> : null}
          {section === 'Notifications' ? <NotificationSettings onToast={onToast} /> : null}
        </div>
      </div>
    </>
  )
}

function WorkspaceSettings({ onToast }: { onToast: (message: string) => void }) {
  const [name, setName] = useState('Production Engineering')
  return <Panel><PanelHeader title="Workspace" meta="Organization profile and regional defaults" /><div {...stylex.props(s.panelPad, s.column, s.gap16)}><label {...stylex.props(s.field)}><span {...stylex.props(s.label)}>Workspace name</span><input value={name} onChange={(event) => setName(event.target.value)} {...stylex.props(s.input)} /></label><label {...stylex.props(s.field)}><span {...stylex.props(s.label)}>Organization</span><input value="Northstar Labs" readOnly {...stylex.props(s.input)} /></label><div {...stylex.props(s.grid2)}><label {...stylex.props(s.field)}><span {...stylex.props(s.label)}>Organization size</span><select {...stylex.props(s.input)}><option>51–100 engineers</option><option>101–250 engineers</option></select></label><label {...stylex.props(s.field)}><span {...stylex.props(s.label)}>Timezone</span><select {...stylex.props(s.input)}><option>America/Los_Angeles (UTC−07:00)</option><option>America/New_York (UTC−04:00)</option><option>UTC</option></select></label></div><div {...stylex.props(s.inlineBetween)}><span {...stylex.props(s.hint)}>Workspace ID: ws_prodeng_39a2</span><Button variant="primary" icon={Save} onClick={() => onToast('Workspace settings saved.')}>Save changes</Button></div></div></Panel>
}

function MemberSettings({ onToast }: { onToast: (message: string) => void }) {
  return <Panel><PanelHeader title="Members" meta="85 people · 3 seats available" action={<Button size="small" variant="primary" icon={UserPlus} onClick={() => onToast('Member invitation sent.')}>Invite member</Button>} /><div {...stylex.props(s.tableWrap)}><table {...stylex.props(s.table, s.tableCompact)}><thead><tr><th {...stylex.props(s.th)}>Member</th><th {...stylex.props(s.th)}>Email</th><th {...stylex.props(s.th)}>Role</th><th {...stylex.props(s.th)}>Status</th><th {...stylex.props(s.th)} /></tr></thead><tbody>{memberRows.map(([name, email, role, status]) => <tr key={email}><td {...stylex.props(s.td)}><PersonLine name={name} /></td><td {...stylex.props(s.td)}>{email}</td><td {...stylex.props(s.td)}><select defaultValue={role} aria-label={`Role for ${name}`} {...stylex.props(s.select)}><option>Admin</option><option>Member</option><option>Viewer</option></select></td><td {...stylex.props(s.td)}><Badge tone={status === 'Active' ? 'green' : 'orange'} dot>{status}</Badge></td><td {...stylex.props(s.td)}><IconButton icon={MoreHorizontal} label={`Actions for ${name}`} /></td></tr>)}</tbody></table></div></Panel>
}

function IntegrationSettings({ onToast }: { onToast: (message: string) => void }) {
  const [states, setStates] = useState(Object.fromEntries(integrations.map((item) => [item.name, item.connected])))
  return <Panel><PanelHeader title="Integrations" meta="Connect operational data sources and collaboration tools" /><div {...stylex.props(s.panelPad, p.servicesGrid)}>{integrations.map(({ name, detail, icon: Icon }) => { const connected = states[name]; return <div key={name} {...stylex.props(p.relationCard)}><span {...stylex.props(p.serviceIcon)}><Icon size={15} /></span><div {...stylex.props(s.grow)}><div {...stylex.props(s.rowPrimary)}>{name}</div><div {...stylex.props(s.rowSecondary)}>{connected ? detail : 'Not connected'}</div></div>{connected ? <Button size="small" onClick={() => { setStates((current) => ({ ...current, [name]: false })); onToast(`${name} disconnected.`) }}>Manage</Button> : <Button size="small" variant="primary" onClick={() => { setStates((current) => ({ ...current, [name]: true })); onToast(`${name} connected.`) }}>Connect</Button>}</div>})}</div></Panel>
}

function IncidentSettings({ onToast }: { onToast: (message: string) => void }) {
  const [autoCreate, setAutoCreate] = useState(true)
  return <div {...stylex.props(s.column, s.gap12)}><Panel><PanelHeader title="Severity definitions" meta="Used across incident response and reporting" /><div {...stylex.props(s.panelPad)}>{[['SEV0', 'Critical business outage with widespread customer impact'], ['SEV1', 'Major customer impact or complete failure of a critical path'], ['SEV2', 'Partial impact, degraded service, or elevated operational risk'], ['SEV3', 'Minor impact with a safe workaround available']].map(([severity, definition]) => <div key={severity} {...stylex.props(p.deployRow)}><SeverityBadge severity={severity as 'SEV0' | 'SEV1' | 'SEV2' | 'SEV3'} /><span {...stylex.props(s.grow, s.small)}>{definition}</span><IconButton icon={Cog} label={`Edit ${severity}`} /></div>)}</div></Panel><Panel><PanelHeader title="Incident statuses" meta="Workflow states available to responders" /><div {...stylex.props(s.panelPad)}>{[['Investigating', 'Impact is active and responders are diagnosing the issue'], ['Identified', 'The cause is known and mitigation is in progress'], ['Monitoring', 'Mitigation is complete while signals return to normal'], ['Resolved', 'Impact has ended and response work is complete']].map(([status, definition]) => <div key={status} {...stylex.props(p.deployRow)}><Badge tone={status === 'Investigating' ? 'red' : status === 'Identified' ? 'orange' : status === 'Monitoring' ? 'blue' : 'green'} dot>{status}</Badge><span {...stylex.props(s.grow, s.small)}>{definition}</span><IconButton icon={Cog} label={`Edit ${status}`} /></div>)}</div></Panel><Panel><PanelHeader title="Incident behavior" /><div {...stylex.props(s.panelPad, s.column, s.gap16)}><label {...stylex.props(s.field)}><span {...stylex.props(s.label)}>Default incident commander</span><select {...stylex.props(s.input)}><option>Current team's engineering manager</option><option>Current primary on-call</option><option>Leave unassigned</option></select></label><label {...stylex.props(s.field)}><span {...stylex.props(s.label)}>Initial status</span><select {...stylex.props(s.input)}><option>Investigating</option><option>Identified</option></select></label><div {...stylex.props(s.inlineBetween)}><div><div {...stylex.props(s.rowPrimary)}>Automatic incident creation</div><div {...stylex.props(s.rowSecondary)}>Create incidents when a critical alert policy triggers.</div></div><button type="button" role="switch" aria-checked={autoCreate} aria-label="Automatic incident creation" onClick={() => setAutoCreate((value) => !value)} {...stylex.props(p.toggle, autoCreate && p.toggleOn)}><span {...stylex.props(p.toggleThumb, autoCreate && p.toggleThumbOn)} /></button></div><Button variant="primary" icon={Save} onClick={() => onToast('Incident configuration saved.')}>Save configuration</Button></div></Panel></div>
}

function NotificationSettings({ onToast }: { onToast: (message: string) => void }) {
  const [prefs, setPrefs] = useState({ assigned: true, mention: true, sev1: true, deploy: false, oncall: true, digest: true })
  const rows = [
    ['assigned', 'Incident assignments', 'When you are added as commander or responder'],
    ['mention', 'Mentions and comments', 'When a teammate mentions you in an incident'],
    ['sev1', 'SEV0 and SEV1 activity', 'Major incident creation and status changes'],
    ['deploy', 'Deployment changes', 'Failed and rolled-back production deployments'],
    ['oncall', 'On-call reminders', '30 minutes before your shift begins'],
    ['digest', 'Weekly operations digest', 'Monday summary of incidents and reliability'],
  ] as const
  return <Panel><PanelHeader title="Notification preferences" meta="Email, Slack, and in-app delivery" /><div {...stylex.props(s.panelPad)}>{rows.map(([key, title, detail]) => <div key={key} {...stylex.props(p.deployRow)}><span {...stylex.props(s.notificationGlyph)}><Bell size={14} /></span><div {...stylex.props(s.grow)}><div {...stylex.props(s.rowPrimary)}>{title}</div><div {...stylex.props(s.rowSecondary)}>{detail}</div></div><button type="button" role="switch" aria-checked={prefs[key]} aria-label={title} onClick={() => setPrefs((current) => ({ ...current, [key]: !current[key] }))} {...stylex.props(p.toggle, prefs[key] && p.toggleOn)}><span {...stylex.props(p.toggleThumb, prefs[key] && p.toggleThumbOn)} /></button></div>)}<div {...stylex.props(s.inlineBetween, s.marginTop16)}><span {...stylex.props(s.hint)}>Urgent pages always follow escalation policy delivery.</span><Button variant="primary" icon={Save} onClick={() => onToast('Notification preferences saved.')}>Save preferences</Button></div></div></Panel>
}
