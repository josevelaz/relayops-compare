import * as React from 'react';
import * as stylex from '@stylexjs/stylex';
import { createFileRoute, Link } from '@tanstack/react-router';
import { AlertTriangle, ArrowRight, CheckCircle2, Clock, GitBranch, Moon, ShieldCheck, TrendingDown, Users } from 'lucide-react';
import { tokens } from '../styles/tokens.stylex';
import { useApp } from '../data/store';
import { deployments, onCall, personById, serviceById, teamById } from '../data/model';
import { Avatar, AvatarStack, Button, HealthBadge, Progress, SectionHeader, SevBadge, Sparkline, StatusBadge, Tag, card, type } from '../components/ui';

export const Route = createFileRoute('/')({
  component: OverviewPage,
});

function OverviewPage() {
  const { incidents, alerts, openCreate, openPalette } = useApp();
  const active = incidents.filter((i) => i.status !== 'Resolved');
  const sev1 = active.find((i) => i.id === 'INC-1042') ?? active[0];
  const firing = alerts.filter((a) => a.state === 'Firing');
  const acked = alerts.filter((a) => a.state === 'Acknowledged');
  const critical = Object.values(serviceById).filter((s) => s.health === 'Critical');
  const degraded = Object.values(serviceById).filter((s) => s.health === 'Degraded');
  const recentDeps = [...deployments].slice(0, 5);
  const failedDeps = deployments.filter((d) => d.status === 'Failed' || d.status === 'Rolled back');

  return (
    <div {...stylex.props(page.wrap)}>
      <div {...stylex.props(page.head)}>
        <div>
          <p {...stylex.props(type.label)}>Tuesday, September 8 · Production Engineering</p>
          <h1 {...stylex.props(type.h1)} style={{ fontSize: 26, marginTop: 4 }}>Operations overview</h1>
          <p {...stylex.props(type.sub)} style={{ marginTop: 5 }}>
            1 SEV1 under investigation · {active.length - 1} more active incidents · {firing.length} firing alerts · 3 deploys in the last hour
          </p>
        </div>
        <div {...stylex.props(page.headActions)}>
          <Button tone="secondary" onClick={() => openPalette('actions')}>Quick actions</Button>
          <Button tone="primary" onClick={() => openCreate()}>Declare incident</Button>
        </div>
      </div>

      {sev1 && (
        <Link to="/incidents/$incidentId" params={{ incidentId: sev1.id }} {...stylex.props(banner.link)}>
          <article {...stylex.props(banner.box)} aria-label="Active critical incident">
            <span {...stylex.props(banner.stripe)} aria-hidden />
            <div {...stylex.props(banner.main)}>
              <div {...stylex.props(banner.row)}>
                <SevBadge sev={sev1.severity} pulse />
                <StatusBadge status={sev1.status} />
                <span {...stylex.props(banner.id)}>{sev1.id} · {sev1.durationLabel} elapsed</span>
              </div>
              <h2 {...stylex.props(banner.title)}>{sev1.title}</h2>
              <p {...stylex.props(banner.sub)}>
                Checkout error rate <strong>8.7%</strong> (peak 21.4%, normal &lt;0.5%) · Rollback done · stale routing config on 2 gateway instances · Commander {personById[sev1.commanderId]?.name}
              </p>
              <div {...stylex.props(banner.meta)}>
                <AvatarStack ids={[sev1.commanderId, ...sev1.responderIds]} />
                <span {...stylex.props(banner.metaText)}>{sev1.responderIds.length + 1} on the bridge · {personById[sev1.commanderId]?.name} commanding</span>
                <span {...stylex.props(banner.open)}>Open incident workspace <ArrowRight size={14} /></span>
              </div>
            </div>
            <div {...stylex.props(banner.side)}>
              <ErrorRateCard />
            </div>
          </article>
        </Link>
      )}

      <div {...stylex.props(page.grid)}>
        <div {...stylex.props(page.main)}>
          <section {...stylex.props(card.base, card.pad)} aria-label="Active incidents">
            <SectionHeader title="Active incidents" sub={`${active.length} open · sorted by severity`} right={<Link to="/incidents" {...stylex.props(link.s)}>All incidents <ArrowRight size={13} /></Link>} />
            <div {...stylex.props(list.col)}>
              {active.slice(0, 4).map((i) => (
                <Link key={i.id} to="/incidents/$incidentId" params={{ incidentId: i.id }} {...stylex.props(list.row)}>
                  <SevBadge sev={i.severity} pulse={i.severity === 'SEV1'} />
                  <span {...stylex.props(list.main)}>
                    <span {...stylex.props(list.title)}><span {...stylex.props(list.id)}>{i.id}</span> {i.title}</span>
                    <span {...stylex.props(list.sub)}>{i.serviceIds.map((s) => serviceById[s]?.name).join(' · ')} — {personById[i.commanderId]?.name} · {i.durationLabel}</span>
                  </span>
                  <StatusBadge status={i.status} />
                </Link>
              ))}
            </div>
          </section>

          <section {...stylex.props(card.base, card.pad)} aria-label="Needs attention">
            <SectionHeader title="Needs attention" sub="Changes correlated with active problems" />
            <div {...stylex.props(list.col)}>
              <AttentionRow icon={<GitBranch size={15} />} tone="#4f46e5" title="payment-gateway@4.18.2 rolled back at 10:43 AM" sub="Suspected trigger of INC-1042 · new routing table format · author Marcus Johnson" to="/deployments" />
              <AttentionRow icon={<AlertTriangle size={15} />} tone="#d97706" title="auth-service@1.92.3 deploy failed at 10:58 AM" sub="Migration lock timeout · retry scheduled · author Tom Becker" to="/deployments" />
              <AttentionRow icon={<Clock size={15} />} tone="#0284c7" title="2 engineers begin on-call shifts at 12:00 PM" sub="Payments secondary handoff · Infrastructure shadow rotation" to="/on-call" />
              <AttentionRow icon={<Users size={15} />} tone="#7c3aed" title="Postmortem action due tomorrow" sub="Vault failover canary · owner Marcus Johnson · from Aug 28 outage" to="/postmortems/pm-01" />
            </div>
          </section>

          <section {...stylex.props(card.base, card.pad)} aria-label="Recent deployments">
            <SectionHeader title="Recent deployments" sub="Last hour highlighted · correlated deploys flagged" right={<Link to="/deployments" {...stylex.props(link.s)}>All deploys <ArrowRight size={13} /></Link>} />
            <div {...stylex.props(list.col)}>
              {recentDeps.map((d) => (
                <div key={d.id} {...stylex.props(list.rowStatic)}>
                  <DeployDot status={d.status} />
                  <span {...stylex.props(list.main)}>
                    <span {...stylex.props(list.title)}>{d.version} <span {...stylex.props(list.sub2)}>· {serviceById[d.serviceId]?.name} · {d.env}</span></span>
                    <span {...stylex.props(list.sub)}>{d.atLabel} · {personById[d.authorId]?.name} · {d.pr}{d.incidentId ? ` · linked ${d.incidentId}` : ''}</span>
                  </span>
                  {d.incidentId && <Tag tone="accent">{d.incidentId}</Tag>}
                </div>
              ))}
            </div>
            {failedDeps.length > 0 && (
              <p {...stylex.props(page.warn)}>1 failed deployment and 1 rollback in the last 24 hours — both linked from the Deployments page.</p>
            )}
          </section>
        </div>

        <div {...stylex.props(page.rail)}>
          <section {...stylex.props(card.base, card.padSm)} aria-label="Key metrics">
            <div {...stylex.props(metrics.grid)}>
              <Metric label="MTTR · 7d" value="48m" delta="−6m vs last week" good />
              <Metric label="MTTA · 7d" value="5m" delta="+1m vs last week" />
              <Metric label="Reliability" value="99.91%" delta="−0.04 pts" />
              <Metric label="Firing alerts" value={String(firing.length)} delta={`${acked.length} acknowledged`} />
            </div>
            <div {...stylex.props(metrics.sparkRow)}>
              <div>
                <p {...stylex.props(type.label)}>Incident trend · 7d</p>
                <Sparkline id="ov-trend" data={[1, 0, 2, 1, 0, 3, 4]} />
              </div>
              <div>
                <p {...stylex.props(type.label)}>Alert volume · 7d</p>
                <Sparkline id="ov-alerts" data={[4, 6, 5, 9, 7, 14, 22]} stroke="#d97706" fill="rgba(217,119,6,0.12)" />
              </div>
            </div>
          </section>

          <section {...stylex.props(card.base, card.padSm)} aria-label="Service health">
            <SectionHeader title="Service health" sub={`${critical.length} critical · ${degraded.length} degraded · 12 services`} right={<Link to="/services" {...stylex.props(link.s)}>Catalog</Link>} />
            <div {...stylex.props(list.colSm)}>
              {[...critical, ...degraded].slice(0, 5).map((s) => (
                <Link key={s.id} to="/services/$serviceId" params={{ serviceId: s.id }} {...stylex.props(list.rowSm)}>
                  <span {...stylex.props(list.main)}>
                    <span {...stylex.props(list.titleSm)}>{s.name}</span>
                    <span {...stylex.props(list.sub)}>{s.errorRatePct}% errors · P95 {s.latencyP95Ms}ms</span>
                  </span>
                  <HealthBadge health={s.health} />
                </Link>
              ))}
            </div>
            <div {...stylex.props(health.barRow)}>
              <Progress value={58} tone="#059669" />
              <span {...stylex.props(health.barLabel)}>7 of 12 services fully healthy</span>
            </div>
          </section>

          <section {...stylex.props(card.base, card.padSm)} aria-label="On call now">
            <SectionHeader title="On call now" sub="5 teams covered" right={<Link to="/on-call" {...stylex.props(link.s)}>Schedule</Link>} />
            <div {...stylex.props(list.colSm)}>
              {onCall.slice(0, 4).map((o) => (
                <div key={o.teamId} {...stylex.props(list.rowSmStatic)}>
                  <Avatar personId={o.primaryId} size="sm" />
                  <span {...stylex.props(list.main)}>
                    <span {...stylex.props(list.titleSm)}>{personById[o.primaryId]?.name}</span>
                    <span {...stylex.props(list.sub)}>{teamById[o.teamId]?.name} · primary since {o.since}</span>
                  </span>
                  <Moon size={14} color="#64748b" />
                </div>
              ))}
            </div>
          </section>

          <section {...stylex.props(card.base, card.padSm)} aria-label="Reliability">
            <SectionHeader title="Reliability" sub="Error budget · September" />
            <ReliRow name="Checkout API" pct={62} left="38% budget left" tone="#dc2626" />
            <div style={{ height: 8 }} />
            <ReliRow name="Payment Gateway" pct={71} left="29% budget left" tone="#d97706" />
            <div style={{ height: 8 }} />
            <ReliRow name="API Gateway" pct={12} left="88% budget left" tone="#059669" />
            <p {...stylex.props(page.note)}><ShieldCheck size={13} /> Payments burn rate is 2× baseline during INC-1042. <Link to="/analytics" {...stylex.props(link.s)}>Open analytics</Link></p>
          </section>
        </div>
      </div>

      <section {...stylex.props(card.base, card.pad)} aria-label="Resolved recently">
        <SectionHeader title="Recently resolved" sub="Recovery confirmed · postmortems linked where available" right={<Link to="/postmortems" {...stylex.props(link.s)}>Postmortems <ArrowRight size={13} /></Link>} />
        <div {...stylex.props(resolved.grid)}>
          {incidents.filter((i) => i.status === 'Resolved').slice(0, 3).map((i) => (
            <Link key={i.id} to="/incidents/$incidentId" params={{ incidentId: i.id }} {...stylex.props(resolved.card)}>
              <div {...stylex.props(resolved.top)}><SevBadge sev={i.severity} /><CheckCircle2 size={14} color="#059669" /></div>
              <p {...stylex.props(resolved.title)}>{i.id} — {i.title}</p>
              <p {...stylex.props(resolved.sub)}>{i.durationLabel} · {i.startedLabel}</p>
            </Link>
          ))}
        </div>
      </section>

      <p {...stylex.props(page.trendNote)}><TrendingDown size={13} /> Incident volume is up this week (11 vs 6 last week), driven by the Payments cluster. Deployment-related incidents account for 36% of the total — see Analytics.</p>
    </div>
  );
}

