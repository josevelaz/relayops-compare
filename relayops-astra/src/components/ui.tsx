import * as stylex from "@stylexjs/stylex";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  useEffect,
  useId,
  useRef,
  type ReactNode,
  type ButtonHTMLAttributes,
  type InputHTMLAttributes,
  type SelectHTMLAttributes,
} from "react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  Circle,
  Search,
  X,
  type LucideIcon,
} from "lucide-react";
import { person, type Health } from "../data";
import { useStore } from "../state";

export const s = stylex.create({
  page: {
    maxWidth: 1600,
    marginInline: "auto",
    padding: {
      default: "28px 32px 40px",
      "@media (max-width: 1200px)": "25px 24px 36px",
      "@media (max-width: 640px)": "22px 16px 30px",
    },
    animationName: "fadeIn",
    animationDuration: ".25s",
  },
  row: { display: "flex", alignItems: "center", gap: 10 },
  spread: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
  },
  wrap: { flexWrap: "wrap" },
  column: { display: "flex", flexDirection: "column", gap: 16 },
  gap6: { gap: 6 },
  gap8: { gap: 8 },
  gap12: { gap: 12 },
  gap20: { gap: 20 },
  grow: { flex: 1, minWidth: 0 },
  muted: { color: "#6f7b73" },
  secondary: { color: "#627067" },
  small: { fontSize: 11 },
  body: { fontSize: 13, lineHeight: 1.7 },
  bold: { fontWeight: 600 },
  green: { color: "#287658" },
  red: { color: "#c14f46" },
  amber: { color: "#a97927" },
  mono: {
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
    fontSize: 11.5,
  },
  truncate: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  panel: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#e1e6e2",
    borderRadius: 9,
    overflow: "hidden",
    boxShadow: "0 2px 3px #233e2e02",
  },
  panelHead: {
    padding: "18px 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  panelTitle: { fontSize: 13, fontWeight: 600, letterSpacing: "-.15px" },
  panelBody: { padding: 20 },
  divider: {
    borderTopWidth: 1,
    borderTopStyle: "solid",
    borderTopColor: "#eef0ee",
  },
  link: {
    color: "#4c7062",
    fontSize: 11,
    fontWeight: 500,
    display: "inline-flex",
    alignItems: "center",
    gap: 5,
    ":hover": { color: "#1f6248", textDecoration: "underline" },
  },
  textLink: { ":hover": { color: "#257154", textDecoration: "underline" } },
  sectionSpace: { marginTop: 22 },
  space12: { marginTop: 12 },
  space8: { marginTop: 8 },
  bottom16: { marginBottom: 16 },
  grid2: {
    display: "grid",
    gridTemplateColumns: {
      default: "1fr 1fr",
      "@media (max-width: 800px)": "1fr",
    },
    gap: 20,
  },
  grid3: {
    display: "grid",
    gridTemplateColumns: {
      default: "repeat(3, minmax(0, 1fr))",
      "@media (max-width: 1200px)": "repeat(2, minmax(0, 1fr))",
      "@media (max-width: 680px)": "1fr",
    },
    gap: 18,
  },
  detailGrid: {
    display: "grid",
    gridTemplateColumns: {
      default: "minmax(0, 1fr) 302px",
      "@media (max-width: 1150px)": "minmax(0, 1fr) 265px",
      "@media (max-width: 850px)": "1fr",
    },
    alignItems: "start",
    gap: 22,
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    flexWrap: "wrap",
    padding: "15px 18px",
    borderBottomWidth: 1,
    borderBottomStyle: "solid",
    borderBottomColor: "#e9ece9",
  },
  tableScroll: { width: "100%", overflowX: "auto" },
  table: { width: "100%", fontSize: 12, whiteSpace: "nowrap" },
  th: {
    height: 39,
    padding: "0 18px",
    color: "#6e7a72",
    fontWeight: 500,
    fontSize: 10.5,
    backgroundColor: "#fafbf9",
    borderBottomWidth: 1,
    borderBottomStyle: "solid",
    borderBottomColor: "#e9ece9",
  },
  td: {
    height: 66,
    padding: "12px 18px",
    borderBottomWidth: 1,
    borderBottomStyle: "solid",
    borderBottomColor: "#edf0ed",
    verticalAlign: "middle",
  },
  tr: { ":hover": { backgroundColor: "#fafcfb" } },
  tableFoot: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 10,
    padding: "12px 18px",
    color: "#737f75",
    fontSize: 11,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#dde3df",
    backgroundColor: "#fff",
    borderRadius: 6,
    padding: "9px 11px",
    fontSize: 12,
    color: "#34443b",
    minHeight: 36,
    transition: "border-color .15s",
    ":focus": { outline: "2px solid #cfe5d9", borderColor: "#75a68c" },
    "::placeholder": { color: "#98a29d" },
  },
  textarea: { minHeight: 110, lineHeight: 1.7 },
  label: {
    display: "flex",
    flexDirection: "column",
    gap: 7,
    fontSize: 12,
    fontWeight: 500,
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: {
      default: "1fr 1fr",
      "@media (max-width: 480px)": "1fr",
    },
    gap: 16,
  },
  fieldset: { padding: 0, borderWidth: 0, margin: 0, minWidth: 0 },
  checkLabel: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontSize: 12,
    cursor: "pointer",
    paddingBlock: 4,
  },
  checkbox: {
    accentColor: "#367d5b",
    width: 15,
    height: 15,
    flexShrink: 0,
    cursor: "pointer",
  },
  empty: {
    padding: "48px 24px",
    textAlign: "center",
    color: "#829087",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 10,
  },
  overline: {
    fontSize: 10,
    fontWeight: 600,
    letterSpacing: 1.1,
    textTransform: "uppercase",
    color: "#6d7b70",
  },
  note: {
    padding: "12px 15px",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#e0e9e4",
    backgroundColor: "#f5f9f6",
    borderRadius: 6,
    fontSize: 12,
    color: "#5c7767",
    display: "flex",
    alignItems: "flex-start",
    gap: 10,
  },
  dangerNote: {
    borderColor: "#f0dcd6",
    backgroundColor: "#fcf5f2",
    color: "#966050",
  },
  error: { color: "#b84138", fontSize: 12 },
  preline: { whiteSpace: "pre-line" },
});

