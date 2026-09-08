import * as stylex from '@stylexjs/stylex'
import { useMemo, useState } from 'react'
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  Check,
  CheckCircle2,
  Clock3,
  FilePlus2,
  GitCommitHorizontal,
  MessageSquare,
  MoreHorizontal,
  Plus,
  RotateCcw,
  Search,
  Send,
  ShieldAlert,
  Siren,
  UserPlus,
  Users,
} from 'lucide-react'
import { deployments, incidentTimeline, people, type Alert, type Incident, type IncidentStatus, type Severity } from '../data'
import { p, s } from '../styles'
import {
  Avatar,
  AvatarStack,
  Badge,
  Breadcrumb,
  Button,
  DeploymentBadge,
  HealthBadge,
  IconButton,
  Panel,
  PanelHeader,
  PersonLine,
  SeverityBadge,
  StatusBadge,
  Tabs,
} from '../components/ui'

export function IncidentsPage({
  incidents,
  onOpen,
  onCreate,
}: {
  incidents: Incident[]
  onOpen: (id: string) => void
  onCreate: () => void
}) {
  const [query, setQuery] = useState('')
  const [view, setView] = useState('Active')
  const [severity, setSeverity] = useState('All severities')
  const [sort, setSort] = useState('Newest first')

  const rows = useMemo(() => {
    const filtered = incidents.filter((incident) => {
      const matchesQuery = `${incident.id} ${incident.title} ${incident.services.join(' ')}`.toLowerCase().includes(query.toLowerCase())
      const matchesView = view === 'All' || (view === 'Active' ? incident.status !== 'Resolved' : incident.status === 'Resolved')
      const matchesSeverity = severity === 'All severities' || incident.severity === severity
      return matchesQuery && matchesView && matchesSeverity
    })
    return [...filtered].sort((a, b) => sort === 'Severity' ? a.severity.localeCompare(b.severity) : sort === 'Longest running' ? durationMinutes(b.duration) - durationMinutes(a.duration) : b.id.localeCompare(a.id))
  }, [incidents, query, severity, sort, view])

  return (
    <>
      <div {...stylex.props(s.pageHeader)}>
        <div><p {...stylex.props(s.eyebrow)}>Response center</p><h1 {...stylex.props(s.title)}>Incidents</h1><p {...stylex.props(s.subtitle)}>Coordinate response, preserve context, and restore service quickly.</p></div>
        <div {...stylex.props(s.headerActions)}><Button icon={FilePlus2}>Import update</Button><Button variant="primary" icon={Plus} onClick={onCreate}>Create incident</Button></div>
      </div>

      <div {...stylex.props(s.grid3, s.marginBottom12)}>
        <Panel padded><div {...stylex.props(s.inlineBetween)}><div><div {...stylex.props(s.metricLabel)}>Active now</div><div {...stylex.props(s.metricValue)}>3</div><div {...stylex.props(s.metricFooter, s.negative)}>1 major incident</div></div><Siren size={23} color="#dc5748" /></div></Panel>
        <Panel padded><div {...stylex.props(s.inlineBetween)}><div><div {...stylex.props(s.metricLabel)}>Responders engaged</div><div {...stylex.props(s.metricValue)}>9</div><div {...stylex.props(s.metricFooter)}>Across 4 teams</div></div><Users size={23} color="#5969d8" /></div></Panel>
        <Panel padded><div {...stylex.props(s.inlineBetween)}><div><div {...stylex.props(s.metricLabel)}>Median time to acknowledge</div><div {...stylex.props(s.metricValue)}>3m 12s</div><div {...stylex.props(s.metricFooter, s.positive)}>18% faster this month</div></div><Clock3 size={23} color="#3ca979" /></div></Panel>
      </div>

      <Panel>
        <div {...stylex.props(s.toolbar)}>
          <div {...stylex.props(s.inputWrap)}><Search {...stylex.props(s.inputIcon)} /><input aria-label="Search incidents" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search incidents, IDs, or services" {...stylex.props(s.input, s.inputWithIcon)} /></div>
          <select aria-label="Filter by severity" value={severity} onChange={(event) => setSeverity(event.target.value)} {...stylex.props(s.select)}><option>All severities</option><option>SEV0</option><option>SEV1</option><option>SEV2</option><option>SEV3</option></select>
          <select aria-label="Sort incidents" value={sort} onChange={(event) => setSort(event.target.value)} {...stylex.props(s.select)}><option>Newest first</option><option>Longest running</option><option>Severity</option></select>
          <div {...stylex.props(s.segmented)}>{['Active', 'Resolved', 'All'].map((item) => <button key={item} type="button" onClick={() => setView(item)} {...stylex.props(s.segment, view === item && s.segmentActive)}>{item}</button>)}</div>
        </div>
        <div {...stylex.props(s.tableWrap)}>
          <table {...stylex.props(s.table)}>
            <thead><tr><th {...stylex.props(s.th)}>Incident</th><th {...stylex.props(s.th)}>Severity / status</th><th {...stylex.props(s.th)}>Impacted services</th><th {...stylex.props(s.th)}>Commander</th><th {...stylex.props(s.th)}>Created</th><th {...stylex.props(s.th)}>Responders</th><th {...stylex.props(s.th)} /></tr></thead>
            <tbody>
              {rows.map((incident) => (
                <tr key={incident.id} tabIndex={0} aria-label={`Open ${incident.id}: ${incident.title}`} {...stylex.props(s.trClickable)} onClick={() => onOpen(incident.id)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); onOpen(incident.id) } }}>
                  <td {...stylex.props(s.td)}><div {...stylex.props(s.rowPrimary)}>{incident.title}</div><div {...stylex.props(s.rowSecondary, s.mono)}>{incident.id} · {incident.duration}</div></td>
                  <td {...stylex.props(s.td)}><div {...stylex.props(s.wrap)}><SeverityBadge severity={incident.severity} /><StatusBadge status={incident.status} /></div></td>
                  <td {...stylex.props(s.td)}><div {...stylex.props(s.wrap)}>{incident.services.slice(0, 2).map((service) => <Badge key={service}>{service}</Badge>)}{incident.services.length > 2 ? <Badge>+{incident.services.length - 2}</Badge> : null}</div></td>
                  <td {...stylex.props(s.td)}><PersonLine name={incident.commander} /></td>
                  <td {...stylex.props(s.td)}><div>{incident.created}</div><div {...stylex.props(s.rowSecondary)}>{incident.duration} elapsed</div></td>
                  <td {...stylex.props(s.td)}><AvatarStack names={incident.responders} /></td>
                  <td {...stylex.props(s.td)}><IconButton icon={MoreHorizontal} label={`Actions for ${incident.id}`} /></td>
                </tr>
              ))}
            </tbody>
          </table>
          {!rows.length ? <div {...stylex.props(s.emptyFilter)}>No incidents match the current filters.</div> : null}
        </div>
      </Panel>
    </>
  )
}

