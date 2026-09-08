import * as stylex from '@stylexjs/stylex'
import { useMemo, useState } from 'react'
import {
  Activity,
  AlertTriangle,
  ArrowDown,
  ArrowRight,
  Box,
  Braces,
  Check,
  CircleDot,
  Clock3,
  ExternalLink,
  GitBranch,
  GitCommitHorizontal,
  Layers3,
  Link2,
  MoreHorizontal,
  Network,
  Plus,
  RadioTower,
  Search,
  ServerCog,
  ShieldCheck,
  Siren,
  Users,
  X,
  Zap,
} from 'lucide-react'
import { alerts as seededAlerts, deployments, services, type Alert, type Incident } from '../data'
import { p, s } from '../styles'
import { AlertBadge, Avatar, Badge, Breadcrumb, Button, DeploymentBadge, HealthBadge, IconButton, Metric, Panel, PanelHeader, PersonLine, SeverityBadge, StatusBadge, Tabs } from '../components/ui'

export function AlertsPage({ alerts, initialQuery = '', onUpdateAlert, onNavigate, onCreateIncident, onToast }: { alerts: Alert[]; initialQuery?: string; onUpdateAlert: (id: string, updates: Partial<Alert>) => void; onNavigate: (section: string, id?: string) => void; onCreateIncident: (alertId?: string) => void; onToast: (message: string) => void }) {
  const [query, setQuery] = useState(initialQuery)
  const [state, setState] = useState('Open')
  const [severity, setSeverity] = useState('All severity')
  const [selectedAlert, setSelectedAlert] = useState<Alert>()

  const visible = useMemo(() => alerts.filter((alert) => {
    const matchesQuery = `${alert.name} ${alert.service} ${alert.source} ${alert.id}`.toLowerCase().includes(query.toLowerCase())
    const matchesState = state === 'All' || (state === 'Open' ? alert.state !== 'Resolved' : alert.state === state)
    const matchesSeverity = severity === 'All severity' || alert.severity === severity
    return matchesQuery && matchesState && matchesSeverity
  }), [alerts, query, severity, state])
  const firingCount = 12 + alerts.filter((alert) => alert.state === 'Firing').length
  const acknowledgedCount = 7 + alerts.filter((alert) => alert.state === 'Acknowledged').length
  const unassignedCount = 1 + alerts.filter((alert) => alert.assignee === 'Unassigned').length

  const acknowledge = (id: string) => {
    const alert = alerts.find((item) => item.id === id)
    onUpdateAlert(id, { state: 'Acknowledged', assignee: alert?.assignee === 'Unassigned' ? 'Alex Morgan' : alert?.assignee })
    onToast(`${id} acknowledged.`)
  }

  const assignToMe = (id: string) => {
    onUpdateAlert(id, { assignee: 'Alex Morgan' })
    onToast(`${id} assigned to you.`)
  }

  return (
    <>
      <div {...stylex.props(s.pageHeader)}>
        <div><p {...stylex.props(s.eyebrow)}>Triage queue</p><h1 {...stylex.props(s.title)}>Alerts</h1><p {...stylex.props(s.subtitle)}>Reduce noise, assign ownership, and connect signals to active incidents.</p></div>
        <div {...stylex.props(s.headerActions)}><Button icon={RadioTower}>Alert policies</Button><Button variant="primary" icon={Siren} onClick={() => onCreateIncident()}>Create incident</Button></div>
      </div>

      <div {...stylex.props(s.grid4)}>
        <Metric label="Firing now" value={String(firingCount)} footer="4 critical · 6 high" trend="negative" />
        <Metric label="Acknowledged" value={String(acknowledgedCount)} footer="Median response 2m 48s" trend="positive" />
        <Metric label="Noise rate" value="23%" footer="↓ 5 points this month" trend="positive" />
        <Metric label="Unassigned" value={String(unassignedCount)} footer="Oldest open for 2h 22m" trend="negative" />
      </div>

      <div {...stylex.props(p.attention, s.marginTop12, s.marginBottom12)}><AlertTriangle size={16} /><div {...stylex.props(s.grow)}><strong {...stylex.props(s.small)}>Correlated alert cluster: Checkout critical path</strong><div {...stylex.props(s.tiny, s.marginTop8)}>4 alerts across Checkout API, Payment Gateway, and Order Service are grouped under INC-1042.</div></div><Button size="small" onClick={() => onNavigate('incidents', 'INC-1042')}>Open incident</Button></div>

      <Panel>
        <div {...stylex.props(s.toolbar)}>
          <div {...stylex.props(s.inputWrap)}><Search {...stylex.props(s.inputIcon)} /><input aria-label="Search alerts" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search alerts, services, or sources" {...stylex.props(s.input, s.inputWithIcon)} /></div>
          <select aria-label="Filter alert severity" value={severity} onChange={(event) => setSeverity(event.target.value)} {...stylex.props(s.select)}><option>All severity</option><option>Critical</option><option>High</option><option>Medium</option><option>Low</option></select>
          <div {...stylex.props(s.segmented)}>{['Open', 'Acknowledged', 'All'].map((item) => <button type="button" key={item} onClick={() => setState(item)} {...stylex.props(s.segment, state === item && s.segmentActive)}>{item}</button>)}</div>
        </div>
        <div {...stylex.props(s.tableWrap)}>
          <table {...stylex.props(s.table)}>
            <thead><tr><th {...stylex.props(s.th)}>Alert</th><th {...stylex.props(s.th)}>Severity / state</th><th {...stylex.props(s.th)}>Service</th><th {...stylex.props(s.th)}>Source</th><th {...stylex.props(s.th)}>Triggered</th><th {...stylex.props(s.th)}>Assignee</th><th {...stylex.props(s.th)}>Related incident</th><th {...stylex.props(s.th)}>Actions</th></tr></thead>
            <tbody>{visible.map((alert) => <AlertRow key={alert.id} alert={alert} acknowledge={acknowledge} assignToMe={assignToMe} onNavigate={onNavigate} onCreateIncident={onCreateIncident} onInspect={setSelectedAlert} />)}</tbody>
          </table>
          {!visible.length ? <div {...stylex.props(s.emptyFilter)}>No alerts match these filters.</div> : null}
        </div>
      </Panel>
      {selectedAlert ? (
        <div role="dialog" aria-modal="true" aria-label={`${selectedAlert.id} alert details`} {...stylex.props(s.overlay)} onMouseDown={(event) => event.target === event.currentTarget && setSelectedAlert(undefined)}>
          <div {...stylex.props(s.modal)}>
            <div {...stylex.props(s.modalHeader)}><div><h2 {...stylex.props(s.panelTitle)}>{selectedAlert.name}</h2><div {...stylex.props(s.rowSecondary, s.mono)}>{selectedAlert.id} · {selectedAlert.source}</div></div><IconButton icon={X} label="Close alert details" onClick={() => setSelectedAlert(undefined)} /></div>
            <div {...stylex.props(s.modalBody, s.column, s.gap16)}>
              <div {...stylex.props(s.wrap)}><AlertBadge severity={selectedAlert.severity} /><Badge tone={selectedAlert.state === 'Firing' ? 'red' : 'orange'} dot>{selectedAlert.state}</Badge><Badge>{selectedAlert.service}</Badge></div>
              <div {...stylex.props(s.grid2)}><div><div {...stylex.props(p.propertyLabel)}>Triggered</div><div {...stylex.props(p.propertyValue)}>{selectedAlert.triggered} · {selectedAlert.duration}</div></div><div><div {...stylex.props(p.propertyLabel)}>Assignee</div><div {...stylex.props(p.propertyValue)}>{selectedAlert.assignee}</div></div><div><div {...stylex.props(p.propertyLabel)}>Source</div><div {...stylex.props(p.propertyValue)}>{selectedAlert.source}</div></div><div><div {...stylex.props(p.propertyLabel)}>Related incident</div><div {...stylex.props(p.propertyValue)}>{selectedAlert.incident ?? 'None'}</div></div></div>
              <div {...stylex.props(p.rateCard)}><div {...stylex.props(s.tiny)}>Signal value · last 45 minutes</div><div {...stylex.props(p.rateValue)}>{selectedAlert.name.includes('latency') ? '2.4s' : selectedAlert.name.includes('error') ? '8.7%' : '94.2%'}</div><svg viewBox="0 0 420 70" preserveAspectRatio="none" style={{ width: '100%', height: 70 }}><polyline points="0,58 55,55 110,57 165,50 220,17 275,26 330,22 375,31 420,29" fill="none" stroke="#ff9c8a" strokeWidth="2" /></svg></div>
              <div><h3 {...stylex.props(s.sectionTitle)}>Signal history</h3><div {...stylex.props(p.deployRow)}><CircleDot size={13} /><div><div {...stylex.props(s.rowPrimary)}>Alert triggered</div><div {...stylex.props(s.rowSecondary)}>{selectedAlert.triggered} · threshold exceeded for 5 minutes</div></div></div>{selectedAlert.state === 'Acknowledged' ? <div {...stylex.props(p.deployRow)}><Check size={13} /><div><div {...stylex.props(s.rowPrimary)}>Acknowledged by {selectedAlert.assignee}</div><div {...stylex.props(s.rowSecondary)}>Triage in progress</div></div></div> : null}</div>
            </div>
            <div {...stylex.props(s.modalFooter)}>{!selectedAlert.incident ? <Button onClick={() => { onUpdateAlert(selectedAlert.id, { incident: 'INC-1042' }); setSelectedAlert({ ...selectedAlert, incident: 'INC-1042' }); onToast(`${selectedAlert.id} associated with INC-1042.`) }}>Associate with INC-1042</Button> : <Button onClick={() => onNavigate('incidents', selectedAlert.incident)}>Open {selectedAlert.incident}</Button>}{selectedAlert.state === 'Firing' ? <Button variant="primary" icon={Check} onClick={() => { acknowledge(selectedAlert.id); setSelectedAlert({ ...selectedAlert, state: 'Acknowledged' }) }}>Acknowledge</Button> : null}</div>
          </div>
        </div>
      ) : null}
    </>
  )
}