function ErrorRateCard() {
  return (
    <div {...stylex.props(err.box)} aria-label="Checkout error rate">
      <p {...stylex.props(type.label)}>Checkout error rate</p>
      <p {...stylex.props(err.big)}>8.7%</p>
      <p {...stylex.props(err.mid)}>peak 21.4% · normal &lt;0.5%</p>
      <Sparkline id="ov-err" data={[0.4, 0.5, 0.6, 18.2, 21.4, 17.1, 12.4, 8.7, 8.1, 6.1]} width={180} height={52} stroke="#dc2626" fill="rgba(220,38,38,0.10)" />
    </div>
  );
}

function Metric({ label, value, delta, good }: { label: string; value: string; delta: string; good?: boolean }) {
  return (
    <div {...stylex.props(metrics.cell)}>
      <p {...stylex.props(type.label)}>{label}</p>
      <p {...stylex.props(metrics.value)}>{value}</p>
      <p {...stylex.props(metrics.delta, good && metrics.good)}>{delta}</p>
    </div>
  );
}

function AttentionRow({ icon, tone, title, sub, to }: { icon: React.ReactNode; tone: string; title: string; sub: string; to: string }) {
  return (
    <Link to={to} {...stylex.props(list.row)}>
      <span {...stylex.props(att.icon)} style={{ backgroundColor: `${tone}14`, color: tone }}>{icon}</span>
      <span {...stylex.props(list.main)}>
        <span {...stylex.props(list.title)}>{title}</span>
        <span {...stylex.props(list.sub)}>{sub}</span>
      </span>
      <ArrowRight size={15} color="#94a3b8" />
    </Link>
  );
}

