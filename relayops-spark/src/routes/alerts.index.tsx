import * as React from 'react';
import * as stylex from '@stylexjs/stylex';
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { CheckCircle2, Plus, Search, UserPlus } from 'lucide-react';
import { tokens } from '../styles/tokens.stylex';
import { useApp } from '../data/store';
import { incidentById, people, personById, serviceById, type Alert, type AlertState, type Severity } from '../data/model';
import { Avatar, Button, EmptyNote, SevBadge, Tag, card, type } from '../components/ui';

export const Route = createFileRoute('/alerts/')({
  component: AlertsPage,
});

const SEV_ORDER: Record<Severity, number> = { SEV0: 0, SEV1: 1, SEV2: 2, SEV3: 3 };

function AlertsPage() {
  const { alerts, ackAlert, resolveAlert, assignAlert, createIncidentFromAlert } = useApp();
  const navigate = useNavigate();
  const [q, setQ] = React.useState('');
  const [states, setStates] = React.useState<AlertState[]>(['Firing', 'Acknowledged']);
  const [sevs, setSevs] = React.useState<Severity[]>([]);
  const [source, setSource] = React.useState('all');
  const [assignFor, setAssignFor] = React.useState<string | null>(null);
  const [flash, setFlash] = React.useState('');

  const firing = alerts.filter((a) => a.state === 'Firing').length;

  const filtered = React.useMemo(() => {
    let list = [...alerts];
    list = list.filter((a) => states.includes(a.state));
    if (sevs.length) list = list.filter((a) => sevs.includes(a.severity));
    if (source !== 'all') list = list.filter((a) => a.source === source);
    const needle = q.trim().toLowerCase();
    if (needle) list = list.filter((a) => `${a.id} ${a.name} ${serviceById[a.serviceId]?.name ?? ''}`.toLowerCase().includes(needle));
    return list.sort((a, b) => SEV_ORDER[a.severity] - SEV_ORDER[b.severity]);
  }, [alerts, states, sevs, source, q]);

  const toggle = <T,>(list: T[], v: T, set: (x: T[]) => void) => set(list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

  const say = (m: string) => { setFlash(m); setTimeout(() => setFlash(''), 3000); };

  return (
    <div {...stylex.props(pg.wrap)}>
      <div {...stylex.props(pg.head)}>
        <div>
          <h1 {...stylex.props(type.h1)}>Alerts</h1>
          <p {...stylex.props(type.sub)} style={{ marginTop: 4 }}>{firing} firing · {alerts.filter((a) => a.state === 'Acknowledged').length} acknowledged · noise grouped by service below</p>
        </div>
      </div>

      <div {...stylex.props(noise.box)} aria-label="Alert noise summary">
        <div {...stylex.props(noise.cell)}><span {...stylex.props(noise.num)}>{firing}</span><span {...stylex.props(noise.lab)}>Firing now</span></div>
        <div {...stylex.props(noise.cell)}><span {...stylex.props(noise.num)}>22</span><span {...stylex.props(noise.lab)}>Last 24h total</span></div>
        <div {...stylex.props(noise.cell)}><span {...stylex.props(noise.num)}>Payment Gateway</span><span {...stylex.props(noise.lab)}>Noisiest service · 24 alerts/7d</span></div>
        <div {...stylex.props(noise.cell)}><span {...stylex.props(noise.num, noise.urgent)}>3 × SEV1</span><span {...stylex.props(noise.lab)}>Checkout & gateway firing</span></div>
      </div>

      <div {...stylex.props(toolbar.bar)}>
        <div {...stylex.props(toolbar.search)}>
          <Search size={15} color="#64748b" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search alerts, services…" aria-label="Search alerts" {...stylex.props(toolbar.input)} />
        </div>
        <div role="group" aria-label="State filter" {...stylex.props(toolbar.group)}>
          {(['Firing', 'Acknowledged', 'Resolved'] as AlertState[]).map((s) => (
            <button key={s} aria-pressed={states.includes(s)} onClick={() => toggle(states, s, setStates)} {...stylex.props(toolbar.pill, states.includes(s) && toolbar.pillOn)}>{s}</button>
          ))}
        </div>
        <select value={source} onChange={(e) => setSource(e.target.value)} aria-label="Filter by source" {...stylex.props(toolbar.select)}>
          <option value="all">All sources</option>
          <option>Datadog</option><option>Grafana</option><option>CloudWatch</option><option>Sentry</option><option>Custom</option>
        </select>
      </div>
      <div role="group" aria-label="Severity filter" {...stylex.props(toolbar.group)}>
        <span {...stylex.props(toolbar.lab)}>Severity</span>
        {(['SEV0', 'SEV1', 'SEV2', 'SEV3'] as Severity[]).map((s) => (
          <button key={s} aria-pressed={sevs.includes(s)} onClick={() => toggle(sevs, s, setSevs)} {...stylex.props(toolbar.pill, sevs.includes(s) && toolbar.pillOn)}>{s}</button>
        ))}
        {(sevs.length > 0 || q !== '') && <button onClick={() => { setSevs([]); setQ(''); }} {...stylex.props(toolbar.clear)}>Clear</button>}
      </div>

      {flash && <p role="status" {...stylex.props(pg.flash)}>{flash}</p>}

      <div {...stylex.props(card.base)}>
        <div {...stylex.props(table.head)} aria-hidden>
          <span>Alert</span><span>Service</span><span>State</span><span>Assignee</span><span>Actions</span>
        </div>
        {filtered.map((a) => (
          <AlertRow
            key={a.id} alert={a}
            onAck={() => { ackAlert(a.id); say(`${a.id} acknowledged.`); }}
            onResolve={() => { resolveAlert(a.id); say(`${a.id} resolved.`); }}
            onAssign={() => setAssignFor(a.id)}
            onIncident={() => {
              if (a.incidentId) navigate({ to: `/incidents/${a.incidentId}` });
              else { const id = createIncidentFromAlert(a.id); say(`Incident ${id} created from ${a.id}.`); navigate({ to: `/incidents/${id}` }); }
            }}
          />
        ))}
      </div>
      {filtered.length === 0 && <div {...stylex.props(card.base, card.pad)}><EmptyNote>No alerts match. Widen the state filter to include resolved alerts.</EmptyNote></div>}

      {assignFor && (
        <AssignSheet
          alertId={assignFor}
          onPick={(pid) => { assignAlert(assignFor, pid); setAssignFor(null); say(`Alert assigned to ${personById[pid]?.name}.`); }}
          onClose={() => setAssignFor(null)}
        />
      )}
    </div>
  );
}

function AlertRow({ alert: a, onAck, onResolve, onAssign, onIncident }: { alert: Alert; onAck: () => void; onResolve: () => void; onAssign: () => void; onIncident: () => void }) {
  const svc = serviceById[a.serviceId];
  return (
    <div {...stylex.props(table.row)}>
      <span {...stylex.props(table.main)}>
        <SevBadge sev={a.severity} pulse={a.state === 'Firing' && (a.severity === 'SEV1' || a.severity === 'SEV0')} />
        <span {...stylex.props(table.titleWrap)}>
          <span {...stylex.props(table.title)}>{a.id} — {a.name}</span>
          <span {...stylex.props(table.sub)}>{a.source} · {a.triggeredLabel} · {a.durationLabel} · {a.value}</span>
        </span>
      </span>
      <span {...stylex.props(table.cell)}>{svc?.name}</span>
      <span {...stylex.props(table.cell)}><StateTag state={a.state} /></span>
      <span {...stylex.props(table.cell)}>{a.assigneeId ? <span {...stylex.props(table.assignee)}><Avatar personId={a.assigneeId} size="sm" /> {personById[a.assigneeId]?.name.split(' ')[0]}</span> : <span {...stylex.props(table.unassigned)}>Unassigned</span>}</span>
      <span {...stylex.props(table.actions)}>
        {a.state === 'Firing' && <button onClick={onAck} {...stylex.props(act.btn)}>Ack</button>}
        {a.state !== 'Resolved' && <button onClick={onResolve} {...stylex.props(act.btn)}><CheckCircle2 size={12} /> Resolve</button>}
        <button onClick={onAssign} {...stylex.props(act.btn)} aria-label={`Assign ${a.id}`}><UserPlus size={12} /></button>
        <button onClick={onIncident} {...stylex.props(act.primary)}>{a.incidentId ? (incidentById[a.incidentId] ? a.incidentId : 'Incident') : <><Plus size={12} /> Incident</>}</button>
      </span>
      {a.incidentId && (
        <Link to="/incidents/$incidentId" params={{ incidentId: a.incidentId }} {...stylex.props(table.linkRow)}>Linked to {a.incidentId} — open incident →</Link>
      )}
    </div>
  );
}

function StateTag({ state }: { state: AlertState }) {
  if (state === 'Firing') return <Tag tone="dark">Firing</Tag>;
  if (state === 'Acknowledged') return <Tag tone="violet">Acknowledged</Tag>;
  return <Tag>Resolved</Tag>;
}

function AssignSheet({ alertId, onPick, onClose }: { alertId: string; onPick: (pid: string) => void; onClose: () => void }) {
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);
  return (
    <div {...stylex.props(sheet.scrim)} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div role="dialog" aria-modal="true" aria-label={`Assign ${alertId}`} {...stylex.props(sheet.box)}>
        <h2 {...stylex.props(type.h2)}>Assign {alertId}</h2>
        <div {...stylex.props(sheet.list)}>
          {people.slice(0, 8).map((p) => (
            <button key={p.id} onClick={() => onPick(p.id)} {...stylex.props(sheet.row)}>
              <Avatar personId={p.id} size="sm" /><span><strong>{p.name}</strong><br /><span {...stylex.props(sheet.sub)}>{p.role}</span></span>
            </button>
          ))}
        </div>
        <Button tone="ghost" onClick={onClose}>Cancel</Button>
      </div>
    </div>
  );
}

