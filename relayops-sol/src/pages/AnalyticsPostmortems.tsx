import * as stylex from '@stylexjs/stylex'
import { useMemo, useState } from 'react'
import {
  AlertTriangle,
  BarChart3,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Download,
  Edit3,
  FileCheck2,
  FilePlus2,
  GitCommitHorizontal,
  MoreHorizontal,
  Plus,
  Search,
  ShieldCheck,
  TrendingDown,
  Users,
  X,
} from 'lucide-react'
import { postmortems, type Postmortem } from '../data'
import { p, s } from '../styles'
import { Avatar, Badge, Breadcrumb, Button, IconButton, Metric, Panel, PanelHeader, PersonLine, Progress, SeverityBadge } from '../components/ui'

const analyticsByRange = {
  '7 days': { incidents: '8', mtta: '3m 08s', mttr: '41m', alerts: '1,244', bars: [28, 42, 34, 58, 46, 71, 54], labels: ['Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue'], severity: [1, 2, 5], deploymentRelated: [2, 25] },
  '30 days': { incidents: '31', mtta: '3m 12s', mttr: '46m', alerts: '5,421', bars: [38, 56, 43, 78, 52, 64, 73, 49], labels: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'Now'], severity: [2, 9, 20], deploymentRelated: [8, 26] },
  '90 days': { incidents: '96', mtta: '3m 42s', mttr: '51m', alerts: '16.8k', bars: [65, 72, 61, 85, 76, 58, 69, 54, 48], labels: ['Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Now'], severity: [7, 28, 61], deploymentRelated: [22, 23] },
  '6 months': { incidents: '184', mtta: '4m 04s', mttr: '54m', alerts: '33.2k', bars: [82, 74, 78, 69, 61, 54], labels: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'], severity: [14, 55, 115], deploymentRelated: [39, 21] },
}

