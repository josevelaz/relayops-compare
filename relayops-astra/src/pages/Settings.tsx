import * as stylex from "@stylexjs/stylex";
import { useLocation } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Bell,
  Building2,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Github,
  Globe,
  Info,
  Link2,
  Mail,
  Plus,
  Radio,
  Save,
  Settings2,
  ShieldAlert,
  Slack,
  Unplug,
  Users,
} from "lucide-react";
import { people, person } from "../data";
import { useStore, type Settings } from "../state";
import {
  Avatar,
  Badge,
  Button,
  Field,
  Input,
  Modal,
  PageHeader,
  Panel,
  SearchInput,
  Select,
  Toggle,
  s,
} from "../components/ui";

const tabs = [
  { id: "workspace", name: "Workspace", icon: Building2 },
  { id: "members", name: "Members", icon: Users },
  { id: "integrations", name: "Integrations", icon: Link2 },
  { id: "incidents", name: "Incident configuration", icon: ShieldAlert },
  { id: "notifications", name: "Notifications", icon: Bell },
];
const st = stylex.create({
  layout: {
    display: "grid",
    gridTemplateColumns: {
      default: "190px minmax(0, 1fr)",
      "@media (max-width: 1000px)": "1fr",
    },
    gap: 25,
    alignItems: "start",
  },
  nav: {
    display: "flex",
    flexDirection: { default: "column", "@media (max-width: 1000px)": "row" },
    gap: 5,
    overflowX: "auto",
  },
  navItem: {
    padding: "10px 12px",
    borderRadius: 6,
    display: "flex",
    gap: 9,
    alignItems: "center",
    textAlign: "left",
    fontSize: 11,
    color: "#708460",
    whiteSpace: "nowrap",
    ":hover": { backgroundColor: "#f0f5e9", color: "#759552" },
  },
  selected: { backgroundColor: "#eaf1df", color: "#759653", fontWeight: 550 },
  content: { maxWidth: 960, minWidth: 0 },
  settingRow: {
    display: "flex",
    alignItems: "center",
    gap: 20,
    justifyContent: "space-between",
    padding: "18px 0",
    borderBottomWidth: 1,
    borderBottomStyle: "solid",
    borderBottomColor: "#ebf1df",
    ":last-child": { borderBottomWidth: 0 },
  },
  settingTitle: { fontSize: 12, fontWeight: 500, color: "#526d3c" },
  settingDesc: {
    fontSize: 11.5,
    color: "#738564",
    marginTop: 5,
    lineHeight: 1.8,
  },
  orgLogo: {
    width: 49,
    height: 49,
    borderRadius: 10,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#e6ecd9",
    backgroundColor: "#f3f4e9",
    color: "#98a77b",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 26,
    fontWeight: 500,
  },
  sectionTitle: {
    fontSize: 17,
    color: "#6a8b4d",
    letterSpacing: "-.4px",
    fontWeight: 550,
    marginBottom: 5,
  },
  panelFooter: {
    padding: "15px 20px",
    backgroundColor: "#fafcf5",
    borderTopWidth: 1,
    borderTopStyle: "solid",
    borderTopColor: "#e7efdb",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  integrations: {
    display: "grid",
    gridTemplateColumns: {
      default: "1fr 1fr",
      "@media (max-width: 640px)": "1fr",
    },
    gap: 15,
  },
  integration: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#e3ecd6",
    borderRadius: 8,
    padding: 19,
  },
  integrationIcon: {
    width: 37,
    height: 37,
    borderRadius: 8,
    backgroundColor: "#f3f0f7",
    color: "#a494b9",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 650,
    fontSize: 16,
  },
  severity: { display: "flex", gap: 12, alignItems: "center" },
});

