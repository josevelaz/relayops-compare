import * as React from 'react';
import * as stylex from '@stylexjs/stylex';
import { createFileRoute, Link } from '@tanstack/react-router';
import { ArrowLeft, CheckCircle2, ChevronRight, Circle, Loader } from 'lucide-react';
import { tokens } from '../styles/tokens.stylex';
import { useApp } from '../data/store';
import { personById } from '../data/model';
import { Button, SevBadge, Tag, card, inputStyle, type } from '../components/ui';

export const Route = createFileRoute('/postmortems/$postmortemId')({
  component: PostmortemDetailPage,
});

function PostmortemDetailPage() {
  const { postmortemId } = Route.useParams();
  const { postmortems, updateAction, updatePostmortem } = useApp();
  const [editing, setEditing] = React.useState(false);
  const [notes, setNotes] = React.useState<Record<string, string>>({});
  const [drafts, setDrafts] = React.useState({ summary: '', impact: '', detection: '', rootCause: '', resolution: '' });
  const [savedNote, setSavedNote] = React.useState('');
  const pm = postmortems.find((p) => p.id === postmortemId);

  React.useEffect(() => {
    if (pm) setDrafts({ summary: pm.summary, impact: pm.impact, detection: pm.detection, rootCause: pm.rootCause, resolution: pm.resolution });
    setEditing(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postmortemId]);

  if (!pm) {
    return (
      <div {...stylex.props(card.base, card.pad)}>
        <h1 {...stylex.props(type.h1)}>Postmortem not found</h1>
        <Link to="/postmortems">Back to postmortems</Link>
      </div>
    );
  }

  const done = pm.actions.filter((a) => a.status === 'Done').length;
  const cycle = (s: 'Open' | 'In progress' | 'Done'): 'Open' | 'In progress' | 'Done' =>
    s === 'Open' ? 'In progress' : s === 'In progress' ? 'Done' : 'Open';

  return (
    <div {...stylex.props(pg.wrap)}>
      <nav aria-label="Breadcrumb" {...stylex.props(pg.crumb)}>
        <Link to="/postmortems" {...stylex.props(pg.crumbLink)}><ArrowLeft size={12} /> Postmortems</Link>
        <ChevronRight size={13} color="#94a3b8" />
        <span>{pm.incidentId}</span>
      </nav>

      <div {...stylex.props(head.box)}>
        <div {...stylex.props(head.row)}>
          <Tag tone={pm.status === 'Published' ? 'accent' : pm.status === 'In review' ? 'violet' : undefined}>{pm.status}</Tag>
          <SevBadge sev={pm.severity} />
          <span {...stylex.props(head.meta)}>{pm.incidentId} · Owner {personById[pm.ownerId]?.name} · {pm.createdAt}</span>
        </div>
        <h1 {...stylex.props(head.title)}>{pm.title}</h1>
        <div {...stylex.props(head.actions)}>
          <Button
            size="sm"
            tone={editing ? 'primary' : 'secondary'}
            onClick={() => {
              if (editing) {
                updatePostmortem(pm.id, { ...drafts });
                setSavedNote('Edits saved to this postmortem.');
                setTimeout(() => setSavedNote(''), 3000);
              }
              setEditing((v) => !v);
            }}
          >
            {editing ? 'Done editing' : 'Edit postmortem'}
          </Button>
          {savedNote !== '' && <span role="status" {...stylex.props(head.saved)}>{savedNote}</span>}
          <span {...stylex.props(head.prog)}>Actions {done}/{pm.actions.length} complete</span>
        </div>
      </div>

      <div {...stylex.props(pg.cols)}>
        <div {...stylex.props(pg.main)}>
          <DocSection title="Summary" value={editing ? drafts.summary : pm.summary} editing={editing} onChange={(v) => setDrafts((d) => ({ ...d, summary: v }))} />
          <DocSection title="Customer Impact" value={editing ? drafts.impact : pm.impact} editing={editing} onChange={(v) => setDrafts((d) => ({ ...d, impact: v }))} />
          <DocSection title="Detection" value={editing ? drafts.detection : pm.detection} editing={editing} onChange={(v) => setDrafts((d) => ({ ...d, detection: v }))} />

          <section {...stylex.props(card.base, card.pad)} aria-label="Timeline">
            <h2 {...stylex.props(type.h2)}>Timeline</h2>
            <ol {...stylex.props(tl.list)}>
              {pm.timeline.map((t, i) => (
                <li key={i} {...stylex.props(tl.row)}>
                  <span {...stylex.props(tl.at)}>{t.at}</span>
                  <span {...stylex.props(tl.text)}>{t.text}</span>
                </li>
              ))}
              {pm.timeline.length === 0 && <li {...stylex.props(tl.row)}><span {...stylex.props(tl.text)}>Timeline not written yet — switch on Edit to draft it.</span></li>}
            </ol>
          </section>

          <DocSection title="Root Cause" value={editing ? drafts.rootCause : pm.rootCause} editing={editing} onChange={(v) => setDrafts((d) => ({ ...d, rootCause: v }))} />
          <DocSection title="Resolution" value={editing ? drafts.resolution : pm.resolution} editing={editing} onChange={(v) => setDrafts((d) => ({ ...d, resolution: v }))} />

          <div {...stylex.props(pg.tri)}>
            <ListCard title="What Went Well" items={pm.wentWell} tone="#059669" />
            <ListCard title="What Went Poorly" items={pm.wentPoorly} tone="#dc2626" />
            <ListCard title="Lessons Learned" items={pm.lessons} tone="#4f46e5" />
          </div>
        </div>

        <aside {...stylex.props(pg.rail)} aria-label="Corrective actions">
          <section {...stylex.props(card.base, card.padSm)}>
            <h2 {...stylex.props(type.h2)}>Corrective actions</h2>
            <p {...stylex.props(type.sub)} style={{ margin: '4px 0 10px' }}>Owner · priority · due · status — click to advance</p>
            <div {...stylex.props(act.col)}>
              {pm.actions.map((a) => (
                <button key={a.id} onClick={() => updateAction(pm.id, a.id, { status: cycle(a.status) })} {...stylex.props(act.row)} aria-label={`${a.title}: ${a.status}. Activate to advance.`}>
                  <span {...stylex.props(act.icon)}>{a.status === 'Done' ? <CheckCircle2 size={17} color="#059669" /> : a.status === 'In progress' ? <Loader size={16} color="#4f46e5" /> : <Circle size={16} color="#94a3b8" />}</span>
                  <span {...stylex.props(act.main)}>
                    <span {...stylex.props(act.title)}>{a.title}</span>
                    <span {...stylex.props(act.sub)}>{personById[a.ownerId]?.name} · {a.priority} · due {a.due}</span>
                  </span>
                  <Tag tone={a.status === 'Done' ? 'accent' : a.status === 'In progress' ? 'violet' : undefined}>{a.status}</Tag>
                </button>
              ))}
            </div>
          </section>
          <section {...stylex.props(card.base, card.padSm)}>
            <h2 {...stylex.props(type.h3)}>Reviewer notes</h2>
            <textarea
              value={notes[pm.id] ?? ''}
              onChange={(e) => setNotes((n) => ({ ...n, [pm.id]: e.target.value }))}
              rows={3}
              placeholder="Leave a review comment…"
              aria-label="Reviewer notes"
              {...stylex.props(inputStyle.input)}
            />
            <p {...stylex.props(pg.note)}>Reading mode is the default; toggle Edit to revise sections inline. Action states persist in this session.</p>
          </section>
        </aside>
      </div>
    </div>
  );
}

function DocSection({ title, value, editing, onChange }: { title: string; value: string; editing: boolean; onChange: (v: string) => void }) {
  return (
    <section {...stylex.props(card.base, card.pad)} aria-label={title}>
      <h2 {...stylex.props(type.h2)}>{title}</h2>
      {editing ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={4} aria-label={`Edit ${title}`} {...stylex.props(inputStyle.input)} />
      ) : (
        <p {...stylex.props(doc.body)}>{value || 'Not written yet.'}</p>
      )}
    </section>
  );
}

