import * as React from 'react';
import * as stylex from '@stylexjs/stylex';
import { createFileRoute, Link } from '@tanstack/react-router';
import { Search } from 'lucide-react';
import { tokens } from '../styles/tokens.stylex';
import { useApp } from '../data/store';
import { personById, services, onCall, teamById, type HealthState, type Tier } from '../data/model';
import { EmptyNote, HealthBadge, Tag, card, type } from '../components/ui';

export const Route = createFileRoute('/services/')({
  component: ServicesPage,
});

function ServicesPage() {
  const [q, setQ] = React.useState('');
  const [health, setHealth] = React.useState<HealthState[]>([]);
  const [tiers, setTiers] = React.useState<Tier[]>([]);
  const [team, setTeam] = React.useState('all');

  const filtered = services.filter((s) => {
    if (health.length && !health.includes(s.health)) return false;
    if (tiers.length && !tiers.includes(s.tier)) return false;
    if (team !== 'all' && s.teamId !== team) return false;
    const needle = q.trim().toLowerCase();
    if (needle && !`${s.name} ${s.repo} ${s.tech}`.toLowerCase().includes(needle)) return false;
    return true;
  });

  const toggle = <T,>(list: T[], v: T, set: (x: T[]) => void) => set(list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

  return (
    <div {...stylex.props(pg.wrap)}>
      <div>
        <h1 {...stylex.props(type.h1)}>Services</h1>
        <p {...stylex.props(type.sub)} style={{ marginTop: 4 }}>12 of 47 production services modeled · health reflects live incident state</p>
      </div>
      <div {...stylex.props(toolbar.bar)}>
        <div {...stylex.props(toolbar.search)}>
          <Search size={15} color="#64748b" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search services, repos, tech…" aria-label="Search services" {...stylex.props(toolbar.input)} />
        </div>
        <select value={team} onChange={(e) => setTeam(e.target.value)} aria-label="Filter by team" {...stylex.props(toolbar.select)}>
          <option value="all">All teams</option>
          <option value="payments">Payments</option>
          <option value="platform">Platform</option>
          <option value="core-api">Core API</option>
          <option value="infrastructure">Infrastructure</option>
          <option value="developer-experience">Developer Experience</option>
        </select>
      </div>
      <div {...stylex.props(toolbar.groups)}>
        <div role="group" aria-label="Health filter" {...stylex.props(toolbar.group)}>
          <span {...stylex.props(toolbar.lab)}>Health</span>
          {(['Critical', 'Degraded', 'Healthy'] as HealthState[]).map((h) => (
            <button key={h} aria-pressed={health.includes(h)} onClick={() => toggle(health, h, setHealth)} {...stylex.props(toolbar.pill, health.includes(h) && toolbar.pillOn)}>{h}</button>
          ))}
        </div>
        <div role="group" aria-label="Tier filter" {...stylex.props(toolbar.group)}>
          <span {...stylex.props(toolbar.lab)}>Tier</span>
          {(['Tier 1', 'Tier 2', 'Tier 3'] as Tier[]).map((t) => (
            <button key={t} aria-pressed={tiers.includes(t)} onClick={() => toggle(tiers, t, setTiers)} {...stylex.props(toolbar.pill, tiers.includes(t) && toolbar.pillOn)}>{t}</button>
          ))}
        </div>
        {(health.length > 0 || tiers.length > 0 || q !== '' || team !== 'all') && (
          <button onClick={() => { setHealth([]); setTiers([]); setQ(''); setTeam('all'); }} {...stylex.props(toolbar.clear)}>Clear all</button>
        )}
      </div>

      <div {...stylex.props(grid.cards)}>
        {filtered.map((s) => (
          <Link key={s.id} to="/services/$serviceId" params={{ serviceId: s.id }} {...stylex.props(svc.card)}>
            <div {...stylex.props(svc.top)}>
              <strong {...stylex.props(svc.name)}>{s.name}</strong>
              <HealthBadge health={s.health} />
            </div>
            <p {...stylex.props(svc.meta)}>{teamById[s.teamId]?.name} · {s.tier} · {s.tech}</p>
            <div {...stylex.props(svc.stats)}>
              <span><strong>{s.uptime30d.toFixed(2)}%</strong> uptime</span>
              <span><strong>{s.errorRatePct}%</strong> errors</span>
              <span><strong>P95 {s.latencyP95Ms}ms</strong></span>
            </div>
            <ServiceFoot serviceId={s.id} teamId={s.teamId} />
          </Link>
        ))}
      </div>
      {filtered.length === 0 && <div {...stylex.props(card.base, card.pad)}><EmptyNote>No services match these filters.</EmptyNote></div>}
    </div>
  );
}

function ServiceFoot({ serviceId, teamId }: { serviceId: string; teamId: string }) {
  const { incidents: liveIncidents, alerts: liveAlerts } = useApp();
  const open = liveIncidents.filter((i) => i.status !== 'Resolved' && i.serviceIds.includes(serviceId)).length;
  const active = liveAlerts.filter((a) => a.state !== 'Resolved' && a.serviceId === serviceId).length;
  return (
    <div {...stylex.props(svc.foot)}>
      {open > 0 ? <Tag tone="dark">{open} incident{open > 1 ? 's' : ''}</Tag> : <Tag>no incidents</Tag>}
      {active > 0 && <Tag tone="violet">{active} alerts</Tag>}
      <span {...stylex.props(svc.owner)}>On-call: {onCallFor(teamId)}</span>
    </div>
  );
}

function onCallFor(teamId: string): string {
  const o = onCall.find((x) => x.teamId === teamId);
  return o ? (personById[o.primaryId]?.name.split(' ')[0] ?? '—') : '—';
}

const pg = stylex.create({
  wrap: { display: 'flex', flexDirection: 'column', gap: 14 },
});

const toolbar = stylex.create({
  bar: { display: 'flex', gap: 10, flexWrap: 'wrap' },
  search: { display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 200, backgroundColor: '#fff', borderWidth: 1, borderStyle: 'solid', borderColor: tokens.line, borderRadius: 9, padding: '8px 12px' },
  input: { borderWidth: 0, flex: 1, fontSize: 13, backgroundColor: 'transparent', color: tokens.ink },
  select: { borderWidth: 1, borderStyle: 'solid', borderColor: tokens.line, borderRadius: 8, padding: '7px 10px', fontSize: 12, fontWeight: 600, backgroundColor: '#fff', color: tokens.ink2 },
  groups: { display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' },
  group: { display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
  lab: { fontSize: 11, fontWeight: 800, color: tokens.muted, textTransform: 'uppercase', letterSpacing: '0.06em' },
  pill: { borderWidth: 1, borderStyle: 'solid', borderColor: tokens.lineStrong, backgroundColor: '#fff', borderRadius: 999, padding: '5px 12px', fontSize: 12, fontWeight: 600, color: tokens.ink2, cursor: 'pointer' },
  pillOn: { backgroundColor: tokens.sidebar, color: '#fff', borderColor: tokens.sidebar },
  clear: { borderWidth: 0, backgroundColor: 'transparent', color: tokens.accent, fontWeight: 700, fontSize: 12, cursor: 'pointer' },
});

const grid = stylex.create({
  cards: { display: 'grid', gridTemplateColumns: { default: 'repeat(3, 1fr)', '@media (max-width: 1024px)': 'repeat(2, 1fr)', '@media (max-width: 640px)': '1fr' }, gap: 12 },
});

const svc = stylex.create({
  card: { backgroundColor: '#fff', borderWidth: 1, borderStyle: 'solid', borderColor: tokens.line, borderRadius: 12, padding: 16, textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: 8, ':hover': { borderColor: tokens.lineStrong, boxShadow: '0 6px 20px rgba(15,23,42,0.08)' } },
  top: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  name: { fontSize: 14, color: tokens.ink },
  meta: { fontSize: 12, color: tokens.muted, margin: 0 },
  stats: { display: 'flex', gap: 14, fontSize: 12, color: tokens.muted, backgroundColor: tokens.surface2, borderRadius: 8, padding: '8px 11px' },
  foot: { display: 'flex', alignItems: 'center', gap: 6, marginTop: 'auto', flexWrap: 'wrap' },
  owner: { marginLeft: 'auto', fontSize: 11, color: tokens.muted },
});
