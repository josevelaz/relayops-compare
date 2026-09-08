import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { Activity, ArrowDownRight, ArrowRight, ArrowUpRight, Bell, CalendarDays, Check, ChevronDown, Clock3, GitBranch, HeartPulse, Radio, ShieldCheck, ShieldAlert, Sparkles, Users, Zap } from 'lucide-react';
import { deployments, services, teams, serviceHealth } from '../data/model';
import { useStore } from '../state/store';
import { useActions } from '../state/actions';
import { AppLink, Avatar, AvatarGroup, Badge, Button, MoreLink, PageHeader, Panel, Person, Select, Status, ui } from '../components/ui';
import { ChartLegend, Sparkline, TrendChart } from '../components/Charts';

const s = stylex.create({
  date: { display: 'flex', alignItems: 'center', gap: 7, color: '#687b72', fontSize: 11, marginBottom: 9 },
  live: { display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, color: '#388e70', border: '1px solid #dcece2', borderRadius: 20, padding: '5px 9px', backgroundColor: '#f3faf6' },
  statusBanner: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 15, padding: '13px 17px', backgroundColor: '#fff7f1', border: '1px solid #f1e0d1', borderRadius: 7, marginBottom: 22, flexWrap: 'wrap' },
  bannerIcon: { width: 31, height: 31, borderRadius: 7, color: '#b97843', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9eadc' },
  bannerTitle: { color: '#956640', fontSize: 12, fontWeight: 600 },
  bannerText: { color: '#ae8a6c', fontSize: 11, marginTop: 3 },
  metrics: { display: 'grid', gridTemplateColumns: { default: 'repeat(4, minmax(0, 1fr))', '@media (max-width: 660px)': 'repeat(2, minmax(0, 1fr))' }, border: '1px solid #e2e8e7', backgroundColor: '#fff', borderRadius: 9, marginBottom: 23, overflow: 'hidden' },
  metric: { padding: { default: '20px 22px 18px', '@media (max-width: 1100px)': '18px 15px' }, borderRight: '1px solid #e9eeee', minWidth: 0 },
  metricLabel: { display: 'flex', alignItems: 'center', gap: 7, fontSize: 11, color: '#79858a', marginBottom: 12 },
  metricValue: { fontFamily: 'Manrope, sans-serif', fontSize: 29, letterSpacing: '-1.2px', lineHeight: 1, fontWeight: 750, color: '#293c3c' },
  metricSuffix: { fontSize: 15, color: '#7d8d89', fontWeight: 500, marginLeft: 3 },
  metricFoot: { fontSize: 10, color: '#6e7b75', marginTop: 11, display: 'flex', alignItems: 'center', gap: 5, flexWrap: 'wrap' },
  metricChange: { color: '#3a9979', display: 'inline-flex', gap: 2, alignItems: 'center' },
  grid: { display: 'grid', gridTemplateColumns: { default: 'minmax(0, 1fr) 306px', '@media (min-width: 1600px)': 'minmax(0, 1fr) 350px', '@media (max-width: 1120px)': 'minmax(0, 1fr) 270px', '@media (max-width: 850px)': '1fr' }, gap: 21, alignItems: 'start' },
  incident: { padding: '17px 21px', borderBottom: '1px solid #edf0ef', position: 'relative' },
  urgent: { backgroundColor: '#fffdfc', borderLeft: '3px solid #db8271', paddingLeft: 18 },
  incidentTitle: { display: 'block', color: '#33413f', fontWeight: 600, fontSize: 12, lineHeight: 1.55, marginTop: 9, marginBottom: 10 },
  incidentMeta: { color: '#6c7c72', fontSize: 10, display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' },
  serviceTag: { fontSize: 9, padding: '3px 5px', borderRadius: 3, color: '#5f7568', backgroundColor: '#f0f4f2', whiteSpace: 'nowrap' },
  footer: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 21px', backgroundColor: '#fbfcfc', color: '#8b9692', fontSize: 10 },
  oncallRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 0', borderBottom: '1px solid #eff2f0' },
  teamText: { color: '#81918a', fontSize: 10, marginTop: 4 },
  schedule: { backgroundColor: '#f6f8f7', borderRadius: 5, padding: '10px 11px', color: '#818e86', fontSize: 10, display: 'flex', alignItems: 'center', gap: 8, marginTop: 15 },
  healthLine: { display: 'flex', gap: 4, height: 9, borderRadius: 3, overflow: 'hidden', marginTop: 16, marginBottom: 13 },
  segment: (width: number, color: string) => ({ flex: width, backgroundColor: color, borderRadius: 2 }),
  healthRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 0', fontSize: 11, color: '#788b82' },
  healthValue: { fontFamily: 'Manrope, sans-serif', fontSize: 27, fontWeight: 750, letterSpacing: '-1px', color: '#355047' },
  change: { padding: '13px 0', borderBottom: '1px solid #edf1ee', display: 'flex', gap: 10, alignItems: 'flex-start' },
  changeIcon: { width: 27, height: 27, border: '1px solid #e4ebe6', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#81978a', flexShrink: 0 },
  chartMetric: { fontFamily: 'Manrope, sans-serif', fontSize: 24, fontWeight: 700, letterSpacing: '-.8px', marginRight: 8 },
  bottomNote: { marginTop: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#a0aaa5', fontSize: 10, flexWrap: 'wrap', gap: 8 },
});

export function Overview() {
  const { data } = useStore(); const { createIncident } = useActions();
  const [range, setRange] = useState('30 days');
  const active = data.incidents.filter(i => i.status !== 'Resolved');
  const primaryIncident = active.find(i => i.severity === 'SEV1' || i.severity === 'SEV0') ?? active[0];
  const firing = data.alerts.filter(a => a.state === 'Firing').length;
  const degraded = services.filter(s => serviceHealth(s.name, data.incidents) === 'Degraded').length;
  const monitoring = services.filter(s => serviceHealth(s.name, data.incidents) === 'Monitoring').length;
  const healthy = 47 - degraded - monitoring;
  return <>
    <PageHeader title="A clear view of your operations." description="Here’s what’s happening across Northstar Labs." eyebrow={<div {...stylex.props(s.date)}><span>Tuesday, September 8, 2026</span><span>·</span><span>11:08 AM UTC</span></div>} actions={<><span {...stylex.props(s.live)}><span {...stylex.props(ui.dot)} />Live overview</span><Button onClick={() => createIncident()}><ShieldAlert size={14} />Create incident</Button></>} />
    {primaryIncident && (
      <div {...stylex.props(s.statusBanner)}>
        <div {...stylex.props(ui.row)}>
          <span {...stylex.props(s.bannerIcon)}><Activity size={17} /></span>
          <div>
            <div {...stylex.props(s.bannerTitle)}>Some systems need your attention<span {...stylex.props(ui.muted)}> — </span>{active.length} active incidents</div>
            <p {...stylex.props(s.bannerText)}>{primaryIncident.status}: {primaryIncident.title}. Response is led by {primaryIncident.commander}.</p>
          </div>
        </div>
        <AppLink to={`/incidents/${primaryIncident.id}`}>View incident <ArrowRight size={14} /></AppLink>
      </div>
    )}
    <div {...stylex.props(s.metrics)}>
      <div {...stylex.props(s.metric)}><div {...stylex.props(s.metricLabel)}><ShieldAlert size={14} />Active incidents</div><div {...stylex.props(ui.between)}><strong {...stylex.props(s.metricValue)}>{active.length}</strong><div {...stylex.props(ui.row)}><Badge tone="red">{active.filter(i => i.severity === 'SEV1').length} SEV1</Badge><Badge tone="amber">{active.filter(i => i.severity === 'SEV2').length} SEV2</Badge></div></div><div {...stylex.props(s.metricFoot)}><span {...stylex.props(ui.dot, ui.amber)} />{active.filter(i => i.status === 'Investigating').length} investigating · {active.filter(i => i.status === 'Monitoring').length} monitoring</div></div>
      <div {...stylex.props(s.metric)}><div {...stylex.props(s.metricLabel)}><Bell size={14} />Firing alerts</div><div {...stylex.props(ui.between)}><strong {...stylex.props(s.metricValue)}>{firing}</strong><Sparkline color="#ca9b60" /></div><div {...stylex.props(s.metricFoot)}><span {...stylex.props(ui.amber)}>{data.alerts.filter(a => a.severity === 'SEV1' && a.state === 'Firing').length} high priority</span><span>· across {new Set(data.alerts.filter(a => a.state === 'Firing').map(a => a.service)).size} services</span></div></div>
      <div {...stylex.props(s.metric)}><div {...stylex.props(s.metricLabel)}><Clock3 size={14} />Mean time to resolve</div><div {...stylex.props(ui.between)}><strong {...stylex.props(s.metricValue)}>32<span {...stylex.props(s.metricSuffix)}>min</span></strong><Sparkline down /></div><div {...stylex.props(s.metricFoot)}><span {...stylex.props(s.metricChange)}><ArrowDownRight size={12} />18%</span><span>vs. previous 30 days</span></div></div>
      <div {...stylex.props(s.metric)}><div {...stylex.props(s.metricLabel)}><HeartPulse size={14} />Overall uptime</div><div {...stylex.props(ui.between)}><strong {...stylex.props(s.metricValue)}>99.97<span {...stylex.props(s.metricSuffix)}>%</span></strong><Sparkline /></div><div {...stylex.props(s.metricFoot)}><span {...stylex.props(s.metricChange)}><ArrowUpRight size={12} />0.02%</span><span>vs. previous 30 days</span></div></div>
    </div>
    <div {...stylex.props(s.grid)}><div {...stylex.props(ui.stack)}>
      <Panel title={<span {...stylex.props(ui.row)}><Radio size={15} color="#7e8d86" />Active incidents <span {...stylex.props(ui.count)}>{active.length}</span></span>} aside={<MoreLink to="/incidents" />} noPadding>
        {active.slice(0, 4).map(i => <article key={i.id} {...stylex.props(s.incident, i.severity === 'SEV1' && s.urgent)}><div {...stylex.props(ui.between)}><div {...stylex.props(ui.row)}><Status value={i.severity} /><span {...stylex.props(ui.mono, ui.muted)}>{i.id}</span><Status value={i.status} /></div><span {...stylex.props(ui.row, ui.tiny, ui.muted)}><Clock3 size={11} />{i.duration}</span></div><AppLink to={`/incidents/${i.id}`} subtle><h3 {...stylex.props(s.incidentTitle)}>{i.title}</h3></AppLink><div {...stylex.props(ui.between)}><div {...stylex.props(s.incidentMeta)}>{i.services.slice(0, 2).map(n => <AppLink key={n} to={`/services/${services.find(s => s.name === n)?.slug}`} subtle><span {...stylex.props(s.serviceTag)}>{n}</span></AppLink>)}{i.services.length > 2 && <span>+{i.services.length - 2}</span>}<span {...stylex.props(ui.row)}><Avatar name={i.commander} size={18} />{i.commander}</span></div><AvatarGroup names={i.responders} max={3} /></div></article>)}
        {!active.length && <p {...stylex.props(ui.empty)}>All incidents are resolved. Your systems are recovering.</p>}
        <div {...stylex.props(s.footer)}><span {...stylex.props(ui.row)}><Check size={12} />{new Set(active.flatMap(i => i.services).map(n => services.find(s => s.name === n)?.team)).size} service teams involved in response</span><MoreLink to="/incidents">Open response center</MoreLink></div>
      </Panel>
      <Panel title="Incident trends" aside={<Select aria-label="Incident trend time range" value={range} onChange={e => setRange(e.target.value)}>{['7 days', '30 days', '90 days', '6 months'].map(r => <option key={r}>{r}</option>)}</Select>}>
        <div {...stylex.props(ui.between)}><div><span {...stylex.props(s.chartMetric)}>{range === '7 days' ? 8 : range === '90 days' ? 91 : range === '6 months' ? 204 : 28}</span><span {...stylex.props(ui.small, ui.muted)}>incidents</span><p {...stylex.props(s.metricFoot)}><span {...stylex.props(s.metricChange)}><ArrowDownRight size={12} />22% fewer</span>than the previous period</p></div><ChartLegend /></div><TrendChart range={range} />
      </Panel>
      <Panel title={<span {...stylex.props(ui.row)}>Recent deployments <Badge>3 production in the last hour</Badge></span>} aside={<MoreLink to="/deployments" />} noPadding><div {...stylex.props(ui.tableWrap)}><table {...stylex.props(ui.table)}><thead><tr>{['Service / version', 'Status', 'Deployed by', 'Time'].map(h => <th key={h} {...stylex.props(ui.th)}>{h}</th>)}</tr></thead><tbody>{deployments.slice(1, 4).map(d => <tr key={d.id} {...stylex.props(ui.tr)}><td {...stylex.props(ui.td)}><AppLink to={`/deployments/${d.id}`} subtle><span {...stylex.props(ui.row, ui.strong)}><GitBranch size={14} color="#8fa094" />{d.service}</span><p {...stylex.props(ui.tableSub, ui.mono)}>{d.version} · {d.commit}</p></AppLink></td><td {...stylex.props(ui.td)}><Status value={d.status} /></td><td {...stylex.props(ui.td)}><span {...stylex.props(ui.row)}><Avatar name={d.author} size={23} />{d.author.split(' ')[0]}</span></td><td {...stylex.props(ui.td, ui.tiny)}>{d.time}</td></tr>)}</tbody></table></div></Panel>
    </div><div {...stylex.props(ui.stack)}>
      <Panel title={<span {...stylex.props(ui.row)}><Users size={15} color="#84918a" />On call now</span>} aside={<MoreLink to="/on-call">Schedule</MoreLink>}><div>{[teams[1], teams[0], teams[2], teams[3]].map(t => <div key={t.name} {...stylex.props(s.oncallRow)}><Person name={data.overrides[t.name] ?? t.primary} subtitle={t.name} /><Badge tone="green">Primary</Badge></div>)}</div><AppLink to="/on-call" subtle><div {...stylex.props(s.schedule)}><Clock3 size={13} /><span>2 engineers start their shifts later today</span><ChevronDown size={12} /></div></AppLink></Panel>
      <Panel title="Service health" aside={<MoreLink to="/services" />}><div {...stylex.props(ui.between)}><div><strong {...stylex.props(s.healthValue)}>{healthy}<span {...stylex.props(s.metricSuffix)}> / 47</span></strong><p {...stylex.props(ui.tableSub)}>production services healthy</p></div><span {...stylex.props(ui.green)}><ShieldCheck size={27} strokeWidth={1.5} /></span></div><div {...stylex.props(s.healthLine)}><div {...stylex.props(s.segment(healthy, '#68ad8d'))} /><div {...stylex.props(s.segment(degraded, '#dcb17d'))} /><div {...stylex.props(s.segment(monitoring, '#91b4cf'))} /></div><div {...stylex.props(s.healthRow)}><span {...stylex.props(ui.row)}><span {...stylex.props(ui.dot, ui.green)} />Healthy</span><span>{healthy}</span></div><div {...stylex.props(s.healthRow)}><span {...stylex.props(ui.row)}><span {...stylex.props(ui.dot, ui.amber)} />Degraded</span><span>{degraded}</span></div><div {...stylex.props(s.healthRow)}><span {...stylex.props(ui.row)}><span {...stylex.props(ui.dot)} />Monitoring</span><span>{monitoring}</span></div><p {...stylex.props(ui.tableSub)}>12 cataloged here · 35 other services healthy</p></Panel>
      <Panel title={<span {...stylex.props(ui.row)}><Sparkles size={14} color="#a18c64" />Worth your attention</span>}><div {...stylex.props(s.change)}><span {...stylex.props(s.changeIcon)}><GitBranch size={14} /></span><div><AppLink to="/deployments/DEP-481">Checkout deployment failed</AppLink><p {...stylex.props(ui.tableSub)}>Production · 17 minutes ago</p></div></div><div {...stylex.props(s.change)}><span {...stylex.props(s.changeIcon)}><ShieldCheck size={14} /></span><div><AppLink to="/postmortems/PM-028">Payment outage review is ready</AppLink><p {...stylex.props(ui.tableSub)}>2 of 4 corrective actions completed</p></div></div><div {...stylex.props(s.change)}><span {...stylex.props(s.changeIcon)}><Zap size={14} /></span><div><AppLink to="/analytics">Alert noise is down 14%</AppLink><p {...stylex.props(ui.tableSub)}>Your routing changes are paying off</p></div></div></Panel>
    </div></div><footer {...stylex.props(s.bottomNote)}><span {...stylex.props(ui.row)}><ShieldCheck size={12} />Connected to {Object.values(data.integrations).filter(Boolean).length} integrations · Demo data snapshot</span><span>{data.organization} · {data.workspace}</span></footer>
  </>;
}