function durationMinutes(value: string) {
  if (value === '<1m') return 0
  const hours = Number(value.match(/(\d+)h/)?.[1] ?? 0)
  const minutes = Number(value.match(/(\d+)m/)?.[1] ?? 0)
  return hours * 60 + minutes
}

export function GenericIncidentDetail({
  incident,
  onBack,
  onUpdate,
  onToast,
}: {
  incident: Incident
  onBack: () => void
  onUpdate: (updates: Partial<Incident>) => void
  onToast: (message: string) => void
}) {
  return (
    <>
      <div {...stylex.props(p.detailToolbar)}>
        <Breadcrumb items={['Incidents', incident.id]} onBack={onBack} />
        <div {...stylex.props(s.headerActions)}><Button icon={FilePlus2} onClick={() => onToast(`Follow-up added to ${incident.id}.`)}>Create follow-up</Button>{incident.status !== 'Resolved' ? <Button variant="danger" icon={CheckCircle2} onClick={() => onUpdate({ status: 'Resolved' })}>Resolve incident</Button> : null}</div>
      </div>
      <Panel>
        <div {...stylex.props(p.incidentBanner, s.marginTop16)}>
          <div {...stylex.props(p.incidentBannerTop)}><div {...stylex.props(s.grow)}><div {...stylex.props(s.wrap)}><SeverityBadge severity={incident.severity} /><StatusBadge status={incident.status} /><span {...stylex.props(s.tiny, s.muted)}>{incident.created} · {incident.duration}</span></div><h1 {...stylex.props(p.detailTitle)}>{incident.id}: {incident.title}</h1><p {...stylex.props(s.bodyText, s.noMargin)}>{incident.impact}</p></div><div {...stylex.props(s.headerActions)}><select aria-label="Change incident severity" value={incident.severity} onChange={(event) => onUpdate({ severity: event.target.value as Severity })} {...stylex.props(s.select)}><option>SEV0</option><option>SEV1</option><option>SEV2</option><option>SEV3</option></select><select aria-label="Change incident status" value={incident.status} onChange={(event) => onUpdate({ status: event.target.value as IncidentStatus })} {...stylex.props(s.select)}><option>Investigating</option><option>Identified</option><option>Monitoring</option><option>Resolved</option></select></div></div>
          <div {...stylex.props(p.propertyGrid)}><div><div {...stylex.props(p.propertyLabel)}>Commander</div><PersonLine name={incident.commander} /></div><div><div {...stylex.props(p.propertyLabel)}>Responders</div><AvatarStack names={incident.responders} /></div><div><div {...stylex.props(p.propertyLabel)}>Affected services</div><div {...stylex.props(s.wrap)}>{incident.services.map((service) => <Badge key={service}>{service}</Badge>)}</div></div><div><div {...stylex.props(p.propertyLabel)}>Created</div><div {...stylex.props(p.propertyValue)}>{incident.created}</div></div><div><div {...stylex.props(p.propertyLabel)}>Duration</div><div {...stylex.props(p.propertyValue)}>{incident.duration}</div></div></div>
        </div>
      </Panel>
      <div {...stylex.props(p.pageSplit, s.marginTop12)}><Panel><PanelHeader title="Incident activity" meta="Historical summary" /><div {...stylex.props(s.panelPad)}><div {...stylex.props(p.timelineItem)}><div {...stylex.props(p.timelineTime)}>{incident.created.split(', ').at(-1)}</div><div {...stylex.props(p.timelineTrack)}><span {...stylex.props(p.timelineLine)} /><span {...stylex.props(p.timelineDot, p.timelineDotSystem)} /></div><div {...stylex.props(p.timelineContent)}><div {...stylex.props(p.timelineTitle)}>Incident {incident.status.toLowerCase()}</div><div {...stylex.props(p.timelineBody)}>Response coordinated by {incident.commander}. {incident.responders.length} responders participated.</div></div></div></div></Panel><Panel><PanelHeader title="Service impact" /><div {...stylex.props(s.panelPad)}>{incident.services.map((service) => <div key={service} {...stylex.props(p.serviceImpactRow)}><span {...stylex.props(s.rowPrimary)}>{service}</span><HealthBadge health={incident.status === 'Resolved' ? 'Healthy' : 'Degraded'} /></div>)}</div></Panel></div>
    </>
  )
}

