import * as React from 'react';
import * as stylex from '@stylexjs/stylex';
import { createFileRoute, Link } from '@tanstack/react-router';
import { Bell, CalendarDays, ChevronRight, Moon, PhoneCall } from 'lucide-react';
import { tokens } from '../styles/tokens.stylex';
import { escalationSteps, onCall, personById, teamById, teams } from '../data/model';
import { Avatar, Button, SectionHeader, Tag, card, type } from '../components/ui';

export const Route = createFileRoute('/on-call/')({
  component: OnCallPage,
});

const COVERAGE: Record<string, { day: string; note: string; highlight?: boolean }[]> = {
  payments: [
    { day: 'Mon 9/7', note: 'Priya P. primary · Marcus J. secondary' },
    { day: 'Tue 9/8', note: 'Priya P. primary · Marcus J. secondary', highlight: true },
    { day: 'Wed 9/9', note: 'Priya P. primary · Marcus J. secondary' },
    { day: 'Thu 9/10', note: 'Priya P. primary · Marcus J. secondary' },
    { day: 'Fri 9/11', note: 'Priya P. primary · Marcus J. secondary' },
    { day: 'Sat 9/12', note: 'Weekend: Elena R. primary · Liam B. secondary' },
    { day: 'Sun 9/13', note: 'Weekend: Elena R. primary · Liam B. secondary' },
  ],
  platform: [
    { day: 'Mon 9/7', note: 'Aisha K. primary · David K. secondary' },
    { day: 'Tue 9/8', note: 'Aisha K. primary · David K. secondary', highlight: true },
    { day: 'Wed 9/9', note: 'Aisha K. primary · David K. secondary' },
    { day: 'Thu 9/10', note: 'Aisha K. primary · David K. secondary' },
    { day: 'Fri 9/11', note: 'Aisha K. primary · David K. secondary' },
    { day: 'Sat 9/12', note: 'Weekend: David K. primary' },
    { day: 'Sun 9/13', note: 'Weekend: David K. primary' },
  ],
  'core-api': [
    { day: 'Mon 9/7', note: 'Tom B. primary · Carlos M. secondary' },
    { day: 'Tue 9/8', note: 'Tom B. primary · Carlos M. secondary', highlight: true },
    { day: 'Wed 9/9', note: 'Tom B. primary · Carlos M. secondary' },
    { day: 'Thu 9/10', note: 'Tom B. primary · Carlos M. secondary' },
    { day: 'Fri 9/11', note: 'Tom B. primary · Carlos M. secondary' },
    { day: 'Sat 9/12', note: 'Weekend: Mei L. primary' },
    { day: 'Sun 9/13', note: 'Weekend: Mei L. primary' },
  ],
  infrastructure: [
    { day: 'Mon 9/7', note: 'Raj N. primary · Sofia M. secondary' },
    { day: 'Tue 9/8', note: 'Raj N. primary · Sofia M. secondary', highlight: true },
    { day: 'Wed 9/9', note: 'Raj N. primary · Sofia M. secondary' },
    { day: 'Thu 9/10', note: 'Raj N. primary · Sofia M. secondary' },
    { day: 'Fri 9/11', note: 'Raj N. primary · Sofia M. secondary' },
    { day: 'Sat 9/12', note: 'Weekend: Sofia M. primary (shadow)' },
    { day: 'Sun 9/13', note: 'Weekend: Sofia M. primary (shadow)' },
  ],
  'developer-experience': [
    { day: 'Mon 9/7', note: 'James O. primary · Anna P. secondary' },
    { day: 'Tue 9/8', note: 'James O. primary · Anna P. secondary', highlight: true },
    { day: 'Wed 9/9', note: 'James O. primary · Anna P. secondary' },
    { day: 'Thu 9/10', note: 'James O. primary · Anna P. secondary' },
    { day: 'Fri 9/11', note: 'James O. primary · Anna P. secondary' },
    { day: 'Sat 9/12', note: 'Weekend: best-effort (no page)' },
    { day: 'Sun 9/13', note: 'Weekend: best-effort (no page)' },
  ],
};

