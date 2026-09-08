import * as stylex from "@stylexjs/stylex";
import { useLocation } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronRight,
  FileText,
  MessageSquare,
  Pencil,
  Plus,
  Save,
  Send,
  ShieldAlert,
} from "lucide-react";
import { people, person, type Postmortem, type Task } from "../data";
import { useStore } from "../state";
import {
  AppLink,
  Avatar,
  Badge,
  Button,
  EmptyResults,
  Field,
  Input,
  Modal,
  PageHeader,
  Panel,
  PersonName,
  SearchInput,
  Select,
  Tabs,
  s,
  useGo,
} from "../components/ui";

const p = stylex.create({
  summary: {
    display: "flex",
    gap: 14,
    alignItems: "center",
    backgroundColor: "#f1f5eb",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#dfe8d2",
    borderRadius: 8,
    padding: "20px 23px",
    marginBottom: 23,
    color: "#91a67a",
  },
  summaryTitle: { color: "#6a8653", fontSize: 12, fontWeight: 550 },
  summaryBody: { marginTop: 4, color: "#a0af8c", fontSize: 10.5 },
  title: { fontWeight: 500, fontSize: 12, color: "#627e4c", minWidth: 280 },
  progress: {
    width: 90,
    height: 5,
    borderRadius: 5,
    backgroundColor: "#edf2e1",
    overflow: "hidden",
    marginTop: 6,
  },
  progressFill: (percent: string) => ({
    width: percent,
    height: "100%",
    backgroundColor: "#aac28e",
    borderRadius: 5,
  }),
  docLayout: {
    display: "grid",
    gridTemplateColumns: {
      default: "180px minmax(0, 1fr)",
      "@media (max-width: 950px)": "1fr",
    },
    alignItems: "start",
    gap: 27,
    marginTop: 25,
  },
  toc: {
    position: { default: "sticky", "@media (max-width: 950px)": "static" },
    top: 88,
    display: "flex",
    flexDirection: { default: "column", "@media (max-width: 950px)": "row" },
    gap: 5,
    overflowX: "auto",
  },
  tocLink: {
    color: "#9aac87",
    padding: "7px 10px",
    borderLeftWidth: 2,
    borderLeftStyle: "solid",
    borderLeftColor: "#e3ebd7",
    fontSize: 10,
    whiteSpace: "nowrap",
    ":hover": {
      color: "#688b4d",
      backgroundColor: "#f0f5e7",
      borderLeftColor: "#a1be83",
    },
  },
  document: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#e3ead9",
    borderRadius: 9,
    padding: { default: "34px 40px", "@media (max-width: 640px)": "24px 19px" },
    maxWidth: 980,
  },
  section: { marginBottom: 30, scrollMarginTop: 90 },
  sectionTitle: {
    color: "#5c7a44",
    fontSize: 16,
    fontWeight: 560,
    letterSpacing: "-.35px",
    marginBottom: 12,
  },
  prose: {
    color: "#5e6e53",
    fontSize: 13,
    lineHeight: 1.95,
    whiteSpace: "pre-line",
  },
  docMeta: {
    display: "flex",
    gap: 20,
    flexWrap: "wrap",
    paddingBlock: "18px 25px",
    borderBottomWidth: 1,
    borderBottomStyle: "solid",
    borderBottomColor: "#e6eddc",
    marginBottom: 28,
    fontSize: 10,
    color: "#6f805e",
  },
  coverLine: {
    width: 36,
    height: 4,
    borderRadius: 4,
    backgroundColor: "#a5bf8b",
    marginBottom: 20,
  },
  docTitle: {
    fontSize: 26,
    fontWeight: 570,
    letterSpacing: "-.9px",
    lineHeight: 1.45,
    color: "#55773d",
  },
  sectionEdit: {
    minHeight: 145,
    color: "#687f52",
    fontSize: 12,
    lineHeight: 1.9,
  },
  action: {
    display: "flex",
    gap: 10,
    alignItems: "flex-start",
    padding: "15px 0",
    borderTopWidth: 1,
    borderTopStyle: "solid",
    borderTopColor: "#e9efdf",
  },
  actionTitle: { fontSize: 11.5, color: "#7d9266", lineHeight: 1.7 },
  done: { color: "#acb69c", textDecoration: "line-through" },
});
export function PostmortemsPage() {
  const store = useStore();
  const location = useLocation();
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState("all");
  const [create, setCreate] = useState(
    new URLSearchParams(location.searchStr).has("create"),
  );
  useEffect(() => {
    if (new URLSearchParams(location.searchStr).has("create")) setCreate(true);
  }, [location.searchStr]);
  const visible = store.postmortems.filter(
    (x) =>
      (tab === "all" || x.status === tab) &&
      `${x.title} ${x.incident} ${person(x.owner)?.name}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  const actions = store.postmortems.flatMap((x) => x.actions);
  return (
    <div {...stylex.props(s.page)}>
      <PageHeader
        title="Postmortems"
        description="Learn together. Turn incident insights into lasting improvements."
        actions={
          <Button icon={Plus} variant="primary" onClick={() => setCreate(true)}>
            Create postmortem
          </Button>
        }
      />
      <div {...stylex.props(p.summary)}>
        <BookOpen size={24} strokeWidth={1.3} />
        <div {...stylex.props(s.grow)}>
          <h2 {...stylex.props(p.summaryTitle)}>
            Blameless by default. Better with every incident.
          </h2>
          <p {...stylex.props(p.summaryBody)}>
            {store.postmortems.filter((x) => x.status === "In review").length}{" "}
            postmortem awaiting review · {actions.filter((a) => !a.done).length}{" "}
            corrective actions open · {actions.filter((a) => a.done).length}{" "}
            improvements shipped
          </p>
        </div>
      </div>
      <Tabs
        tabs={[
          {
            id: "all",
            label: "All postmortems",
            count: store.postmortems.length,
          },
          ...["Draft", "In review", "Published"].map((status) => ({
            id: status,
            label: status,
            count: store.postmortems.filter((x) => x.status === status).length,
          })),
        ]}
        active={tab}
        onChange={setTab}
      />
      <section {...stylex.props(s.panel, s.sectionSpace)}>
        <div {...stylex.props(s.toolbar)}>
          <SearchInput
            value={query}
            onChange={setQuery}
            placeholder="Search postmortems…"
          />
          <span {...stylex.props(s.grow)} />
          <span {...stylex.props(s.small, s.muted)}>Newest first</span>
        </div>
        <div {...stylex.props(s.tableScroll)}>
          <table {...stylex.props(s.table)}>
            <thead>
              <tr>
                {[
                  "Postmortem",
                  "Incident",
                  "Severity",
                  "Status",
                  "Owner",
                  "Created",
                  "Action items",
                ].map((h) => (
                  <th {...stylex.props(s.th)} key={h}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visible.map((pm) => (
                <tr {...stylex.props(s.tr)} key={pm.id}>
                  <td {...stylex.props(s.td)}>
                    <div {...stylex.props(p.title)}>
                      <AppLink to={`/postmortems/${pm.id}`} subtle>
                        {pm.title}
                      </AppLink>
                    </div>
                    <p {...stylex.props(s.muted, s.small, s.space8)}>{pm.id}</p>
                  </td>
                  <td {...stylex.props(s.td)}>
                    <AppLink to={`/incidents/${pm.incident}`}>
                      {pm.incident}
                    </AppLink>
                  </td>
                  <td {...stylex.props(s.td)}>
                    <Badge>{pm.severity}</Badge>
                  </td>
                  <td {...stylex.props(s.td)}>
                    <Badge dot>{pm.status}</Badge>
                  </td>
                  <td {...stylex.props(s.td)}>
                    <PersonName id={pm.owner} />
                  </td>
                  <td {...stylex.props(s.td, s.small, s.muted)}>
                    {pm.created}
                  </td>
                  <td {...stylex.props(s.td)}>
                    <span {...stylex.props(s.small, s.secondary)}>
                      {pm.actions.filter((a) => a.done).length} of{" "}
                      {pm.actions.length} complete
                    </span>
                    <div {...stylex.props(p.progress)}>
                      <div
                        {...stylex.props(
                          p.progressFill(
                            `${pm.actions.length ? (pm.actions.filter((a) => a.done).length / pm.actions.length) * 100 : 0}%`,
                          ),
                        )}
                      />
                    </div>
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
              setTab("all");
            }}
          />
        )}
        <div {...stylex.props(s.tableFoot)}>
          {visible.length} postmortems<span>Review. Learn. Improve.</span>
        </div>
      </section>
      {create && <CreatePostmortem onClose={() => setCreate(false)} />}
    </div>
  );
}
export function CreatePostmortem({ onClose }: { onClose: () => void }) {
  const store = useStore();
  const go = useGo();
  const [incident, setIncident] = useState(
    store.incidents.find(
      (i) =>
        i.status === "Resolved" &&
        !store.postmortems.some((p) => p.incident === i.id),
    )?.id ?? "INC-1042",
  );
  return (
    <Modal
      title="Create a postmortem"
      description="Start with your incident context, not a blank document."
      onClose={onClose}
      footer={
        <>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            variant="primary"
            icon={FileText}
            onClick={() => {
              const id = store.createPostmortem(incident);
              onClose();
              go(`/postmortems/${id}`);
            }}
          >
            Create draft
          </Button>
        </>
      }
    >
      <div {...stylex.props(s.column)}>
        <Field label="Incident">
          <Select
            label="Postmortem incident"
            value={incident}
            onChange={(e) => setIncident(e.target.value)}
            options={store.incidents.map((i) => ({
              value: i.id,
              label: `${i.id} · ${i.title}`,
            }))}
          />
        </Field>
        <div {...stylex.props(s.note)}>
          <FileText size={17} />
          The summary, customer impact, timeline, and response tasks will be
          included. If a postmortem already exists, we will open it instead.
        </div>
      </div>
    </Modal>
  );
}

export function PostmortemDetail({ id }: { id: string }) {
  const store = useStore();
  const pm = store.postmortems.find((x) => x.id === id);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<Record<string, string>>(
    pm?.sections ?? {},
  );
  const [title, setTitle] = useState(pm?.title ?? "");
  const [action, setAction] = useState<Task | "new">();
  if (!pm)
    return (
      <div {...stylex.props(s.page)}>
        <PageHeader title="Postmortem not found" />
        <AppLink to="/postmortems">Return to postmortems</AppLink>
      </div>
    );
  const sections = [...Object.keys(pm.sections), "Corrective Actions"];
  const completed = pm.actions.filter((a) => a.done).length;
  function changeStatus(status: Postmortem["status"]) {
    if (
      status === "Published" &&
      (!pm!.sections.Summary.trim() ||
        !pm!.sections["Root Cause"]?.trim() ||
        !pm!.sections.Resolution?.trim())
    ) {
      store.toast(
        "Add a summary, root cause, and resolution before publishing.",
      );
      return;
    }
    store.updatePostmortem(id, { status });
    store.toast(
      `Postmortem ${status === "In review" ? "submitted for review" : status.toLowerCase()}.`,
    );
  }
  return (
    <div {...stylex.props(s.page)}>
      <div {...stylex.props(s.row, s.bottom16, s.small, s.muted)}>
        <AppLink to="/postmortems">
          <ArrowLeft size={12} />
          Postmortems
        </AppLink>
        <ChevronRight size={11} />
        {pm.id}
        <Badge dot>{pm.status}</Badge>
      </div>
      <PageHeader
        title="Incident review"
        description="A shared understanding of what happened—and what we’ll do differently."
        actions={
          editing ? (
            <>
              <Button
                onClick={() => {
                  setEditing(false);
                  setDraft(pm.sections);
                  setTitle(pm.title);
                }}
              >
                Discard changes
              </Button>
              <Button
                icon={Save}
                variant="primary"
                onClick={() => {
                  if (!title.trim()) {
                    store.toast("Add a postmortem title.");
                    return;
                  }
                  store.updatePostmortem(id, {
                    sections: draft,
                    title: title.trim(),
                  });
                  setEditing(false);
                  store.toast("Postmortem saved.");
                }}
              >
                Save changes
              </Button>
            </>
          ) : (
            <>
              <Button
                icon={Pencil}
                onClick={() => {
                  setDraft(pm.sections);
                  setTitle(pm.title);
                  setEditing(true);
                }}
              >
                Edit document
              </Button>
              {pm.status === "Draft" && (
                <Button
                  icon={Send}
                  variant="primary"
                  onClick={() => changeStatus("In review")}
                >
                  Submit for review
                </Button>
              )}
              {pm.status === "In review" && (
                <Button
                  icon={CheckCircle2}
                  variant="primary"
                  onClick={() => changeStatus("Published")}
                >
                  Publish postmortem
                </Button>
              )}
              {pm.status === "Published" && (
                <Badge tone="green" dot>
                  Published
                </Badge>
              )}
            </>
          )
        }
      />
      <div {...stylex.props(p.docLayout)}>
        <nav aria-label="Postmortem sections" {...stylex.props(p.toc)}>
          {sections.map((section, index) => (
            <a key={section} href={`#pm-${index}`} {...stylex.props(p.tocLink)}>
              {section}
            </a>
          ))}
        </nav>
        <article {...stylex.props(p.document)}>
          <div {...stylex.props(p.coverLine)} />
          <div {...stylex.props(s.row, s.bottom16)}>
            <Badge>{pm.severity}</Badge>
            <AppLink to={`/incidents/${pm.incident}`}>
              <ShieldAlert size={12} />
              {pm.incident}
            </AppLink>
          </div>
          {editing ? (
            <Field label="Document title">
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
            </Field>
          ) : (
            <h1 {...stylex.props(p.docTitle)}>{pm.title}</h1>
          )}
          <div {...stylex.props(p.docMeta)}>
            <span {...stylex.props(s.row, s.gap6)}>
              <Avatar id={pm.owner} size="small" />
              {person(pm.owner)?.name}
            </span>
            <span>Created {pm.created}</span>
            <span>
              {completed}/{pm.actions.length} actions complete
            </span>
            <span>{editing ? "Unsaved changes" : "All changes saved"}</span>
          </div>
          {Object.entries(pm.sections).map(([section, text], index) => (
            <section
              key={section}
              id={`pm-${index}`}
              {...stylex.props(p.section)}
            >
              <h2 {...stylex.props(p.sectionTitle)}>{section}</h2>
              {editing ? (
                <textarea
                  aria-label={`Edit ${section}`}
                  value={draft[section] ?? ""}
                  onChange={(e) =>
                    setDraft({ ...draft, [section]: e.target.value })
                  }
                  {...stylex.props(s.input, p.sectionEdit)}
                  placeholder={`Add ${section.toLowerCase()}…`}
                />
              ) : (
                <p {...stylex.props(p.prose)}>
                  {text || (
                    <span {...stylex.props(s.muted)}>
                      Not yet documented. Use Edit document to add this section.
                    </span>
                  )}
                </p>
              )}
            </section>
          ))}
          <section
            id={`pm-${sections.length - 1}`}
            {...stylex.props(p.section)}
          >
            <div {...stylex.props(s.spread, s.bottom16)}>
              <h2 {...stylex.props(p.sectionTitle)} style={{ marginBottom: 0 }}>
                Corrective Actions
              </h2>
              <Button small icon={Plus} onClick={() => setAction("new")}>
                Add action
              </Button>
            </div>
            <p {...stylex.props(s.small, s.muted, s.bottom16)}>
              {completed} of {pm.actions.length} complete · Each action has an
              owner and a due date.
            </p>
            {pm.actions.map((task) => (
              <div key={task.id} {...stylex.props(p.action)}>
                <input
                  type="checkbox"
                  checked={task.done}
                  aria-label={`Complete ${task.title}`}
                  onChange={() =>
                    store.updatePostmortem(id, {
                      actions: pm.actions.map((a) =>
                        a.id === task.id ? { ...a, done: !a.done } : a,
                      ),
                    })
                  }
                  {...stylex.props(s.checkbox)}
                />
                <div {...stylex.props(s.grow)}>
                  <div {...stylex.props(p.actionTitle, task.done && p.done)}>
                    {task.title}
                  </div>
                  <div
                    {...stylex.props(s.row, s.wrap, s.small, s.muted, s.space8)}
                  >
                    <PersonName id={task.owner} />
                    <span>Due {task.due}</span>
                    <Badge>{task.priority}</Badge>
                    <Badge>{task.done ? "Completed" : "Open"}</Badge>
                  </div>
                </div>
                <Button
                  small
                  variant="ghost"
                  icon={Pencil}
                  aria-label={`Edit ${task.title}`}
                  onClick={() => setAction(task)}
                />
              </div>
            ))}
          </section>
          <div {...stylex.props(s.note)}>
            <BookOpen size={16} />
            This is a blameless review. Focus on systems and decisions, not
            individuals.
          </div>
        </article>
      </div>
      {action && (
        <ActionDialog
          pm={pm}
          task={action === "new" ? undefined : action}
          onClose={() => setAction(undefined)}
        />
      )}
    </div>
  );
}
function ActionDialog({
  pm,
  task,
  onClose,
}: {
  pm: Postmortem;
  task?: Task;
  onClose: () => void;
}) {
  const store = useStore();
  const [title, setTitle] = useState(task?.title ?? "");
  const [owner, setOwner] = useState(task?.owner ?? pm.owner);
  const [priority, setPriority] = useState(task?.priority ?? "High");
  const [due, setDue] = useState(task?.due ?? "Sep 15, 2026");
  const [done, setDone] = useState(task?.done ?? false);
  return (
    <Modal
      title={task ? "Edit corrective action" : "Add corrective action"}
      onClose={onClose}
      footer={
        <>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" form="action-form" variant="primary">
            Save action
          </Button>
        </>
      }
    >
      <form
        id="action-form"
        {...stylex.props(s.column)}
        onSubmit={(e) => {
          e.preventDefault();
          if (!title.trim()) return;
          const value: Task = {
            id: task?.id ?? `pa-${Date.now()}`,
            title: title.trim(),
            owner,
            priority,
            due,
            done,
          };
          store.updatePostmortem(pm.id, {
            actions: task
              ? pm.actions.map((a) => (a.id === task.id ? value : a))
              : [...pm.actions, value],
          });
          store.toast("Corrective action saved.");
          onClose();
        }}
      >
        <Field label="Action">
          <Input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Define a measurable improvement"
          />
        </Field>
        <Field label="Owner">
          <Select
            label="Action owner"
            value={owner}
            onChange={(e) => setOwner(e.target.value)}
            options={people.map((p) => ({ value: p.id, label: p.name }))}
          />
        </Field>
        <div {...stylex.props(s.formGrid)}>
          <Field label="Priority">
            <Select
              label="Action priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              options={["High", "Medium", "Low"]}
            />
          </Field>
          <Field label="Due date">
            <Input
              required
              value={due}
              onChange={(e) => setDue(e.target.value)}
              placeholder="Sep 15, 2026"
            />
          </Field>
        </div>
        <label {...stylex.props(s.checkLabel)}>
          <input
            type="checkbox"
            checked={done}
            onChange={(e) => setDone(e.target.checked)}
            {...stylex.props(s.checkbox)}
          />
          Action completed
        </label>
      </form>
    </Modal>
  );
}