const initialTasks = [
  { title: 'Verify rollback completion', owner: 'Marcus Johnson', done: true },
  { title: 'Compare routing config across gateway instances', owner: 'Elena Rodriguez', done: false },
  { title: 'Contact payment provider if failure rate remains elevated', owner: 'Priya Patel', done: false },
  { title: 'Prepare customer status update', owner: 'Liam Brooks', done: false },
]

export function IncidentDetail({
  incident,
  alerts,
  onBack,
  onUpdate,
  onNavigate,
  onToast,
}: {
  incident: Incident
  alerts: Alert[]
  onBack: () => void
  onUpdate: (updates: Partial<Incident>) => void
  onNavigate: (section: string, id?: string) => void
  onToast: (message: string) => void
}) {
  const [tab, setTab] = useState('Timeline')
  const [tasks, setTasks] = useState(initialTasks)
  const [note, setNote] = useState('')
  const [localTimeline, setLocalTimeline] = useState(incidentTimeline)
  const [statusDraft, setStatusDraft] = useState('Investigating — engineers are actively mitigating customer impact.')

  const postNote = () => {
    if (!note.trim()) return
    setLocalTimeline((current) => [{ time: 'Now', type: 'comment', title: 'Incident update posted', body: note.trim(), actor: 'Alex Morgan' }, ...current])
    setNote('')
    onToast('Update posted to the incident timeline.')
  }

  return (
    <>
      <div {...stylex.props(p.detailToolbar, s.marginTop8)}>
        <Breadcrumb items={['Incidents', incident.id]} onBack={onBack} />
        <div {...stylex.props(s.headerActions)}><select aria-label="Add incident responder" value="" onChange={(event) => { if (event.target.value && !incident.responders.includes(event.target.value)) { onUpdate({ responders: [...incident.responders, event.target.value] }); onToast(`${event.target.value} added as a responder.`) } }} {...stylex.props(s.select)}><option value="">+ Add responder</option>{people.filter((person) => !incident.responders.includes(person.name)).map((person) => <option key={person.name} value={person.name}>{person.name}</option>)}</select><Button icon={FilePlus2} onClick={() => onToast('Follow-up action created and linked to INC-1042.')}>Follow-up</Button><Button variant="danger" icon={CheckCircle2} onClick={() => onUpdate({ status: 'Resolved' })}>Resolve incident</Button></div>
      </div>

      <Panel>
        <div {...stylex.props(p.incidentBanner, s.marginTop16)}>
          <div {...stylex.props(p.incidentBannerTop)}>
            <div {...stylex.props(s.grow)}>
              <div {...stylex.props(s.wrap)}><SeverityBadge severity={incident.severity} /><StatusBadge status={incident.status} /><span {...stylex.props(s.tiny, s.muted)}>Started today at 10:32 AM · {incident.duration}</span></div>
              <h1 {...stylex.props(p.detailTitle)}>{incident.id}: {incident.title}</h1>
              <p {...stylex.props(s.bodyText, s.noMargin)}>{incident.impact}</p>
            </div>
            <div {...stylex.props(s.headerActions)}>
              <label {...stylex.props(s.field)}><span {...stylex.props(s.label)}>Severity</span><select aria-label="Change incident severity" value={incident.severity} onChange={(event) => onUpdate({ severity: event.target.value as Severity })} {...stylex.props(s.select)}><option>SEV0</option><option>SEV1</option><option>SEV2</option><option>SEV3</option></select></label>
              <label {...stylex.props(s.field)}><span {...stylex.props(s.label)}>Status</span><select aria-label="Change incident status" value={incident.status} onChange={(event) => onUpdate({ status: event.target.value as IncidentStatus })} {...stylex.props(s.select)}><option>Investigating</option><option>Identified</option><option>Monitoring</option><option>Resolved</option></select></label>
            </div>
          </div>
          <div {...stylex.props(p.propertyGrid)}>
            <div><div {...stylex.props(p.propertyLabel)}>Commander</div><PersonLine name={incident.commander} /></div>
            <div><div {...stylex.props(p.propertyLabel)}>Responders</div><AvatarStack names={incident.responders} /></div>
            <div><div {...stylex.props(p.propertyLabel)}>Affected services</div><div {...stylex.props(s.wrap)}>{incident.services.map((service) => <Badge key={service}>{service}</Badge>)}</div></div>
            <div><div {...stylex.props(p.propertyLabel)}>Coordination</div><div {...stylex.props(p.propertyValue)}>#inc-1042-checkout</div></div>
            <div><div {...stylex.props(p.propertyLabel)}>Customer status</div><div {...stylex.props(p.propertyValue, s.negative)}>Degraded performance</div></div>
          </div>
        </div>
      </Panel>

      <div {...stylex.props(p.incidentLayout, s.marginTop12)}>
        <div {...stylex.props(s.column, s.gap12)}>
          <Panel>
            <PanelHeader title="Incident workspace" meta="Live · 6 responders present" action={<Badge tone="green" dot>Synced</Badge>} />
            <div style={{ padding: '0 17px' }}><Tabs tabs={['Timeline', 'Related signals', 'Communications']} active={tab} onChange={setTab} /></div>

            {tab === 'Timeline' ? (
              <>
                <div {...stylex.props(p.timeline)}>
                  {localTimeline.map((entry, index) => (
                    <div key={`${entry.time}-${index}`} {...stylex.props(p.timelineItem)}>
                      <div {...stylex.props(p.timelineTime)}>{entry.time}</div>
                      <div {...stylex.props(p.timelineTrack)}><span {...stylex.props(p.timelineLine)} /><span {...stylex.props(p.timelineDot, entry.type === 'alert' && p.timelineDotAlert, entry.type === 'deployment' && p.timelineDotDeploy, entry.type === 'system' && p.timelineDotSystem)} /></div>
                      <div {...stylex.props(p.timelineContent)}><div {...stylex.props(p.timelineTitle)}>{entry.title}</div><div {...stylex.props(p.timelineBody)}>{entry.body}</div><div {...stylex.props(s.rowSecondary)}>{entry.actor}</div></div>
                    </div>
                  ))}
                </div>
                <div {...stylex.props(p.composer)}>
                  <div {...stylex.props(p.composerBox)}><Avatar name="Alex Morgan" /><div {...stylex.props(s.grow)}><textarea aria-label="Post an incident update" value={note} onChange={(event) => setNote(event.target.value)} onKeyDown={(event) => { if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') postNote() }} placeholder="Post an update, observation, or decision…" {...stylex.props(s.textarea, p.composerInput)} /><div {...stylex.props(s.inlineBetween, s.marginTop8)}><span {...stylex.props(s.hint)}>⌘ Enter to post · Visible to all responders</span><Button variant="primary" size="small" icon={Send} onClick={postNote}>Post update</Button></div></div></div>
                </div>
              </>
            ) : null}

            {tab === 'Related signals' ? (
              <div {...stylex.props(s.panelPad)}>
                <h3 {...stylex.props(s.sectionTitle)}>Associated alerts</h3>
                {alerts.filter((alert) => alert.incident === 'INC-1042').map((alert) => <div key={alert.id} {...stylex.props(p.deployRow)}><AlertTriangle size={15} color="#d75a4b" /><div {...stylex.props(s.grow)}><div {...stylex.props(s.rowPrimary)}>{alert.name}</div><div {...stylex.props(s.rowSecondary)}>{alert.service} · {alert.source} · {alert.duration}</div></div><Badge tone={alert.state === 'Firing' ? 'red' : 'orange'}>{alert.state}</Badge></div>)}
                <h3 {...stylex.props(s.sectionTitle, s.marginTop20)}>Related deployment</h3>
                {deployments.filter((deployment) => deployment.incident === 'INC-1042').map((deployment) => <div key={deployment.id} {...stylex.props(p.deployRow)}><GitCommitHorizontal size={15} color="#d49334" /><div {...stylex.props(s.grow)}><div {...stylex.props(s.rowPrimary, s.mono)}>{deployment.version}</div><div {...stylex.props(s.rowSecondary)}>Production · {deployment.commit} · PR {deployment.pullRequest}</div></div><DeploymentBadge status={deployment.status} /></div>)}
              </div>
            ) : null}

            {tab === 'Communications' ? (
              <div {...stylex.props(s.panelPad, s.column, s.gap12)}>
                <div {...stylex.props(p.attention)}><ShieldAlert size={15} /><div><strong {...stylex.props(s.small)}>Public status page updated 18m ago</strong><div {...stylex.props(s.tiny, s.marginTop8)}>Checkout processing is degraded. Our team is implementing a fix. No customer action is required.</div></div></div>
                <div {...stylex.props(s.grid2)}>
                  <label {...stylex.props(s.field)}><span {...stylex.props(s.label)}>Audience</span><select {...stylex.props(s.input)}><option>Customer status page</option><option>Internal stakeholders</option><option>Support team only</option></select></label>
                  <label {...stylex.props(s.field)}><span {...stylex.props(s.label)}>Template</span><select {...stylex.props(s.input)}><option>Incident update</option><option>Monitoring update</option><option>Resolution</option></select></label>
                </div>
                <label {...stylex.props(s.field)}><span {...stylex.props(s.label)}>Next update</span><textarea value={statusDraft} onChange={(event) => setStatusDraft(event.target.value)} {...stylex.props(s.textarea)} /></label>
                <div {...stylex.props(s.inlineBetween)}><span {...stylex.props(s.hint)}>Next update due by 11:30 AM</span><Button variant="primary" icon={Send} onClick={() => onToast('Customer status update published.')}>Publish update</Button></div>
              </div>
            ) : null}
          </Panel>
        </div>

        <aside {...stylex.props(s.column, s.gap12)}>
          <Panel>
            <PanelHeader title="Live impact" meta="Updated 1m ago" />
            <div {...stylex.props(s.panelPad)}>
              <div {...stylex.props(p.rateCard)}><div {...stylex.props(s.tiny)}><Activity size={13} /> Checkout error rate</div><div {...stylex.props(p.rateValue)}>8.7%</div><div {...stylex.props(s.tiny)}>Peak 21.4% · Normal &lt;0.5%</div><svg viewBox="0 0 250 58" preserveAspectRatio="none" {...stylex.props(p.miniChart)}><polyline points="0,49 28,46 56,43 84,12 112,8 140,17 168,29 196,36 224,38 250,37" fill="none" stroke="#ff9584" strokeWidth="2" /></svg></div>
            </div>
          </Panel>

          <Panel>
            <PanelHeader title="Tasks" meta={`${tasks.filter((task) => task.done).length} of ${tasks.length} complete`} action={<IconButton icon={Plus} label="Add task" onClick={() => onToast('New incident task added.')} />} />
            <div {...stylex.props(s.panelPad)}>
              {tasks.map((task, index) => <div key={task.title} {...stylex.props(p.taskRow)}><input aria-label={`Complete ${task.title}`} type="checkbox" checked={task.done} onChange={() => setTasks((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, done: !item.done } : item))} {...stylex.props(s.checkbox)} /><div {...stylex.props(s.grow)}><div {...stylex.props(s.rowPrimary, task.done && p.taskDone)}>{task.title}</div><div {...stylex.props(s.inline, s.marginTop8)}><Avatar name={task.owner} size="small" /><span {...stylex.props(s.rowSecondary)}>{task.owner}</span></div></div></div>)}
            </div>
          </Panel>

          <Panel>
            <PanelHeader title="Service impact" action={<Button size="small" variant="ghost" onClick={() => onNavigate('services', 'payment-gateway')}>Service map</Button>} />
            <div {...stylex.props(s.panelPad)}>
              {[['Checkout API', 'Critical', '21.4% errors'], ['Payment Gateway', 'Degraded', 'P95 2.4s'], ['Order Service', 'Degraded', 'Retries elevated']].map(([name, health, meta]) => <div key={name} {...stylex.props(p.serviceImpactRow)}><div><button type="button" {...stylex.props(s.link, s.small)} onClick={() => onNavigate('services', name === 'Payment Gateway' ? 'payment-gateway' : undefined)}>{name}</button><div {...stylex.props(s.rowSecondary)}>{meta}</div></div><HealthBadge health={health as 'Critical' | 'Degraded'} /></div>)}
            </div>
          </Panel>

          <Panel>
            <PanelHeader title="Incident controls" />
            <div {...stylex.props(s.panelPad, s.column, s.gap8)}>
              <label {...stylex.props(s.field)}><span {...stylex.props(s.label)}>Incident commander</span><select aria-label="Assign incident commander" value={incident.commander} onChange={(event) => { onUpdate({ commander: event.target.value }); onToast(`${event.target.value} assigned as incident commander.`) }} {...stylex.props(s.input)}>{people.map((person) => <option key={person.name}>{person.name}</option>)}</select></label>
              <Button icon={RotateCcw} onClick={() => onToast('A follow-up action was linked to the Payments backlog.')}>Create follow-up action</Button>
              <Button icon={MessageSquare} onClick={() => onToast('Incident channel opened in Slack.')}>Open Slack channel</Button>
              <Button icon={FilePlus2} onClick={() => onNavigate('postmortems')}>Create postmortem</Button>
            </div>
          </Panel>
        </aside>
      </div>
    </>
  )
}
