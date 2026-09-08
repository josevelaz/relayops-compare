import * as stylex from '@stylexjs/stylex';
import { createFileRoute, Link } from '@tanstack/react-router';
import { ChevronRight } from 'lucide-react';
import { tokens } from '../styles/tokens.stylex';
import { useApp } from '../data/store';
import { onCall, personById, serviceById, teams } from '../data/model';
import { Avatar, AvatarStack, HealthBadge, type } from '../components/ui';

export const Route = createFileRoute('/teams/')({
  component: TeamsPage,
});

function TeamsPage() {
  const { incidents: liveIncidents } = useApp();

  return (
    <div {...stylex.props(pg.wrap)}>
      <div>
        <h1 {...stylex.props(type.h1)}>Teams</h1>
        <p {...stylex.props(type.sub)} style={{ marginTop: 4 }}>5 of 12 engineering teams modeled · ownership, on-call and reliability at a glance</p>
      </div>
      <div {...stylex.props(pg.grid)}>
        {teams.map((t) => {
          const lead = personById[t.leadId];
          const owned = Object.values(serviceById).filter((s) => s.teamId === t.id);
          const open = liveIncidents.filter((i) => i.status !== 'Resolved' && i.serviceIds.some((s) => serviceById[s]?.teamId === t.id));
          const oc = onCall.find((o) => o.teamId === t.id);
          const worst: 'Critical' | 'Degraded' | 'Healthy' = owned.some((s) => s.health === 'Critical') ? 'Critical' : owned.some((s) => s.health === 'Degraded') ? 'Degraded' : 'Healthy';
          return (
            <Link key={t.id} to="/teams/$teamId" params={{ teamId: t.id }} {...stylex.props(tm.card)}>
              <div {...stylex.props(tm.top)}>
                <span {...stylex.props(tm.avatar)}>{t.name.slice(0, 1)}</span>
                <div><h2 {...stylex.props(tm.name)}>{t.name}</h2><p {...stylex.props(tm.sub)}>Lead: {lead?.name} · {t.memberIds.length} members</p></div>
                <ChevronRight size={15} color="#94a3b8" />
              </div>
              <p {...stylex.props(tm.desc)}>{t.description}</p>
              <div {...stylex.props(tm.meta)}>
                <AvatarStack ids={t.memberIds} />
                <span {...stylex.props(tm.oncall)}>On-call: {personById[oc?.primaryId ?? '']?.name.split(' ')[0]}</span>
                <HealthBadge health={worst} />
              </div>
              <div {...stylex.props(tm.stats)}>
                <span><strong>{owned.length}</strong> services</span>
                <span><strong>{open.length}</strong> open incidents</span>
                <span><strong>{t.reliability.toFixed(2)}%</strong> reliable</span>
                <span><strong>{t.mttrMinutes}m</strong> MTTR</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

const pg = stylex.create({
  wrap: { display: 'flex', flexDirection: 'column', gap: 14 },
  grid: { display: 'grid', gridTemplateColumns: { default: '1fr 1fr', '@media (max-width: 760px)': '1fr' }, gap: 12 },
});

const tm = stylex.create({
  card: { backgroundColor: '#fff', borderWidth: 1, borderStyle: 'solid', borderColor: tokens.line, borderRadius: 12, padding: 18, textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: 10, ':hover': { borderColor: tokens.lineStrong, boxShadow: '0 6px 20px rgba(15,23,42,0.08)' } },
  top: { display: 'flex', alignItems: 'center', gap: 11 },
  avatar: { width: 40, height: 40, borderRadius: 11, backgroundColor: tokens.sidebar, color: '#fff', fontWeight: 800, fontSize: 17, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  name: { margin: 0, fontSize: 15, fontWeight: 800, color: tokens.ink },
  sub: { margin: 0, fontSize: 12, color: tokens.muted },
  desc: { margin: 0, fontSize: 13, color: tokens.ink2, lineHeight: 1.55 },
  meta: { display: 'flex', alignItems: 'center', gap: 10 },
  oncall: { fontSize: 12, color: tokens.muted, fontWeight: 600 },
  stats: { display: 'flex', gap: 14, flexWrap: 'wrap', fontSize: 12, color: tokens.muted, backgroundColor: tokens.surface2, borderRadius: 8, padding: '9px 12px' },
});


