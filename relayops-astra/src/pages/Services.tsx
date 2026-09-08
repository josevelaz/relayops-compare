import * as stylex from "@stylexjs/stylex";
import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Bell,
  BookOpen,
  Box,
  ChevronRight,
  Code2,
  GitBranch,
  Github,
  Globe,
  Headphones,
  Layers,
  Network,
  Server,
  ShieldAlert,
  Star,
  Users,
} from "lucide-react";
import {
  deployments,
  person,
  serviceName,
  services,
  teams,
  type Service,
} from "../data";
import { useStore } from "../state";
import {
  AppLink,
  Avatar,
  AvatarStack,
  Badge,
  Button,
  EmptyResults,
  HealthLabel,
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
import { ErrorChart, Sparkline, UptimeBars } from "../components/charts";

const c = stylex.create({
  catalogHead: { padding: "17px 19px 0" },
  serviceIcon: {
    width: 36,
    height: 36,
    borderRadius: 9,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#e0e8d8",
    backgroundColor: "#f2f6ec",
    color: "#85a16c",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  serviceName: {
    fontSize: 13,
    fontWeight: 550,
    color: "#577147",
    letterSpacing: "-.2px",
  },
  serviceTeam: { fontSize: 11, color: "#738263", marginTop: 3 },
  catalogBody: { padding: "16px 19px" },
  reliability: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: 9,
    color: "#a2ae93",
    marginBottom: 7,
  },
  catalogFoot: {
    backgroundColor: "#fcfdf9",
    borderTopWidth: 1,
    borderTopStyle: "solid",
    borderTopColor: "#edf1e3",
    display: "flex",
    alignItems: "center",
    padding: "11px 18px",
    fontSize: 9.5,
    gap: 12,
    color: "#99aa84",
  },
  stats: {
    display: "grid",
    gridTemplateColumns: {
      default: "repeat(4, 1fr)",
      "@media (max-width: 650px)": "repeat(2, 1fr)",
    },
    gap: 18,
    marginBottom: 22,
  },
  stat: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#e1e9d8",
    borderRadius: 8,
    padding: "16px 19px",
  },
  statLabel: { fontSize: 10, color: "#92a07f", marginBottom: 9 },
  statValue: {
    fontSize: 25,
    fontWeight: 550,
    color: "#57794a",
    letterSpacing: "-.8px",
  },
  metadata: {
    display: "flex",
    gap: 17,
    flexWrap: "wrap",
    marginBlock: "12px 24px",
    color: "#9dad8d",
    fontSize: 11,
  },
  metadataItem: { display: "flex", gap: 6, alignItems: "center" },
  incidentRow: {
    padding: "14px 0",
    borderBottomWidth: 1,
    borderBottomStyle: "solid",
    borderBottomColor: "#ebf0e0",
    display: "flex",
    alignItems: "flex-start",
    gap: 12,
  },
  incidentTitle: { fontSize: 11.5, fontWeight: 500, color: "#718b5c" },
  sideRow: {
    paddingBlock: 9,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    fontSize: 10,
    color: "#6f8260",
    borderBottomWidth: 1,
    borderBottomStyle: "solid",
    borderBottomColor: "#eff3e6",
  },
  graph: {
    display: "grid",
    gridTemplateColumns: "1fr 24px 1.1fr 24px 1fr",
    gap: 6,
    alignItems: "center",
    padding: "18px 0",
    overflowX: "auto",
  },
  graphNode: {
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#e0e8d3",
    borderRadius: 6,
    padding: "11px 9px",
    fontSize: 9,
    color: "#839970",
    backgroundColor: "#fafcf5",
    textAlign: "center",
    minHeight: 48,
    display: "flex",
    gap: 5,
    alignItems: "center",
    justifyContent: "center",
    ":hover": { borderColor: "#afc298" },
  },
  graphMain: {
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#e6ccaa",
    backgroundColor: "#fcf6eb",
    color: "#ad9062",
    minHeight: 90,
  },
  graphColumn: { display: "flex", flexDirection: "column", gap: 10 },
  graphLabel: {
    fontSize: 8,
    letterSpacing: 0.6,
    color: "#a6b296",
    textTransform: "uppercase",
    textAlign: "center",
  },
  detailIcon: { width: 47, height: 47, borderRadius: 11 },
  dependency: {
    padding: "14px 0",
    borderBottomWidth: 1,
    borderBottomStyle: "solid",
    borderBottomColor: "#edf2e1",
    display: "flex",
    justifyContent: "space-between",
    gap: 10,
    alignItems: "center",
  },
});

