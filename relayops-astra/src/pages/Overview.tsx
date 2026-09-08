import * as stylex from "@stylexjs/stylex";
import { useState } from "react";
import {
  Activity,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Bell,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileText,
  GitBranch,
  Headphones,
  Plus,
  Radio,
  ShieldAlert,
  Sparkles,
  TrendingDown,
} from "lucide-react";
import { deployments, person, serviceName, services, teams } from "../data";
import { useStore } from "../state";
import {
  AppLink,
  Avatar,
  AvatarStack,
  Badge,
  Button,
  HealthLabel,
  Metric,
  PageHeader,
  Panel,
  PersonName,
  Select,
  ViewAll,
  getServiceHealth,
  s,
  useGo,
} from "../components/ui";
import { IncidentTrend, Legend, Sparkline } from "../components/charts";

const v = stylex.create({
  date: {
    display: "flex",
    alignItems: "center",
    gap: 7,
    fontSize: 10.5,
    color: "#8b9589",
    marginBottom: 10,
  },
  banner: {
    display: "flex",
    gap: 14,
    alignItems: "center",
    padding: "17px 20px",
    backgroundColor: "#fcf7ee",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#eee2c9",
    borderRadius: 8,
    position: "relative",
    flexWrap: { default: "nowrap", "@media (max-width: 640px)": "wrap" },
  },
  bannerIcon: {
    height: 33,
    width: 33,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f4e8d3",
    color: "#b18c45",
    borderRadius: 8,
    flexShrink: 0,
  },
  bannerTitle: {
    fontSize: 12,
    fontWeight: 600,
    color: "#7c673e",
    display: "flex",
    alignItems: "center",
    gap: 9,
    flexWrap: "wrap",
  },
  bannerDesc: { fontSize: 11.5, color: "#8d7958", marginTop: 4 },
  bannerLink: {
    fontSize: 10.5,
    color: "#a28a55",
    display: "inline-flex",
    alignItems: "center",
    gap: 7,
    whiteSpace: "nowrap",
    padding: "7px 0 7px 10px",
    ":hover": { color: "#725b2b" },
  },
  live: {
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
    padding: "0 5px",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#ead9b7",
    borderRadius: 3,
    fontSize: 8,
    fontWeight: 500,
    color: "#b29865",
    lineHeight: "15px",
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: "50%",
    backgroundColor: "currentColor",
  },
  metrics: {
    display: "grid",
    gridTemplateColumns: {
      default: "repeat(4, minmax(0, 1fr))",
      "@media (max-width: 680px)": "repeat(2, minmax(0, 1fr))",
    },
    backgroundColor: "#fff",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#e5e9e3",
    borderRadius: 8,
    paddingBlock: 20,
    marginBlock: 21,
  },
  metric: {
    paddingInline: { default: 23, "@media (max-width: 1200px)": 15 },
    borderRightWidth: 1,
    borderRightStyle: "solid",
    borderRightColor: "#e9ede5",
    ":last-child": { borderRightWidth: 0 },
    "@media (max-width: 680px)": { paddingBlock: 10 },
  },
  mainGrid: {
    display: "grid",
    gridTemplateColumns: {
      default: "minmax(0, 1.94fr) minmax(280px, 1fr)",
      "@media (max-width: 1130px)": "minmax(0, 1.5fr) minmax(260px, 1fr)",
      "@media (max-width: 960px)": "1fr",
    },
    gap: 20,
  },
  incident: {
    padding: "18px 20px 16px",
    borderTopWidth: 1,
    borderTopStyle: "solid",
    borderTopColor: "#eef0e9",
    display: "flex",
    gap: 12,
    ":hover": { backgroundColor: "#fcfdf9" },
  },
  incidentMain: { backgroundColor: "#fffdf9" },
  incidentTitle: {
    fontSize: 13,
    fontWeight: 550,
    color: "#53624a",
    lineHeight: 1.65,
  },
  incidentMeta: {
    display: "flex",
    gap: 9,
    flexWrap: "wrap",
    alignItems: "center",
    fontSize: 10.5,
    color: "#7d8973",
    marginTop: 7,
  },
  incidentTop: {
    display: "flex",
    gap: 7,
    alignItems: "center",
    marginBottom: 6,
  },
  incidentId: {
    fontSize: 9,
    fontFamily: "ui-monospace, monospace",
    color: "#7c8a71",
  },
  incidentAside: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-end",
    gap: 15,
    flexShrink: 0,
  },
  duration: {
    display: "flex",
    alignItems: "center",
    gap: 4,
    color: "#78866d",
    fontSize: 10,
  },
  panelFoot: {
    padding: "11px 20px",
    borderTopWidth: 1,
    borderTopStyle: "solid",
    borderTopColor: "#edf0e6",
    backgroundColor: "#fcfdfb",
    fontSize: 9.5,
    color: "#9aa58c",
    display: "flex",
    gap: 6,
    alignItems: "center",
  },
  healthSummary: {
    display: "flex",
    alignItems: "baseline",
    gap: 5,
    fontSize: 10,
    color: "#a0a98f",
  },
  healthValue: {
    fontSize: 28,
    fontWeight: 500,
    letterSpacing: "-1.2px",
    color: "#56724b",
  },
  serviceGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(16, minmax(0, 1fr))",
    gap: 4,
    marginBlock: "12px 10px",
  },
  serviceTile: {
    height: 17,
    borderRadius: 2,
    backgroundColor: "#c4d7ba",
    ":hover": { opacity: 0.65 },
  },
  tileDegraded: { backgroundColor: "#e5c888" },
  tileOutage: { backgroundColor: "#d9a698" },
  healthLegend: {
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
    fontSize: 8.5,
    color: "#a0a98f",
    marginBottom: 19,
  },
  legendDot: {
    width: 5,
    height: 5,
    backgroundColor: "#aecaa0",
    borderRadius: 2,
  },
  legendAmber: { backgroundColor: "#e0c17d" },
  legendRed: { backgroundColor: "#d6a496" },
  healthRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: 8,
    alignItems: "center",
    paddingBlock: 9,
    borderTopWidth: 1,
    borderTopStyle: "solid",
    borderTopColor: "#f0f2eb",
    fontSize: 11.5,
    color: "#5f7450",
  },
  oncallRow: {
    display: "flex",
    alignItems: "center",
    gap: 9,
    paddingBlock: 10,
    borderTopWidth: 1,
    borderTopStyle: "solid",
    borderTopColor: "#f0f2e9",
    ":first-child": { borderTopWidth: 0, paddingTop: 0 },
  },
  oncallName: { fontSize: 10.5, fontWeight: 500, color: "#5c6e50" },
  oncallTeam: { fontSize: 10, color: "#78866c", marginTop: 1 },
  oncallTime: { fontSize: 10, color: "#7c896f", marginLeft: "auto" },
  chartHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    padding: "0 20px 13px",
  },
  chartNumber: {
    fontSize: 23,
    fontWeight: 500,
    color: "#657754",
    letterSpacing: "-.7px",
  },
  chartNote: { fontSize: 9, color: "#9ba58e", marginLeft: 8 },
  change: {
    display: "flex",
    alignItems: "center",
    gap: 4,
    fontSize: 9,
    color: "#83a371",
  },
  deploymentRow: {
    display: "flex",
    alignItems: "center",
    padding: "13px 20px",
    gap: 12,
    borderTopWidth: 1,
    borderTopStyle: "solid",
    borderTopColor: "#edf0e7",
  },
  deploymentIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 28,
    height: 28,
    borderRadius: 6,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#e4e9dc",
    color: "#92a17e",
    backgroundColor: "#f9fbf5",
  },
  deployTitle: { fontSize: 12, fontWeight: 500, color: "#526747" },
  deploymentMeta: { fontSize: 9.5, color: "#78856d", marginTop: 3 },
  attention: {
    padding: "14px 18px",
    display: "flex",
    gap: 11,
    alignItems: "flex-start",
    borderTopWidth: 1,
    borderTopStyle: "solid",
    borderTopColor: "#edf0e7",
    color: "#98a186",
  },
  attentionTitle: { fontSize: 10.5, fontWeight: 500, color: "#73815e" },
  attentionDesc: {
    marginTop: 4,
    fontSize: 9.5,
    color: "#a3ab92",
    lineHeight: 1.7,
  },
  greeting: { color: "#6b8157", fontWeight: 500 },
});

