import * as React from 'react';
import {
  alerts as seedAlerts,
  incidents as seedIncidents,
  notifications as seedNotifications,
  personById,
  postmortems as seedPostmortems,
  type Alert,
  type AppNotification,
  type Incident,
  type Postmortem,
} from './model';

function personName(id: string): string {
  return personById[id]?.name ?? 'Incident command';
}

export type PaletteMode = 'search' | 'actions';

interface AppState {
  incidents: Incident[];
  alerts: Alert[];
  notifications: AppNotification[];
  postmortems: Postmortem[];
  paletteOpen: boolean;
  paletteMode: PaletteMode;
  paletteQuery: string;
  createOpen: boolean;
  createDefaults: { serviceIds: string[]; severity: Incident['severity'] };
  openPalette: (mode?: PaletteMode, query?: string) => void;
  closePalette: () => void;
  setPaletteQuery: (q: string) => void;
  openCreate: (defaults?: { serviceIds: string[]; severity: Incident['severity'] }) => void;
  closeCreate: () => void;
  createIncident: (input: {
    title: string;
    severity: Incident['severity'];
    serviceIds: string[];
    commanderId: string;
    responderIds: string[];
    description: string;
  }) => string;
  updateIncident: (id: string, patch: Partial<Incident>) => void;
  addTimelineEntry: (id: string, kind: 'update' | 'comment' | 'status', title: string, body: string, author?: string) => void;
  addDiscussion: (id: string, authorId: string, body: string) => void;
  toggleTask: (incidentId: string, taskId: string) => void;
  addTask: (incidentId: string, title: string, ownerId: string) => void;
  addStatusUpdate: (incidentId: string, audience: 'Customer' | 'Internal', title: string, body: string, author: string) => void;
  ackAlert: (id: string) => void;
  resolveAlert: (id: string) => void;
  assignAlert: (id: string, personId: string) => void;
  createIncidentFromAlert: (alertId: string) => string;
  markRead: (id: string) => void;
  markAllRead: () => void;
  pushNotification: (n: AppNotification) => void;
  addPostmortem: (title: string, incidentId: string, ownerId: string) => string;
  updatePostmortem: (pmId: string, patch: Partial<Pick<Postmortem, 'summary' | 'impact' | 'detection' | 'rootCause' | 'resolution'>>) => void;
  updateAction: (pmId: string, actionId: string, patch: { status?: 'Open' | 'In progress' | 'Done' }) => void;
}

const AppCtx = React.createContext<AppState | null>(null);

function nextIncidentId(list: Incident[]): string {
  const nums = list.map((i) => Number(i.id.replace('INC-', ''))).filter((n) => Number.isFinite(n));
  const max = nums.length ? Math.max(...nums) : 1042;
  return `INC-${max + 1}`;
}