export function SettingsPage() {
  const store = useStore();
  const location = useLocation();
  const [tab, setTab] = useState(
    new URLSearchParams(location.searchStr).get("tab") ?? "workspace",
  );
  useEffect(() => {
    const requested = new URLSearchParams(location.searchStr).get("tab");
    if (requested && tabs.some((t) => t.id === requested)) setTab(requested);
  }, [location.searchStr]);
  return (
    <div {...stylex.props(s.page)}>
      <PageHeader
        title="Settings"
        description="Make RelayOps work the way your organization does."
      />
      <div {...stylex.props(st.layout)}>
        <nav aria-label="Settings sections" {...stylex.props(st.nav)}>
          {tabs.map((item) => (
            <button
              key={item.id}
              aria-current={tab === item.id ? "page" : undefined}
              onClick={() => setTab(item.id)}
              {...stylex.props(st.navItem, tab === item.id && st.selected)}
            >
              <item.icon size={15} strokeWidth={1.6} />
              {item.name}
            </button>
          ))}
        </nav>
        <div
          key={store.hydrated ? "saved-settings" : "initial-settings"}
          {...stylex.props(st.content)}
        >
          {tab === "workspace" && <WorkspaceSettings />}
          {tab === "members" && <MembersSettings />}
          {tab === "integrations" && <IntegrationSettings />}
          {tab === "incidents" && <IncidentSettings />}
          {tab === "notifications" && <NotificationSettings />}
        </div>
      </div>
    </div>
  );
}
function WorkspaceSettings() {
  const store = useStore();
  const [name, setName] = useState(store.settings.workspace);
  const [org, setOrg] = useState(store.settings.organization);
  const [timezone, setTimezone] = useState(store.settings.timezone);
  return (
    <section {...stylex.props(s.panel)}>
      <div {...stylex.props(s.panelBody)}>
        <h2 {...stylex.props(st.sectionTitle)}>Workspace details</h2>
        <p {...stylex.props(st.settingDesc)}>
          Your workspace is where teams coordinate incidents and manage
          operations.
        </p>
        <div {...stylex.props(s.row, s.sectionSpace)}>
          <div {...stylex.props(st.orgLogo)}>✳</div>
          <div>
            <strong>{store.settings.organization}</strong>
            <p {...stylex.props(s.small, s.muted)}>
              Business workspace · Created January 12, 2025
            </p>
          </div>
        </div>
        <form
          id="workspace-settings"
          {...stylex.props(s.column, s.sectionSpace)}
          onSubmit={(e) => {
            e.preventDefault();
            if (!name.trim() || !org.trim()) return;
            store.saveSettings({
              workspace: name.trim(),
              organization: org.trim(),
              timezone,
            });
            store.toast("Workspace settings saved.");
          }}
        >
          <Field label="Workspace name">
            <Input
              value={name}
              required
              onChange={(e) => setName(e.target.value)}
            />
          </Field>
          <Field label="Organization name">
            <Input
              value={org}
              required
              onChange={(e) => setOrg(e.target.value)}
            />
          </Field>
          <Field label="Workspace timezone">
            <Select
              label="Workspace timezone"
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              options={[
                {
                  value: "America/New_York",
                  label: "Eastern Time · America/New_York",
                },
                {
                  value: "America/Los_Angeles",
                  label: "Pacific Time · America/Los_Angeles",
                },
                { value: "UTC", label: "Coordinated Universal Time · UTC" },
                {
                  value: "Europe/London",
                  label: "United Kingdom · Europe/London",
                },
                {
                  value: "Asia/Singapore",
                  label: "Singapore Time · Asia/Singapore",
                },
              ]}
            />
          </Field>
          <div {...stylex.props(s.note)}>
            <Globe size={16} />
            The workspace timezone is used for on-call schedules and incident
            timestamps.
          </div>
        </form>
        <div {...stylex.props(st.settingRow, s.sectionSpace)}>
          <div>
            <h3 {...stylex.props(st.settingTitle)}>Organization overview</h3>
            <p {...stylex.props(st.settingDesc)}>
              85 engineers · 12 teams · 47 production services
            </p>
          </div>
          <Badge tone="green">Business plan</Badge>
        </div>
      </div>
      <div {...stylex.props(st.panelFooter)}>
        <span {...stylex.props(s.small, s.muted)}>
          Changes apply to all workspace members.
        </span>
        <Button
          variant="primary"
          icon={Save}
          type="submit"
          form="workspace-settings"
        >
          Save changes
        </Button>
      </div>
    </section>
  );
}
function MembersSettings() {
  const store = useStore();
  const [query, setQuery] = useState("");
  const [invite, setInvite] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("Member");
  const [error, setError] = useState("");
  const [suspend, setSuspend] = useState<string>();
  const visible = people.filter((p) =>
    `${p.name} ${p.email}`.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <>
      <div {...stylex.props(s.spread, s.bottom16)}>
        <div>
          <h2 {...stylex.props(st.sectionTitle)}>Workspace members</h2>
          <p {...stylex.props(st.settingDesc)}>
            Manage access, roles, and invitations.
          </p>
        </div>
        <Button variant="primary" icon={Plus} onClick={() => setInvite(true)}>
          Invite member
        </Button>
      </div>
      <div {...stylex.props(s.panel)}>
        <div {...stylex.props(s.toolbar)}>
          <SearchInput
            value={query}
            onChange={setQuery}
            placeholder="Search members…"
          />
          <span {...stylex.props(s.small, s.muted)}>
            12 core members · 85 organization-wide
          </span>
        </div>
        <div {...stylex.props(s.tableScroll)}>
          <table {...stylex.props(s.table)}>
            <thead>
              <tr>
                {["Member", "Role", "Status", ""].map((h) => (
                  <th key={h} {...stylex.props(s.th)}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visible.map((p) => (
                <tr key={p.id}>
                  <td {...stylex.props(s.td)}>
                    <div {...stylex.props(s.row)}>
                      <Avatar id={p.id} />
                      <div>
                        <strong {...stylex.props(s.small)}>
                          {p.name}
                          {p.id === "alex" && " (you)"}
                        </strong>
                        <p {...stylex.props(s.muted, s.small)}>{p.email}</p>
                      </div>
                    </div>
                  </td>
                  <td {...stylex.props(s.td)}>
                    <Select
                      label={`Role for ${p.name}`}
                      value={store.settings.roles[p.id] ?? "Member"}
                      disabled={p.id === "alex"}
                      onChange={(e) => {
                        store.saveSettings({
                          roles: {
                            ...store.settings.roles,
                            [p.id]: e.target.value,
                          },
                        });
                        store.toast(`${p.name}'s role updated.`);
                      }}
                      options={["Admin", "Member", "Viewer"]}
                    />
                  </td>
                  <td {...stylex.props(s.td)}>
                    <Badge dot>
                      {store.settings.memberStatus[p.id] ?? "Active"}
                    </Badge>
                  </td>
                  <td {...stylex.props(s.td)}>
                    {p.id !== "alex" && (
                      <Button
                        small
                        variant="ghost"
                        onClick={() => {
                          if (
                            store.settings.memberStatus[p.id] === "Suspended"
                          ) {
                            store.saveSettings({
                              memberStatus: {
                                ...store.settings.memberStatus,
                                [p.id]: "Active",
                              },
                            });
                            store.toast("Member access restored.");
                          } else setSuspend(p.id);
                        }}
                      >
                        {store.settings.memberStatus[p.id] === "Suspended"
                          ? "Restore"
                          : "Suspend"}
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
              {store.settings.invites
                .filter((p) =>
                  `${p.name} ${p.email}`
                    .toLowerCase()
                    .includes(query.toLowerCase()),
                )
                .map((p) => (
                  <tr key={p.email}>
                    <td {...stylex.props(s.td)}>
                      <strong {...stylex.props(s.small)}>{p.name}</strong>
                      <p {...stylex.props(s.small, s.muted)}>{p.email}</p>
                    </td>
                    <td {...stylex.props(s.td)}>
                      <Badge>{p.role}</Badge>
                    </td>
                    <td {...stylex.props(s.td)}>
                      <Badge tone="orange">Invited</Badge>
                    </td>
                    <td {...stylex.props(s.td)}>
                      <Button
                        small
                        onClick={() => {
                          store.saveSettings({
                            invites: store.settings.invites.filter(
                              (x) => x.email !== p.email,
                            ),
                          });
                          store.toast("Invitation revoked.");
                        }}
                      >
                        Revoke
                      </Button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <div {...stylex.props(s.tableFoot)}>
          Admins manage settings. Members respond to incidents. Viewers have
          read-only access.
        </div>
      </div>
      {invite && (
        <Modal
          title="Invite a workspace member"
          onClose={() => setInvite(false)}
          footer={
            <Button
              type="submit"
              form="invite-form"
              variant="primary"
              icon={Mail}
            >
              Send invitation
            </Button>
          }
        >
          <form
            id="invite-form"
            {...stylex.props(s.column)}
            onSubmit={(e) => {
              e.preventDefault();
              const normalized = email.trim().toLowerCase();
              if (
                people.some((p) => p.email.toLowerCase() === normalized) ||
                store.settings.invites.some(
                  (p) => p.email.toLowerCase() === normalized,
                )
              ) {
                setError(
                  "This person is already a member or has a pending invitation.",
                );
                return;
              }
              store.saveSettings({
                invites: [
                  ...store.settings.invites,
                  { name: name.trim(), email: normalized, role },
                ],
              });
              store.toast(`Invitation created for ${normalized}.`);
              setInvite(false);
              setEmail("");
              setName("");
            }}
          >
            <Field label="Full name">
              <Input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Field>
            <Field label="Email address">
              <Input
                required
                type="email"
                placeholder="name@northstar.io"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Field>
            <Field label="Workspace role">
              <Select
                label="Invitation role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                options={["Admin", "Member", "Viewer"]}
              />
            </Field>
            {error && (
              <p role="alert" {...stylex.props(s.error)}>
                {error}
              </p>
            )}
            <p {...stylex.props(s.small, s.muted)}>
              Demo workspace: invitations are recorded locally. No email is
              sent.
            </p>
          </form>
        </Modal>
      )}
      {suspend && (
        <Modal
          title={`Suspend ${person(suspend)?.name}?`}
          onClose={() => setSuspend(undefined)}
          footer={
            <>
              <Button onClick={() => setSuspend(undefined)}>Cancel</Button>
              <Button
                variant="danger"
                onClick={() => {
                  store.saveSettings({
                    memberStatus: {
                      ...store.settings.memberStatus,
                      [suspend]: "Suspended",
                    },
                  });
                  setSuspend(undefined);
                  store.toast("Member access suspended.");
                }}
              >
                Suspend access
              </Button>
            </>
          }
        >
          <p {...stylex.props(s.secondary)}>
            This member will no longer have workspace access. Their incident
            history and ownership records will remain. You can restore access at
            any time.
          </p>
        </Modal>
      )}
    </>
  );
}
function IntegrationSettings() {
  const store = useStore();
  const [selected, setSelected] = useState<string>();
  const descriptions: Record<string, string> = {
    GitHub:
      "Bring deployments, commits, and pull requests into your incident context.",
    Slack:
      "Coordinate responses and publish incident updates to your team channels.",
    Datadog:
      "Route infrastructure monitors and service alerts into one triage queue.",
    PagerDuty:
      "Connect on-call rotations and escalation policies with your responders.",
    Sentry:
      "Track application errors and group related exceptions into incidents.",
    AWS: "Monitor CloudWatch alarms and correlate infrastructure changes.",
    Grafana: "Connect observability dashboards, metrics, and alert rules.",
  };
  return (
    <>
      <h2 {...stylex.props(st.sectionTitle)}>Connected to your workflow</h2>
      <p {...stylex.props(st.settingDesc, s.bottom16)}>
        Your operational context, together in one place.
      </p>
      <div {...stylex.props(st.integrations)}>
        {Object.entries(descriptions).map(([name, desc]) => (
          <article key={name} {...stylex.props(st.integration)}>
            <div {...stylex.props(s.spread)}>
              <div {...stylex.props(st.integrationIcon)}>
                {name === "GitHub" ? (
                  <Github size={21} />
                ) : name === "Slack" ? (
                  <Slack size={21} />
                ) : (
                  name[0]
                )}
              </div>
              <Badge
                dot
                tone={store.settings.integrations[name] ? "green" : "gray"}
              >
                {store.settings.integrations[name]
                  ? "Connected"
                  : "Not connected"}
              </Badge>
            </div>
            <h3 {...stylex.props(st.settingTitle, s.space12)}>{name}</h3>
            <p {...stylex.props(st.settingDesc)}>{desc}</p>
            <div {...stylex.props(s.space12)}>
              <Button small onClick={() => setSelected(name)}>
                {store.settings.integrations[name]
                  ? "Manage connection"
                  : "Connect integration"}
                <ChevronRight size={12} />
              </Button>
            </div>
          </article>
        ))}
      </div>
      {selected && (
        <Modal
          title={`${selected} integration`}
          description={descriptions[selected]}
          onClose={() => setSelected(undefined)}
          footer={
            <>
              <Button onClick={() => setSelected(undefined)}>Cancel</Button>
              <Button
                variant={
                  store.settings.integrations[selected] ? "danger" : "primary"
                }
                icon={store.settings.integrations[selected] ? Unplug : Link2}
                onClick={() => {
                  const connected = store.settings.integrations[selected];
                  store.saveSettings({
                    integrations: {
                      ...store.settings.integrations,
                      [selected]: !connected,
                    },
                  });
                  store.toast(
                    `${selected} ${connected ? "disconnected" : "connected"} in this workspace.`,
                  );
                  setSelected(undefined);
                }}
              >
                {store.settings.integrations[selected]
                  ? "Disconnect"
                  : "Connect demo integration"}
              </Button>
            </>
          }
        >
          <div {...stylex.props(s.column)}>
            <div {...stylex.props(st.settingRow)}>
              <span>Connection status</span>
              <Badge>
                {store.settings.integrations[selected]
                  ? "Connected"
                  : "Not connected"}
              </Badge>
            </div>
            <div {...stylex.props(st.settingRow)}>
              <span>Workspace</span>
              <strong>{store.settings.workspace}</strong>
            </div>
            <div {...stylex.props(st.settingRow)}>
              <span>Sync scope</span>
              <span>All production services</span>
            </div>
            <div {...stylex.props(s.note)}>
              <Info size={16} />
              This is a local demo connection. No external credentials are
              needed. Disconnecting preserves existing incident and alert
              history.
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
function IncidentSettings() {
  const store = useStore();
  const [severities, setSeverities] = useState(store.settings.severities);
  const [commander, setCommander] = useState(store.settings.commander);
  const [auto, setAuto] = useState(store.settings.autoIncident);
  return (
    <form
      {...stylex.props(s.column, s.gap20)}
      onSubmit={(e) => {
        e.preventDefault();
        store.saveSettings({ severities, commander, autoIncident: auto });
        store.toast("Incident configuration saved.");
      }}
    >
      <Panel title="Severity definitions">
        <p {...stylex.props(s.small, s.muted, s.bottom16)}>
          Help responders choose the right level under pressure.
        </p>
        <div {...stylex.props(s.column)}>
          {Object.entries(severities).map(([sev, desc]) => (
            <label key={sev} {...stylex.props(st.severity)}>
              <Badge>{sev}</Badge>
              <input
                required
                aria-label={`${sev} definition`}
                value={desc}
                onChange={(e) =>
                  setSeverities({ ...severities, [sev]: e.target.value })
                }
                {...stylex.props(s.input)}
              />
            </label>
          ))}
        </div>
      </Panel>
      <Panel title="Incident lifecycle">
        {[
          {
            state: "Investigating",
            desc: "The response team is assessing impact and identifying the cause.",
          },
          {
            state: "Identified",
            desc: "The cause is understood and mitigation is in progress.",
          },
          {
            state: "Monitoring",
            desc: "A fix is in place. The team is verifying service recovery.",
          },
          {
            state: "Resolved",
            desc: "Service is healthy and the immediate response is complete.",
          },
        ].map((status) => (
          <div key={status.state} {...stylex.props(st.settingRow)}>
            <div>
              <Badge dot>{status.state}</Badge>
              <p {...stylex.props(st.settingDesc)}>{status.desc}</p>
            </div>
            <CheckCircle2 size={15} color="#a5ba8f" />
          </div>
        ))}
      </Panel>
      <Panel title="Response defaults">
        <Field label="Default incident commander">
          <Select
            label="Default commander behavior"
            options={["On-call engineer", "Incident creator", "Team lead"]}
            value={commander}
            onChange={(e) => setCommander(e.target.value)}
          />
        </Field>
        <div {...stylex.props(st.settingRow, s.space12)}>
          <div>
            <h3 {...stylex.props(st.settingTitle)}>
              Automatic incident creation
            </h3>
            <p {...stylex.props(st.settingDesc)}>
              Create an incident when a SEV0 or SEV1 monitor fires for a Tier 1
              service.
            </p>
          </div>
          <Toggle
            label="Automatic incident creation"
            checked={auto}
            onChange={setAuto}
          />
        </div>
      </Panel>
      <div {...stylex.props(s.spread)}>
        <p {...stylex.props(s.small, s.muted)}>
          Updates apply to newly created incidents.
        </p>
        <Button type="submit" variant="primary" icon={Save}>
          Save configuration
        </Button>
      </div>
    </form>
  );
}
function NotificationSettings() {
  const store = useStore();
  const [prefs, setPrefs] = useState({
    emailAlerts: store.settings.emailAlerts,
    pushAlerts: store.settings.pushAlerts,
    digest: store.settings.digest,
    mentions: store.settings.mentions,
  });
  const rows: { key: keyof typeof prefs; name: string; desc: string }[] = [
    {
      key: "emailAlerts",
      name: "Incident and alert emails",
      desc: "Receive email when you are assigned to an incident or a high-severity alert.",
    },
    {
      key: "pushAlerts",
      name: "Desktop notifications",
      desc: "Get in-app notifications for pages, shift changes, and incident updates.",
    },
    {
      key: "mentions",
      name: "Mentions and assignments",
      desc: "Know when a teammate mentions you or assigns a corrective action.",
    },
    {
      key: "digest",
      name: "Weekly operational digest",
      desc: "A Monday summary of incidents, reliability trends, and open action items.",
    },
  ];
  return (
    <section {...stylex.props(s.panel)}>
      <div {...stylex.props(s.panelBody)}>
        <h2 {...stylex.props(st.sectionTitle)}>
          Your notification preferences
        </h2>
        <p {...stylex.props(st.settingDesc)}>
          Choose what reaches you. These settings apply to your account only.
        </p>
        {rows.map((row) => (
          <div key={row.key} {...stylex.props(st.settingRow)}>
            <div>
              <h3 {...stylex.props(st.settingTitle)}>{row.name}</h3>
              <p {...stylex.props(st.settingDesc)}>{row.desc}</p>
            </div>
            <Toggle
              label={row.name}
              checked={prefs[row.key]}
              onChange={(value) => setPrefs({ ...prefs, [row.key]: value })}
            />
          </div>
        ))}
        <div {...stylex.props(s.note, s.sectionSpace)}>
          <Bell size={16} />
          <p>
            Urgent on-call pages follow your team’s escalation policy and cannot
            be muted here. Review your on-call schedule before changing
            availability.
          </p>
        </div>
      </div>
      <div {...stylex.props(st.panelFooter)}>
        <span {...stylex.props(s.small, s.muted)}>
          Delivery address: alex.morgan@northstar.io
        </span>
        <Button
          icon={Save}
          variant="primary"
          onClick={() => {
            store.saveSettings(prefs);
            store.toast("Notification preferences saved.");
          }}
        >
          Save preferences
        </Button>
      </div>
    </section>
  );
}
