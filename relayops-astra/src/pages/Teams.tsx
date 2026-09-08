import * as stylex from "@stylexjs/stylex";
import { useLocation } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Bell,
  CheckCircle2,
  ChevronRight,
  Hash,
  Headphones,
  Mail,
  MessageSquare,
  Plus,
  Server,
  ShieldAlert,
  Users,
} from "lucide-react";
import { people, person, services, teams, type Team } from "../data";
import { useStore } from "../state";
import {
  AppLink,
  Avatar,
  AvatarStack,
  Badge,
  Button,
  EmptyResults,
  Field,
  Modal,
  PageHeader,
  Panel,
  PersonName,
  SearchInput,
  Tabs,
  s,
  useGo,
} from "../components/ui";
import { ServiceCard } from "./Services";
import { UptimeBars } from "../components/charts";

const t = stylex.create({
  teamIcon: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: "#edf2e2",
    color: "#8ca575",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  purple: { backgroundColor: "#f0eaf6", color: "#a191b8" },
  blue: { backgroundColor: "#eaf1f8", color: "#91a9c0" },
  sand: { backgroundColor: "#f5f0e5", color: "#baa67f" },
  rose: { backgroundColor: "#f7ebe7", color: "#c0a097" },
  name: {
    fontSize: 15,
    fontWeight: 550,
    letterSpacing: "-.3px",
    color: "#6b8354",
  },
  description: {
    fontSize: 11,
    color: "#758662",
    lineHeight: 1.8,
    marginBlock: "14px 20px",
  },
  detail: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    fontSize: 10.5,
    paddingBlock: 10,
    borderTopWidth: 1,
    borderTopStyle: "solid",
    borderTopColor: "#edf2e1",
    color: "#728460",
  },
  cardFoot: {
    display: "flex",
    gap: 15,
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopStyle: "solid",
    borderTopColor: "#e9efdc",
    padding: "12px 20px",
    fontSize: 9.5,
    color: "#9db086",
    backgroundColor: "#fcfdf8",
  },
  teamHeader: {
    display: "flex",
    alignItems: "center",
    gap: 17,
    marginBottom: 20,
  },
  teamIconLarge: { width: 57, height: 57, borderRadius: 13 },
  stats: {
    display: "flex",
    gap: 23,
    flexWrap: "wrap",
    fontSize: 11,
    color: "#a5b391",
    marginBottom: 24,
  },
  memberRow: {
    padding: "15px 0",
    display: "flex",
    alignItems: "center",
    gap: 12,
    borderBottomWidth: 1,
    borderBottomStyle: "solid",
    borderBottomColor: "#edf2e0",
  },
  memberName: {
    fontSize: 11.5,
    fontWeight: 500,
    color: "#7d9562",
    textAlign: "left",
    ":hover": { color: "#507436" },
  },
  memberRole: { fontSize: 11, color: "#738463", marginTop: 4 },
  metrics: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 10,
    paddingBottom: 20,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 550,
    color: "#78975e",
    letterSpacing: "-.6px",
  },
});