export function AnalyticsPage() {
  const [range, setRange] = useState<keyof typeof analyticsByRange>('30 days')
  const data = analyticsByRange[range]
  const total = Number(data.incidents)
  const severityPercent = data.severity.map((value) => Math.round((value / total) * 100))
  return (
    <>
      <div {...stylex.props(s.pageHeader)}><div><p {...stylex.props(s.eyebrow)}>Operational intelligence</p><h1 {...stylex.props(s.title)}>Analytics</h1><p {...stylex.props(s.subtitle)}>Find recurring failure patterns and measure how response systems improve.</p></div><div {...stylex.props(s.headerActions)}><select aria-label="Analytics time range" value={range} onChange={(event) => setRange(event.target.value as keyof typeof analyticsByRange)} {...stylex.props(s.select)}>{Object.keys(analyticsByRange).map((item) => <option key={item}>{item}</option>)}</select><Button icon={Download}>Export report</Button></div></div>
      <div {...stylex.props(s.grid4)}><Metric label="Incident volume" value={data.incidents} footer="↓ 12% from prior period" trend="positive" /><Metric label="Mean time to acknowledge" value={data.mtta} footer="18% faster" trend="positive" /><Metric label="Mean time to resolve" value={data.mttr} footer="6m faster" trend="positive" /><Metric label="Alert volume" value={data.alerts} footer="23% classified as noise" trend="negative" /></div>
      <div {...stylex.props(p.chartLayout, s.marginTop12)}>
        <Panel><PanelHeader title="Incident volume and severity" meta={range} action={<Badge tone="green"><TrendingDown size={11} /> Improving</Badge>} /><div {...stylex.props(s.panelPad)}><div {...stylex.props(p.barChart)}>{data.bars.map((height, index) => <div key={data.labels[index]} {...stylex.props(p.barCol)}><div title={`${Math.round(height / 12)} incidents`} {...stylex.props(p.bar, index === data.bars.length - 2 && p.barAccent)} style={{ height: `${height}%` }} /><span {...stylex.props(p.barLabel)}>{data.labels[index]}</span></div>)}</div><div {...stylex.props(s.wrap, s.marginTop12)}><Badge tone="red">SEV1 · {severityPercent[0]}%</Badge><Badge tone="orange">SEV2 · {severityPercent[1]}%</Badge><Badge tone="blue">SEV3 · {severityPercent[2]}%</Badge></div></div></Panel>
        <Panel><PanelHeader title="Incidents by severity" meta={`${data.incidents} total`} /><div {...stylex.props(p.donutWrap)}><svg viewBox="0 0 42 42" {...stylex.props(p.donut)} role="img" aria-label={`${severityPercent[0]} percent SEV1, ${severityPercent[1]} percent SEV2, ${severityPercent[2]} percent SEV3`}><circle cx="21" cy="21" r="15.9" fill="transparent" stroke="#e8ebec" strokeWidth="6" /><circle cx="21" cy="21" r="15.9" fill="transparent" stroke="#e36152" strokeWidth="6" strokeDasharray={`${severityPercent[0]} ${100 - severityPercent[0]}`} strokeDashoffset="0" /><circle cx="21" cy="21" r="15.9" fill="transparent" stroke="#e5a044" strokeWidth="6" strokeDasharray={`${severityPercent[1]} ${100 - severityPercent[1]}`} strokeDashoffset={-severityPercent[0]} /><circle cx="21" cy="21" r="15.9" fill="transparent" stroke="#6070df" strokeWidth="6" strokeDasharray={`${severityPercent[2]} ${100 - severityPercent[2]}`} strokeDashoffset={-(severityPercent[0] + severityPercent[1])} /></svg><div {...stylex.props(s.column, s.gap8)}><div><SeverityBadge severity="SEV1" /> <strong {...stylex.props(s.small)}>{data.severity[0]}</strong></div><div><SeverityBadge severity="SEV2" /> <strong {...stylex.props(s.small)}>{data.severity[1]}</strong></div><div><SeverityBadge severity="SEV3" /> <strong {...stylex.props(s.small)}>{data.severity[2]}</strong></div></div></div><div {...stylex.props(s.panelPad)}><div {...stylex.props(p.attention)}><AlertTriangle size={14} /><div {...stylex.props(s.tiny)}>Payments produced 2 of 3 major incidents this quarter.</div></div></div></Panel>
      </div>

      <div {...stylex.props(s.grid2, s.marginTop12)}>
        <Panel><PanelHeader title="Services causing the most incidents" meta="Includes direct and dependent impact" /><div {...stylex.props(s.panelPad)}>{[['Payment Gateway', 9, 92], ['Webhook Processor', 6, 65], ['Order Service', 5, 53], ['API Gateway', 4, 44], ['Authentication Service', 3, 32]].map(([name, count, width], index) => <div key={String(name)} {...stylex.props(p.rankingRow)}><span {...stylex.props(p.rank)}>0{index + 1}</span><div><div {...stylex.props(s.rowPrimary)}>{name}</div><div {...stylex.props(p.compactBar)}><div {...stylex.props(p.compactBarFill)} style={{ width: `${width}%` }} /></div></div><strong {...stylex.props(s.small)}>{count}</strong></div>)}</div></Panel>
        <Panel><PanelHeader title="Alert quality" meta="Signal-to-noise by service" /><div {...stylex.props(s.panelPad)}>{[['Analytics Pipeline', '42% noise', 42], ['Webhook Processor', '34% noise', 34], ['User Service', '28% noise', 28], ['Payment Gateway', '12% noise', 12]].map(([name, label, width], index) => <div key={String(name)} {...stylex.props(p.rankingRow)}><span {...stylex.props(p.rank)}>0{index + 1}</span><div><div {...stylex.props(s.rowPrimary)}>{name}</div><div {...stylex.props(p.compactBar)}><div {...stylex.props(p.compactBarFill)} style={{ width: `${width}%`, background: '#df9a40' }} /></div></div><strong {...stylex.props(s.tiny)}>{label}</strong></div>)}</div></Panel>
      </div>

      <div {...stylex.props(s.grid3, s.marginTop12)}>
        <Panel padded><div {...stylex.props(s.inline)}><span {...stylex.props(s.commandIcon)}><GitCommitHorizontal size={15} /></span><div><div {...stylex.props(s.metricLabel)}>Deployment-related incidents</div><div {...stylex.props(s.metricValue)}>{data.deploymentRelated[1]}%</div><div {...stylex.props(s.metricFooter)}>{data.deploymentRelated[0]} of {data.incidents} incidents</div></div></div></Panel>
        <Panel padded><div {...stylex.props(s.inline)}><span {...stylex.props(s.commandIcon)}><ShieldCheck size={15} /></span><div><div {...stylex.props(s.metricLabel)}>Reliability trend</div><div {...stylex.props(s.metricValue)}>99.95%</div><div {...stylex.props(s.metricFooter, s.positive)}>+0.02% over 90 days</div></div></div></Panel>
        <Panel padded><div {...stylex.props(s.inline)}><span {...stylex.props(s.commandIcon)}><BarChart3 size={15} /></span><div><div {...stylex.props(s.metricLabel)}>Incident recurrence</div><div {...stylex.props(s.metricValue)}>16%</div><div {...stylex.props(s.metricFooter, s.negative)}>5 incidents matched prior root causes</div></div></div></Panel>
      </div>
    </>
  )
}

