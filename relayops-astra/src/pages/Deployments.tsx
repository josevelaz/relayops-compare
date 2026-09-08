import * as stylex from "@stylexjs/stylex";
import { useState } from "react";
import {
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  Code2,
  GitBranch,
  GitCommitHorizontal,
  GitPullRequest,
  ShieldAlert,
  Terminal,
} from "lucide-react";
import { deployments, person, serviceName, services } from "../data";
import { useStore } from "../state";
import {
  AppLink,
  Badge,
  Button,
  EmptyResults,
  ExportButton,
  Modal,
  PageHeader,
  PersonName,
  SearchInput,
  Select,
  s,
  useGo,
} from "../components/ui";

const d = stylex.create({
  strip: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 25,
    backgroundColor: "#fff",
    padding: "20px 23px",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#e3e9dc",
    borderRadius: 8,
    marginBottom: 23,
  },
  stat: {
    display: "flex",
    gap: 10,
    alignItems: "center",
    fontSize: 11,
    color: "#8b9d79",
  },
  statNumber: { fontSize: 23, fontWeight: 550, color: "#5b754c" },
  correlation: {
    marginLeft: "auto",
    display: "flex",
    gap: 7,
    alignItems: "center",
    fontSize: 10.5,
    color: "#ac9265",
  },
  problemRow: { backgroundColor: "#fffcf5" },
  commit: {
    padding: "2px 6px",
    backgroundColor: "#f5f7ef",
    color: "#9aa88b",
    borderRadius: 3,
    fontFamily: "ui-monospace, monospace",
    fontSize: 10,
  },
  deployName: { fontWeight: 500, fontSize: 11.5, color: "#5c784b" },
  logs: {
    borderRadius: 7,
    padding: 18,
    backgroundColor: "#28372a",
    color: "#c0d0af",
    fontFamily: "ui-monospace, monospace",
    fontSize: 10,
    lineHeight: 2,
    whiteSpace: "pre-wrap",
    overflowWrap: "anywhere",
  },
  step: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "12px 0",
    borderBottomWidth: 1,
    borderBottomStyle: "solid",
    borderBottomColor: "#edf1e5",
    fontSize: 11,
    color: "#90a47a",
  },
});