function DeployDot({ status }: { status: string }) {
  const c = status === 'Successful' ? '#059669' : status === 'Failed' ? '#dc2626' : status === 'Rolled back' ? '#d97706' : '#0284c7';
  return <span {...stylex.props(dep.dot)} style={{ backgroundColor: c }} aria-label={status} title={status} />;
}

function ReliRow({ name, pct, left, tone }: { name: string; pct: number; left: string; tone: string }) {
  return (
    <div>
      <div {...stylex.props(reli.top)}><span>{name}</span><span>{left}</span></div>
      <Progress value={pct} tone={tone} />
    </div>
  );
}

const page = stylex.create({
  wrap: { display: 'flex', flexDirection: 'column', gap: 18 },
  head: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' },
  headActions: { display: 'flex', gap: 8 },
  grid: { display: 'grid', gridTemplateColumns: { default: 'minmax(0, 1fr) 340px', '@media (max-width: 1024px)': '1fr' }, gap: 18, alignItems: 'start' },
  main: { display: 'flex', flexDirection: 'column', gap: 18, minWidth: 0 },
  rail: { display: 'flex', flexDirection: 'column', gap: 18, minWidth: 0 },
  warn: { fontSize: 12, color: '#b45309', backgroundColor: '#fffbeb', borderWidth: 1, borderStyle: 'solid', borderColor: '#fde68a', borderRadius: 8, padding: '8px 12px', margin: '12px 0 0' },
  note: { fontSize: 12, color: tokens.muted, display: 'flex', gap: 6, alignItems: 'flex-start', margin: '12px 0 0', lineHeight: 1.5 },
  trendNote: { fontSize: 12, color: tokens.muted, display: 'flex', gap: 6, alignItems: 'center', margin: 0 },
});