function OnCallPage() {
  const [team, setTeam] = React.useState('payments');
  const [flash, setFlash] = React.useState('');
  const current = onCall.find((o) => o.teamId === team);

  return (
    <div {...stylex.props(pg.wrap)}>
      <div {...stylex.props(pg.head)}>
        <div>
          <h1 {...stylex.props(type.h1)}>On-call</h1>
          <p {...stylex.props(type.sub)} style={{ marginTop: 4 }}>Coverage for the current week · all 5 teams staffed · 2 handoffs today at 12:00 PM</p>
        </div>
        <Button tone="secondary" onClick={() => { setFlash('Page acknowledged — this would trigger PagerDuty in production.'); setTimeout(() => setFlash(''), 3000); }}>
          <PhoneCall size={14} /> Page current on-call
        </Button>
      </div>
      {flash && <p role="status" {...stylex.props(pg.flash)}>{flash}</p>}

      <div {...stylex.props(grid.roster)}>
        {onCall.map((o) => {
          const t = teamById[o.teamId];
          const primary = personById[o.primaryId];
          const secondary = personById[o.secondaryId];
          const next = personById[o.nextId];
          return (
            <button key={o.teamId} onClick={() => setTeam(o.teamId)} aria-pressed={team === o.teamId} {...stylex.props(roster.card, team === o.teamId && roster.active)}>
              <div {...stylex.props(roster.top)}>
                <strong>{t?.name}</strong>
                {team === o.teamId ? <Tag tone="accent">viewing</Tag> : <ChevronRight size={14} color="#94a3b8" />}
              </div>
              <div {...stylex.props(roster.person)}>
                <Avatar personId={o.primaryId} />
                <div><p {...stylex.props(roster.name)}>{primary?.name}</p><p {...stylex.props(roster.role)}>Primary · since {o.since}</p></div>
              </div>
              <div {...stylex.props(roster.person)}>
                <Avatar personId={o.secondaryId} size="sm" />
                <div><p {...stylex.props(roster.name)}>{secondary?.name}</p><p {...stylex.props(roster.role)}>Secondary · {o.shiftLabel}</p></div>
              </div>
              <p {...stylex.props(roster.next)}>Next: {next?.name}</p>
            </button>
          );
        })}
      </div>

      <div {...stylex.props(pg.cols)}>
        <section {...stylex.props(card.base, card.pad)} aria-label="Weekly schedule">
          <SectionHeader title={`${teamById[team]?.name} — this week`} sub="Mon Sep 7 → Sun Sep 13 · primary & secondary coverage" right={<span {...stylex.props(cal.hint)}><CalendarDays size={13} /> Today: Tue 9/8</span>} />
          <ol {...stylex.props(cal.list)}>
            {(COVERAGE[team] ?? []).map((d) => (
              <li key={d.day} {...stylex.props(cal.row, d.highlight && cal.today)}>
                <span {...stylex.props(cal.day)}>{d.day}{d.highlight ? ' · today' : ''}</span>
                <span {...stylex.props(cal.note)}>{d.note}</span>
                {d.highlight && <Tag tone="accent">on now</Tag>}
              </li>
            ))}
          </ol>
          <p {...stylex.props(pg.note)}><Moon size={13} /> Overnight pages route to the secondary after 2 unanswered minutes. Weekend rotations are marked above.</p>
        </section>

        <aside {...stylex.props(pg.rail)}>
          <section {...stylex.props(card.base, card.padSm)} aria-label="Escalation policy">
            <h2 {...stylex.props(type.h2)}>Escalation policy</h2>
            <p {...stylex.props(type.sub)} style={{ margin: '4px 0 10px' }}>{teamById[team]?.name} · {teamById[team]?.channel}</p>
            <ol {...stylex.props(esc.list)}>
              {(escalationSteps[team] ?? []).map((s, i) => (
                <li key={s} {...stylex.props(esc.row)}>
                  <span {...stylex.props(esc.num)}>{i + 1}</span>
                  <span>{s}</span>
                </li>
              ))}
            </ol>
          </section>
          <section {...stylex.props(card.base, card.padSm)} aria-label="Upcoming handoffs">
            <h2 {...stylex.props(type.h2)}>Handoffs today</h2>
            <div {...stylex.props(hand.col)}>
              <div {...stylex.props(hand.row)}><Bell size={13} color="#4f46e5" /><span><strong>12:00 PM</strong> — Payments secondary: Marcus J. takes over shadow shift</span></div>
              <div {...stylex.props(hand.row)}><Bell size={13} color="#4f46e5" /><span><strong>12:00 PM</strong> — Infrastructure: Sofia M. begins shadow rotation</span></div>
            </div>
            <p {...stylex.props(pg.note)}>Members: {teams.find((t) => t.id === team)?.memberIds.map((m) => personById[m]?.name.split(' ')[0]).join(', ')} · <Link to="/teams/$teamId" params={{ teamId: team }}>Team page</Link></p>
          </section>
        </aside>
      </div>
    </div>
  );
}

