import * as React from 'react';
import * as stylex from '@stylexjs/stylex';
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { FileText, Plus } from 'lucide-react';
import { tokens } from '../styles/tokens.stylex';
import { useApp } from '../data/store';
import { personById, type PostmortemStatus } from '../data/model';
import { Button, EmptyNote, Progress, SevBadge, Tag, card, type } from '../components/ui';

export const Route = createFileRoute('/postmortems/')({
  component: PostmortemsPage,
});

function PostmortemsPage() {
  const { postmortems, addPostmortem } = useApp();
  const navigate = useNavigate();
  const [status, setStatus] = React.useState<'all' | PostmortemStatus>('all');
  const [title, setTitle] = React.useState('');
  const [creating, setCreating] = React.useState(false);

  const filtered = postmortems.filter((p) => status === 'all' || p.status === status);

  const create = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    const id = addPostmortem(title.trim(), 'INC-1042', 'sarah');
    setCreating(false);
    setTitle('');
    navigate({ to: `/postmortems/${id}` });
  };

  return (
    <div {...stylex.props(pg.wrap)}>
      <div {...stylex.props(pg.head)}>
        <div>
          <h1 {...stylex.props(type.h1)}>Postmortems</h1>
          <p {...stylex.props(type.sub)} style={{ marginTop: 4 }}>Blameless reviews · action items tracked to completion</p>
        </div>
        <Button tone="primary" onClick={() => setCreating((v) => !v)}><Plus size={14} /> New postmortem</Button>
      </div>

      {creating && (
        <form onSubmit={create} {...stylex.props(pg.create)}>
          <input value={title} onChange={(e) => setTitle(e.target.value)} autoFocus placeholder="Postmortem title, e.g. Checkout incident — September 8" aria-label="Postmortem title" {...stylex.props(pg.input)} />
          <Button tone="primary" type="submit">Create draft</Button>
        </form>
      )}

      <div role="tablist" aria-label="Postmortem status" {...stylex.props(pg.tabs)}>
        {(['all', 'Draft', 'In review', 'Published'] as const).map((s) => (
          <button key={s} role="tab" aria-selected={status === s} onClick={() => setStatus(s)} {...stylex.props(pg.tab, status === s && pg.tabOn)}>
            {s === 'all' ? 'All' : s} · {s === 'all' ? postmortems.length : postmortems.filter((p) => p.status === s).length}
          </button>
        ))}
      </div>

      <div {...stylex.props(pg.list)}>
        {filtered.map((p) => {
          const done = p.actions.filter((a) => a.status === 'Done').length;
          return (
            <Link key={p.id} to="/postmortems/$postmortemId" params={{ postmortemId: p.id }} {...stylex.props(pm.card)}>
              <div {...stylex.props(pm.top)}>
                <FileText size={16} color="#0d9488" />
                <StatusTag status={p.status} />
                <SevBadge sev={p.severity} />
                <span {...stylex.props(pm.date)}>{p.createdAt}</span>
              </div>
              <h2 {...stylex.props(pm.title)}>{p.title}</h2>
              <p {...stylex.props(pm.meta)}>{p.incidentId} · Owner {personById[p.ownerId]?.name}</p>
              <div {...stylex.props(pm.progRow)}>
                <Progress value={p.actions.length ? (done / p.actions.length) * 100 : 0} tone={done === p.actions.length ? '#059669' : '#4f46e5'} />
                <span {...stylex.props(pm.progLab)}>Actions {done}/{p.actions.length}</span>
              </div>
            </Link>
          );
        })}
      </div>
      {filtered.length === 0 && <div {...stylex.props(card.base, card.pad)}><EmptyNote>No postmortems in this state.</EmptyNote></div>}
    </div>
  );
}

function StatusTag({ status }: { status: PostmortemStatus }) {
  if (status === 'Published') return <Tag tone="accent">Published</Tag>;
  if (status === 'In review') return <Tag tone="violet">In review</Tag>;
  return <Tag>Draft</Tag>;
}

const pg = stylex.create({
  wrap: { display: 'flex', flexDirection: 'column', gap: 14 },
  head: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 },
  create: { display: 'flex', gap: 8, backgroundColor: '#fff', borderWidth: 1, borderStyle: 'solid', borderColor: tokens.line, borderRadius: 12, padding: 12 },
  input: { flex: 1, borderWidth: 1, borderStyle: 'solid', borderColor: tokens.lineStrong, borderRadius: 8, padding: '8px 11px', fontSize: 13 },
  tabs: { display: 'flex', gap: 6, flexWrap: 'wrap' },
  tab: { borderWidth: 1, borderStyle: 'solid', borderColor: tokens.lineStrong, backgroundColor: '#fff', borderRadius: 999, padding: '6px 14px', fontSize: 12, fontWeight: 700, color: tokens.ink2, cursor: 'pointer' },
  tabOn: { backgroundColor: tokens.sidebar, color: '#fff', borderColor: tokens.sidebar },
  list: { display: 'grid', gridTemplateColumns: { default: '1fr 1fr', '@media (max-width: 760px)': '1fr' }, gap: 12 },
});

const pm = stylex.create({
  card: { backgroundColor: '#fff', borderWidth: 1, borderStyle: 'solid', borderColor: tokens.line, borderRadius: 12, padding: 16, textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: 8, ':hover': { borderColor: tokens.lineStrong, boxShadow: '0 6px 20px rgba(15,23,42,0.08)' } },
  top: { display: 'flex', alignItems: 'center', gap: 8 },
  date: { marginLeft: 'auto', fontSize: 12, color: tokens.muted },
  title: { margin: 0, fontSize: 15, fontWeight: 800, color: tokens.ink, lineHeight: 1.4 },
  meta: { margin: 0, fontSize: 12.5, color: tokens.muted },
  progRow: { display: 'flex', alignItems: 'center', gap: 10, marginTop: 4 },
  progLab: { fontSize: 11.5, color: tokens.muted, fontWeight: 700, whiteSpace: 'nowrap' },
});