const banner = stylex.create({
  link: { textDecoration: 'none' },
  box: { position: 'relative', display: 'grid', gridTemplateColumns: { default: 'minmax(0,1fr) 240px', '@media (max-width: 760px)': '1fr' }, gap: 18, backgroundColor: '#0c1322', borderRadius: 14, padding: 22, overflow: 'hidden', color: '#e2e8f0' },
  stripe: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 5, backgroundColor: '#dc2626' },
  main: { display: 'flex', flexDirection: 'column', gap: 10, paddingLeft: 6 },
  row: { display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  id: { fontSize: 12, color: '#8b98b3', fontWeight: 600 },
  title: { margin: 0, fontSize: 20, fontWeight: 800, color: '#fff', letterSpacing: '-0.01em' },
  sub: { margin: 0, fontSize: 13, color: '#b9c3d8', lineHeight: 1.55 },
  meta: { display: 'flex', alignItems: 'center', gap: 10, marginTop: 4, flexWrap: 'wrap' },
  metaText: { fontSize: 12, color: '#8b98b3' },
  open: { display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 800, color: '#fff', marginLeft: 'auto' },
  side: { display: 'flex', alignItems: 'stretch' },
});

const err = stylex.create({
  box: { backgroundColor: '#131c31', borderRadius: 12, padding: 16, flex: 1, display: 'flex', flexDirection: 'column', gap: 2 },
  big: { margin: 0, fontSize: 34, fontWeight: 800, color: '#f87171' },
  mid: { margin: 0, fontSize: 12, color: '#8b98b3' },
});