function ListCard({ title, items, tone }: { title: string; items: string[]; tone: string }) {
  return (
    <section {...stylex.props(card.base, card.padSm)} aria-label={title}>
      <h2 {...stylex.props(listCard.h)}><span {...stylex.props(listCard.dot)} style={{ backgroundColor: tone }} />{title}</h2>
      <ul {...stylex.props(listCard.ul)}>
        {items.map((x, i) => <li key={i}>{x}</li>)}
        {items.length === 0 && <li>Nothing captured yet.</li>}
      </ul>
    </section>
  );
}

const pg = stylex.create({
  wrap: { display: 'flex', flexDirection: 'column', gap: 14 },
  crumb: { display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: tokens.muted },
  crumbLink: { display: 'inline-flex', alignItems: 'center', gap: 4, color: tokens.accent, fontWeight: 700, textDecoration: 'none' },
  cols: { display: 'grid', gridTemplateColumns: { default: 'minmax(0,1fr) 320px', '@media (max-width: 1024px)': '1fr' }, gap: 14, alignItems: 'start' },
  main: { display: 'flex', flexDirection: 'column', gap: 14, minWidth: 0 },
  rail: { display: 'flex', flexDirection: 'column', gap: 14, minWidth: 0 },
  tri: { display: 'grid', gridTemplateColumns: { default: 'repeat(3, 1fr)', '@media (max-width: 760px)': '1fr' }, gap: 14 },
  note: { fontSize: 12, color: tokens.muted, margin: '10px 0 0', lineHeight: 1.5 },
});