function AlertRow({ alert, acknowledge, assignToMe, onNavigate, onCreateIncident, onInspect }: { alert: Alert; acknowledge: (id: string) => void; assignToMe: (id: string) => void; onNavigate: (section: string, id?: string) => void; onCreateIncident: (alertId?: string) => void; onInspect: (alert: Alert) => void }) {
  return (
    <tr {...stylex.props(s.trClickable)}>
      <td {...stylex.props(s.td)}><div {...stylex.props(s.rowPrimary)}>{alert.name}</div><div {...stylex.props(s.rowSecondary, s.mono)}>{alert.id} · {alert.duration}</div></td>
      <td {...stylex.props(s.td)}><div {...stylex.props(s.wrap)}><AlertBadge severity={alert.severity} /><Badge tone={alert.state === 'Firing' ? 'red' : alert.state === 'Acknowledged' ? 'orange' : 'green'} dot>{alert.state}</Badge></div></td>
      <td {...stylex.props(s.td)}><button type="button" {...stylex.props(s.link)} onClick={() => onNavigate('services', alert.service === 'Payment Gateway' ? 'payment-gateway' : undefined)}>{alert.service}</button></td>
      <td {...stylex.props(s.td)}>{alert.source}</td>
      <td {...stylex.props(s.td)}><div>{alert.triggered}</div><div {...stylex.props(s.rowSecondary)}>{alert.duration}</div></td>
      <td {...stylex.props(s.td)}>{alert.assignee === 'Unassigned' ? <Badge tone="gray">Unassigned</Badge> : <PersonLine name={alert.assignee} />}</td>
      <td {...stylex.props(s.td)}>{alert.incident ? <button type="button" {...stylex.props(s.link, s.mono)} onClick={() => onNavigate('incidents', alert.incident)}>{alert.incident}</button> : <span {...stylex.props(s.muted)}>—</span>}</td>
      <td {...stylex.props(s.td)}><div {...stylex.props(s.wrap)}>{alert.state === 'Firing' ? <Button size="small" icon={Check} onClick={() => acknowledge(alert.id)}>Acknowledge</Button> : null}{alert.assignee === 'Unassigned' ? <Button size="small" onClick={() => assignToMe(alert.id)}>Assign me</Button> : null}{!alert.incident ? <Button size="small" icon={Link2} onClick={() => onCreateIncident(alert.id)}>Create incident</Button> : null}<IconButton icon={MoreHorizontal} label={`Inspect ${alert.id}`} onClick={() => onInspect(alert)} /></div></td>
    </tr>
  )
}

