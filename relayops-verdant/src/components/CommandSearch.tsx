import * as stylex from '@stylexjs/stylex';
import { useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowUp, Bell, Box, CornerDownLeft, FileText, GitBranch, Plus, Search, ShieldAlert, Users, Zap, type LucideIcon } from 'lucide-react';
import { people, services, teams, deployments } from '../data/model';
import { useStore } from '../state/store';
import { useActions } from '../state/actions';
import { Badge, Modal, ui } from './ui';
type Result = { id: string; title: string; type: string; subtitle: string; icon: LucideIcon; path?: string; keywords?: string; action?: () => void };
const s = stylex.create({ input: { border: 0, outline: 'none', fontSize: 17, color: '#273b40', width: '100%', backgroundColor: 'transparent' }, inputRow: { display: 'flex', alignItems: 'center', gap: 13, paddingBottom: 20, borderBottom: '1px solid #e8eded', color: '#7c8a8e' }, results: { display: 'flex', flexDirection: 'column', gap: 3, marginTop: 13, maxHeight: '52dvh', overflowY: 'auto' }, result: { display: 'flex', alignItems: 'center', gap: 12, width: '100%', border: 0, borderRadius: 7, backgroundColor: { default: 'transparent', ':hover': '#f1f7f4' }, textAlign: 'left', padding: '12px 10px', color: '#657971' }, active: { backgroundColor: '#edf6f1' }, foot: { fontSize: 10, color: '#84918e', display: 'flex', alignItems: 'center', gap: 15 }, resultTitle: { color: '#2e413c', fontSize: 12, fontWeight: 550 } });
export function CommandSearch({ initialQuery, onClose }: { initialQuery: string; onClose: () => void }) {
  const { data, setData, notify } = useStore();
  const { go, createIncident } = useActions();
  const [query, setQuery] = useState(initialQuery);
  const [selected, setSelected] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);
  const quick: Result[] = [
    { id: 'q1', title: 'Create incident', type: 'Action', subtitle: 'Start an incident response', icon: Plus, action: () => createIncident() },
    { id: 'q2', title: 'Acknowledge next urgent alert', type: 'Action', subtitle: `${data.alerts.filter(a => a.state === 'Firing').length} alerts need triage`, icon: Bell, action: () => {
      const alert = data.alerts.filter(a => a.state === 'Firing').sort((a, b) => a.severity.localeCompare(b.severity))[0];
      if (alert) {
        setData(d => ({ ...d, alerts: d.alerts.map(a => a.id === alert.id ? { ...a, state: 'Acknowledged', assignee: 'Alex Morgan' } : a) }));
        notify(`${alert.id} acknowledged and assigned to you`);
        go('/alerts');
      } else notify('All alerts are acknowledged');
    } },
    { id: 'q3', title: 'Jump to service', type: 'Action', subtitle: 'Browse the service catalog', icon: Box, path: '/services' },
    { id: 'q4', title: 'View on-call schedule', type: 'Action', subtitle: 'Find the right engineer', icon: Users, path: '/on-call' },
    { id: 'q5', title: 'Create postmortem', type: 'Action', subtitle: 'Start a structured incident review', icon: FileText, path: '/postmortems/new' },
  ];
  const resources: Result[] = [
    ...data.incidents.map(i => ({ id: i.id, title: `${i.id} · ${i.title}`, type: 'Incident', subtitle: `${i.severity} · ${i.status} · ${i.commander}`, icon: ShieldAlert, path: `/incidents/${i.id}` })),
    ...services.map(s => ({ id: s.slug, title: s.name, type: 'Service', subtitle: `${s.team} · Tier ${s.tier}`, icon: Box, path: `/services/${s.slug}` })),
    ...teams.map(t => ({ id: `team-${t.slug}`, title: t.name, type: 'Team', subtitle: `${t.members.length} members · Led by ${t.lead}`, icon: Users, path: `/teams/${t.slug}` })),
    ...people.map(p => ({ id: p.email, title: p.name, type: 'Person', subtitle: p.role, icon: Users, path: `/teams/${teams.find(t => t.members.includes(p.name))?.slug ?? 'platform'}` })),
    ...data.alerts.map(a => ({ id: a.id, title: a.name, type: 'Alert', subtitle: `${a.id} · ${a.service} · ${a.state}`, icon: Bell, keywords: a.name.includes('PostgreSQL') ? 'database latency connection saturation' : '', path: `/alerts/${a.id}` })),
    ...deployments.map(d => ({ id: d.id, title: `${d.service} ${d.version}`, type: 'Deployment', subtitle: `${d.commit} · ${d.status}`, icon: GitBranch, path: `/deployments/${d.id}` })),
    ...data.postmortems.map(p => ({ id: p.id, title: p.title, type: 'Postmortem', subtitle: `${p.status} · ${p.owner}`, icon: FileText, path: `/postmortems/${p.id}` })),
  ];
  const words = query.toLowerCase().trim().split(/\s+/);
  const results = query.trim() ? [...quick, ...resources].filter(r => words.every(w => `${r.title} ${r.subtitle} ${r.type} ${r.keywords ?? ''}`.toLowerCase().includes(w))).slice(0, 24) : [...quick, ...resources.slice(0, 3)];
  useEffect(() => setSelected(0), [query]);
  useEffect(() => { listRef.current?.children[selected]?.scrollIntoView({ block: 'nearest' }); }, [selected]);
  const choose = (r: Result) => { onClose(); if (r.action) r.action(); else if (r.path) go(r.path); };
  return <Modal title="Search RelayOps" onClose={onClose} wide footer={<div {...stylex.props(s.foot)}><span><ArrowUp size={11} /><ArrowDown size={11} /> Navigate</span><span><CornerDownLeft size={11} /> Open</span><span>esc to close</span></div>}><div onKeyDown={e => { if (e.key === 'ArrowDown') { e.preventDefault(); setSelected(n => Math.min(n + 1, results.length - 1)); } if (e.key === 'ArrowUp') { e.preventDefault(); setSelected(n => Math.max(0, n - 1)); } if (e.key === 'Enter' && results[selected]) { e.preventDefault(); choose(results[selected]); } }}><div {...stylex.props(s.inputRow)}><Search size={22} /><input autoFocus aria-label="Search all resources" role="combobox" aria-expanded="true" aria-controls="search-results" aria-activedescendant={results[selected] ? `result-${results[selected].id}` : undefined} placeholder="Search incidents, services, people…" value={query} onChange={e => setQuery(e.target.value)} {...stylex.props(s.input)} /></div><div {...stylex.props(ui.between)}><p {...stylex.props(ui.label)}>{query ? `${results.length} results` : 'Quick actions & recent incidents'}</p><Zap size={13} color="#91a49b" /></div><div id="search-results" role="listbox" ref={listRef} {...stylex.props(s.results)}>{results.map((r, index) => <button role="option" aria-selected={index === selected} id={`result-${r.id}`} tabIndex={-1} key={r.id} onClick={() => choose(r)} onMouseEnter={() => setSelected(index)} {...stylex.props(s.result, index === selected && s.active)}><r.icon size={17} /><div {...stylex.props(ui.grow)}><div {...stylex.props(s.resultTitle)}>{r.title}</div><div {...stylex.props(ui.tableSub)}>{r.subtitle}</div></div><Badge>{r.type}</Badge></button>)}{!results.length && <p {...stylex.props(ui.empty)}>No matches. Try “payment”, “INC-1042”, or “Sarah Chen”.</p>}</div></div></Modal>;
}
