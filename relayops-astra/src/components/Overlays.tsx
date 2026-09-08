import * as stylex from "@stylexjs/stylex";
import { useMemo, useState } from "react";
import {
  Activity,
  ArrowRight,
  Bell,
  Check,
  CheckCheck,
  ChevronRight,
  Command,
  FileText,
  GitBranch,
  Hash,
  Headphones,
  Search,
  Server,
  ShieldAlert,
  Users,
  X,
  Zap,
} from "lucide-react";
import {
  deployments,
  people,
  person,
  services,
  teams,
  type Severity,
} from "../data";
import { useStore } from "../state";
import {
  Avatar,
  Badge,
  Button,
  Field,
  Input,
  Modal,
  Select,
  s,
  useGo,
} from "./ui";

const o = stylex.create({
  form: { display: "flex", flexDirection: "column", gap: 19 },
  optionGrid: {
    display: "grid",
    gridTemplateColumns: {
      default: "1fr 1fr",
      "@media (max-width: 430px)": "1fr",
    },
    gap: "2px 12px",
    maxHeight: 150,
    overflowY: "auto",
    padding: "8px 10px",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#e1e6dd",
    borderRadius: 6,
    marginTop: 7,
  },
  commandInput: {
    display: "flex",
    gap: 12,
    alignItems: "center",
    paddingBottom: 19,
    borderBottomWidth: 1,
    borderBottomStyle: "solid",
    borderBottomColor: "#e5e9e0",
    color: "#8b9883",
  },
  searchInput: {
    borderWidth: 0,
    outline: "none",
    fontSize: 15,
    color: "#334632",
    width: "100%",
    backgroundColor: "transparent",
  },
  commandResults: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
    marginTop: 16,
    maxHeight: 370,
    overflowY: "auto",
  },
  result: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    width: "100%",
    padding: "11px 10px",
    textAlign: "left",
    borderRadius: 6,
    color: "#66765f",
    ":hover": { backgroundColor: "#f1f5ee" },
  },
  selected: { backgroundColor: "#edf4e8" },
  resultTitle: { fontSize: 12, color: "#3d5236", fontWeight: 500 },
  resultMeta: { fontSize: 10, color: "#8b9980", marginTop: 3 },
  key: {
    padding: "2px 5px",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#dfe5d8",
    borderRadius: 4,
    color: "#8b9880",
    fontSize: 10,
    fontFamily: "inherit",
    whiteSpace: "nowrap",
  },
  notification: {
    display: "flex",
    alignItems: "flex-start",
    gap: 12,
    padding: "16px 8px",
    borderBottomWidth: 1,
    borderBottomStyle: "solid",
    borderBottomColor: "#edf0e9",
  },
  unread: { backgroundColor: "#f4f8ef" },
  notifIcon: {
    width: 30,
    height: 30,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ecf1e6",
    color: "#839773",
    borderRadius: 8,
    flexShrink: 0,
  },
  notifButton: {
    textAlign: "left",
    display: "flex",
    flexDirection: "column",
    gap: 4,
    flex: 1,
    ":hover": { color: "#3d6e2a" },
  },
});

