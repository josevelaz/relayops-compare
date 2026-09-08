import * as React from 'react';
import * as stylex from '@stylexjs/stylex';
import { createFileRoute } from '@tanstack/react-router';
import { CheckCircle2, Plug } from 'lucide-react';
import { tokens } from '../styles/tokens.stylex';
import { people } from '../data/model';
import { Avatar, Button, Field, SectionHeader, Tabs, Tag, card, inputStyle, type } from '../components/ui';

export const Route = createFileRoute('/settings/')({
  component: SettingsPage,
});

type Tab = 'Workspace' | 'Members' | 'Integrations' | 'Incidents' | 'Notifications';

const INTEGRATIONS = [
  { name: 'GitHub', desc: 'Link deploys & pull requests to incidents', connected: true, meta: 'relayops-prod · 47 repos' },
  { name: 'Slack', desc: 'Incident bridges, paging & status posts', connected: true, meta: '#incidents · #team-payments' },
  { name: 'Datadog', desc: 'Monitors, error rates & latency signals', connected: true, meta: '214 monitors synced' },
  { name: 'PagerDuty', desc: 'On-call paging & escalation', connected: true, meta: '5 schedules synced' },
  { name: 'Sentry', desc: 'Error tracking & anomaly alerts', connected: true, meta: '12 projects' },
  { name: 'AWS', desc: 'CloudWatch metrics & deploy events', connected: false, meta: 'Connect to sync CloudWatch alarms' },
  { name: 'Grafana', desc: 'Dashboards & alert rules', connected: false, meta: 'Connect to import alert rules' },
];

