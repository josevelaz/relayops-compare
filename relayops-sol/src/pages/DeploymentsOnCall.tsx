import * as stylex from '@stylexjs/stylex'
import { useMemo, useState } from 'react'
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  ChevronDown,
  Clock3,
  GitBranch,
  GitCommitHorizontal,
  MoreHorizontal,
  Plus,
  RotateCcw,
  Search,
  Settings2,
  ShieldCheck,
  UserRoundCheck,
} from 'lucide-react'
import { deployments } from '../data'
import { p, s } from '../styles'
import { Avatar, Badge, Button, DeploymentBadge, IconButton, Metric, Panel, PanelHeader, PersonLine } from '../components/ui'

export function DeploymentsPage({ initialQuery = '', onNavigate, onToast }: { initialQuery?: string; onNavigate: (section: string, id?: string) => void; onToast: (message: string) => void }) {
  const [query, setQuery] = useState(initialQuery)
  const [environment, setEnvironment] = useState('All environments')
  const [status, setStatus] = useState('All statuses')
  const visible = useMemo(() => deployments.filter((deployment) => `${deployment.service} ${deployment.version} ${deployment.author} ${deployment.commit}`.toLowerCase().includes(query.toLowerCase()) && (environment === 'All environments' || deployment.environment === environment) && (status === 'All statuses' || deployment.status === status)), [query, environment, status])
  return (
    <>
      <div {...stylex.props(s.pageHeader)}><div><p {...stylex.props(s.eyebrow)}>Change intelligence</p><h1 {...stylex.props(s.title)}>Deployments</h1><p {...stylex.props(s.subtitle)}>Track releases alongside the operational signals they affect.</p></div><div {...stylex.props(s.headerActions)}><Button icon={GitBranch}>Release calendar</Button><Button variant="primary" icon={Plus}>Record deployment</Button></div></div>
      <div {...stylex.props(s.grid4)}><Metric label="Production · 24h" value="38" footer="96.8% successful" trend="positive" /><Metric label="Last hour" value="3" footer="Across 3 services" /><Metric label="Failed · 24h" value="2" footer="1 staging · 1 production" trend="negative" /><Metric label="Change failure rate" value="6.4%" footer="↓ 1.2 points this month" trend="positive" /></div>
      <div {...stylex.props(p.attention, s.marginTop12, s.marginBottom12)}><AlertTriangle size={16} /><div {...stylex.props(s.grow)}><strong {...stylex.props(s.small)}>Deployment correlated with active incident</strong><div {...stylex.props(s.tiny, s.marginTop8)}><span {...stylex.props(s.mono)}>payment-gateway@4.18.2</span> completed 14 minutes before checkout errors began. Rollback completed at 10:48 AM.</div></div><Button size="small" onClick={() => onNavigate('incidents', 'INC-1042')}>View INC-1042</Button></div>
      <Panel>
        <div {...stylex.props(s.toolbar)}><div {...stylex.props(s.inputWrap)}><Search {...stylex.props(s.inputIcon)} /><input aria-label="Search deployments" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search service, version, commit, or author" {...stylex.props(s.input, s.inputWithIcon)} /></div><select aria-label="Filter environment" value={environment} onChange={(event) => setEnvironment(event.target.value)} {...stylex.props(s.select)}><option>All environments</option><option>Production</option><option>Staging</option></select><select aria-label="Filter deployment status" value={status} onChange={(event) => setStatus(event.target.value)} {...stylex.props(s.select)}><option>All statuses</option><option>Successful</option><option>Failed</option><option>Rolling out</option><option>Rolled back</option></select></div>
        <div {...stylex.props(s.tableWrap)}><table {...stylex.props(s.table)}><thead><tr><th {...stylex.props(s.th)}>Service / version</th><th {...stylex.props(s.th)}>Environment</th><th {...stylex.props(s.th)}>Status</th><th {...stylex.props(s.th)}>Commit / PR</th><th {...stylex.props(s.th)}>Author</th><th {...stylex.props(s.th)}>Timestamp</th><th {...stylex.props(s.th)}>Related incident</th><th {...stylex.props(s.th)} /></tr></thead><tbody>{visible.map((deployment) => <tr key={deployment.id} {...stylex.props(s.trClickable)}><td {...stylex.props(s.td)}><button type="button" {...stylex.props(s.link)} onClick={() => deployment.service === 'Payment Gateway' && onNavigate('services', 'payment-gateway')}>{deployment.service}</button><div {...stylex.props(s.rowSecondary, s.mono)}>{deployment.version}</div></td><td {...stylex.props(s.td)}><Badge tone={deployment.environment === 'Production' ? 'violet' : 'gray'}>{deployment.environment}</Badge></td><td {...stylex.props(s.td)}><DeploymentBadge status={deployment.status} /></td><td {...stylex.props(s.td)}><div {...stylex.props(s.mono)}>{deployment.commit}</div><div {...stylex.props(s.rowSecondary)}><GitBranch size={10} /> {deployment.pullRequest}</div></td><td {...stylex.props(s.td)}><PersonLine name={deployment.author} /></td><td {...stylex.props(s.td)}>{deployment.timestamp}</td><td {...stylex.props(s.td)}>{deployment.incident ? <button type="button" {...stylex.props(s.link, s.mono)} onClick={() => onNavigate('incidents', deployment.incident)}>{deployment.incident}</button> : <span {...stylex.props(s.muted)}>—</span>}</td><td {...stylex.props(s.td)}><div {...stylex.props(s.wrap)}>{deployment.status === 'Rolling out' ? <Button size="small" icon={RotateCcw} onClick={() => onToast(`${deployment.version} rollback requested.`)}>Rollback</Button> : null}<IconButton icon={MoreHorizontal} label={`Actions for ${deployment.id}`} /></div></td></tr>)}</tbody></table>{!visible.length ? <div {...stylex.props(s.emptyFilter)}>No deployments match these filters.</div> : null}</div>
      </Panel>
    </>
  )
}

