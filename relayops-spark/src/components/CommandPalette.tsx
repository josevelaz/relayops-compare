import * as React from 'react';
import * as stylex from '@stylexjs/stylex';
import { useNavigate } from '@tanstack/react-router';
import { ArrowRight, FileText, GitBranch, HeartPulse, Moon, Plus, Search, Users, Zap } from 'lucide-react';
import { tokens } from '../styles/tokens.stylex';
import { useApp } from '../data/store';
import { deployments, people, personById, serviceById, services, teamById, teams } from '../data/model';
import { Modal } from './ui';

interface Result {
  key: string;
  kind: string;
  title: string;
  sub: string;
  to: string;
  hint: string;
}

const KIND_COLOR: Record<string, string> = {
  Incident: '#dc2626', Service: '#059669', Team: '#7c3aed', Person: '#0284c7',
  Alert: '#d97706', Deployment: '#4f46e5', Postmortem: '#0d9488',
};

export function CommandPalette() {
  const { paletteOpen, paletteMode, paletteQuery, setPaletteQuery, closePalette, openCreate, ackAlert, incidents: liveIncidents, alerts: liveAlerts, postmortems: livePostmortems, addPostmortem } = useApp();
  const [mode, setMode] = React.useState<'search' | 'actions'>(paletteMode);
  const [index, setIndex] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (paletteOpen) {
      setMode(paletteMode);
      setIndex(0);
      setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [paletteOpen, paletteMode]);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  if (!paletteOpen) return null;

  const q = paletteQuery.trim().toLowerCase();
  const results: Result[] = [];
  if (mode === 'search') {
    if (q === '') {
      results.push({ key: 's1', kind: 'Incident', title: 'INC-1042 — Checkout failures after payment gateway deployment', sub: 'SEV1 · Investigating · Sarah Chen', to: '/incidents/INC-1042', hint: 'Active SEV1' });
      results.push({ key: 's2', kind: 'Service', title: 'Payment Gateway', sub: 'Payments · Tier 1 · Critical', to: '/services/payment-gateway', hint: 'Service' });
      results.push({ key: 's3', kind: 'Person', title: 'Sarah Chen', sub: 'Engineering Manager · Payments', to: '/teams/payments', hint: 'Person' });
    } else {
      for (const i of liveIncidents) {
        if (`${i.id} ${i.title} ${i.severity}`.toLowerCase().includes(q)) {
          results.push({ key: i.id, kind: 'Incident', title: `${i.id} — ${i.title}`, sub: `${i.severity} · ${i.status} · ${personById[i.commanderId]?.name ?? ''}`, to: `/incidents/${i.id}`, hint: i.status });
        }
      }
      for (const s of services) {
        if (`${s.name} ${teamById[s.teamId]?.name ?? ''}`.toLowerCase().includes(q)) {
          results.push({ key: s.id, kind: 'Service', title: s.name, sub: `${teamById[s.teamId]?.name} · ${s.tier} · ${s.health}`, to: `/services/${s.id}`, hint: 'Service' });
        }
      }
      for (const t of teams) {
        if (t.name.toLowerCase().includes(q)) results.push({ key: t.id, kind: 'Team', title: `${t.name} team`, sub: `${t.memberIds.length} members · lead ${personById[t.leadId]?.name}`, to: `/teams/${t.id}`, hint: 'Team' });
      }
      for (const p of people) {
        if (`${p.name} ${p.role}`.toLowerCase().includes(q)) results.push({ key: p.id, kind: 'Person', title: p.name, sub: `${p.role} · ${teamById[p.teamId]?.name}`, to: `/teams/${p.teamId}`, hint: 'Person' });
      }
      for (const a of liveAlerts) {
        if (`${a.id} ${a.name} ${serviceById[a.serviceId]?.name ?? ''}`.toLowerCase().includes(q)) {
          results.push({ key: a.id, kind: 'Alert', title: `${a.id} — ${a.name}`, sub: `${serviceById[a.serviceId]?.name} · ${a.state} · ${a.source}`, to: '/alerts', hint: a.state });
        }
      }
      for (const d of deployments) {
        if (`${d.version} ${d.commit} ${serviceById[d.serviceId]?.name ?? ''}`.toLowerCase().includes(q)) {
          results.push({ key: d.id, kind: 'Deployment', title: d.version, sub: `${serviceById[d.serviceId]?.name} · ${d.env} · ${d.status}`, to: '/deployments', hint: d.status });
        }
      }
      for (const p of livePostmortems) {
        if (`${p.title} ${p.id}`.toLowerCase().includes(q)) results.push({ key: p.id, kind: 'Postmortem', title: p.title, sub: `${p.status} · ${p.severity}`, to: `/postmortems/${p.id}`, hint: p.status });
      }
    }
  }

  const firing = liveAlerts.filter((a) => a.state === 'Firing');
  const actions = [
    { key: 'a-create', icon: Plus, label: 'Create incident', hint: 'Declare a new incident', run: () => { closePalette(); openCreate(); } },
    { key: 'a-search', icon: Search, label: 'Search across RelayOps', hint: 'Incidents, services, people…', run: () => setMode('search') },
    { key: 'a-ack', icon: Zap, label: firing.length ? `Acknowledge next firing alert (${firing[0].id})` : 'No firing alerts to acknowledge', hint: firing.length ? firing[0].name : 'All clear', run: () => { if (firing[0]) { ackAlert(firing[0].id); closePalette(); navigate({ to: '/alerts' }); } } },
    { key: 'a-svc', icon: HeartPulse, label: 'Jump to Payment Gateway', hint: 'Service detail', run: () => { closePalette(); navigate({ to: '/services/$serviceId', params: { serviceId: 'payment-gateway' } }); } },
    { key: 'a-oncall', icon: Moon, label: 'View on-call schedule', hint: 'Who is on now', run: () => { closePalette(); navigate({ to: '/on-call' }); } },
    { key: 'a-pm', icon: FileText, label: 'Create postmortem', hint: 'Start from INC-1042', run: () => { const id = addPostmortem('Untitled postmortem — INC-1042', 'INC-1042', 'sarah'); closePalette(); navigate({ to: `/postmortems/${id}` }); } },
    { key: 'a-dep', icon: GitBranch, label: 'Review latest deployments', hint: '3 in the last hour', run: () => { closePalette(); navigate({ to: '/deployments' }); } },
    { key: 'a-team', icon: Users, label: 'Open Payments team', hint: 'Roster & services', run: () => { closePalette(); navigate({ to: '/teams/$teamId', params: { teamId: 'payments' } }); } },
  ];

  const actionQuery = paletteQuery.trim().toLowerCase();
  const filteredActions = actions.filter(
    (a) => actionQuery === '' || a.label.toLowerCase().includes(actionQuery) || a.hint.toLowerCase().includes(actionQuery),
  );

  const list = mode === 'search' ? results : filteredActions;
  const clamped = Math.max(0, Math.min(index, list.length - 1));

  const go = (r: Result) => {
    closePalette();
    navigate({ to: r.to });
  };

  return (
    <Modal onClose={closePalette} labelledBy="cmdk-title" wide>
      <div {...stylex.props(pal.wrap)}>
        <div {...stylex.props(pal.tabs)}>
          <button {...stylex.props(pal.tab, mode === 'search' && pal.tabActive)} onClick={() => { setMode('search'); setIndex(0); }}>
            <Search size={13} /> Search
          </button>
          <button {...stylex.props(pal.tab, mode === 'actions' && pal.tabActive)} onClick={() => { setMode('actions'); setIndex(0); }}>
            <Zap size={13} /> Quick actions
          </button>
          <span id="cmdk-title" {...stylex.props(pal.kbdHint)}>↑↓ navigate · ↵ select · esc close</span>
        </div>
        <div {...stylex.props(pal.inputRow)}>
          {mode === 'search' ? <Search size={16} color="#64748b" /> : <Zap size={16} color="#64748b" />}
          <input
            ref={inputRef}
            value={paletteQuery}
            onChange={(e) => { setPaletteQuery(e.target.value); setIndex(0); }}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') { e.preventDefault(); setIndex((i) => Math.min(i + 1, list.length - 1)); }
              if (e.key === 'ArrowUp') { e.preventDefault(); setIndex((i) => Math.max(i - 1, 0)); }
              if (e.key === 'Enter') {
                const item = list[clamped] as Result | undefined;
                if (item && 'to' in item) go(item as Result);
                else if (item) (item as unknown as { run: () => void }).run();
              }
            }}
            placeholder={mode === 'search' ? 'Try "payment", "INC-1042", "Sarah Chen"…' : 'Type to filter actions…'}
            aria-label={mode === 'search' ? 'Global search' : 'Quick actions'}
            {...stylex.props(pal.input)}
          />
        </div>
        <div {...stylex.props(pal.list)} role="listbox" aria-label={mode === 'search' ? 'Search results' : 'Quick actions'}>
          {mode === 'search' && list.length === 0 && (
            <p {...stylex.props(pal.empty)}>No matches for “{paletteQuery}”. Try “payment”, “INC-1042” or “Sarah Chen”.</p>
          )}
          {mode === 'search' &&
            (list as Result[]).map((r, i) => (
              <button key={r.key} role="option" aria-selected={i === clamped} {...stylex.props(pal.row, i === clamped && pal.rowActive)} onMouseEnter={() => setIndex(i)} onClick={() => go(r)}>
                <span {...stylex.props(pal.kind)} style={{ backgroundColor: `${KIND_COLOR[r.kind]}1a`, color: KIND_COLOR[r.kind] }}>{r.kind}</span>
                <span {...stylex.props(pal.rowMain)}>
                  <span {...stylex.props(pal.rowTitle)}>{r.title}</span>
                  <span {...stylex.props(pal.rowSub)}>{r.sub}</span>
                </span>
                <span {...stylex.props(pal.rowHint)}>{r.hint}</span>
                <ArrowRight size={14} color="#94a3b8" />
              </button>
            ))}
          {mode === 'actions' &&
            filteredActions.map((a, i) => (
                <button key={a.key} role="option" aria-selected={i === clamped} {...stylex.props(pal.row, i === clamped && pal.rowActive)} onMouseEnter={() => setIndex(i)} onClick={a.run}>
                  <span {...stylex.props(pal.actIcon)}><a.icon size={15} /></span>
                  <span {...stylex.props(pal.rowMain)}>
                    <span {...stylex.props(pal.rowTitle)}>{a.label}</span>
                    <span {...stylex.props(pal.rowSub)}>{a.hint}</span>
                  </span>
                  <ArrowRight size={14} color="#94a3b8" />
                </button>
              ))}
        </div>
        <div {...stylex.props(pal.foot)}>
          <span>Tip: press <kbd {...stylex.props(pal.kbd)}>C</kbd> anywhere to declare an incident.</span>
        </div>
      </div>
    </Modal>
  );
}