export function ServicesPage({ initialQuery = '', onOpen }: { initialQuery?: string; onOpen: (slug: string) => void }) {
  const [query, setQuery] = useState(initialQuery.replaceAll('-', ' '))
  const [tier, setTier] = useState('All tiers')
  const [health, setHealth] = useState('All health')
  const visible = services.filter((service) => `${service.name} ${service.owner} ${service.technology}`.toLowerCase().includes(query.toLowerCase()) && (tier === 'All tiers' || service.tier === tier) && (health === 'All health' || service.health === health))
  return (
    <>
      <div {...stylex.props(s.pageHeader)}><div><p {...stylex.props(s.eyebrow)}>Service catalog</p><h1 {...stylex.props(s.title)}>Services</h1><p {...stylex.props(s.subtitle)}>Ownership and operational health for 47 production services.</p></div><div {...stylex.props(s.headerActions)}><Button icon={Network}>Dependency map</Button><Button variant="primary" icon={Plus}>Register service</Button></div></div>
      <Panel>
        <div {...stylex.props(s.toolbar)}><div {...stylex.props(s.inputWrap)}><Search {...stylex.props(s.inputIcon)} /><input aria-label="Search services" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by service, team, or technology" {...stylex.props(s.input, s.inputWithIcon)} /></div><select value={tier} onChange={(event) => setTier(event.target.value)} aria-label="Filter service tier" {...stylex.props(s.select)}><option>All tiers</option><option>Tier 1</option><option>Tier 2</option><option>Tier 3</option></select><select value={health} onChange={(event) => setHealth(event.target.value)} aria-label="Filter service health" {...stylex.props(s.select)}><option>All health</option><option>Critical</option><option>Degraded</option><option>Healthy</option></select><Badge tone="green">33 healthy</Badge><Badge tone="orange">14 need attention</Badge></div>
      </Panel>
      <div {...stylex.props(p.servicesGrid, s.marginTop12)}>
        {visible.map((service) => (
          <section key={service.slug} tabIndex={0} role="button" onClick={() => onOpen(service.slug)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); onOpen(service.slug) } }} {...stylex.props(s.panel, p.serviceCard)}>
            <div {...stylex.props(s.inlineBetween)}><div {...stylex.props(s.inline)}><span {...stylex.props(p.serviceIcon)}><Box size={16} /></span><div><div {...stylex.props(s.rowPrimary)}>{service.name}</div><div {...stylex.props(s.rowSecondary)}>{service.owner} · {service.tier}</div></div></div><HealthBadge health={service.health} /></div>
            <div {...stylex.props(p.serviceHealthLine)}><div><div {...stylex.props(p.serviceStatLabel)}>Uptime</div><div {...stylex.props(p.serviceStatValue)}>{service.uptime}</div></div><div><div {...stylex.props(p.serviceStatLabel)}>Incidents</div><div {...stylex.props(p.serviceStatValue)}>{service.incidents}</div></div><div><div {...stylex.props(p.serviceStatLabel)}>Alerts</div><div {...stylex.props(p.serviceStatValue)}>{service.alerts}</div></div></div>
            <div {...stylex.props(s.inlineBetween, s.marginTop12)}><span {...stylex.props(s.tiny, s.muted, s.mono)}>{service.repository}</span><span {...stylex.props(s.tiny, s.muted)}>{service.deployment}</span></div>
          </section>
        ))}
      </div>
    </>
  )
}