export function DeploymentsPage({ selectedId }: { selectedId?: string }) {
  const store = useStore();
  const go = useGo();
  const [query, setQuery] = useState("");
  const [environment, setEnvironment] = useState("All environments");
  const [status, setStatus] = useState("All statuses");
  const [service, setService] = useState("All services");
  const [logs, setLogs] = useState(false);
  const visible = deployments.filter(
    (x) =>
      (environment === "All environments" || x.environment === environment) &&
      (status === "All statuses" || x.status === status) &&
      (service === "All services" || x.service === service) &&
      `${serviceName(x.service)} ${x.version} ${x.commit} ${x.author} ${x.id}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  const selected = deployments.find((x) => x.id === selectedId);
  return (
    <div {...stylex.props(s.page)}>
      <PageHeader
        title="Deployments"
        description="Every release, in context. Connect changes to operational impact."
        actions={
          <ExportButton
            filename="relayops-deployments.csv"
            rows={visible.map((x) => ({ ...x }))}
          />
        }
      />
      <div {...stylex.props(d.strip)}>
        <div {...stylex.props(d.stat)}>
          <GitBranch size={18} />
          <strong {...stylex.props(d.statNumber)}>3</strong>production releases
          in the last hour
        </div>
        <div {...stylex.props(d.stat)}>
          <span {...stylex.props(d.statNumber)}>1</span>failed deployment
        </div>
        <div {...stylex.props(d.correlation)}>
          <ShieldAlert size={15} />
          {
            deployments.filter((d) =>
              store.incidents.some(
                (i) => i.id === d.incident && i.status !== "Resolved",
              ),
            ).length
          }{" "}
          releases linked to active incidents
        </div>
      </div>
      <div {...stylex.props(s.panel)}>
        <div {...stylex.props(s.toolbar)}>
          <SearchInput
            value={query}
            onChange={setQuery}
            placeholder="Search versions, services, commits…"
          />
          <Select
            label="Deployment environment"
            value={environment}
            onChange={(e) => setEnvironment(e.target.value)}
            options={["All environments", "Production", "Staging"]}
          />
          <Select
            label="Deployment status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            options={[
              "All statuses",
              "Successful",
              "Failed",
              "Rolling out",
              "Rolled back",
            ]}
          />
          <Select
            label="Deployment service"
            value={service}
            onChange={(e) => setService(e.target.value)}
            options={[
              "All services",
              ...services.map((s) => ({ value: s.id, label: s.name })),
            ]}
          />
        </div>
        <div {...stylex.props(s.tableScroll)}>
          <table {...stylex.props(s.table)}>
            <thead>
              <tr>
                {[
                  "Service / version",
                  "Commit",
                  "Environment",
                  "Status",
                  "Author",
                  "Deployed",
                  "Pull request",
                  "Incident",
                ].map((h) => (
                  <th key={h} {...stylex.props(s.th)}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visible.map((deploy) => (
                <tr
                  key={deploy.id}
                  {...stylex.props(
                    s.tr,
                    deploy.incident !== undefined && d.problemRow,
                  )}
                >
                  <td {...stylex.props(s.td)}>
                    <div {...stylex.props(d.deployName)}>
                      <AppLink to={`/deployments/${deploy.id}`} subtle>
                        {serviceName(deploy.service)}
                      </AppLink>
                    </div>
                    <div {...stylex.props(s.small, s.muted, s.space8)}>
                      v{deploy.version}
                    </div>
                  </td>
                  <td {...stylex.props(s.td)}>
                    <AppLink to={`/deployments/${deploy.id}`}>
                      <code {...stylex.props(d.commit)}>{deploy.commit}</code>
                    </AppLink>
                  </td>
                  <td {...stylex.props(s.td)}>
                    <Badge
                      tone={
                        deploy.environment === "Production" ? "gray" : "purple"
                      }
                    >
                      {deploy.environment}
                    </Badge>
                  </td>
                  <td {...stylex.props(s.td)}>
                    <Badge dot>{deploy.status}</Badge>
                  </td>
                  <td {...stylex.props(s.td)}>
                    <PersonName id={deploy.author} />
                  </td>
                  <td {...stylex.props(s.td, s.secondary, s.small)}>
                    {deploy.time}
                  </td>
                  <td {...stylex.props(s.td)}>
                    <AppLink to={`/deployments/${deploy.id}`}>
                      <GitPullRequest size={12} />
                      {deploy.pr}
                    </AppLink>
                  </td>
                  <td {...stylex.props(s.td)}>
                    {deploy.incident ? (
                      <AppLink to={`/incidents/${deploy.incident}`}>
                        <ShieldAlert size={12} />
                        {deploy.incident}
                      </AppLink>
                    ) : (
                      <span {...stylex.props(s.muted)}>—</span>
                    )}
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
              setEnvironment("All environments");
              setStatus("All statuses");
              setService("All services");
            }}
          />
        )}
        <div {...stylex.props(s.tableFoot)}>
          <span>{visible.length} deployments</span>
          <span>Connected via GitHub Actions · us-east-1</span>
        </div>
      </div>
      {selected && (
        <Modal
          title={`${serviceName(selected.service)} · v${selected.version}`}
          description={`${selected.id} · ${selected.environment} · ${selected.time}`}
          wide
          onClose={() => {
            setLogs(false);
            go("/deployments");
          }}
          footer={
            <>
              <Button icon={Terminal} onClick={() => setLogs(!logs)}>
                {logs ? "Hide build logs" : "View build logs"}
              </Button>
              <Button
                variant="primary"
                onClick={() => go(`/services/${selected.service}`)}
              >
                Open service
              </Button>
            </>
          }
        >
          <div {...stylex.props(s.spread, s.bottom16)}>
            <Badge dot>{selected.status}</Badge>
            <PersonName id={selected.author} full />
          </div>
          {selected.incident && (
            <div {...stylex.props(s.note, s.dangerNote, s.bottom16)}>
              <ShieldAlert size={16} />
              <div>
                <strong>Correlated with {selected.incident}</strong>
                <p>
                  This deployment preceded a service degradation.{" "}
                  <AppLink to={`/incidents/${selected.incident}`}>
                    Open incident workspace <ArrowUpRight size={12} />
                  </AppLink>
                </p>
              </div>
            </div>
          )}
          <div {...stylex.props(s.grid2)}>
            <div>
              <div {...stylex.props(s.overline)}>Source change</div>
              <p {...stylex.props(s.space8, s.mono)}>
                {selected.commit} · main
              </p>
              <p {...stylex.props(s.secondary, s.small, s.space8)}>
                Pull request {selected.pr}
                <br />
                {selected.service === "payment-gateway"
                  ? "Improve payment routing and provider failover"
                  : `Release ${serviceName(selected.service)} ${selected.version}`}
              </p>
            </div>
            <div>
              <div {...stylex.props(s.overline)}>Deployment target</div>
              <p {...stylex.props(s.space8, s.small)}>Kubernetes · us-east-1</p>
              <p {...stylex.props(s.secondary, s.small, s.space8)}>
                Rolling deployment · 12 replicas
                <br />
                GitHub Actions · pipeline #{selected.id.split("-")[1]}
              </p>
            </div>
          </div>
          <div {...stylex.props(s.sectionSpace)}>
            {[
              "Source checked out and verified",
              "Build and integration checks passed",
              "Container published to registry",
              selected.status === "Failed"
                ? "Readiness probe failed — deployment stopped"
                : selected.status === "Rolling out"
                  ? "Rolling update in progress — 8 of 12 replicas ready"
                  : "Production health checks evaluated",
              selected.status === "Rolled back"
                ? "Rolled back to v4.18.1 at 10:43 AM"
                : selected.status === "Successful"
                  ? "Deployment completed successfully"
                  : "Release controller is awaiting a healthy target",
            ].map((step, idx) => (
              <div key={step} {...stylex.props(d.step)}>
                {idx < 3 || selected.status === "Successful" ? (
                  <CheckCircle2 size={14} />
                ) : (
                  <Clock3 size={14} />
                )}
                <span {...stylex.props(s.grow)}>{step}</span>
                <span {...stylex.props(s.mono)}>0{idx + 1}</span>
              </div>
            ))}
          </div>
          {logs && (
            <pre
              {...stylex.props(d.logs, s.sectionSpace)}
            >{`[build] Checking out ${selected.commit}\n[build] npm ci --production\n[build] Image ${selected.service}:${selected.version} pushed\n[deploy] Applying rollout to ${selected.environment.toLowerCase()}/us-east-1\n[health] Checking readiness probes...\n${selected.status === "Failed" ? "[error] Readiness probe timed out after 180s\n[deploy] Previous healthy revision retained" : selected.status === "Rolled back" ? "[warn] Error rate above release threshold: 21.4%\n[rollback] Restoring v4.18.1\n[rollback] 12/12 pods ready. Configuration review required." : selected.status === "Rolling out" ? "[deploy] 8/12 replicas updated. Waiting for readiness." : "[health] All replicas healthy\n[deploy] Release completed successfully"}`}</pre>
          )}
        </Modal>
      )}
    </div>
  );
}
