import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  seedAlerts,
  seedIncidents,
  seedNotifications,
  seedPostmortems,
  type Alert,
  type Incident,
  type Notification,
  type Postmortem,
  type TimelineEvent,
} from "./data";

export interface Settings {
  workspace: string;
  organization: string;
  timezone: string;
  autoIncident: boolean;
  commander: string;
  emailAlerts: boolean;
  pushAlerts: boolean;
  digest: boolean;
  mentions: boolean;
  integrations: Record<string, boolean>;
  roles: Record<string, string>;
  memberStatus: Record<string, string>;
  severities: Record<string, string>;
  invites: { name: string; email: string; role: string }[];
}
interface DataState {
  incidents: Incident[];
  alerts: Alert[];
  postmortems: Postmortem[];
  notifications: Notification[];
  settings: Settings;
  schedule: Record<string, string>;
  teamMessages: { id: string; team: string; text: string; time: string }[];
}
type CreateInput = Pick<
  Incident,
  "title" | "severity" | "services" | "commander" | "responders" | "description"
>;
interface Store extends DataState {
  hydrated: boolean;
  postTeamMessage: (team: string, text: string) => void;
  updateIncident: (id: string, patch: Partial<Incident>) => void;
  createIncident: (input: CreateInput, alertId?: string) => string;
  addEvent: (id: string, text: string, type?: TimelineEvent["type"]) => void;
  updateAlert: (id: string, patch: Partial<Alert>) => void;
  updatePostmortem: (id: string, patch: Partial<Postmortem>) => void;
  createPostmortem: (incidentId: string) => string;
  markRead: (id?: string) => void;
  saveSettings: (patch: Partial<Settings>) => void;
  setOverride: (key: string, value: string) => void;
  toast: (message: string) => void;
  toastMessage: string;
  createOpen: boolean;
  openCreate: (alertId?: string) => void;
  closeCreate: () => void;
  createAlertId?: string;
  searchOpen: boolean;
  setSearchOpen: (value: boolean) => void;
}
const initial: DataState = {
  incidents: seedIncidents,
  alerts: seedAlerts,
  postmortems: seedPostmortems,
  notifications: seedNotifications,
  schedule: {},
  teamMessages: [],
  settings: {
    workspace: "Production Engineering",
    organization: "Northstar Labs",
    timezone: "America/New_York",
    autoIncident: true,
    commander: "On-call engineer",
    emailAlerts: true,
    pushAlerts: true,
    digest: false,
    mentions: true,
    integrations: {
      GitHub: true,
      Slack: true,
      Datadog: true,
      PagerDuty: true,
      Sentry: true,
      AWS: true,
      Grafana: false,
    },
    roles: { alex: "Admin", sarah: "Admin", noah: "Viewer" },
    memberStatus: {},
    severities: {
      SEV0: "Critical — widespread outage; immediate response",
      SEV1: "High — significant customer impact; respond within 5 minutes",
      SEV2: "Medium — degraded service; respond within 30 minutes",
      SEV3: "Low — minor issue; respond during business hours",
    },
    invites: [],
  },
};
const Context = createContext<Store | null>(null);
const uid = () =>
  globalThis.crypto?.randomUUID?.() ??
  `id-${Date.now()}-${Math.random().toString(36).slice(2)}`;
const eventTime = () =>
  new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

