import { useLocation } from "@tanstack/react-router";
import { IncidentsPage, IncidentDetail } from "./Incidents";
import { AlertsPage } from "./Alerts";
import { ServicesPage, ServiceDetail } from "./Services";
import { DeploymentsPage } from "./Deployments";
import { OnCallPage } from "./OnCall";
import { AnalyticsPage } from "./Analytics";
import { PostmortemsPage, PostmortemDetail } from "./Postmortems";
import { TeamsPage, TeamDetail } from "./Teams";
import { SettingsPage } from "./Settings";
import { AppLink, PageHeader, s } from "../components/ui";
import * as stylex from "@stylexjs/stylex";

export function WorkspacePage() {
  const { pathname } = useLocation();
  const [section, id] = pathname
    .split("/")
    .filter(Boolean)
    .map(decodeURIComponent);
  switch (section) {
    case "incidents":
      return id ? <IncidentDetail key={id} id={id} /> : <IncidentsPage />;
    case "alerts":
      return <AlertsPage selectedId={id} />;
    case "services":
      return id ? <ServiceDetail key={id} id={id} /> : <ServicesPage />;
    case "deployments":
      return <DeploymentsPage selectedId={id} />;
    case "on-call":
      return <OnCallPage />;
    case "analytics":
      return <AnalyticsPage />;
    case "postmortems":
      return id ? <PostmortemDetail key={id} id={id} /> : <PostmortemsPage />;
    case "teams":
      return id ? <TeamDetail key={id} id={id} /> : <TeamsPage />;
    case "settings":
      return <SettingsPage />;
    default:
      return (
        <div {...stylex.props(s.page)}>
          <PageHeader
            title="Page not found"
            description="This page is not part of the current workspace."
          />
          <AppLink to="/">Return to overview</AppLink>
        </div>
      );
  }
}