const u = stylex.create({
  button: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    minHeight: 34,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#dfe5e0",
    borderRadius: 6,
    padding: "7px 12px",
    fontSize: 11.5,
    fontWeight: 500,
    backgroundColor: "#fff",
    color: "#526058",
    transition: "background .15s, border-color .15s",
    whiteSpace: "nowrap",
    ":hover": { backgroundColor: "#f7f9f6", borderColor: "#c5d2c9" },
  },
  primary: {
    color: "#fff",
    borderColor: "#367652",
    backgroundColor: "#367652",
    boxShadow: "0 1px 2px #1b4c2620, inset 0 1px 0 #ffffff15",
    ":hover": { backgroundColor: "#2c6546", borderColor: "#2c6546" },
  },
  danger: {
    color: "#af4b40",
    borderColor: "#ebd6d1",
    backgroundColor: "#fff7f5",
    ":hover": { backgroundColor: "#fbece7", borderColor: "#d9b1a7" },
  },
  ghost: {
    backgroundColor: "transparent",
    borderColor: "transparent",
    boxShadow: "none",
    ":hover": { backgroundColor: "#eef2ee", borderColor: "transparent" },
  },
  sm: { minHeight: 27, padding: "4px 8px", fontSize: 10.5 },
  icon: { width: 31, minHeight: 31, padding: 0 },
  pill: {
    display: "inline-flex",
    alignItems: "center",
    gap: 5,
    borderRadius: 4,
    padding: "2px 7px",
    fontSize: 10,
    fontWeight: 500,
    lineHeight: "18px",
    whiteSpace: "nowrap",
    color: "#68776e",
    backgroundColor: "#f0f3f0",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#e6eae5",
  },
  red: { color: "#b85349", backgroundColor: "#fff0ec", borderColor: "#f8dcd4" },
  orange: {
    color: "#ad742f",
    backgroundColor: "#fff6e8",
    borderColor: "#f3e5c9",
  },
  green: {
    color: "#3d805c",
    backgroundColor: "#edf7ef",
    borderColor: "#dceee0",
  },
  blue: {
    color: "#5277a6",
    backgroundColor: "#eff4fc",
    borderColor: "#e0e9f5",
  },
  purple: {
    color: "#8264ac",
    backgroundColor: "#f5f0fb",
    borderColor: "#e9dff4",
  },
  gray: {
    color: "#76857a",
    backgroundColor: "#f2f5f2",
    borderColor: "#e6eae5",
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: "50%",
    backgroundColor: "currentColor",
    display: "inline-block",
  },
  avatar: {
    width: 26,
    height: 26,
    borderRadius: "50%",
    backgroundColor: "#eee6dc",
    color: "#816747",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    fontSize: 8.5,
    fontWeight: 600,
    borderWidth: 2,
    borderStyle: "solid",
    borderColor: "white",
    letterSpacing: "-.2px",
  },
  avatarLg: { width: 39, height: 39, fontSize: 12 },
  avatarSm: { width: 23, height: 23, fontSize: 7.5 },
  lilac: { backgroundColor: "#e8e1f2", color: "#8063a1" },
  sand: { backgroundColor: "#f0e6d7", color: "#947754" },
  rose: { backgroundColor: "#f4e0e0", color: "#a26b70" },
  avatarBlue: { backgroundColor: "#dfeaf5", color: "#6486a5" },
  avatarGreen: { backgroundColor: "#dceade", color: "#63856c" },
  stack: { display: "flex", alignItems: "center" },
  stacked: { marginLeft: -7 },
  avatarExtra: { backgroundColor: "#f1f3ef", color: "#7c897e" },
  head: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16,
    flexWrap: "wrap",
    marginBottom: 25,
  },
  heading: {
    fontSize: { default: 26, "@media (max-width: 640px)": 23 },
    lineHeight: 1.3,
    fontWeight: 600,
    letterSpacing: "-.95px",
    color: "#283a30",
  },
  subtitle: { color: "#707e73", fontSize: 12, marginTop: 6 },
  tabs: {
    display: "flex",
    alignItems: "center",
    gap: 24,
    borderBottomWidth: 1,
    borderBottomStyle: "solid",
    borderBottomColor: "#e0e5df",
    overflowX: "auto",
    whiteSpace: "nowrap",
  },
  tab: {
    display: "flex",
    alignItems: "center",
    gap: 7,
    padding: "12px 1px",
    borderBottomWidth: 2,
    borderBottomStyle: "solid",
    borderBottomColor: "transparent",
    fontSize: 12,
    fontWeight: 500,
    color: "#707d72",
    marginBottom: -1,
    ":hover": { color: "#427353" },
  },
  tabSelected: { color: "#39734d", borderBottomColor: "#4c865d" },
  count: {
    display: "inline-flex",
    borderRadius: 4,
    padding: "0px 5px",
    backgroundColor: "#ecf0ea",
    color: "#82907e",
    fontSize: 9.5,
    minWidth: 19,
    justifyContent: "center",
  },
  search: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#e0e6df",
    borderRadius: 6,
    paddingInline: 10,
    minHeight: 33,
    color: "#98a095",
    backgroundColor: "#fff",
    flex: "1 1 180px",
    maxWidth: 290,
    ":focus-within": { outline: "2px solid #d9e8dc" },
  },
  searchInput: {
    width: "100%",
    padding: "7px 0",
    borderWidth: 0,
    outline: "none",
    backgroundColor: "transparent",
    fontSize: 11.5,
    color: "#485746",
    "::placeholder": { color: "#9aa394" },
    ":focus-visible": { outline: "none" },
  },
  selectWrap: {
    position: "relative",
    display: "inline-flex",
    alignItems: "center",
  },
  select: {
    appearance: "none",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#e0e5df",
    borderRadius: 6,
    color: "#687660",
    fontSize: 11,
    minHeight: 33,
    padding: "6px 30px 6px 10px",
    width: "100%",
    cursor: "pointer",
  },
  selectArrow: {
    position: "absolute",
    right: 10,
    pointerEvents: "none",
    color: "#8b9587",
  },
  backdrop: {
    position: "fixed",
    inset: 0,
    zIndex: 100,
    backgroundColor: "#17291e55",
    backdropFilter: "blur(3px)",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    padding: {
      default: "8vh 24px 24px",
      "@media (max-width: 640px)": "20px 12px",
    },
    overflowY: "auto",
  },
  modal: {
    width: "100%",
    maxWidth: 590,
    backgroundColor: "#fff",
    borderRadius: 12,
    boxShadow: "0 20px 100px #132c2940",
    animationName: "fadeIn",
    animationDuration: ".18s",
    maxHeight: "88vh",
    display: "flex",
    flexDirection: "column",
  },
  wideModal: { maxWidth: 740 },
  modalHead: {
    padding: "21px 24px",
    borderBottomWidth: 1,
    borderBottomStyle: "solid",
    borderBottomColor: "#e9eee7",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
  },
  modalTitle: { fontSize: 17, fontWeight: 600, letterSpacing: "-.4px" },
  modalBody: { padding: 24, overflowY: "auto" },
  modalFooter: {
    padding: "16px 24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 9,
    borderTopWidth: 1,
    borderTopStyle: "solid",
    borderTopColor: "#e9eee7",
    backgroundColor: "#fafbf9",
    borderRadius: "0 0 12px 12px",
  },
  health: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    fontSize: 10.5,
    color: "#4b875e",
    whiteSpace: "nowrap",
  },
  healthBad: { color: "#bd6456" },
  healthWarn: { color: "#b58b3e" },
  healthDot: {
    width: 6,
    height: 6,
    borderRadius: "50%",
    backgroundColor: "currentColor",
  },
  metricValue: {
    fontSize: 28,
    fontWeight: 550,
    letterSpacing: "-1px",
    color: "#334334",
    lineHeight: 1.3,
  },
  metricLabel: { fontSize: 11, color: "#6f7e6b", marginBottom: 9 },
  metricChange: {
    display: "flex",
    alignItems: "center",
    gap: 4,
    fontSize: 9.5,
    color: "#5b8a62",
    marginTop: 10,
  },
  metricNote: { color: "#98a092", marginLeft: 3 },
});