export function StoreProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<DataState>(initial);
  const [ready, setReady] = useState(false);
  const [toastMessage, setToast] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [createAlertId, setCreateAlertId] = useState<string>();
  const [searchOpen, setSearchOpen] = useState(false);
  useEffect(() => {
    try {
      const saved = localStorage.getItem("relayops-astra-v1");
      if (saved) {
        const parsed = JSON.parse(saved) as DataState;
        if (
          Array.isArray(parsed.incidents) &&
          Array.isArray(parsed.alerts) &&
          parsed.settings
        )
          setData({
            ...initial,
            ...parsed,
            settings: { ...initial.settings, ...parsed.settings },
          });
      }
    } catch {
      /* Storage is optional in private browsing. */
    }
    setReady(true);
  }, []);
  useEffect(() => {
    if (ready) {
      try {
        localStorage.setItem("relayops-astra-v1", JSON.stringify(data));
      } catch {
        /* Keep the current session usable when storage is unavailable. */
      }
    }
  }, [data, ready]);
  useEffect(() => {
    if (!toastMessage) return;
    const timeout = setTimeout(() => setToast(""), 4500);
    return () => clearTimeout(timeout);
  }, [toastMessage]);
  const toast = (message: string) => setToast(message);
  const updateIncident = (id: string, patch: Partial<Incident>) =>
    setData((d) => ({
      ...d,
      incidents: d.incidents.map((i) =>
        i.id !== id
          ? i
          : {
              ...i,
              ...patch,
              timeline:
                patch.timeline ??
                (patch.status && patch.status !== i.status
                  ? [
                      ...i.timeline,
                      {
                        id: uid(),
                        time: eventTime(),
                        type: "status" as const,
                        text: `Status changed from ${i.status} to ${patch.status}.`,
                        author: "alex",
                      },
                    ]
                  : i.timeline),
            },
      ),
    }));
  const createIncident = (input: CreateInput, alertId?: string) => {
    const sourceAlert = data.alerts.find((a) => a.id === alertId);
    if (sourceAlert?.incident) {
      toast(`This alert is already linked to ${sourceAlert.incident}.`);
      return sourceAlert.incident;
    }
    const id = `INC-${Math.max(...data.incidents.map((i) => Number(i.id.split("-")[1]))) + 1}`;
    const incident: Incident = {
      ...input,
      services: [
        ...new Set([
          ...input.services,
          ...(sourceAlert ? [sourceAlert.service] : []),
        ]),
      ],
      responders: input.responders.filter(
        (person) => person !== input.commander,
      ),
      id,
      status: "Investigating",
      created: "Just now",
      duration: "0m",
      tasks: [],
      timeline: [
        {
          id: uid(),
          time: eventTime(),
          type: "system",
          text: `Incident declared by Alex Morgan. ${alertId ? `Created from ${alertId}.` : ""}`,
        },
      ],
    };
    setData((d) => ({
      ...d,
      incidents: [incident, ...d.incidents],
      alerts: d.alerts.map((a) =>
        a.id === alertId ? { ...a, incident: id, state: "Acknowledged" } : a,
      ),
    }));
    toast(`${id} created. Responders have been notified.`);
    return id;
  };
  const addEvent = (
    id: string,
    text: string,
    type: TimelineEvent["type"] = "comment",
  ) =>
    setData((d) => ({
      ...d,
      incidents: d.incidents.map((i) =>
        i.id === id
          ? {
              ...i,
              timeline: [
                ...i.timeline,
                { id: uid(), time: eventTime(), text, type, author: "alex" },
              ],
            }
          : i,
      ),
    }));
  const updateAlert = (id: string, patch: Partial<Alert>) =>
    setData((d) => ({
      ...d,
      alerts: d.alerts.map((a) => (a.id === id ? { ...a, ...patch } : a)),
      incidents: patch.incident
        ? d.incidents.map((incident) => {
            const alert = d.alerts.find((a) => a.id === id);
            if (incident.id !== patch.incident || !alert) return incident;
            return {
              ...incident,
              services: [...new Set([...incident.services, alert.service])],
              timeline: [
                ...incident.timeline,
                {
                  id: uid(),
                  time: eventTime(),
                  type: "alert" as const,
                  text: `${alert.id} linked to this incident: ${alert.name}.`,
                  author: "alex",
                },
              ],
            };
          })
        : d.incidents,
    }));
  const updatePostmortem = (id: string, patch: Partial<Postmortem>) =>
    setData((d) => ({
      ...d,
      postmortems: d.postmortems.map((p) =>
        p.id === id ? { ...p, ...patch } : p,
      ),
    }));
  const createPostmortem = (incidentId: string) => {
    const existing = data.postmortems.find((p) => p.incident === incidentId);
    if (existing) {
      toast("Opened the existing postmortem.");
      return existing.id;
    }
    const incident = data.incidents.find((i) => i.id === incidentId)!;
    const id = `PM-${Math.max(...data.postmortems.map((p) => Number(p.id.split("-")[1]))) + 1}`;
    const p: Postmortem = {
      id,
      title: incident.title,
      incident: incidentId,
      severity: incident.severity,
      owner: incident.commander,
      created: "Today",
      status: "Draft",
      sections: {
        Summary: incident.description,
        "Customer Impact": incident.description,
        Detection: incident.timeline[0]?.text ?? "Incident manually declared.",
        Timeline: incident.timeline
          .map((e) => `${e.time} — ${e.text}`)
          .join("\n"),
        "Root Cause": "",
        Resolution: "",
        "What Went Well": "",
        "What Went Poorly": "",
        "Lessons Learned": "",
      },
      actions: incident.tasks.map((t) => ({ ...t })),
    };
    setData((d) => ({ ...d, postmortems: [p, ...d.postmortems] }));
    toast("Postmortem draft created from incident context.");
    return id;
  };
  return (
    <Context.Provider
      value={{
        ...data,
        hydrated: ready,
        postTeamMessage: (team, text) =>
          setData((d) => ({
            ...d,
            teamMessages: [
              ...d.teamMessages,
              { id: uid(), team, text, time: eventTime() },
            ],
          })),
        updateIncident,
        createIncident,
        addEvent,
        updateAlert,
        updatePostmortem,
        createPostmortem,
        markRead: (id) =>
          setData((d) => ({
            ...d,
            notifications: d.notifications.map((n) =>
              !id || n.id === id ? { ...n, read: true } : n,
            ),
          })),
        saveSettings: (patch) =>
          setData((d) => ({ ...d, settings: { ...d.settings, ...patch } })),
        setOverride: (key, value) =>
          setData((d) => ({ ...d, schedule: { ...d.schedule, [key]: value } })),
        toast,
        toastMessage,
        createOpen,
        openCreate: (alertId) => {
          setCreateAlertId(alertId);
          setCreateOpen(true);
        },
        closeCreate: () => {
          setCreateOpen(false);
          setCreateAlertId(undefined);
        },
        createAlertId,
        searchOpen,
        setSearchOpen,
      }}
    >
      {children}
    </Context.Provider>
  );
}
export function useStore() {
  const store = useContext(Context);
  if (!store) throw new Error("StoreProvider is missing");
  return store;
}
