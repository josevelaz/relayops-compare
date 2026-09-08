import * as stylex from "@stylexjs/stylex";
import { useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Headphones,
  Plus,
  Shield,
  Users,
} from "lucide-react";
import { people, person, teams, type Team } from "../data";
import { useStore } from "../state";
import {
  AppLink,
  Avatar,
  Badge,
  Button,
  Field,
  Input,
  Modal,
  PageHeader,
  Panel,
  PersonName,
  Select,
  s,
} from "../components/ui";

const o = stylex.create({
  coverage: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 10,
    padding: "15px 19px",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#dfe9d5",
    backgroundColor: "#f3f8ed",
    borderRadius: 7,
    marginBottom: 23,
    color: "#88a375",
    fontSize: 11,
  },
  scheduleScroll: { overflowX: "auto" },
  schedule: {
    minWidth: 840,
    display: "grid",
    gridTemplateColumns: "150px repeat(7, minmax(90px, 1fr))",
  },
  day: {
    padding: "13px 8px",
    borderBottomWidth: 1,
    borderBottomStyle: "solid",
    borderBottomColor: "#e5ecdc",
    borderLeftWidth: 1,
    borderLeftStyle: "solid",
    borderLeftColor: "#eff3e7",
    textAlign: "center",
    fontSize: 10,
    color: "#a1ae8e",
    backgroundColor: "#fbfcf8",
  },
  today: { backgroundColor: "#f0f6e8", color: "#699350" },
  dayNumber: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: 25,
    height: 25,
    borderRadius: "50%",
    marginTop: 4,
    fontSize: 13,
    fontWeight: 550,
  },
  todayNumber: { backgroundColor: "#6d9257", color: "#fff" },
  teamCell: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    gap: 3,
    padding: "15px 13px",
    fontSize: 10.5,
    borderBottomWidth: 1,
    borderBottomStyle: "solid",
    borderBottomColor: "#e7efdc",
    color: "#849a70",
  },
  cell: {
    padding: "15px 6px",
    borderLeftWidth: 1,
    borderLeftStyle: "solid",
    borderLeftColor: "#edf2e3",
    borderBottomWidth: 1,
    borderBottomStyle: "solid",
    borderBottomColor: "#e7efdc",
    display: "flex",
    flexDirection: "column",
    gap: 7,
  },
  shift: {
    display: "flex",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#eaf2e1",
    color: "#78945e",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#deebd1",
    borderRadius: 4,
    padding: "5px 5px",
    fontSize: 8.5,
    minHeight: 28,
    whiteSpace: "nowrap",
    ":hover": { borderColor: "#a9c291" },
  },
  shiftPurple: {
    backgroundColor: "#efebf5",
    color: "#9782af",
    borderColor: "#e6ddf0",
  },
  shiftBlue: {
    backgroundColor: "#eaf0f7",
    color: "#839fb7",
    borderColor: "#dce7f2",
  },
  shiftSand: {
    backgroundColor: "#f4f0e5",
    color: "#ab9669",
    borderColor: "#eee5d1",
  },
  shiftRose: {
    backgroundColor: "#f6e9e6",
    color: "#b99187",
    borderColor: "#f0ddd8",
  },
  secondary: {
    opacity: 0.65,
    backgroundColor: "#f9fbf5",
    borderStyle: "dashed",
  },
  note: {
    fontSize: 9,
    color: "#a1b18e",
    padding: "12px 18px",
    display: "flex",
    gap: 7,
    alignItems: "center",
  },
  roster: {
    display: "grid",
    gridTemplateColumns: {
      default: "repeat(3, minmax(0, 1fr))",
      "@media (max-width: 1100px)": "repeat(2, minmax(0, 1fr))",
      "@media (max-width: 600px)": "1fr",
    },
    gap: 17,
    marginTop: 22,
  },
  rosterRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    paddingBlock: 10,
    borderBottomWidth: 1,
    borderBottomStyle: "solid",
    borderBottomColor: "#edf3e2",
    color: "#8da477",
    fontSize: 10.5,
  },
  policy: {
    display: "flex",
    gap: 12,
    alignItems: "flex-start",
    paddingBlock: 15,
    borderBottomWidth: 1,
    borderBottomStyle: "solid",
    borderBottomColor: "#e9f1dc",
  },
  policyStep: {
    width: 28,
    height: 28,
    borderRadius: "50%",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#dce9ce",
    color: "#91aa76",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 11,
    flexShrink: 0,
  },
});