function SettingsPage() {
  const [tab, setTab] = React.useState<Tab>('Workspace');
  const [saved, setSaved] = React.useState('');
  const [ws, setWs] = React.useState({ name: 'Production Engineering', org: 'Northstar Labs', tz: 'America/New_York', size: '85 engineers' });
  const [prefs, setPrefs] = React.useState({ sev1: true, mentions: true, digest: false, sms: true, deployFail: true });
  const [autoCreate, setAutoCreate] = React.useState(true);
  const [defaultCommander, setDefaultCommander] = React.useState('Team lead on duty');

  const save = (msg: string) => {
    setSaved(msg);
    setTimeout(() => setSaved(''), 3000);
  };

  return (
    <div {...stylex.props(pg.wrap)}>
      <div>
        <h1 {...stylex.props(type.h1)}>Settings</h1>
        <p {...stylex.props(type.sub)} style={{ marginTop: 4 }}>Workspace, members, integrations and incident preferences</p>
      </div>
      {saved && <p role="status" {...stylex.props(pg.saved)}><CheckCircle2 size={14} /> {saved}</p>}

      <div {...stylex.props(pg.card)}>
        <Tabs tabs={['Workspace', 'Members', 'Integrations', 'Incidents', 'Notifications'] as const} active={tab} onChange={setTab} />
        <div {...stylex.props(pg.body)}>
          {tab === 'Workspace' && (
            <form onSubmit={(e) => { e.preventDefault(); save('Workspace settings saved.'); }} {...stylex.props(f.col)}>
              <SectionHeader title="Workspace" sub="Production Engineering · Northstar Labs" />
              <div {...stylex.props(f.two)}>
                <Field label="Workspace name" htmlFor="ws-name">
                  <input id="ws-name" value={ws.name} onChange={(e) => setWs({ ...ws, name: e.target.value })} {...stylex.props(inputStyle.input)} />
                </Field>
                <Field label="Organization" htmlFor="ws-org">
                  <input id="ws-org" value={ws.org} onChange={(e) => setWs({ ...ws, org: e.target.value })} {...stylex.props(inputStyle.input)} />
                </Field>
              </div>
              <div {...stylex.props(f.two)}>
                <Field label="Timezone" htmlFor="ws-tz">
                  <select id="ws-tz" value={ws.tz} onChange={(e) => setWs({ ...ws, tz: e.target.value })} {...stylex.props(inputStyle.input)}>
                    <option>America/New_York</option><option>America/Chicago</option><option>America/Los_Angeles</option><option>Europe/London</option><option>Asia/Singapore</option>
                  </select>
                </Field>
                <Field label="Company size" htmlFor="ws-size">
                  <input id="ws-size" value={ws.size} onChange={(e) => setWs({ ...ws, size: e.target.value })} {...stylex.props(inputStyle.input)} />
                </Field>
              </div>
              <div><Button tone="primary" type="submit">Save workspace</Button></div>
            </form>
          )}

          {tab === 'Members' && (
            <div>
              <SectionHeader title="Members" sub="16 shown · 85 engineers total · invite by email" right={<Button size="sm" tone="secondary" onClick={() => save('Invite sent — blending into the demo, no email leaves this page.')}>Invite member</Button>} />
              <div {...stylex.props(mem.head)} aria-hidden><span>Member</span><span>Role</span><span>Status</span></div>
              {people.map((p) => (
                <div key={p.id} {...stylex.props(mem.row)}>
                  <span {...stylex.props(mem.main)}><Avatar personId={p.id} size="sm" /><span><strong>{p.name}</strong><br /><span {...stylex.props(mem.email)}>{p.email}</span></span></span>
                  <span {...stylex.props(mem.cell)}><RoleTag id={p.id} /></span>
                  <span {...stylex.props(mem.cell)}><Tag>Active</Tag></span>
                </div>
              ))}
            </div>
          )}

          {tab === 'Integrations' && (
            <div>
              <SectionHeader title="Integrations" sub="5 connected · 2 available" />
              <div {...stylex.props(int.grid)}>
                {INTEGRATIONS.map((g) => (
                  <div key={g.name} {...stylex.props(int.card)}>
                    <div {...stylex.props(int.top)}><span {...stylex.props(int.icon)}><Plug size={15} /></span><strong>{g.name}</strong>{g.connected ? <Tag tone="accent">Connected</Tag> : <Tag>Not connected</Tag>}</div>
                    <p {...stylex.props(int.desc)}>{g.desc}</p>
                    <p {...stylex.props(int.meta)}>{g.meta}</p>
                    <button onClick={() => save(g.connected ? `${g.name} settings opened (demo).` : `${g.name} connection started (demo).`)} {...stylex.props(int.btn)}>
                      {g.connected ? 'Configure' : 'Connect'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'Incidents' && (
            <form onSubmit={(e) => { e.preventDefault(); save('Incident configuration saved.'); }} {...stylex.props(f.col)}>
              <SectionHeader title="Incident configuration" sub="Severities, statuses and default behaviors" />
              <div {...stylex.props(sevDef.grid)}>
                {[
                  ['SEV0', 'Complete outage — all hands, exec notified'],
                  ['SEV1', 'Major customer impact — page command immediately'],
                  ['SEV2', 'Partial impact — owning team responds'],
                  ['SEV3', 'Minor issue — track and fix in hours'],
                ].map(([sev, desc]) => (
                  <div key={sev} {...stylex.props(sevDef.row)}><strong>{sev}</strong><span>{desc}</span></div>
                ))}
              </div>
              <p {...stylex.props(f.note)}>Statuses in use: Investigating → Identified → Monitoring → Resolved. Transitions are recorded on the incident timeline.</p>
              <Field label="Default incident commander" htmlFor="set-commander">
                <select id="set-commander" value={defaultCommander} onChange={(e) => setDefaultCommander(e.target.value)} {...stylex.props(inputStyle.input)}>
                  <option>Team lead on duty</option><option>Primary on-call</option><option>Declaring user</option>
                </select>
              </Field>
              <label {...stylex.props(f.check)}>
                <input type="checkbox" checked={autoCreate} onChange={(e) => setAutoCreate(e.target.checked)} />
                Automatically create SEV1 incidents from critical monitors (like INC-1042)
              </label>
              <div><Button tone="primary" type="submit">Save incident settings</Button></div>
            </form>
          )}

          {tab === 'Notifications' && (
            <form onSubmit={(e) => { e.preventDefault(); save('Notification preferences saved.'); }} {...stylex.props(f.col)}>
              <SectionHeader title="Notifications" sub="Choose what reaches you, and where" />
              {([
                ['sev1', 'SEV0 / SEV1 pages', 'Push + SMS, always — even when quiet hours are on'],
                ['mentions', 'Mentions in incidents', 'When someone names you in INC-1038 style threads'],
                ['deployFail', 'Failed deployments', 'Payment Gateway-style failures on services you own'],
                ['sms', 'SMS fallback for pages', 'If push is unacknowledged in 2 minutes'],
                ['digest', 'Daily operations digest', '7 AM summary of incidents, deploys and actions'],
              ] as const).map(([key, label, desc]) => (
                <label key={key} {...stylex.props(notif.row)}>
                  <input type="checkbox" checked={prefs[key]} onChange={() => setPrefs((p) => ({ ...p, [key]: !p[key] }))} aria-label={label} {...stylex.props(notif.check)} />
                  <span><strong>{label}</strong><br /><span {...stylex.props(notif.desc)}>{desc}</span></span>
                </label>
              ))}
              <div><Button tone="primary" type="submit">Save preferences</Button></div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function RoleTag({ id }: { id: string }) {
  const role = id === 'sarah' || id === 'david' || id === 'mei' || id === 'anna' ? 'Admin' : id === 'jane' ? 'Viewer' : 'Member';
  return <Tag tone={role === 'Admin' ? 'dark' : role === 'Viewer' ? undefined : 'accent'}>{role}</Tag>;
}

const pg = stylex.create({
  wrap: { display: 'flex', flexDirection: 'column', gap: 14 },
  card: { backgroundColor: '#fff', borderWidth: 1, borderStyle: 'solid', borderColor: tokens.line, borderRadius: 12, overflow: 'hidden' },
  body: { padding: 18 },
  saved: { display: 'flex', alignItems: 'center', gap: 7, margin: 0, fontSize: 13, fontWeight: 700, color: tokens.ok, backgroundColor: tokens.okSoft, borderRadius: 8, padding: '9px 13px' },
});

const f = stylex.create({
  col: { display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 640 },
  two: { display: 'grid', gridTemplateColumns: { default: '1fr 1fr', '@media (max-width: 560px)': '1fr' }, gap: 12 },
  note: { fontSize: 12.5, color: tokens.muted, margin: 0, lineHeight: 1.6 },
  check: { display: 'flex', gap: 9, alignItems: 'flex-start', fontSize: 13, fontWeight: 600, color: tokens.ink2, lineHeight: 1.5 },
});

const mem = stylex.create({
  head: { display: 'grid', gridTemplateColumns: { default: '2fr 1fr 1fr', '@media (max-width: 640px)': '1fr 1fr' }, gap: 10, fontSize: 11, fontWeight: 800, color: tokens.muted, textTransform: 'uppercase', letterSpacing: '0.06em', padding: '8px 4px' },
  row: { display: 'grid', gridTemplateColumns: { default: '2fr 1fr 1fr', '@media (max-width: 640px)': '1fr 1fr' }, gap: 10, alignItems: 'center', padding: '9px 4px', borderTopWidth: 1, borderTopStyle: 'solid', borderTopColor: '#f1f5f9', fontSize: 13 },
  main: { display: 'flex', gap: 10, alignItems: 'center', minWidth: 0 },
  email: { fontSize: 12, color: tokens.muted },
  cell: { color: tokens.ink2 },
});

const int = stylex.create({
  grid: { display: 'grid', gridTemplateColumns: { default: 'repeat(3, 1fr)', '@media (max-width: 900px)': 'repeat(2, 1fr)', '@media (max-width: 560px)': '1fr' }, gap: 12 },
  card: { borderWidth: 1, borderStyle: 'solid', borderColor: tokens.line, borderRadius: 11, padding: 14, display: 'flex', flexDirection: 'column', gap: 6 },
  top: { display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: tokens.ink },
  icon: { width: 30, height: 30, borderRadius: 8, backgroundColor: tokens.surface2, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: tokens.accentInk },
  desc: { fontSize: 12.5, color: tokens.ink2, margin: 0, lineHeight: 1.5 },
  meta: { fontSize: 12, color: tokens.muted, margin: 0 },
  btn: { marginTop: 6, borderWidth: 1, borderStyle: 'solid', borderColor: tokens.lineStrong, backgroundColor: '#fff', borderRadius: 8, padding: '7px 10px', fontSize: 12.5, fontWeight: 700, color: tokens.ink, cursor: 'pointer', ':hover': { backgroundColor: tokens.surface2 } },
});

const sevDef = stylex.create({
  grid: { display: 'flex', flexDirection: 'column', gap: 6 },
  row: { display: 'flex', gap: 12, alignItems: 'baseline', backgroundColor: tokens.surface2, borderRadius: 8, padding: '9px 12px', fontSize: 13, color: tokens.ink2 },
});

const notif = stylex.create({
  row: { display: 'flex', gap: 11, alignItems: 'flex-start', fontSize: 13.5, color: tokens.ink, backgroundColor: tokens.surface2, borderRadius: 9, padding: '11px 13px', cursor: 'pointer' },
  check: { width: 17, height: 17, marginTop: 2, accentColor: '#4f46e5' },
  desc: { fontSize: 12.5, color: tokens.muted, fontWeight: 400 },
});