const pal = stylex.create({
  wrap: { padding: 0 },
  tabs: { display: 'flex', alignItems: 'center', gap: 6, padding: '12px 16px 0' },
  tab: { display: 'inline-flex', alignItems: 'center', gap: 6, borderWidth: 1, borderStyle: 'solid', borderColor: tokens.line, backgroundColor: '#fff', borderRadius: 999, padding: '5px 12px', fontSize: 12, fontWeight: 700, color: tokens.muted, cursor: 'pointer' },
  tabActive: { backgroundColor: tokens.sidebar, color: '#fff', borderColor: tokens.sidebar },
  kbdHint: { marginLeft: 'auto', fontSize: 11, color: tokens.faint },
  inputRow: { display: 'flex', alignItems: 'center', gap: 10, padding: '12px 18px', borderBottomWidth: 1, borderBottomStyle: 'solid', borderBottomColor: tokens.line },
  input: { borderWidth: 0, flex: 1, fontSize: 15, color: tokens.ink, backgroundColor: 'transparent' },
  list: { maxHeight: 380, overflowY: 'auto', padding: 8 },
  row: { display: 'flex', alignItems: 'center', gap: 10, width: '100%', textAlign: 'left', borderWidth: 0, backgroundColor: 'transparent', padding: '9px 10px', borderRadius: 9, cursor: 'pointer' },
  rowActive: { backgroundColor: '#eef2ff' },
  kind: { fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', padding: '3px 8px', borderRadius: 999, flexShrink: 0 },
  rowMain: { flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 1 },
  rowTitle: { fontSize: 13, fontWeight: 600, color: tokens.ink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  rowSub: { fontSize: 12, color: tokens.muted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  rowHint: { fontSize: 11, color: tokens.faint, flexShrink: 0 },
  actIcon: { width: 30, height: 30, borderRadius: 8, backgroundColor: tokens.accentSoft, color: tokens.accentInk, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  empty: { fontSize: 13, color: tokens.muted, padding: '18px 12px', margin: 0 },
  foot: { borderTopWidth: 1, borderTopStyle: 'solid', borderTopColor: tokens.line, padding: '10px 18px', fontSize: 12, color: tokens.muted },
  kbd: { fontFamily: 'inherit', backgroundColor: '#f1f5f9', borderWidth: 1, borderStyle: 'solid', borderColor: tokens.line, borderRadius: 5, padding: '0 6px', fontSize: 11 },
});


