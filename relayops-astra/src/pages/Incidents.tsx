import * as stylex from "@stylexjs/stylex";
import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Bell,
  Check,
  CheckCircle2,
  ChevronRight,
  Circle,
  Clock3,
  FileText,
  GitBranch,
  Hash,
  Link2,
  ListFilter,
  MessageSquare,
  MoreHorizontal,
  Pencil,
  Plus,
  Radio,
  Send,
  Server,
  ShieldAlert,
  SlidersHorizontal,
  Users,
} from "lucide-react";
import {
  deployments,
  people,
  person,
  serviceName,
  services,
  type Incident,
  type IncidentStatus,
  type Severity,
  type TimelineEvent,
} from "../data";
import { useStore } from "../state";
import {
  AppLink,
  Avatar,
  AvatarStack,
  Badge,
  Button,
  EmptyResults,
  ExportButton,
  Field,
  HealthLabel,
  Input,
  Modal,
  PageHeader,
  Panel,
  PersonName,
  SearchInput,
  Select,
  Tabs,
  getServiceHealth,
  s,
  useGo,
} from "../components/ui";
import { ErrorChart } from "../components/charts";

const i = stylex.create({
  listTitle: {
    fontWeight: 500,
    fontSize: 12,
    color: "#445c47",
    whiteSpace: "normal",
    minWidth: 230,
    maxWidth: 360,
    lineHeight: 1.65,
  },
  id: {
    color: "#9aa694",
    fontSize: 10,
    fontFamily: "ui-monospace, monospace",
    marginBottom: 3,
  },
  serviceChip: {
    backgroundColor: "#f4f6f0",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#e9ede1",
    borderRadius: 4,
    padding: "2px 6px",
    fontSize: 9,
    color: "#8c9a7e",
    whiteSpace: "nowrap",
  },
  summary: {
    display: "flex",
    gap: 22,
    padding: "15px 20px",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#e4e9df",
    borderRadius: 8,
    marginBottom: 22,
    flexWrap: "wrap",
    fontSize: 11,
    color: "#89977e",
  },
  summaryValue: { fontWeight: 600, color: "#52704e", marginRight: 4 },
  headerMeta: {
    display: "flex",
    gap: 10,
    alignItems: "center",
    flexWrap: "wrap",
    color: "#8c9b81",
    fontSize: 11,
    marginBottom: 14,
  },
  title: {
    fontSize: { default: 27, "@media (max-width: 640px)": 22 },
    maxWidth: 800,
    fontWeight: 570,
    letterSpacing: "-.8px",
    lineHeight: 1.4,
    color: "#304c37",
    marginBottom: 18,
  },
  topActions: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
    marginBottom: 23,
  },
  impact: {
    padding: "14px 18px",
    backgroundColor: "#fcf5ed",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#f0e1ca",
    borderRadius: 7,
    color: "#8d7451",
    display: "flex",
    gap: 11,
    fontSize: 11,
    lineHeight: 1.75,
    marginBlock: "20px 22px",
  },
  timeline: { padding: "0 22px 8px" },
  event: {
    display: "grid",
    gridTemplateColumns: "28px minmax(0, 1fr)",
    gap: 12,
    position: "relative",
    paddingBottom: 23,
  },
  eventRail: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    position: "relative",
  },
  eventLine: {
    position: "absolute",
    top: 28,
    bottom: -24,
    width: 1,
    backgroundColor: "#e5ebdd",
  },
  eventIcon: {
    width: 25,
    height: 25,
    borderRadius: "50%",
    backgroundColor: "#f3f6ed",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#e6ecdc",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#a1b48b",
  },
  alertIcon: {
    backgroundColor: "#fcf1e7",
    borderColor: "#f2e0c9",
    color: "#b89861",
  },
  eventTop: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
    fontSize: 10.5,
    fontWeight: 500,
    paddingTop: 3,
  },
  eventTime: {
    color: "#a1ad92",
    fontWeight: 400,
    fontSize: 9,
    marginLeft: "auto",
  },
  eventText: { color: "#63735a", fontSize: 12, marginTop: 5, lineHeight: 1.85 },
  comment: {
    backgroundColor: "#fafcf6",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#e9efdf",
    borderRadius: 6,
    padding: "9px 12px",
    marginTop: 7,
  },
  composer: {
    borderTopWidth: 1,
    borderTopStyle: "solid",
    borderTopColor: "#e9efdf",
    padding: 20,
    backgroundColor: "#fdfefb",
  },
  composerText: { minHeight: 86, backgroundColor: "#fff", fontSize: 11 },
  property: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 9,
    paddingBlock: 10,
    fontSize: 11,
    borderBottomWidth: 1,
    borderBottomStyle: "solid",
    borderBottomColor: "#f0f3e9",
    ":last-child": { borderBottomWidth: 0 },
  },
  propertyLabel: { color: "#748367", fontSize: 11 },
  serviceRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    paddingBlock: 10,
    fontSize: 11,
    color: "#789164",
    borderBottomWidth: 1,
    borderBottomStyle: "solid",
    borderBottomColor: "#eef2e5",
  },
  task: {
    display: "flex",
    alignItems: "flex-start",
    gap: 9,
    paddingBlock: 11,
    borderTopWidth: 1,
    borderTopStyle: "solid",
    borderTopColor: "#edf2e2",
    ":first-child": { borderTopWidth: 0 },
  },
  taskTitle: { fontSize: 11.5, color: "#667a54", lineHeight: 1.7 },
  done: { textDecoration: "line-through", color: "#b2bca5" },
  taskOwner: {
    display: "flex",
    alignItems: "center",
    gap: 5,
    color: "#78896a",
    fontSize: 10,
    marginTop: 4,
  },
  telemetry: {
    display: "flex",
    alignItems: "baseline",
    gap: 9,
    paddingBottom: 13,
  },
  telemetryValue: {
    fontSize: 27,
    fontWeight: 550,
    color: "#b78062",
    letterSpacing: "-.8px",
  },
  telemetryLabel: { fontSize: 10, color: "#a7ad95" },
  options: {
    display: "grid",
    gridTemplateColumns: {
      default: "1fr 1fr",
      "@media (max-width: 480px)": "1fr",
    },
    gap: 7,
    marginTop: 9,
  },
  cardGrid: {
    display: "grid",
    gridTemplateColumns: {
      default: "repeat(2, minmax(0, 1fr))",
      "@media (max-width: 700px)": "1fr",
    },
    gap: 16,
    padding: 18,
  },
});