export function ServicesPage() {
  const store = useStore();
  const [query, setQuery] = useState("");
  const [health, setHealth] = useState("All health");
  const [team, setTeam] = useState("All teams");
  const [tier, setTier] = useState("All tiers");
  const [view, setView] = useState("Grid");
  const visible = services.filter(
    (x) =>
      `${x.name} ${x.repo} ${x.runtime} ${x.team}`
        .toLowerCase()
        .includes(query.toLowerCase()) &&
      (health === "All health" ||
        getServiceHealth(x.id, store.incidents) === health) &&
      (team === "All teams" || team === x.team) &&
      (tier === "All tiers" || tier === x.tier),
  );
  return (
    <div {...stylex.props(s.page)}>
      <PageHeader
        title="Service catalog"
        description="Know what you own, how it’s doing, and who to call."
        actions={
          <Button
            icon={Network}
            onClick={() => {
              setView(view === "Grid" ? "Table" : "Grid");
            }}
          >
            {view === "Grid" ? "Table view" : "Grid view"}
          </Button>
        }
      />
      <div {...stylex.props(s.note, s.bottom16)}>
        <Server size={16} />
        <span>
          <strong>12 core services</strong> in your catalog · part of 47
          production services across Northstar Labs.{" "}
          {
            new Set(
              store.incidents
                .filter((i) => i.status !== "Resolved")
                .flatMap((i) => i.services),
            ).size
          }{" "}
          services are impacted by active incidents.
        </span>
      </div>
      <div {...stylex.props(s.toolbar, s.panel, s.bottom16)}>
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Find a service…"
        />
        <Select
          label="Service health filter"
          options={["All health", "Operational", "Degraded", "Partial outage"]}
          value={health}
          onChange={(e) => setHealth(e.target.value)}
        />
        <Select
          label="Service team filter"
          options={["All teams", ...teams.map((t) => t.name)]}
          value={team}
          onChange={(e) => setTeam(e.target.value)}
        />
        <Select
          label="Service tier filter"
          options={["All tiers", "Tier 1", "Tier 2", "Tier 3"]}
          value={tier}
          onChange={(e) => setTier(e.target.value)}
        />
        <span {...stylex.props(s.grow)} />
        <span {...stylex.props(s.small, s.muted)}>
          {visible.length} services
        </span>
      </div>
      {!visible.length ? (
        <EmptyResults
          onReset={() => {
            setQuery("");
            setHealth("All health");
            setTeam("All teams");
            setTier("All tiers");
          }}
        />
      ) : view === "Grid" ? (
        <div {...stylex.props(s.grid3)}>
          {visible.map((service) => (
            <ServiceCard service={service} key={service.id} />
          ))}
        </div>
      ) : (
        <div {...stylex.props(s.panel, s.tableScroll)}>
          <table {...stylex.props(s.table)}>
            <thead>
              <tr>
                {[
                  "Service",
                  "Health",
                  "Team",
                  "Tier",
                  "Uptime",
                  "Owner",
                  "Runtime",
                  "Repository",
                ].map((h) => (
                  <th {...stylex.props(s.th)} key={h}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visible.map((service) => (
                <tr {...stylex.props(s.tr)} key={service.id}>
                  <td {...stylex.props(s.td)}>
                    <AppLink to={`/services/${service.id}`}>
                      {service.name}
                    </AppLink>
                  </td>
                  <td {...stylex.props(s.td)}>
                    <HealthLabel
                      health={getServiceHealth(service.id, store.incidents)}
                    />
                  </td>
                  <td {...stylex.props(s.td, s.small)}>{service.team}</td>
                  <td {...stylex.props(s.td)}>
                    <Badge>{service.tier}</Badge>
                  </td>
                  <td {...stylex.props(s.td, s.small)}>{service.uptime}</td>
                  <td {...stylex.props(s.td)}>
                    <PersonName id={service.owner} />
                  </td>
                  <td {...stylex.props(s.td, s.small)}>{service.runtime}</td>
                  <td {...stylex.props(s.td, s.mono)}>{service.repo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export function ServiceCard({ service }: { service: Service }) {
  const store = useStore();
  const health = getServiceHealth(service.id, store.incidents);
  const active = store.incidents.filter(
    (i) => i.status !== "Resolved" && i.services.includes(service.id),
  );
  const alerts = store.alerts.filter(
    (a) => a.service === service.id && a.state === "Firing",
  );
  const latest = deployments.find((d) => d.service === service.id);
  return (
    <article {...stylex.props(s.panel)}>
      <div {...stylex.props(c.catalogHead)}>
        <div {...stylex.props(s.spread)}>
          <div {...stylex.props(s.row)}>
            <div {...stylex.props(c.serviceIcon)}>
              {service.id.includes("gateway") ? (
                <Network size={17} />
              ) : (
                <Box size={17} />
              )}
            </div>
            <div>
              <h2 {...stylex.props(c.serviceName)}>
                <AppLink to={`/services/${service.id}`} subtle>
                  {service.name}
                </AppLink>
              </h2>
              <p {...stylex.props(c.serviceTeam)}>
                {service.team} · {service.runtime}
              </p>
            </div>
          </div>
          <Badge>{service.tier}</Badge>
        </div>
      </div>
      <div {...stylex.props(c.catalogBody)}>
        <div {...stylex.props(s.spread, s.bottom16)}>
          <HealthLabel health={health} />
          <Avatar id={service.owner} size="small" />
        </div>
        <div {...stylex.props(c.reliability)}>
          <span>Uptime · last 30 days</span>
          <strong>{service.uptime}</strong>
        </div>
        <UptimeBars degraded={health !== "Operational"} />
        <div {...stylex.props(s.spread, s.space8, s.small, s.muted)}>
          <span>30 days ago</span>
          <span>Today</span>
        </div>
      </div>
      <div {...stylex.props(c.catalogFoot)}>
        <span {...stylex.props(s.row, s.gap6)}>
          <ShieldAlert size={11} />
          {active.length} incident{active.length !== 1 ? "s" : ""}
        </span>
        <span {...stylex.props(s.row, s.gap6)}>
          <Bell size={11} />
          {alerts.length} alerts
        </span>
        <span {...stylex.props(s.grow)} />
        <span
          title={
            latest
              ? `Latest deployment: ${latest.time}`
              : "No deployment in the past day"
          }
          {...stylex.props(s.row, s.gap6)}
        >
          <GitBranch size={11} />
          {latest ? `v${latest.version}` : "stable"}
        </span>
      </div>
    </article>
  );
}

export function ServiceDetail({ id }: { id: string }) {
  const store = useStore();
  const go = useGo();
  const service = services.find((x) => x.id === id);
  const [tab, setTab] = useState("overview");
  const [runbook, setRunbook] = useState(false);
  const [starred, setStarred] = useState(false);
  const [page, setPage] = useState(false);
  const [pageReason, setPageReason] = useState("");
  if (!service)
    return (
      <div {...stylex.props(s.page)}>
        <PageHeader title="Service not found" />
        <AppLink to="/services">Return to catalog</AppLink>
      </div>
    );
  const health = getServiceHealth(id, store.incidents);
  const team = teams.find((t) => t.name === service.team)!;
  const oncall = store.schedule[`${team.id}-primary`] ?? team.primary;
  const active = store.incidents.filter(
    (x) => x.status !== "Resolved" && x.services.includes(id),
  );
  const allIncidents = store.incidents.filter((x) => x.services.includes(id));
  const alerts = store.alerts.filter(
    (x) => x.service === id && x.state !== "Resolved",
  );
  const relatedDeploys = deployments.filter((d) => d.service === id);
  const dependents = services.filter((s) => s.dependencies.includes(id));
  return (
    <div {...stylex.props(s.page)}>
      <div {...stylex.props(s.row, s.small, s.muted, s.bottom16)}>
        <AppLink to="/services">
          <ArrowLeft size={12} />
          Service catalog
        </AppLink>
        <ChevronRight size={11} />
        {service.name}
      </div>
      <PageHeader
        title={service.name}
        description={
          id === "payment-gateway"
            ? "Payment authorization, routing, and processing for every checkout."
            : `${service.name} · Production service owned by the ${service.team} team.`
        }
        actions={
          <>
            <Button
              icon={Star}
              onClick={() => {
                setStarred(!starred);
                store.toast(
                  starred
                    ? "Service removed from favorites."
                    : "Service added to favorites.",
                );
              }}
            >
              {starred ? "Following" : "Follow service"}
            </Button>
            <Button icon={BookOpen} onClick={() => setRunbook(true)}>
              Runbook
            </Button>
          </>
        }
      />
      <div {...stylex.props(c.metadata)}>
        <HealthLabel health={health} />
        <Badge>{service.tier}</Badge>
        <span {...stylex.props(c.metadataItem)}>
          <Users size={13} />
          <AppLink to={`/teams/${team.id}`} subtle>
            {team.name}
          </AppLink>
        </span>
        <span {...stylex.props(c.metadataItem)}>
          <Github size={13} />
          {service.repo}
        </span>
        <span {...stylex.props(c.metadataItem)}>
          <Code2 size={13} />
          {service.runtime}
        </span>
        <span {...stylex.props(c.metadataItem)}>
          <Globe size={13} />
          us-east-1
        </span>
      </div>
      <Tabs
        tabs={[
          { id: "overview", label: "Overview" },
          { id: "incidents", label: "Incidents", count: allIncidents.length },
          {
            id: "deployments",
            label: "Deployments",
            count: relatedDeploys.length,
          },
          {
            id: "dependencies",
            label: "Dependencies",
            count: service.dependencies.length,
          },
          { id: "changes", label: "Recent changes" },
        ]}
        active={tab}
        onChange={setTab}
      />
      <div {...stylex.props(s.sectionSpace)}>
        {active.length > 0 && (
          <div {...stylex.props(s.note, s.dangerNote, s.bottom16)}>
            <ShieldAlert size={16} />
            <div>
              <strong>
                This service is impacted by {active.length} active incident
                {active.length > 1 ? "s" : ""}.
              </strong>
              <div {...stylex.props(s.space8)}>
                {active.map((x) => (
                  <AppLink key={x.id} to={`/incidents/${x.id}`}>
                    {x.id}: {x.title}
                    <ArrowRight size={12} />
                  </AppLink>
                ))}
              </div>
            </div>
          </div>
        )}
        <div {...stylex.props(c.stats)}>
          {[
            {
              label: "Reliability · 30 days",
              value: service.uptime,
              note: "SLO target 99.95%",
            },
            {
              label: "P95 latency",
              value:
                health === "Operational" && id === "payment-gateway"
                  ? "142 ms"
                  : service.latency,
              note: "Last 5 minutes",
            },
            {
              label: "Error rate",
              value:
                health !== "Operational" &&
                ["payment-gateway", "checkout-api"].includes(id)
                  ? "8.7%"
                  : "0.03%",
              note:
                health !== "Operational"
                  ? "Above normal baseline"
                  : "Within normal baseline",
            },
            {
              label: "Active alerts",
              value: String(alerts.filter((a) => a.state === "Firing").length),
              note: `${active.length} open incident${active.length !== 1 ? "s" : ""}`,
            },
          ].map((stat) => (
            <div {...stylex.props(c.stat)} key={stat.label}>
              <div {...stylex.props(c.statLabel)}>{stat.label}</div>
              <div {...stylex.props(c.statValue)}>{stat.value}</div>
              <div {...stylex.props(s.muted, s.small, s.space8)}>
                {stat.note}
              </div>
            </div>
          ))}
        </div>
        <div {...stylex.props(s.detailGrid)}>
          <div {...stylex.props(s.column, s.gap20)}>
            {tab === "overview" && (
              <>
                <Panel
                  title={
                    health === "Operational"
                      ? "Reliability over time"
                      : "Error rate & recovery"
                  }
                  action={
                    <Badge
                      dot
                      tone={health === "Operational" ? "green" : "orange"}
                    >
                      Live · last hour
                    </Badge>
                  }
                >
                  <ErrorChart
                    healthy={health === "Operational"}
                    kind={health === "Operational" ? "reliability" : "error"}
                  />
                </Panel>
                <Panel
                  title="Service relationships"
                  action={
                    <Button
                      small
                      variant="ghost"
                      onClick={() => setTab("dependencies")}
                    >
                      Explore <ArrowRight size={11} />
                    </Button>
                  }
                >
                  <div {...stylex.props(c.graph)}>
                    <div {...stylex.props(c.graphColumn)}>
                      <span {...stylex.props(c.graphLabel)}>
                        Dependent services
                      </span>
                      {(dependents.length ? dependents : []).map((x) => (
                        <button
                          key={x.id}
                          {...stylex.props(c.graphNode)}
                          onClick={() => go(`/services/${x.id}`)}
                        >
                          <Server size={12} />
                          {x.name}
                        </button>
                      ))}
                      {!dependents.length && (
                        <div {...stylex.props(s.small, s.muted)}>
                          No inbound dependencies
                        </div>
                      )}
                    </div>
                    <ArrowRight size={19} color="#becbab" />
                    <div
                      {...stylex.props(
                        c.graphNode,
                        health !== "Operational" && c.graphMain,
                      )}
                    >
                      <Network size={16} />
                      <strong>{service.name}</strong>
                    </div>
                    <ArrowRight size={19} color="#becbab" />
                    <div {...stylex.props(c.graphColumn)}>
                      <span {...stylex.props(c.graphLabel)}>Depends on</span>
                      {service.dependencies.map((dep) => (
                        <button
                          key={dep}
                          {...stylex.props(c.graphNode)}
                          onClick={() => go(`/services/${dep}`)}
                        >
                          <Server size={12} />
                          {serviceName(dep)}
                        </button>
                      ))}
                      {!service.dependencies.length && (
                        <span {...stylex.props(s.small, s.muted)}>
                          No downstream services
                        </span>
                      )}
                    </div>
                  </div>
                  <p {...stylex.props(s.small, s.muted)}>
                    Arrows show request direction. Select a service to inspect
                    its operational context.
                  </p>
                </Panel>
                <Panel
                  title="Active alerts"
                  action={
                    <AppLink to="/alerts">
                      Open triage
                      <ArrowRight size={12} />
                    </AppLink>
                  }
                >
                  {alerts.map((alert) => (
                    <div key={alert.id} {...stylex.props(c.incidentRow)}>
                      <Badge>{alert.severity}</Badge>
                      <div {...stylex.props(s.grow)}>
                        <AppLink to={`/alerts/${alert.id}`}>
                          {alert.name}
                        </AppLink>
                        <p {...stylex.props(s.small, s.muted, s.space8)}>
                          {alert.source} · {alert.time} ·{" "}
                          {person(alert.assignee)?.name ?? "Unassigned"}
                        </p>
                      </div>
                      <Badge dot>{alert.state}</Badge>
                    </div>
                  ))}
                  {!alerts.length && (
                    <p {...stylex.props(s.green)}>
                      No active alerts. All monitored signals are within normal
                      thresholds.
                    </p>
                  )}
                </Panel>
              </>
            )}
            {tab === "incidents" && (
              <Panel title="Incident history">
                {allIncidents.map((x) => (
                  <div key={x.id} {...stylex.props(c.incidentRow)}>
                    <Badge>{x.severity}</Badge>
                    <div {...stylex.props(s.grow)}>
                      <AppLink to={`/incidents/${x.id}`}>{x.title}</AppLink>
                      <p {...stylex.props(s.small, s.muted, s.space8)}>
                        {x.id} · {x.created} · {x.duration}
                      </p>
                    </div>
                    <Badge dot>{x.status}</Badge>
                  </div>
                ))}
                {!allIncidents.length && (
                  <p {...stylex.props(s.green)}>
                    No incidents recorded for this service in the current
                    period.
                  </p>
                )}
              </Panel>
            )}
            {(tab === "deployments" || tab === "changes") && (
              <Panel
                title={
                  tab === "deployments"
                    ? "Deployment history"
                    : "Recent service changes"
                }
              >
                {relatedDeploys.map((d) => (
                  <div key={d.id} {...stylex.props(c.incidentRow)}>
                    <GitBranch size={17} color="#91a878" />
                    <div {...stylex.props(s.grow)}>
                      <AppLink to={`/deployments/${d.id}`}>
                        {service.id}@{d.version}
                      </AppLink>
                      <p {...stylex.props(s.small, s.muted, s.space8)}>
                        {d.time} · {person(d.author)?.name} · {d.commit}
                      </p>
                      {d.incident && (
                        <div {...stylex.props(s.space8)}>
                          <AppLink to={`/incidents/${d.incident}`}>
                            Linked to {d.incident}
                          </AppLink>
                        </div>
                      )}
                    </div>
                    <Badge>{d.status}</Badge>
                  </div>
                ))}
                {tab === "changes" && (
                  <div {...stylex.props(c.incidentRow)}>
                    <Users size={17} />
                    <div>
                      <strong>
                        Ownership reviewed by {person(service.owner)?.name}
                      </strong>
                      <p {...stylex.props(s.small, s.muted)}>
                        Sep 1, 2026 · Escalation policy and team contacts
                        verified.
                      </p>
                    </div>
                  </div>
                )}
                {!relatedDeploys.length && (
                  <p {...stylex.props(s.secondary)}>
                    No deployments in the current 24-hour window. The service is
                    running its last stable release.
                  </p>
                )}
              </Panel>
            )}
            {tab === "dependencies" && (
              <>
                <Panel title="Downstream dependencies">
                  {service.dependencies.map((dep) => (
                    <div key={dep} {...stylex.props(c.dependency)}>
                      <AppLink to={`/services/${dep}`}>
                        <Server size={15} />
                        {serviceName(dep)}
                      </AppLink>
                      <HealthLabel
                        health={getServiceHealth(dep, store.incidents)}
                      />
                    </div>
                  ))}
                  <p {...stylex.props(s.small, s.muted, s.space12)}>
                    These services must be available for {service.name} to
                    process requests normally.
                  </p>
                </Panel>
                <Panel title="Dependent services">
                  {dependents.map((dep) => (
                    <div key={dep.id} {...stylex.props(c.dependency)}>
                      <AppLink to={`/services/${dep.id}`}>
                        <Server size={15} />
                        {dep.name}
                      </AppLink>
                      <HealthLabel
                        health={getServiceHealth(dep.id, store.incidents)}
                      />
                    </div>
                  ))}
                  <p {...stylex.props(s.small, s.muted, s.space12)}>
                    These services call {service.name} and may experience
                    downstream impact.
                  </p>
                </Panel>
              </>
            )}
          </div>
          <aside {...stylex.props(s.column, s.gap20)}>
            <Panel title="Ownership">
              <div {...stylex.props(s.row)}>
                <div {...stylex.props(c.serviceIcon)}>
                  <Users size={17} />
                </div>
                <div>
                  <AppLink to={`/teams/${team.id}`}>{team.name}</AppLink>
                  <p {...stylex.props(s.small, s.muted)}>Owning team</p>
                </div>
              </div>
              <div {...stylex.props(c.sideRow, s.space12)}>
                <span>Service owner</span>
                <PersonName id={service.owner} />
              </div>
              <div {...stylex.props(c.sideRow)}>
                <span>On-call primary</span>
                <PersonName id={oncall} />
              </div>
              <div {...stylex.props(c.sideRow)}>
                <span>On-call secondary</span>
                <PersonName
                  id={store.schedule[`${team.id}-secondary`] ?? team.secondary}
                />
              </div>
              <div {...stylex.props(s.space12)}>
                <Button icon={Headphones} small onClick={() => setPage(true)}>
                  Page on-call engineer
                </Button>
              </div>
            </Panel>
            <Panel title="Service details">
              {[
                ["Runtime", service.runtime],
                ["Infrastructure", "Kubernetes"],
                ["Primary region", "us-east-1"],
                ["Environment", "Production"],
                ["Service tier", service.tier],
                ["Data classification", "Confidential"],
                ["Repository", service.repo],
              ].map(([label, value]) => (
                <div key={label} {...stylex.props(c.sideRow)}>
                  <span>{label}</span>
                  <strong {...stylex.props(s.small)}>{value}</strong>
                </div>
              ))}
            </Panel>
            <Panel title="Reliability budget">
              <div {...stylex.props(s.spread)}>
                <strong {...stylex.props(c.statValue)}>
                  {Math.max(
                    0,
                    Math.round(
                      (1 - (100 - parseFloat(service.uptime)) / 0.05) * 100,
                    ),
                  )}
                  %
                </strong>
                <span {...stylex.props(s.small, s.muted)}>
                  remaining this month
                </span>
              </div>
              <UptimeBars degraded={health !== "Operational"} />
              <p {...stylex.props(s.small, s.muted, s.space8)}>
                99.95% availability objective · 21.6 minutes allowed downtime
                over 30 days
              </p>
              <div {...stylex.props(s.space12)}>
                <AppLink to="/analytics">
                  Explore reliability trends
                  <ArrowRight size={12} />
                </AppLink>
              </div>
            </Panel>
          </aside>
        </div>
      </div>
      {runbook && (
        <Modal
          title={`${service.name} runbook`}
          description="Last reviewed September 1, 2026 · Owned by the service team"
          onClose={() => setRunbook(false)}
        >
          <div {...stylex.props(s.column)}>
            <div>
              <h3>1. Assess the impact</h3>
              <p {...stylex.props(s.secondary, s.space8)}>
                Check error rate, P95 latency, and the active incident timeline.
                Confirm whether the issue affects all traffic or a specific
                availability zone.
              </p>
            </div>
            <div>
              <h3>2. Check recent changes</h3>
              <p {...stylex.props(s.secondary, s.space8)}>
                Compare the current image version with the last known healthy
                release. Check configuration checksums across all 12 gateway
                instances before and after a rollback.
              </p>
            </div>
            <div>
              <h3>3. Mitigate and verify</h3>
              <p {...stylex.props(s.secondary, s.space8)}>
                Drain unhealthy instances. Apply a configuration refresh if
                checksums differ. Verify error rate remains below 0.5% for 10
                minutes before resolving.
              </p>
            </div>
            <div {...stylex.props(s.note)}>
              <Headphones size={16} />
              Escalate to {person(team.secondary)?.name} after 5 minutes without
              acknowledgment.
            </div>
          </div>
        </Modal>
      )}
      {page && (
        <Modal
          title={`Page ${person(oncall)?.name}`}
          description={`${team.name} · Primary on-call engineer`}
          onClose={() => setPage(false)}
          footer={
            <Button
              type="submit"
              form="page-form"
              variant="primary"
              icon={Bell}
            >
              Send page
            </Button>
          }
        >
          <form
            id="page-form"
            onSubmit={(e) => {
              e.preventDefault();
              if (!pageReason.trim()) return;
              if (active[0])
                store.addEvent(
                  active[0].id,
                  `Paged ${person(oncall)?.name}: ${pageReason}`,
                );
              store.toast(
                `Page sent to ${person(oncall)?.name}. Escalation starts in 5 minutes.`,
              );
              setPage(false);
            }}
          >
            <label {...stylex.props(s.label)}>
              Why is this page needed?
              <textarea
                required
                value={pageReason}
                onChange={(e) => setPageReason(e.target.value)}
                placeholder="Include the impact and what help you need…"
                {...stylex.props(s.input, s.textarea)}
              />
            </label>
          </form>
        </Modal>
      )}
    </div>
  );
}
