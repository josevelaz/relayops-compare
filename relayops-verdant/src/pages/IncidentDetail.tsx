import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { Activity, ArrowDown, ArrowLeft, ArrowUpRight, Bell, Check, CheckCircle2, ChevronRight, Circle, ClipboardList, Clock3, Copy, FileText, GitBranch, Globe, Info, MessageSquare, Pencil, Plus, Radio, Send, Settings2, ShieldAlert, Users } from 'lucide-react';
import { people, services, deployments, serviceHealth, servicePath, type IncidentStatus, type Severity, type TimelineEvent, type Task } from '../data/model';
import { useStore } from '../state/store';
import { useActions } from '../state/actions';
import { AppLink, Avatar, AvatarGroup, Badge, Button, Field, Input, Modal, PageHeader, Panel, Person, Select, Status, Tabs, ui } from '../components/ui';
import { TrendChart } from '../components/Charts';
const s = stylex.create({
  back: { marginBottom: 19 },
  title: { fontFamily: 'Manrope, sans-serif', fontSize: { default: 24, '@media (max-width: 650px)': 21 }, lineHeight: 1.45, fontWeight: 750, letterSpacing: '-.7px', maxWidth: 790, margin: '12px 0 14px' },
  header: { marginBottom: 25 },
  impact: { border: '1px solid #f0e0d6', backgroundColor: '#fffbf8', borderRadius: 8, padding: '17px 20px', marginBottom: 21, display: 'flex', gap: 14, alignItems: 'flex-start' },
  impactHeading: { color: '#aa7054', fontSize: 12, fontWeight: 600, marginBottom: 6 },
  impactText: { fontSize: 12, lineHeight: 1.7, color: '#927c6c' },
  impactMetrics: { display: 'flex', gap: 30, marginTop: 13, flexWrap: 'wrap' },
  impactValue: { fontSize: 20, letterSpacing: '-.6px', fontWeight: 650, color: '#ad6b4e' },
  timeline: { listStyle: 'none', padding: 0, margin: 0 },
  event: { display: 'grid', gridTemplateColumns: { default: '66px 28px minmax(0, 1fr)', '@media (max-width: 580px)': '48px 26px minmax(0, 1fr)' }, gap: 12, paddingBottom: 24, position: 'relative' },
  eventTime: { fontFamily: 'ui-monospace, monospace', fontSize: 10, color: '#93a19a', paddingTop: 7, textAlign: 'right' },
  eventIcon: { backgroundColor: '#f0f5f2', border: '1px solid #e4ebe6', color: '#819b8d', width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1 },
  line: { position: 'absolute', top: 27, bottom: 0, left: { default: 91, '@media (max-width: 580px)': 72 }, width: 1, backgroundColor: '#e7ede9' },
  eventCard: { padding: '12px 14px', backgroundColor: '#f9fbfa', border: '1px solid #edf1ee', borderRadius: 7, marginTop: 1 },
  eventText: { fontSize: 12, color: '#6e7e75', lineHeight: 1.8, whiteSpace: 'pre-wrap' },
  eventName: { fontSize: 11, fontWeight: 600, color: '#405b4c', marginBottom: 4 },
  composer: { border: '1px solid #dce7e0', borderRadius: 7, overflow: 'hidden', marginBottom: 24 },
  textarea: { width: '100%', padding: 15, minHeight: 89, border: 0, outline: 'none', backgroundColor: '#fff', color: '#40574a', fontSize: 12 },
  composerFoot: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 12px', backgroundColor: '#fafcfb', borderTop: '1px solid #edf2ee', gap: 8 },
  detailRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '11px 0', fontSize: 11, color: '#819087' },
  serviceRow: { padding: '12px 0', borderBottom: '1px solid #edf1ed' },
  task: { display: 'flex', alignItems: 'flex-start', gap: 9, padding: '12px 0', borderBottom: '1px solid #edf1ed' },
  done: { textDecoration: 'line-through', color: '#9ca69f' },
  taskTitle: { fontSize: 11, lineHeight: 1.6, color: '#526b5b' },
  note: { padding: '13px 15px', backgroundColor: '#f4f8f5', fontSize: 11, lineHeight: 1.7, color: '#6d8977', borderRadius: 6 },
  propertySelect: { maxWidth: 160 },
});

