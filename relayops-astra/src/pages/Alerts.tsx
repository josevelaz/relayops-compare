import * as stylex from "@stylexjs/stylex";
import { useEffect, useState } from "react";
import {
  Bell,
  Check,
  CheckCheck,
  ChevronRight,
  Clock3,
  ExternalLink,
  Plus,
  Radio,
  ShieldAlert,
  Users,
  Zap,
} from "lucide-react";
import { people, person, serviceName, type Alert } from "../data";
import { useStore } from "../state";
import {
  AppLink,
  Badge,
  Button,
  EmptyResults,
  ExportButton,
  Field,
  Modal,
  PageHeader,
  PersonName,
  SearchInput,
  Select,
  Tabs,
  s,
  useGo,
} from "../components/ui";
import { ErrorChart } from "../components/charts";

const a = stylex.create({
  signal: {
    display: "grid",
    gridTemplateColumns: {
      default: "1fr 1fr 2fr",
      "@media (max-width: 720px)": "1fr 1fr",
    },
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#e4e9de",
    borderRadius: 8,
    backgroundColor: "#fff",
    padding: "20px 22px",
    marginBottom: 25,
    gap: 20,
  },
  signalValue: {
    fontSize: 28,
    fontWeight: 550,
    color: "#597648",
    letterSpacing: "-.8px",
  },
  signalLabel: { fontSize: 10, color: "#94a082", marginTop: 3 },
  signalNote: {
    borderLeftWidth: {
      default: 1,
      "@media (max-width: 720px)": 0,
    },
    borderLeftStyle: "solid",
    borderLeftColor: "#e8eedf",
    paddingLeft: { default: 24, "@media (max-width: 720px)": 0 },
    gridColumn: { default: "auto", "@media (max-width: 720px)": "1 / -1" },
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    gap: 6,
  },
  title: {
    fontSize: 11.5,
    fontWeight: 500,
    minWidth: 240,
    whiteSpace: "normal",
    color: "#557046",
  },
  source: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontSize: 10,
    color: "#7d8d6b",
  },
  sourceLogo: {
    width: 17,
    height: 17,
    borderRadius: 4,
    backgroundColor: "#f0edf7",
    color: "#9682b2",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 9,
    fontWeight: 600,
  },
  selected: { backgroundColor: "#f4f8ef" },
  bulk: {
    display: "flex",
    gap: 10,
    alignItems: "center",
    padding: "10px 18px",
    backgroundColor: "#edf5e7",
    color: "#648651",
    borderBottomWidth: 1,
    borderBottomStyle: "solid",
    borderBottomColor: "#dce9d2",
    fontSize: 11,
    flexWrap: "wrap",
  },
  detailGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 17 },
  label: { color: "#a1ad92", fontSize: 10, marginBottom: 5 },
  detailSection: {
    borderTopWidth: 1,
    borderTopStyle: "solid",
    borderTopColor: "#e9efdf",
    paddingTop: 17,
    marginTop: 17,
  },
});

