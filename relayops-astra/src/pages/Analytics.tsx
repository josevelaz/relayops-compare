import * as stylex from "@stylexjs/stylex";
import { useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Bell,
  CircleHelp,
  GitBranch,
  Info,
  Repeat2,
  ShieldAlert,
  TrendingDown,
} from "lucide-react";
import {
  AppLink,
  Badge,
  ExportButton,
  PageHeader,
  Panel,
  Select,
  s,
} from "../components/ui";
import {
  ErrorChart,
  IncidentTrend,
  Legend,
  Sparkline,
} from "../components/charts";

const a = stylex.create({
  metrics: {
    display: "grid",
    gridTemplateColumns: {
      default: "repeat(4, minmax(0, 1fr))",
      "@media (max-width: 650px)": "repeat(2, 1fr)",
    },
    gap: 17,
    marginBottom: 23,
  },
  metric: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#e4eadb",
    borderRadius: 8,
    padding: 20,
  },
  metricLabel: { fontSize: 10.5, color: "#94a283", marginBottom: 10 },
  value: {
    fontSize: 28,
    fontWeight: 550,
    letterSpacing: "-1px",
    color: "#5d794b",
  },
  delta: {
    color: "#8ca877",
    fontSize: 9.5,
    display: "flex",
    gap: 4,
    alignItems: "center",
    marginTop: 10,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: {
      default: "minmax(0, 1.7fr) minmax(260px, 1fr)",
      "@media (max-width: 960px)": "1fr",
    },
    gap: 20,
  },
  severityRow: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    marginBottom: 19,
  },
  barTrack: {
    height: 7,
    borderRadius: 4,
    backgroundColor: "#f1f4ea",
    overflow: "hidden",
  },
  bar: (width: string, color: string) => ({
    width,
    backgroundColor: color,
    height: "100%",
    borderRadius: 4,
  }),
  insight: {
    display: "flex",
    gap: 12,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#dfe8d2",
    backgroundColor: "#f3f7ec",
    borderRadius: 8,
    padding: "18px 21px",
    marginTop: 22,
    color: "#849c6b",
    fontSize: 11,
    lineHeight: 1.8,
  },
  tableTitle: { fontSize: 11, fontWeight: 500, color: "#70895b" },
  serviceBar: { display: "flex", alignItems: "center", gap: 10 },
  serviceTrack: {
    width: 110,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#edf2e3",
  },
  reliability: { padding: "0 20px 20px" },
  recurrence: {
    display: "flex",
    alignItems: "center",
    gap: 15,
    borderTopWidth: 1,
    borderTopStyle: "solid",
    borderTopColor: "#edf2e2",
    padding: "17px 20px",
  },
});
const periods = {
  "7 days": {
    incidents: 9,
    mtta: "1m 48s",
    mttr: "28m",
    alerts: 328,
    change: 18,
    factor: 1,
    deploy: 3,
    recurring: 2,
  },
  "30 days": {
    incidents: 28,
    mtta: "2m 14s",
    mttr: "32m",
    alerts: 1426,
    change: 22,
    factor: 3,
    deploy: 9,
    recurring: 6,
  },
  "90 days": {
    incidents: 94,
    mtta: "2m 42s",
    mttr: "39m",
    alerts: 4982,
    change: 16,
    factor: 10,
    deploy: 31,
    recurring: 21,
  },
  "6 months": {
    incidents: 208,
    mtta: "3m 06s",
    mttr: "43m",
    alerts: 11248,
    change: 12,
    factor: 22,
    deploy: 68,
    recurring: 49,
  },
};
export function AnalyticsPage() {
  const [range, setRange] = useState<keyof typeof periods>("30 days");
  const period = periods[range];
  const serviceRows = [
    {
      id: "payment-gateway",
      incidents: Math.round(period.incidents * 0.29),
      alerts: Math.round(period.alerts * 0.21),
      mttr: "41m",
      recurrence: "Provider timeouts",
    },
    {
      id: "webhook-processor",
      incidents: Math.round(period.incidents * 0.21),
      alerts: Math.round(period.alerts * 0.34),
      mttr: "34m",
      recurrence: "Queue saturation",
    },
    {
      id: "authentication-service",
      incidents: Math.round(period.incidents * 0.18),
      alerts: Math.round(period.alerts * 0.17),
      mttr: "26m",
      recurrence: "Token validation",
    },
    {
      id: "api-gateway",
      incidents: Math.round(period.incidents * 0.14),
      alerts: Math.round(period.alerts * 0.12),
      mttr: "29m",
      recurrence: "Regional latency",
    },
  ];
  const names = [
    "Payment Gateway",
    "Webhook Processor",
    "Authentication Service",
    "API Gateway",
  ];
  return (
    <div {...stylex.props(s.page)}>
      <PageHeader
        title="Operational analytics"
        description="Understand your reliability. Make the next response better."
        actions={
          <>
            <Select
              label="Analytics time range"
              options={Object.keys(periods)}
              value={range}
              onChange={(e) => setRange(e.target.value as keyof typeof periods)}
            />
            <ExportButton
              filename={`relayops-analytics-${range.replace(" ", "-")}.csv`}
              rows={serviceRows.map((r, i) => ({
                service: names[i],
                period: range,
                incidents: r.incidents,
                alerts: r.alerts,
                mttr: r.mttr,
                recurring_issue: r.recurrence,
              }))}
            />
          </>
        }
      />
      <div {...stylex.props(a.metrics)}>
        {[
          {
            label: "Total incidents",
            value: String(period.incidents),
            delta: `${period.change}% fewer incidents`,
          },
          {
            label: "Mean time to acknowledge",
            value: period.mtta,
            delta: "26s faster than prior period",
          },
          {
            label: "Mean time to resolve",
            value: period.mttr,
            delta: "8m faster than prior period",
          },
          {
            label: "Alert volume",
            value: period.alerts.toLocaleString(),
            delta: "18% less alert noise",
          },
        ].map((m, n) => (
          <div key={m.label} {...stylex.props(a.metric)}>
            <div {...stylex.props(a.metricLabel)}>{m.label}</div>
            <div {...stylex.props(s.spread)}>
              <strong {...stylex.props(a.value)}>{m.value}</strong>
              {n === 0 || n === 3 ? null : <Sparkline variant={1} />}
            </div>
            <div {...stylex.props(a.delta)}>
              <ArrowDown size={10} />
              {m.delta}
            </div>
          </div>
        ))}
      </div>
      <div {...stylex.props(a.grid)}>
        <Panel title="Incident volume" action={<Legend />} noPad>
          <div {...stylex.props(s.spread)} style={{ padding: "0 20px 15px" }}>
            <span {...stylex.props(s.small, s.muted)}>
              Incident volume · {range}
            </span>
            <Badge tone="green">↓ {period.change}%</Badge>
          </div>
          <IncidentTrend
            large
            total={period.incidents}
            days={range === "6 months" ? 180 : parseInt(range)}
          />
        </Panel>
        <Panel title="Incidents by severity">
          {[
            { level: "SEV0", percent: 4, color: "#c68474" },
            { level: "SEV1", percent: 25, color: "#d4ad73" },
            { level: "SEV2", percent: 46, color: "#9db78b" },
            { level: "SEV3", percent: 25, color: "#d5e3c6" },
          ].map((sev, index) => {
            const counts = [
              Math.max(0, Math.round(period.incidents * 0.04)),
              Math.round(period.incidents * 0.25),
              Math.round(period.incidents * 0.46),
            ];
            counts.push(period.incidents - counts.reduce((a, b) => a + b, 0));
            return (
              <div {...stylex.props(a.severityRow)} key={sev.level}>
                <div {...stylex.props(s.spread)}>
                  <Badge>{sev.level}</Badge>
                  <span {...stylex.props(s.small, s.secondary)}>
                    {counts[index]} incidents{" "}
                    <span {...stylex.props(s.muted)}>
                      · {Math.round((counts[index] / period.incidents) * 100)}%
                    </span>
                  </span>
                </div>
                <div {...stylex.props(a.barTrack)}>
                  <div
                    {...stylex.props(
                      a.bar(
                        `${(counts[index] / period.incidents) * 100}%`,
                        sev.color,
                      ),
                    )}
                  />
                </div>
              </div>
            );
          })}
          <p {...stylex.props(s.small, s.muted)}>
            SEV0–1 incidents account for 68% of customer-impacting minutes.
          </p>
        </Panel>
      </div>
      <div {...stylex.props(a.insight)}>
        <Info size={18} />
        <div>
          <strong>Focus on repeat issues, not just faster fixes.</strong>
          <p>
            Webhook Processor accounts for 34% of alert volume, but only 21% of
            incidents. Queue saturation has recurred{" "}
            {Math.max(1, Math.round(period.recurring / 2))} times.{" "}
            <AppLink to="/services/webhook-processor">
              Review service context <ArrowRight size={11} />
            </AppLink>
          </p>
        </div>
      </div>
      <div {...stylex.props(s.sectionSpace)}>
        <Panel
          title="Where incidents and alert noise concentrate"
          action={
            <span {...stylex.props(s.small, s.muted)}>
              Top 4 of 47 production services
            </span>
          }
          noPad
        >
          <div {...stylex.props(s.tableScroll)}>
            <table {...stylex.props(s.table)}>
              <thead>
                <tr>
                  {[
                    "Service",
                    "Incidents",
                    "Alerts",
                    "Mean resolution",
                    "Recurring pattern",
                  ].map((h) => (
                    <th key={h} {...stylex.props(s.th)}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {serviceRows.map((row, idx) => (
                  <tr key={row.id}>
                    <td {...stylex.props(s.td)}>
                      <AppLink to={`/services/${row.id}`}>{names[idx]}</AppLink>
                    </td>
                    <td {...stylex.props(s.td)}>
                      <div {...stylex.props(a.serviceBar)}>
                        <span {...stylex.props(s.small)}>{row.incidents}</span>
                        <div {...stylex.props(a.serviceTrack)}>
                          <div
                            {...stylex.props(
                              a.bar(
                                `${(row.incidents / period.incidents) * 220}%`,
                                "#b4c89e",
                              ),
                            )}
                          />
                        </div>
                      </div>
                    </td>
                    <td {...stylex.props(s.td, s.small)}>
                      {row.alerts.toLocaleString()}
                    </td>
                    <td {...stylex.props(s.td, s.small, s.secondary)}>
                      {row.mttr}
                    </td>
                    <td {...stylex.props(s.td)}>
                      <Badge>{row.recurrence}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>
      <div {...stylex.props(a.grid, s.sectionSpace)}>
        <Panel
          title="Reliability trend"
          action={<Badge tone="green">99.98% aggregate uptime</Badge>}
        >
          <p {...stylex.props(s.small, s.muted, s.bottom16)}>
            Above the 99.95% organization target · request-weighted availability
          </p>
          <ErrorChart
            healthy
            kind="reliability"
            days={range === "6 months" ? 180 : parseInt(range)}
            label="Organization reliability is above the 99.95% SLO target"
          />
        </Panel>
        <Panel title="Changes & recurring incidents" noPad>
          <div {...stylex.props(a.recurrence)}>
            <GitBranch size={18} color="#93a77c" />
            <div {...stylex.props(s.grow)}>
              <strong {...stylex.props(a.value)}>
                {Math.round((period.deploy / period.incidents) * 100)}%
              </strong>
              <p {...stylex.props(s.small, s.secondary)}>
                Deployment-related incidents
              </p>
            </div>
            <Badge>
              {period.deploy} of {period.incidents}
            </Badge>
          </div>
          <div {...stylex.props(a.recurrence)}>
            <Repeat2 size={18} color="#93a77c" />
            <div {...stylex.props(s.grow)}>
              <strong {...stylex.props(a.value)}>{period.recurring}</strong>
              <p {...stylex.props(s.small, s.secondary)}>
                Incidents with a recurring cause
              </p>
            </div>
            <Badge tone="orange">Needs follow-up</Badge>
          </div>
          <div {...stylex.props(s.panelBody)}>
            <AppLink to="/postmortems">
              Review corrective actions
              <ArrowRight size={12} />
            </AppLink>
            <p {...stylex.props(s.small, s.muted, s.space8)}>
              9 of 18 tracked corrective actions are complete across all teams.
            </p>
          </div>
        </Panel>
      </div>
      <p {...stylex.props(s.small, s.muted, s.sectionSpace)}>
        Metrics include organization-wide incident history. Active incidents are
        excluded from resolution averages. Comparison: previous {range}.
      </p>
    </div>
  );
}