export function CreateIncidentDialog() {
  const store = useStore();
  const go = useGo();
  const alert = store.alerts.find((a) => a.id === store.createAlertId);
  const [title, setTitle] = useState(alert?.name ?? "");
  const [severity, setSeverity] = useState<Severity>(alert?.severity ?? "SEV2");
  const [selectedServices, setServices] = useState<string[]>(
    alert ? [alert.service] : [],
  );
  const [commanderOverride, setCommander] = useState<string>();
  const selectedTeam =
    teams.find(
      (t) =>
        t.name === services.find((s) => s.id === selectedServices[0])?.team,
    ) ?? teams[0];
  const commander =
    commanderOverride ??
    (store.settings.commander === "Incident creator"
      ? "alex"
      : store.settings.commander === "Team lead"
        ? selectedTeam.lead
        : (store.schedule[`${selectedTeam.id}-primary`] ??
          selectedTeam.primary));
  const [responders, setResponders] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || selectedServices.length === 0) {
      setError("Add a title and at least one affected service.");
      return;
    }
    const id = store.createIncident(
      {
        title: title.trim(),
        severity,
        services: selectedServices,
        commander,
        responders,
        description:
          description.trim() ||
          "Investigation in progress. Customer impact is being assessed.",
      },
      store.createAlertId,
    );
    store.closeCreate();
    go(`/incidents/${id}`);
  }
  const toggle = (
    value: string,
    values: string[],
    setter: (items: string[]) => void,
  ) =>
    setter(
      values.includes(value)
        ? values.filter((x) => x !== value)
        : [...values, value],
    );
  return (
    <Modal
      title="Declare an incident"
      description="Start with what you know. You can update the details as you go."
      onClose={store.closeCreate}
      footer={
        <>
          <Button onClick={store.closeCreate}>Cancel</Button>
          <Button
            type="submit"
            form="create-incident"
            variant="primary"
            icon={ShieldAlert}
          >
            Declare incident
          </Button>
        </>
      }
    >
      <form id="create-incident" onSubmit={submit} {...stylex.props(o.form)}>
        {alert && (
          <div {...stylex.props(s.note)}>
            <Bell size={15} />
            Creating from {alert.id}. The alert will be acknowledged and linked.
          </div>
        )}
        <Field label="Incident title *">
          <Input
            autoFocus
            placeholder="What's happening?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            maxLength={150}
          />
        </Field>
        <div {...stylex.props(s.formGrid)}>
          <Field label="Severity">
            <Select
              label="Incident severity"
              value={severity}
              onChange={(e) => setSeverity(e.target.value as Severity)}
              options={[
                { value: "SEV0", label: "SEV0 · Critical outage" },
                { value: "SEV1", label: "SEV1 · Major impact" },
                { value: "SEV2", label: "SEV2 · Degraded service" },
                { value: "SEV3", label: "SEV3 · Minor issue" },
              ]}
            />
          </Field>
          <Field label="Incident commander">
            <Select
              label="Incident commander"
              value={commander}
              onChange={(e) => setCommander(e.target.value)}
              options={people.map((p) => ({ value: p.id, label: p.name }))}
            />
          </Field>
        </div>
        <fieldset {...stylex.props(s.fieldset)}>
          <legend {...stylex.props(s.bold)}>Affected services *</legend>
          <div {...stylex.props(o.optionGrid)}>
            {services.map((service) => (
              <label key={service.id} {...stylex.props(s.checkLabel)}>
                <input
                  type="checkbox"
                  checked={selectedServices.includes(service.id)}
                  onChange={() =>
                    toggle(service.id, selectedServices, setServices)
                  }
                  {...stylex.props(s.checkbox)}
                />
                {service.name}
              </label>
            ))}
          </div>
        </fieldset>
        <Field label="Description">
          <textarea
            placeholder="Describe the symptoms, customer impact, and what you've tried…"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            {...stylex.props(s.input, s.textarea)}
          />
        </Field>
        <fieldset {...stylex.props(s.fieldset)}>
          <legend {...stylex.props(s.bold)}>
            Responders <span {...stylex.props(s.muted)}>(optional)</span>
          </legend>
          <div {...stylex.props(o.optionGrid)}>
            {people
              .filter((p) => p.id !== commander)
              .map((p) => (
                <label key={p.id} {...stylex.props(s.checkLabel)}>
                  <input
                    type="checkbox"
                    checked={responders.includes(p.id)}
                    onChange={() => toggle(p.id, responders, setResponders)}
                    {...stylex.props(s.checkbox)}
                  />
                  <Avatar id={p.id} size="small" />
                  {p.name}
                </label>
              ))}
          </div>
        </fieldset>
        {error && (
          <p role="alert" {...stylex.props(s.error)}>
            {error}
          </p>
        )}
        <p {...stylex.props(s.secondary, s.small)}>
          The incident commander and selected responders will be notified.
        </p>
      </form>
    </Modal>
  );
}