const list = stylex.create({
  col: { display: 'flex', flexDirection: 'column', gap: 6 },
  colSm: { display: 'flex', flexDirection: 'column', gap: 4 },
  row: { display: 'flex', alignItems: 'center', gap: 10, padding: '10px 10px', borderRadius: 9, textDecoration: 'none', ':hover': { backgroundColor: tokens.surface2 } },
  rowStatic: { display: 'flex', alignItems: 'center', gap: 10, padding: '10px 10px', borderRadius: 9 },
  main: { flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 },
  title: { fontSize: 13.5, fontWeight: 600, color: tokens.ink, lineHeight: 1.4 },
  id: { fontFamily: 'ui-monospace, Menlo, monospace', fontSize: 12, color: tokens.muted, fontWeight: 700 },
  sub: { fontSize: 12, color: tokens.muted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  sub2: { fontSize: 12, color: tokens.muted, fontWeight: 400 },
  titleSm: { fontSize: 13, fontWeight: 700, color: tokens.ink },
  rowSm: { display: 'flex', alignItems: 'center', gap: 10, padding: '7px 8px', borderRadius: 8, textDecoration: 'none', ':hover': { backgroundColor: tokens.surface2 } },
  rowSmStatic: { display: 'flex', alignItems: 'center', gap: 10, padding: '7px 8px', borderRadius: 8 },
});

const att = stylex.create({
  icon: { width: 32, height: 32, borderRadius: 9, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
});

const dep = stylex.create({
  dot: { width: 10, height: 10, borderRadius: '50%', flexShrink: 0 },
});

const metrics = stylex.create({
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 },
  cell: { backgroundColor: tokens.surface2, borderRadius: 9, padding: '10px 12px' },
  value: { margin: 0, fontSize: 22, fontWeight: 800, color: tokens.ink },
  delta: { margin: 0, fontSize: 11, color: tokens.muted },
  good: { color: tokens.ok, fontWeight: 700 },
  sparkRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 12 },
});

const health = stylex.create({
  barRow: { marginTop: 12, display: 'flex', flexDirection: 'column', gap: 6 },
  barLabel: { fontSize: 11, color: tokens.muted },
});

const reli = stylex.create({
  top: { display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 600, color: tokens.ink2, marginBottom: 5 },
});

const resolved = stylex.create({
  grid: { display: 'grid', gridTemplateColumns: { default: 'repeat(3, 1fr)', '@media (max-width: 760px)': '1fr' }, gap: 12 },
  card: { borderWidth: 1, borderStyle: 'solid', borderColor: tokens.line, borderRadius: 10, padding: 14, textDecoration: 'none', ':hover': { borderColor: tokens.lineStrong, backgroundColor: tokens.surface2 } },
  top: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 13, fontWeight: 700, color: tokens.ink, margin: '8px 0 4px', lineHeight: 1.4 },
  sub: { fontSize: 12, color: tokens.muted, margin: 0 },
});

const link = stylex.create({
  s: { display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 700, color: tokens.accent, textDecoration: 'none' },
});
