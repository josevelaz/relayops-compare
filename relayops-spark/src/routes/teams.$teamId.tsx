import * as stylex from '@stylexjs/stylex';
import { createFileRoute, Link } from '@tanstack/react-router';
import { ArrowLeft, ChevronRight, Moon } from 'lucide-react';
import { tokens } from '../styles/tokens.stylex';
import { useApp } from '../data/store';
import { escalationSteps, onCall, personById, serviceById, teamById } from '../data/model';
import { Avatar, HealthBadge, Progress, SectionHeader, SevBadge, StatusBadge, card, type } from '../components/ui';

export const Route = createFileRoute('/teams/$teamId')({
  component: TeamDetailPage,
});

function TeamDetailPage() {
  const { teamId } = Route.useParams();
  const { incidents: liveIncidents } = useApp();
  const team = teamById[teamId];

  if (!team) {
    return (
      <div {...stylex.props(card.base, card.pad)}>
        <h1 {...stylex.props(type.h1)}>Team not found</h1>
        <Link to="/teams">Back to teams</Link>
      </div>
    );
  }

  const lead = personById[team.leadId];
  const owned = Object.values(serviceById).filter((s) => s.teamId === team.id);
  const open = liveIncidents.filter((i) => i.status !== 'Resolved' && i.serviceIds.some((s) => serviceById[s]?.teamId === team.id));
  const oc = onCall.find((o) => o.teamId === team.id);

  return (
    <div {...stylex.props(pg.wrap)}>
      <nav aria-label="Breadcrumb" {...stylex.props(pg.crumb)}>
        <Link to="/teams" {...stylex.props(pg.crumbLink)}><ArrowLeft size={12} /> Teams</Link>
        <ChevronRight size={13} color="#94a3b8" />
        <span>{team.name}</span>
      </nav>

      <div {...stylex.props(head.box)}>
        <span {...stylex.props(head.avatar)}>{team.name.slice(0, 1)}</span>
        <div {...stylex.props(head.main)}>
          <h1 {...stylex.props(head.title)}>{team.name}</h1>
          <p {...stylex.props(head.desc)}>{team.description}</p>
          <p {...stylex.props(head.meta)}>Lead: {lead?.name} · {team.memberIds.length} members · {team.channel} · {owned.length} services</p>
        </div>
        <div {...stylex.props(head.side)}>
          <p {...stylex.props(type.label)}>Reliability · 30d</p>
          <p {...stylex.props(head.reli)}>{team.reliability.toFixed(2)}%</p>
          <Progress value={Math.round((team.reliability - 99) * 100)} tone="#059669" />
          <p {...stylex.props(head.mttr)}>MTTR {team.mttrMinutes}m · {open.length} open incidents</p>
        </div>
      </div>

      <div {...stylex.props(pg.cols)}>
        <div {...stylex.props(pg.main)}>
          <section {...stylex.props(card.base, card.pad)} aria-label="Members">
            <SectionHeader title={`Members (${team.memberIds.length})`} sub={team.id === 'payments' ? 'Payments owns money movement — the highest reliability bar in the company' : undefined} />
            <ul {...stylex.props(mem.list)}>
              {team.memberIds.map((id) => {
                const p = personById[id];
                const isLead = id === team.leadId;
                const isOc = id === oc?.primaryId || id === oc?.secondaryId;
                return (
                  <li key={id} {...stylex.props(mem.row)}>
                    <Avatar personId={id} size="lg" />
                    <div {...stylex.props(mem.main)}>
                      <p {...stylex.props(mem.name)}>{p?.name} {isLead && <span {...stylex.props(mem.badge)}>Team lead</span>}</p>
                      <p {...stylex.props(mem.role)}>{p?.role} · {p?.email}</p>
                    </div>
                    {isOc && <span {...stylex.props(mem.oc)}><Moon size={12} /> {id === oc?.primaryId ? 'Primary on-call' : 'Secondary'}</span>}
                  </li>
                );
              })}
            </ul>
          </section>

          <section {...stylex.props(card.base, card.pad)} aria-label="Owned services">
            <SectionHeader title={`Owned services (${owned.length})`} sub="Health reflects live incident state" />
            <div {...stylex.props(svc.list)}>
              {owned.map((s) => (
                <Link key={s.id} to="/services/$serviceId" params={{ serviceId: s.id }} {...stylex.props(svc.row)}>
                  <span {...stylex.props(svc.main)}><strong>{s.name}</strong><span>{s.tier} · {s.tech} · {s.uptime30d.toFixed(2)}% uptime</span></span>
                  <HealthBadge health={s.health} />
                </Link>
              ))}
            </div>
          </section>
        </div>

        <aside {...stylex.props(pg.rail)}>
          <section {...stylex.props(card.base, card.padSm)} aria-label="Current on-call">
            <h2 {...stylex.props(type.h3)}>Current on-call</h2>
            <div {...stylex.props(oc2.row)}><Avatar personId={oc?.primaryId ?? ''} /><div><p {...stylex.props(oc2.name)}>{personById[oc?.primaryId ?? '']?.name}</p><p {...stylex.props(oc2.sub)}>Primary · since {oc?.since}</p></div></div>
            <div {...stylex.props(oc2.row)}><Avatar personId={oc?.secondaryId ?? ''} size="sm" /><div><p {...stylex.props(oc2.name)}>{personById[oc?.secondaryId ?? '']?.name}</p><p {...stylex.props(oc2.sub)}>Secondary</p></div></div>
            <p {...stylex.props(oc2.next)}>Next: {personById[oc?.nextId ?? '']?.name} · <Link to="/on-call">Full schedule</Link></p>
            <div {...stylex.props(oc2.esc)}>
              {(escalationSteps[team.id] ?? []).slice(0, 3).map((s) => <p key={s} {...stylex.props(oc2.escRow)}>{s}</p>)}
            </div>
          </section>

          <section {...stylex.props(card.base, card.padSm)} aria-label="Open incidents">
            <h2 {...stylex.props(type.h3)}>Open incidents ({open.length})</h2>
            <div {...stylex.props(inc.col)}>
              {open.map((i) => (
                <Link key={i.id} to="/incidents/$incidentId" params={{ incidentId: i.id }} {...stylex.props(inc.row)}>
                  <SevBadge sev={i.severity} />
                  <span {...stylex.props(inc.main)}><strong>{i.id}</strong><span>{i.title}</span></span>
                  <StatusBadge status={i.status} />
                </Link>
              ))}
              {open.length === 0 && <p {...stylex.props(type.sub)}>No open incidents for this team.</p>}
            </div>
          </section>

          <section {...stylex.props(card.base, card.padSm)} aria-label="Reliability summary">
            <h2 {...stylex.props(type.h3)}>Reliability summary</h2>
            <ReliLine label="Reliability 30d" value={`${team.reliability.toFixed(2)}%`} pct={Math.round((team.reliability - 99) * 100)} />
            <div style={{ height: 8 }} />
            <ReliLine label="MTTR" value={`${team.mttrMinutes} min`} pct={Math.min(100, team.mttrMinutes)} />
            <p {...stylex.props(pg.note)}>Payments reliability dipped this week during INC-1042; the gateway postmortem actions target a return above 99.95%.</p>
          </section>
        </aside>
      </div>
    </div>
  );
}

