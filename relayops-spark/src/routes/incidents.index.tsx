import * as React from 'react';
import * as stylex from '@stylexjs/stylex';
import { createFileRoute, Link } from '@tanstack/react-router';
import { ArrowUpDown, LayoutGrid, List, Plus, Search } from 'lucide-react';
import { tokens } from '../styles/tokens.stylex';
import { useApp } from '../data/store';
import { personById, serviceById, type Incident, type IncidentStatus, type Severity } from '../data/model';
import { AvatarStack, Button, EmptyNote, SevBadge, StatusBadge, card, type } from '../components/ui';

export const Route = createFileRoute('/incidents/')({
  component: IncidentListPage,
});

type GroupMode = 'status' | 'severity' | 'none';
type SortKey = 'severity' | 'recent' | 'duration';

const SEV_ORDER: Record<Severity, number> = { SEV0: 0, SEV1: 1, SEV2: 2, SEV3: 3 };

function IncidentListPage() {
  const { incidents, openCreate } = useApp();
  const [q, setQ] = React.useState('');
  const [sevs, setSevs] = React.useState<Severity[]>([]);
  const [statuses, setStatuses] = React.useState<IncidentStatus[]>([]);
  const [scope, setScope] = React.useState<'active' | 'resolved' | 'all'>('active');
  const [group, setGroup] = React.useState<GroupMode>('status');
  const [sort, setSort] = React.useState<SortKey>('severity');

  const filtered = React.useMemo(() => {
    let list = [...incidents];
    if (scope === 'active') list = list.filter((i) => i.status !== 'Resolved');
    if (scope === 'resolved') list = list.filter((i) => i.status === 'Resolved');
    if (sevs.length) list = list.filter((i) => sevs.includes(i.severity));
    if (statuses.length) list = list.filter((i) => statuses.includes(i.status));
    const needle = q.trim().toLowerCase();
    if (needle) {
      list = list.filter((i) =>
        `${i.id} ${i.title} ${personById[i.commanderId]?.name ?? ''} ${i.serviceIds.map((s) => serviceById[s]?.name ?? '').join(' ')}`.toLowerCase().includes(needle),
      );
    }
    list.sort((a, b) => {
      if (sort === 'severity') return SEV_ORDER[a.severity] - SEV_ORDER[b.severity];
      if (sort === 'recent') return b.startedAt.localeCompare(a.startedAt);
      return b.durationLabel.localeCompare(a.durationLabel);
    });
    return list;
  }, [incidents, q, sevs, statuses, scope, sort]);

  const toggle = <T,>(list: T[], v: T, set: (x: T[]) => void) =>
    set(list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

  const groups: { name: string; items: Incident[] }[] = React.useMemo(() => {
    if (group === 'none') return [{ name: '', items: filtered }];
    const key = group === 'status' ? (i: Incident) => i.status : (i: Incident) => i.severity;
    const order = group === 'status' ? ['Investigating', 'Identified', 'Monitoring', 'Resolved'] : ['SEV0', 'SEV1', 'SEV2', 'SEV3'];
    return order
      .map((name) => ({ name, items: filtered.filter((i) => key(i) === name) }))
      .filter((g) => g.items.length > 0);
  }, [filtered, group]);

  return (
    <div {...stylex.props(pg.wrap)}>
      <div {...stylex.props(pg.head)}>
        <div>
          <h1 {...stylex.props(type.h1)}>Incidents</h1>
          <p {...stylex.props(type.sub)} style={{ marginTop: 4 }}>
            {filtered.length} shown · {incidents.filter((i) => i.status !== 'Resolved').length} active across 12 services
          </p>
        </div>
        <Button tone="primary" onClick={() => openCreate()}><Plus size={15} /> New incident</Button>
      </div>

      <div {...stylex.props(toolbar.bar)} role="search">
        <div {...stylex.props(toolbar.search)}>
          <Search size={15} color="#64748b" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search ID, title, commander, service…" aria-label="Search incidents" {...stylex.props(toolbar.input)} />
        </div>
        <div role="tablist" aria-label="Scope" {...stylex.props(toolbar.scope)}>
          {(['active', 'resolved', 'all'] as const).map((s) => (
            <button key={s} role="tab" aria-selected={scope === s} onClick={() => setScope(s)} {...stylex.props(toolbar.scopeBtn, scope === s && toolbar.scopeOn)}>
              {s === 'active' ? 'Active' : s === 'resolved' ? 'Resolved' : 'All'}
            </button>
          ))}
        </div>
      </div>

      <div {...stylex.props(toolbar.filters)}>
        <FilterGroup label="Severity" options={['SEV0', 'SEV1', 'SEV2', 'SEV3'] as Severity[]} selected={sevs} onToggle={(v) => toggle(sevs, v, setSevs)} />
        <FilterGroup label="Status" options={['Investigating', 'Identified', 'Monitoring', 'Resolved'] as IncidentStatus[]} selected={statuses} onToggle={(v) => toggle(statuses, v, setStatuses)} />
        <div {...stylex.props(toolbar.spacer)} />
        <label {...stylex.props(toolbar.selectWrap)}>
          <ArrowUpDown size={13} color="#64748b" />
          <span className="sr-only">Sort incidents</span>
          <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)} aria-label="Sort incidents" {...stylex.props(toolbar.select)}>
            <option value="severity">Sort: Severity</option>
            <option value="recent">Sort: Most recent</option>
            <option value="duration">Sort: Duration</option>
          </select>
        </label>
        <div role="group" aria-label="Grouping" {...stylex.props(toolbar.group)}>
          <LayoutGrid size={13} color="#64748b" />
          {(['status', 'severity', 'none'] as GroupMode[]).map((g) => (
            <button key={g} aria-pressed={group === g} onClick={() => setGroup(g)} {...stylex.props(toolbar.groupBtn, group === g && toolbar.groupOn)}>
              {g === 'none' ? <List size={13} /> : g}
            </button>
          ))}
        </div>
        {(sevs.length > 0 || statuses.length > 0 || q !== '') && (
          <button onClick={() => { setSevs([]); setStatuses([]); setQ(''); }} {...stylex.props(toolbar.clear)}>Clear</button>
        )}
      </div>

      {groups.map((g) => (
        <section key={g.name || 'all'} aria-label={g.name || 'Incidents'}>
          {g.name && <h2 {...stylex.props(pg.groupTitle)}>{g.name} <span {...stylex.props(pg.groupCount)}>{g.items.length}</span></h2>}
          <div {...stylex.props(card.base)}>
            <div {...stylex.props(table.head)} aria-hidden>
              <span>Incident</span><span>Services</span><span>Commander</span><span>Age</span><span>Status</span>
            </div>
            {g.items.map((i) => (
              <Link key={i.id} to="/incidents/$incidentId" params={{ incidentId: i.id }} {...stylex.props(table.row)}>
                <span {...stylex.props(table.cellMain)}>
                  <SevBadge sev={i.severity} pulse={i.severity === 'SEV1' && i.status !== 'Resolved'} />
                  <span {...stylex.props(table.titleWrap)}>
                    <span {...stylex.props(table.title)}><span {...stylex.props(table.id)}>{i.id}</span> {i.title}</span>
                    <span {...stylex.props(table.sub)}>{i.durationLabel} · {i.startedLabel} · {i.responderIds.length + 1} responders</span>
                  </span>
                </span>
                <span {...stylex.props(table.cell)}>{i.serviceIds.slice(0, 2).map((s) => serviceById[s]?.name).join(', ')}{i.serviceIds.length > 2 ? ` +${i.serviceIds.length - 2}` : ''}</span>
                <span {...stylex.props(table.cell)}>
                  <span {...stylex.props(table.cmd)}><AvatarStack ids={[i.commanderId, ...i.responderIds.slice(0, 2)]} size="sm" /> {personById[i.commanderId]?.name.split(' ')[0]}</span>
                </span>
                <span {...stylex.props(table.cellMuted)}>{i.durationLabel}</span>
                <span {...stylex.props(table.cell)}><StatusBadge status={i.status} /></span>
              </Link>
            ))}
          </div>
        </section>
      ))}
      {filtered.length === 0 && (
        <div {...stylex.props(card.base, card.pad)}>
          <EmptyNote>No incidents match these filters. Try clearing severity or status filters.</EmptyNote>
        </div>
      )}
      <p {...stylex.props(pg.hint)}>Tip: active and resolved work stay separated — the <strong>Active</strong> tab only shows incidents that need a commander right now.</p>
    </div>
  );
}