export function ServiceDetail({ incident, alerts, onBack, onNavigate }: { incident: Incident; alerts: Alert[]; onBack: () => void; onNavigate: (section: string, id?: string) => void }) {
  const [tab, setTab] = useState('Overview')
  const paymentAlerts = alerts.filter((alert) => alert.service === 'Payment Gateway' && alert.state !== 'Resolved')
  return (
    <>
      <div {...stylex.props(p.detailToolbar)}><Breadcrumb items={['Services', 'Payment Gateway']} onBack={onBack} /><div {...stylex.props(s.headerActions)}><Button icon={ExternalLink}>Runbook</Button><Button icon={GitBranch}>Repository</Button><Button variant="primary" icon={Siren} onClick={() => onNavigate('incidents', 'INC-1042')}>{incident.status === 'Resolved' ? 'View incident' : 'Active incident'}</Button></div></div>
      <Panel>
        <div {...stylex.props(p.serviceHeader, s.marginTop16)}>
          <div {...stylex.props(s.inline)}><span {...stylex.props(p.serviceIcon)}><Zap size={18} /></span><div><div {...stylex.props(s.wrap)}><h1 {...stylex.props(p.detailTitle, s.noMargin)}>Payment Gateway</h1><HealthBadge health={incident.status === 'Resolved' ? 'Healthy' : 'Degraded'} /><Badge>Tier 1</Badge></div><p {...stylex.props(s.subtitle)}>Routes and authorizes payment requests across providers.</p></div></div>
          <div {...stylex.props(s.headerActions)}><PersonLine name="Priya Patel" detail="On call · Payments" /></div>
        </div>
        <div {...stylex.props(p.propertyGrid)} style={{ padding: '0 19px 19px' }}>
          <div><div {...stylex.props(p.propertyLabel)}>Owning team</div><button type="button" {...stylex.props(s.link)} onClick={() => onNavigate('teams', 'payments')}>Payments</button></div>
          <div><div {...stylex.props(p.propertyLabel)}>Repository</div><div {...stylex.props(p.propertyValue, s.mono)}>relay/payment-gateway</div></div>
          <div><div {...stylex.props(p.propertyLabel)}>Runtime</div><div {...stylex.props(p.propertyValue)}>Node.js 22</div></div>
          <div><div {...stylex.props(p.propertyLabel)}>Infrastructure</div><div {...stylex.props(p.propertyValue)}>Kubernetes</div></div>
          <div><div {...stylex.props(p.propertyLabel)}>Primary region</div><div {...stylex.props(p.propertyValue)}>us-east-1</div></div>
        </div>
      </Panel>

      <div {...stylex.props(s.marginTop16)}><Tabs tabs={['Overview', 'Signals', 'Changes', 'Dependencies']} active={tab} onChange={setTab} /></div>

      {tab === 'Overview' ? (
        <div {...stylex.props(s.column, s.gap12)}>
          <div {...stylex.props(s.grid4)}><Metric label="30-day uptime" value="99.93%" footer="Target 99.95%" trend="negative" /><Metric label="Request latency P95" value="2.4s" footer="Baseline 420ms" trend="negative" /><Metric label="Error rate" value="8.7%" footer="Peak 21.4%" trend="negative" /><Metric label="Throughput" value="142k/min" footer="18% below baseline" trend="negative" /></div>
          <div {...stylex.props(p.chartLayout)}>
            <Panel><PanelHeader title="Reliability and latency" meta="Last 6 hours · Production" action={<Badge tone="orange">SLO at risk</Badge>} /><div {...stylex.props(s.panelPad)}><svg viewBox="0 0 600 190" role="img" aria-label="Payment Gateway latency and error rate" preserveAspectRatio="none" style={{ width: '100%', height: 190 }}><line x1="0" y1="155" x2="600" y2="155" stroke="#e7eaeb" /><line x1="0" y1="95" x2="600" y2="95" stroke="#e7eaeb" /><line x1="0" y1="35" x2="600" y2="35" stroke="#e7eaeb" /><path d="M0 145 C80 140,100 144,150 136 S240 140,300 128 S390 134,430 110 S475 25,510 46 S560 76,600 82" fill="none" stroke="#e36e55" strokeWidth="2.5" /><path d="M0 160 C80 158,140 162,210 157 S350 161,420 155 S480 70,520 94 S570 115,600 112" fill="none" stroke="#5366dc" strokeWidth="2.2" /></svg><div {...stylex.props(s.inlineBetween, s.tiny, s.muted)}><span>6 hours ago</span><span>Deployment 4.18.2 ↑</span><span>Now</span></div><div {...stylex.props(s.wrap, s.marginTop12)}><Badge tone="red" dot>Error rate</Badge><Badge tone="blue" dot>P95 latency</Badge></div></div></Panel>
            <Panel><PanelHeader title="Current operational state" /><div {...stylex.props(s.panelPad, s.column, s.gap12)}><div {...stylex.props(p.attention)}><AlertTriangle size={15} /><div><strong {...stylex.props(s.small)}>{incident.status === 'Resolved' ? 'Recent SEV1 incident resolved' : `Active ${incident.severity} incident`}</strong><div {...stylex.props(s.tiny, s.marginTop8)}>{incident.status === 'Resolved' ? 'Checkout signals are returning to baseline.' : 'Checkout failures remain above normal after rollback.'}</div><Button size="small" variant="ghost" onClick={() => onNavigate('incidents', 'INC-1042')}>INC-1042 <ArrowRight size={12} /></Button></div></div><div {...stylex.props(s.inlineBetween)}><span {...stylex.props(s.small)}>Active alerts</span><Badge tone={paymentAlerts.some((alert) => alert.state === 'Firing') ? 'red' : 'orange'}>{paymentAlerts.length}</Badge></div><div {...stylex.props(s.inlineBetween)}><span {...stylex.props(s.small)}>Error budget remaining</span><strong {...stylex.props(s.small)}>42%</strong></div><div {...stylex.props(s.inlineBetween)}><span {...stylex.props(s.small)}>Next SLO review</span><span {...stylex.props(s.small)}>Sep 14</span></div></div></Panel>
          </div>
          <Panel><PanelHeader title="Service relationships" meta="Direct production dependencies" action={<Button size="small" icon={Network}>Open map</Button>} /><div {...stylex.props(p.relationship)}><div {...stylex.props(p.relationColumn)}><span {...stylex.props(s.eyebrow)}>Depends on</span>{['Authentication Service', 'Billing Service'].map((name) => <div key={name} {...stylex.props(p.relationCard)}><Box size={13} />{name}<HealthBadge health="Healthy" /></div>)}</div><div {...stylex.props(p.relationCenter)}><ArrowDown size={17} /><span>Payment Gateway</span><ArrowDown size={17} /></div><div {...stylex.props(p.relationColumn)}><span {...stylex.props(s.eyebrow)}>Used by</span>{['Checkout API', 'Order Service'].map((name) => <div key={name} {...stylex.props(p.relationCard)}><Box size={13} />{name}<HealthBadge health={name === 'Checkout API' ? 'Critical' : 'Degraded'} /></div>)}</div></div></Panel>
        </div>
      ) : null}

      {tab === 'Signals' ? <Panel><PanelHeader title="Active alerts" meta={`${paymentAlerts.length} open signals`} /><div {...stylex.props(s.panelPad)}>{paymentAlerts.map((alert) => <div key={alert.id} {...stylex.props(p.deployRow)}><AlertTriangle size={15} color="#d85849" /><div {...stylex.props(s.grow)}><div {...stylex.props(s.rowPrimary)}>{alert.name}</div><div {...stylex.props(s.rowSecondary)}>{alert.source} · {alert.triggered} · {alert.duration}</div></div><AlertBadge severity={alert.severity} /><Badge tone={alert.state === 'Firing' ? 'red' : 'orange'}>{alert.state}</Badge></div>)}</div></Panel> : null}
      {tab === 'Changes' ? <Panel><PanelHeader title="Recent deployments" meta="Payment Gateway" /><div {...stylex.props(s.panelPad)}>{deployments.filter((deployment) => deployment.service === 'Payment Gateway').map((deployment) => <div key={deployment.id} {...stylex.props(p.deployRow)}><GitCommitHorizontal size={15} /><div {...stylex.props(s.grow)}><div {...stylex.props(s.rowPrimary, s.mono)}>{deployment.version}</div><div {...stylex.props(s.rowSecondary)}>{deployment.environment} · {deployment.commit} · {deployment.timestamp}</div></div><DeploymentBadge status={deployment.status} /></div>)}</div></Panel> : null}
      {tab === 'Dependencies' ? <Panel><PanelHeader title="Dependency health" meta="4 direct relationships" /><div {...stylex.props(p.relationship)}><div {...stylex.props(p.relationColumn)}>{['Authentication Service', 'Billing Service'].map((name) => <div key={name} {...stylex.props(p.relationCard)}><ServerCog size={14} />{name}<HealthBadge health="Healthy" /></div>)}</div><div {...stylex.props(p.relationCard, p.selectedService)}><Zap size={14} />Payment Gateway</div><div {...stylex.props(p.relationColumn)}>{['Checkout API', 'Order Service'].map((name) => <div key={name} {...stylex.props(p.relationCard)}><Layers3 size={14} />{name}<HealthBadge health={name === 'Checkout API' ? 'Critical' : 'Degraded'} /></div>)}</div></div></Panel> : null}
    </>
  )
}