interface SearchResult {
  title: string;
  subtitle: string;
  type: string;
  keywords?: string;
  link?: string;
  action?: () => void;
}
const typeIcons = {
  Incident: ShieldAlert,
  Service: Server,
  Team: Users,
  Person: Users,
  Alert: Bell,
  Deployment: GitBranch,
  Postmortem: FileText,
  Action: Zap,
};
export function CommandDialog() {
  const store = useStore();
  const go = useGo();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const resources: SearchResult[] = useMemo(
    () => [
      ...store.incidents.map((i) => ({
        title: `${i.id} · ${i.title}`,
        subtitle: `${i.severity} · ${i.status}`,
        keywords: i.description,
        type: "Incident",
        link: `/incidents/${i.id}`,
      })),
      ...services.map((i) => ({
        title: i.name,
        subtitle: `${i.team} · ${i.tier}`,
        type: "Service",
        link: `/services/${i.id}`,
      })),
      ...teams.map((i) => ({
        title: i.name,
        subtitle: `${i.members.length} members · ${person(i.lead)?.name}`,
        type: "Team",
        link: `/teams/${i.id}`,
      })),
      ...people.map((i) => ({
        title: i.name,
        subtitle: `${i.role} · ${i.team}`,
        type: "Person",
        link: `/teams/${teams.find((t) => t.name === i.team)?.id ?? "payments"}?person=${i.id}`,
      })),
      ...store.alerts.map((i) => ({
        title: i.name,
        subtitle: `${i.id} · ${i.source} · ${i.state}`,
        keywords: `${i.service} ${i.name.includes("PostgreSQL") ? "database latency connections" : ""}`,
        type: "Alert",
        link: `/alerts/${i.id}`,
      })),
      ...deployments.map((i) => ({
        title: `${i.service}@${i.version}`,
        subtitle: `${i.id} · ${i.status}`,
        type: "Deployment",
        link: `/deployments/${i.id}`,
      })),
      ...store.postmortems.map((i) => ({
        title: i.title,
        subtitle: `${i.id} · ${i.status}`,
        type: "Postmortem",
        link: `/postmortems/${i.id}`,
      })),
    ],
    [store.incidents, store.alerts, store.postmortems],
  );
  const close = () => store.setSearchOpen(false);
  const actions: SearchResult[] = [
    {
      title: "Declare an incident",
      subtitle: "Bring the right people together",
      type: "Action",
      action: () => store.openCreate(),
    },
    {
      title: "Acknowledge an alert",
      subtitle: "Open the alert triage queue",
      type: "Action",
      link: "/alerts",
    },
    {
      title: "Jump to a service",
      subtitle: "Explore your service catalog",
      type: "Action",
      link: "/services",
    },
    {
      title: "See who’s on call",
      subtitle: "Current coverage and escalation policies",
      type: "Action",
      link: "/on-call",
    },
    {
      title: "Create a postmortem",
      subtitle: "Turn incident context into a learning document",
      type: "Action",
      link: `/postmortems?create=${Date.now()}`,
    },
  ];
  const results = query.trim()
    ? [...resources, ...actions]
        .filter((r) =>
          query
            .toLowerCase()
            .split(/\s+/)
            .every((word) =>
              `${r.title} ${r.subtitle} ${r.type} ${r.keywords ?? ""}`
                .toLowerCase()
                .includes(word),
            ),
        )
        .slice(0, 20)
    : [
        ...actions,
        ...resources
          .filter((r) =>
            ["INC-1042", "Payment Gateway"].some((t) => r.title.startsWith(t)),
          )
          .slice(0, 2),
      ];
  const run = (result: SearchResult) => {
    close();
    if (result.action) result.action();
    else if (result.link) go(result.link);
  };
  return (
    <Modal
      title="Search & quick actions"
      onClose={close}
      footer={
        <div {...stylex.props(s.spread, s.grow, s.secondary, s.small)}>
          <span>
            ↑ ↓ to navigate &nbsp; <kbd {...stylex.props(o.key)}>↵</kbd> to open
          </span>
          <span>
            <kbd {...stylex.props(o.key)}>esc</kbd> to close
          </span>
        </div>
      }
    >
      <div
        onKeyDown={(e) => {
          if (e.key === "ArrowDown" || e.key === "ArrowUp") {
            e.preventDefault();
            const next =
              (selected +
                (e.key === "ArrowDown" ? 1 : -1) +
                Math.max(results.length, 1)) %
              Math.max(results.length, 1);
            setSelected(next);
            document
              .getElementById(`search-result-${next}`)
              ?.scrollIntoView({ block: "nearest" });
          } else if (e.key === "Enter" && results[selected]) {
            e.preventDefault();
            run(results[selected]);
          }
        }}
      >
        <label {...stylex.props(o.commandInput)}>
          <Search size={21} />
          <input
            role="combobox"
            aria-label="Search all resources"
            aria-controls="search-results"
            aria-expanded="true"
            aria-activedescendant={
              results[selected] ? `search-result-${selected}` : undefined
            }
            placeholder="Search anything in your workspace…"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelected(0);
            }}
            {...stylex.props(o.searchInput)}
          />
        </label>
        <div {...stylex.props(s.overline, s.space12)}>
          {query
            ? `${results.length} results`
            : "Quick actions & recently viewed"}
        </div>
        <div
          id="search-results"
          role="listbox"
          {...stylex.props(o.commandResults)}
        >
          {results.map((result, i) => {
            const Icon = typeIcons[result.type as keyof typeof typeIcons];
            return (
              <button
                id={`search-result-${i}`}
                role="option"
                aria-selected={selected === i}
                tabIndex={-1}
                key={`${result.type}-${result.title}`}
                onMouseEnter={() => setSelected(i)}
                onClick={() => run(result)}
                {...stylex.props(o.result, selected === i && o.selected)}
              >
                <Icon size={17} strokeWidth={1.6} />
                <span {...stylex.props(s.grow)}>
                  <span {...stylex.props(o.resultTitle)}>{result.title}</span>
                  <span
                    {...stylex.props(o.resultMeta)}
                    style={{ display: "block" }}
                  >
                    {result.subtitle}
                  </span>
                </span>
                <Badge>{result.type}</Badge>
                <ArrowRight size={13} />
              </button>
            );
          })}
          {results.length === 0 && (
            <div {...stylex.props(s.empty)}>
              No results for “{query}”. Try “payment” or “Sarah Chen”.
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}

export function NotificationsDialog({ onClose }: { onClose: () => void }) {
  const store = useStore();
  const go = useGo();
  const [unreadOnly, setUnreadOnly] = useState(false);
  const items = store.notifications.filter((n) => !unreadOnly || !n.read);
  const icons = {
    incident: ShieldAlert,
    deployment: GitBranch,
    oncall: Headphones,
    mention: Hash,
    task: Check,
    alert: Bell,
  };
  return (
    <Modal
      title="Your inbox"
      description="Stay connected to the work that needs you."
      onClose={onClose}
      footer={
        <Button
          icon={CheckCheck}
          onClick={() => {
            store.markRead();
            store.toast("All notifications marked as read.");
          }}
        >
          Mark all as read
        </Button>
      }
    >
      <div {...stylex.props(s.spread)}>
        <span {...stylex.props(s.secondary, s.small)}>
          {store.notifications.filter((n) => !n.read).length} unread
          notifications
        </span>
        <Button
          small
          variant={unreadOnly ? "primary" : "default"}
          onClick={() => setUnreadOnly(!unreadOnly)}
        >
          {unreadOnly ? "Showing unread" : "Unread only"}
        </Button>
      </div>
      <div {...stylex.props(s.space12)}>
        {items.map((n) => {
          const Icon = icons[n.type];
          return (
            <div
              key={n.id}
              {...stylex.props(o.notification, !n.read && o.unread)}
            >
              <div {...stylex.props(o.notifIcon)}>
                <Icon size={15} />
              </div>
              <button
                {...stylex.props(o.notifButton)}
                onClick={() => {
                  store.markRead(n.id);
                  onClose();
                  go(n.link);
                }}
              >
                <strong {...stylex.props(s.small)}>{n.title}</strong>
                <span {...stylex.props(s.secondary, s.small)}>
                  {n.description}
                </span>
                <span {...stylex.props(s.muted, s.small)}>{n.time}</span>
              </button>
              {!n.read && (
                <button
                  title="Mark as read"
                  aria-label={`Mark ${n.title} as read`}
                  onClick={() => store.markRead(n.id)}
                >
                  <Check size={13} />
                </button>
              )}
            </div>
          );
        })}
        {!items.length && (
          <div {...stylex.props(s.empty)}>
            <CheckCheck size={24} />
            <strong>You’re all caught up.</strong>
            <p>All notifications have been read.</p>
          </div>
        )}
      </div>
    </Modal>
  );
}