export function useGo() {
  const navigate = useNavigate();
  return (to: string) => {
    if (to === "/") void navigate({ to: "/" });
    else {
      const [pathname, query = ""] = to.split("?");
      void navigate({
        to: "/$",
        params: { _splat: pathname.replace(/^\//, "") },
        search: Object.fromEntries(new URLSearchParams(query)),
      });
    }
  };
}
export function AppLink({
  to,
  children,
  subtle = false,
}: {
  to: string;
  children: ReactNode;
  subtle?: boolean;
}) {
  return to === "/" ? (
    <Link to="/" {...stylex.props(subtle ? s.textLink : s.link)}>
      {children}
    </Link>
  ) : (
    <Link
      to="/$"
      params={{ _splat: to.split("?")[0].replace(/^\//, "") }}
      search={Object.fromEntries(new URLSearchParams(to.split("?")[1] ?? ""))}
      {...stylex.props(subtle ? s.textLink : s.link)}
    >
      {children}
    </Link>
  );
}
export function Button({
  children,
  icon: Icon,
  variant = "default",
  small = false,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  icon?: LucideIcon;
  variant?: "default" | "primary" | "danger" | "ghost";
  small?: boolean;
}) {
  return (
    <button
      type="button"
      {...props}
      {...stylex.props(
        u.button,
        variant === "primary" && u.primary,
        variant === "danger" && u.danger,
        variant === "ghost" && u.ghost,
        small && u.sm,
      )}
    >
      {Icon && <Icon size={small ? 12 : 14} strokeWidth={1.7} />}
      {children}
    </button>
  );
}
export function IconButton({
  icon: Icon,
  label,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  icon: LucideIcon;
  label: string;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      {...props}
      {...stylex.props(u.button, u.ghost, u.icon)}
    >
      <Icon size={17} strokeWidth={1.7} />
    </button>
  );
}
export function Badge({
  children,
  tone,
  dot = false,
}: {
  children: ReactNode;
  tone?: "red" | "orange" | "green" | "blue" | "purple" | "gray";
  dot?: boolean;
}) {
  const value = typeof children === "string" ? children : "";
  const color =
    tone ??
    (["SEV0", "SEV1", "Firing", "Failed", "Partial outage"].includes(value)
      ? "red"
      : [
            "SEV2",
            "Investigating",
            "Rolled back",
            "In review",
            "Degraded",
            "High",
          ].includes(value)
        ? "orange"
        : ["Monitoring", "Acknowledged", "Rolling out", "Medium"].includes(
              value,
            )
          ? "blue"
          : [
                "Resolved",
                "Successful",
                "Published",
                "Connected",
                "Operational",
                "Completed",
                "Active",
              ].includes(value)
            ? "green"
            : ["Identified", "Draft"].includes(value)
              ? "purple"
              : "gray");
  return (
    <span {...stylex.props(u.pill, u[color])}>
      {dot && <span {...stylex.props(u.dot)} />}
      {children}
    </span>
  );
}
export function Avatar({
  id,
  size = "default",
}: {
  id: string;
  size?: "default" | "small" | "large";
}) {
  const p = person(id);
  return (
    <span
      title={p?.name ?? "Unassigned"}
      aria-label={p?.name ?? "Unassigned"}
      {...stylex.props(
        u.avatar,
        p?.color === "lilac" && u.lilac,
        p?.color === "rose" && u.rose,
        p?.color === "blue" && u.avatarBlue,
        p?.color === "green" && u.avatarGreen,
        size === "large" && u.avatarLg,
        size === "small" && u.avatarSm,
      )}
    >
      {p?.name
        .split(" ")
        .map((n) => n[0])
        .join("") ?? "?"}
    </span>
  );
}
export function AvatarStack({ ids, max = 4 }: { ids: string[]; max?: number }) {
  return (
    <span {...stylex.props(u.stack)}>
      {ids.slice(0, max).map((id, i) => (
        <span key={id} {...stylex.props(i > 0 && u.stacked)}>
          <Avatar id={id} />
        </span>
      ))}
      {ids.length > max && (
        <span {...stylex.props(u.avatar, u.avatarExtra, u.stacked)}>
          +{ids.length - max}
        </span>
      )}
    </span>
  );
}
export function PersonName({
  id,
  full = false,
}: {
  id: string;
  full?: boolean;
}) {
  const p = person(id);
  return (
    <span {...stylex.props(s.row, s.gap6)}>
      <Avatar id={id} size="small" />
      <span>
        {p
          ? full
            ? p.name
            : `${p.name.split(" ")[0]} ${p.name.split(" ")[1][0]}.`
          : "Unassigned"}
      </span>
    </span>
  );
}
export function HealthLabel({ health }: { health: Health }) {
  return (
    <span
      {...stylex.props(
        u.health,
        health === "Degraded" && u.healthWarn,
        health === "Partial outage" && u.healthBad,
      )}
    >
      <span {...stylex.props(u.healthDot)} />
      {health}
    </span>
  );
}
export function PageHeader({
  title,
  description,
  actions,
  eyebrow,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  eyebrow?: ReactNode;
}) {
  return (
    <header {...stylex.props(u.head)}>
      <div {...stylex.props(s.grow)}>
        {eyebrow && (
          <div {...stylex.props(s.overline, s.bottom16)}>{eyebrow}</div>
        )}
        <h1 {...stylex.props(u.heading)}>{title}</h1>
        {description && <p {...stylex.props(u.subtitle)}>{description}</p>}
      </div>
      {actions && <div {...stylex.props(s.row, s.wrap)}>{actions}</div>}
    </header>
  );
}
export function Panel({
  title,
  action,
  children,
  noPad = false,
}: {
  title?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  noPad?: boolean;
}) {
  return (
    <section {...stylex.props(s.panel)}>
      {title && (
        <div {...stylex.props(s.panelHead)}>
          <h2 {...stylex.props(s.panelTitle)}>{title}</h2>
          {action}
        </div>
      )}
      <div {...stylex.props(!noPad && s.panelBody)}>{children}</div>
    </section>
  );
}
export function Tabs({
  tabs,
  active,
  onChange,
}: {
  tabs: { id: string; label: string; count?: number }[];
  active: string;
  onChange: (id: string) => void;
}) {
  return (
    <div role="tablist" {...stylex.props(u.tabs)}>
      {tabs.map((tab, index) => (
        <button
          type="button"
          key={tab.id}
          role="tab"
          aria-selected={active === tab.id}
          tabIndex={active === tab.id ? 0 : -1}
          onKeyDown={(e) => {
            if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
              e.preventDefault();
              const next =
                (index + (e.key === "ArrowRight" ? 1 : -1) + tabs.length) %
                tabs.length;
              onChange(tabs[next].id);
              (
                e.currentTarget.parentElement?.children[next] as HTMLElement
              )?.focus();
            }
          }}
          onClick={() => onChange(tab.id)}
          {...stylex.props(u.tab, active === tab.id && u.tabSelected)}
        >
          {tab.label}
          {tab.count !== undefined && (
            <span {...stylex.props(u.count)}>{tab.count}</span>
          )}
        </button>
      ))}
    </div>
  );
}
export function SearchInput({
  value,
  onChange,
  placeholder = "Search…",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label {...stylex.props(u.search)}>
      <Search size={14} />
      <input
        aria-label={placeholder}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        {...stylex.props(u.searchInput)}
      />
      {value && (
        <button
          type="button"
          aria-label="Clear search"
          onClick={() => onChange("")}
        >
          <X size={12} />
        </button>
      )}
    </label>
  );
}
export function Select({
  label,
  options,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  options: (string | { value: string; label: string })[];
}) {
  return (
    <span {...stylex.props(u.selectWrap)}>
      <select aria-label={label} {...props} {...stylex.props(u.select)}>
        {options.map((option) =>
          typeof option === "string" ? (
            <option key={option} value={option}>
              {option}
            </option>
          ) : (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ),
        )}
      </select>
      <ChevronDown size={12} {...stylex.props(u.selectArrow)} />
    </span>
  );
}
export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} {...stylex.props(s.input)} />;
}
export function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label {...stylex.props(s.label)}>
      {label}
      {children}
    </label>
  );
}
export function Modal({
  title,
  description,
  onClose,
  children,
  footer,
  wide = false,
}: {
  title: string;
  description?: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  wide?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  useEffect(() => {
    const previous = document.activeElement as HTMLElement;
    const bodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusable = () =>
      [
        ...(ref.current?.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex="0"]',
        ) ?? []),
      ].filter((el) => el.offsetParent !== null);
    const timer = setTimeout(() => {
      const input = ref.current?.querySelector<HTMLElement>("input, textarea");
      (input ?? focusable()[0])?.focus();
    }, 50);
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onCloseRef.current();
      }
      if (e.key === "Tab") {
        const items = focusable();
        const first = items[0];
        const last = items.at(-1);
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", key);
    return () => {
      clearTimeout(timer);
      document.body.style.overflow = bodyOverflow;
      document.removeEventListener("keydown", key);
      previous?.focus();
    };
  }, []);
  return (
    <div
      {...stylex.props(u.backdrop)}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        {...stylex.props(u.modal, wide && u.wideModal)}
      >
        <div {...stylex.props(u.modalHead)}>
          <div>
            <h2 id={titleId} {...stylex.props(u.modalTitle)}>
              {title}
            </h2>
            {description && (
              <p {...stylex.props(s.secondary, s.small, s.space8)}>
                {description}
              </p>
            )}
          </div>
          <IconButton label="Close dialog" icon={X} onClick={onClose} />
        </div>
        <div {...stylex.props(u.modalBody)}>{children}</div>
        {footer && <div {...stylex.props(u.modalFooter)}>{footer}</div>}
      </div>
    </div>
  );
}
export function Metric({
  label,
  value,
  change,
  note,
  negative = false,
  chart,
}: {
  label: string;
  value: string;
  change: string;
  note?: string;
  negative?: boolean;
  chart?: ReactNode;
}) {
  return (
    <div>
      <div {...stylex.props(u.metricLabel)}>{label}</div>
      <div {...stylex.props(s.spread)}>
        <strong {...stylex.props(u.metricValue)}>{value}</strong>
        {chart}
      </div>
      <div {...stylex.props(u.metricChange, negative && s.amber)}>
        {negative ? <ArrowUpRight size={11} /> : <ArrowDown size={11} />}
        {change}
        <span {...stylex.props(u.metricNote)}>{note}</span>
      </div>
    </div>
  );
}
export function EmptyResults({ onReset }: { onReset?: () => void }) {
  return (
    <div {...stylex.props(s.empty)}>
      <Search size={25} strokeWidth={1.2} />
      <strong>No matching results</strong>
      <p>Try a different search or remove a filter.</p>
      {onReset && (
        <Button small onClick={onReset}>
          Clear filters
        </Button>
      )}
    </div>
  );
}
export function ViewAll({
  to,
  children = "View all",
}: {
  to: string;
  children?: ReactNode;
}) {
  return (
    <AppLink to={to}>
      {children}
      <ArrowRight size={12} />
    </AppLink>
  );
}
export function getServiceHealth(
  id: string,
  activeIncidents: { status: string; services: string[] }[],
): Health {
  if (
    !activeIncidents.some(
      (i) => i.status !== "Resolved" && i.services.includes(id),
    )
  )
    return "Operational";
  return id === "payment-gateway" ? "Partial outage" : "Degraded";
}
export function ExportButton({
  filename,
  rows,
}: {
  filename: string;
  rows: Record<string, unknown>[];
}) {
  const { toast } = useStore();
  return (
    <Button
      icon={ArrowDown}
      onClick={() => {
        const keys = Object.keys(rows[0] ?? {});
        const csv = [
          keys,
          ...rows.map((r) =>
            keys.map((k) =>
              Array.isArray(r[k])
                ? (r[k] as unknown[]).join("; ")
                : String(r[k] ?? ""),
            ),
          ),
        ]
          .map((row) =>
            row.map((v) => `"${String(v).replaceAll('"', '""')}"`).join(","),
          )
          .join("\n");
        const url = URL.createObjectURL(
          new Blob([csv], { type: "text/csv;charset=utf-8;" }),
        );
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
        toast("CSV exported.");
      }}
    >
      Export
    </Button>
  );
}
export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      {...stylex.props(toggleStyles.track, checked && toggleStyles.on)}
    >
      <span
        {...stylex.props(toggleStyles.thumb, checked && toggleStyles.shift)}
      >
        {checked && <Check size={9} />}
      </span>
    </button>
  );
}
const toggleStyles = stylex.create({
  track: {
    width: 32,
    height: 19,
    borderRadius: 20,
    backgroundColor: "#d9e0d7",
    padding: 3,
    display: "inline-flex",
    alignItems: "center",
    transition: "background .15s",
    flexShrink: 0,
  },
  on: { backgroundColor: "#4a8158" },
  thumb: {
    width: 13,
    height: 13,
    borderRadius: "50%",
    backgroundColor: "#fff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "#4a8158",
    transition: "transform .15s",
  },
  shift: { transform: "translateX(13px)" },
});