export function PostmortemsPage({ initialQuery = '', onOpen, onToast }: { initialQuery?: string; onOpen: (id: string) => void; onToast: (message: string) => void }) {
  const [query, setQuery] = useState(initialQuery)
  const [status, setStatus] = useState('All')
  const visible = useMemo(() => postmortems.filter((item) => `${item.title} ${item.incident} ${item.owner}`.toLowerCase().includes(query.toLowerCase()) && (status === 'All' || item.status === status)), [query, status])
  return (
    <>
      <div {...stylex.props(s.pageHeader)}><div><p {...stylex.props(s.eyebrow)}>Learning system</p><h1 {...stylex.props(s.title)}>Postmortems</h1><p {...stylex.props(s.subtitle)}>Turn incident context into durable engineering improvements.</p></div><div {...stylex.props(s.headerActions)}><Button icon={CalendarDays}>Review calendar</Button><Button variant="primary" icon={Plus} onClick={() => onToast('New postmortem draft created.')}>New postmortem</Button></div></div>
      <div {...stylex.props(s.grid3, s.marginBottom12)}><Metric label="In review" value="4" footer="2 need your approval" /><Metric label="Open actions" value="18" footer="3 overdue" trend="negative" /><Metric label="Published on time" value="87%" footer="+8 points this quarter" trend="positive" /></div>
      <Panel><div {...stylex.props(s.toolbar)}><div {...stylex.props(s.inputWrap)}><Search {...stylex.props(s.inputIcon)} /><input aria-label="Search postmortems" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search title, incident, or owner" {...stylex.props(s.input, s.inputWithIcon)} /></div><div {...stylex.props(s.segmented)}>{['All', 'Draft', 'In review', 'Published'].map((item) => <button key={item} type="button" onClick={() => setStatus(item)} {...stylex.props(s.segment, status === item && s.segmentActive)}>{item}</button>)}</div></div></Panel>
      <div {...stylex.props(s.grid2, s.marginTop12)}>{visible.map((item) => <PostmortemCard key={item.id} item={item} onOpen={onOpen} />)}</div>
      {!visible.length ? <div {...stylex.props(s.emptyFilter)}>No postmortems match these filters.</div> : null}
    </>
  )
}

function PostmortemCard({ item, onOpen }: { item: Postmortem; onOpen: (id: string) => void }) {
  return (
    <section tabIndex={0} role="button" onClick={() => onOpen(item.id)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); onOpen(item.id) } }} {...stylex.props(s.panel, p.postmortemCard)}>
      <div {...stylex.props(s.inlineBetween)}><div {...stylex.props(s.wrap)}><SeverityBadge severity={item.severity} /><Badge tone={item.status === 'Published' ? 'green' : item.status === 'In review' ? 'violet' : 'gray'}>{item.status}</Badge></div><IconButton icon={MoreHorizontal} label={`Actions for ${item.title}`} /></div>
      <h2 {...stylex.props(p.incidentTitle)}>{item.title}</h2>
      <div {...stylex.props(s.inlineBetween)}><PersonLine name={item.owner} detail={`${item.incident} · ${item.created}`} /><ChevronRight size={15} /></div>
      <div {...stylex.props(s.marginTop16)}><div {...stylex.props(s.inlineBetween, s.tiny)}><span {...stylex.props(s.muted)}>Corrective actions</span><strong>{item.progress}%</strong></div><div {...stylex.props(s.marginTop8)}><Progress value={item.progress} /></div></div>
    </section>
  )
}