const pg = stylex.create({
  wrap: { display: 'flex', flexDirection: 'column', gap: 14 },
  head: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 },
  flash: { margin: 0, fontSize: 12, fontWeight: 700, color: tokens.ok, backgroundColor: tokens.okSoft, borderRadius: 8, padding: '8px 12px' },
});

const noise = stylex.create({
  box: { display: 'grid', gridTemplateColumns: { default: 'repeat(4, 1fr)', '@media (max-width: 760px)': 'repeat(2, 1fr)' }, gap: 10, backgroundColor: tokens.sidebar, borderRadius: 12, padding: 16 },
  cell: { display: 'flex', flexDirection: 'column', gap: 2 },
  num: { fontSize: 18, fontWeight: 800, color: '#fff' },
  urgent: { color: '#f87171' },
  lab: { fontSize: 11, color: tokens.sidebarMuted },
});

const toolbar = stylex.create({
  bar: { display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' },
  search: { display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 200, backgroundColor: '#fff', borderWidth: 1, borderStyle: 'solid', borderColor: tokens.line, borderRadius: 9, padding: '8px 12px' },
  input: { borderWidth: 0, flex: 1, fontSize: 13, backgroundColor: 'transparent', color: tokens.ink },
  group: { display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
  lab: { fontSize: 11, fontWeight: 800, color: tokens.muted, textTransform: 'uppercase', letterSpacing: '0.06em' },
  pill: { borderWidth: 1, borderStyle: 'solid', borderColor: tokens.lineStrong, backgroundColor: '#fff', borderRadius: 999, padding: '5px 12px', fontSize: 12, fontWeight: 600, color: tokens.ink2, cursor: 'pointer' },
  pillOn: { backgroundColor: tokens.sidebar, color: '#fff', borderColor: tokens.sidebar },
  select: { borderWidth: 1, borderStyle: 'solid', borderColor: tokens.line, borderRadius: 8, padding: '7px 10px', fontSize: 12, fontWeight: 600, backgroundColor: '#fff', color: tokens.ink2 },
  clear: { borderWidth: 0, backgroundColor: 'transparent', color: tokens.accent, fontWeight: 700, fontSize: 12, cursor: 'pointer' },
});

const table = stylex.create({
  head: { display: 'grid', gridTemplateColumns: { default: 'minmax(0,2fr) 150px 130px 140px 210px', '@media (max-width: 1024px)': 'minmax(0,1fr) 190px' }, gap: 10, padding: '10px 18px', fontSize: 11, fontWeight: 800, color: tokens.muted, textTransform: 'uppercase', letterSpacing: '0.06em', borderBottomWidth: 1, borderBottomStyle: 'solid', borderBottomColor: tokens.line },
  row: { display: 'grid', gridTemplateColumns: { default: 'minmax(0,2fr) 150px 130px 140px 210px', '@media (max-width: 1024px)': 'minmax(0,1fr) 190px' }, gap: 10, padding: '12px 18px', alignItems: 'center', borderBottomWidth: 1, borderBottomStyle: 'solid', borderBottomColor: '#f1f5f9' },
  main: { display: 'flex', gap: 10, alignItems: 'flex-start', minWidth: 0 },
  titleWrap: { display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 },
  title: { fontSize: 13, fontWeight: 700, color: tokens.ink, lineHeight: 1.4 },
  sub: { fontSize: 12, color: tokens.muted },
  cell: { fontSize: 12.5, color: tokens.ink2, display: { default: 'block', '@media (max-width: 1024px)': 'none' } },
  assignee: { display: 'inline-flex', alignItems: 'center', gap: 6, fontWeight: 600 },
  unassigned: { color: tokens.faint, fontStyle: 'italic' },
  actions: { display: 'flex', gap: 6, flexWrap: 'wrap', gridColumn: { default: 'auto', '@media (max-width: 1024px)': '2' } },
  linkRow: { gridColumn: '1 / -1', fontSize: 12, fontWeight: 700, color: tokens.accent, textDecoration: 'none' },
});

const act = stylex.create({
  btn: { display: 'inline-flex', alignItems: 'center', gap: 4, borderWidth: 1, borderStyle: 'solid', borderColor: tokens.lineStrong, backgroundColor: '#fff', borderRadius: 7, padding: '5px 10px', fontSize: 12, fontWeight: 700, color: tokens.ink2, cursor: 'pointer', ':hover': { backgroundColor: tokens.surface2 } },
  primary: { display: 'inline-flex', alignItems: 'center', gap: 4, borderWidth: 1, borderStyle: 'solid', borderColor: tokens.accent, backgroundColor: tokens.accentSoft, borderRadius: 7, padding: '5px 10px', fontSize: 12, fontWeight: 700, color: tokens.accentInk, cursor: 'pointer' },
});

const sheet = stylex.create({
  scrim: { position: 'fixed', top: 0, right: 0, bottom: 0, left: 0, backgroundColor: 'rgba(15,23,42,0.5)', zIndex: 90, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 },
  box: { backgroundColor: '#fff', borderRadius: 12, padding: 18, width: '100%', maxWidth: 360, display: 'flex', flexDirection: 'column', gap: 10 },
  list: { display: 'flex', flexDirection: 'column', gap: 2, maxHeight: 320, overflowY: 'auto' },
  row: { display: 'flex', gap: 10, alignItems: 'center', borderWidth: 0, backgroundColor: 'transparent', padding: '8px', borderRadius: 8, cursor: 'pointer', textAlign: 'left', fontSize: 13, ':hover': { backgroundColor: tokens.surface2 } },
  sub: { fontSize: 12, color: tokens.muted },
});