const pg = stylex.create({
  wrap: { display: 'flex', flexDirection: 'column', gap: 14 },
  head: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' },
  flash: { margin: 0, fontSize: 12, fontWeight: 700, color: tokens.ok, backgroundColor: tokens.okSoft, borderRadius: 8, padding: '8px 12px' },
  cols: { display: 'grid', gridTemplateColumns: { default: 'minmax(0,1fr) 320px', '@media (max-width: 1024px)': '1fr' }, gap: 14, alignItems: 'start' },
  rail: { display: 'flex', flexDirection: 'column', gap: 14 },
  note: { fontSize: 12, color: tokens.muted, display: 'flex', gap: 6, alignItems: 'flex-start', margin: '12px 0 0', lineHeight: 1.5 },
});

const grid = stylex.create({
  roster: { display: 'grid', gridTemplateColumns: { default: 'repeat(5, 1fr)', '@media (max-width: 1024px)': 'repeat(2, 1fr)', '@media (max-width: 560px)': '1fr' }, gap: 10 },
});

const roster = stylex.create({
  card: { backgroundColor: '#fff', borderWidth: 1, borderStyle: 'solid', borderColor: tokens.line, borderRadius: 12, padding: 14, textAlign: 'left', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 10, ':hover': { borderColor: tokens.lineStrong } },
  active: { borderColor: tokens.accent, boxShadow: '0 0 0 2px #e0e7ff' },
  top: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 13, color: tokens.ink },
  person: { display: 'flex', gap: 9, alignItems: 'center' },
  name: { margin: 0, fontSize: 13, fontWeight: 700, color: tokens.ink },
  role: { margin: 0, fontSize: 11.5, color: tokens.muted },
  next: { margin: 0, fontSize: 12, color: tokens.muted, borderTopWidth: 1, borderTopStyle: 'solid', borderTopColor: '#f1f5f9', paddingTop: 8 },
});

const cal = stylex.create({
  hint: { display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, color: tokens.muted, fontWeight: 600 },
  list: { listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column' },
  row: { display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 9, borderBottomWidth: 1, borderBottomStyle: 'solid', borderBottomColor: '#f1f5f9' },
  today: { backgroundColor: '#eef2ff' },
  day: { fontSize: 12.5, fontWeight: 800, color: tokens.ink, minWidth: 110 },
  note: { fontSize: 12.5, color: tokens.ink2, flex: 1 },
});

const esc = stylex.create({
  list: { listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 8 },
  row: { display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 13, color: tokens.ink2 },
  num: { width: 22, height: 22, borderRadius: '50%', backgroundColor: tokens.sidebar, color: '#fff', fontSize: 11, fontWeight: 800, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
});

const hand = stylex.create({
  col: { display: 'flex', flexDirection: 'column', gap: 8, marginTop: 10 },
  row: { display: 'flex', gap: 8, alignItems: 'flex-start', fontSize: 12.5, color: tokens.ink2, lineHeight: 1.5 },
});