const head = stylex.create({
  box: { backgroundColor: tokens.surface, borderWidth: 1, borderStyle: 'solid', borderColor: tokens.line, borderRadius: 12, padding: 20 },
  row: { display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  meta: { fontSize: 12, color: tokens.muted },
  title: { margin: '10px 0', fontSize: 24, fontWeight: 800, letterSpacing: '-0.01em', color: tokens.ink },
  actions: { display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' },
  saved: { fontSize: 12, fontWeight: 700, color: tokens.ok },
  prog: { fontSize: 12, color: tokens.muted, fontWeight: 600 },
});

const doc = stylex.create({
  body: { fontSize: 13.5, color: tokens.ink2, lineHeight: 1.7, margin: '8px 0 0' },
});

const tl = stylex.create({
  list: { listStyle: 'none', margin: '12px 0 0', padding: 0, display: 'flex', flexDirection: 'column' },
  row: { display: 'flex', gap: 12, padding: '8px 0', borderTopWidth: 1, borderTopStyle: 'solid', borderTopColor: '#f1f5f9', fontSize: 13 },
  at: { fontWeight: 800, color: tokens.ink, minWidth: 70 },
  text: { color: tokens.ink2, lineHeight: 1.55 },
});

const listCard = stylex.create({
  h: { display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 800, color: tokens.ink, margin: 0 },
  dot: { width: 9, height: 9, borderRadius: '50%' },
  ul: { margin: '10px 0 0', paddingLeft: 18, fontSize: 12.5, color: tokens.ink2, lineHeight: 1.6, display: 'flex', flexDirection: 'column', gap: 6 },
});

const act = stylex.create({
  col: { display: 'flex', flexDirection: 'column', gap: 6, marginTop: 4 },
  row: { display: 'flex', gap: 9, alignItems: 'flex-start', textAlign: 'left', borderWidth: 1, borderStyle: 'solid', borderColor: tokens.line, backgroundColor: '#fff', borderRadius: 10, padding: '10px 11px', cursor: 'pointer', ':hover': { backgroundColor: tokens.surface2 } },
  icon: { marginTop: 1, flexShrink: 0 },
  main: { flex: 1, display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 },
  title: { fontSize: 13, fontWeight: 700, color: tokens.ink, lineHeight: 1.4 },
  sub: { fontSize: 11.5, color: tokens.muted },
});