function ReliLine({ label, value, pct }: { label: string; value: string; pct: number }) {
  return (
    <div>
      <div {...stylex.props(reli.top)}><span>{label}</span><span>{value}</span></div>
      <Progress value={pct} />
    </div>
  );
}

const pg = stylex.create({
  wrap: { display: 'flex', flexDirection: 'column', gap: 14 },
  crumb: { display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: tokens.muted },
  crumbLink: { display: 'inline-flex', alignItems: 'center', gap: 4, color: tokens.accent, fontWeight: 700, textDecoration: 'none' },
  cols: { display: 'grid', gridTemplateColumns: { default: 'minmax(0,1fr) 300px', '@media (max-width: 1024px)': '1fr' }, gap: 14, alignItems: 'start' },
  main: { display: 'flex', flexDirection: 'column', gap: 14, minWidth: 0 },
  rail: { display: 'flex', flexDirection: 'column', gap: 14, minWidth: 0 },
  note: { fontSize: 12, color: tokens.muted, margin: '10px 0 0', lineHeight: 1.5 },
});

const head = stylex.create({
  box: { display: 'flex', gap: 16, backgroundColor: tokens.surface, borderWidth: 1, borderStyle: 'solid', borderColor: tokens.line, borderRadius: 12, padding: 20, flexWrap: 'wrap', alignItems: 'flex-start' },
  avatar: { width: 52, height: 52, borderRadius: 14, backgroundColor: tokens.sidebar, color: '#fff', fontWeight: 800, fontSize: 22, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  main: { flex: 1, minWidth: 220 },
  title: { margin: 0, fontSize: 24, fontWeight: 800, color: tokens.ink },
  desc: { margin: '6px 0', fontSize: 13.5, color: tokens.ink2, lineHeight: 1.6 },
  meta: { margin: 0, fontSize: 12.5, color: tokens.muted },
  side: { minWidth: 200, backgroundColor: tokens.surface2, borderRadius: 10, padding: 14 },
  reli: { margin: '2px 0 6px', fontSize: 26, fontWeight: 800, color: tokens.ink },
  mttr: { fontSize: 12, color: tokens.muted, margin: '8px 0 0' },
});

const mem = stylex.create({
  list: { listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column' },
  row: { display: 'flex', gap: 12, alignItems: 'center', padding: '11px 4px', borderTopWidth: 1, borderTopStyle: 'solid', borderTopColor: '#f1f5f9' },
  main: { flex: 1, minWidth: 0 },
  name: { margin: 0, fontSize: 14, fontWeight: 700, color: tokens.ink },
  role: { margin: '2px 0 0', fontSize: 12.5, color: tokens.muted },
  badge: { fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', backgroundColor: tokens.accentSoft, color: tokens.accentInk, borderRadius: 999, padding: '2px 8px', marginLeft: 6 },
  oc: { display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11.5, fontWeight: 700, color: '#6d28d9', backgroundColor: tokens.violetSoft, borderRadius: 999, padding: '4px 10px' },
});

const svc = stylex.create({
  list: { display: 'flex', flexDirection: 'column' },
  row: { display: 'flex', alignItems: 'center', gap: 10, padding: '11px 4px', borderTopWidth: 1, borderTopStyle: 'solid', borderTopColor: '#f1f5f9', textDecoration: 'none' },
  main: { flex: 1, display: 'flex', flexDirection: 'column', fontSize: 13.5, color: tokens.ink },
});

const oc2 = stylex.create({
  row: { display: 'flex', gap: 10, alignItems: 'center', margin: '10px 0' },
  name: { margin: 0, fontSize: 13, fontWeight: 700, color: tokens.ink },
  sub: { margin: 0, fontSize: 12, color: tokens.muted },
  next: { fontSize: 12, color: tokens.muted, margin: '4px 0 0' },
  esc: { borderTopWidth: 1, borderTopStyle: 'solid', borderTopColor: '#f1f5f9', marginTop: 10, paddingTop: 10 },
  escRow: { fontSize: 12, color: tokens.ink2, margin: '0 0 6px' },
});

const inc = stylex.create({
  col: { display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8 },
  row: { display: 'flex', alignItems: 'center', gap: 8, padding: '8px', borderRadius: 8, textDecoration: 'none', ':hover': { backgroundColor: tokens.surface2 } },
  main: { flex: 1, display: 'flex', flexDirection: 'column', fontSize: 12.5, color: tokens.ink, minWidth: 0 },
});

const reli = stylex.create({
  top: { display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 600, color: tokens.ink2, marginBottom: 5 },
});