export function AlertsPage({ selectedId }: { selectedId?: string }) {
  const store = useStore();
  const go = useGo();
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState("all");
  const [severity, setSeverity] = useState("All severities");
  const [source, setSource] = useState("All sources");
  const [selected, setSelected] = useState<string[]>([]);
  const [bulkOwner, setBulkOwner] = useState("");
  useEffect(() => {
    setSelected([]);
  }, [query, tab, severity, source]);
  const firing = store.alerts.filter((x) => x.state === "Firing");
  const acknowledged = store.alerts.filter((x) => x.state === "Acknowledged");
  const visible = store.alerts.filter(
    (x) =>
      (tab === "all" || x.state.toLowerCase() === tab) &&
      (severity === "All severities" || x.severity === severity) &&
      (source === "All sources" || x.source === source) &&
      `${x.name} ${x.id} ${serviceName(x.service)} ${x.incident ?? ""}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  const toggle = (id: string) =>
    setSelected(
      selected.includes(id)
        ? selected.filter((x) => x !== id)
        : [...selected, id],
    );
  const chosen = store.alerts.find((x) => x.id === selectedId);
  return (
    <div {...stylex.props(s.page)}>
      <PageHeader
        title="Alert triage"
        description="Find the signal. Take ownership. Keep the noise under control."
        actions={
          <>
            <ExportButton
              filename="relayops-alerts.csv"
              rows={visible.map((x) => ({ ...x }))}
            />
            <Button
              icon={Plus}
              variant="primary"
              onClick={() => store.openCreate()}
            >
              Declare incident
            </Button>
          </>
        }
      />
      <div {...stylex.props(a.signal)}>
        <div>
          <div {...stylex.props(s.overline)}>Needs a response</div>
          <div {...stylex.props(a.signalValue)}>
            {firing.length}
            <span {...stylex.props(s.small, s.muted)} style={{ marginLeft: 8 }}>
              firing alerts
            </span>
          </div>
          <p {...stylex.props(a.signalLabel)}>
            {firing.filter((x) => x.severity === "SEV1").length} high severity ·{" "}
            {firing.filter((x) => !x.assignee).length} unassigned
          </p>
        </div>
        <div>
          <div {...stylex.props(s.overline)}>Under control</div>
          <div {...stylex.props(a.signalValue)}>
            {acknowledged.length}
            <span {...stylex.props(s.small, s.muted)} style={{ marginLeft: 8 }}>
              acknowledged
            </span>
          </div>
          <p {...stylex.props(a.signalLabel)}>
            Median acknowledge time: 2m 14s
          </p>
        </div>
        <div {...stylex.props(a.signalNote)}>
          <span {...stylex.props(s.row, s.bold, s.small, s.green)}>
            <Zap size={14} />
            More context, fewer interruptions
          </span>
          <p {...stylex.props(s.secondary, s.small)}>
            {
              store.alerts.filter(
                (a) =>
                  a.state !== "Resolved" &&
                  store.incidents.some(
                    (i) => i.id === a.incident && i.status !== "Resolved",
                  ),
              ).length
            }{" "}
            alerts are grouped into{" "}
            {
              new Set(
                store.alerts
                  .filter(
                    (a) =>
                      a.state !== "Resolved" &&
                      store.incidents.some(
                        (i) => i.id === a.incident && i.status !== "Resolved",
                      ),
                  )
                  .map((a) => a.incident),
              ).size
            }{" "}
            active incidents. Review high-severity signals first.
          </p>
        </div>
      </div>
      <Tabs
        tabs={[
          { id: "all", label: "All alerts", count: store.alerts.length },
          { id: "firing", label: "Firing", count: firing.length },
          {
            id: "acknowledged",
            label: "Acknowledged",
            count: acknowledged.length,
          },
          {
            id: "resolved",
            label: "Resolved",
            count: store.alerts.filter((x) => x.state === "Resolved").length,
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
            placeholder="Search alerts or services…"
          />
          <Select
            label="Alert severity filter"
            options={["All severities", "SEV0", "SEV1", "SEV2", "SEV3"]}
            value={severity}
            onChange={(e) => setSeverity(e.target.value)}
          />
          <Select
            label="Alert source filter"
            options={[
              "All sources",
              "Datadog",
              "Grafana",
              "CloudWatch",
              "Sentry",
              "Custom",
            ]}
            value={source}
            onChange={(e) => setSource(e.target.value)}
          />
          <span {...stylex.props(s.grow)} />
          <span {...stylex.props(s.row, s.small, s.muted)}>
            <Radio size={12} />
            Live queue
          </span>
        </div>
        {selected.length > 0 && (
          <div {...stylex.props(a.bulk)}>
            <strong>{selected.length} selected</strong>
            <Button
              small
              icon={CheckCheck}
              onClick={() => {
                selected.forEach((id) => {
                  if (store.alerts.find((x) => x.id === id)?.state === "Firing")
                    store.updateAlert(id, { state: "Acknowledged" });
                });
                setSelected([]);
                store.toast("Selected firing alerts acknowledged.");
              }}
            >
              Acknowledge
            </Button>
            <Select
              label="Assign selected alerts"
              options={[
                { value: "", label: "Assign to…" },
                ...people.map((p) => ({ value: p.id, label: p.name })),
              ]}
              value={bulkOwner}
              onChange={(e) => {
                const owner = e.target.value;
                if (!owner) return;
                selected.forEach((id) =>
                  store.updateAlert(id, { assignee: owner }),
                );
                setSelected([]);
                setBulkOwner("");
                store.toast(
                  `Selected alerts assigned to ${person(owner)?.name}.`,
                );
              }}
            />
            <Button small variant="ghost" onClick={() => setSelected([])}>
              Clear selection
            </Button>
          </div>
        )}
        <div {...stylex.props(s.tableScroll)}>
          <table {...stylex.props(s.table)}>
            <thead>
              <tr>
                <th {...stylex.props(s.th)}>
                  <input
                    type="checkbox"
                    aria-label="Select all visible alerts"
                    checked={
                      visible.length > 0 &&
                      visible.every((x) => selected.includes(x.id))
                    }
                    onChange={(e) =>
                      setSelected(
                        e.target.checked ? visible.map((x) => x.id) : [],
                      )
                    }
                    {...stylex.props(s.checkbox)}
                  />
                </th>
                {[
                  "Alert",
                  "Severity",
                  "Source",
                  "State",
                  "Triggered / duration",
                  "Assignee",
                  "Incident",
                  "",
                ].map((h) => (
                  <th key={h} {...stylex.props(s.th)}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visible.map((alert) => (
                <tr
                  key={alert.id}
                  {...stylex.props(
                    s.tr,
                    selected.includes(alert.id) && a.selected,
                  )}
                >
                  <td {...stylex.props(s.td)}>
                    <input
                      type="checkbox"
                      aria-label={`Select ${alert.name}`}
                      checked={selected.includes(alert.id)}
                      onChange={() => toggle(alert.id)}
                      {...stylex.props(s.checkbox)}
                    />
                  </td>
                  <td {...stylex.props(s.td)}>
                    <div {...stylex.props(a.title)}>
                      <AppLink to={`/alerts/${alert.id}`} subtle>
                        {alert.name}
                      </AppLink>
                    </div>
                    <div {...stylex.props(s.small, s.muted, s.space8)}>
                      <AppLink to={`/services/${alert.service}`} subtle>
                        {serviceName(alert.service)}
                      </AppLink>
                    </div>
                  </td>
                  <td {...stylex.props(s.td)}>
                    <Badge>{alert.severity}</Badge>
                  </td>
                  <td {...stylex.props(s.td)}>
                    <span {...stylex.props(a.source)}>
                      <span {...stylex.props(a.sourceLogo)}>
                        {alert.source[0]}
                      </span>
                      {alert.source}
                    </span>
                  </td>
                  <td {...stylex.props(s.td)}>
                    <Badge dot>{alert.state}</Badge>
                  </td>
                  <td {...stylex.props(s.td, s.small, s.secondary)}>
                    {alert.time}
                    <div {...stylex.props(s.muted)}>{alert.duration}</div>
                  </td>
                  <td {...stylex.props(s.td)}>
                    <PersonName id={alert.assignee} />
                  </td>
                  <td {...stylex.props(s.td)}>
                    {alert.incident ? (
                      <AppLink to={`/incidents/${alert.incident}`}>
                        {alert.incident}
                      </AppLink>
                    ) : (
                      <span {...stylex.props(s.muted)}>—</span>
                    )}
                  </td>
                  <td {...stylex.props(s.td)}>
                    <Button
                      small
                      icon={alert.state === "Firing" ? Check : ChevronRight}
                      onClick={() => {
                        if (alert.state === "Firing") {
                          store.updateAlert(alert.id, {
                            state: "Acknowledged",
                          });
                          store.toast("Alert acknowledged.");
                        } else go(`/alerts/${alert.id}`);
                      }}
                    >
                      {alert.state === "Firing" ? "Acknowledge" : "Inspect"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!visible.length && (
          <EmptyResults
            onReset={() => {
              setQuery("");
              setSeverity("All severities");
              setSource("All sources");
              setTab("all");
            }}
          />
        )}
        <div {...stylex.props(s.tableFoot)}>
          <span>
            {visible.length} of {store.alerts.length} alerts
          </span>
          <span>Sorted by urgency · Updated just now</span>
        </div>
      </section>
      {chosen && <AlertDetail alert={chosen} onClose={() => go("/alerts")} />}
    </div>
  );
}

function AlertDetail({
  alert,
  onClose,
}: {
  alert: Alert;
  onClose: () => void;
}) {
  const store = useStore();
  const [incident, setIncident] = useState(alert.incident ?? "");
  const go = useGo();
  return (
    <Modal
      title={alert.name}
      description={`${alert.id} · ${serviceName(alert.service)}`}
      onClose={onClose}
      wide
      footer={
        <>
          <Button
            icon={Plus}
            onClick={() => {
              onClose();
              if (alert.incident) go(`/incidents/${alert.incident}`);
              else store.openCreate(alert.id);
            }}
          >
            {alert.incident ? "Open incident" : "Create incident"}
          </Button>
          {alert.state === "Firing" ? (
            <Button
              variant="primary"
              icon={Check}
              onClick={() => {
                store.updateAlert(alert.id, { state: "Acknowledged" });
                store.toast("Alert acknowledged.");
              }}
            >
              Acknowledge alert
            </Button>
          ) : (
            <Button
              variant="primary"
              disabled={alert.state === "Resolved"}
              icon={CheckCheck}
              onClick={() => {
                store.updateAlert(alert.id, { state: "Resolved" });
                store.toast("Alert resolved.");
              }}
            >
              Resolve alert
            </Button>
          )}
        </>
      }
    >
      <div {...stylex.props(s.row, s.bottom16)}>
        <Badge>{alert.severity}</Badge>
        <Badge dot>{alert.state}</Badge>
        <span {...stylex.props(s.small, s.muted)}>
          Triggered at {alert.time} · {alert.duration}
        </span>
      </div>
      <ErrorChart
        healthy={
          alert.state === "Resolved" ||
          (alert.service !== "payment-gateway" &&
            alert.service !== "checkout-api")
        }
        label={`${alert.name} monitor history`}
      />
      <div {...stylex.props(a.detailGrid, a.detailSection)}>
        <div>
          <div {...stylex.props(a.label)}>Source</div>
          <span {...stylex.props(a.source)}>
            <span {...stylex.props(a.sourceLogo)}>{alert.source[0]}</span>
            {alert.source}
          </span>
        </div>
        <div>
          <div {...stylex.props(a.label)}>Service</div>
          <AppLink to={`/services/${alert.service}`}>
            {serviceName(alert.service)}
          </AppLink>
        </div>
        <Field label="Assigned to">
          <Select
            label="Alert assignee"
            value={alert.assignee}
            onChange={(e) => {
              store.updateAlert(alert.id, { assignee: e.target.value });
              store.toast("Alert assignee updated.");
            }}
            options={[
              { value: "", label: "Unassigned" },
              ...people.map((p) => ({ value: p.id, label: p.name })),
            ]}
          />
        </Field>
        <Field label="Related incident">
          <Select
            label="Associate with incident"
            value={incident}
            onChange={(e) => {
              setIncident(e.target.value);
              store.updateAlert(alert.id, {
                incident: e.target.value || undefined,
              });
              store.toast(
                e.target.value
                  ? `Linked to ${e.target.value}.`
                  : "Incident unlinked.",
              );
            }}
            options={[
              { value: "", label: "No incident" },
              ...store.incidents.map((i) => ({
                value: i.id,
                label: `${i.id} · ${i.title}`,
              })),
            ]}
          />
        </Field>
      </div>
      <div {...stylex.props(s.note, s.sectionSpace)}>
        <Bell size={16} />
        <div>
          <strong>Monitor context</strong>
          <p>
            {alert.name}. Evaluated over a rolling 5-minute window in
            production, us-east-1. Notification route:{" "}
            {serviceName(alert.service)} owner → team secondary → incident
            commander. Acknowledge the alert to stop repeated pages while you
            investigate.
          </p>
        </div>
      </div>
    </Modal>
  );
}
