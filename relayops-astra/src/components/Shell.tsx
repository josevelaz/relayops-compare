import * as stylex from "@stylexjs/stylex";
import { useLocation } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import {
  Activity,
  ArrowUpRight,
  Bell,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Command,
  FileText,
  GitBranch,
  Headphones,
  HelpCircle,
  LayoutDashboard,
  Menu,
  Plus,
  Search,
  Server,
  Settings,
  ShieldAlert,
  Users,
  X,
  Zap,
} from "lucide-react";
import { useStore } from "../state";
import { Avatar, Button, IconButton, Modal, s, useGo } from "./ui";
import {
  CommandDialog,
  CreateIncidentDialog,
  NotificationsDialog,
} from "./Overlays";

const nav = [
  { label: "Overview", path: "/", icon: LayoutDashboard },
  { label: "Incidents", path: "/incidents", icon: ShieldAlert },
  { label: "Alerts", path: "/alerts", icon: Bell },
  { label: "Services", path: "/services", icon: Server },
  { label: "Deployments", path: "/deployments", icon: GitBranch },
  { label: "On-call", path: "/on-call", icon: Headphones },
  { label: "Analytics", path: "/analytics", icon: Activity },
  { label: "Postmortems", path: "/postmortems", icon: FileText },
  { label: "Teams", path: "/teams", icon: Users },
];
const sh = stylex.create({
  app: { minHeight: "100vh", backgroundColor: "#f7f8fa" },
  sidebar: {
    position: "fixed",
    inset: "0 auto 0 0",
    width: 218,
    overflowY: "auto",
    backgroundColor: "#fbfcfa",
    borderRightWidth: 1,
    borderRightStyle: "solid",
    borderRightColor: "#e4e8e2",
    display: "flex",
    flexDirection: "column",
    zIndex: 40,
    transition: "transform .2s",
    transform: {
      default: "translateX(0)",
      "@media (max-width: 850px)": "translateX(-100%)",
    },
  },
  sidebarOpen: { transform: "translateX(0)" },
  brand: {
    height: 68,
    display: "flex",
    alignItems: "center",
    gap: 9,
    paddingInline: 22,
    fontSize: 21,
    fontWeight: 670,
    letterSpacing: "-1px",
    color: "#284c33",
    flexShrink: 0,
  },
  logo: { width: 27, height: 29, color: "#4d8056" },
  workspace: { margin: "4px 13px 23px", position: "relative" },
  workspaceButton: {
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#dfe5dc",
    borderRadius: 7,
    padding: "10px 10px",
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: 9,
    textAlign: "left",
    backgroundColor: "#fff",
    boxShadow: "0 2px 2px #263b2803",
  },
  orgIcon: {
    width: 28,
    height: 28,
    borderRadius: 5,
    backgroundColor: "#f0f0e8",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#7c856d",
    fontSize: 14,
    fontWeight: 600,
  },
  workspaceName: { fontSize: 11, fontWeight: 550, color: "#4c5b47" },
  workspaceSub: { fontSize: 9, color: "#9aa491", marginTop: 2 },
  navLabel: {
    padding: "0 23px 9px",
    fontSize: 8.5,
    letterSpacing: 1.2,
    fontWeight: 550,
    color: "#9aa590",
  },
  nav: { display: "flex", flexDirection: "column", gap: 3, paddingInline: 13 },
  navItem: {
    minHeight: 37,
    display: "flex",
    alignItems: "center",
    gap: 11,
    padding: "9px 11px",
    borderRadius: 5,
    fontSize: 12,
    color: "#687763",
    textAlign: "left",
    position: "relative",
    ":hover": { backgroundColor: "#f0f3eb", color: "#4c6d3c" },
  },
  active: {
    color: "#40743f",
    backgroundColor: "#eaf0e3",
    fontWeight: 550,
    ":hover": { backgroundColor: "#e5eddb", color: "#40743f" },
  },
  navCount: {
    marginLeft: "auto",
    fontSize: 9,
    padding: "0px 5px",
    borderRadius: 4,
    backgroundColor: "#f3e9dc",
    color: "#a78953",
    minWidth: 20,
    textAlign: "center",
  },
  alertCount: { backgroundColor: "#f0f2ec", color: "#8b9581" },
  sideBottom: { marginTop: "auto", padding: "25px 13px 13px" },
  status: {
    margin: "15px 8px 18px",
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontSize: 9.5,
    color: "#8d9985",
  },
  statusDot: {
    width: 5,
    height: 5,
    borderRadius: "50%",
    backgroundColor: "#9cad76",
  },
  account: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "13px 8px 2px",
    borderTopWidth: 1,
    borderTopStyle: "solid",
    borderTopColor: "#e7ebdf",
    width: "100%",
    textAlign: "left",
  },
  accountName: { fontSize: 11, fontWeight: 550, color: "#57664d" },
  main: {
    marginLeft: { default: 218, "@media (max-width: 850px)": 0 },
    minHeight: "100vh",
  },
  topbar: {
    height: 63,
    borderBottomWidth: 1,
    borderBottomStyle: "solid",
    borderBottomColor: "#e8ebe6",
    backgroundColor: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    paddingInline: {
      default: 32,
      "@media (max-width: 1200px)": 24,
      "@media (max-width: 640px)": 16,
    },
    gap: 16,
    position: "sticky",
    top: 0,
    zIndex: 30,
  },
  breadcrumb: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    fontSize: 11,
    color: "#7f8d77",
  },
  crumbOrg: {
    display: { default: "inline", "@media (max-width: 480px)": "none" },
  },
  crumbCurrent: { fontWeight: 500, color: "#5c6c50" },
  topSearch: {
    display: "flex",
    alignItems: "center",
    gap: 7,
    fontSize: 10.5,
    color: "#72816b",
    paddingRight: 18,
    borderRightWidth: 1,
    borderRightStyle: "solid",
    borderRightColor: "#e8ece1",
  },
  searchText: {
    display: { default: "inline", "@media (max-width: 1024px)": "none" },
  },
  key: {
    padding: "0 4px",
    minHeight: 18,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#e8ecdf",
    borderRadius: 3,
    fontSize: 9,
    marginLeft: 23,
    color: "#a5ad9a",
    backgroundColor: "#fafbf7",
    fontFamily: "inherit",
  },
  notification: { position: "relative" },
  notificationDot: {
    width: 5,
    height: 5,
    backgroundColor: "#b58d65",
    borderWidth: 1.5,
    borderStyle: "solid",
    borderColor: "#fff",
    borderRadius: "50%",
    position: "absolute",
    right: 7,
    top: 5,
  },
  mobileButton: {
    display: { default: "none", "@media (max-width: 850px)": "block" },
  },
  mobileBackdrop: {
    display: { default: "none", "@media (max-width: 850px)": "block" },
    position: "fixed",
    inset: 0,
    backgroundColor: "#17352355",
    zIndex: 35,
  },
  drop: {
    position: "absolute",
    top: "calc(100% + 7px)",
    left: 0,
    width: 250,
    padding: 8,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#dfe6d8",
    borderRadius: 8,
    boxShadow: "0 8px 30px #23362219",
    zIndex: 60,
  },
  dropItem: {
    display: "flex",
    alignItems: "center",
    gap: 9,
    textAlign: "left",
    padding: "10px 8px",
    width: "100%",
    borderRadius: 5,
    fontSize: 11,
    ":hover": { backgroundColor: "#f1f5eb" },
  },
  toast: {
    position: "fixed",
    bottom: 25,
    left: { default: "calc(50% + 109px)", "@media (max-width: 850px)": "50%" },
    transform: "translateX(-50%)",
    padding: "13px 18px",
    borderRadius: 8,
    backgroundColor: "#294f34",
    color: "#f5faf0",
    boxShadow: "0 5px 25px #18331d30",
    zIndex: 150,
    display: "flex",
    alignItems: "center",
    gap: 9,
    fontSize: 12,
    maxWidth: "90vw",
    width: "max-content",
    animationName: "fadeIn",
    animationDuration: ".2s",
  },
  footer: {
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    flexWrap: "wrap",
    padding: "0 32px 20px",
    color: "#adb4a6",
    fontSize: 9,
  },
  skip: {
    position: "fixed",
    top: -60,
    left: 240,
    zIndex: 200,
    backgroundColor: "#fff",
    padding: 10,
    ":focus": { top: 10 },
  },
});