const roster = [
  { team: 'Platform', primary: 'Jordan Kim', secondary: 'Noah Williams', shift: '8:00 AM–4:00 PM', next: 'Noah Williams', policy: 'Platform L1 → Infra L2' },
  { team: 'Payments', primary: 'Priya Patel', secondary: 'Marcus Johnson', shift: '4:00 AM–12:00 PM', next: 'Elena Rodriguez', policy: 'Payments L1 → Manager' },
  { team: 'Core API', primary: 'Elena Rodriguez', secondary: 'Liam Brooks', shift: '8:00 AM–4:00 PM', next: 'Liam Brooks', policy: 'Core L1 → Platform' },
  { team: 'Infrastructure', primary: 'Maya Singh', secondary: 'Jordan Kim', shift: '10:00 AM–6:00 PM', next: 'Jordan Kim', policy: 'Infra L1 → Director' },
  { team: 'Developer Experience', primary: 'Noah Williams', secondary: 'Sarah Chen', shift: '8:00 AM–4:00 PM', next: 'Sarah Chen', policy: 'DevEx L1 → Platform' },
]

function datesForWeek(offset: number) {
  const start = new Date(Date.UTC(2026, 8, 7 + offset * 7))
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(start)
    date.setUTCDate(start.getUTCDate() + index)
    return {
      key: date.toISOString(),
      label: date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', timeZone: 'UTC' }),
      date,
    }
  })
}

function weekRangeLabel(offset: number) {
  const dates = datesForWeek(offset)
  const first = dates[0].date
  const last = dates[6].date
  const firstText = first.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' })
  const lastText = last.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })
  return `${firstText}–${lastText}`
}