const sections = [
  ['Summary', 'On August 28, Payment Gateway experienced a 47-minute outage that caused elevated checkout failures. Traffic shifted to the fallback provider after a malformed routing rule reached production.'],
  ['Customer Impact', 'From 2:14 PM to 3:01 PM UTC, 18.2% of checkout attempts failed. Approximately 41,000 customers across 312 merchants were affected. No duplicate charges or data loss occurred.'],
  ['Detection', 'Datadog detected a rise in payment authorization errors within 74 seconds. The alert paged Payments on-call, but the provider-specific routing symptom required manual correlation.'],
  ['Root Cause', 'A routing configuration migration accepted an empty provider weight. The validation path covered new routes but did not validate updates to existing routes. Two instances retained the invalid rule after a partial cache refresh.'],
  ['Resolution', 'The team rolled back version 4.17.9, invalidated routing caches across all gateway instances, and shifted traffic to the secondary provider until error rates returned below 0.5%.'],
  ['What Went Well', 'Automated paging fired quickly. The incident commander separated mitigation from diagnosis, and provider failover capacity was sufficient for peak traffic.'],
  ['What Went Poorly', 'The deployment health check used aggregate success rates and missed provider-specific errors. Cache invalidation had no completion signal. Customer support received context 19 minutes after the incident began.'],
  ['Lessons Learned', 'Routing changes need the same validation and staged rollout as application code. Provider-level health must gate deployments, and cache refresh operations need verifiable completion.'],
]

const correctionSeed = [
  { title: 'Add provider weight validation to routing config', owner: 'Marcus Johnson', priority: 'P0', due: 'Sep 11', status: 'In progress' },
  { title: 'Gate deploys on provider-level success rates', owner: 'Priya Patel', priority: 'P1', due: 'Sep 15', status: 'In progress' },
  { title: 'Add cache refresh completion telemetry', owner: 'Elena Rodriguez', priority: 'P1', due: 'Sep 18', status: 'Not started' },
  { title: 'Create payment outage support playbook', owner: 'Liam Brooks', priority: 'P2', due: 'Sep 22', status: 'Done' },
]

