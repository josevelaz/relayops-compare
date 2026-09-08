import * as React from 'react';
import * as stylex from '@stylexjs/stylex';
import { useNavigate } from '@tanstack/react-router';
import { tokens } from '../styles/tokens.stylex';
import { useApp } from '../data/store';
import { people, services, teamById, type Incident } from '../data/model';
import { Button, Field, Modal, ModalBody, ModalHead, SevBadge, inputStyle } from './ui';

const SEVS: Incident['severity'][] = ['SEV0', 'SEV1', 'SEV2', 'SEV3'];

export function CreateIncidentModal() {
  const { createOpen, closeCreate, createDefaults, createIncident } = useApp();
  const navigate = useNavigate();
  const [title, setTitle] = React.useState('');
  const [severity, setSeverity] = React.useState<Incident['severity']>(createDefaults.severity);
  const [serviceIds, setServiceIds] = React.useState<string[]>(createDefaults.serviceIds);
  const [commanderId, setCommanderId] = React.useState('sarah');
  const [responderIds, setResponderIds] = React.useState<string[]>(['marcus']);
  const [description, setDescription] = React.useState('');
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    if (createOpen) {
      setSeverity(createDefaults.severity);
      setServiceIds(createDefaults.serviceIds);
      setCommanderId('sarah');
      setResponderIds(['marcus']);
      setTitle('');
      setDescription('');
      setError('');
    }
  }, [createOpen, createDefaults]);

  if (!createOpen) return null;

  const toggle = (list: string[], id: string) => (list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim().length < 8) {
      setError('Give the incident a clear title (at least 8 characters).');
      return;
    }
    if (serviceIds.length === 0) {
      setError('Select at least one affected service.');
      return;
    }
    const id = createIncident({ title: title.trim(), severity, serviceIds, commanderId, responderIds, description: description.trim() });
    closeCreate();
    navigate({ to: `/incidents/${id}` });
  };

  return (
    <Modal onClose={closeCreate} labelledBy="create-inc-title" wide>
      <ModalHead id="create-inc-title" title="Declare an incident" sub="Optimized for speed — you can refine details after creation." onClose={closeCreate} />
      <ModalBody>
        <form onSubmit={submit} {...stylex.props(f.col)}>
          <Field label="Title" error={error} htmlFor="ci-title">
            <input id="ci-title" autoFocus value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Checkout failures after payment gateway deployment" {...stylex.props(inputStyle.input)} />
          </Field>
          <div>
            <p {...stylex.props(f.label)}>Severity</p>
            <div role="radiogroup" aria-label="Severity" {...stylex.props(f.sevRow)}>
              {SEVS.map((s) => (
                <button key={s} type="button" role="radio" aria-checked={severity === s} onClick={() => setSeverity(s)} {...stylex.props(f.sev, severity === s && f.sevActive)}>
                  <SevBadge sev={s} />
                  <span {...stylex.props(f.sevHint)}>{sevHint(s)}</span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <p {...stylex.props(f.label)}>Affected services</p>
            <div {...stylex.props(f.chips)}>
              {services.map((s) => {
                const on = serviceIds.includes(s.id);
                return (
                  <button key={s.id} type="button" aria-pressed={on} onClick={() => setServiceIds(toggle(serviceIds, s.id))} {...stylex.props(f.chip, on && f.chipOn)}>
                    {s.name}
                  </button>
                );
              })}
            </div>
          </div>
          <div {...stylex.props(f.two)}>
            <Field label="Incident commander" htmlFor="ci-commander">
              <select id="ci-commander" value={commanderId} onChange={(e) => setCommanderId(e.target.value)} {...stylex.props(inputStyle.input)}>
                {people.map((p) => (
                  <option key={p.id} value={p.id}>{p.name} — {teamById[p.teamId]?.name}</option>
                ))}
              </select>
            </Field>
            <Field label="Description" htmlFor="ci-desc">
              <input id="ci-desc" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What is happening? (optional for now)" {...stylex.props(inputStyle.input)} />
            </Field>
          </div>
          <div>
            <p {...stylex.props(f.label)}>Responders</p>
            <div {...stylex.props(f.chips)}>
              {people.slice(0, 10).map((p) => {
                const on = responderIds.includes(p.id);
                return (
                  <button key={p.id} type="button" aria-pressed={on} onClick={() => setResponderIds(toggle(responderIds, p.id))} {...stylex.props(f.chip, on && f.chipOn)}>
                    {p.name}
                  </button>
                );
              })}
            </div>
          </div>
          <div {...stylex.props(f.footer)}>
            <Button tone="ghost" onClick={closeCreate}>Cancel</Button>
            <Button tone="primary" type="submit">Declare incident</Button>
          </div>
        </form>
      </ModalBody>
    </Modal>
  );
}

function sevHint(s: Incident['severity']): string {
  if (s === 'SEV0') return 'Critical outage';
  if (s === 'SEV1') return 'Major impact';
  if (s === 'SEV2') return 'Partial impact';
  return 'Minor issue';
}

const f = stylex.create({
  col: { display: 'flex', flexDirection: 'column', gap: 14 },
  label: { fontSize: 12, fontWeight: 700, color: '#334155', margin: '0 0 7px' },
  sevRow: { display: 'grid', gridTemplateColumns: { default: 'repeat(4, 1fr)', '@media (max-width: 560px)': 'repeat(2, 1fr)' }, gap: 8 },
  sev: { borderWidth: 1, borderStyle: 'solid', borderColor: tokens.lineStrong, backgroundColor: '#fff', borderRadius: 9, padding: '9px 8px', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 5, alignItems: 'flex-start' },
  sevActive: { borderColor: tokens.accent, backgroundColor: tokens.accentSoft },
  sevHint: { fontSize: 11, color: tokens.muted },
  chips: { display: 'flex', flexWrap: 'wrap', gap: 7 },
  chip: { borderWidth: 1, borderStyle: 'solid', borderColor: tokens.lineStrong, backgroundColor: '#fff', borderRadius: 999, padding: '6px 12px', fontSize: 12, fontWeight: 600, color: tokens.ink2, cursor: 'pointer' },
  chipOn: { backgroundColor: tokens.sidebar, color: '#fff', borderColor: tokens.sidebar },
  two: { display: 'grid', gridTemplateColumns: { default: '1fr 1fr', '@media (max-width: 560px)': '1fr' }, gap: 12 },
  footer: { display: 'flex', justifyContent: 'flex-end', gap: 8, borderTopWidth: 1, borderTopStyle: 'solid', borderTopColor: tokens.line, paddingTop: 14 },
});
