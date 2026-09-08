import * as React from 'react';
import * as stylex from '@stylexjs/stylex';
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { AlertTriangle, Bell, CheckCircle2, ChevronRight, Clock, FileText, GitBranch, Megaphone, Plus, Send, UserPlus } from 'lucide-react';
import { tokens } from '../styles/tokens.stylex';
import { useApp } from '../data/store';
import { alerts as seedAlerts, deployments as seedDeployments, people, personById, serviceById, teamById } from '../data/model';
import type { IncidentStatus, Severity, TimelineEntry } from '../data/model';
import { Avatar, AvatarStack, Button, Field, HealthBadge, Modal, ModalBody, ModalHead, Mono, SevBadge, StatusBadge, Tabs, Tag, card, inputStyle, type } from '../components/ui';

export const Route = createFileRoute('/incidents/$incidentId')({
  component: IncidentDetailPage,
});

type Tab = 'Overview' | 'Timeline' | 'Tasks' | 'Comms';

function IncidentDetailPage() {
  const { incidentId } = Route.useParams();
  const { incidents, alerts, updateIncident, addTimelineEntry, addDiscussion, toggleTask, addTask, addStatusUpdate, resolveAlert, addPostmortem } = useApp();
  const navigate = useNavigate();
  const incident = incidents.find((i) => i.id === incidentId);
  const [tab, setTab] = React.useState<Tab>('Overview');
  const [note, setNote] = React.useState('');
  const [taskTitle, setTaskTitle] = React.useState('');
  const [taskOwner, setTaskOwner] = React.useState('marcus');
  const [updateTitle, setUpdateTitle] = React.useState('');
  const [updateBody, setUpdateBody] = React.useState('');
  const [updateAudience, setUpdateAudience] = React.useState<'Customer' | 'Internal'>('Customer');
  const [control, setControl] = React.useState<'severity' | 'status' | 'commander' | 'responder' | null>(null);
  const [flash, setFlash] = React.useState('');

  if (!incident) {
    return (
      <div {...stylex.props(card.base, card.pad)}>
        <h1 {...stylex.props(type.h1)}>Incident not found</h1>
        <p {...stylex.props(type.sub)}>No incident with ID {incidentId} exists in this workspace.</p>
        <Link to="/incidents">Back to incidents</Link>
      </div>
    );
  }

  const commander = personById[incident.commanderId];
  const linkedAlerts = alerts.filter((a) => incident.alertIds.includes(a.id) || a.incidentId === incident.id);
  const extraAlerts = alerts.filter((a) => !linkedAlerts.includes(a) && a.incidentId === incident.id);
  const allAlerts = [...linkedAlerts, ...extraAlerts];
  const linkedDeploys = seedDeployments.filter((d) => incident.deployIds.includes(d.id) || d.incidentId === incident.id);
  const doneTasks = incident.tasks.filter((t) => t.done).length;

  const say = (msg: string) => {
    setFlash(msg);
    setTimeout(() => setFlash(''), 3200);
  };

  const changeStatus = (s: IncidentStatus) => {
    updateIncident(incident.id, { status: s });
    addTimelineEntry(incident.id, 'status', `Status changed to ${s}.`, `${commander?.name ?? 'Commander'} moved the incident to ${s}.`, commander?.name);
    setControl(null);
    say(`Status changed to ${s}.`);
    if (s === 'Resolved') allAlerts.forEach((a) => resolveAlert(a.id));
  };

  const changeSeverity = (s: Severity) => {
    updateIncident(incident.id, { severity: s });
    addTimelineEntry(incident.id, 'status', `Severity changed to ${s}.`, 'Severity reassessed by incident command.', commander?.name);
    setControl(null);
    say(`Severity changed to ${s}.`);
  };

  const postNote = () => {
    if (!note.trim()) return;
    addDiscussion(incident.id, 'sarah', note.trim());
    addTimelineEntry(incident.id, 'comment', 'Sarah Chen posted an update.', note.trim(), 'Sarah Chen');
    setNote('');
    say('Update posted to the incident timeline.');
  };

  const publishUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!updateTitle.trim() || !updateBody.trim()) return;
    addStatusUpdate(incident.id, updateAudience, updateTitle.trim(), updateBody.trim(), 'Sarah Chen');
    addTimelineEntry(incident.id, 'update', `${updateAudience} update: ${updateTitle.trim()}`, updateBody.trim(), 'Sarah Chen');
    setUpdateTitle('');
    setUpdateBody('');
    say(`${updateAudience} update published.`);
  };

  return (
    <div {...stylex.props(pg.wrap)}>
      <nav aria-label="Breadcrumb" {...stylex.props(pg.crumb)}>
        <Link to="/incidents" {...stylex.props(pg.crumbLink)}>Incidents</Link>
        <ChevronRight size={13} color="#94a3b8" />
        <span>{incident.id}</span>
      </nav>

      <div {...stylex.props(head.box)}>
        <div {...stylex.props(head.main)}>
          <div {...stylex.props(head.badges)}>
            <SevBadge sev={incident.severity} pulse={incident.status !== 'Resolved'} />
            <StatusBadge status={incident.status} />
            <span {...stylex.props(head.meta)}><Clock size={13} /> {incident.durationLabel} · started {incident.startedLabel}</span>
          </div>
          <h1 {...stylex.props(head.title)}>{incident.id}: {incident.title}</h1>
          <p {...stylex.props(head.cmdLine)}>
            Commander <strong>{commander?.name}</strong> ({teamById[commander?.teamId ?? '']?.name}) · {incident.responderIds.length} responders · {incident.serviceIds.length} services affected
          </p>
          <div {...stylex.props(head.actions)}>
            <Button size="sm" tone="secondary" onClick={() => setControl('status')}>Change status</Button>
            <Button size="sm" tone="secondary" onClick={() => setControl('severity')}>Change severity</Button>
            <Button size="sm" tone="secondary" onClick={() => setControl('responder')}><UserPlus size={13} /> Add responder</Button>
            <Button size="sm" tone="secondary" onClick={() => setControl('commander')}>Assign commander</Button>
            {incident.status !== 'Resolved' ? (
              <Button size="sm" tone="primary" onClick={() => changeStatus('Resolved')}><CheckCircle2 size={13} /> Resolve incident</Button>
            ) : (
              <Button size="sm" tone="secondary" onClick={() => changeStatus('Monitoring')}>Reopen</Button>
            )}
            <Button size="sm" tone="ghost" onClick={() => { const id = addPostmortem(`Postmortem — ${incident.id}`, incident.id, incident.commanderId); navigate({ to: `/postmortems/${id}` }); }}>
              <FileText size={13} /> Create postmortem
            </Button>
          </div>
          {flash && <p role="status" {...stylex.props(head.flash)}>{flash}</p>}
        </div>
        <div {...stylex.props(head.side)}>
          <ImpactPanel impact={incident.customerImpact} errorRate={incident.id === 'INC-1042' ? '8.7%' : incident.serviceIds.map((s) => serviceById[s]?.errorRatePct ?? 0).join('% / ') + '%'} />
        </div>
      </div>

      <div {...stylex.props(pg.cols)}>
        <div {...stylex.props(pg.main)}>
          <Tabs tabs={['Overview', 'Timeline', 'Tasks', 'Comms'] as const} active={tab} onChange={setTab} counts={{ Tasks: incident.tasks.length - doneTasks, Comms: incident.updates.length }} />

          {tab === 'Overview' && (
            <div {...stylex.props(pg.tabBody)}>
              <section {...stylex.props(card.base, card.pad)} aria-label="Service impact">
                <h2 {...stylex.props(type.h2)}>Service impact</h2>
                <p {...stylex.props(type.sub)} style={{ margin: '4px 0 12px' }}>Affected services and their current health</p>
                <div {...stylex.props(grid.svc)}>
                  {incident.serviceIds.map((sid) => {
                    const s = serviceById[sid];
                    if (!s) return null;
                    return (
                      <Link key={sid} to="/services/$serviceId" params={{ serviceId: sid }} {...stylex.props(svc.card)}>
                        <div {...stylex.props(svc.top)}><strong>{s.name}</strong><HealthBadge health={s.health} /></div>
                        <p {...stylex.props(svc.meta)}>{s.errorRatePct}% errors · P95 {s.latencyP95Ms}ms · {teamById[s.teamId]?.name}</p>
                      </Link>
                    );
                  })}
                </div>
              </section>

              <section {...stylex.props(card.base, card.pad)} aria-label="Linked alerts">
                <div {...stylex.props(sec.row)}>
                  <div><h2 {...stylex.props(type.h2)}>Alerts ({allAlerts.length})</h2>
                  <p {...stylex.props(type.sub)} style={{ margin: '4px 0 0' }}>Associated with this incident</p></div>
                  <Link to="/alerts" {...stylex.props(sec.link)}>Manage alerts</Link>
                </div>
                <div {...stylex.props(alertList.col)}>
                  {allAlerts.map((a) => (
                    <div key={a.id} {...stylex.props(alertList.row)}>
                      <AlertTriangle size={15} color={a.state === 'Firing' ? '#dc2626' : '#d97706'} />
                      <span {...stylex.props(alertList.main)}>
                        <strong>{a.id} — {a.name}</strong>
                        <span>{serviceById[a.serviceId]?.name} · {a.source} · {a.value}</span>
                      </span>
                      <Tag tone={a.state === 'Firing' ? 'dark' : 'neutral'}>{a.state}</Tag>
                    </div>
                  ))}
                  {allAlerts.length === 0 && <p {...stylex.props(type.sub)}>No alerts linked yet.</p>}
                </div>
              </section>

              <section {...stylex.props(card.base, card.pad)} aria-label="Related deployments">
                <div {...stylex.props(sec.row)}>
                  <div><h2 {...stylex.props(type.h2)}>Potentially related deployments</h2>
                  <p {...stylex.props(type.sub)} style={{ margin: '4px 0 0' }}>Deploys in the incident window</p></div>
                  <Link to="/deployments" {...stylex.props(sec.link)}>All deploys</Link>
                </div>
                <div {...stylex.props(alertList.col)}>
                  {linkedDeploys.map((d) => (
                    <div key={d.id} {...stylex.props(alertList.row)}>
                      <GitBranch size={15} color="#4f46e5" />
                      <span {...stylex.props(alertList.main)}>
                        <strong><Mono>{d.version}</Mono></strong>
                        <span>{d.atLabel} · {personById[d.authorId]?.name} · {d.status}{d.note ? ` — ${d.note}` : ''}</span>
                      </span>
                      <Tag tone={d.status === 'Rolled back' ? 'violet' : 'neutral'}>{d.status}</Tag>
                    </div>
                  ))}
                  {linkedDeploys.length === 0 && <p {...stylex.props(type.sub)}>No deployments linked to this incident.</p>}
                </div>
              </section>

              <section {...stylex.props(card.base, card.pad)} aria-label="Latest discussion">
                <div {...stylex.props(sec.row)}>
                  <div><h2 {...stylex.props(type.h2)}>Responder discussion</h2>
                  <p {...stylex.props(type.sub)} style={{ margin: '4px 0 0' }}>Latest notes from the bridge</p></div>
                  <button {...stylex.props(sec.linkBtn)} onClick={() => setTab('Timeline')}>Open timeline</button>
                </div>
                {incident.discussion.slice(-2).map((d) => (
                  <div key={d.id} {...stylex.props(disc.row)}>
                    <Avatar personId={d.authorId} size="sm" />
                    <div><p {...stylex.props(disc.head)}>{personById[d.authorId]?.name} · {d.at}</p><p {...stylex.props(disc.body)}>{d.body}</p></div>
                  </div>
                ))}
                {incident.discussion.length === 0 && <p {...stylex.props(type.sub)}>No discussion yet — post the first note from the Timeline tab.</p>}
              </section>
            </div>
          )}

          {tab === 'Timeline' && (
            <div {...stylex.props(pg.tabBody)}>
              <section {...stylex.props(card.base, card.pad)} aria-label="Post an update">
                <h2 {...stylex.props(type.h2)}>Post an update</h2>
                <div {...stylex.props(post.row)}>
                  <Avatar personId="sarah" />
                  <input value={note} onChange={(e) => setNote(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') postNote(); }} placeholder="Share what you see, what you tried, what changed…" aria-label="Post an incident note" {...stylex.props(inputStyle.input)} />
                  <Button tone="primary" onClick={postNote}><Send size={13} /> Post</Button>
                </div>
              </section>
              <section {...stylex.props(card.base, card.pad)} aria-label="Incident timeline">
                <h2 {...stylex.props(type.h2)}>Timeline</h2>
                <p {...stylex.props(type.sub)} style={{ margin: '4px 0 14px' }}>{incident.timeline.length} events · newest last · filter by type</p>
                <TimelineList entries={incident.timeline} />
              </section>
            </div>
          )}

          {tab === 'Tasks' && (
            <div {...stylex.props(pg.tabBody)}>
              <section {...stylex.props(card.base, card.pad)} aria-label="Incident tasks">
                <div {...stylex.props(sec.row)}>
                  <div><h2 {...stylex.props(type.h2)}>Tasks ({doneTasks}/{incident.tasks.length} done)</h2>
                  <p {...stylex.props(type.sub)} style={{ margin: '4px 0 0' }}>Owners and completion states</p></div>
                </div>
                <div {...stylex.props(task.col)}>
                  {incident.tasks.map((t) => (
                    <label key={t.id} {...stylex.props(task.row, t.done && task.done)}>
                      <input type="checkbox" checked={t.done} onChange={() => toggleTask(incident.id, t.id)} aria-label={t.title} {...stylex.props(task.check)} />
                      <span {...stylex.props(task.main)}>
                        <span {...stylex.props(task.title)}>{t.title}</span>
                        <span {...stylex.props(task.sub)}>Owner: {personById[t.ownerId]?.name}</span>
                      </span>
                      <Avatar personId={t.ownerId} size="sm" />
                    </label>
                  ))}
                </div>
                <form onSubmit={(e) => { e.preventDefault(); if (taskTitle.trim()) { addTask(incident.id, taskTitle.trim(), taskOwner); setTaskTitle(''); say('Task added.'); } }} {...stylex.props(task.form)}>
                  <input value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} placeholder="Add a task, e.g. Verify checksum on gw-11" aria-label="New task title" {...stylex.props(inputStyle.input)} />
                  <select value={taskOwner} onChange={(e) => setTaskOwner(e.target.value)} aria-label="Task owner" {...stylex.props(task.select)}>
                    {people.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                  <Button tone="secondary" type="submit"><Plus size={13} /> Add</Button>
                </form>
              </section>
            </div>
          )}

          {tab === 'Comms' && (
            <div {...stylex.props(pg.tabBody)}>
              <section {...stylex.props(card.base, card.pad)} aria-label="Publish status update">
                <h2 {...stylex.props(type.h2)}>Customer & internal communication</h2>
                <p {...stylex.props(type.sub)} style={{ margin: '4px 0 12px' }}>Status updates for customers or internal leadership</p>
                <form onSubmit={publishUpdate} {...stylex.props(comms.form)}>
                  <div {...stylex.props(comms.row2)}>
                    <Field label="Audience" htmlFor="cu-aud">
                      <select id="cu-aud" value={updateAudience} onChange={(e) => setUpdateAudience(e.target.value as 'Customer' | 'Internal')} {...stylex.props(inputStyle.input)}>
                        <option>Customer</option>
                        <option>Internal</option>
                      </select>
                    </Field>
                    <Field label="Headline" htmlFor="cu-title">
                      <input id="cu-title" value={updateTitle} onChange={(e) => setUpdateTitle(e.target.value)} placeholder="e.g. Checkout issues — recovering" {...stylex.props(inputStyle.input)} />
                    </Field>
                  </div>
                  <Field label="Message" htmlFor="cu-body">
                    <textarea id="cu-body" value={updateBody} onChange={(e) => setUpdateBody(e.target.value)} rows={3} placeholder="What should customers know? What is safe to retry?" {...stylex.props(inputStyle.input)} />
                  </Field>
                  <div><Button tone="primary" type="submit"><Megaphone size={13} /> Publish update</Button></div>
                </form>
              </section>
              {incident.updates.map((u) => (
                <article key={u.id} {...stylex.props(comms.card)}>
                  <div {...stylex.props(comms.top)}>
                    <Tag tone={u.audience === 'Customer' ? 'accent' : 'dark'}>{u.audience}</Tag>
                    <span {...stylex.props(comms.meta)}>{u.author} · {u.at}</span>
                  </div>
                  <h3 {...stylex.props(comms.title)}>{u.title}</h3>
                  <p {...stylex.props(comms.body)}>{u.body}</p>
                </article>
              ))}
              {incident.updates.length === 0 && <div {...stylex.props(card.base, card.pad)}><p {...stylex.props(type.sub)} style={{ margin: 0 }}>No status updates published yet.</p></div>}
            </div>
          )}
        </div>

        <aside {...stylex.props(pg.rail)} aria-label="Incident properties">
          <section {...stylex.props(card.base, card.padSm)}>
            <h2 {...stylex.props(type.h3)}>Properties</h2>
            <dl {...stylex.props(rail.dl)}>
              <div {...stylex.props(rail.item)}><dt>Severity</dt><dd><SevBadge sev={incident.severity} /></dd></div>
              <div {...stylex.props(rail.item)}><dt>Status</dt><dd><StatusBadge status={incident.status} /></dd></div>
              <div {...stylex.props(rail.item)}><dt>Duration</dt><dd>{incident.durationLabel}</dd></div>
              <div {...stylex.props(rail.item)}><dt>Started</dt><dd>{incident.startedLabel}</dd></div>
              <div {...stylex.props(rail.item)}><dt>Commander</dt><dd><span {...stylex.props(rail.person)}><Avatar personId={incident.commanderId} size="sm" /> {commander?.name}</span></dd></div>
            </dl>
            <div {...stylex.props(rail.block)}>
              <p {...stylex.props(type.label)}>Responders ({incident.responderIds.length})</p>
              <div {...stylex.props(rail.people)}>
                {incident.responderIds.map((id) => (
                  <span key={id} {...stylex.props(rail.person)}><Avatar personId={id} size="sm" /> {personById[id]?.name}</span>
                ))}
              </div>
            </div>
            <div {...stylex.props(rail.block)}>
              <p {...stylex.props(type.label)}>Affected services</p>
              <div {...stylex.props(rail.tags)}>
                {incident.serviceIds.map((s) => <Tag key={s}>{serviceById[s]?.name}</Tag>)}
              </div>
            </div>
          </section>

          <section {...stylex.props(card.base, card.padSm)}>
            <h2 {...stylex.props(type.h3)}>Follow-ups</h2>
            <p {...stylex.props(type.sub)} style={{ margin: '6px 0 10px' }}>Created from this incident</p>
            <div {...stylex.props(rail.followCol)}>
              <button {...stylex.props(rail.follow)} onClick={() => { addTask(incident.id, 'Follow-up: verify fix held for 24h', incident.commanderId); setTab('Tasks'); say('Follow-up action created in Tasks.'); }}>
                <Bell size={13} /> Create follow-up action
              </button>
              <button {...stylex.props(rail.follow)} onClick={() => { const id = addPostmortem(`Postmortem — ${incident.id}`, incident.id, incident.commanderId); navigate({ to: `/postmortems/${id}` }); }}>
                <FileText size={13} /> Create postmortem
              </button>
            </div>
          </section>

          <section {...stylex.props(card.base, card.padSm)}>
            <h2 {...stylex.props(type.h3)}>Description</h2>
            <p {...stylex.props(rail.desc)}>{incident.description}</p>
          </section>
        </aside>
      </div>

      {control && (
        <ControlDialog
          kind={control}
          incidentId={incident.id}
          currentCommander={incident.commanderId}
          currentResponders={incident.responderIds}
          onStatus={changeStatus}
          onSeverity={changeSeverity}
          onClose={() => setControl(null)}
        />
      )}
    </div>
  );
}

function ImpactPanel({ impact, errorRate }: { impact: string; errorRate: string }) {
  return (
    <div {...stylex.props(impactPanel.s)}>
      <p {...stylex.props(type.label)}>Customer impact</p>
      <p {...stylex.props(impactPanel.big)}>{errorRate}</p>
      <p {...stylex.props(impactPanel.body)}>{impact}</p>
    </div>
  );
}

const KIND_META: Record<TimelineEntry['kind'], { label: string; color: string; bg: string }> = {
  system: { label: 'System', color: '#4f46e5', bg: '#eef2ff' },
  update: { label: 'Update', color: '#0284c7', bg: '#f0f9ff' },
  alert: { label: 'Alert', color: '#dc2626', bg: '#fef2f2' },
  deploy: { label: 'Deploy', color: '#7c3aed', bg: '#f5f3ff' },
  status: { label: 'Status', color: '#d97706', bg: '#fffbeb' },
  comment: { label: 'Note', color: '#0d9488', bg: '#f0fdfa' },
  task: { label: 'Task', color: '#059669', bg: '#ecfdf5' },
};

function TimelineList({ entries }: { entries: TimelineEntry[] }) {
  const [filter, setFilter] = React.useState<'all' | TimelineEntry['kind']>('all');
  const shown = filter === 'all' ? entries : entries.filter((e) => e.kind === filter);
  return (
    <div>
      <div role="group" aria-label="Filter timeline" {...stylex.props(tl.filters)}>
        {(['all', 'system', 'update', 'alert', 'deploy', 'status', 'comment'] as const).map((k) => (
          <button key={k} aria-pressed={filter === k} onClick={() => setFilter(k)} {...stylex.props(tl.filterBtn, filter === k && tl.filterOn)}>{k}</button>
        ))}
      </div>
      <ol {...stylex.props(tl.list)}>
        {shown.map((e) => {
          const m = KIND_META[e.kind];
          return (
            <li key={e.id} {...stylex.props(tl.item)}>
              <span {...stylex.props(tl.rail)} aria-hidden>
                <span {...stylex.props(tl.node)} style={{ borderColor: m.color }} />
              </span>
              <div {...stylex.props(tl.body)}>
                <div {...stylex.props(tl.top)}>
                  <span {...stylex.props(tl.kind)} style={{ backgroundColor: m.bg, color: m.color }}>{m.label}</span>
                  <span {...stylex.props(tl.clock)}><Clock size={11} /> {e.at}</span>
                </div>
                <p {...stylex.props(tl.title)}>{e.title}</p>
                {e.body && <p {...stylex.props(tl.text)}>{e.body}</p>}
                {e.author && <p {...stylex.props(tl.author)}>— {e.author}</p>}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function ControlDialog({ kind, incidentId, currentCommander, currentResponders, onStatus, onSeverity, onClose }: {
  kind: 'severity' | 'status' | 'commander' | 'responder';
  incidentId: string;
  currentCommander: string;
  currentResponders: string[];
  onStatus: (s: IncidentStatus) => void;
  onSeverity: (s: Severity) => void;
  onClose: () => void;
}) {
  const { updateIncident, addTimelineEntry } = useApp();
  const titles = { severity: 'Change severity', status: 'Change status', commander: 'Assign commander', responder: 'Add responder' };
  return (
    <Modal onClose={onClose} labelledBy="incident-control">
      <ModalHead id="incident-control" title={titles[kind]} sub={`${incidentId} · change is recorded on the timeline`} onClose={onClose} />
      <ModalBody>
        {(kind === 'status') && (
          <div {...stylex.props(ctl.col)}>
            {(['Investigating', 'Identified', 'Monitoring', 'Resolved'] as IncidentStatus[]).map((s) => (
              <button key={s} {...stylex.props(ctl.opt)} onClick={() => onStatus(s)}><StatusBadge status={s} /><span {...stylex.props(ctl.hint)}>{statusHint(s)}</span></button>
            ))}
          </div>
        )}
        {kind === 'severity' && (
          <div {...stylex.props(ctl.col)}>
            {(['SEV0', 'SEV1', 'SEV2', 'SEV3'] as Severity[]).map((s) => (
              <button key={s} {...stylex.props(ctl.opt)} onClick={() => onSeverity(s)}><SevBadge sev={s} /><span {...stylex.props(ctl.hint)}>{s === 'SEV0' ? 'Complete outage' : s === 'SEV1' ? 'Major customer impact' : s === 'SEV2' ? 'Partial impact' : 'Minor issue'}</span></button>
            ))}
          </div>
        )}
        {kind === 'commander' && (
          <div {...stylex.props(ctl.col)}>
            {people.map((p) => (
              <button key={p.id} {...stylex.props(ctl.opt)} onClick={() => { updateIncident(incidentId, { commanderId: p.id }); addTimelineEntry(incidentId, 'status', `${p.name} assigned as incident commander.`, `Command transferred from ${personById[currentCommander]?.name}.`, p.name); onClose(); }}>
                <Avatar personId={p.id} size="sm" /><span {...stylex.props(ctl.name)}>{p.name}</span><span {...stylex.props(ctl.hint)}>{p.role}</span>
              </button>
            ))}
          </div>
        )}
        {kind === 'responder' && (
          <div {...stylex.props(ctl.col)}>
            {people.filter((p) => !currentResponders.includes(p.id) && p.id !== currentCommander).map((p) => (
              <button key={p.id} {...stylex.props(ctl.opt)} onClick={() => { updateIncident(incidentId, { responderIds: [...currentResponders, p.id] }); addTimelineEntry(incidentId, 'update', `${p.name} joined as responder.`, p.role, p.name); onClose(); }}>
                <Avatar personId={p.id} size="sm" /><span {...stylex.props(ctl.name)}>{p.name}</span><span {...stylex.props(ctl.hint)}>{p.role}</span>
              </button>
            ))}
          </div>
        )}
      </ModalBody>
    </Modal>
  );
}

function statusHint(s: IncidentStatus): string {
  if (s === 'Investigating') return 'Still diagnosing';
  if (s === 'Identified') return 'Cause found, fixing';
  if (s === 'Monitoring') return 'Fix applied, watching';
  return 'Verified recovered';
}

const pg = stylex.create({
  wrap: { display: 'flex', flexDirection: 'column', gap: 14 },
  crumb: { display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: tokens.muted },
  crumbLink: { color: tokens.accent, fontWeight: 700, textDecoration: 'none' },
  cols: { display: 'grid', gridTemplateColumns: { default: 'minmax(0,1fr) 300px', '@media (max-width: 1024px)': '1fr' }, gap: 14, alignItems: 'start' },
  main: { display: 'flex', flexDirection: 'column', gap: 0, minWidth: 0, backgroundColor: tokens.surface, borderWidth: 1, borderStyle: 'solid', borderColor: tokens.line, borderRadius: 12, overflow: 'hidden' },
  tabBody: { display: 'flex', flexDirection: 'column', gap: 14, padding: 16 },
  rail: { display: 'flex', flexDirection: 'column', gap: 14, minWidth: 0 },
});

const head = stylex.create({
  box: { display: 'grid', gridTemplateColumns: { default: 'minmax(0,1fr) 300px', '@media (max-width: 900px)': '1fr' }, gap: 14 },
  main: { backgroundColor: tokens.surface, borderWidth: 1, borderStyle: 'solid', borderColor: tokens.line, borderRadius: 12, padding: 20 },
  badges: { display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  meta: { display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, color: tokens.muted, fontWeight: 600 },
  title: { margin: '10px 0 6px', fontSize: 22, fontWeight: 800, letterSpacing: '-0.01em', color: tokens.ink, lineHeight: 1.3 },
  cmdLine: { margin: '0 0 12px', fontSize: 13, color: tokens.muted },
  actions: { display: 'flex', gap: 7, flexWrap: 'wrap' },
  flash: { margin: '10px 0 0', fontSize: 12, fontWeight: 700, color: tokens.ok, backgroundColor: tokens.okSoft, borderRadius: 8, padding: '8px 12px' },
  side: { minWidth: 0 },
});

const impactPanel = stylex.create({
  s: { backgroundColor: '#0c1322', color: '#e2e8f0', borderRadius: 12, padding: 20, display: 'flex', flexDirection: 'column', gap: 6, height: '100%' },
  big: { margin: 0, fontSize: 30, fontWeight: 800, color: '#f87171' },
  body: { margin: 0, fontSize: 12.5, lineHeight: 1.6, color: '#b9c3d8' },
});

const grid = stylex.create({
  svc: { display: 'grid', gridTemplateColumns: { default: 'repeat(3, 1fr)', '@media (max-width: 760px)': '1fr' }, gap: 10 },
});

const svc = stylex.create({
  card: { borderWidth: 1, borderStyle: 'solid', borderColor: tokens.line, borderRadius: 10, padding: 12, textDecoration: 'none', ':hover': { borderColor: tokens.lineStrong, backgroundColor: tokens.surface2 } },
  top: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, fontSize: 13, color: tokens.ink },
  meta: { fontSize: 12, color: tokens.muted, margin: '6px 0 0' },
});

const sec = stylex.create({
  row: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, marginBottom: 12 },
  link: { fontSize: 12, fontWeight: 700, color: tokens.accent, textDecoration: 'none' },
  linkBtn: { borderWidth: 0, backgroundColor: 'transparent', fontSize: 12, fontWeight: 700, color: tokens.accent, cursor: 'pointer' },
});

const alertList = stylex.create({
  col: { display: 'flex', flexDirection: 'column', gap: 4 },
  row: { display: 'flex', alignItems: 'center', gap: 10, padding: '9px 8px', borderRadius: 8, ':hover': { backgroundColor: tokens.surface2 } },
  main: { flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 1, fontSize: 13, color: tokens.ink },
});

const disc = stylex.create({
  row: { display: 'flex', gap: 10, padding: '10px 0', borderTopWidth: 1, borderTopStyle: 'solid', borderTopColor: '#f1f5f9' },
  head: { margin: 0, fontSize: 12, fontWeight: 700, color: tokens.ink },
  body: { margin: '3px 0 0', fontSize: 13, color: tokens.ink2, lineHeight: 1.55 },
});

const post = stylex.create({
  row: { display: 'flex', gap: 8, marginTop: 12 },
});

const tl = stylex.create({
  filters: { display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 6 },
  filterBtn: { borderWidth: 1, borderStyle: 'solid', borderColor: tokens.line, backgroundColor: '#fff', borderRadius: 999, padding: '4px 11px', fontSize: 11, fontWeight: 700, color: tokens.muted, cursor: 'pointer', textTransform: 'capitalize' },
  filterOn: { backgroundColor: tokens.sidebar, color: '#fff', borderColor: tokens.sidebar },
  list: { listStyle: 'none', margin: '14px 0 0', padding: 0, display: 'flex', flexDirection: 'column' },
  item: { display: 'flex', gap: 12, position: 'relative', paddingBottom: 20 },
  rail: { display: 'flex', flexDirection: 'column', alignItems: 'center', width: 18, flexShrink: 0 },
  node: { width: 13, height: 13, borderRadius: '50%', backgroundColor: '#fff', borderWidth: 3, borderStyle: 'solid', marginTop: 3 },
  body: { flex: 1, minWidth: 0, backgroundColor: tokens.surface2, borderRadius: 10, padding: '10px 13px' },
  top: { display: 'flex', alignItems: 'center', gap: 8 },
  kind: { fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', padding: '2px 8px', borderRadius: 999 },
  clock: { display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, color: tokens.muted, fontWeight: 700, marginLeft: 'auto' },
  title: { margin: '6px 0 0', fontSize: 13.5, fontWeight: 700, color: tokens.ink, lineHeight: 1.45 },
  text: { margin: '4px 0 0', fontSize: 13, color: tokens.ink2, lineHeight: 1.55 },
  author: { margin: '5px 0 0', fontSize: 12, color: tokens.muted },
});

const task = stylex.create({
  col: { display: 'flex', flexDirection: 'column', gap: 6 },
  row: { display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderWidth: 1, borderStyle: 'solid', borderColor: tokens.line, borderRadius: 10, cursor: 'pointer' },
  done: { opacity: 0.65, backgroundColor: tokens.surface2 },
  check: { width: 17, height: 17, accentColor: '#4f46e5' },
  main: { flex: 1, display: 'flex', flexDirection: 'column', gap: 1 },
  title: { fontSize: 13.5, fontWeight: 600, color: tokens.ink },
  sub: { fontSize: 12, color: tokens.muted },
  form: { display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' },
  select: { borderWidth: 1, borderStyle: 'solid', borderColor: tokens.lineStrong, borderRadius: 8, padding: '8px 10px', fontSize: 13, backgroundColor: '#fff' },
});

const comms = stylex.create({
  form: { display: 'flex', flexDirection: 'column', gap: 12, marginTop: 12 },
  row2: { display: 'grid', gridTemplateColumns: { default: '200px 1fr', '@media (max-width: 640px)': '1fr' }, gap: 12 },
  card: { backgroundColor: tokens.surface, borderWidth: 1, borderStyle: 'solid', borderColor: tokens.line, borderRadius: 12, padding: 16 },
  top: { display: 'flex', alignItems: 'center', gap: 8 },
  meta: { fontSize: 12, color: tokens.muted },
  title: { margin: '8px 0 4px', fontSize: 14, fontWeight: 700, color: tokens.ink },
  body: { margin: 0, fontSize: 13, color: tokens.ink2, lineHeight: 1.6 },
});

const rail = stylex.create({
  dl: { margin: '10px 0 0', display: 'flex', flexDirection: 'column', gap: 0 },
  item: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, padding: '8px 0', borderTopWidth: 1, borderTopStyle: 'solid', borderTopColor: '#f1f5f9', fontSize: 13, color: tokens.ink2 },
  person: { display: 'inline-flex', alignItems: 'center', gap: 7, fontWeight: 600, color: tokens.ink, fontSize: 13 },
  block: { borderTopWidth: 1, borderTopStyle: 'solid', borderTopColor: '#f1f5f9', paddingTop: 10, marginTop: 4 },
  people: { display: 'flex', flexDirection: 'column', gap: 7, marginTop: 8 },
  tags: { display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 },
  desc: { fontSize: 13, color: tokens.ink2, lineHeight: 1.6, margin: '8px 0 0' },
  followCol: { display: 'flex', flexDirection: 'column', gap: 7 },
  follow: { display: 'flex', alignItems: 'center', gap: 8, borderWidth: 1, borderStyle: 'solid', borderColor: tokens.line, backgroundColor: '#fff', borderRadius: 8, padding: '8px 11px', fontSize: 12.5, fontWeight: 600, color: tokens.ink2, cursor: 'pointer', textAlign: 'left', ':hover': { backgroundColor: tokens.surface2 } },
});

const ctl = stylex.create({
  col: { display: 'flex', flexDirection: 'column', gap: 7 },
  opt: { display: 'flex', alignItems: 'center', gap: 10, borderWidth: 1, borderStyle: 'solid', borderColor: tokens.line, backgroundColor: '#fff', borderRadius: 9, padding: '9px 12px', cursor: 'pointer', textAlign: 'left', ':hover': { backgroundColor: tokens.surface2 } },
  name: { fontSize: 13, fontWeight: 700, color: tokens.ink },
  hint: { fontSize: 12, color: tokens.muted },
});