export function OnCallPage() {
  const store = useStore();
  const [week, setWeek] = useState(0);
  const [override, setOverride] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState("payments");
  const [selectedDate, setSelectedDate] = useState("2026-09-08");
  const [selectedRole, setSelectedRole] = useState("primary");
  const [policy, setPolicy] = useState<Team>();
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(Date.UTC(2026, 8, 7 + week * 7 + i));
    return {
      iso: date.toISOString().slice(0, 10),
      day: date.getUTCDate(),
      month: date.toLocaleDateString("en-US", {
        month: "short",
        timeZone: "UTC",
      }),
    };
  });
  const shiftPerson = (team: Team, index: number, role: string) =>
    store.schedule[`${team.id}-${dates[index].iso}-${role}`] ??
    (dates[index].iso === "2026-09-08"
      ? store.schedule[`${team.id}-${role}`]
      : undefined) ??
    (role === "primary"
      ? index < 4 && week === 0
        ? team.primary
        : team.next
      : team.secondary);
  return (
    <div {...stylex.props(s.page)}>
      <PageHeader
        title="On-call"
        description="Clear ownership. Complete coverage. No surprises."
        actions={
          <Button
            icon={Plus}
            variant="primary"
            onClick={() => {
              setSelectedDate("2026-09-08");
              setSelectedRole("primary");
              setOverride(true);
            }}
          >
            Create override
          </Button>
        }
      />
      <div {...stylex.props(o.coverage)}>
        <span {...stylex.props(s.row)}>
          <CheckCircle2 size={17} />
          <strong>All 5 teams have primary and secondary coverage.</strong>
        </span>
        <span {...stylex.props(s.row, s.small)}>
          <Clock3 size={13} />
          Elena and Ethan start at 6:00 PM today
        </span>
      </div>
      <Panel
        title="Weekly schedule"
        action={
          <div {...stylex.props(s.row, s.gap8)}>
            <Button
              small
              aria-label="Previous week"
              onClick={() => setWeek(week - 1)}
            >
              <ChevronLeft size={13} />
            </Button>
            <span {...stylex.props(s.small, s.secondary)}>
              {dates[0].month} {dates[0].day} – {dates[6].month} {dates[6].day},
              2026
            </span>
            <Button
              small
              aria-label="Next week"
              onClick={() => setWeek(week + 1)}
            >
              <ChevronRight size={13} />
            </Button>
            <Button small onClick={() => setWeek(0)}>
              Today
            </Button>
          </div>
        }
        noPad
      >
        <div {...stylex.props(o.scheduleScroll)}>
          <div {...stylex.props(o.schedule)}>
            <div
              {...stylex.props(o.day)}
              style={{ textAlign: "left", paddingLeft: 15 }}
            >
              TEAM / ROTATION
            </div>
            {dates.map((date, index) => (
              <div
                {...stylex.props(o.day, date.iso === "2026-09-08" && o.today)}
                key={date.iso}
              >
                <div>
                  {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"][index]}
                </div>
                <span
                  {...stylex.props(
                    o.dayNumber,
                    date.iso === "2026-09-08" && o.todayNumber,
                  )}
                >
                  {date.day}
                </span>
              </div>
            ))}
            {teams.map((team, t) => (
              <OnCallRow
                key={team.id}
                team={team}
                dates={dates}
                index={t}
                getPerson={(index, role) => shiftPerson(team, index, role)}
                onEdit={(date, role) => {
                  setSelectedTeam(team.id);
                  setSelectedDate(date);
                  setSelectedRole(role);
                  setOverride(true);
                }}
              />
            ))}
          </div>
        </div>
        <div {...stylex.props(o.note)}>
          <CalendarDays size={12} />
          Primary shifts: 9:00 AM – 6:00 PM · Secondary covers 24 hours ·
          Schedule shown in {store.settings.timezone}
        </div>
      </Panel>
      <div {...stylex.props(s.spread, s.sectionSpace)}>
        <h2 {...stylex.props(s.panelTitle)}>Current coverage</h2>
        <span {...stylex.props(s.muted, s.small)}>
          Tuesday, September 8 · 11:08 AM
        </span>
      </div>
      <div {...stylex.props(o.roster)}>
        {teams.map((team) => (
          <Panel
            key={team.id}
            title={<AppLink to={`/teams/${team.id}`}>{team.name}</AppLink>}
            action={
              <Badge tone="green" dot>
                Covered
              </Badge>
            }
          >
            <div {...stylex.props(o.rosterRow)}>
              <span>Primary</span>
              <PersonName
                id={store.schedule[`${team.id}-primary`] ?? team.primary}
              />
            </div>
            <div {...stylex.props(o.rosterRow)}>
              <span>Secondary</span>
              <PersonName
                id={store.schedule[`${team.id}-secondary`] ?? team.secondary}
              />
            </div>
            <div {...stylex.props(o.rosterRow)}>
              <span>Current shift</span>
              <span>9:00 AM – 6:00 PM</span>
            </div>
            <div {...stylex.props(o.rosterRow)}>
              <span>Up next</span>
              <PersonName id={team.next} />
            </div>
            <div {...stylex.props(s.spread, s.space12)}>
              <Button
                small
                icon={Shield}
                variant="ghost"
                onClick={() => setPolicy(team)}
              >
                Escalation policy
              </Button>
              <Button
                small
                onClick={() => {
                  setSelectedTeam(team.id);
                  setOverride(true);
                }}
              >
                Override
              </Button>
            </div>
          </Panel>
        ))}
      </div>
      {override && (
        <OverrideDialog
          teamId={selectedTeam}
          initialDate={selectedDate}
          initialRole={selectedRole}
          onClose={() => setOverride(false)}
        />
      )}
      {policy && (
        <PolicyDialog team={policy} onClose={() => setPolicy(undefined)} />
      )}
    </div>
  );
}
function OnCallRow({
  team,
  dates,
  index,
  getPerson,
  onEdit,
}: {
  team: Team;
  dates: { iso: string }[];
  index: number;
  getPerson: (index: number, role: string) => string;
  onEdit: (date: string, role: string) => void;
}) {
  return (
    <>
      <div {...stylex.props(o.teamCell)}>
        <strong>{team.name}</strong>
        <span {...stylex.props(s.small, s.muted)}>Weekly rotation</span>
      </div>
      {dates.map((date, day) => (
        <div
          {...stylex.props(o.cell, date.iso === "2026-09-08" && o.today)}
          key={date.iso}
        >
          {["primary", "secondary"].map((role) => (
            <button
              key={role}
              title={`${person(getPerson(day, role))?.name} · ${role} · ${date.iso}. Create override`}
              onClick={() => onEdit(date.iso, role)}
              {...stylex.props(
                o.shift,
                index === 1 && o.shiftPurple,
                index === 2 && o.shiftBlue,
                index === 3 && o.shiftSand,
                index === 4 && o.shiftRose,
                role === "secondary" && o.secondary,
              )}
            >
              <span>{role === "primary" ? "●" : "○"}</span>
              {person(getPerson(day, role))?.name.split(" ")[0]}{" "}
              {person(getPerson(day, role))?.name.split(" ")[1][0]}.
            </button>
          ))}
        </div>
      ))}
    </>
  );
}
function OverrideDialog({
  teamId,
  initialDate,
  initialRole,
  onClose,
}: {
  teamId: string;
  initialDate: string;
  initialRole: string;
  onClose: () => void;
}) {
  const store = useStore();
  const [team, setTeam] = useState(teamId);
  const [engineer, setEngineer] = useState("elena");
  const [role, setRole] = useState(initialRole);
  const [date, setDate] = useState(initialDate);
  const [reason, setReason] = useState("");
  return (
    <Modal
      title="Create a schedule override"
      description="Arrange coverage without changing the regular rotation."
      onClose={onClose}
      footer={
        <>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" form="override-form" variant="primary">
            Save override
          </Button>
        </>
      }
    >
      <form
        id="override-form"
        {...stylex.props(s.column)}
        onSubmit={(e) => {
          e.preventDefault();
          store.setOverride(`${team}-${date}-${role}`, engineer);
          if (date === "2026-09-08")
            store.setOverride(`${team}-${role}`, engineer);
          store.toast(
            `Override saved. ${person(engineer)?.name} has been notified.`,
          );
          onClose();
        }}
      >
        <Field label="Team">
          <Select
            label="Override team"
            value={team}
            onChange={(e) => setTeam(e.target.value)}
            options={teams.map((t) => ({ value: t.id, label: t.name }))}
          />
        </Field>
        <div {...stylex.props(s.formGrid)}>
          <Field label="Coverage">
            <Select
              label="Override role"
              options={["primary", "secondary"]}
              value={role}
              onChange={(e) => setRole(e.target.value)}
            />
          </Field>
          <Field label="Shift date">
            <Input
              type="date"
              value={date}
              required
              onChange={(e) => setDate(e.target.value)}
            />
          </Field>
        </div>
        <Field label="Covering engineer">
          <Select
            label="Covering engineer"
            options={people.map((p) => ({ value: p.id, label: p.name }))}
            value={engineer}
            onChange={(e) => setEngineer(e.target.value)}
          />
        </Field>
        <Field label="Handoff note">
          <textarea
            required
            placeholder="Add context for the engineer taking this shift…"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            {...stylex.props(s.input, s.textarea)}
          />
        </Field>
        <div {...stylex.props(s.note)}>
          <Clock3 size={15} />
          This override covers the selected daily shift. Primary: 9 AM–6 PM.
          Secondary: full day.
        </div>
      </form>
    </Modal>
  );
}
function PolicyDialog({ team, onClose }: { team: Team; onClose: () => void }) {
  const store = useStore();
  const [delay, setDelay] = useState(
    store.schedule[`${team.id}-escalation`] ?? "5",
  );
  return (
    <Modal
      title={`${team.name} escalation policy`}
      description="If a page is not acknowledged, RelayOps contacts the next responder."
      onClose={onClose}
      footer={
        <Button
          variant="primary"
          onClick={() => {
            store.setOverride(`${team.id}-escalation`, delay);
            store.toast("Escalation policy updated.");
            onClose();
          }}
        >
          Save policy
        </Button>
      }
    >
      <div {...stylex.props(s.column)}>
        {[
          { id: team.primary, label: "Immediately · Primary on-call" },
          {
            id: team.secondary,
            label: `After ${delay} minutes · Secondary on-call`,
          },
          {
            id: team.lead,
            label: `After ${Number(delay) + 10} minutes · Team lead`,
          },
        ].map((step, i) => (
          <div key={i} {...stylex.props(o.policy)}>
            <span {...stylex.props(o.policyStep)}>{i + 1}</span>
            <div>
              <div {...stylex.props(s.small, s.muted, s.bottom16)}>
                {step.label}
              </div>
              <PersonName id={step.id} full />
            </div>
          </div>
        ))}
        <Field label="Secondary escalation delay">
          <Select
            label="Escalation delay"
            options={[
              { value: "3", label: "3 minutes" },
              { value: "5", label: "5 minutes" },
              { value: "10", label: "10 minutes" },
            ]}
            value={delay}
            onChange={(e) => setDelay(e.target.value)}
          />
        </Field>
        <p {...stylex.props(s.small, s.secondary)}>
          Notify by push, SMS, and voice. Repeat the policy twice before
          contacting the organization incident commander.
        </p>
      </div>
    </Modal>
  );
}
