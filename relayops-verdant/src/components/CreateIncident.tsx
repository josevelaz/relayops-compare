import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { AlertTriangle, Plus, Radio, Shield } from 'lucide-react';
import { people, services, teams, type Incident, type Severity } from '../data/model';
import { useStore } from '../state/store';
import { useActions, type CreateOptions } from '../state/actions';
import { Badge, Button, Field, Input, Modal, Select, ui } from './ui';

const s = stylex.create({ choices: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }, choice: { display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', border: '1px solid #e4e9e7', borderRadius: 5, fontSize: 11, fontWeight: 450 }, selected: { borderColor: '#a3cdbe', backgroundColor: '#f2f9f5' }, error: { color: '#c4544b', fontSize: 12 }, note: { color: '#7f8c91', fontSize: 11, lineHeight: 1.6 } });
export function CreateIncident({ options, onClose }: { options: CreateOptions; onClose: () => void }) {
  const { data, setData, notify } = useStore();
  const { go } = useActions();
  const sourceAlert = data.alerts.find(a => a.id === options.alert);
  const [title, setTitle] = useState(sourceAlert?.name ?? '');
  const [severity, setSeverity] = useState<Severity>(sourceAlert?.severity ?? 'SEV2');
  const [selectedServices, setServices] = useState<string[]>(options.services ?? (sourceAlert ? [sourceAlert.service] : []));
  const selectedTeam = teams.find(t => t.name === services.find(s => s.name === selectedServices[0])?.team) ?? teams[1];
  const defaultCommander = data.incidentConfig.commander === 'On-call engineer' ? data.overrides[selectedTeam.name] ?? selectedTeam.primary : data.incidentConfig.commander === 'Team lead' ? selectedTeam.lead : 'Alex Morgan';
  const [assignedCommander, setCommander] = useState<string | null>(null);
  const commander = assignedCommander ?? defaultCommander;
  const [responders, setResponders] = useState<string[]>([]);
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  function create(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !selectedServices.length) { setError('Add an incident title and select at least one affected service.'); return; }
    const id = `INC-${Math.max(...data.incidents.map(i => Number(i.id.split('-')[1]))) + 1}`;
    const incident: Incident = { id, title: title.trim(), severity, status: 'Investigating', services: selectedServices, commander, responders, description: description.trim() || 'Investigation is underway. The incident team is assessing customer impact.', created: 'Today, 11:08 AM', duration: 'Just now' };
    setData(d => ({ ...d, incidents: [incident, ...d.incidents], alerts: d.alerts.map(a => a.id === options.alert ? { ...a, incident: id, state: 'Acknowledged' } : a), timeline: [...d.timeline, { id: crypto.randomUUID(), incident: id, time: '11:08 AM', type: 'system', author: 'Alex Morgan', body: `Incident declared as ${severity}. ${commander} assigned as commander.` }], notifications: [{ id: crypto.randomUUID(), title: `${id} was created`, body: incident.title, time: 'Just now', type: 'incident', path: `/incidents/${id}`, read: false }, ...d.notifications] }));
    notify(`${id} created. Your response workspace is ready.`);
    onClose(); go(`/incidents/${id}`);
  }
  if (sourceAlert?.incident) {
    const incidentPath = `/incidents/${sourceAlert.incident}`;
    return (
      <Modal title="This alert already has an incident" onClose={onClose} footer={
        <Button variant="primary" onClick={() => { onClose(); go(incidentPath); }}>Open {sourceAlert.incident}</Button>
      }>
        <p {...stylex.props(ui.secondary)}>{sourceAlert.name} is already part of {sourceAlert.incident}. Continue the existing response rather than creating a duplicate. You can explicitly change the association in the alert details.</p>
      </Modal>
    );
  }
  return (
    <Modal title="Declare an incident" onClose={onClose} footer={<>
      <Button onClick={onClose}>Cancel</Button>
      <Button type="submit" form="create-incident" variant="primary"><Plus size={15} />Create incident</Button>
    </>}>
      <form id="create-incident" onSubmit={create} {...stylex.props(ui.stack)}>
        <div {...stylex.props(ui.callout)}><Radio size={19} /><span>Start the response. You can refine details as you investigate.</span></div>
        <Field label="Incident title *"><Input autoFocus placeholder="What is happening?" value={title} onChange={e => setTitle(e.target.value)} required /></Field>
        <div {...stylex.props(ui.grid2)}>
          <Field label="Severity">
            <Select value={severity} onChange={e => setSeverity(e.target.value as Severity)}>
              <option value="SEV0">SEV0 — Critical outage</option>
              <option value="SEV1">SEV1 — Major impact</option>
              <option value="SEV2">SEV2 — Partial degradation</option>
              <option value="SEV3">SEV3 — Minor impact</option>
            </Select>
          </Field>
          <Field label="Incident commander"><Select value={commander} onChange={e => setCommander(e.target.value)}>{people.map(p => <option key={p.name}>{p.name}</option>)}</Select></Field>
        </div>
        <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
          <legend {...stylex.props(ui.field)}>Affected services *</legend>
          <div {...stylex.props(s.choices)}>
            {services.map(service => (
              <label key={service.name} {...stylex.props(s.choice, selectedServices.includes(service.name) && s.selected)}>
                <input type="checkbox" checked={selectedServices.includes(service.name)} onChange={e => setServices(e.target.checked ? [...selectedServices, service.name] : selectedServices.filter(n => n !== service.name))} />
                {service.name}
              </label>
            ))}
          </div>
        </fieldset>
        <Field label="Responders">
          <Select value="" onChange={e => { if (e.target.value && !responders.includes(e.target.value)) setResponders([...responders, e.target.value]); }}>
            <option value="">Add a responder…</option>
            {people.filter(p => !responders.includes(p.name)).map(p => <option key={p.name}>{p.name}</option>)}
          </Select>
        </Field>
        {responders.length > 0 && <div {...stylex.props(ui.row, ui.wrap)}>{responders.map(n => <button key={n} onClick={() => setResponders(responders.filter(p => p !== n))} type="button" {...stylex.props(ui.button, ui.ghost)}>{n} ×</button>)}</div>}
        <Field label="Description"><textarea {...stylex.props(ui.input)} rows={3} placeholder="What do we know? Include symptoms and customer impact." value={description} onChange={e => setDescription(e.target.value)} /></Field>
        {error && <p role="alert" {...stylex.props(s.error)}><AlertTriangle size={13} /> {error}</p>}
        <p {...stylex.props(s.note)}><Shield size={12} /> The incident will be visible to everyone in {data.workspace}. <Badge>Investigating</Badge></p>
      </form>
    </Modal>
  );
}