function clockNow(): string {
  const d = new Date();
  let h = d.getHours();
  const m = String(d.getMinutes()).padStart(2, '0');
  const ap = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  if (h === 0) h = 12;
  return `${h}:${m} ${ap}`;
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [incidents, setIncidents] = React.useState<Incident[]>(seedIncidents);
  const [alerts, setAlerts] = React.useState<Alert[]>(seedAlerts);
  const [notifications, setNotifications] = React.useState<AppNotification[]>(seedNotifications);
  const [postmortems, setPostmortems] = React.useState<Postmortem[]>(seedPostmortems);
  const [paletteOpen, setPaletteOpen] = React.useState(false);
  const [paletteMode, setPaletteMode] = React.useState<PaletteMode>('search');
  const [paletteQuery, setPaletteQuery] = React.useState('');
  const [createOpen, setCreateOpen] = React.useState(false);
  const [createDefaults, setCreateDefaults] = React.useState<{ serviceIds: string[]; severity: Incident['severity'] }>({
    serviceIds: [],
    severity: 'SEV2',
  });

  const openPalette = React.useCallback((mode: PaletteMode = 'search', query = '') => {
    setPaletteMode(mode);
    setPaletteQuery(query);
    setPaletteOpen(true);
  }, []);
  const closePalette = React.useCallback(() => setPaletteOpen(false), []);
  const openCreate = React.useCallback(
    (defaults?: { serviceIds: string[]; severity: Incident['severity'] }) => {
      setCreateDefaults(defaults ?? { serviceIds: [], severity: 'SEV2' });
      setCreateOpen(true);
    },
    [],
  );
  const closeCreate = React.useCallback(() => setCreateOpen(false), []);

  const createIncident = React.useCallback(
    (input: { title: string; severity: Incident['severity']; serviceIds: string[]; commanderId: string; responderIds: string[]; description: string }) => {
      const id = nextIncidentId(incidents);
      const now = clockNow();
      const commanderName = personName(input.commanderId);
      const incident: Incident = {
        id,
        title: input.title,
        severity: input.severity,
        status: 'Investigating',
        serviceIds: input.serviceIds,
        commanderId: input.commanderId,
        responderIds: input.responderIds,
        startedAt: new Date().toISOString(),
        startedLabel: `Today at ${now}`,
        durationLabel: 'Just now',
        customerImpact: 'Impact is being assessed. Updates will follow as responders triage.',
        description: input.description,
        alertIds: [],
        deployIds: [],
        timeline: [
          { id: `${id}-t1`, at: now, clock: now, kind: 'system', title: `Incident ${id} created manually.`, body: input.description || 'Created from RelayOps quick create.' },
          { id: `${id}-t2`, at: now, clock: now, kind: 'status', author: commanderName, title: 'Status set to Investigating.', body: 'Triage in progress.' },
        ],
        tasks: [{ id: `${id}-task1`, title: 'Assess customer impact and blast radius', ownerId: input.commanderId, done: false }],
        updates: [],
        discussion: [],
      };
      setIncidents((prev) => [incident, ...prev]);
      setNotifications((prev) => [
        { id: `n-${Date.now()}`, text: `You were added to ${id}.`, detail: `Created just now · ${now}`, at: now, read: false, tone: 'incident', link: `/incidents/${id}` },
        ...prev,
      ]);
      return id;
    },
    [incidents],
  );

  const updateIncident = React.useCallback((id: string, patch: Partial<Incident>) => {
    setIncidents((prev) => prev.map((i) => (i.id === id ? { ...i, ...patch } : i)));
  }, []);

  const addTimelineEntry = React.useCallback(
    (id: string, kind: 'update' | 'comment' | 'status', title: string, body: string, author?: string) => {
      const now = clockNow();
      setIncidents((prev) =>
        prev.map((i) =>
          i.id === id
            ? { ...i, timeline: [...i.timeline, { id: `${id}-t${Date.now()}`, at: now, clock: now, kind, title, body, author }] }
            : i,
        ),
      );
    },
    [],
  );

  const addDiscussion = React.useCallback((id: string, authorId: string, body: string) => {
    const now = clockNow();
    setIncidents((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, discussion: [...i.discussion, { id: `d${Date.now()}`, authorId, at: now, body }] } : i,
      ),
    );
  }, []);

  const toggleTask = React.useCallback((incidentId: string, taskId: string) => {
    setIncidents((prev) =>
      prev.map((i) =>
        i.id === incidentId ? { ...i, tasks: i.tasks.map((t) => (t.id === taskId ? { ...t, done: !t.done } : t)) } : i,
      ),
    );
  }, []);

  const addTask = React.useCallback((incidentId: string, title: string, ownerId: string) => {
    setIncidents((prev) =>
      prev.map((i) =>
        i.id === incidentId ? { ...i, tasks: [...i.tasks, { id: `task-${Date.now()}`, title, ownerId, done: false }] } : i,
      ),
    );
  }, []);

  const addStatusUpdate = React.useCallback(
    (incidentId: string, audience: 'Customer' | 'Internal', title: string, body: string, author: string) => {
      const now = clockNow();
      setIncidents((prev) =>
        prev.map((i) =>
          i.id === incidentId
            ? { ...i, updates: [{ id: `u${Date.now()}`, at: now, audience, author, title, body }, ...i.updates] }
            : i,
        ),
      );
    },
    [],
  );

  const ackAlert = React.useCallback((id: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, state: 'Acknowledged' as const } : a)));
  }, []);
  const resolveAlert = React.useCallback((id: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, state: 'Resolved' as const } : a)));
  }, []);
  const assignAlert = React.useCallback((id: string, personId: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, assigneeId: personId } : a)));
  }, []);

  const createIncidentFromAlert = React.useCallback(
    (alertId: string) => {
      const alert = alerts.find((a) => a.id === alertId);
      if (!alert) return '';
      const id = nextIncidentId(incidents);
      const now = clockNow();
      const incident: Incident = {
        id,
        title: `${alert.name} — ${alert.id}`,
        severity: alert.severity,
        status: 'Investigating',
        serviceIds: [alert.serviceId],
        commanderId: 'sarah',
        responderIds: alert.assigneeId ? [alert.assigneeId] : [],
        startedAt: new Date().toISOString(),
        startedLabel: `Today at ${now}`,
        durationLabel: 'Just now',
        customerImpact: 'Impact is being assessed.',
        description: `Created from alert ${alert.id} (${alert.name}). Current reading: ${alert.value}.`,
        alertIds: [alertId],
        deployIds: [],
        timeline: [
          { id: `${id}-t1`, at: now, clock: now, kind: 'alert', title: `Promoted from alert ${alert.id}.`, body: `${alert.name} — ${alert.value}.` },
          { id: `${id}-t2`, at: now, clock: now, kind: 'status', author: 'Sarah Chen', title: 'Status set to Investigating.', body: 'Triage in progress.' },
        ],
        tasks: [{ id: `${id}-task1`, title: 'Confirm alert and assess impact', ownerId: 'sarah', done: false }],
        updates: [],
        discussion: [],
      };
      setIncidents((prev) => [incident, ...prev]);
      setAlerts((prev) => prev.map((a) => (a.id === alertId ? { ...a, incidentId: id } : a)));
      return id;
    },
    [alerts, incidents],
  );

  const markRead = React.useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);
  const markAllRead = React.useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);
  const pushNotification = React.useCallback((n: AppNotification) => {
    setNotifications((prev) => [n, ...prev]);
  }, []);

  const addPostmortem = React.useCallback(
    (title: string, incidentId: string, ownerId: string) => {
      const id = `pm-${Date.now()}`;
      const incident = incidents.find((i) => i.id === incidentId);
      const pm: Postmortem = {
        id, title, incidentId, severity: incident?.severity ?? 'SEV2', ownerId, status: 'Draft', createdAt: 'Today',
        summary: '', impact: '', detection: '', timeline: [], rootCause: '', resolution: '',
        wentWell: [], wentPoorly: [], lessons: [],
        actions: [{ id: `${id}-a1`, title: 'Complete timeline review', ownerId, priority: 'P1', due: 'Next week', status: 'Open' }],
      };
      setPostmortems((prev) => [pm, ...prev]);
      return id;
    },
    [incidents],
  );

  const updatePostmortem = React.useCallback(
    (pmId: string, patch: Partial<Pick<Postmortem, 'summary' | 'impact' | 'detection' | 'rootCause' | 'resolution'>>) => {
      setPostmortems((prev) => prev.map((p) => (p.id === pmId ? { ...p, ...patch } : p)));
    },
    [],
  );

  const updateAction = React.useCallback((pmId: string, actionId: string, patch: { status?: 'Open' | 'In progress' | 'Done' }) => {
    setPostmortems((prev) =>
      prev.map((p) => (p.id === pmId ? { ...p, actions: p.actions.map((a) => (a.id === actionId ? { ...a, ...patch } : a)) } : p)),
    );
  }, []);

  const value: AppState = {
    incidents, alerts, notifications, postmortems,
    paletteOpen, paletteMode, paletteQuery, createOpen, createDefaults,
    openPalette, closePalette, setPaletteQuery, openCreate, closeCreate,
    createIncident, updateIncident, addTimelineEntry, addDiscussion, toggleTask, addTask, addStatusUpdate,
    ackAlert, resolveAlert, assignAlert, createIncidentFromAlert,
    markRead, markAllRead, pushNotification, addPostmortem, updatePostmortem, updateAction,
  };
  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export function useApp(): AppState {
  const ctx = React.useContext(AppCtx);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
