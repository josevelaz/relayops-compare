import * as React from 'react';
import * as stylex from '@stylexjs/stylex';
import { createFileRoute, Link } from '@tanstack/react-router';
import { AlertTriangle, ArrowLeft, ChevronRight, GitBranch, GitCommitHorizontal, Zap } from 'lucide-react';
import { tokens } from '../styles/tokens.stylex';
import { useApp } from '../data/store';
import { deployments, onCall, personById, serviceById, teamById } from '../data/model';
import { Avatar, Button, HealthBadge, Mono, Progress, SectionHeader, SevBadge, Sparkline, StatusBadge, Tag, card, type } from '../components/ui';

export const Route = createFileRoute('/services/$serviceId')({
  component: ServiceDetailPage,
});

function ServiceDetailPage() {
  const { serviceId } = Route.useParams();
  const { openCreate, openPalette, incidents: liveIncidents, alerts: liveAlerts } = useApp();
  const svc = serviceById[serviceId];

  if (!svc) {
    return (
      <div {...stylex.props(card.base, card.pad)}>
        <h1 {...stylex.props(type.h1)}>Service not found</h1>
        <p {...stylex.props(type.sub)}>Unknown service “{serviceId}”.</p>
        <Link to="/services">Back to catalog</Link>
      </div>
    );
  }

  const team = teamById[svc.teamId];
  const oc = onCall.find((o) => o.teamId === svc.teamId);
  const svcAlerts = liveAlerts.filter((a) => a.serviceId === svc.id && a.state !== 'Resolved');
  const svcIncidents = liveIncidents.filter((i) => i.serviceIds.includes(svc.id));
  const svcDeploys = deployments.filter((d) => d.serviceId === svc.id).slice(0, 5);
  const deps = svc.dependsOn.map((id) => serviceById[id]).filter(Boolean);
  const dependents = svc.dependedBy.map((id) => serviceById[id]).filter(Boolean);

  return (
    <div {...stylex.props(pg.wrap)}>
      <nav aria-label="Breadcrumb" {...stylex.props(pg.crumb)}>
        <Link to="/services" {...stylex.props(pg.crumbLink)}><ArrowLeft size={12} /> Services</Link>
        <ChevronRight size={13} color="#94a3b8" />
        <span>{svc.name}</span>
      </nav>

      <div {...stylex.props(head.box)}>
        <div {...stylex.props(head.main)}>
          <div {...stylex.props(head.row)}>
            <HealthBadge health={svc.health} />
            <Tag>{svc.tier}</Tag>
            <Tag tone="accent">{team?.name}</Tag>
          </div>
          <h1 {...stylex.props(head.title)}>{svc.name}</h1>
          <p {...stylex.props(head.meta)}><Mono>{svc.repo}</Mono> · {svc.tech} · {svc.runtime} on {svc.infra} · {svc.region}</p>
          <div {...stylex.props(head.grid)}>
            <Meta label="Owner" value={`${personById[team?.leadId ?? '']?.name ?? '—'} · ${team?.name}`} />
            <Meta label="On-call now" value={`${personById[oc?.primaryId ?? '']?.name ?? '—'} (primary)`} />
            <Meta label="Uptime 30d" value={`${svc.uptime30d.toFixed(2)}%`} />
            <Meta label="Traffic" value={`${svc.rpm.toLocaleString()} rpm`} />
          </div>
          <div {...stylex.props(head.actions)}>
            <Button size="sm" tone="primary" onClick={() => openCreate({ serviceIds: [svc.id], severity: 'SEV2' })}><Zap size={13} /> Declare incident</Button>
            <Button size="sm" tone="secondary" onClick={() => openPalette('search', svc.name)}>Search related</Button>
          </div>
        </div>
        <div {...stylex.props(head.side)}>
          <div {...stylex.props(metric.box)}>
            <p {...stylex.props(type.label)}>Error rate · live</p>
            <p {...stylex.props(metric.big, svc.health === 'Critical' && metric.crit)}>{svc.errorRatePct}%</p>
            <Sparkline id={`svc-${svc.id}`} data={sparkFor(svc.id)} width={190} height={54} stroke={svc.health === 'Healthy' ? '#059669' : '#dc2626'} />
            <div {...stylex.props(metric.row2)}>
              <div><p {...stylex.props(type.label)}>P95 latency</p><p {...stylex.props(metric.mid)}>{svc.latencyP95Ms}ms</p></div>
              <div><p {...stylex.props(type.label)}>Open incidents</p><p {...stylex.props(metric.mid)}>{svcIncidents.filter((i) => i.status !== 'Resolved').length}</p></div>
              <div><p {...stylex.props(type.label)}>Active alerts</p><p {...stylex.props(metric.mid)}>{svcAlerts.length}</p></div>
            </div>
          </div>
        </div>
      </div>

      {(svcIncidents.some((i) => i.status !== 'Resolved') || svcAlerts.length > 0) && (
        <div {...stylex.props(warn.box)} role="alert">
          <AlertTriangle size={16} />
          <span>
            {svcIncidents.filter((i) => i.status !== 'Resolved').length > 0 && <>Active incident{svcIncidents.filter((i) => i.status !== 'Resolved').length > 1 ? 's' : ''}: {svcIncidents.filter((i) => i.status !== 'Resolved').map((i) => i.id).join(', ')}. </>}
            {svcAlerts.length > 0 && <>{svcAlerts.length} active alert{svcAlerts.length > 1 ? 's' : ''} need triage.</>}
          </span>
        </div>
      )}

      <div {...stylex.props(pg.cols)}>
        <div {...stylex.props(pg.main)}>
          <section {...stylex.props(card.base, card.pad)} aria-label="Reliability">
            <SectionHeader title="Reliability & performance" sub="Last 12 hours · error rate, latency, traffic" />
            <div {...stylex.props(rel.grid)}>
              <RelChart title="Error rate %" data={sparkFor(svc.id)} color="#dc2626" unit="%" />
              <RelChart title="P95 latency (ms)" data={latFor(svc.id)} color="#4f46e5" unit="ms" />
            </div>
            <div {...stylex.props(rel.budget)}>
              <div {...stylex.props(rel.budgetTop)}><span>September error budget</span><span>{budgetLeft(svc.id)} consumed</span></div>
              <Progress value={budgetPct(svc.id)} tone={svc.health === 'Healthy' ? '#059669' : '#d97706'} />
            </div>
          </section>

          <section {...stylex.props(card.base, card.pad)} aria-label="Dependencies">
            <SectionHeader title="Service relationships" sub="Upstream dependencies and downstream dependents" />
            <DepGraph name={svc.name} deps={deps.map((d) => d.name)} dependents={dependents.map((d) => d.name)} health={svc.health} />
            <div {...stylex.props(dep.cols)}>
              <div>
                <h3 {...stylex.props(type.h3)}>Depends on ({deps.length})</h3>
                {deps.map((d) => <DepRow key={d.id} id={d.id} name={d.name} health={d.health} note="upstream" />)}
                {deps.length === 0 && <p {...stylex.props(type.sub)}>No upstream dependencies.</p>}
              </div>
              <div>
                <h3 {...stylex.props(type.h3)}>Depended on by ({dependents.length})</h3>
                {dependents.map((d) => <DepRow key={d.id} id={d.id} name={d.name} health={d.health} note="downstream" />)}
                {dependents.length === 0 && <p {...stylex.props(type.sub)}>No downstream dependents.</p>}
              </div>
            </div>
          </section>

          <section {...stylex.props(card.base, card.pad)} aria-label="Recent deployments">
            <SectionHeader title="Recent deployments" sub="Latest 5 · correlated deploys flagged" right={<Link to="/deployments" {...stylex.props(link.s)}>All deploys</Link>} />
            <div {...stylex.props(depList.col)}>
              {svcDeploys.map((d) => (
                <div key={d.id} {...stylex.props(depList.row)}>
                  <GitCommitHorizontal size={15} color="#4f46e5" />
                  <span {...stylex.props(depList.main)}>
                    <span {...stylex.props(depList.title)}><Mono>{d.version}</Mono> · {d.env}</span>
                    <span {...stylex.props(depList.sub)}>{d.atLabel} · {personById[d.authorId]?.name} · {d.pr}{d.note ? ` — ${d.note}` : ''}</span>
                  </span>
                  <Tag tone={d.status === 'Rolled back' ? 'violet' : d.status === 'Failed' ? 'dark' : 'neutral'}>{d.status}</Tag>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside {...stylex.props(pg.rail)}>
          <section {...stylex.props(card.base, card.padSm)} aria-label="Ownership">
            <h2 {...stylex.props(type.h3)}>Ownership</h2>
            <div {...stylex.props(own.row)}><Avatar personId={team?.leadId ?? ''} /><div><p {...stylex.props(own.name)}>{personById[team?.leadId ?? '']?.name}</p><p {...stylex.props(own.sub)}>Team lead · {team?.name}</p></div></div>
            <div {...stylex.props(own.row)}><Avatar personId={oc?.primaryId ?? ''} /><div><p {...stylex.props(own.name)}>{personById[oc?.primaryId ?? '']?.name}</p><p {...stylex.props(own.sub)}>On-call primary · since {oc?.since}</p></div></div>
            <Link to="/teams/$teamId" params={{ teamId: team?.id ?? 'payments' }} {...stylex.props(link.s)}>Open {team?.name} team →</Link>
          </section>

          <section {...stylex.props(card.base, card.padSm)} aria-label="Active incidents">
            <h2 {...stylex.props(type.h3)}>Active incidents ({svcIncidents.filter((i) => i.status !== 'Resolved').length})</h2>
            <div {...stylex.props(rail.col)}>
              {svcIncidents.filter((i) => i.status !== 'Resolved').map((i) => (
                <Link key={i.id} to="/incidents/$incidentId" params={{ incidentId: i.id }} {...stylex.props(rail.row)}>
                  <SevBadge sev={i.severity} />
                  <span {...stylex.props(rail.main)}><strong>{i.id}</strong><span>{i.title}</span></span>
                  <StatusBadge status={i.status} />
                </Link>
              ))}
              {svcIncidents.filter((i) => i.status !== 'Resolved').length === 0 && <p {...stylex.props(type.sub)}>No active incidents for this service.</p>}
            </div>
          </section>

          <section {...stylex.props(card.base, card.padSm)} aria-label="Active alerts">
            <div {...stylex.props(secHead.row)}><h2 {...stylex.props(type.h3)}>Active alerts ({svcAlerts.length})</h2><Link to="/alerts" {...stylex.props(link.s)}>Triage</Link></div>
            <div {...stylex.props(rail.col)}>
              {svcAlerts.map((a) => (
                <div key={a.id} {...stylex.props(rail.static)}>
                  <AlertTriangle size={13} color={a.state === 'Firing' ? '#dc2626' : '#d97706'} />
                  <span {...stylex.props(rail.main)}><strong>{a.id}</strong><span>{a.name}</span></span>
                </div>
              ))}
              {svcAlerts.length === 0 && <p {...stylex.props(type.sub)}>No active alerts.</p>}
            </div>
          </section>

          <section {...stylex.props(card.base, card.padSm)} aria-label="Recent changes">
            <h2 {...stylex.props(type.h3)}>Recent changes</h2>
            <ul {...stylex.props(changes.ul)}>
              <li><GitBranch size={12} /> {svcDeploys[0]?.version ?? '—'} deployed {svcDeploys[0]?.atLabel ?? ''}</li>
              <li><Zap size={12} /> {svcIncidents[0] ? `${svcIncidents[0].id} ${svcIncidents[0].status.toLowerCase()}` : 'No recent incidents'}</li>
              <li><AlertTriangle size={12} /> {svcAlerts.length} alerts currently active</li>
            </ul>
          </section>
        </aside>
      </div>
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div {...stylex.props(meta.box)}>
      <p {...stylex.props(type.label)}>{label}</p>
      <p {...stylex.props(meta.val)}>{value}</p>
    </div>
  );
}

function RelChart({ title, data, color, unit }: { title: string; data: number[]; color: string; unit: string }) {
  return (
    <div {...stylex.props(rel.cell)}>
      <p {...stylex.props(type.label)}>{title}</p>
      <Sparkline id={`rel-${title}`} data={data} width={260} height={70} stroke={color} />
      <p {...stylex.props(rel.now)}>Now: <strong>{data[data.length - 1]}{unit}</strong> · peak {Math.max(...data)}{unit}</p>
    </div>
  );
}

function DepGraph({ name, deps, dependents, health }: { name: string; deps: string[]; dependents: string[]; health: string }) {
  const color = health === 'Critical' ? '#dc2626' : health === 'Degraded' ? '#d97706' : '#059669';
  return (
    <div {...stylex.props(depGraph.box)} role="img" aria-label={`Dependency graph for ${name}: depends on ${deps.join(', ') || 'nothing'}, used by ${dependents.join(', ') || 'nothing'}`}>
      <div {...stylex.props(depGraph.col)}>
        {deps.map((d) => <span key={d} {...stylex.props(depGraph.node)}>{d}</span>)}
        {deps.length === 0 && <span {...stylex.props(depGraph.empty)}>no upstream</span>}
      </div>
      <div {...stylex.props(depGraph.arrows)} aria-hidden>→</div>
      <span {...stylex.props(depGraph.center)} style={{ borderColor: color }}>{name}</span>
      <div {...stylex.props(depGraph.arrows)} aria-hidden>→</div>
      <div {...stylex.props(depGraph.col)}>
        {dependents.map((d) => <span key={d} {...stylex.props(depGraph.node)}>{d}</span>)}
        {dependents.length === 0 && <span {...stylex.props(depGraph.empty)}>no downstream</span>}
      </div>
    </div>
  );
}

function DepRow({ id, name, health, note }: { id: string; name: string; health: string; note: string }) {
  return (
    <Link to="/services/$serviceId" params={{ serviceId: id }} {...stylex.props(depRow.s)}>
      <span {...stylex.props(depRow.dot)} style={{ backgroundColor: health === 'Critical' ? '#dc2626' : health === 'Degraded' ? '#d97706' : '#059669' }} />
      <strong>{name}</strong><span {...stylex.props(depRow.note)}>{note} · {health}</span>
    </Link>
  );
}

function sparkFor(id: string): number[] {
  if (id === 'payment-gateway') return [0.4, 0.5, 0.6, 0.5, 18.4, 21.4, 16.8, 12.4, 11.8, 11.2];
  if (id === 'checkout-api') return [0.3, 0.4, 0.5, 0.4, 14.1, 19.8, 15.2, 12.1, 9.6, 8.7];
  if (id === 'order-service') return [0.2, 0.3, 0.2, 0.5, 1.1, 2.4, 2.3, 2.2, 2.1, 2.1];
  if (id === 'auth-service') return [0.4, 0.6, 1.4, 1.5, 1.6, 1.5, 1.4, 1.4, 1.4, 1.4];
  if (id === 'webhook-processor') return [0.5, 0.8, 3.4, 3.8, 3.7, 3.6, 3.5, 3.5, 3.4, 3.4];
  return [0.1, 0.2, 0.1, 0.3, 0.2, 0.4, 0.2, 0.3, 0.2, 0.2];
}
function latFor(id: string): number[] {
  if (id === 'payment-gateway') return [320, 340, 310, 360, 1900, 2310, 2450, 2400, 2360, 2310];
  if (id === 'checkout-api') return [280, 300, 290, 310, 1500, 1840, 1980, 1920, 1880, 1840];
  return [120, 130, 125, 140, 135, 150, 145, 140, 135, 130];
}
function budgetPct(id: string): number {
  if (id === 'payment-gateway') return 71;
  if (id === 'checkout-api') return 62;
  if (id === 'webhook-processor') return 44;
  return 12;
}
function budgetLeft(id: string): string {
  if (id === 'payment-gateway') return '71%';
  if (id === 'checkout-api') return '62%';
  return '12%';
}

const pg = stylex.create({
  wrap: { display: 'flex', flexDirection: 'column', gap: 14 },
  crumb: { display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: tokens.muted },
  crumbLink: { display: 'inline-flex', alignItems: 'center', gap: 4, color: tokens.accent, fontWeight: 700, textDecoration: 'none' },
  cols: { display: 'grid', gridTemplateColumns: { default: 'minmax(0,1fr) 300px', '@media (max-width: 1024px)': '1fr' }, gap: 14, alignItems: 'start' },
  main: { display: 'flex', flexDirection: 'column', gap: 14, minWidth: 0 },
  rail: { display: 'flex', flexDirection: 'column', gap: 14, minWidth: 0 },
});

const head = stylex.create({
  box: { display: 'grid', gridTemplateColumns: { default: 'minmax(0,1fr) 300px', '@media (max-width: 900px)': '1fr' }, gap: 14 },
  main: { backgroundColor: tokens.surface, borderWidth: 1, borderStyle: 'solid', borderColor: tokens.line, borderRadius: 12, padding: 20 },
  row: { display: 'flex', gap: 7, flexWrap: 'wrap', alignItems: 'center' },
  title: { margin: '10px 0 5px', fontSize: 24, fontWeight: 800, letterSpacing: '-0.01em', color: tokens.ink },
  meta: { margin: 0, fontSize: 12.5, color: tokens.muted },
  grid: { display: 'grid', gridTemplateColumns: { default: 'repeat(4, 1fr)', '@media (max-width: 640px)': 'repeat(2, 1fr)' }, gap: 12, marginTop: 14 },
  actions: { display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap' },
  side: { minWidth: 0 },
});

const meta = stylex.create({
  box: { backgroundColor: tokens.surface2, borderRadius: 9, padding: '9px 11px' },
  val: { margin: '3px 0 0', fontSize: 13, fontWeight: 700, color: tokens.ink },
});

const metric = stylex.create({
  box: { backgroundColor: '#0c1322', borderRadius: 12, padding: 18, display: 'flex', flexDirection: 'column', gap: 4, height: '100%' },
  big: { margin: 0, fontSize: 32, fontWeight: 800, color: '#34d399' },
  crit: { color: '#f87171' },
  mid: { margin: 0, fontSize: 15, fontWeight: 800, color: '#fff' },
  row2: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginTop: 8 },
});

const warn = stylex.create({
  box: { display: 'flex', gap: 10, alignItems: 'flex-start', backgroundColor: '#fffbeb', borderWidth: 1, borderStyle: 'solid', borderColor: '#fde68a', color: '#92400e', borderRadius: 10, padding: '11px 14px', fontSize: 13, fontWeight: 600 },
});

const rel = stylex.create({
  grid: { display: 'grid', gridTemplateColumns: { default: '1fr 1fr', '@media (max-width: 640px)': '1fr' }, gap: 14 },
  cell: { backgroundColor: tokens.surface2, borderRadius: 10, padding: 12 },
  now: { fontSize: 12, color: tokens.muted, margin: '6px 0 0' },
  budget: { marginTop: 14 },
  budgetTop: { display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 600, color: tokens.ink2, marginBottom: 6 },
});

const depGraph = stylex.create({
  box: { display: 'flex', alignItems: 'center', gap: 10, backgroundColor: tokens.surface2, borderRadius: 10, padding: 14, marginBottom: 14, overflowX: 'auto' },
  col: { display: 'flex', flexDirection: 'column', gap: 6, flex: 1 },
  node: { backgroundColor: '#fff', borderWidth: 1, borderStyle: 'solid', borderColor: tokens.lineStrong, borderRadius: 8, padding: '7px 10px', fontSize: 12, fontWeight: 700, color: tokens.ink, textAlign: 'center' },
  empty: { fontSize: 12, color: tokens.faint, fontStyle: 'italic', textAlign: 'center' },
  arrows: { color: tokens.faint, fontWeight: 800 },
  center: { backgroundColor: '#0c1322', color: '#fff', borderWidth: 2, borderStyle: 'solid', borderRadius: 10, padding: '10px 14px', fontSize: 13, fontWeight: 800, textAlign: 'center', flexShrink: 0 },
});

const dep = stylex.create({
  cols: { display: 'grid', gridTemplateColumns: { default: '1fr 1fr', '@media (max-width: 640px)': '1fr' }, gap: 16 },
});

const depRow = stylex.create({
  s: { display: 'flex', alignItems: 'center', gap: 8, padding: '8px 4px', fontSize: 13, color: tokens.ink, textDecoration: 'none', borderBottomWidth: 1, borderBottomStyle: 'solid', borderBottomColor: '#f1f5f9' },
  dot: { width: 9, height: 9, borderRadius: '50%' },
  note: { color: tokens.muted, fontWeight: 400, fontSize: 12 },
});

const depList = stylex.create({
  col: { display: 'flex', flexDirection: 'column', gap: 2 },
  row: { display: 'flex', alignItems: 'center', gap: 10, padding: '9px 6px', borderBottomWidth: 1, borderBottomStyle: 'solid', borderBottomColor: '#f1f5f9' },
  main: { flex: 1, display: 'flex', flexDirection: 'column', gap: 1, fontSize: 13, color: tokens.ink, minWidth: 0 },
  title: { fontWeight: 700 },
  sub: { fontSize: 12, color: tokens.muted },
});

const own = stylex.create({
  row: { display: 'flex', gap: 10, alignItems: 'center', margin: '10px 0' },
  name: { margin: 0, fontSize: 13, fontWeight: 700, color: tokens.ink },
  sub: { margin: 0, fontSize: 12, color: tokens.muted },
});

const rail = stylex.create({
  col: { display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8 },
  row: { display: 'flex', alignItems: 'center', gap: 8, padding: '8px', borderRadius: 8, textDecoration: 'none', ':hover': { backgroundColor: tokens.surface2 } },
  static: { display: 'flex', alignItems: 'center', gap: 8, padding: '8px' },
  main: { flex: 1, display: 'flex', flexDirection: 'column', fontSize: 12.5, color: tokens.ink, minWidth: 0 },
});

const secHead = stylex.create({
  row: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
});

const changes = stylex.create({
  ul: { listStyle: 'none', margin: '10px 0 0', padding: 0, display: 'flex', flexDirection: 'column', gap: 8, fontSize: 12.5, color: tokens.ink2 },
});

const link = stylex.create({
  s: { fontSize: 12, fontWeight: 700, color: tokens.accent, textDecoration: 'none' },
});

const sec = stylex.create({
  row: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, marginBottom: 12 },
});
void SectionHeader;
