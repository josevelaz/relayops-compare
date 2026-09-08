import { createContext, useContext, useEffect, useState, type ReactNode, type Dispatch, type SetStateAction } from 'react';
import { historicalTimeline, seedAlerts, seedIncidents, seedNotifications, seedPostmortems, seedTasks, seedTimeline, type Alert, type Incident, type Notification, type Postmortem, type Task, type TimelineEvent } from '../data/model';

export type AppData = { incidents: Incident[]; alerts: Alert[]; timeline: TimelineEvent[]; tasks: Task[]; postmortems: Postmortem[]; notifications: Notification[]; workspace: string; timezone: string; organization: string; workspaceDescription: string; incidentConfig: Record<string, string>; integrations: Record<string, boolean>; preferences: Record<string, boolean>; members: { name: string; email: string; role: string; status: string }[]; overrides: Record<string, string> };
const initial: AppData = {
  incidents: seedIncidents, alerts: seedAlerts, timeline: [...historicalTimeline, ...seedTimeline], tasks: seedTasks, postmortems: seedPostmortems, notifications: seedNotifications,
  workspace: 'Production Engineering', organization: 'Northstar Labs', timezone: 'UTC',
  workspaceDescription: 'Incident response and operational intelligence for the Northstar engineering organization.',
  incidentConfig: { SEV0: 'Critical outage. Core functionality is unavailable to all customers.', SEV1: 'Major impact. A critical customer journey is significantly impaired.', SEV2: 'Partial degradation. Some customers or non-critical functions are affected.', SEV3: 'Minor impact. Limited disruption with a known workaround.', commander: 'Incident creator' },
  integrations: { GitHub: true, Slack: true, Datadog: true, PagerDuty: true, Sentry: true, AWS: true, Grafana: false },
  preferences: { email: true, push: true, slack: true, mentions: true, deployments: false, digest: true, autoIncident: true },
  members: [{ name: 'Alex Morgan', email: 'alex.morgan@northstar.io', role: 'Admin', status: 'Active' }, { name: 'Sarah Chen', email: 'sarah.chen@northstar.io', role: 'Admin', status: 'Active' }, { name: 'Marcus Johnson', email: 'marcus.johnson@northstar.io', role: 'Member', status: 'Active' }, { name: 'Priya Patel', email: 'priya.patel@northstar.io', role: 'Member', status: 'Active' }, { name: 'Liam Brooks', email: 'liam.brooks@northstar.io', role: 'Member', status: 'Active' }, { name: 'Elena Rodriguez', email: 'elena.rodriguez@northstar.io', role: 'Viewer', status: 'Active' }], overrides: {},
};
type Store = { data: AppData; setData: Dispatch<SetStateAction<AppData>>; toast: string; notify: (message: string) => void; updateIncident: (id: string, patch: Partial<Incident>) => void; addEvent: (incident: string, body: string, type?: TimelineEvent['type']) => void; createPostmortem: (incident: Incident) => string };
const Context = createContext<Store | null>(null);
export function StoreProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState(initial);
  const [ready, setReady] = useState(false);
  const [toast, setToast] = useState('');
  useEffect(() => {
    try { const stored = localStorage.getItem('relayops-v1'); if (stored) setData({ ...initial, ...JSON.parse(stored) }); } catch { /* Browser storage is optional. */ }
    setReady(true);
  }, []);
  useEffect(() => { if (ready) { try { localStorage.setItem('relayops-v1', JSON.stringify(data)); } catch { /* The session continues without persistence. */ } } }, [data, ready]);
  useEffect(() => { if (toast) { const id = setTimeout(() => setToast(''), 4500); return () => clearTimeout(id); } }, [toast]);
  const notify = (message: string) => setToast(message);
  const addEvent = (incident: string, body: string, type: TimelineEvent['type'] = 'update') => setData(d => ({ ...d, timeline: [...d.timeline, { id: crypto.randomUUID(), incident, body, type, author: 'Alex Morgan', time: '11:08 AM' }] }));
  const updateIncident = (id: string, patch: Partial<Incident>) => {
    setData(d => ({ ...d, incidents: d.incidents.map(i => i.id === id ? { ...i, ...patch } : i) }));
    if (patch.status) addEvent(id, `Changed incident status to ${patch.status}.`, 'status');
    if (patch.severity) addEvent(id, `Changed severity to ${patch.severity}.`, 'status');
    if (patch.commander) addEvent(id, `Assigned ${patch.commander} as incident commander.`, 'status');
    notify('Incident updated');
  };
  const createPostmortem = (incident: Incident) => {
    const existing = data.postmortems.find(p => p.incident === incident.id);
    if (existing) return existing.id;
    const id = `PM-${String(29 + data.postmortems.length - seedPostmortems.length).padStart(3, '0')}`;
    const pm: Postmortem = { id, title: `${incident.title} — September 8`, incident: incident.id, severity: incident.severity, owner: incident.commander, status: 'Draft', created: 'Sep 8, 2026', sections: { Summary: incident.description, 'Customer Impact': incident.services.join(', '), Detection: 'Automated service monitoring.', Timeline: data.timeline.filter(e => e.incident === incident.id).map(e => `${e.time} — ${e.body}`).join('\n'), 'Root Cause': '', Resolution: '', 'What Went Well': '', 'What Went Poorly': '', 'Lessons Learned': '' }, actions: data.tasks.filter(t => t.incident === incident.id && !t.done).map(t => ({ ...t })) };
    setData(d => ({ ...d, postmortems: [pm, ...d.postmortems] }));
    notify('Postmortem draft created');
    return id;
  };
  return <Context.Provider value={{ data, setData, toast, notify, updateIncident, addEvent, createPostmortem }}>{children}</Context.Provider>;
}
export function useStore() { const store = useContext(Context); if (!store) throw new Error('StoreProvider is required'); return store; }