export function IncidentsPage() {
  const store = useStore();
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState("all");
  const [severity, setSeverity] = useState("All severities");
  const [status, setStatus] = useState("All statuses");
  const [sort, setSort] = useState("Newest first");
  const [view, setView] = useState("List");
  const active = store.incidents.filter((x) => x.status !== "Resolved");
  const visible = store.incidents
    .filter(
      (x) =>
        (tab === "all" ||
          (tab === "active"
            ? x.status !== "Resolved"
            : x.status === "Resolved")) &&
        (severity === "All severities" || severity === x.severity) &&
        (status === "All statuses" || status === x.status) &&
        `${x.id} ${x.title} ${x.services.map(serviceName).join(" ")} ${person(x.commander)?.name}`
          .toLowerCase()
          .includes(query.toLowerCase()),
    )
    .sort((a, b) =>
      sort === "Severity"
        ? a.severity.localeCompare(b.severity)
        : sort === "Oldest first"
          ? Number(a.id.split("-")[1]) - Number(b.id.split("-")[1])
          : Number(b.id.split("-")[1]) - Number(a.id.split("-")[1]),
    );
  const reset = () => {
    setQuery("");
    setSeverity("All severities");
    setStatus("All statuses");
    setTab("all");
  };
  return (
    <div {...stylex.props(s.page)}>
      <PageHeader
        title="Incidents"
        description="Coordinate a response. Restore service. Learn what matters."
        actions={
          <>
            <ExportButton
              filename="relayops-incidents.csv"
              rows={visible.map((x) => ({
                id: x.id,
                title: x.title,
                severity: x.severity,
                status: x.status,
                services: x.services.map(serviceName).join("; "),
                commander: person(x.commander)?.name,
                created: x.created,
                duration: x.duration,
              }))}
            />
            <Button
              variant="primary"
              icon={Plus}
              onClick={() => store.openCreate()}
            >
              Declare incident
            </Button>
          </>
        }
      />
      <div {...stylex.props(i.summary)}>
        <span>
          <strong {...stylex.props(i.summaryValue)}>{active.length}</strong>{" "}
          active incidents
        </span>
        <span>
          <strong {...stylex.props(i.summaryValue)}>
            {active.filter((x) => x.severity === "SEV1").length}
          </strong>{" "}
          high severity
        </span>
        <span>
          <strong {...stylex.props(i.summaryValue)}>
            {new Set(active.flatMap((x) => x.services)).size}
          </strong>{" "}
          impacted services
        </span>
        <span>
          <strong {...stylex.props(i.summaryValue)}>24m</strong> MTTR today
        </span>
      </div>
      <Tabs
        tabs={[
          { id: "all", label: "All incidents", count: store.incidents.length },
          { id: "active", label: "Active", count: active.length },
          {
            id: "resolved",
            label: "Resolved",
            count: store.incidents.length - active.length,
          },
        ]}
        active={tab}
        onChange={setTab}
      />
      <section {...stylex.props(s.panel, s.sectionSpace)}>
        <div {...stylex.props(s.toolbar)}>
          <SearchInput
            value={query}
            onChange={setQuery}
            placeholder="Search incidents…"
          />
          <Select
            label="Filter severity"
            value={severity}
            onChange={(e) => setSeverity(e.target.value)}
            options={["All severities", "SEV0", "SEV1", "SEV2", "SEV3"]}
          />
          <Select
            label="Filter status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            options={[
              "All statuses",
              "Investigating",
              "Identified",
              "Monitoring",
              "Resolved",
            ]}
          />
          <div {...stylex.props(s.grow)} />
          <Select
            label="Sort incidents"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            options={["Newest first", "Oldest first", "Severity"]}
          />
          <Select
            label="Incident view"
            value={view}
            onChange={(e) => setView(e.target.value)}
            options={["List", "Cards"]}
          />
        </div>
        {!visible.length ? (
          <EmptyResults onReset={reset} />
        ) : view === "Cards" ? (
          <div {...stylex.props(i.cardGrid)}>
            {visible.map((incident) => (
              <Panel key={incident.id}>
                <div {...stylex.props(s.spread)}>
                  <span {...stylex.props(i.id)}>{incident.id}</span>
                  <Badge>{incident.severity}</Badge>
                </div>
                <h2 {...stylex.props(i.listTitle, s.space8)}>
                  <AppLink to={`/incidents/${incident.id}`} subtle>
                    {incident.title}
                  </AppLink>
                </h2>
                <div {...stylex.props(s.spread, s.sectionSpace)}>
                  <Badge dot>{incident.status}</Badge>
                  <AvatarStack
                    ids={[incident.commander, ...incident.responders]}
                  />
                </div>
                <p {...stylex.props(s.secondary, s.small, s.space12)}>
                  {incident.services.map(serviceName).join(" · ")}
                  <br />
                  {incident.created} · {incident.duration}
                </p>
              </Panel>
            ))}
          </div>
        ) : (
          <div {...stylex.props(s.tableScroll)}>
            <table {...stylex.props(s.table)}>
              <thead>
                <tr>
                  {[
                    "Incident",
                    "Severity",
                    "Status",
                    "Impacted services",
                    "Commander",
                    "Started",
                    "Duration",
                    "Responders",
                  ].map((h) => (
                    <th key={h} {...stylex.props(s.th)}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visible.map((incident) => (
                  <tr key={incident.id} {...stylex.props(s.tr)}>
                    <td {...stylex.props(s.td)}>
                      <div {...stylex.props(i.id)}>{incident.id}</div>
                      <div {...stylex.props(i.listTitle)}>
                        <AppLink to={`/incidents/${incident.id}`} subtle>
                          {incident.title}
                        </AppLink>
                      </div>
                    </td>
                    <td {...stylex.props(s.td)}>
                      <Badge>{incident.severity}</Badge>
                    </td>
                    <td {...stylex.props(s.td)}>
                      <Badge dot>{incident.status}</Badge>
                    </td>
                    <td {...stylex.props(s.td)}>
                      <div {...stylex.props(s.column, s.gap6)}>
                        {incident.services.slice(0, 2).map((id) => (
                          <AppLink key={id} to={`/services/${id}`} subtle>
                            <span {...stylex.props(i.serviceChip)}>
                              {serviceName(id)}
                            </span>
                          </AppLink>
                        ))}
                        {incident.services.length > 2 && (
                          <span {...stylex.props(s.small, s.muted)}>
                            +{incident.services.length - 2} more
                          </span>
                        )}
                      </div>
                    </td>
                    <td {...stylex.props(s.td)}>
                      <PersonName id={incident.commander} />
                    </td>
                    <td {...stylex.props(s.td, s.secondary, s.small)}>
                      {incident.created}
                    </td>
                    <td {...stylex.props(s.td, s.secondary, s.small)}>
                      {incident.duration}
                    </td>
                    <td {...stylex.props(s.td)}>
                      <AvatarStack ids={incident.responders} max={3} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div {...stylex.props(s.tableFoot)}>
          <span>
            {visible.length} of {store.incidents.length} incidents
          </span>
          <span>Showing all matching incidents</span>
        </div>
      </section>
    </div>
  );
}

export function IncidentDetail({ id }: { id: string }) {
  const store = useStore();
  const go = useGo();
  const incident = store.incidents.find((x) => x.id === id);
  const [tab, setTab] = useState("activity");
  const [filter, setFilter] = useState("All updates");
  const [note, setNote] = useState("");
  const [noteKind, setNoteKind] = useState("Incident update");
  const [edit, setEdit] = useState(false);
  const [resolve, setResolve] = useState(false);
  const [taskOpen, setTaskOpen] = useState(false);
  const [comm, setComm] = useState("");
  const [audience, setAudience] = useState("Public status page");
  if (!incident)
    return (
      <div {...stylex.props(s.page)}>
        <PageHeader title="Incident not found" />
        <AppLink to="/incidents">Return to incidents</AppLink>
      </div>
    );
  const alerts = store.alerts.filter((a) => a.incident === id);
  const deploys = deployments.filter((d) => d.incident === id);
  const completed = incident.tasks.filter((t) => t.done).length;
  const latestPublicUpdate = [...incident.timeline]
    .reverse()
    .find((event) => event.text.startsWith("[Public status page]"));
  const timeline = [...incident.timeline]
    .reverse()
    .filter(
      (e) =>
        filter === "All updates" ||
        (filter === "Discussion" ? e.type === "comment" : e.type !== "comment"),
    );
  const changeStatus = (status: string) => {
    if (status === "Resolved") setResolve(true);
    else {
      store.updateIncident(id, { status: status as IncidentStatus });
      store.toast(`Incident is now ${status.toLowerCase()}.`);
    }
  };
  const toggleTask = (taskId: string) =>
    store.updateIncident(id, {
      tasks: incident.tasks.map((t) =>
        t.id === taskId ? { ...t, done: !t.done } : t,
      ),
    });
  const tasks = (
    <>
      {incident.tasks.map((task) => (
        <div key={task.id} {...stylex.props(i.task)}>
          <input
            type="checkbox"
            aria-label={`Complete ${task.title}`}
            checked={task.done}
            onChange={() => toggleTask(task.id)}
            {...stylex.props(s.checkbox)}
          />
          <div {...stylex.props(s.grow)}>
            <p {...stylex.props(i.taskTitle, task.done && i.done)}>
              {task.title}
            </p>
            <span {...stylex.props(i.taskOwner)}>
              <Avatar id={task.owner} size="small" />
              {person(task.owner)?.name} · {task.priority} · {task.due}
            </span>
          </div>
        </div>
      ))}
      <Button
        small
        icon={Plus}
        variant="ghost"
        onClick={() => setTaskOpen(true)}
      >
        Add a task
      </Button>
    </>
  );
  return (
    <div {...stylex.props(s.page)}>
      <div {...stylex.props(i.headerMeta)}>
        <AppLink to="/incidents">
          <ArrowLeft size={12} />
          Incidents
        </AppLink>
        <ChevronRight size={11} />
        <span {...stylex.props(s.mono)}>{id}</span>
        <Badge>{incident.severity}</Badge>
        <Badge dot>{incident.status}</Badge>
        <span {...stylex.props(s.row, s.gap6)}>
          <Clock3 size={12} />
          {incident.duration}
        </span>
      </div>
      <h1 {...stylex.props(i.title)}>{incident.title}</h1>
      <div {...stylex.props(i.topActions)}>
        <Select
          label="Change incident status"
          value={incident.status}
          options={["Investigating", "Identified", "Monitoring", "Resolved"]}
          onChange={(e) => changeStatus(e.target.value)}
        />
        <Button icon={Users} onClick={() => setEdit(true)}>
          Manage responders
        </Button>
        <Button icon={Pencil} onClick={() => setEdit(true)}>
          Edit incident
        </Button>
        <Button
          icon={FileText}
          onClick={() => go(`/postmortems/${store.createPostmortem(id)}`)}
        >
          Create postmortem
        </Button>
        <div {...stylex.props(s.grow)} />
        {incident.status !== "Resolved" && (
          <Button
            variant="primary"
            icon={CheckCircle2}
            onClick={() => setResolve(true)}
          >
            Resolve incident
          </Button>
        )}
      </div>
      <Tabs
        tabs={[
          {
            id: "activity",
            label: "Activity",
            count: incident.timeline.length,
          },
          { id: "alerts", label: "Alerts", count: alerts.length },
          { id: "deployments", label: "Deployments", count: deploys.length },
          {
            id: "services",
            label: "Service impact",
            count: incident.services.length,
          },
          { id: "tasks", label: "Tasks", count: incident.tasks.length },
          { id: "communication", label: "Communication" },
        ]}
        active={tab}
        onChange={setTab}
      />
      <div {...stylex.props(i.impact)}>
        <ShieldAlert size={17} />
        <div>
          <strong>Customer impact</strong>
          <p>{incident.description}</p>
        </div>
      </div>
      <div {...stylex.props(s.detailGrid)}>
        <div {...stylex.props(s.column, s.gap20)}>
          {tab === "activity" && (
            <>
              <Panel
                title={
                  id === "INC-1042"
                    ? "Checkout error rate"
                    : "Service error rate"
                }
                action={
                  <Badge
                    tone={incident.status === "Resolved" ? "green" : "orange"}
                    dot
                  >
                    {incident.status === "Resolved"
                      ? "Recovered"
                      : "Live telemetry"}
                  </Badge>
                }
              >
                <div {...stylex.props(i.telemetry)}>
                  <strong {...stylex.props(i.telemetryValue)}>
                    {id === "INC-1042" && incident.status !== "Resolved"
                      ? "8.7%"
                      : "0.3%"}
                  </strong>
                  <span {...stylex.props(i.telemetryLabel)}>
                    {id === "INC-1042"
                      ? "↓ from 21.4% peak · normal <0.5%"
                      : "Current error rate · normal <0.5%"}
                  </span>
                </div>
                <ErrorChart
                  healthy={id !== "INC-1042" || incident.status === "Resolved"}
                />
              </Panel>
              <Panel
                title="Incident timeline"
                action={
                  <Select
                    label="Timeline event filter"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    options={["All updates", "Discussion", "System events"]}
                  />
                }
                noPad
              >
                <div {...stylex.props(i.timeline)}>
                  {timeline.map((event, index) => (
                    <TimelineRow
                      key={event.id}
                      event={event}
                      last={index === timeline.length - 1}
                    />
                  ))}
                  {timeline.length === 0 && (
                    <p {...stylex.props(s.secondary, s.panelBody)}>
                      No events match this filter.
                    </p>
                  )}
                </div>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!note.trim()) return;
                    store.addEvent(
                      id,
                      `${noteKind === "Internal note" ? "[Internal] " : ""}${note.trim()}`,
                    );
                    setNote("");
                    store.toast("Update posted to the incident timeline.");
                  }}
                  {...stylex.props(i.composer)}
                >
                  <div {...stylex.props(s.row, s.bottom16)}>
                    <Avatar id="alex" />
                    <Select
                      label="Update visibility"
                      value={noteKind}
                      onChange={(e) => setNoteKind(e.target.value)}
                      options={["Incident update", "Internal note"]}
                    />
                  </div>
                  <textarea
                    aria-label="Post incident update"
                    placeholder="Share an update with your responders…"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    required
                    {...stylex.props(s.input, i.composerText)}
                  />
                  <div {...stylex.props(s.spread, s.space12)}>
                    <span {...stylex.props(s.small, s.muted)}>
                      {noteKind === "Internal note"
                        ? "Only visible to workspace members"
                        : "All responders will be notified"}
                    </span>
                    <Button
                      type="submit"
                      icon={Send}
                      variant="primary"
                      disabled={!note.trim()}
                    >
                      Post update
                    </Button>
                  </div>
                </form>
              </Panel>
            </>
          )}
          {tab === "alerts" && (
            <Panel
              title="Associated alerts"
              action={
                <Badge>
                  {alerts.filter((a) => a.state === "Firing").length} firing
                </Badge>
              }
              noPad
            >
              <div {...stylex.props(s.tableScroll)}>
                <table {...stylex.props(s.table)}>
                  <thead>
                    <tr>
                      {["Alert", "Severity", "State", "Assignee", "Action"].map(
                        (h) => (
                          <th {...stylex.props(s.th)} key={h}>
                            {h}
                          </th>
                        ),
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {alerts.map((a) => (
                      <tr key={a.id}>
                        <td {...stylex.props(s.td)}>
                          <AppLink to={`/alerts/${a.id}`}>{a.name}</AppLink>
                          <div {...stylex.props(s.muted, s.small)}>
                            {a.source} · {serviceName(a.service)}
                          </div>
                        </td>
                        <td {...stylex.props(s.td)}>
                          <Badge>{a.severity}</Badge>
                        </td>
                        <td {...stylex.props(s.td)}>
                          <Badge dot>{a.state}</Badge>
                        </td>
                        <td {...stylex.props(s.td)}>
                          <PersonName id={a.assignee} />
                        </td>
                        <td {...stylex.props(s.td)}>
                          <Button
                            small
                            disabled={a.state !== "Firing"}
                            onClick={() => {
                              store.updateAlert(a.id, {
                                state: "Acknowledged",
                              });
                              store.toast("Alert acknowledged.");
                            }}
                          >
                            {a.state === "Firing"
                              ? "Acknowledge"
                              : "Acknowledged"}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {!alerts.length && (
                <div {...stylex.props(s.panelBody)}>
                  No alerts are linked to this manually declared incident.{" "}
                  <AppLink to="/alerts">Link an alert from triage</AppLink>
                </div>
              )}
            </Panel>
          )}
          {tab === "deployments" && (
            <Panel title="Related deployments">
              {deploys.map((d) => (
                <div key={d.id} {...stylex.props(s.column, s.bottom16)}>
                  <div {...stylex.props(s.spread)}>
                    <AppLink to={`/deployments/${d.id}`}>
                      <GitBranch size={16} />
                      {d.service}@{d.version}
                    </AppLink>
                    <Badge>{d.status}</Badge>
                  </div>
                  <p {...stylex.props(s.secondary, s.small)}>
                    {d.time} · {person(d.author)?.name} · {d.environment}
                  </p>
                  <div {...stylex.props(s.note, s.dangerNote)}>
                    This release preceded the incident and is being investigated
                    as a contributing change. Commit {d.commit}, pull request{" "}
                    {d.pr}.
                  </div>
                </div>
              ))}
              {!deploys.length && (
                <p>
                  No deployments have been correlated with this incident.{" "}
                  <AppLink to="/deployments">
                    Review deployment activity
                  </AppLink>
                </p>
              )}
            </Panel>
          )}
          {tab === "services" && (
            <div {...stylex.props(s.column)}>
              {incident.services.map((svc) => (
                <Panel
                  key={svc}
                  title={
                    <AppLink to={`/services/${svc}`}>
                      {serviceName(svc)}
                      <ArrowRight size={13} />
                    </AppLink>
                  }
                  action={
                    <HealthLabel
                      health={getServiceHealth(svc, store.incidents)}
                    />
                  }
                >
                  <div {...stylex.props(s.spread)}>
                    <span {...stylex.props(s.secondary)}>
                      Owner: {services.find((s) => s.id === svc)?.team}
                    </span>
                    <Badge>{services.find((s) => s.id === svc)?.tier}</Badge>
                  </div>
                  <p {...stylex.props(s.small, s.muted, s.space8)}>
                    {
                      store.alerts.filter(
                        (a) => a.service === svc && a.state === "Firing",
                      ).length
                    }{" "}
                    firing alerts · {services.find((s) => s.id === svc)?.uptime}{" "}
                    uptime this month
                  </p>
                </Panel>
              ))}
            </div>
          )}
          {tab === "tasks" && (
            <Panel
              title={`Response tasks · ${completed}/${incident.tasks.length} complete`}
              action={
                <Button small icon={Plus} onClick={() => setTaskOpen(true)}>
                  Add task
                </Button>
              }
            >
              {tasks}
            </Panel>
          )}
          {tab === "communication" && (
            <>
              <Panel title="Customer communication">
                <div {...stylex.props(s.note)}>
                  <Radio size={16} />
                  <div>
                    <strong>
                      {latestPublicUpdate
                        ? `Latest public update · ${latestPublicUpdate.time}`
                        : "Current incident context"}
                    </strong>
                    <p>
                      {latestPublicUpdate
                        ? latestPublicUpdate.text.replace(
                            "[Public status page] ",
                            "",
                          )
                        : incident.description}
                    </p>
                  </div>
                </div>
                <form
                  {...stylex.props(s.column, s.sectionSpace)}
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!comm.trim()) return;
                    store.addEvent(id, `[${audience}] ${comm.trim()}`);
                    setComm("");
                    store.toast(
                      `Update published to ${audience.toLowerCase()}.`,
                    );
                  }}
                >
                  <Field label="Audience">
                    <Select
                      label="Communication audience"
                      value={audience}
                      onChange={(e) => setAudience(e.target.value)}
                      options={[
                        "Public status page",
                        "Internal stakeholders",
                        "Customer support",
                      ]}
                    />
                  </Field>
                  <Field label="Status update">
                    <textarea
                      required
                      value={comm}
                      onChange={(e) => setComm(e.target.value)}
                      placeholder="Write a clear update about impact, progress, and the next check-in…"
                      {...stylex.props(s.input, s.textarea)}
                    />
                  </Field>
                  <Button
                    type="submit"
                    variant="primary"
                    icon={Send}
                    disabled={!comm.trim()}
                  >
                    Publish update
                  </Button>
                </form>
              </Panel>
              <Panel title="Published updates">
                {incident.timeline
                  .filter(
                    (e) =>
                      e.text.startsWith("[Public") ||
                      e.text.startsWith("[Internal stakeholders]") ||
                      e.text.startsWith("[Customer support]"),
                  )
                  .reverse()
                  .map((event) => (
                    <TimelineRow key={event.id} event={event} last />
                  ))}
                <p {...stylex.props(s.secondary, s.small)}>
                  Published updates are also recorded in the incident timeline.
                </p>
              </Panel>
            </>
          )}
        </div>
        <aside {...stylex.props(s.column, s.gap20)}>
          <Panel
            title="Incident details"
            action={
              <Button
                small
                variant="ghost"
                icon={Pencil}
                onClick={() => setEdit(true)}
              >
                Edit
              </Button>
            }
          >
            <div {...stylex.props(i.property)}>
              <span {...stylex.props(i.propertyLabel)}>Severity</span>
              <Select
                label="Change severity"
                value={incident.severity}
                options={["SEV0", "SEV1", "SEV2", "SEV3"]}
                onChange={(e) => {
                  store.updateIncident(id, {
                    severity: e.target.value as Severity,
                  });
                  store.addEvent(
                    id,
                    `Severity changed to ${e.target.value}.`,
                    "status",
                  );
                  store.toast("Severity updated.");
                }}
              />
            </div>
            <div {...stylex.props(i.property)}>
              <span {...stylex.props(i.propertyLabel)}>Status</span>
              <Badge dot>{incident.status}</Badge>
            </div>
            <div {...stylex.props(i.property)}>
              <span {...stylex.props(i.propertyLabel)}>Started</span>
              <span {...stylex.props(s.small)}>{incident.created}</span>
            </div>
            <div {...stylex.props(i.property)}>
              <span {...stylex.props(i.propertyLabel)}>Commander</span>
              <PersonName id={incident.commander} />
            </div>
            <div {...stylex.props(i.property)}>
              <span {...stylex.props(i.propertyLabel)}>Responders</span>
              <AvatarStack ids={incident.responders} />
            </div>
            <Button
              variant="ghost"
              small
              icon={Plus}
              onClick={() => setEdit(true)}
            >
              Add responder
            </Button>
          </Panel>
          <Panel title="Affected services">
            {incident.services.map((svc) => (
              <div key={svc} {...stylex.props(i.serviceRow)}>
                <Server size={13} />
                <div {...stylex.props(s.grow)}>
                  <AppLink to={`/services/${svc}`} subtle>
                    {serviceName(svc)}
                  </AppLink>
                </div>
                <HealthLabel health={getServiceHealth(svc, store.incidents)} />
              </div>
            ))}
          </Panel>
          <Panel title={`Response tasks ${completed}/${incident.tasks.length}`}>
            {tasks}
          </Panel>
          <Panel title="Incident channels">
            <div {...stylex.props(s.column, s.gap12)}>
              <Button
                icon={Hash}
                onClick={() => {
                  setTab("activity");
                  store.toast(
                    "Incident discussion is available in the timeline.",
                  );
                }}
              >
                {id.toLowerCase()}-response
              </Button>
              <Button
                icon={Radio}
                onClick={() => {
                  setTab("communication");
                }}
              >
                Customer communication
              </Button>
              <Button
                icon={Link2}
                onClick={() => {
                  void navigator.clipboard
                    ?.writeText(window.location.href)
                    .then(() => store.toast("Incident link copied."))
                    .catch(() =>
                      store.toast(
                        "Copy the incident URL from your address bar.",
                      ),
                    );
                }}
              >
                Copy incident link
              </Button>
            </div>
          </Panel>
        </aside>
      </div>
      {edit && (
        <EditIncidentDialog
          incident={incident}
          onClose={() => setEdit(false)}
        />
      )}
      {resolve && (
        <ResolveDialog incident={incident} onClose={() => setResolve(false)} />
      )}
      {taskOpen && (
        <TaskDialog incident={incident} onClose={() => setTaskOpen(false)} />
      )}
    </div>
  );
}

function TimelineRow({ event, last }: { event: TimelineEvent; last: boolean }) {
  const Icon =
    event.type === "alert"
      ? Bell
      : event.type === "deployment"
        ? GitBranch
        : event.type === "status"
          ? CheckCircle2
          : Radio;
  return (
    <div {...stylex.props(i.event)}>
      <div {...stylex.props(i.eventRail)}>
        {event.type === "comment" && event.author ? (
          <Avatar id={event.author} />
        ) : (
          <span
            {...stylex.props(
              i.eventIcon,
              event.type === "alert" && i.alertIcon,
            )}
          >
            <Icon size={12} />
          </span>
        )}
        {!last && <span {...stylex.props(i.eventLine)} />}
      </div>
      <div>
        <div {...stylex.props(i.eventTop)}>
          <span>
            {event.author
              ? (person(event.author)?.name ?? event.author)
              : "RelayOps"}
          </span>
          {event.type !== "comment" && (
            <span {...stylex.props(s.muted, s.small)}>
              {event.type === "system" ? "automation" : event.type}
            </span>
          )}
          <time {...stylex.props(i.eventTime)}>{event.time}</time>
        </div>
        <p
          {...stylex.props(i.eventText, event.type === "comment" && i.comment)}
        >
          {event.text}
        </p>
      </div>
    </div>
  );
}

function EditIncidentDialog({
  incident,
  onClose,
}: {
  incident: Incident;
  onClose: () => void;
}) {
  const store = useStore();
  const [title, setTitle] = useState(incident.title);
  const [commander, setCommander] = useState(incident.commander);
  const [responders, setResponders] = useState(incident.responders);
  const [affected, setAffected] = useState(incident.services);
  const [description, setDescription] = useState(incident.description);
  const [error, setError] = useState("");
  return (
    <Modal
      title={`Edit ${incident.id}`}
      onClose={onClose}
      footer={
        <>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="primary" type="submit" form="edit-incident">
            Save changes
          </Button>
        </>
      }
    >
      <form
        id="edit-incident"
        {...stylex.props(s.column)}
        onSubmit={(e) => {
          e.preventDefault();
          if (!affected.length) {
            setError("Select at least one service.");
            return;
          }
          store.updateIncident(incident.id, {
            title: title.trim(),
            commander,
            responders: responders.filter((id) => id !== commander),
            services: affected,
            description: description.trim(),
          });
          store.addEvent(
            incident.id,
            "Incident properties and response team updated.",
            "status",
          );
          store.toast("Incident updated.");
          onClose();
        }}
      >
        <Field label="Title">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </Field>
        <Field label="Incident commander">
          <Select
            label="Assign commander"
            options={people.map((p) => ({ value: p.id, label: p.name }))}
            value={commander}
            onChange={(e) => setCommander(e.target.value)}
          />
        </Field>
        <fieldset {...stylex.props(s.fieldset)}>
          <legend>Responders</legend>
          <div {...stylex.props(i.options)}>
            {people
              .filter((p) => p.id !== commander)
              .map((p) => (
                <label key={p.id} {...stylex.props(s.checkLabel)}>
                  <input
                    type="checkbox"
                    checked={responders.includes(p.id)}
                    onChange={() =>
                      setResponders(
                        responders.includes(p.id)
                          ? responders.filter((id) => id !== p.id)
                          : [...responders, p.id],
                      )
                    }
                    {...stylex.props(s.checkbox)}
                  />
                  <Avatar id={p.id} size="small" />
                  {p.name}
                </label>
              ))}
          </div>
        </fieldset>
        <fieldset {...stylex.props(s.fieldset)}>
          <legend>Affected services</legend>
          <div {...stylex.props(i.options)}>
            {services.map((svc) => (
              <label key={svc.id} {...stylex.props(s.checkLabel)}>
                <input
                  type="checkbox"
                  checked={affected.includes(svc.id)}
                  onChange={() =>
                    setAffected(
                      affected.includes(svc.id)
                        ? affected.filter((id) => id !== svc.id)
                        : [...affected, svc.id],
                    )
                  }
                  {...stylex.props(s.checkbox)}
                />
                {svc.name}
              </label>
            ))}
          </div>
        </fieldset>
        <Field label="Customer impact">
          <textarea
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            {...stylex.props(s.input, s.textarea)}
          />
        </Field>
        {error && (
          <p role="alert" {...stylex.props(s.error)}>
            {error}
          </p>
        )}
      </form>
    </Modal>
  );
}
function ResolveDialog({
  incident,
  onClose,
}: {
  incident: Incident;
  onClose: () => void;
}) {
  const store = useStore();
  const [summary, setSummary] = useState("");
  const [resolveAlerts, setResolveAlerts] = useState(true);
  return (
    <Modal
      title={`Resolve ${incident.id}`}
      description="Confirm that service has recovered and capture the resolution."
      onClose={onClose}
      footer={
        <>
          <Button onClick={onClose}>Keep investigating</Button>
          <Button
            type="submit"
            form="resolve-form"
            variant="primary"
            icon={CheckCircle2}
          >
            Resolve incident
          </Button>
        </>
      }
    >
      <form
        id="resolve-form"
        {...stylex.props(s.column)}
        onSubmit={(e) => {
          e.preventDefault();
          if (!summary.trim()) return;
          store.addEvent(incident.id, `Resolution: ${summary.trim()}`);
          store.updateIncident(incident.id, { status: "Resolved" });
          if (resolveAlerts)
            store.alerts
              .filter((a) => a.incident === incident.id)
              .forEach((a) => store.updateAlert(a.id, { state: "Resolved" }));
          store.toast(
            `${incident.id} resolved. Service health has been updated.`,
          );
          onClose();
        }}
      >
        <Field label="Resolution summary *">
          <textarea
            required
            placeholder="What restored service? How did you verify recovery?"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            {...stylex.props(s.input, s.textarea)}
          />
        </Field>
        <label {...stylex.props(s.checkLabel)}>
          <input
            type="checkbox"
            checked={resolveAlerts}
            onChange={(e) => setResolveAlerts(e.target.checked)}
            {...stylex.props(s.checkbox)}
          />
          Resolve all alerts linked to this incident
        </label>
        <div {...stylex.props(s.note)}>
          <CheckCircle2 size={17} />
          The timeline will be preserved. You can create a postmortem after
          resolving.
        </div>
      </form>
    </Modal>
  );
}
function TaskDialog({
  incident,
  onClose,
}: {
  incident: Incident;
  onClose: () => void;
}) {
  const store = useStore();
  const [title, setTitle] = useState("");
  const [owner, setOwner] = useState("alex");
  const [priority, setPriority] = useState("High");
  const [due, setDue] = useState("2026-09-09");
  return (
    <Modal
      title="Add a follow-up action"
      onClose={onClose}
      footer={
        <>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" form="task-form" variant="primary">
            Create action
          </Button>
        </>
      }
    >
      <form
        id="task-form"
        {...stylex.props(s.column)}
        onSubmit={(e) => {
          e.preventDefault();
          if (!title.trim()) return;
          store.updateIncident(incident.id, {
            tasks: [
              ...incident.tasks,
              {
                id: `task-${Date.now()}`,
                title: title.trim(),
                owner,
                priority,
                due,
                done: false,
              },
            ],
          });
          store.toast("Follow-up action created.");
          onClose();
        }}
      >
        <Field label="Action *">
          <Input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Describe a specific, actionable task"
          />
        </Field>
        <Field label="Owner">
          <Select
            label="Task owner"
            options={people.map((p) => ({ value: p.id, label: p.name }))}
            value={owner}
            onChange={(e) => setOwner(e.target.value)}
          />
        </Field>
        <div {...stylex.props(s.formGrid)}>
          <Field label="Priority">
            <Select
              label="Task priority"
              options={["High", "Medium", "Low"]}
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            />
          </Field>
          <Field label="Due date">
            <Input
              type="date"
              required
              value={due}
              onChange={(e) => setDue(e.target.value)}
            />
          </Field>
        </div>
      </form>
    </Modal>
  );
}