export function TeamsPage() {
  const store = useStore();
  const go = useGo();
  const [query, setQuery] = useState("");
  const visible = teams.filter((team) =>
    `${team.name} ${team.description} ${person(team.lead)?.name}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
  return (
    <div {...stylex.props(s.page)}>
      <PageHeader
        title="Teams"
        description="The people behind your services. Ownership you can count on."
        actions={
          <Button icon={Users} onClick={() => go("/settings?tab=members")}>
            Manage members
          </Button>
        }
      />
      <div {...stylex.props(s.spread, s.bottom16, s.wrap)}>
        <SearchInput
          placeholder="Find a team…"
          value={query}
          onChange={setQuery}
        />
        <span {...stylex.props(s.small, s.muted)}>
          5 operational teams · 85 engineers across Northstar Labs
        </span>
      </div>
      <div {...stylex.props(s.grid3)}>
        {visible.map((team) => {
          const owned = services.filter((s) => s.team === team.name);
          const incidents = store.incidents.filter(
            (i) =>
              i.status !== "Resolved" &&
              i.services.some((id) => owned.some((s) => s.id === id)),
          );
          return (
            <article {...stylex.props(s.panel)} key={team.id}>
              <div {...stylex.props(s.panelBody)}>
                <div {...stylex.props(s.spread)}>
                  <div
                    {...stylex.props(
                      t.teamIcon,
                      team.color === "lilac" && t.purple,
                      team.color === "blue" && t.blue,
                      team.color === "sand" && t.sand,
                      team.color === "rose" && t.rose,
                    )}
                  >
                    <Users size={20} strokeWidth={1.5} />
                  </div>
                  <Badge>{team.members.length} members</Badge>
                </div>
                <h2 {...stylex.props(t.name, s.space12)}>
                  <AppLink to={`/teams/${team.id}`} subtle>
                    {team.name}
                  </AppLink>
                </h2>
                <p {...stylex.props(t.description)}>{team.description}</p>
                <div {...stylex.props(t.detail)}>
                  <span>Team lead</span>
                  <PersonName id={team.lead} />
                </div>
                <div {...stylex.props(t.detail)}>
                  <span>On-call now</span>
                  <PersonName
                    id={store.schedule[`${team.id}-primary`] ?? team.primary}
                  />
                </div>
                <div {...stylex.props(t.detail)}>
                  <span>Reliability · 30d</span>
                  <strong>{team.reliability}</strong>
                </div>
                <UptimeBars degraded={incidents.length > 0} />
              </div>
              <div {...stylex.props(t.cardFoot)}>
                <span {...stylex.props(s.row, s.gap6)}>
                  <Server size={12} />
                  {owned.length} services
                </span>
                <span {...stylex.props(s.row, s.gap6)}>
                  <ShieldAlert size={12} />
                  {incidents.length} active
                </span>
                <AppLink to={`/teams/${team.id}`}>
                  View team
                  <ArrowRight size={11} />
                </AppLink>
              </div>
            </article>
          );
        })}
      </div>
      {!visible.length && <EmptyResults onReset={() => setQuery("")} />}
    </div>
  );
}

export function TeamDetail({ id }: { id: string }) {
  const store = useStore();
  const go = useGo();
  const location = useLocation();
  const team = teams.find((x) => x.id === id);
  const [tab, setTab] = useState("overview");
  const [selectedPerson, setSelectedPerson] = useState<string>();
  const [contact, setContact] = useState(false);
  const [message, setMessage] = useState("");
  useEffect(() => {
    const requested = new URLSearchParams(location.searchStr).get("person");
    if (requested && person(requested)) setSelectedPerson(requested);
  }, [location.searchStr]);
  if (!team)
    return (
      <div {...stylex.props(s.page)}>
        <PageHeader title="Team not found" />
        <AppLink to="/teams">Return to directory</AppLink>
      </div>
    );
  const owned = services.filter((s) => s.team === team.name);
  const incidents = store.incidents.filter((i) =>
    i.services.some((id) => owned.some((s) => s.id === id)),
  );
  const active = incidents.filter((i) => i.status !== "Resolved");
  const current = store.schedule[`${team.id}-primary`] ?? team.primary;
  const roster = (
    <>
      {team.members.map((id) => (
        <div key={id} {...stylex.props(t.memberRow)}>
          <Avatar id={id} size="large" />
          <div {...stylex.props(s.grow)}>
            <button
              {...stylex.props(t.memberName)}
              onClick={() => setSelectedPerson(id)}
            >
              {person(id)?.name}
            </button>
            <div {...stylex.props(t.memberRole)}>{person(id)?.role}</div>
          </div>
          {id === team.lead && <Badge tone="purple">Team lead</Badge>}
          {id === current && (
            <Badge tone="green" dot>
              On call
            </Badge>
          )}
          <button
            aria-label={`View ${person(id)?.name}`}
            onClick={() => setSelectedPerson(id)}
          >
            <ChevronRight size={13} color="#adbc9a" />
          </button>
        </div>
      ))}
    </>
  );
  return (
    <div {...stylex.props(s.page)}>
      <div {...stylex.props(s.row, s.small, s.muted, s.bottom16)}>
        <AppLink to="/teams">
          <ArrowLeft size={12} />
          Teams
        </AppLink>
        <ChevronRight size={11} />
        {team.name}
      </div>
      <PageHeader
        title={`${team.name} team`}
        description={team.description}
        actions={
          <>
            <Button icon={Hash} onClick={() => setContact(true)}>
              Contact team
            </Button>
            <Button icon={Users} onClick={() => go("/settings?tab=members")}>
              Manage members
            </Button>
          </>
        }
      />
      <div {...stylex.props(t.stats)}>
        <span {...stylex.props(s.row, s.gap6)}>
          <Users size={14} />
          {team.members.length} members
        </span>
        <span {...stylex.props(s.row, s.gap6)}>
          <Server size={14} />
          {owned.length} owned services
        </span>
        <span {...stylex.props(s.row, s.gap6)}>
          <ShieldAlert size={14} />
          {active.length} active incident{active.length !== 1 ? "s" : ""}
        </span>
        <span {...stylex.props(s.row, s.gap6)}>
          <CheckCircle2 size={14} />
          {team.reliability} reliability
        </span>
      </div>
      <Tabs
        tabs={[
          { id: "overview", label: "Overview" },
          { id: "members", label: "Members", count: team.members.length },
          { id: "services", label: "Owned services", count: owned.length },
          { id: "incidents", label: "Incidents", count: incidents.length },
        ]}
        active={tab}
        onChange={setTab}
      />
      <div {...stylex.props(s.sectionSpace)}>
        {tab === "services" ? (
          <div {...stylex.props(s.grid3)}>
            {owned.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        ) : (
          <div {...stylex.props(s.detailGrid)}>
            <div {...stylex.props(s.column, s.gap20)}>
              {(tab === "overview" || tab === "members") && (
                <Panel
                  title="The team"
                  action={<AvatarStack ids={team.members} />}
                >
                  {roster}
                </Panel>
              )}
              {(tab === "overview" || tab === "incidents") && (
                <Panel
                  title={
                    tab === "overview" ? "Active incidents" : "Incident history"
                  }
                >
                  {(tab === "overview" ? active : incidents).map((incident) => (
                    <div key={incident.id} {...stylex.props(t.memberRow)}>
                      <Badge>{incident.severity}</Badge>
                      <div {...stylex.props(s.grow)}>
                        <AppLink to={`/incidents/${incident.id}`}>
                          {incident.title}
                        </AppLink>
                        <p {...stylex.props(s.small, s.muted, s.space8)}>
                          {incident.id} · {incident.created} · Commander:{" "}
                          {person(incident.commander)?.name}
                        </p>
                      </div>
                      <Badge dot>{incident.status}</Badge>
                    </div>
                  ))}
                  {tab === "overview" && !active.length && (
                    <div {...stylex.props(s.note)}>
                      <CheckCircle2 size={16} />
                      No active incidents. Your services are running normally.
                    </div>
                  )}
                </Panel>
              )}
            </div>
            <aside {...stylex.props(s.column, s.gap20)}>
              <Panel title="On-call coverage">
                <div {...stylex.props(s.row)}>
                  <Avatar id={current} size="large" />
                  <div>
                    <strong>{person(current)?.name}</strong>
                    <p {...stylex.props(s.small, s.muted)}>
                      Primary · until 6:00 PM
                    </p>
                  </div>
                </div>
                <div {...stylex.props(t.detail, s.space12)}>
                  <span>Secondary</span>
                  <PersonName id={team.secondary} />
                </div>
                <div {...stylex.props(t.detail)}>
                  <span>Next shift</span>
                  <PersonName id={team.next} />
                </div>
                <div {...stylex.props(s.space12)}>
                  <AppLink to="/on-call">
                    <Headphones size={12} />
                    View schedule & escalation
                    <ArrowRight size={11} />
                  </AppLink>
                </div>
              </Panel>
              <Panel title="Owned services">
                {owned.map((service) => (
                  <div {...stylex.props(t.detail)} key={service.id}>
                    <AppLink to={`/services/${service.id}`}>
                      <Server size={12} />
                      {service.name}
                    </AppLink>
                    <Badge>{service.tier}</Badge>
                  </div>
                ))}
              </Panel>
              <Panel title="Team reliability">
                <div {...stylex.props(t.metricValue)}>{team.reliability}</div>
                <p {...stylex.props(s.small, s.muted, s.space8)}>
                  Service availability · last 30 days
                </p>
                <div {...stylex.props(s.space12)}>
                  <UptimeBars degraded={active.length > 0} />
                </div>
                <div {...stylex.props(s.space12)}>
                  <AppLink to="/analytics">
                    View operational analytics
                    <ArrowRight size={11} />
                  </AppLink>
                </div>
              </Panel>
              <Panel title="Team channels">
                <button
                  {...stylex.props(s.link)}
                  onClick={() => setContact(true)}
                >
                  <Hash size={13} />
                  {team.id}-engineering
                </button>
                <p {...stylex.props(s.small, s.muted, s.space8)}>
                  {team.id}@northstar.io
                </p>
              </Panel>
            </aside>
          </div>
        )}
      </div>
      {selectedPerson && (
        <Modal
          title={person(selectedPerson)?.name ?? "Team member"}
          onClose={() => setSelectedPerson(undefined)}
          footer={
            <Button
              icon={MessageSquare}
              onClick={() => {
                setSelectedPerson(undefined);
                setContact(true);
              }}
            >
              Send a team message
            </Button>
          }
        >
          <div {...stylex.props(s.row)}>
            <Avatar id={selectedPerson} size="large" />
            <div>
              <strong>{person(selectedPerson)?.role}</strong>
              <p {...stylex.props(s.secondary)}>
                {person(selectedPerson)?.email}
              </p>
            </div>
          </div>
          <div {...stylex.props(s.note, s.sectionSpace)}>
            <Users size={17} />
            {team.name} team ·{" "}
            {selectedPerson === team.lead
              ? "Team lead and incident commander"
              : selectedPerson === current
                ? "Currently on call"
                : "Available responder"}
          </div>
        </Modal>
      )}
      {contact && (
        <Modal
          title={`Contact ${team.name}`}
          description={`Message #${team.id}-engineering · ${team.members.length} members`}
          onClose={() => setContact(false)}
          footer={
            <Button
              type="submit"
              form="team-message"
              variant="primary"
              icon={MessageSquare}
            >
              Send message
            </Button>
          }
        >
          <form
            id="team-message"
            onSubmit={(e) => {
              e.preventDefault();
              if (!message.trim()) return;
              store.postTeamMessage(team.id, message.trim());
              store.toast(`Message sent to the ${team.name} team.`);
              setContact(false);
              setMessage("");
            }}
          >
            <Field label="Message">
              <textarea
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Share context or ask the team for help…"
                {...stylex.props(s.input, s.textarea)}
              />
            </Field>
            <div {...stylex.props(s.column, s.space12)}>
              {store.teamMessages
                .filter((m) => m.team === team.id)
                .slice(-4)
                .map((m) => (
                  <div key={m.id} {...stylex.props(s.note)}>
                    <Avatar id="alex" size="small" />
                    <div>
                      <strong>Alex Morgan · {m.time}</strong>
                      <p>{m.text}</p>
                    </div>
                  </div>
                ))}
            </div>
            <p {...stylex.props(s.small, s.muted, s.space12)}>
              For urgent issues, declare an incident or page the on-call
              engineer.
            </p>
          </form>
        </Modal>
      )}
    </div>
  );
}
