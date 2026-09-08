import * as React from 'react';
import * as stylex from '@stylexjs/stylex';
import { createFileRoute, Link } from '@tanstack/react-router';
import { GitBranch, GitCommitHorizontal } from 'lucide-react';
import { tokens } from '../styles/tokens.stylex';
import { deployments, personById, serviceById, teamById, type DeployEnv, type DeployStatus } from '../data/model';
import { Avatar, EmptyNote, Mono, Tag, card, type } from '../components/ui';

export const Route = createFileRoute('/deployments/')({
  component: DeploymentsPage,
});

function DeploymentsPage() {
  const [q, setQ] = React.useState('');
  const [env, setEnv] = React.useState<'all' | DeployEnv>('all');
  const [statuses, setStatuses] = React.useState<DeployStatus[]>([]);
  const [onlyLinked, setOnlyLinked] = React.useState(false);

  const filtered = deployments.filter((d) => {
    if (env !== 'all' && d.env !== env) return false;
    if (statuses.length && !statuses.includes(d.status)) return false;
    if (onlyLinked && !d.incidentId) return false;
    const needle = q.trim().toLowerCase();
    if (needle && !`${d.version} ${d.commit} ${serviceById[d.serviceId]?.name ?? ''} ${personById[d.authorId]?.name ?? ''}`.toLowerCase().includes(needle)) return false;
    return true;
  });

  const toggle = (v: DeployStatus) => setStatuses((s) => (s.includes(v) ? s.filter((x) => x !== v) : [...s, v]));

  return (
    <div {...stylex.props(pg.wrap)}>
      <div>
        <h1 {...stylex.props(type.h1)}>Deployments</h1>
        <p {...stylex.props(type.sub)} style={{ marginTop: 4 }}>3 production deploys in the last hour · correlated deploys surface automatically</p>
      </div>

      <div {...stylex.props(corr.box)} role="note" aria-label="Deployment correlation">
        <GitBranch size={16} />
        <p {...stylex.props(corr.text)}>
          <strong>Correlation radar:</strong> <Mono>payment-gateway@4.18.2</Mono> shipped 5 minutes before INC-1042 spiked and was rolled back at 10:43 AM.
          <Mono>auth-service@1.92.3</Mono> failed at 10:58 AM. Both are flagged below.
        </p>
      </div>

      <div {...stylex.props(toolbar.bar)}>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search version, service, commit, author…" aria-label="Search deployments" {...stylex.props(toolbar.search)} />
        <div role="tablist" aria-label="Environment" {...stylex.props(toolbar.scope)}>
          {(['all', 'Production', 'Staging'] as const).map((e) => (
            <button key={e} role="tab" aria-selected={env === e} onClick={() => setEnv(e)} {...stylex.props(toolbar.scopeBtn, env === e && toolbar.scopeOn)}>{e === 'all' ? 'All envs' : e}</button>
          ))}
        </div>
      </div>
      <div {...stylex.props(toolbar.groups)}>
        <div role="group" aria-label="Status filter" {...stylex.props(toolbar.group)}>
          {(['Successful', 'Failed', 'Rolling out', 'Rolled back'] as DeployStatus[]).map((s) => (
            <button key={s} aria-pressed={statuses.includes(s)} onClick={() => toggle(s)} {...stylex.props(toolbar.pill, statuses.includes(s) && toolbar.pillOn)}>{s}</button>
          ))}
        </div>
        <label {...stylex.props(toolbar.check)}><input type="checkbox" checked={onlyLinked} onChange={(e) => setOnlyLinked(e.target.checked)} /> Only incident-linked</label>
        {(statuses.length > 0 || q !== '' || onlyLinked || env !== 'all') && (
          <button onClick={() => { setStatuses([]); setQ(''); setOnlyLinked(false); setEnv('all'); }} {...stylex.props(toolbar.clear)}>Clear</button>
        )}
      </div>

      <ol {...stylex.props(tl.list)}>
        {filtered.map((d) => {
          const svc = serviceById[d.serviceId];
          return (
            <li key={d.id} {...stylex.props(tl.item, d.incidentId ? tl.flagged : null)}>
              <span {...stylex.props(tl.rail)} aria-hidden>
                <span {...stylex.props(tl.node)} style={{ backgroundColor: dotFor(d.status) }} />
              </span>
              <div {...stylex.props(card.base, card.padSm, tl.body)}>
                <div {...stylex.props(tl.top)}>
                  <GitCommitHorizontal size={15} color="#4f46e5" />
                  <span {...stylex.props(tl.title)}><Mono>{d.version}</Mono></span>
                  <StatusTag status={d.status} />
                  <span {...stylex.props(tl.env)}>{d.env}</span>
                  {d.incidentId && <Link to="/incidents/$incidentId" params={{ incidentId: d.incidentId }} {...stylex.props(tl.flag)}>⚠ {d.incidentId}</Link>}
                </div>
                <p {...stylex.props(tl.sub)}>
                  <Link to="/services/$serviceId" params={{ serviceId: d.serviceId }} {...stylex.props(tl.svcLink)}>{svc?.name}</Link>
                  {' '}· commit <Mono>{d.commit}</Mono> · {d.pr} · {d.atLabel}
                </p>
                <div {...stylex.props(tl.foot)}>
                  <Avatar personId={d.authorId} size="sm" />
                  <span {...stylex.props(tl.author)}>{personById[d.authorId]?.name} · {teamById[svc?.teamId ?? '']?.name}</span>
                  {d.note && <span {...stylex.props(tl.note)}>{d.note}</span>}
                </div>
              </div>
            </li>
          );
        })}
      </ol>
      {filtered.length === 0 && <div {...stylex.props(card.base, card.pad)}><EmptyNote>No deployments match these filters.</EmptyNote></div>}
    </div>
  );
}