export function AppShell({ children }: { children: ReactNode }) {
  const store = useStore();
  const go = useGo();
  const location = useLocation();
  const [mobile, setMobile] = useState(false);
  const [smallViewport, setSmallViewport] = useState(false);
  const [workspace, setWorkspace] = useState(false);
  const [notifications, setNotifications] = useState(false);
  const [account, setAccount] = useState(false);
  const [help, setHelp] = useState(false);
  const path = location.pathname;
  const current =
    nav.find((n) => (n.path === "/" ? path === "/" : path.startsWith(n.path)))
      ?.label ?? (path.startsWith("/settings") ? "Settings" : "Workspace");
  useEffect(() => {
    setMobile(false);
    setWorkspace(false);
  }, [path]);
  useEffect(() => {
    const media = window.matchMedia("(max-width: 850px)");
    const update = () => setSmallViewport(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    if (smallViewport && mobile)
      document
        .querySelector<HTMLElement>(
          'aside[aria-label="Main navigation"] button',
        )
        ?.focus();
  }, [mobile, smallViewport]);
  useEffect(() => {
    const keyboard = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (!store.searchOpen && document.querySelector('[role="dialog"]'))
          return;
        setMobile(false);
        store.setSearchOpen(!store.searchOpen);
      }
      if (e.key === "Escape") {
        setMobile(false);
        setWorkspace(false);
      }
    };
    window.addEventListener("keydown", keyboard);
    return () => window.removeEventListener("keydown", keyboard);
  }, [store.searchOpen]);
  const activeCount = store.incidents.filter(
    (i) => i.status !== "Resolved",
  ).length;
  return (
    <div {...stylex.props(sh.app)}>
      <a href="#main-content" {...stylex.props(sh.skip)}>
        Skip to content
      </a>
      {mobile && (
        <button
          aria-label="Close navigation"
          {...stylex.props(sh.mobileBackdrop)}
          onClick={() => setMobile(false)}
        />
      )}
      <aside
        aria-label="Main navigation"
        inert={smallViewport && !mobile}
        aria-hidden={smallViewport && !mobile ? true : undefined}
        {...stylex.props(sh.sidebar, mobile && sh.sidebarOpen)}
      >
        <button
          aria-label="RelayOps overview"
          onClick={() => go("/")}
          {...stylex.props(sh.brand)}
        >
          <svg viewBox="0 0 28 30" fill="none" {...stylex.props(sh.logo)}>
            <path d="M5 4h13l6 6-6 6H5l6-6H5V4Z" fill="currentColor" />
            <path
              d="M5 17h13l6 6-6 6H5l6-6H5v-6Z"
              fill="currentColor"
              opacity=".58"
            />
          </svg>
          RelayOps
        </button>
        <div {...stylex.props(sh.workspace)}>
          <button
            aria-expanded={workspace}
            onClick={() => setWorkspace(!workspace)}
            {...stylex.props(sh.workspaceButton)}
          >
            <span {...stylex.props(sh.orgIcon)}>✳</span>
            <span {...stylex.props(s.grow)}>
              <div {...stylex.props(sh.workspaceName)}>
                {store.settings.organization}
              </div>
              <div {...stylex.props(sh.workspaceSub)}>
                {store.settings.workspace}
              </div>
            </span>
            <ChevronDown size={12} />
          </button>
          {workspace && (
            <div {...stylex.props(sh.drop)}>
              <div {...stylex.props(s.overline)} style={{ padding: 8 }}>
                Your workspace
              </div>
              <button
                {...stylex.props(sh.dropItem)}
                onClick={() => setWorkspace(false)}
              >
                <Check size={14} />
                <span>
                  {store.settings.workspace}
                  <span
                    {...stylex.props(s.muted, s.small)}
                    style={{ display: "block" }}
                  >
                    85 members · Admin access
                  </span>
                </span>
              </button>
              <button
                {...stylex.props(sh.dropItem)}
                onClick={() => {
                  go("/settings");
                  setWorkspace(false);
                }}
              >
                <Settings size={14} />
                Manage workspace
                <ArrowUpRight size={12} />
              </button>
            </div>
          )}
        </div>
        <div {...stylex.props(sh.navLabel)}>WORKSPACE</div>
        <nav {...stylex.props(sh.nav)}>
          {nav.map((item) => {
            const active =
              item.path === "/" ? path === "/" : path.startsWith(item.path);
            return (
              <button
                key={item.path}
                onClick={() => go(item.path)}
                aria-current={active ? "page" : undefined}
                {...stylex.props(sh.navItem, active && sh.active)}
              >
                <item.icon size={16} strokeWidth={1.6} />
                <span>{item.label}</span>
                {item.label === "Incidents" && (
                  <span {...stylex.props(sh.navCount)}>{activeCount}</span>
                )}
                {item.label === "Alerts" && (
                  <span {...stylex.props(sh.navCount, sh.alertCount)}>
                    {store.alerts.filter((a) => a.state === "Firing").length}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
        <div {...stylex.props(sh.sideBottom)}>
          <button
            onClick={() => store.setSearchOpen(true)}
            {...stylex.props(sh.navItem)}
            style={{ width: "100%" }}
          >
            <Zap size={16} strokeWidth={1.5} />
            <span>Quick actions</span>
            <Command size={11} style={{ marginLeft: "auto", opacity: 0.5 }} />
          </button>
          <button
            onClick={() => go("/settings")}
            {...stylex.props(
              sh.navItem,
              path.startsWith("/settings") && sh.active,
            )}
            style={{ width: "100%" }}
          >
            <Settings size={16} strokeWidth={1.6} />
            Settings
          </button>
          <button
            onClick={() => setHelp(true)}
            {...stylex.props(sh.navItem)}
            style={{ width: "100%" }}
          >
            <HelpCircle size={16} strokeWidth={1.6} />
            Help & resources
            <ArrowUpRight size={11} style={{ marginLeft: "auto" }} />
          </button>
          <div {...stylex.props(sh.status)}>
            <span {...stylex.props(sh.statusDot)} />
            RelayOps systems operational
          </div>
          <button
            onClick={() => setAccount(true)}
            {...stylex.props(sh.account)}
          >
            <Avatar id="alex" />
            <span {...stylex.props(s.grow)}>
              <div {...stylex.props(sh.accountName)}>Alex Morgan</div>
              <div {...stylex.props(sh.workspaceSub)}>Workspace admin</div>
            </span>
            <ChevronDown size={12} color="#9ca790" />
          </button>
        </div>
      </aside>
      <div inert={smallViewport && mobile} {...stylex.props(sh.main)}>
        <div {...stylex.props(sh.topbar)}>
          <div {...stylex.props(sh.breadcrumb)}>
            <div {...stylex.props(sh.mobileButton)}>
              <IconButton
                icon={Menu}
                label="Open navigation"
                onClick={() => setMobile(true)}
              />
            </div>
            <span {...stylex.props(sh.crumbOrg)}>Workspace</span>
            <ChevronRight size={12} {...stylex.props(sh.crumbOrg)} />
            <span {...stylex.props(sh.crumbCurrent)}>{current}</span>
            {path.split("/").filter(Boolean).length > 1 && (
              <>
                <ChevronRight size={12} />
                <span {...stylex.props(s.small)}>
                  {decodeURIComponent(path.split("/").at(-1)!)
                    .replaceAll("-", " ")
                    .replace("INC ", "INC-")
                    .replace("PM ", "PM-")}
                </span>
              </>
            )}
          </div>
          <div {...stylex.props(s.row, s.gap12)}>
            <button
              aria-label="Global search, Command K"
              onClick={() => store.setSearchOpen(true)}
              {...stylex.props(sh.topSearch)}
            >
              <Search size={14} />
              <span {...stylex.props(sh.searchText)}>
                Search anything… <kbd {...stylex.props(sh.key)}>⌘ K</kbd>
              </span>
            </button>
            <div {...stylex.props(sh.notification)}>
              <IconButton
                icon={Bell}
                label="Open notifications"
                onClick={() => setNotifications(true)}
              />
              {store.notifications.some((n) => !n.read) && (
                <span {...stylex.props(sh.notificationDot)} />
              )}
            </div>
            <button aria-label="Your account" onClick={() => setAccount(true)}>
              <Avatar id="alex" />
            </button>
          </div>
        </div>
        <main id="main-content">{children}</main>
        <footer {...stylex.props(sh.footer)}>
          <span>Northstar Labs · Production Engineering</span>
          <span {...stylex.props(s.row, s.gap6)}>
            <span {...stylex.props(sh.statusDot)} />
            All data synced · Updated just now
          </span>
        </footer>
      </div>
      {store.toastMessage && (
        <div role="status" {...stylex.props(sh.toast)}>
          <CheckCircle2 size={16} />
          {store.toastMessage}
        </div>
      )}
      {store.createOpen && <CreateIncidentDialog />}
      {store.searchOpen && <CommandDialog />}
      {notifications && (
        <NotificationsDialog onClose={() => setNotifications(false)} />
      )}
      {account && (
        <Modal
          title="Your account"
          onClose={() => setAccount(false)}
          footer={
            <Button
              variant="primary"
              onClick={() => {
                setAccount(false);
                go("/settings?tab=notifications");
              }}
            >
              Manage preferences
            </Button>
          }
        >
          <div {...stylex.props(s.row)}>
            <Avatar id="alex" size="large" />
            <div>
              <strong>Alex Morgan</strong>
              <p {...stylex.props(s.secondary)}>alex.morgan@northstar.io</p>
            </div>
          </div>
          <div {...stylex.props(s.note, s.sectionSpace)}>
            <CheckCircle2 size={16} />
            Workspace admin at Northstar Labs. Your session and workspace
            changes are saved on this device.
          </div>
        </Modal>
      )}
      {help && (
        <Modal
          title="A little help, right when you need it"
          onClose={() => setHelp(false)}
        >
          <div {...stylex.props(s.column)}>
            <div>
              <h3>Keyboard shortcuts</h3>
              <p {...stylex.props(s.secondary, s.space8)}>
                ⌘ / Ctrl + K — Search and quick actions
                <br />↑ / ↓ — Navigate search results
                <br />
                Enter — Open a result
                <br />
                Escape — Close dialogs
              </p>
            </div>
            <div {...stylex.props(s.note)}>
              <BookOpen size={18} />
              <div>
                <strong>Incident response basics</strong>
                <p>
                  Declare an incident, assign a commander, and bring in
                  responders. Keep the timeline updated as you investigate.
                  After recovery, resolve the incident and create a postmortem
                  to track corrective actions.
                </p>
              </div>
            </div>
            <Button
              icon={ShieldAlert}
              onClick={() => {
                setHelp(false);
                go("/incidents/INC-1042");
              }}
            >
              Open the active incident workspace
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