function FilterGroup<T extends string>({ label, options, selected, onToggle }: { label: string; options: readonly T[]; selected: T[]; onToggle: (v: T) => void }) {
  return (
    <div role="group" aria-label={label} {...stylex.props(fg.wrap)}>
      <span {...stylex.props(fg.label)}>{label}</span>
      {options.map((o) => (
        <button key={o} aria-pressed={selected.includes(o)} onClick={() => onToggle(o)} {...stylex.props(fg.btn, selected.includes(o) && fg.on)}>
          {o}
        </button>
      ))}
    </div>
  );
}

const pg = stylex.create({
  wrap: { display: 'flex', flexDirection: 'column', gap: 14 },
  head: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 },
  groupTitle: { fontSize: 13, fontWeight: 800, color: tokens.ink, margin: '6px 2px 8px', textTransform: 'uppercase', letterSpacing: '0.05em' },
  groupCount: { color: tokens.muted, fontWeight: 700 },
  hint: { fontSize: 12, color: tokens.muted, margin: 0 },
});

const toolbar = stylex.create({
  bar: { display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' },
  search: { display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 220, backgroundColor: '#fff', borderWidth: 1, borderStyle: 'solid', borderColor: tokens.line, borderRadius: 9, padding: '8px 12px' },
  input: { borderWidth: 0, flex: 1, fontSize: 13, backgroundColor: 'transparent', color: tokens.ink },
  scope: { display: 'flex', backgroundColor: '#e8edf5', borderRadius: 9, padding: 3, gap: 2 },
  scopeBtn: { borderWidth: 0, backgroundColor: 'transparent', borderRadius: 7, padding: '6px 14px', fontSize: 12, fontWeight: 700, color: tokens.muted, cursor: 'pointer', textTransform: 'capitalize' },
  scopeOn: { backgroundColor: '#fff', color: tokens.ink, boxShadow: '0 1px 3px rgba(15,23,42,0.12)' },
  filters: { display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' },
  spacer: { flex: 1 },
  selectWrap: { display: 'inline-flex', alignItems: 'center', gap: 6, backgroundColor: '#fff', borderWidth: 1, borderStyle: 'solid', borderColor: tokens.line, borderRadius: 8, padding: '6px 10px' },
  select: { borderWidth: 0, backgroundColor: 'transparent', fontSize: 12, fontWeight: 600, color: tokens.ink2 },
  group: { display: 'inline-flex', alignItems: 'center', gap: 4, backgroundColor: '#fff', borderWidth: 1, borderStyle: 'solid', borderColor: tokens.line, borderRadius: 8, padding: '4px 6px' },
  groupBtn: { borderWidth: 0, backgroundColor: 'transparent', borderRadius: 6, padding: '4px 9px', fontSize: 12, fontWeight: 700, color: tokens.muted, cursor: 'pointer', textTransform: 'capitalize' },
  groupOn: { backgroundColor: tokens.accentSoft, color: tokens.accentInk },
  clear: { borderWidth: 0, backgroundColor: 'transparent', color: tokens.accent, fontWeight: 700, fontSize: 12, cursor: 'pointer' },
});

const fg = stylex.create({
  wrap: { display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
  label: { fontSize: 11, fontWeight: 800, color: tokens.muted, textTransform: 'uppercase', letterSpacing: '0.06em', marginRight: 2 },
  btn: { borderWidth: 1, borderStyle: 'solid', borderColor: tokens.lineStrong, backgroundColor: '#fff', borderRadius: 999, padding: '4px 11px', fontSize: 12, fontWeight: 600, color: tokens.ink2, cursor: 'pointer' },
  on: { backgroundColor: tokens.sidebar, color: '#fff', borderColor: tokens.sidebar },
});

const table = stylex.create({
  head: {
    display: 'grid', gridTemplateColumns: { default: 'minmax(0,2.2fr) 1fr 1fr 90px 150px', '@media (max-width: 900px)': 'minmax(0,1fr) 130px' },
    gap: 10, padding: '10px 18px', fontSize: 11, fontWeight: 800, color: tokens.muted,
    textTransform: 'uppercase', letterSpacing: '0.06em', borderBottomWidth: 1, borderBottomStyle: 'solid', borderBottomColor: tokens.line,
  },
  row: {
    display: 'grid', gridTemplateColumns: { default: 'minmax(0,2.2fr) 1fr 1fr 90px 150px', '@media (max-width: 900px)': 'minmax(0,1fr) 130px' },
    gap: 10, padding: '12px 18px', alignItems: 'center', textDecoration: 'none',
    borderBottomWidth: 1, borderBottomStyle: 'solid', borderBottomColor: '#f1f5f9',
    ':hover': { backgroundColor: tokens.surface2 },
  },
  cellMain: { display: 'flex', gap: 10, alignItems: 'flex-start', minWidth: 0 },
  titleWrap: { display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 },
  title: { fontSize: 13.5, fontWeight: 600, color: tokens.ink, lineHeight: 1.4 },
  id: { fontFamily: 'ui-monospace, Menlo, monospace', fontSize: 12, color: tokens.muted, fontWeight: 700 },
  sub: { fontSize: 12, color: tokens.muted },
  cell: { fontSize: 12.5, color: tokens.ink2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: { default: 'block', '@media (max-width: 900px)': 'none' } },
  cellMuted: { fontSize: 12.5, color: tokens.muted, display: { default: 'block', '@media (max-width: 900px)': 'none' } },
  cmd: { display: 'inline-flex', alignItems: 'center', gap: 7 },
});