function dotFor(s: DeployStatus): string {
  if (s === 'Successful') return '#059669';
  if (s === 'Failed') return '#dc2626';
  if (s === 'Rolled back') return '#d97706';
  return '#0284c7';
}

function StatusTag({ status }: { status: DeployStatus }) {
  const tone = status === 'Successful' ? undefined : status === 'Failed' ? 'dark' : status === 'Rolled back' ? 'violet' : 'accent';
  return <Tag tone={tone as 'dark' | 'violet' | 'accent' | undefined}>{status}</Tag>;
}

const pg = stylex.create({
  wrap: { display: 'flex', flexDirection: 'column', gap: 14 },
});

const corr = stylex.create({
  box: { display: 'flex', gap: 10, alignItems: 'flex-start', backgroundColor: '#0c1322', color: '#dbe3f3', borderRadius: 12, padding: '14px 16px' },
  text: { margin: 0, fontSize: 13, lineHeight: 1.6 },
});

const toolbar = stylex.create({
  bar: { display: 'flex', gap: 10, flexWrap: 'wrap' },
  search: { flex: 1, minWidth: 220, borderWidth: 1, borderStyle: 'solid', borderColor: tokens.line, borderRadius: 9, padding: '8px 12px', fontSize: 13, backgroundColor: '#fff', color: tokens.ink },
  scope: { display: 'flex', backgroundColor: '#e8edf5', borderRadius: 9, padding: 3, gap: 2 },
  scopeBtn: { borderWidth: 0, backgroundColor: 'transparent', borderRadius: 7, padding: '6px 14px', fontSize: 12, fontWeight: 700, color: tokens.muted, cursor: 'pointer' },
  scopeOn: { backgroundColor: '#fff', color: tokens.ink, boxShadow: '0 1px 3px rgba(15,23,42,0.12)' },
  groups: { display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap' },
  group: { display: 'flex', gap: 6, flexWrap: 'wrap' },
  pill: { borderWidth: 1, borderStyle: 'solid', borderColor: tokens.lineStrong, backgroundColor: '#fff', borderRadius: 999, padding: '5px 12px', fontSize: 12, fontWeight: 600, color: tokens.ink2, cursor: 'pointer' },
  pillOn: { backgroundColor: tokens.sidebar, color: '#fff', borderColor: tokens.sidebar },
  check: { display: 'inline-flex', gap: 7, alignItems: 'center', fontSize: 12, fontWeight: 600, color: tokens.ink2 },
  clear: { borderWidth: 0, backgroundColor: 'transparent', color: tokens.accent, fontWeight: 700, fontSize: 12, cursor: 'pointer' },
});

const tl = stylex.create({
  list: { listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 2 },
  item: { display: 'flex', gap: 12 },
  flagged: {},
  rail: { display: 'flex', flexDirection: 'column', alignItems: 'center', width: 18, flexShrink: 0, paddingTop: 18 },
  node: { width: 12, height: 12, borderRadius: '50%' },
  body: { flex: 1, minWidth: 0, marginBottom: 10 },
  top: { display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  title: { fontSize: 13.5 },
  env: { fontSize: 11, fontWeight: 700, color: tokens.muted, textTransform: 'uppercase', letterSpacing: '0.05em' },
  flag: { fontSize: 12, fontWeight: 800, color: '#b45309', backgroundColor: '#fffbeb', borderWidth: 1, borderStyle: 'solid', borderColor: '#fde68a', borderRadius: 999, padding: '2px 10px', textDecoration: 'none' },
  sub: { fontSize: 12.5, color: tokens.muted, margin: '7px 0 0' },
  svcLink: { fontWeight: 700, color: tokens.ink, textDecoration: 'none' },
  foot: { display: 'flex', alignItems: 'center', gap: 8, marginTop: 9, flexWrap: 'wrap' },
  author: { fontSize: 12, color: tokens.muted },
  note: { fontSize: 12, color: '#92400e', backgroundColor: '#fffbeb', borderRadius: 6, padding: '3px 9px' },
});