export function OnCallPage({ onToast }: { onToast: (message: string) => void }) {
  const [week, setWeek] = useState(0)
  const days = datesForWeek(week)
  return (
    <>
      <div {...stylex.props(s.pageHeader)}><div><p {...stylex.props(s.eyebrow)}>Coverage</p><h1 {...stylex.props(s.title)}>On-call</h1><p {...stylex.props(s.subtitle)}>Current responders, weekly coverage, and escalation paths.</p></div><div {...stylex.props(s.headerActions)}><Button icon={Settings2}>Escalation policies</Button><Button variant="primary" icon={Plus} onClick={() => onToast('Override editor opened for the Payments rotation.')}>Add override</Button></div></div>
      <div {...stylex.props(s.grid3, s.marginBottom12)}><Metric label="Active rotations" value="5" footer="All teams covered" trend="positive" /><Metric label="Starting later today" value="2" footer="Elena and Liam · 12:00 PM" /><Metric label="Uncovered shifts" value="0" footer="Next 30 days" trend="positive" /></div>
      <Panel>
        <PanelHeader title="Current coverage" meta="Tuesday, Sep 8 · 11:14 AM" action={<Badge tone="green" dot>All rotations staffed</Badge>} />
        <div {...stylex.props(s.tableWrap)}><table {...stylex.props(s.table, s.tableCompact)}><thead><tr><th {...stylex.props(s.th)}>Team</th><th {...stylex.props(s.th)}>Primary</th><th {...stylex.props(s.th)}>Secondary</th><th {...stylex.props(s.th)}>Shift</th><th {...stylex.props(s.th)}>Next primary</th><th {...stylex.props(s.th)}>Escalation policy</th></tr></thead><tbody>{roster.map((row) => <tr key={row.team}><td {...stylex.props(s.td)}><div {...stylex.props(s.rowPrimary)}>{row.team}</div></td><td {...stylex.props(s.td)}><PersonLine name={row.primary} detail="Primary" /></td><td {...stylex.props(s.td)}><PersonLine name={row.secondary} detail="Secondary" /></td><td {...stylex.props(s.td)}><Badge tone="green" dot>{row.shift}</Badge></td><td {...stylex.props(s.td)}><PersonLine name={row.next} detail={row.team === 'Payments' || row.team === 'Core API' ? 'Starts 12:00 PM' : 'Tomorrow'} /></td><td {...stylex.props(s.td)}>{row.policy}</td></tr>)}</tbody></table></div>
      </Panel>

      <div {...stylex.props(s.marginTop12)}><Panel>
        <PanelHeader title="Weekly schedule" meta={weekRangeLabel(week)} action={<div {...stylex.props(s.wrap)}><IconButton icon={ArrowLeft} label="Previous week" onClick={() => setWeek((value) => value - 1)} /><Button size="small" icon={CalendarDays} onClick={() => setWeek(0)}>This week</Button><IconButton icon={ArrowRight} label="Next week" onClick={() => setWeek((value) => value + 1)} /></div>} />
        <div {...stylex.props(p.schedule)}>
          <div {...stylex.props(p.scheduleGrid)}>
            <div {...stylex.props(p.scheduleCell, p.scheduleHeader)}>Rotation</div>{days.map((day) => <div key={day.key} {...stylex.props(p.scheduleCell, p.scheduleHeader)}>{day.label}{day.key.startsWith('2026-09-08') ? <div {...stylex.props(s.rowSecondary)}>Today</div> : null}</div>)}
            {roster.map((row, rowIndex) => <ScheduleRow key={row.team} row={row} rowIndex={rowIndex} days={days} week={week} />)}
          </div>
        </div>
      </Panel></div>

      <div {...stylex.props(s.grid2, s.marginTop12)}>
        <Panel><PanelHeader title="Shift handoffs" meta="Today" /><div {...stylex.props(s.panelPad)}>{[['12:00 PM', 'Payments', 'Priya Patel', 'Elena Rodriguez'], ['12:00 PM', 'Core API', 'Elena Rodriguez', 'Liam Brooks'], ['4:00 PM', 'Platform', 'Jordan Kim', 'Noah Williams']].map(([time, team, from, to]) => <div key={`${time}-${team}`} {...stylex.props(p.deployRow)}><Clock3 size={14} /><Badge>{time}</Badge><div {...stylex.props(s.grow)}><div {...stylex.props(s.rowPrimary)}>{team}</div><div {...stylex.props(s.rowSecondary)}>{from} → {to}</div></div></div>)}</div></Panel>
        <Panel><PanelHeader title="Escalation readiness" /><div {...stylex.props(s.panelPad, s.column, s.gap12)}><div {...stylex.props(s.inlineBetween)}><div {...stylex.props(s.inline)}><ShieldCheck size={16} color="#39a675" /><span {...stylex.props(s.small)}>All policies have full coverage</span></div><Badge tone="green">Healthy</Badge></div><div {...stylex.props(s.inlineBetween)}><div {...stylex.props(s.inline)}><UserRoundCheck size={16} color="#5667d9" /><span {...stylex.props(s.small)}>Last acknowledgment drill</span></div><strong {...stylex.props(s.small)}>Sep 4 · 96s</strong></div><Button onClick={() => onToast('Test page sent to the Payments secondary rotation.')}>Send test page</Button></div></Panel>
      </div>
    </>
  )
}

function ScheduleRow({ row, rowIndex, days, week }: { row: (typeof roster)[number]; rowIndex: number; days: ReturnType<typeof datesForWeek>; week: number }) {
  return (
    <>
      <div {...stylex.props(p.scheduleCell)}><div {...stylex.props(s.rowPrimary)}>{row.team}</div><div {...stylex.props(s.rowSecondary)}>8h rotation</div></div>
      {days.map((day, index) => {
        const rotation = Math.abs(index + rowIndex + week) % 3
        const primary = rotation === 0 ? row.primary : rotation === 1 ? row.secondary : row.next
        return <div key={day.key} {...stylex.props(p.scheduleCell)}><div {...stylex.props(index % 2 === 0 ? p.shiftPrimary : p.shiftSecondary)}><div {...stylex.props(s.inline)}><Avatar name={primary} size="small" /><span>{primary.split(' ')[0]}</span></div></div></div>
      })}
    </>
  )
}