export function IncidentDetail({ id }: { id: string }) {
  const { data, setData, updateIncident, addEvent, createPostmortem, notify } = useStore(); const { go } = useActions();
  const incident = data.incidents.find(i => i.id === id);
  const [tab, setTab] = useState('Timeline'); const [eventFilter, setEventFilter] = useState('All events'); const [newest, setNewest] = useState(true); const [message, setMessage] = useState(''); const [noteType, setNoteType] = useState('update');
  const [modal, setModal] = useState<'responder' | 'resolve' | 'task' | 'edit' | null>(null); const [person, setPerson] = useState(''); const [taskTitle, setTaskTitle] = useState(''); const [taskOwner, setTaskOwner] = useState('Alex Morgan'); const [resolution, setResolution] = useState(''); const [resolveAlerts, setResolveAlerts] = useState(true); const [description, setDescription] = useState(incident?.description ?? '');
  if (!incident) return <Panel title="Incident not found"><AppLink to="/incidents">Return to incidents</AppLink></Panel>;
  const tasks = data.tasks.filter(t => t.incident === id); const alerts = data.alerts.filter(a => a.incident === id); const relatedDeploys = deployments.filter(d => d.incident === id);
  const events = data.timeline.filter(e => e.incident === id && (eventFilter === 'All events' || (eventFilter === 'Updates & comments' ? ['update', 'comment'].includes(e.type) : ['status', 'system', 'deployment', 'alert'].includes(e.type))));
  if (newest) events.reverse();
  const post = () => { if (!message.trim()) return; addEvent(id, message.trim(), noteType as TimelineEvent['type']); setMessage(''); notify('Update posted to the incident timeline'); };
  const toggleTask = (t: Task) => { setData(d => ({ ...d, tasks: d.tasks.map(x => x.id === t.id ? { ...x, done: !x.done } : x) })); notify(t.done ? 'Task reopened' : 'Task completed'); };
  const taskList = (full = false) => <>{tasks.map(t => <div key={t.id} {...stylex.props(s.task)}><input type="checkbox" aria-label={`Complete: ${t.title}`} checked={t.done} onChange={() => toggleTask(t)} /><div {...stylex.props(ui.grow)}><p {...stylex.props(s.taskTitle, t.done && s.done)}>{t.title}</p><div {...stylex.props(ui.row, ui.tableSub)}><Avatar name={t.owner} size={18} />{t.owner}{full && <><Status value={t.priority} /><span>Due {t.due}</span></>}</div></div></div>)}<Button variant="ghost" onClick={() => setModal('task')}><Plus size={13} />Add follow-up action</Button></>;
  return <><div {...stylex.props(s.back)}><AppLink to="/incidents"><ArrowLeft size={13} />All incidents</AppLink></div><header {...stylex.props(s.header)}><div {...stylex.props(ui.between, ui.wrap)}><div {...stylex.props(ui.row)}><span {...stylex.props(ui.mono, ui.muted)}>{incident.id}</span><Status value={incident.severity} /><Status value={incident.status} /></div><div {...stylex.props(ui.row)}><Button icon aria-label="Copy incident link" onClick={async () => { try { await navigator.clipboard.writeText(window.location.href); notify('Incident link copied'); } catch { notify('Copy the incident URL from your address bar'); } }}><Copy size={14} /></Button><Button onClick={() => go(`/postmortems/${createPostmortem(incident)}`)}><FileText size={14} />Postmortem</Button>{incident.status !== 'Resolved' && <Button variant="primary" onClick={() => setModal('resolve')}><CheckCircle2 size={14} />Resolve incident</Button>}</div></div><h1 {...stylex.props(s.title)}>{incident.title}</h1><div {...stylex.props(ui.row, ui.wrap, ui.small, ui.muted)}><span {...stylex.props(ui.row)}><Clock3 size={13} />{incident.created}</span><span>·</span><span>{incident.duration} {incident.status === 'Resolved' ? 'to resolution' : 'elapsed'}</span><span>·</span><span {...stylex.props(ui.row)}><Avatar name={incident.commander} size={21} />{incident.commander} is commanding</span><AvatarGroup names={incident.responders} /></div></header>
  <div {...stylex.props(ui.mainGrid)}><div>
    {incident.status !== 'Resolved' && <div {...stylex.props(s.impact)}><Activity size={20} color="#bc8665" /><div {...stylex.props(ui.grow)}><div {...stylex.props(ui.between)}><h2 {...stylex.props(s.impactHeading)}>Customer impact</h2><Button icon variant="ghost" aria-label="Edit customer impact" onClick={() => { setDescription(incident.description); setModal('edit'); }}><Pencil size={12} /></Button></div><p {...stylex.props(s.impactText)}>{incident.description}</p>{id === 'INC-1042' && <div {...stylex.props(s.impactMetrics)}><div><strong {...stylex.props(s.impactValue)}>8.7%</strong><p {...stylex.props(ui.tableSub)}>Current error rate</p></div><div><strong {...stylex.props(s.impactValue)}>21.4%</strong><p {...stylex.props(ui.tableSub)}>Peak error rate</p></div><div><strong {...stylex.props(s.impactValue)}>&lt;0.5%</strong><p {...stylex.props(ui.tableSub)}>Normal baseline</p></div><Badge tone="green">↓ 12.7 percentage points</Badge></div>}</div></div>}
    {incident.status === 'Resolved' && <div {...stylex.props(ui.callout)}><CheckCircle2 size={18} /><div><strong>Incident resolved</strong><p>{incident.resolution ?? incident.description}</p></div></div>}
    <Tabs tabs={[{ label: 'Timeline', count: data.timeline.filter(e => e.incident === id).length }, { label: 'Tasks', count: tasks.filter(t => !t.done).length }, { label: 'Alerts', count: alerts.length }, { label: 'Deployments', count: relatedDeploys.length }, 'Communication']} value={tab} onChange={setTab} />
    {tab === 'Timeline' && <Panel noPadding><div {...stylex.props(ui.pad)}><div {...stylex.props(s.composer)}><textarea aria-label="Incident update" placeholder="Share an update with your responders…" value={message} onChange={e => setMessage(e.target.value)} onKeyDown={e => { if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') post(); }} {...stylex.props(s.textarea)} /><div {...stylex.props(s.composerFoot)}><div {...stylex.props(ui.row)}><Avatar name="Alex Morgan" size={25} /><Select aria-label="Update type" value={noteType} onChange={e => setNoteType(e.target.value)}><option value="update">Incident update</option><option value="comment">Team note</option></Select></div><Button variant="primary" disabled={!message.trim()} onClick={post}><Send size={12} />Post update</Button></div></div><div {...stylex.props(ui.toolbar)}><h2 {...stylex.props(ui.sectionTitle)}>Incident timeline</h2><div {...stylex.props(ui.row)}><Select aria-label="Filter timeline" value={eventFilter} onChange={e => setEventFilter(e.target.value)}>{['All events', 'Updates & comments', 'System events'].map(x => <option key={x}>{x}</option>)}</Select><Button variant="ghost" onClick={() => setNewest(!newest)}><ArrowDown size={12} />{newest ? 'Newest first' : 'Oldest first'}</Button></div></div><ol aria-label="Incident timeline" {...stylex.props(s.timeline)}>{events.map((e, index) => <TimelineItem key={e.id} event={e} last={index === events.length - 1} />)}</ol>{!events.length && <p {...stylex.props(ui.empty)}>No events in this category. Post an update to begin.</p>}</div></Panel>}
    {tab === 'Tasks' && <Panel title="Response tasks" aside={<Badge>{tasks.filter(t => t.done).length} / {tasks.length} complete</Badge>}>{taskList(true)}</Panel>}
    {tab === 'Alerts' && <Panel title="Associated alerts" noPadding>{alerts.map(a => <div key={a.id} {...stylex.props(ui.pad)}><div {...stylex.props(ui.between)}><div><AppLink to={`/alerts/${a.id}`}><Bell size={14} />{a.name}</AppLink><p {...stylex.props(ui.tableSub)}>{a.source} · {a.service} · {a.triggered}</p></div><div {...stylex.props(ui.row)}><Status value={a.severity} /><Status value={a.state} />{a.state === 'Firing' && <Button onClick={() => { setData(d => ({ ...d, alerts: d.alerts.map(x => x.id === a.id ? { ...x, state: 'Acknowledged', assignee: 'Alex Morgan' } : x) })); notify('Alert acknowledged'); }}>Acknowledge</Button>}</div></div></div>)}{!alerts.length && <p {...stylex.props(ui.empty)}>No alerts linked. <AppLink to="/alerts">Associate an alert</AppLink></p>}</Panel>}
    {tab === 'Deployments' && <Panel title="Potentially related deployments">{relatedDeploys.map(d => <div key={d.id} {...stylex.props(s.serviceRow)}><div {...stylex.props(ui.between)}><AppLink to={`/deployments/${d.id}`}><GitBranch size={15} />{d.service} {d.version}</AppLink><Status value={d.status} /></div><p {...stylex.props(ui.tableSub)}>{d.time} · {d.author} · commit {d.commit}</p></div>)}{id === 'INC-1042' && <div {...stylex.props(s.note)}>payment-gateway@4.18.2 was deployed 4 minutes before the first alert. Rollback completed at 10:43 AM.</div>}{!relatedDeploys.length && <p {...stylex.props(ui.secondary)}>No deployments are currently linked to this incident.</p>}</Panel>}
    {tab === 'Communication' && <Communication incidentId={id} />}
  </div><aside {...stylex.props(ui.stack)}>
    <Panel title="Incident details"><div {...stylex.props(s.detailRow)}><label htmlFor="incident-status">Status</label><Select id="incident-status" value={incident.status} onChange={e => e.target.value === 'Resolved' ? setModal('resolve') : updateIncident(id, { status: e.target.value as IncidentStatus })}>{['Investigating', 'Identified', 'Monitoring', 'Resolved'].map(x => <option key={x}>{x}</option>)}</Select></div><div {...stylex.props(s.detailRow)}><label htmlFor="incident-severity">Severity</label><Select id="incident-severity" value={incident.severity} onChange={e => updateIncident(id, { severity: e.target.value as Severity })}>{['SEV0', 'SEV1', 'SEV2', 'SEV3'].map(x => <option key={x}>{x}</option>)}</Select></div><div {...stylex.props(s.detailRow)}><label htmlFor="commander">Commander</label><Select id="commander" value={incident.commander} onChange={e => updateIncident(id, { commander: e.target.value })}>{people.map(p => <option key={p.name}>{p.name}</option>)}</Select></div><hr {...stylex.props(ui.divider)} /><div {...stylex.props(ui.between)}><span {...stylex.props(ui.label)}>Responders · {incident.responders.length}</span><Button icon variant="ghost" onClick={() => setModal('responder')} aria-label="Add responder"><Plus size={14} /></Button></div><div {...stylex.props(ui.stackSmall)}>{incident.responders.map(n => <Person key={n} name={n} />)}</div></Panel>
    <Panel title="Service impact" aside={<Badge>{incident.services.length} services</Badge>}>{incident.services.map(name => <div key={name} {...stylex.props(s.serviceRow)}><div {...stylex.props(ui.between)}><AppLink to={servicePath(name)}>{name}<ChevronRight size={11} /></AppLink><Status value={serviceHealth(name, data.incidents)} /></div><p {...stylex.props(ui.tableSub)}>{services.find(s => s.name === name)?.team} · Tier {services.find(s => s.name === name)?.tier}</p></div>)}{id === 'INC-1042' && <><hr {...stylex.props(ui.divider)} /><p {...stylex.props(ui.label)}>Checkout error rate</p><TrendChart errorRate /></>}</Panel>
    <Panel title={<span {...stylex.props(ui.row)}><ClipboardList size={14} />Response checklist</span>} aside={<Badge>{tasks.filter(t => t.done).length}/{tasks.length}</Badge>}>{taskList()}</Panel>
    {incident.status !== 'Resolved' && <div {...stylex.props(s.note)}><div {...stylex.props(ui.row)}><Globe size={14} /><strong>Keep customers informed</strong></div><p>Next status update is due at 11:15 AM UTC.</p><Button variant="ghost" onClick={() => setTab('Communication')}>Prepare status update <ArrowUpRight size={12} /></Button></div>}
  </aside></div>
  {modal === 'responder' && (
    <Modal title="Add incident responder" onClose={() => setModal(null)} footer={
      <Button variant="primary" disabled={!person || incident.responders.includes(person)} onClick={() => {
        updateIncident(id, { responders: [...incident.responders, person] });
        addEvent(id, `${person} joined the incident response.`, 'system');
        setPerson('');
        setModal(null);
      }}>Add responder</Button>
    }>
      <Field label="Engineer">
        <Select value={person} onChange={e => setPerson(e.target.value)}>
          <option value="">Select an engineer…</option>
          {people.filter(p => !incident.responders.includes(p.name)).map(p => <option key={p.name}>{p.name}</option>)}
        </Select>
      </Field>
    </Modal>
  )}
  {modal === 'resolve' && (
    <Modal title={`Resolve ${id}`} onClose={() => setModal(null)} footer={<>
      <Button onClick={() => setModal(null)}>Keep investigating</Button>
      <Button variant="primary" disabled={!resolution.trim()} onClick={() => {
        updateIncident(id, { status: 'Resolved', resolution: resolution.trim() });
        addEvent(id, `Resolution: ${resolution.trim()}`, 'update');
        if (resolveAlerts) setData(d => ({ ...d, alerts: d.alerts.map(a => a.incident === id ? { ...a, state: 'Resolved' } : a) }));
        setModal(null);
        notify(`${id} resolved. Service health has been updated.`);
      }}>Resolve incident</Button>
    </>}>
      <div {...stylex.props(ui.stack)}>
        <p {...stylex.props(ui.secondary)}>Confirm that service has recovered. Your resolution will be recorded in the incident timeline.</p>
        <Field label="Resolution summary *"><textarea rows={4} value={resolution} onChange={e => setResolution(e.target.value)} placeholder="What restored service?" {...stylex.props(ui.input)} /></Field>
        <label {...stylex.props(ui.row)}><input type="checkbox" checked={resolveAlerts} onChange={e => setResolveAlerts(e.target.checked)} />Resolve associated alerts</label>
      </div>
    </Modal>
  )}
  {modal === 'task' && <Modal title="Create follow-up action" onClose={() => setModal(null)} footer={<Button variant="primary" disabled={!taskTitle.trim()} onClick={() => { setData(d => ({ ...d, tasks: [...d.tasks, { id: crypto.randomUUID(), incident: id, title: taskTitle.trim(), owner: taskOwner, done: false, priority: 'High', due: 'Today' }] })); setTaskTitle(''); setModal(null); notify('Follow-up action created'); }}>Create action</Button>}><div {...stylex.props(ui.stack)}><Field label="Action"><Input autoFocus value={taskTitle} onChange={e => setTaskTitle(e.target.value)} placeholder="What needs to happen?" /></Field><Field label="Owner"><Select value={taskOwner} onChange={e => setTaskOwner(e.target.value)}>{people.map(p => <option key={p.name}>{p.name}</option>)}</Select></Field></div></Modal>}
  {modal === 'edit' && <Modal title="Update customer impact" onClose={() => setModal(null)} footer={<Button variant="primary" onClick={() => { updateIncident(id, { description }); addEvent(id, 'Updated the customer impact assessment.', 'update'); setModal(null); }}>Save changes</Button>}><Field label="Impact assessment"><textarea rows={6} value={description} onChange={e => setDescription(e.target.value)} {...stylex.props(ui.input)} /></Field></Modal>}
  </>;
}
function TimelineItem({ event, last }: { event: TimelineEvent; last: boolean }) {
  const icons = { system: Radio, update: MessageSquare, comment: MessageSquare, deployment: GitBranch, alert: Bell, status: Activity }; const Icon = icons[event.type];
  return <li {...stylex.props(s.event)}><time {...stylex.props(s.eventTime)}>{event.time}</time>{!last && <span {...stylex.props(s.line)} />}<span {...stylex.props(s.eventIcon)}><Icon size={12} /></span><div {...stylex.props(['update', 'comment'].includes(event.type) && s.eventCard)}><div {...stylex.props(ui.between)}><p {...stylex.props(s.eventName)}>{event.author ?? 'RelayOps'}<span {...stylex.props(ui.muted)}> · {event.type === 'comment' ? 'team note' : event.type}</span></p>{event.type === 'update' && <Badge tone="green">Update</Badge>}</div><p {...stylex.props(s.eventText)}>{event.body}</p></div></li>;
}
function Communication({ incidentId }: { incidentId: string }) {
  const { data, addEvent, notify } = useStore();
  const incident = data.incidents.find(i => i.id === incidentId)!;
  const [channel, setChannel] = useState('Customer status page');
  const [text, setText] = useState(incident.status === 'Resolved'
    ? `Service has been restored. ${incident.resolution ?? incident.description}`
    : incidentId === 'INC-1042'
      ? 'We are investigating intermittent checkout failures. Our team has rolled back a recent change and is working to restore full service. We will provide another update within 15 minutes.'
      : `We are investigating an issue affecting ${incident.services.join(', ')}. Our engineers are working to restore normal service. We will provide another update within 15 minutes.`);
  const publications = data.timeline.filter(e => e.incident === incidentId && e.body.startsWith('[Published'));
  return (
    <Panel title="Status communications">
      <div {...stylex.props(ui.stack)}>
        <div {...stylex.props(ui.callout)}><Globe size={17} />Publish a clear, customer-safe update. Internal notes stay in the timeline.</div>
        <Field label="Destination"><Select value={channel} onChange={e => setChannel(e.target.value)}><option>Customer status page</option><option>Internal engineering channel</option></Select></Field>
        <Field label="Status update"><textarea rows={6} value={text} onChange={e => setText(e.target.value)} {...stylex.props(ui.input)} /></Field>
        <div {...stylex.props(ui.between)}>
          <span {...stylex.props(ui.small, ui.muted)}>Published locally in this demo workspace</span>
          <Button variant="primary" disabled={!text.trim()} onClick={() => {
            addEvent(incidentId, `[Published to ${channel}] ${text}`, 'update');
            setText('');
            notify(`Update published to ${channel}`);
          }}><Send size={13} />Publish update</Button>
        </div>
        <hr {...stylex.props(ui.divider)} />
        <h3 {...stylex.props(ui.sectionTitle)}>Published updates</h3>
        {publications.map(e => <div key={e.id} {...stylex.props(s.note)}><p {...stylex.props(ui.tableSub)}>{e.time} · {e.author}</p><p>{e.body}</p></div>)}
        {incidentId === 'INC-1042' && <div {...stylex.props(s.note)}><p {...stylex.props(ui.tableSub)}>10:40 AM · Sarah Chen · Customer status page</p>We are aware of an issue affecting checkout for some customers. Our engineers are investigating. Existing orders are not affected.</div>}
      </div>
    </Panel>
  );
}
