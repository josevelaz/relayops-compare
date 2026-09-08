import * as stylex from '@stylexjs/stylex'
import {
  ArrowRight,
  BellRing,
  Clock3,
  ExternalLink,
  GitCommitHorizontal,
  Radio,
  ShieldCheck,
  Siren,
  TrendingDown,
  TriangleAlert,
  Users,
} from 'lucide-react'
import { deployments, type Alert, type Incident } from '../data'
import { p, s } from '../styles'
import { Avatar, AvatarStack, Badge, Button, DeploymentBadge, Metric, Panel, PanelHeader, SeverityBadge, StatusBadge } from '../components/ui'

function TrendChart() {
  return (
    <svg viewBox="0 0 520 150" role="img" aria-label="Incident volume for the last 14 days" preserveAspectRatio="none" {...stylex.props(p.chart)}>
      <defs>
        <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6271df" stopOpacity="0.24" />
          <stop offset="100%" stopColor="#6271df" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[25, 65, 105, 145].map((y) => <line key={y} x1="0" y1={y} x2="520" y2={y} {...stylex.props(p.chartGrid)} />)}
      <path d="M0 115 L40 104 L80 110 L120 84 L160 96 L200 62 L240 75 L280 52 L320 68 L360 41 L400 56 L440 78 L480 63 L520 32 L520 150 L0 150 Z" {...stylex.props(p.chartArea)} />
      <path d="M0 115 L40 104 L80 110 L120 84 L160 96 L200 62 L240 75 L280 52 L320 68 L360 41 L400 56 L440 78 L480 63 L520 32" {...stylex.props(p.chartLine)} />
      <circle cx="520" cy="32" r="4" {...stylex.props(p.chartDot)} />
    </svg>
  )
}