export function PostmortemDetail({ onBack, onToast }: { onBack: () => void; onToast: (message: string) => void }) {
  const [editing, setEditing] = useState(false)
  const [summary, setSummary] = useState(sections[0][1])
  const [actions, setActions] = useState(correctionSeed)
  return (
    <>
      <div {...stylex.props(p.detailToolbar)}><Breadcrumb items={['Postmortems', 'PM-128']} onBack={onBack} /><div {...stylex.props(s.headerActions)}><Button icon={Users}>Share review</Button><Button icon={editing ? X : Edit3} onClick={() => setEditing((value) => !value)}>{editing ? 'Cancel edit' : 'Edit document'}</Button><Button variant="primary" icon={CheckCircle2} onClick={() => onToast('Postmortem published and shared with Northstar Labs.')}>Publish</Button></div></div>
      <Panel>
        <div {...stylex.props(p.teamHero, s.marginTop16)}><div {...stylex.props(s.wrap)}><SeverityBadge severity="SEV1" /><Badge tone="violet">In review</Badge><Badge>PM-128</Badge></div><h1 {...stylex.props(p.detailTitle)}>Payment Gateway Outage — August 28</h1><p {...stylex.props(s.subtitle)}>Linked to INC-1018 · 47m duration · Facilitated by Sarah Chen</p><div {...stylex.props(s.wrap, s.marginTop16)}><Avatar name="Sarah Chen" /><Avatar name="Marcus Johnson" overlap /><Avatar name="Priya Patel" overlap /><span {...stylex.props(s.tiny, s.muted)}>6 reviewers · Last edited 18 minutes ago</span></div></div>
      </Panel>
      <div {...stylex.props(p.pageSplit, s.marginTop12)}>
        <article {...stylex.props(s.panel, p.document)}>
          {sections.map(([heading, text], index) => <section key={heading} {...stylex.props(p.docSection)}><div {...stylex.props(s.inlineBetween)}><h2 {...stylex.props(p.docHeading)}>{heading}</h2>{editing ? <Badge tone="blue">Editing</Badge> : null}</div>{editing && index === 0 ? <textarea aria-label="Edit postmortem summary" value={summary} onChange={(event) => setSummary(event.target.value)} {...stylex.props(p.editArea)} /> : <p {...stylex.props(p.docText)}>{index === 0 ? summary : text}</p>}{heading === 'Detection' ? <blockquote {...stylex.props(p.quote)}>“The first alert gave us the symptom, not the failing provider path. We spent eight minutes narrowing the blast radius.” — Priya Patel</blockquote> : null}</section>)}
          <section {...stylex.props(p.docSection)}><h2 {...stylex.props(p.docHeading)}>Timeline</h2>{[['2:12 PM', 'payment-gateway@4.17.9 reached 100% of production.'], ['2:14 PM', 'Authorization errors exceeded 10%; page sent.'], ['2:19 PM', 'Incident INC-1018 declared as SEV1.'], ['2:27 PM', 'Routing configuration identified as likely trigger.'], ['2:34 PM', 'Rollback and cache invalidation started.'], ['3:01 PM', 'Error rate returned below 0.5%; monitoring began.']].map(([time, text]) => <div key={time} {...stylex.props(p.deployRow)}><Badge>{time}</Badge><span {...stylex.props(s.small)}>{text}</span></div>)}</section>
          <section {...stylex.props(p.docSection)}><div {...stylex.props(s.inlineBetween)}><h2 {...stylex.props(p.docHeading)}>Corrective Actions</h2><Button size="small" icon={Plus} onClick={() => onToast('Corrective action added.')}>Add action</Button></div>{actions.map((action, index) => <div key={action.title} {...stylex.props(p.taskRow)}><input type="checkbox" aria-label={`Complete ${action.title}`} checked={action.status === 'Done'} onChange={() => setActions((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, status: item.status === 'Done' ? 'In progress' : 'Done' } : item))} {...stylex.props(s.checkbox)} /><div {...stylex.props(s.grow)}><div {...stylex.props(s.rowPrimary)}>{action.title}</div><div {...stylex.props(s.wrap, s.marginTop8)}><PersonLine name={action.owner} /><Badge tone={action.priority === 'P0' ? 'red' : action.priority === 'P1' ? 'orange' : 'gray'}>{action.priority}</Badge><Badge>{action.due}</Badge><Badge tone={action.status === 'Done' ? 'green' : action.status === 'In progress' ? 'blue' : 'gray'}>{action.status}</Badge></div></div></div>)}</section>
          {editing ? <div {...stylex.props(s.inlineBetween, s.marginTop16)}><span {...stylex.props(s.hint)}>Draft autosaved just now</span><Button variant="primary" icon={Check} onClick={() => { setEditing(false); onToast('Postmortem changes saved.') }}>Save changes</Button></div> : null}
        </article>
        <aside {...stylex.props(s.column, s.gap12)}><Panel><PanelHeader title="Review status" /><div {...stylex.props(s.panelPad, s.column, s.gap12)}><div {...stylex.props(s.inlineBetween)}><span {...stylex.props(s.small)}>Engineering review</span><Badge tone="green">Approved</Badge></div><div {...stylex.props(s.inlineBetween)}><span {...stylex.props(s.small)}>SRE review</span><Badge tone="green">Approved</Badge></div><div {...stylex.props(s.inlineBetween)}><span {...stylex.props(s.small)}>Executive review</span><Badge tone="orange">Pending</Badge></div><hr {...stylex.props(s.divider)} /><div {...stylex.props(s.inlineBetween, s.tiny)}><span>Action progress</span><strong>3 / 4</strong></div><Progress value={75} /></div></Panel><Panel><PanelHeader title="Document details" /><div {...stylex.props(s.panelPad, s.column, s.gap12)}>{[['Incident', 'INC-1018'], ['Owner', 'Sarah Chen'], ['Created', 'Aug 29, 2026'], ['Review due', 'Sep 10, 2026'], ['Visibility', 'Northstar Labs']].map(([label, value]) => <div key={label} {...stylex.props(s.inlineBetween)}><span {...stylex.props(s.tiny, s.muted)}>{label}</span><strong {...stylex.props(s.tiny)}>{value}</strong></div>)}</div></Panel></aside>
      </div>
    </>
  )
}