export function Overview() {
  const store = useStore();
  const go = useGo();
  const [range, setRange] = useState("Last 24 hours");
  const active = store.incidents.filter((i) => i.status !== "Resolved");
  const firing = store.alerts.filter((a) => a.state === "Firing").length;
  const impacted = new Set(active.flatMap((i) => i.services));
  const main = store.incidents.find((i) => i.id === "INC-1042")!;
  const healthyCount = 47 - impacted.size;
  const isActive = main.status !== "Resolved";
  return (
    <div {...stylex.props(s.page)}>
      <div {...stylex.props(v.date)}>
        <span {...stylex.props(v.greeting)}>Good morning, Alex</span>
        <span>·</span>
        <span>Tuesday, September 8, 2026</span>
      </div>
      <PageHeader
        title="Operational overview"
        description="Your systems, your team, and what needs your attention."
        actions={
          <>
            <Select
              label="Overview time range"
              value={range}
              onChange={(e) => setRange(e.target.value)}
              options={["Last 24 hours", "Last 7 days", "Last 30 days"]}
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
      <section {...stylex.props(v.banner)}>
        <div {...stylex.props(v.bannerIcon)}>
          {isActive ? (
            <Radio size={19} strokeWidth={1.6} />
          ) : (
            <CheckCircle2 size={19} />
          )}
        </div>
        <div {...stylex.props(s.grow)}>
          <h2 {...stylex.props(v.bannerTitle)}>
            {isActive
              ? "Payments needs your attention"
              : "Payment Gateway has recovered"}
            <span {...stylex.props(v.live)}>
              <span {...stylex.props(v.dot)} />
              LIVE
            </span>
          </h2>
          <p {...stylex.props(v.bannerDesc)}>
            {isActive
              ? "SEV1 incident in progress. Checkout errors are at 8.7% after rollback. The Payments team is investigating."
              : "INC-1042 is resolved. Review the incident timeline and capture what the team learned."}
          </p>
        </div>
        <button
          {...stylex.props(v.bannerLink)}
          onClick={() => go("/incidents/INC-1042")}
        >
          Open incident workspace
          <ArrowRight size={13} />
        </button>
      </section>
      <section
        aria-label="Key operational metrics"
        {...stylex.props(v.metrics)}
      >
        <div {...stylex.props(v.metric)}>
          <Metric
            label="Active incidents"
            value={String(active.length).padStart(2, "0")}
            change={`${active.filter((i) => i.severity === "SEV1").length} high severity`}
            note="needs attention"
            negative
            chart={<Sparkline variant={0} color="#b0bca0" />}
          />
        </div>
        <div {...stylex.props(v.metric)}>
          <Metric
            label="Firing alerts"
            value={String(firing)}
            change={
              range === "Last 24 hours"
                ? "12% fewer"
                : range === "Last 7 days"
                  ? "18% fewer"
                  : "24% fewer"
            }
            note="vs. previous period"
            chart={<Sparkline variant={1} />}
          />
        </div>
        <div {...stylex.props(v.metric)}>
          <Metric
            label="Mean time to resolve"
            value={
              range === "Last 24 hours"
                ? "24m"
                : range === "Last 7 days"
                  ? "28m"
                  : "32m"
            }
            change="8m faster"
            note="vs. previous period"
            chart={<Sparkline variant={1} color="#9bbd9c" />}
          />
        </div>
        <div {...stylex.props(v.metric)}>
          <Metric
            label="Overall reliability"
            value="99.98%"
            change="0.03% above"
            note="your 99.95% target"
            chart={<Sparkline variant={2} color="#9ab78b" />}
          />
        </div>
      </section>
      <div {...stylex.props(v.mainGrid)}>
        <div {...stylex.props(s.column, s.gap20)}>
          <Panel
            title={
              <span {...stylex.props(s.row, s.gap8)}>
                Active incidents <Badge>{active.length}</Badge>
              </span>
            }
            action={<ViewAll to="/incidents" />}
            noPad
          >
            {active.slice(0, 4).map((incident, index) => (
              <article
                key={incident.id}
                {...stylex.props(v.incident, index === 0 && v.incidentMain)}
              >
                <div {...stylex.props(s.grow)}>
                  <div {...stylex.props(v.incidentTop)}>
                    <Badge>{incident.severity}</Badge>
                    <span {...stylex.props(v.incidentId)}>{incident.id}</span>
                    <Badge dot>{incident.status}</Badge>
                  </div>
                  <h3 {...stylex.props(v.incidentTitle)}>
                    <AppLink to={`/incidents/${incident.id}`} subtle>
                      {incident.title}
                    </AppLink>
                  </h3>
                  <div {...stylex.props(v.incidentMeta)}>
                    <span>
                      {incident.services.map(serviceName).join(" · ")}
                    </span>
                  </div>
                </div>
                <div {...stylex.props(v.incidentAside)}>
                  <span {...stylex.props(v.duration)}>
                    <Clock3 size={10} />
                    {incident.duration}
                  </span>
                  <AvatarStack
                    ids={[incident.commander, ...incident.responders]}
                    max={3}
                  />
                </div>
              </article>
            ))}
            <div {...stylex.props(v.panelFoot)}>
              <CheckCircle2 size={11} />
              All active incidents have a commander and assigned responders.
            </div>
          </Panel>
          <Panel
            title="Incident trends"
            action={<ViewAll to="/analytics">Explore analytics</ViewAll>}
            noPad
          >
            <div {...stylex.props(v.chartHeader)}>
              <div>
                <span {...stylex.props(v.chartNumber)}>
                  {range === "Last 24 hours"
                    ? 28
                    : range === "Last 7 days"
                      ? 9
                      : 28}
                </span>
                <span {...stylex.props(v.chartNote)}>
                  incidents in the last {range === "Last 7 days" ? 7 : 30} days
                </span>
              </div>
              <div {...stylex.props(v.change)}>
                <TrendingDown size={12} />
                22% from previous period
              </div>
            </div>
            <IncidentTrend
              total={range === "Last 7 days" ? 9 : 28}
              days={range === "Last 7 days" ? 7 : 30}
            />
            <div {...stylex.props(s.spread)} style={{ padding: "0 20px 15px" }}>
              <Legend />
              <span {...stylex.props(s.muted, s.small)}>
                {range === "Last 7 days" ? "Sep 2 – Sep 8" : "Aug 10 – Sep 8"}
              </span>
            </div>
          </Panel>
          <Panel
            title="Recent deployments"
            action={<ViewAll to="/deployments" />}
            noPad
          >
            {deployments.slice(0, 3).map((d) => (
              <div key={d.id} {...stylex.props(v.deploymentRow)}>
                <div {...stylex.props(v.deploymentIcon)}>
                  <GitBranch size={14} />
                </div>
                <div {...stylex.props(s.grow)}>
                  <div {...stylex.props(v.deployTitle)}>
                    <AppLink to={`/deployments/${d.id}`} subtle>
                      {serviceName(d.service)}{" "}
                      <span {...stylex.props(s.muted, s.mono)}>
                        v{d.version}
                      </span>
                    </AppLink>
                  </div>
                  <div {...stylex.props(v.deploymentMeta)}>
                    {d.author === "marcus"
                      ? "Marcus Johnson"
                      : person(d.author)?.name}{" "}
                    · {d.time.replace("Today, ", "")} · Production
                  </div>
                </div>
                <Badge dot>{d.status}</Badge>
              </div>
            ))}
            <div {...stylex.props(v.panelFoot)}>
              <GitBranch size={11} />3 production deployments in the last hour ·
              1 failed
            </div>
          </Panel>
        </div>
        <div {...stylex.props(s.column, s.gap20)}>
          <Panel title="Service health" action={<ViewAll to="/services" />}>
            <div {...stylex.props(v.healthSummary)}>
              <strong {...stylex.props(v.healthValue)}>
                {healthyCount}
                <span style={{ color: "#bdc7b3", fontSize: 18, marginLeft: 3 }}>
                  /47
                </span>
              </strong>
              <span>services operational</span>
            </div>
            <div {...stylex.props(v.serviceGrid)}>
              {Array.from({ length: 47 }, (_, i) => {
                const svc = services[i];
                const health = svc
                  ? getServiceHealth(svc.id, active)
                  : "Operational";
                return (
                  <button
                    key={i}
                    title={
                      svc
                        ? `${svc.name}: ${health}`
                        : "Operational production service"
                    }
                    aria-label={
                      svc
                        ? `${svc.name}: ${health}`
                        : "View all production services"
                    }
                    onClick={() =>
                      go(svc ? `/services/${svc.id}` : "/services")
                    }
                    {...stylex.props(
                      v.serviceTile,
                      health === "Degraded" && v.tileDegraded,
                      health === "Partial outage" && v.tileOutage,
                    )}
                  />
                );
              })}
            </div>
            <div {...stylex.props(v.healthLegend)}>
              <span {...stylex.props(s.row, s.gap6)}>
                <span {...stylex.props(v.legendDot)} />
                Operational
              </span>
              <span {...stylex.props(s.row, s.gap6)}>
                <span {...stylex.props(v.legendDot, v.legendAmber)} />
                Degraded
              </span>
              <span {...stylex.props(s.row, s.gap6)}>
                <span {...stylex.props(v.legendDot, v.legendRed)} />
                Outage
              </span>
            </div>
            {["payment-gateway", "checkout-api", "api-gateway"].map((id) => (
              <div {...stylex.props(v.healthRow)} key={id}>
                <AppLink to={`/services/${id}`} subtle>
                  {serviceName(id)}
                </AppLink>
                <HealthLabel health={getServiceHealth(id, active)} />
              </div>
            ))}
            <div {...stylex.props(s.space12)}>
              <AppLink to="/services">
                See all 47 services
                <ArrowRight size={11} />
              </AppLink>
            </div>
          </Panel>
          <Panel
            title="On call right now"
            action={<ViewAll to="/on-call">Schedule</ViewAll>}
          >
            {teams.slice(0, 4).map((team) => (
              <div key={team.id} {...stylex.props(v.oncallRow)}>
                <Avatar
                  id={store.schedule[`${team.id}-primary`] ?? team.primary}
                />
                <div>
                  <div {...stylex.props(v.oncallName)}>
                    {
                      person(
                        store.schedule[`${team.id}-primary`] ?? team.primary,
                      )?.name
                    }
                  </div>
                  <div {...stylex.props(v.oncallTeam)}>{team.name}</div>
                </div>
                <span {...stylex.props(v.oncallTime)}>until 6:00 PM</span>
              </div>
            ))}
            <div
              {...stylex.props(s.note, s.space12)}
              style={{ padding: "9px 10px", fontSize: 9.5 }}
            >
              <Clock3 size={12} />2 engineers start their next shift today.
            </div>
          </Panel>
          <Panel
            title="Worth a look"
            action={<Sparkles size={14} color="#a3b48f" />}
            noPad
          >
            <div {...stylex.props(v.attention)}>
              <FileText size={15} />
              <div>
                <AppLink to="/postmortems/PM-104" subtle>
                  <h3 {...stylex.props(v.attentionTitle)}>
                    A learning opportunity, not a loose end
                  </h3>
                </AppLink>
                <p {...stylex.props(v.attentionDesc)}>
                  Payment Gateway postmortem is ready for review. 3 action items
                  are still open.
                </p>
              </div>
            </div>
            <div {...stylex.props(v.attention)}>
              <Bell size={15} />
              <div>
                <AppLink to="/analytics" subtle>
                  <h3 {...stylex.props(v.attentionTitle)}>
                    Less noise. More signal.
                  </h3>
                </AppLink>
                <p {...stylex.props(v.attentionDesc)}>
                  Webhook Processor generated 34% of alerts this week. Review
                  its alert thresholds.
                </p>
              </div>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