export function Overview({ incidents, alerts, onNavigate }: { incidents: Incident[]; alerts: Alert[]; onNavigate: (section: string, id?: string) => void }) {
  const focus = incidents.find((incident) => incident.id === 'INC-1042') ?? incidents[0]
  const active = incidents.filter((incident) => incident.status !== 'Resolved')
  const activeMajor = active.filter((incident) => incident.severity === 'SEV0' || incident.severity === 'SEV1').length
  const firingAlertCount = 12 + alerts.filter((alert) => alert.state === 'Firing').length
  return (
    <>
      <div {...stylex.props(s.pageHeader)}>
        <div>
          <p {...stylex.props(s.eyebrow)}>Tuesday · September 8</p>
          <h1 {...stylex.props(s.title)}>Good morning, Alex.</h1>
          <p {...stylex.props(s.subtitle)}>{activeMajor ? `${activeMajor} major incident${activeMajor > 1 ? 's' : ''} need attention.` : 'No major incidents are active.'} Production is otherwise stable across Northstar Labs.</p>
        </div>
        <div {...stylex.props(s.headerActions)}>
          <Badge tone="green" dot>Platform available</Badge>
          <Button icon={ExternalLink}>Status page</Button>
        </div>
      </div>

      <div {...stylex.props(p.overviewGrid)}>
        <div {...stylex.props(s.column, s.gap12)}>
          <Panel>
            <div {...stylex.props(p.incidentHero)}>
              <div {...stylex.props(p.incidentHeroTop)}>
                <div {...stylex.props(s.grow)}>
                  <div {...stylex.props(s.wrap)}><SeverityBadge severity={focus.severity} /><StatusBadge status={focus.status} /><span {...stylex.props(s.tiny, s.muted)}>{focus.id} · started {focus.duration} ago</span></div>
                  <h2 {...stylex.props(p.incidentTitle)}>{focus.title}</h2>
                  <p {...stylex.props(s.bodyText, s.noMargin)}>{focus.status === 'Resolved' ? 'Customer impact has ended. The Payments team is preserving context for the postmortem.' : 'Rollback reduced errors, but two gateway instances still have stale payment routing configuration.'}</p>
                </div>
                <Button variant="primary" icon={Siren} onClick={() => onNavigate('incidents', 'INC-1042')}>Open incident</Button>
              </div>
              <div {...stylex.props(p.incidentStats)}>
                <div {...stylex.props(p.incidentStat)}><div {...stylex.props(p.statLabel)}>Current error rate</div><div {...stylex.props(p.statValue, s.negative)}>8.7% <TrendingDown size={11} /></div></div>
                <div {...stylex.props(p.incidentStat)}><div {...stylex.props(p.statLabel)}>Peak</div><div {...stylex.props(p.statValue)}>21.4%</div></div>
                <div {...stylex.props(p.incidentStat)}><div {...stylex.props(p.statLabel)}>Commander</div><div {...stylex.props(s.inline)}><Avatar name={focus.commander} size="small" /><span {...stylex.props(p.statValue)}>{focus.commander}</span></div></div>
                <div {...stylex.props(p.incidentStat)}><div {...stylex.props(p.statLabel)}>Responders</div><AvatarStack names={focus.responders} /></div>
              </div>
            </div>
          </Panel>

          <div {...stylex.props(s.grid4)}>
            <Metric label="Active incidents" value={String(active.length)} footer={`${activeMajor} major · ${active.filter((incident) => incident.status === 'Monitoring').length} monitoring`} trend={activeMajor ? 'negative' : 'positive'} />
            <Metric label="Firing alerts" value={String(firingAlertCount)} footer="↓ 14% from last Tuesday" trend="positive" />
            <Metric label="MTTR · 30 days" value="46m" footer="6m faster than prior period" trend="positive" />
            <Metric label="Reliability · 30 days" value="99.95%" footer="+0.02% from prior period" trend="positive" />
          </div>

          <div {...stylex.props(s.grid2)}>
            <Panel>
              <PanelHeader title="Incident trend" meta="Last 14 days" action={<Badge tone="green">−12% vs prior</Badge>} />
              <div {...stylex.props(s.panelPad)}>
                <div {...stylex.props(s.inlineBetween)}><div><div {...stylex.props(s.metricValue)}>18</div><div {...stylex.props(s.tiny, s.muted)}>incidents total</div></div><div {...stylex.props(s.wrap)}><Badge tone="red">2 SEV1</Badge><Badge tone="orange">7 SEV2</Badge><Badge>9 SEV3</Badge></div></div>
                <TrendChart />
                <div {...stylex.props(s.inlineBetween, s.tiny, s.muted)}><span>Aug 26</span><span>Sep 1</span><span>Today</span></div>
              </div>
            </Panel>
            <Panel>
              <PanelHeader title="Service health" meta="47 production services" action={<Button variant="ghost" size="small" onClick={() => onNavigate('services')}>Catalog <ArrowRight size={12} /></Button>} />
              <div {...stylex.props(s.panelPad)}>
                <div {...stylex.props(s.inlineBetween)}><div><div {...stylex.props(s.metricValue)}>33 / 47</div><div {...stylex.props(s.tiny, s.muted)}>services healthy</div></div><ShieldCheck size={23} color="#42a77b" /></div>
                <div {...stylex.props(p.healthBar, s.marginTop16)}><span {...stylex.props(p.healthCritical)} /><span {...stylex.props(p.healthDegraded)} /><span {...stylex.props(p.healthHealthy)} /></div>
                <div {...stylex.props(p.healthLegend)}><span {...stylex.props(p.legendItem)}><Badge tone="red">4</Badge> Critical</span><span {...stylex.props(p.legendItem)}><Badge tone="orange">10</Badge> Degraded</span><span {...stylex.props(p.legendItem)}><Badge tone="green">33</Badge> Healthy</span></div>
                <hr {...stylex.props(s.divider)} />
                {focus.status !== 'Resolved' ? <div {...stylex.props(p.attention)}><TriangleAlert size={15} /><div><strong {...stylex.props(s.small)}>Payments critical path</strong><div {...stylex.props(s.tiny, s.marginTop8)}>3 of 4 services have active alerts following a production deployment.</div></div></div> : <div {...stylex.props(p.attention)}><ShieldCheck size={15} /><div><strong {...stylex.props(s.small)}>Payments impact resolved</strong><div {...stylex.props(s.tiny, s.marginTop8)}>Checkout signals are returning to their normal baseline.</div></div></div>}
              </div>
            </Panel>
          </div>
        </div>

        <div {...stylex.props(s.column, s.gap12)}>
          <Panel>
            <PanelHeader title="On call now" meta="Coverage across 5 teams" action={<Button variant="ghost" size="small" onClick={() => onNavigate('on-call')}>Schedule</Button>} />
            <div {...stylex.props(s.panelPad)}>
              {[
                ['Priya Patel', 'Payments', 'Primary until 12:00 PM'],
                ['Jordan Kim', 'Platform', 'Primary until 4:00 PM'],
                ['Maya Singh', 'Infrastructure', 'Primary until 6:00 PM'],
              ].map(([name, team, shift]) => <div key={name} {...stylex.props(p.personRow)}><Avatar name={name} /><div {...stylex.props(s.grow)}><div {...stylex.props(s.rowPrimary)}>{name}</div><div {...stylex.props(s.rowSecondary)}>{team} · {shift}</div></div><Badge tone="green" dot>Online</Badge></div>)}
              <div {...stylex.props(p.attention, s.marginTop12)}><Clock3 size={15} /><div {...stylex.props(s.tiny)}><strong>2 shifts start later today.</strong><br />Elena Rodriguez and Liam Brooks begin at 12:00 PM.</div></div>
            </div>
          </Panel>

          <Panel>
            <PanelHeader title="Recent deployments" meta="3 production deploys in the last hour" action={<Button variant="ghost" size="small" onClick={() => onNavigate('deployments')}>All deploys</Button>} />
            <div {...stylex.props(s.panelPad)}>
              {deployments.slice(0, 4).map((deployment) => (
                <div key={deployment.id} {...stylex.props(p.deployRow)}>
                  <span {...stylex.props(p.deployRail, (deployment.status === 'Failed' || deployment.status === 'Rolled back') && p.deployRailDanger, deployment.status === 'Rolling out' && p.deployRailWarn)} />
                  <div {...stylex.props(s.grow)}><div {...stylex.props(s.rowPrimary)}>{deployment.service}</div><div {...stylex.props(s.rowSecondary, s.mono)}>{deployment.version} · {deployment.timestamp.replace('Today, ', '')}</div></div>
                  <DeploymentBadge status={deployment.status} />
                </div>
              ))}
            </div>
          </Panel>

          <Panel>
            <PanelHeader title="Needs attention" meta="Changes and risk" />
            <div {...stylex.props(s.panelPad, s.column, s.gap12)}>
              <div {...stylex.props(s.inline)}><span {...stylex.props(s.commandIcon)}><GitCommitHorizontal size={14} /></span><div {...stylex.props(s.grow)}><div {...stylex.props(s.rowPrimary)}>Analytics staging deploy failed</div><div {...stylex.props(s.rowSecondary)}>Build step timed out · 1h ago</div></div><ArrowRight size={13} /></div>
              <div {...stylex.props(s.inline)}><span {...stylex.props(s.commandIcon)}><BellRing size={14} /></span><div {...stylex.props(s.grow)}><div {...stylex.props(s.rowPrimary)}>Authentication anomaly unassigned</div><div {...stylex.props(s.rowSecondary)}>Firing for 1h 16m</div></div><ArrowRight size={13} /></div>
              <div {...stylex.props(s.inline)}><span {...stylex.props(s.commandIcon)}><Users size={14} /></span><div {...stylex.props(s.grow)}><div {...stylex.props(s.rowPrimary)}>2 action items overdue</div><div {...stylex.props(s.rowSecondary)}>Payments · PM-128</div></div><ArrowRight size={13} /></div>
            </div>
          </Panel>
        </div>
      </div>
    </>
  )
}
