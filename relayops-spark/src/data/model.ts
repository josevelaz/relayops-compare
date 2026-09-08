export type Severity = 'SEV0' | 'SEV1' | 'SEV2' | 'SEV3';
export type IncidentStatus = 'Investigating' | 'Identified' | 'Monitoring' | 'Resolved';
export type AlertState = 'Firing' | 'Acknowledged' | 'Resolved';
export type HealthState = 'Critical' | 'Degraded' | 'Healthy';
export type Tier = 'Tier 1' | 'Tier 2' | 'Tier 3';
export type DeployStatus = 'Successful' | 'Failed' | 'Rolling out' | 'Rolled back';
export type DeployEnv = 'Production' | 'Staging';
export type PostmortemStatus = 'Draft' | 'In review' | 'Published';

export interface Person {
  id: string;
  name: string;
  role: string;
  teamId: string;
  email: string;
  avatarColor: string;
  onCallNow?: boolean;
}

export interface Team {
  id: string;
  name: string;
  leadId: string;
  memberIds: string[];
  description: string;
  channel: string;
  reliability: number;
  mttrMinutes: number;
}

export interface Service {
  id: string;
  name: string;
  teamId: string;
  tier: Tier;
  health: HealthState;
  uptime30d: number;
  openIncidentIds: string[];
  activeAlertIds: string[];
  lastDeployId: string;
  tech: string;
  repo: string;
  runtime: string;
  infra: string;
  region: string;
  latencyP95Ms: number;
  errorRatePct: number;
  rpm: number;
  dependsOn: string[];
  dependedBy: string[];
}

export interface TimelineEntry {
  id: string;
  at: string;
  clock: string;
  kind: 'system' | 'update' | 'alert' | 'deploy' | 'status' | 'comment' | 'task';
  author?: string;
  title: string;
  body?: string;
}

export interface IncidentTask {
  id: string;
  title: string;
  ownerId: string;
  done: boolean;
}

export interface StatusUpdate {
  id: string;
  at: string;
  audience: 'Customer' | 'Internal';
  author: string;
  title: string;
  body: string;
}

export interface Incident {
  id: string;
  title: string;
  severity: Severity;
  status: IncidentStatus;
  serviceIds: string[];
  commanderId: string;
  responderIds: string[];
  startedAt: string;
  startedLabel: string;
  durationLabel: string;
  customerImpact: string;
  description: string;
  alertIds: string[];
  deployIds: string[];
  timeline: TimelineEntry[];
  tasks: IncidentTask[];
  updates: StatusUpdate[];
  discussion: { id: string; authorId: string; at: string; body: string }[];
}

export interface Alert {
  id: string;
  name: string;
  serviceId: string;
  severity: Severity;
  source: 'Datadog' | 'Grafana' | 'CloudWatch' | 'Sentry' | 'Custom';
  state: AlertState;
  triggeredAt: string;
  triggeredLabel: string;
  durationLabel: string;
  assigneeId?: string;
  incidentId?: string;
  value: string;
}

export interface Deployment {
  id: string;
  serviceId: string;
  version: string;
  commit: string;
  env: DeployEnv;
  authorId: string;
  at: string;
  atLabel: string;
  status: DeployStatus;
  pr: string;
  incidentId?: string;
  note?: string;
}

export interface CorrectiveAction {
  id: string;
  title: string;
  ownerId: string;
  priority: 'P0' | 'P1' | 'P2';
  due: string;
  status: 'Open' | 'In progress' | 'Done';
}

export interface Postmortem {
  id: string;
  title: string;
  incidentId: string;
  severity: Severity;
  ownerId: string;
  status: PostmortemStatus;
  createdAt: string;
  summary: string;
  impact: string;
  detection: string;
  timeline: { at: string; text: string }[];
  rootCause: string;
  resolution: string;
  wentWell: string[];
  wentPoorly: string[];
  lessons: string[];
  actions: CorrectiveAction[];
}

export interface DeploymentWindow {
  id: string;
  teamId: string;
  personId: string;
  role: 'Primary' | 'Secondary';
  start: string;
  end: string;
  day: string;
}

export interface AppNotification {
  id: string;
  text: string;
  detail: string;
  at: string;
  read: boolean;
  tone: 'incident' | 'deploy' | 'oncall' | 'mention' | 'task' | 'alert';
  link?: string;
}

/* ---------------- People ---------------- */

export const people: Person[] = [
  { id: 'sarah', name: 'Sarah Chen', role: 'Engineering Manager', teamId: 'payments', email: 'sarah.chen@northstar.dev', avatarColor: '#7c3aed' },
  { id: 'marcus', name: 'Marcus Johnson', role: 'Senior Software Engineer', teamId: 'payments', email: 'marcus.j@northstar.dev', avatarColor: '#0369a1' },
  { id: 'priya', name: 'Priya Patel', role: 'Site Reliability Engineer', teamId: 'payments', email: 'priya.p@northstar.dev', avatarColor: '#be123c' },
  { id: 'liam', name: 'Liam Brooks', role: 'Software Engineer', teamId: 'payments', email: 'liam.b@northstar.dev', avatarColor: '#0d9488' },
  { id: 'elena', name: 'Elena Rodriguez', role: 'Senior Software Engineer', teamId: 'payments', email: 'elena.r@northstar.dev', avatarColor: '#c2410c' },
  { id: 'noah', name: 'Noah Williams', role: 'Software Engineer', teamId: 'payments', email: 'noah.w@northstar.dev', avatarColor: '#4d7c0f' },
  { id: 'david', name: 'David Kim', role: 'Staff Engineer, Team Lead', teamId: 'platform', email: 'david.k@northstar.dev', avatarColor: '#1d4ed8' },
  { id: 'aisha', name: 'Aisha Khan', role: 'Site Reliability Engineer', teamId: 'platform', email: 'aisha.k@northstar.dev', avatarColor: '#a21caf' },
  { id: 'tom', name: 'Tom Becker', role: 'Software Engineer', teamId: 'core-api', email: 'tom.b@northstar.dev', avatarColor: '#0e7490' },
  { id: 'mei', name: 'Mei Lin', role: 'Engineering Manager', teamId: 'core-api', email: 'mei.l@northstar.dev', avatarColor: '#b45309' },
  { id: 'raj', name: 'Raj Nair', role: 'Senior SRE', teamId: 'infrastructure', email: 'raj.n@northstar.dev', avatarColor: '#065f46' },
  { id: 'sofia', name: 'Sofia Marino', role: 'Infrastructure Engineer', teamId: 'infrastructure', email: 'sofia.m@northstar.dev', avatarColor: '#6d28d9' },
  { id: 'james', name: 'James Okafor', role: 'Software Engineer', teamId: 'developer-experience', email: 'james.o@northstar.dev', avatarColor: '#9a3412' },
  { id: 'anna', name: 'Anna Petrova', role: 'Engineering Manager', teamId: 'developer-experience', email: 'anna.p@northstar.dev', avatarColor: '#155e75' },
  { id: 'carlos', name: 'Carlos Mendez', role: 'Software Engineer', teamId: 'core-api', email: 'carlos.m@northstar.dev', avatarColor: '#3f6212' },
  { id: 'jane', name: 'Jane Park', role: 'Product Manager', teamId: 'platform', email: 'jane.p@northstar.dev', avatarColor: '#831843' },
];

export const personById: Record<string, Person> = Object.fromEntries(people.map((p) => [p.id, p]));

export function initials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

/* ---------------- Teams ---------------- */

export const teams: Team[] = [
  { id: 'platform', name: 'Platform', leadId: 'david', memberIds: ['david', 'aisha', 'jane'], description: 'Owns the API gateway, shared libraries and the internal developer platform that every service builds on.', channel: '#team-platform', reliability: 99.97, mttrMinutes: 41 },
  { id: 'payments', name: 'Payments', leadId: 'sarah', memberIds: ['sarah', 'marcus', 'priya', 'liam', 'elena', 'noah'], description: 'Owns money movement: checkout, payment processing and billing. Highest reliability bar in the company.', channel: '#team-payments', reliability: 99.91, mttrMinutes: 58 },
  { id: 'core-api', name: 'Core API', leadId: 'mei', memberIds: ['mei', 'tom', 'carlos'], description: 'Owns authentication, users and the public API surface used by web, mobile and partners.', channel: '#team-core-api', reliability: 99.95, mttrMinutes: 36 },
  { id: 'infrastructure', name: 'Infrastructure', leadId: 'raj', memberIds: ['raj', 'sofia'], description: 'Owns Kubernetes, networking, data stores and analytics pipeline infrastructure.', channel: '#team-infra', reliability: 99.98, mttrMinutes: 47 },
  { id: 'developer-experience', name: 'Developer Experience', leadId: 'anna', memberIds: ['anna', 'james'], description: 'Owns CI/CD, preview environments, search infrastructure and engineering productivity.', channel: '#team-dx', reliability: 99.93, mttrMinutes: 52 },
];

export const teamById: Record<string, Team> = Object.fromEntries(teams.map((t) => [t.id, t]));

/* ---------------- Services ---------------- */

export const services: Service[] = [
  { id: 'checkout-api', name: 'Checkout API', teamId: 'payments', tier: 'Tier 1', health: 'Critical', uptime30d: 99.91, openIncidentIds: ['INC-1042'], activeAlertIds: ['ALT-901', 'ALT-902', 'ALT-914'], lastDeployId: 'dep-14', tech: 'TypeScript · Fastify', repo: 'relay/checkout-api', runtime: 'Node.js', infra: 'Kubernetes', region: 'us-east-1', latencyP95Ms: 1840, errorRatePct: 8.7, rpm: 184000, dependsOn: ['payment-gateway', 'order-service', 'auth-service'], dependedBy: [] },
  { id: 'payment-gateway', name: 'Payment Gateway', teamId: 'payments', tier: 'Tier 1', health: 'Critical', uptime30d: 99.89, openIncidentIds: ['INC-1042'], activeAlertIds: ['ALT-903', 'ALT-904'], lastDeployId: 'dep-01', tech: 'TypeScript · gRPC', repo: 'relay/payment-gateway', runtime: 'Node.js', infra: 'Kubernetes', region: 'us-east-1', latencyP95Ms: 2310, errorRatePct: 11.2, rpm: 96000, dependsOn: ['auth-service', 'billing-service'], dependedBy: ['checkout-api', 'order-service'] },
  { id: 'order-service', name: 'Order Service', teamId: 'payments', tier: 'Tier 1', health: 'Degraded', uptime30d: 99.94, openIncidentIds: ['INC-1042'], activeAlertIds: ['ALT-905', 'ALT-913', 'ALT-923'], lastDeployId: 'dep-05', tech: 'Go · Postgres', repo: 'relay/order-service', runtime: 'Go', infra: 'Kubernetes', region: 'us-east-1', latencyP95Ms: 640, errorRatePct: 2.1, rpm: 88000, dependsOn: ['payment-gateway', 'inventory-service'], dependedBy: ['checkout-api'] },
  { id: 'auth-service', name: 'Authentication Service', teamId: 'core-api', tier: 'Tier 1', health: 'Degraded', uptime30d: 99.96, openIncidentIds: ['INC-1039', 'INC-1041'], activeAlertIds: ['ALT-906', 'ALT-924'], lastDeployId: 'dep-06', tech: 'Go · Redis', repo: 'relay/auth-service', runtime: 'Go', infra: 'Kubernetes', region: 'us-east-1', latencyP95Ms: 310, errorRatePct: 1.4, rpm: 210000, dependsOn: ['user-service'], dependedBy: ['payment-gateway', 'checkout-api', 'api-gateway'] },
  { id: 'user-service', name: 'User Service', teamId: 'core-api', tier: 'Tier 2', health: 'Healthy', uptime30d: 99.99, openIncidentIds: [], activeAlertIds: ['ALT-920'], lastDeployId: 'dep-07', tech: 'Kotlin · Postgres', repo: 'relay/user-service', runtime: 'JVM', infra: 'Kubernetes', region: 'us-east-1', latencyP95Ms: 120, errorRatePct: 0.08, rpm: 150000, dependsOn: [], dependedBy: ['auth-service'] },
  { id: 'notification-service', name: 'Notification Service', teamId: 'platform', tier: 'Tier 2', health: 'Healthy', uptime30d: 99.98, openIncidentIds: [], activeAlertIds: ['ALT-907', 'ALT-919', 'ALT-921'], lastDeployId: 'dep-08', tech: 'Python · SQS', repo: 'relay/notifications', runtime: 'Python', infra: 'Kubernetes', region: 'us-east-1', latencyP95Ms: 240, errorRatePct: 0.22, rpm: 64000, dependsOn: [], dependedBy: ['order-service'] },
  { id: 'webhook-processor', name: 'Webhook Processor', teamId: 'platform', tier: 'Tier 2', health: 'Degraded', uptime30d: 99.9, openIncidentIds: ['INC-1040'], activeAlertIds: ['ALT-908', 'ALT-909'], lastDeployId: 'dep-09', tech: 'Go · Kafka', repo: 'relay/webhooks', runtime: 'Go', infra: 'Kubernetes', region: 'us-east-1', latencyP95Ms: 980, errorRatePct: 3.4, rpm: 41000, dependsOn: ['api-gateway'], dependedBy: [] },
  { id: 'billing-service', name: 'Billing Service', teamId: 'payments', tier: 'Tier 1', health: 'Healthy', uptime30d: 99.99, openIncidentIds: [], activeAlertIds: ['ALT-917'], lastDeployId: 'dep-10', tech: 'Java · Postgres', repo: 'relay/billing', runtime: 'JVM', infra: 'Kubernetes', region: 'us-east-1', latencyP95Ms: 180, errorRatePct: 0.05, rpm: 22000, dependsOn: [], dependedBy: ['payment-gateway'] },
  { id: 'api-gateway', name: 'API Gateway', teamId: 'platform', tier: 'Tier 1', health: 'Healthy', uptime30d: 99.99, openIncidentIds: ['INC-1041'], activeAlertIds: ['ALT-910', 'ALT-922', 'ALT-915'], lastDeployId: 'dep-11', tech: 'Envoy · Lua', repo: 'relay/api-gateway', runtime: 'Envoy', infra: 'Kubernetes', region: 'us-east-1', latencyP95Ms: 95, errorRatePct: 0.31, rpm: 1820000, dependsOn: ['auth-service'], dependedBy: ['checkout-api', 'search-service', 'webhook-processor'] },
  { id: 'search-service', name: 'Search Service', teamId: 'developer-experience', tier: 'Tier 2', health: 'Healthy', uptime30d: 99.97, openIncidentIds: [], activeAlertIds: [], lastDeployId: 'dep-12', tech: 'Rust · OpenSearch', repo: 'relay/search', runtime: 'Rust', infra: 'Kubernetes', region: 'us-west-2', latencyP95Ms: 140, errorRatePct: 0.11, rpm: 98000, dependsOn: ['api-gateway'], dependedBy: [] },
  { id: 'inventory-service', name: 'Inventory Service', teamId: 'core-api', tier: 'Tier 3', health: 'Healthy', uptime30d: 99.98, openIncidentIds: [], activeAlertIds: [], lastDeployId: 'dep-13', tech: 'Python · Postgres', repo: 'relay/inventory', runtime: 'Python', infra: 'Kubernetes', region: 'us-east-1', latencyP95Ms: 160, errorRatePct: 0.09, rpm: 54000, dependsOn: [], dependedBy: ['order-service'] },
  { id: 'analytics-pipeline', name: 'Analytics Pipeline', teamId: 'infrastructure', tier: 'Tier 3', health: 'Degraded', uptime30d: 99.92, openIncidentIds: ['INC-1038'], activeAlertIds: ['ALT-911', 'ALT-912'], lastDeployId: 'dep-15', tech: 'Flink · Kafka', repo: 'relay/analytics', runtime: 'Flink', infra: 'Kubernetes', region: 'us-east-1', latencyP95Ms: 2200, errorRatePct: 0.9, rpm: 310000, dependsOn: [], dependedBy: [] },
];

export const serviceById: Record<string, Service> = Object.fromEntries(services.map((s) => [s.id, s]));

/* ---------------- Incidents ---------------- */

export const incidents: Incident[] = [
  {
    id: 'INC-1042', title: 'Checkout failures after payment gateway deployment', severity: 'SEV1', status: 'Investigating',
    serviceIds: ['checkout-api', 'payment-gateway', 'order-service'], commanderId: 'sarah',
    responderIds: ['marcus', 'priya', 'liam', 'elena'], startedAt: '2026-09-08T10:32:00', startedLabel: 'Today at 10:32 AM',
    durationLabel: '1h 12m', customerImpact: 'Approximately 8.7% of checkout attempts are failing (peak 21.4%). Enterprise checkout and card payments are most affected. No data loss detected; failed payments are safe to retry.',
    description: 'Checkout error rate spiked above 18% minutes after payment-gateway@4.18.2 rolled out. Rollback completed at 10:43 AM but elevated failures persist on two gateway instances with stale routing configuration.',
    alertIds: ['ALT-901', 'ALT-903', 'ALT-904', 'ALT-902'],
    deployIds: ['dep-01', 'dep-02', 'dep-14'],
    timeline: [
      { id: 't1', at: '10:32 AM', clock: '10:32', kind: 'system', title: 'Automated monitoring detected checkout error rate above 18%.', body: 'Monitor checkout-error-rate (Datadog) breached critical threshold: 18.2% over 5 min window. Normal baseline below 0.5%.' },
      { id: 't2', at: '10:34 AM', clock: '10:34', kind: 'system', title: 'Incident INC-1042 automatically created.', body: 'Auto-created from monitor with severity SEV1. Paged Payments primary and secondary on-call.' },
      { id: 't3', at: '10:36 AM', clock: '10:36', kind: 'status', author: 'Sarah Chen', title: 'Sarah Chen assigned as incident commander.', body: 'Sarah took command and opened the incident bridge. Status set to Investigating.' },
      { id: 't4', at: '10:39 AM', clock: '10:39', kind: 'deploy', author: 'Priya Patel', title: 'Payment Gateway deployment payment-gateway@4.18.2 identified as a possible trigger.', body: 'Deploy finished 10:27 AM, five minutes before error spike. Change: new payment routing table format.' },
      { id: 't5', at: '10:43 AM', clock: '10:43', kind: 'deploy', author: 'Marcus Johnson', title: 'Rollback initiated.', body: 'Rolling payment-gateway back to 4.18.1 across all 24 instances in us-east-1.' },
      { id: 't6', at: '10:46 AM', clock: '10:46', kind: 'comment', author: 'Liam Brooks', title: 'Rollback at 70% — error rate falling on refreshed instances.', body: 'Instances on 4.18.1 are clean. The remaining failures concentrate on gw-07 and gw-11.' },
      { id: 't7', at: '10:48 AM', clock: '10:48', kind: 'alert', title: 'Checkout error rate decreased from 21.4% to 8.7%.', body: 'Partial recovery confirmed. Alert ALT-901 remains firing; ALT-904 downgraded to warning.' },
      { id: 't8', at: '10:53 AM', clock: '10:53', kind: 'update', author: 'Elena Rodriguez', title: 'Engineers identified stale payment routing configuration on two instances.', body: 'gw-07 and gw-11 kept the new routing table format through the rollback. Config checksum mismatch confirmed.' },
      { id: 't9', at: '11:01 AM', clock: '11:01', kind: 'update', author: 'Sarah Chen', title: 'Configuration refresh initiated.', body: 'Forcing config reload on gw-07 and gw-11, then verifying checksums across the fleet before declaring recovery.' },
      { id: 't10', at: '11:06 AM', clock: '11:06', kind: 'comment', author: 'Priya Patel', title: 'Provider dashboard shows no upstream outage.', body: 'Payment provider status is green. This is isolated to our routing config — no need to escalate externally yet.' },
      { id: 't11', at: '11:12 AM', clock: '11:12', kind: 'update', author: 'Marcus Johnson', title: 'gw-07 recovered; gw-11 still draining stale connections.', body: 'Error rate down to 6.1% and falling. Keeping status at Investigating until under 1% for 10 minutes.' },
    ],
    tasks: [
      { id: 'task-1', title: 'Verify rollback completion', ownerId: 'marcus', done: true },
      { id: 'task-2', title: 'Compare routing config across gateway instances', ownerId: 'elena', done: true },
      { id: 'task-3', title: 'Contact payment provider if failure rate remains elevated', ownerId: 'priya', done: false },
      { id: 'task-4', title: 'Prepare customer status update', ownerId: 'sarah', done: false },
    ],
    updates: [
      { id: 'u1', at: '11:00 AM', audience: 'Customer', author: 'Sarah Chen', title: 'Checkout issues — partial recovery', body: 'Some customers may still see checkout failures. Failed payments are safe to retry. Our team has identified the cause and is completing the fix. Next update in 30 minutes.' },
      { id: 'u2', at: '10:45 AM', audience: 'Internal', author: 'Sarah Chen', title: 'Leadership update', body: 'SEV1 declared for checkout. Rollback in progress, error rate already falling. Enterprise accounts notified via support. No data integrity concerns.' },
    ],
    discussion: [
      { id: 'd1', authorId: 'priya', at: '10:41 AM', body: 'Confirmed the deploy diff touches the routing table loader. The new format version is not backward compatible with the old reader — that matches what we see.' },
      { id: 'd2', authorId: 'liam', at: '10:52 AM', body: 'Checksum comparison is up: 22/24 instances match the known-good config. Only gw-07 and gw-11 diverge. Refreshing both now.' },
      { id: 'd3', authorId: 'elena', at: '11:05 AM', body: 'gw-07 is clean after refresh. gw-11 has long-lived connections pinning the old config — draining them now, should clear within minutes.' },
    ],
  },
  {
    id: 'INC-1041', title: 'Elevated API latency in us-east-1', severity: 'SEV2', status: 'Monitoring',
    serviceIds: ['api-gateway', 'auth-service'], commanderId: 'david', responderIds: ['aisha', 'tom'],
    startedAt: '2026-09-08T08:15:00', startedLabel: 'Today at 8:15 AM', durationLabel: '3h 29m',
    customerImpact: 'P95 latency 2–3x baseline for API gateway traffic. No errors; requests succeed slowly.',
    description: 'Latency increase correlated with a traffic shift after a CDN configuration change. Monitoring after mitigation.',
    alertIds: ['ALT-910', 'ALT-922'], deployIds: ['dep-11'],
    timeline: [
      { id: 't1', at: '8:15 AM', clock: '8:15', kind: 'system', title: 'Latency monitor breached warning threshold.', body: 'P95 above 800ms for 10 minutes on api-gateway.' },
      { id: 't2', at: '8:22 AM', clock: '8:22', kind: 'status', author: 'David Kim', title: 'Status moved to Identified.', body: 'CDN origin shift identified as the likely cause.' },
      { id: 't3', at: '9:40 AM', clock: '9:40', kind: 'status', author: 'David Kim', title: 'Status moved to Monitoring.', body: 'Mitigation applied; latency trending down.' },
    ],
    tasks: [
      { id: 'task-1', title: 'Confirm latency back under 200ms P95', ownerId: 'aisha', done: false },
      { id: 'task-2', title: 'Follow up with CDN provider', ownerId: 'david', done: false },
    ],
    updates: [{ id: 'u1', at: '9:45 AM', audience: 'Internal', author: 'David Kim', title: 'Monitoring', body: 'Latency recovering. Keeping SEV2 open until fully green.' }],
    discussion: [{ id: 'd1', authorId: 'aisha', at: '9:00 AM', body: 'Origin traffic rebalanced. Watching P95 on the dashboard.' }],
  },
  {
    id: 'INC-1040', title: 'Delayed webhook processing', severity: 'SEV2', status: 'Monitoring',
    serviceIds: ['webhook-processor'], commanderId: 'aisha', responderIds: ['james'],
    startedAt: '2026-09-08T07:02:00', startedLabel: 'Today at 7:02 AM', durationLabel: '4h 42m',
    customerImpact: 'Webhook deliveries delayed up to 25 minutes. Queue depth peaked above 50k events.',
    description: 'Consumer lag after a poison message stalled one partition. Consumer restarted with skip rule; monitoring drain rate.',
    alertIds: ['ALT-908', 'ALT-909'], deployIds: ['dep-09'],
    timeline: [
      { id: 't1', at: '7:02 AM', clock: '7:02', kind: 'alert', title: 'Worker queue depth above 50k.', body: 'webhook-processor consumer lag growing.' },
      { id: 't2', at: '7:20 AM', clock: '7:20', kind: 'update', author: 'Aisha Khan', title: 'Poison message identified on partition 6.', body: 'Skipped with dead-letter routing; consumers restarted.' },
      { id: 't3', at: '9:30 AM', clock: '9:30', kind: 'status', author: 'Aisha Khan', title: 'Status moved to Monitoring.', body: 'Queue draining steadily.' },
    ],
    tasks: [
      { id: 'task-1', title: 'Verify queue fully drained', ownerId: 'james', done: false },
      { id: 'task-2', title: 'Add schema validation for webhook payloads', ownerId: 'aisha', done: false },
    ],
    updates: [],
    discussion: [{ id: 'd1', authorId: 'james', at: '8:10 AM', body: 'Drain rate looks good, about 2k events per minute.' }],
  },
  {
    id: 'INC-1039', title: 'Authentication failures affecting enterprise customers', severity: 'SEV2', status: 'Identified',
    serviceIds: ['auth-service'], commanderId: 'mei', responderIds: ['tom', 'carlos'],
    startedAt: '2026-09-07T16:44:00', startedLabel: 'Yesterday at 4:44 PM', durationLabel: '19h',
    customerImpact: 'SSO logins failing for 3 enterprise tenants (~1.4% of auth traffic). Password auth unaffected.',
    description: 'SAML assertion validation rejects tokens from one IdP after a certificate rotation. Workaround documented; fix in review.',
    alertIds: ['ALT-906'], deployIds: ['dep-06'],
    timeline: [
      { id: 't1', at: '4:44 PM', clock: '4:44', kind: 'alert', title: 'Authentication error rate anomaly detected.', body: 'Sentry flagged SSO failures for enterprise tenants.' },
      { id: 't2', at: '5:10 PM', clock: '5:10', kind: 'status', author: 'Mei Lin', title: 'Status moved to Identified.', body: 'Expired IdP certificate pinned in config.' },
    ],
    tasks: [
      { id: 'task-1', title: 'Ship certificate refresh fix', ownerId: 'tom', done: false },
      { id: 'task-2', title: 'Notify affected tenants', ownerId: 'mei', done: true },
    ],
    updates: [],
    discussion: [],
  },
  {
    id: 'INC-1038', title: 'Analytics pipeline lag after broker restart', severity: 'SEV3', status: 'Monitoring',
    serviceIds: ['analytics-pipeline'], commanderId: 'raj', responderIds: ['sofia'],
    startedAt: '2026-09-07T11:20:00', startedLabel: 'Yesterday at 11:20 AM', durationLabel: '1d 0h',
    customerImpact: 'Internal dashboards delayed ~40 minutes. No customer impact.',
    description: 'Kafka broker restart caused consumer rebalance storm. Monitoring catch-up.',
    alertIds: ['ALT-911'], deployIds: ['dep-15'],
    timeline: [{ id: 't1', at: '11:20 AM', clock: '11:20', kind: 'system', title: 'Pipeline lag detected.', body: 'Consumer lag above threshold after broker restart.' }],
    tasks: [{ id: 'task-1', title: 'Confirm lag under 5 minutes', ownerId: 'sofia', done: false }],
    updates: [], discussion: [],
  },
  {
    id: 'INC-1035', title: 'Database connection exhaustion on orders cluster', severity: 'SEV1', status: 'Resolved',
    serviceIds: ['order-service'], commanderId: 'raj', responderIds: ['sofia', 'marcus'],
    startedAt: '2026-08-30T02:12:00', startedLabel: 'Aug 30 at 2:12 AM', durationLabel: '2h 5m',
    customerImpact: 'Order creation failed at ~9% for 45 minutes during peak.',
    description: 'Connection pool exhausted after a replica failover. Pool sizing increased and failover logic fixed.',
    alertIds: [], deployIds: [],
    timeline: [
      { id: 't1', at: '2:12 AM', clock: '2:12', kind: 'alert', title: 'PostgreSQL connection pool above 90%.', body: 'Orders cluster primary pool saturated.' },
      { id: 't2', at: '4:17 AM', clock: '4:17', kind: 'status', author: 'Raj Nair', title: 'Incident resolved.', body: 'Pool drained, traffic normal.' },
    ],
    tasks: [
      { id: 'task-1', title: 'Increase pool size', ownerId: 'raj', done: true },
      { id: 'task-2', title: 'Publish postmortem', ownerId: 'sofia', done: true },
    ],
    updates: [], discussion: [],
  },
  {
    id: 'INC-1031', title: 'Payment Gateway outage — elevated declines', severity: 'SEV1', status: 'Resolved',
    serviceIds: ['payment-gateway', 'checkout-api'], commanderId: 'sarah', responderIds: ['marcus', 'priya', 'elena'],
    startedAt: '2026-08-28T14:05:00', startedLabel: 'Aug 28 at 2:05 PM', durationLabel: '1h 48m',
    customerImpact: 'Card payments declined at 34% for 62 minutes. $412k of attempted volume affected.',
    description: 'Token vault failover misconfigured; resolved by redirecting to secondary vault and fixing health checks.',
    alertIds: [], deployIds: [],
    timeline: [
      { id: 't1', at: '2:05 PM', clock: '2:05', kind: 'alert', title: 'Payment API error rate spiked.', body: 'Declines above 30% within minutes.' },
      { id: 't2', at: '3:53 PM', clock: '3:53', kind: 'status', author: 'Sarah Chen', title: 'Incident resolved.', body: 'Declines back under 0.4%.' },
    ],
    tasks: [
      { id: 'task-1', title: 'Fail over to secondary vault', ownerId: 'marcus', done: true },
      { id: 'task-2', title: 'Fix vault health checks', ownerId: 'priya', done: true },
    ],
    updates: [], discussion: [],
  },
  {
    id: 'INC-1029', title: 'Authentication latency spike', severity: 'SEV2', status: 'Resolved',
    serviceIds: ['auth-service'], commanderId: 'mei', responderIds: ['tom'],
    startedAt: '2026-08-17T09:40:00', startedLabel: 'Aug 17 at 9:40 AM', durationLabel: '3h 10m',
    customerImpact: 'Login P95 above 2s for 2 hours. 0.3% of logins timed out.',
    description: 'Redis cache stampede after a cold restart. Resolved with request coalescing.',
    alertIds: [], deployIds: [],
    timeline: [{ id: 't1', at: '9:40 AM', clock: '9:40', kind: 'alert', title: 'Auth latency above 2s P95.', body: 'Cache hit ratio collapsed after restart.' }],
    tasks: [{ id: 'task-1', title: 'Enable request coalescing', ownerId: 'tom', done: true }],
    updates: [], discussion: [],
  },
  {
    id: 'INC-1024', title: 'Webhook delivery delays', severity: 'SEV3', status: 'Resolved',
    serviceIds: ['webhook-processor'], commanderId: 'david', responderIds: ['james'],
    startedAt: '2026-08-04T13:15:00', startedLabel: 'Aug 4 at 1:15 PM', durationLabel: '5h 20m',
    customerImpact: 'Deliveries delayed up to 2 hours for one region.',
    description: 'DNS resolution failures in one AZ. Mitigated by shifting traffic.',
    alertIds: [], deployIds: [],
    timeline: [{ id: 't1', at: '1:15 PM', clock: '1:15', kind: 'alert', title: 'Webhook delivery failure rate elevated.', body: 'One AZ affected.' }],
    tasks: [{ id: 'task-1', title: 'Shift traffic to healthy AZ', ownerId: 'james', done: true }],
    updates: [], discussion: [],
  },
  {
    id: 'INC-1019', title: 'Database connection exhaustion — analytics replica', severity: 'SEV2', status: 'Resolved',
    serviceIds: ['analytics-pipeline'], commanderId: 'raj', responderIds: ['sofia'],
    startedAt: '2026-07-22T10:00:00', startedLabel: 'Jul 22 at 10:00 AM', durationLabel: '4h 02m',
    customerImpact: 'Analytics exports delayed; no customer-facing impact.',
    description: 'Runaway query held 400 connections. Killed and added statement timeouts.',
    alertIds: [], deployIds: [],
    timeline: [{ id: 't1', at: '10:00 AM', clock: '10:00', kind: 'alert', title: 'Connection pool saturation on analytics replica.', body: 'Runaway query identified.' }],
    tasks: [{ id: 'task-1', title: 'Add statement timeouts', ownerId: 'raj', done: true }],
    updates: [], discussion: [],
  },
];

export const incidentById: Record<string, Incident> = Object.fromEntries(incidents.map((i) => [i.id, i]));

/* ---------------- Alerts ---------------- */

export const alerts: Alert[] = [
  { id: 'ALT-901', name: 'Checkout error rate > 10%', serviceId: 'checkout-api', severity: 'SEV1', source: 'Datadog', state: 'Firing', triggeredAt: '2026-09-08T10:32:00', triggeredLabel: '10:32 AM', durationLabel: '1h 12m', assigneeId: 'priya', incidentId: 'INC-1042', value: '8.7% error rate' },
  { id: 'ALT-902', name: 'Payment API P95 latency > 2s', serviceId: 'checkout-api', severity: 'SEV1', source: 'Grafana', state: 'Firing', triggeredAt: '2026-09-08T10:35:00', triggeredLabel: '10:35 AM', durationLabel: '1h 9m', assigneeId: 'marcus', incidentId: 'INC-1042', value: 'P95 2.31s' },
  { id: 'ALT-903', name: 'Payment gateway 5xx spike', serviceId: 'payment-gateway', severity: 'SEV1', source: 'Datadog', state: 'Firing', triggeredAt: '2026-09-08T10:33:00', triggeredLabel: '10:33 AM', durationLabel: '1h 11m', assigneeId: 'elena', incidentId: 'INC-1042', value: '11.2% 5xx' },
  { id: 'ALT-904', name: 'Gateway config checksum mismatch', serviceId: 'payment-gateway', severity: 'SEV2', source: 'Custom', state: 'Acknowledged', triggeredAt: '2026-09-08T10:53:00', triggeredLabel: '10:53 AM', durationLabel: '51m', assigneeId: 'elena', incidentId: 'INC-1042', value: '2/24 instances diverged' },
  { id: 'ALT-905', name: 'Order creation failure rate', serviceId: 'order-service', severity: 'SEV2', source: 'Sentry', state: 'Firing', triggeredAt: '2026-09-08T10:41:00', triggeredLabel: '10:41 AM', durationLabel: '1h 3m', assigneeId: 'liam', incidentId: 'INC-1042', value: '2.1% failures' },
  { id: 'ALT-906', name: 'Authentication error rate anomaly', serviceId: 'auth-service', severity: 'SEV2', source: 'Sentry', state: 'Acknowledged', triggeredAt: '2026-09-07T16:44:00', triggeredLabel: 'Yesterday 4:44 PM', durationLabel: '19h', assigneeId: 'tom', incidentId: 'INC-1039', value: '1.4% SSO failures' },
  { id: 'ALT-907', name: 'Notification queue growing', serviceId: 'notification-service', severity: 'SEV3', source: 'CloudWatch', state: 'Firing', triggeredAt: '2026-09-08T09:12:00', triggeredLabel: '9:12 AM', durationLabel: '1h 32m', value: '12k queued' },
  { id: 'ALT-908', name: 'Worker queue depth > 50k', serviceId: 'webhook-processor', severity: 'SEV2', source: 'Grafana', state: 'Firing', triggeredAt: '2026-09-08T07:02:00', triggeredLabel: '7:02 AM', durationLabel: '4h 42m', assigneeId: 'james', incidentId: 'INC-1040', value: '48k queued' },
  { id: 'ALT-909', name: 'Webhook delivery failure rate', serviceId: 'webhook-processor', severity: 'SEV2', source: 'Datadog', state: 'Acknowledged', triggeredAt: '2026-09-08T07:20:00', triggeredLabel: '7:20 AM', durationLabel: '4h 24m', assigneeId: 'aisha', incidentId: 'INC-1040', value: '3.4% failing' },
  { id: 'ALT-910', name: 'API gateway P95 latency', serviceId: 'api-gateway', severity: 'SEV2', source: 'Grafana', state: 'Acknowledged', triggeredAt: '2026-09-08T08:15:00', triggeredLabel: '8:15 AM', durationLabel: '3h 29m', assigneeId: 'aisha', incidentId: 'INC-1041', value: 'P95 640ms' },
  { id: 'ALT-911', name: 'Analytics consumer lag', serviceId: 'analytics-pipeline', severity: 'SEV3', source: 'Grafana', state: 'Firing', triggeredAt: '2026-09-07T11:20:00', triggeredLabel: 'Yesterday 11:20 AM', durationLabel: '1d', assigneeId: 'sofia', incidentId: 'INC-1038', value: '40 min lag' },
  { id: 'ALT-912', name: 'Redis memory utilization > 85%', serviceId: 'analytics-pipeline', severity: 'SEV3', source: 'CloudWatch', state: 'Firing', triggeredAt: '2026-09-08T06:30:00', triggeredLabel: '6:30 AM', durationLabel: '5h 14m', value: '87% used' },
  { id: 'ALT-913', name: 'PostgreSQL connection pool > 90%', serviceId: 'order-service', severity: 'SEV2', source: 'Datadog', state: 'Firing', triggeredAt: '2026-09-08T10:50:00', triggeredLabel: '10:50 AM', durationLabel: '54m', value: '91% pooled' },
  { id: 'ALT-914', name: 'Checkout synthetic check failing', serviceId: 'checkout-api', severity: 'SEV2', source: 'Custom', state: 'Firing', triggeredAt: '2026-09-08T10:38:00', triggeredLabel: '10:38 AM', durationLabel: '1h 6m', incidentId: 'INC-1042', value: '3/5 regions failing' },
  { id: 'ALT-915', name: 'TLS cert expires in 7 days', serviceId: 'api-gateway', severity: 'SEV3', source: 'Custom', state: 'Firing', triggeredAt: '2026-09-07T09:00:00', triggeredLabel: 'Yesterday 9:00 AM', durationLabel: '1d 2h', assigneeId: 'david', value: 'payments edge cert' },
  { id: 'ALT-916', name: 'Search index lag growing', serviceId: 'search-service', severity: 'SEV3', source: 'Grafana', state: 'Resolved', triggeredAt: '2026-09-07T14:00:00', triggeredLabel: 'Yesterday 2:00 PM', durationLabel: '2h', value: 'recovered' },
  { id: 'ALT-917', name: 'Billing reconciliation drift', serviceId: 'billing-service', severity: 'SEV3', source: 'Custom', state: 'Acknowledged', triggeredAt: '2026-09-08T08:50:00', triggeredLabel: '8:50 AM', durationLabel: '2h 54m', assigneeId: 'noah', value: '0.02% drift' },
  { id: 'ALT-918', name: 'Inventory sync delayed', serviceId: 'inventory-service', severity: 'SEV3', source: 'CloudWatch', state: 'Resolved', triggeredAt: '2026-09-07T18:00:00', triggeredLabel: 'Yesterday 6:00 PM', durationLabel: '1h', value: 'recovered' },
  { id: 'ALT-919', name: 'Notification SES bounce rate', serviceId: 'notification-service', severity: 'SEV3', source: 'CloudWatch', state: 'Firing', triggeredAt: '2026-09-08T10:05:00', triggeredLabel: '10:05 AM', durationLabel: '1h 39m', value: '4.1% bounces' },
  { id: 'ALT-920', name: 'User service error budget burn', serviceId: 'user-service', severity: 'SEV3', source: 'Grafana', state: 'Firing', triggeredAt: '2026-09-08T09:40:00', triggeredLabel: '9:40 AM', durationLabel: '2h 4m', value: '2x burn rate' },
  { id: 'ALT-921', name: 'Notification delivery backlog growing', serviceId: 'notification-service', severity: 'SEV3', source: 'CloudWatch', state: 'Firing', triggeredAt: '2026-09-08T10:20:00', triggeredLabel: '10:20 AM', durationLabel: '1h 24m', value: '9k queued' },
  { id: 'ALT-922', name: 'API gateway 5xx rate rising', serviceId: 'api-gateway', severity: 'SEV2', source: 'Datadog', state: 'Firing', triggeredAt: '2026-09-08T11:05:00', triggeredLabel: '11:05 AM', durationLabel: '39m', assigneeId: 'aisha', incidentId: 'INC-1041', value: '0.9% 5xx' },
  { id: 'ALT-923', name: 'Order DB replica lag', serviceId: 'order-service', severity: 'SEV3', source: 'CloudWatch', state: 'Firing', triggeredAt: '2026-09-08T10:12:00', triggeredLabel: '10:12 AM', durationLabel: '1h 32m', value: '12s lag' },
  { id: 'ALT-924', name: 'SSO login failure spike', serviceId: 'auth-service', severity: 'SEV2', source: 'Sentry', state: 'Firing', triggeredAt: '2026-09-08T11:20:00', triggeredLabel: '11:20 AM', durationLabel: '24m', assigneeId: 'carlos', incidentId: 'INC-1039', value: '2.1% failures' },
];

/* ---------------- Deployments ---------------- */

export const deployments: Deployment[] = [
  { id: 'dep-01', serviceId: 'payment-gateway', version: 'payment-gateway@4.18.2', commit: 'a91f3c2', env: 'Production', authorId: 'marcus', at: '2026-09-08T10:27:00', atLabel: 'Today 10:27 AM', status: 'Rolled back', pr: '#4821', incidentId: 'INC-1042', note: 'New payment routing table format — suspected trigger of INC-1042' },
  { id: 'dep-02', serviceId: 'payment-gateway', version: 'payment-gateway@4.18.1', commit: '7d2b8e4', env: 'Production', authorId: 'marcus', at: '2026-09-08T10:43:00', atLabel: 'Today 10:43 AM', status: 'Successful', pr: '#4824 rollback', incidentId: 'INC-1042', note: 'Emergency rollback for INC-1042' },
  { id: 'dep-14', serviceId: 'checkout-api', version: 'checkout-api@2.44.0', commit: 'c41ad90', env: 'Production', authorId: 'elena', at: '2026-09-08T09:58:00', atLabel: 'Today 9:58 AM', status: 'Successful', pr: '#3910', incidentId: 'INC-1042', note: 'Running during INC-1042 window — cleared as cause' },
  { id: 'dep-03', serviceId: 'checkout-api', version: 'checkout-api@2.44.1', commit: 'e77f1a2', env: 'Staging', authorId: 'liam', at: '2026-09-08T11:02:00', atLabel: 'Today 11:02 AM', status: 'Rolling out', pr: '#3912' },
  { id: 'dep-04', serviceId: 'auth-service', version: 'auth-service@1.92.3', commit: 'b30c77d', env: 'Production', authorId: 'tom', at: '2026-09-08T10:58:00', atLabel: 'Today 10:58 AM', status: 'Failed', pr: '#2204', note: 'Failed: migration lock timeout — retry scheduled' },
  { id: 'dep-05', serviceId: 'order-service', version: 'order-service@3.10.0', commit: '9f0e2b1', env: 'Production', authorId: 'noah', at: '2026-09-07T16:20:00', atLabel: 'Yesterday 4:20 PM', status: 'Successful', pr: '#1177' },
  { id: 'dep-06', serviceId: 'auth-service', version: 'auth-service@1.92.2', commit: '41ac9d0', env: 'Production', authorId: 'tom', at: '2026-09-07T15:30:00', atLabel: 'Yesterday 3:30 PM', status: 'Successful', pr: '#2198', incidentId: 'INC-1039', note: 'Carried the IdP certificate rotation linked to INC-1039' },
  { id: 'dep-07', serviceId: 'user-service', version: 'user-service@5.3.1', commit: 'd2e91aa', env: 'Production', authorId: 'carlos', at: '2026-09-06T11:00:00', atLabel: 'Sep 6, 11:00 AM', status: 'Successful', pr: '#882' },
  { id: 'dep-08', serviceId: 'notification-service', version: 'notifications@0.98.4', commit: '6b1c4f3', env: 'Production', authorId: 'david', at: '2026-09-05T14:12:00', atLabel: 'Sep 5, 2:12 PM', status: 'Successful', pr: '#1503' },
  { id: 'dep-09', serviceId: 'webhook-processor', version: 'webhooks@1.31.0', commit: 'aa94e20', env: 'Production', authorId: 'james', at: '2026-09-07T06:40:00', atLabel: 'Sep 7, 6:40 AM', status: 'Successful', pr: '#990', incidentId: 'INC-1040', note: 'New partition assignment preceded queue buildup' },
  { id: 'dep-10', serviceId: 'billing-service', version: 'billing@7.2.0', commit: 'f00d1c9', env: 'Production', authorId: 'noah', at: '2026-09-04T10:00:00', atLabel: 'Sep 4, 10:00 AM', status: 'Successful', pr: '#2041' },
  { id: 'dep-11', serviceId: 'api-gateway', version: 'api-gateway@9.14.2', commit: '12bc88e', env: 'Production', authorId: 'aisha', at: '2026-09-08T07:55:00', atLabel: 'Today 7:55 AM', status: 'Successful', pr: '#771', incidentId: 'INC-1041', note: 'Origin weight change linked to latency rise' },
  { id: 'dep-12', serviceId: 'search-service', version: 'search@2.7.5', commit: '77aa10c', env: 'Production', authorId: 'james', at: '2026-09-03T09:30:00', atLabel: 'Sep 3, 9:30 AM', status: 'Successful', pr: '#455' },
  { id: 'dep-13', serviceId: 'inventory-service', version: 'inventory@4.1.0', commit: '90cd3e7', env: 'Staging', authorId: 'carlos', at: '2026-09-08T08:20:00', atLabel: 'Today 8:20 AM', status: 'Successful', pr: '#612' },
  { id: 'dep-15', serviceId: 'analytics-pipeline', version: 'analytics@6.0.2', commit: 'beef412', env: 'Production', authorId: 'raj', at: '2026-09-07T10:50:00', atLabel: 'Sep 7, 10:50 AM', status: 'Successful', pr: '#331', incidentId: 'INC-1038' },
];

/* ---------------- Postmortems ---------------- */

export const postmortems: Postmortem[] = [
  {
    id: 'pm-01', title: 'Payment Gateway Outage — August 28', incidentId: 'INC-1031', severity: 'SEV1', ownerId: 'sarah',
    status: 'Published', createdAt: 'Sep 2, 2026',
    summary: 'On August 28 at 2:05 PM, card payments began declining at 34% after the token vault primary became unreachable and traffic failed to shift to the secondary. The outage lasted 62 minutes and affected approximately $412k of attempted payment volume before traffic was manually redirected.',
    impact: '34% of card payments declined for 62 minutes. Enterprise merchants in checkout saw the highest failure share. No duplicate charges or data loss occurred; all failed attempts are safe to retry.',
    detection: 'Detected by the payment-error-rate monitor (Datadog) within 4 minutes, and paged to Payments on-call. Customer reports arrived 11 minutes later via support.',
    timeline: [
      { at: '2:05 PM', text: 'Token vault primary latency spikes; declines begin climbing.' },
      { at: '2:09 PM', text: 'Monitor pages Payments on-call; SEV1 declared at 2:12 PM.' },
      { at: '2:21 PM', text: 'Vault failover attempted automatically but health check pinned traffic to primary.' },
      { at: '2:47 PM', text: 'Manual redirect to secondary vault; declines start falling.' },
      { at: '3:07 PM', text: 'Declines under 1%; monitoring begins.' },
      { at: '3:53 PM', text: 'Incident resolved after 30 minutes of clean metrics.' },
    ],
    rootCause: 'The vault client health check evaluated the primary as healthy based on TCP reachability while the TLS session layer was failing. Failover logic trusted the stale health signal, so traffic never shifted to the secondary vault.',
    resolution: 'Traffic was manually redirected to the secondary vault and the health check was rewritten to perform an authenticated ping. A canary for vault failover now runs hourly.',
    wentWell: ['Detection fired within 4 minutes with an accurate runbook link.', 'Incident command was established quickly and comms went out on time.', 'No data integrity issues; idempotency keys held.'],
    wentPoorly: ['Automatic failover silently did nothing for 40 minutes.', 'Health check signal was misleading — dashboard showed green during the outage.', 'Enterprise status page lagged internal comms by 20 minutes.'],
    lessons: ['Health checks must test the real operation (authenticated request), not just socket reachability.', 'Failover paths need continuous canary validation, not just unit tests.', 'Status page publishing should be a one-click step in the incident role checklist.'],
    actions: [
      { id: 'ca-1', title: 'Rewrite vault health check as authenticated ping', ownerId: 'priya', priority: 'P0', due: 'Sep 12', status: 'Done' },
      { id: 'ca-2', title: 'Add hourly vault failover canary', ownerId: 'marcus', priority: 'P0', due: 'Sep 19', status: 'In progress' },
      { id: 'ca-3', title: 'One-click status page publish from incident view', ownerId: 'liam', priority: 'P1', due: 'Sep 26', status: 'Open' },
      { id: 'ca-4', title: 'Vault failover game-day exercise', ownerId: 'sarah', priority: 'P1', due: 'Oct 3', status: 'Open' },
    ],
  },
  {
    id: 'pm-02', title: 'Authentication Latency Incident — August 17', incidentId: 'INC-1029', severity: 'SEV2', ownerId: 'mei',
    status: 'Published', createdAt: 'Aug 22, 2026',
    summary: 'Login P95 latency exceeded 2 seconds for two hours after a Redis cold restart caused a cache stampede. Request coalescing and a staged warmup procedure resolved it.',
    impact: 'Login P95 above 2s for 2 hours; 0.3% of logins timed out. SSO and password flows both affected.',
    detection: 'Grafana latency monitor paged Core API on-call within 6 minutes.',
    timeline: [
      { at: '9:40 AM', text: 'Redis restart for patching; cache hit ratio collapses.' },
      { at: '9:46 AM', text: 'SEV2 declared; traffic shedding considered.' },
      { at: '11:50 AM', text: 'Request coalescing deployed; latency recovering.' },
      { at: '12:50 PM', text: 'Resolved.' },
    ],
    rootCause: 'Cold cache plus thundering-herd reads against the user store after a full Redis restart.',
    resolution: 'Deployed single-flight request coalescing and documented staged cache warmup.',
    wentWell: ['Fast declaration and clean handoff between responders.', 'Coalescing fix was already prototyped and shipped quickly.'],
    wentPoorly: ['Restart runbook did not mention stampede risk.', 'No cache-warm step existed for the auth cluster.'],
    lessons: ['Cache restarts need warmup procedures for critical paths.', 'Coalescing should be default for identity reads.'],
    actions: [
      { id: 'ca-1', title: 'Enable coalescing on all identity reads', ownerId: 'tom', priority: 'P0', due: 'Aug 30', status: 'Done' },
      { id: 'ca-2', title: 'Add staged warmup to Redis runbook', ownerId: 'carlos', priority: 'P1', due: 'Sep 5', status: 'Done' },
    ],
  },
  {
    id: 'pm-03', title: 'Webhook Delivery Delays — August 4', incidentId: 'INC-1024', severity: 'SEV3', ownerId: 'david',
    status: 'In review', createdAt: 'Aug 9, 2026',
    summary: 'DNS resolution failures in one availability zone delayed webhook deliveries up to two hours. Traffic was shifted to healthy zones.',
    impact: 'One region saw delivery delays up to 2 hours. Retries succeeded; no events lost.',
    detection: 'Consumer lag monitor fired 18 minutes after onset.',
    timeline: [
      { at: '1:15 PM', text: 'Delivery failures begin in us-east-1a.' },
      { at: '1:33 PM', text: 'SEV3 declared.' },
      { at: '4:10 PM', text: 'Traffic shifted; backlog draining.' },
      { at: '6:35 PM', text: 'Resolved.' },
    ],
    rootCause: 'Misconfigured DNS resolver in one AZ after a node image upgrade.',
    resolution: 'Pinned resolver config and added per-AZ delivery success alerting.',
    wentWell: ['No event loss thanks to durable queueing.', 'Shift procedure worked as documented.'],
    wentPoorly: ['Detection took 18 minutes — too slow for a delivery path.', 'Per-AZ visibility was missing.'],
    lessons: ['Delivery paths need per-AZ success signals.', 'Image upgrades need resolver config assertions.'],
    actions: [
      { id: 'ca-1', title: 'Add per-AZ delivery success alerts', ownerId: 'james', priority: 'P1', due: 'Sep 15', status: 'In progress' },
      { id: 'ca-2', title: 'Pin resolver config in node image', ownerId: 'aisha', priority: 'P1', due: 'Sep 20', status: 'Open' },
    ],
  },
  {
    id: 'pm-04', title: 'Database Connection Exhaustion — July 22', incidentId: 'INC-1019', severity: 'SEV2', ownerId: 'raj',
    status: 'Draft', createdAt: 'Aug 1, 2026',
    summary: 'A runaway analytics query held 400 connections on the replica, starving exports. The query was killed and statement timeouts were introduced.',
    impact: 'Analytics exports delayed by hours. No customer-facing impact.',
    detection: 'Pool saturation alert fired within 2 minutes.',
    timeline: [
      { at: '10:00 AM', text: 'Pool saturation alert fires.' },
      { at: '10:12 AM', text: 'Runaway query identified and killed.' },
      { at: '2:02 PM', text: 'Exports caught up; resolved.' },
    ],
    rootCause: 'Ad-hoc query without a statement timeout held hundreds of connections.',
    resolution: 'Enforced statement timeouts and per-role connection limits.',
    wentWell: ['Detection was immediate and diagnosis was fast.'],
    wentPoorly: ['No guardrails on ad-hoc query cost.', 'Draft postmortem sat for a week before review.'],
    lessons: ['Guardrails beat runbooks for expensive shared resources.'],
    actions: [
      { id: 'ca-1', title: 'Enforce statement timeouts by default', ownerId: 'raj', priority: 'P0', due: 'Aug 10', status: 'Done' },
      { id: 'ca-2', title: 'Add per-role connection limits', ownerId: 'sofia', priority: 'P1', due: 'Sep 12', status: 'In progress' },
    ],
  },
];

/* ---------------- On-call ---------------- */

export const onCall: { teamId: string; primaryId: string; secondaryId: string; shiftLabel: string; since: string; nextId: string }[] = [
  { teamId: 'payments', primaryId: 'priya', secondaryId: 'marcus', shiftLabel: 'Mon 9:00 AM – Mon 9:00 AM (weekly)', since: 'Yesterday 9:00 AM', nextId: 'elena' },
  { teamId: 'platform', primaryId: 'aisha', secondaryId: 'david', shiftLabel: 'Mon 9:00 AM – Mon 9:00 AM (weekly)', since: 'Yesterday 9:00 AM', nextId: 'david' },
  { teamId: 'core-api', primaryId: 'tom', secondaryId: 'carlos', shiftLabel: 'Mon 9:00 AM – Mon 9:00 AM (weekly)', since: 'Yesterday 9:00 AM', nextId: 'mei' },
  { teamId: 'infrastructure', primaryId: 'raj', secondaryId: 'sofia', shiftLabel: 'Mon 9:00 AM – Mon 9:00 AM (weekly)', since: 'Yesterday 9:00 AM', nextId: 'sofia' },
  { teamId: 'developer-experience', primaryId: 'james', secondaryId: 'anna', shiftLabel: 'Mon 9:00 AM – Mon 9:00 AM (weekly)', since: 'Yesterday 9:00 AM', nextId: 'anna' },
];

export const weekSchedule: DeploymentWindow[] = [
  { id: 'w1', teamId: 'payments', personId: 'priya', role: 'Primary', start: 'Mon 9a', end: 'Mon 9a', day: 'Mon Sep 7 – Mon Sep 14' },
  { id: 'w2', teamId: 'payments', personId: 'marcus', role: 'Secondary', start: 'Mon 9a', end: 'Mon 9a', day: 'Mon Sep 7 – Mon Sep 14' },
  { id: 'w3', teamId: 'platform', personId: 'aisha', role: 'Primary', start: 'Mon 9a', end: 'Mon 9a', day: 'Mon Sep 7 – Mon Sep 14' },
  { id: 'w4', teamId: 'core-api', personId: 'tom', role: 'Primary', start: 'Mon 9a', end: 'Mon 9a', day: 'Mon Sep 7 – Mon Sep 14' },
  { id: 'w5', teamId: 'infrastructure', personId: 'raj', role: 'Primary', start: 'Mon 9a', end: 'Mon 9a', day: 'Mon Sep 7 – Mon Sep 14' },
];

export const escalationSteps: Record<string, string[]> = {
  payments: ['Page primary (Priya Patel) — 0 min', 'Page secondary (Marcus Johnson) — 5 min', 'Escalate to Engineering Manager (Sarah Chen) — 15 min', 'Escalate to VP Engineering — 30 min'],
  platform: ['Page primary (Aisha Khan) — 0 min', 'Page secondary (David Kim) — 5 min', 'Escalate to Staff Engineer — 15 min', 'Escalate to VP Engineering — 30 min'],
  'core-api': ['Page primary (Tom Becker) — 0 min', 'Page secondary (Carlos Mendez) — 5 min', 'Escalate to Engineering Manager (Mei Lin) — 15 min'],
  infrastructure: ['Page primary (Raj Nair) — 0 min', 'Page secondary (Sofia Marino) — 5 min', 'Escalate to VP Engineering — 20 min'],
  'developer-experience': ['Page primary (James Okafor) — 0 min', 'Page secondary (Anna Petrova) — 10 min', 'Escalate to Engineering Manager — 20 min'],
};

/* ---------------- Notifications ---------------- */

export const notifications: AppNotification[] = [
  { id: 'n1', text: 'You were added to INC-1042.', detail: 'Sarah Chen added you as a responder · 10:36 AM', at: '10:36 AM', read: false, tone: 'incident', link: '/incidents/INC-1042' },
  { id: 'n2', text: 'SEV1 alert triggered for Checkout API.', detail: 'Checkout error rate > 10% · 10:32 AM', at: '10:32 AM', read: false, tone: 'alert', link: '/alerts' },
  { id: 'n3', text: 'Payment Gateway deployment failed.', detail: 'auth-service@1.92.3 migration lock timeout · 10:58 AM', at: '10:58 AM', read: false, tone: 'deploy', link: '/deployments' },
  { id: 'n4', text: 'Sarah Chen mentioned you in INC-1038.', detail: '"Can you confirm analytics lag is internal only?" · 9:12 AM', at: '9:12 AM', read: false, tone: 'mention', link: '/incidents/INC-1038' },
  { id: 'n5', text: 'You are on call in 30 minutes.', detail: 'Payments secondary rotation · starts 12:00 PM', at: '11:30 AM', read: true, tone: 'oncall', link: '/on-call' },
  { id: 'n6', text: 'Postmortem action item is due tomorrow.', detail: 'Vault failover canary — Marcus Johnson · due Sep 19', at: '8:00 AM', read: true, tone: 'task', link: '/postmortems/pm-01' },
];

/* ---------------- Analytics seed ---------------- */

export const analyticsByRange: Record<string, {
  incidents: number[]; mttr: number[]; mtta: number[]; reliability: number[];
  sevMix: { label: Severity; value: number }[];
  noisyServices: { name: string; alerts: number }[];
  incidentProne: { name: string; count: number }[];
}> = {
  '7d': {
    incidents: [1, 0, 2, 1, 0, 3, 4], mttr: [38, 44, 41, 52, 47, 55, 58], mtta: [4, 5, 4, 6, 5, 6, 7], reliability: [99.99, 99.98, 99.97, 99.96, 99.98, 99.93, 99.91],
    sevMix: [{ label: 'SEV1', value: 2 }, { label: 'SEV2', value: 5 }, { label: 'SEV3', value: 4 }],
    noisyServices: [{ name: 'Payment Gateway', alerts: 24 }, { name: 'Checkout API', alerts: 19 }, { name: 'Webhook Processor', alerts: 14 }, { name: 'API Gateway', alerts: 11 }, { name: 'Analytics Pipeline', alerts: 9 }],
    incidentProne: [{ name: 'Payment Gateway', count: 3 }, { name: 'Checkout API', count: 2 }, { name: 'Auth Service', count: 2 }, { name: 'Webhooks', count: 1 }],
  },
  '30d': {
    incidents: [2, 1, 3, 2, 4, 1, 2, 3, 1, 4, 2, 5], mttr: [52, 48, 55, 44, 61, 49, 53, 57, 46, 50, 58, 54], mtta: [6, 5, 7, 5, 8, 6, 6, 7, 5, 6, 7, 6], reliability: [99.98, 99.97, 99.96, 99.98, 99.95, 99.97, 99.96, 99.95, 99.98, 99.94, 99.93, 99.91],
    sevMix: [{ label: 'SEV1', value: 4 }, { label: 'SEV2', value: 11 }, { label: 'SEV3', value: 9 }],
    noisyServices: [{ name: 'Payment Gateway', alerts: 61 }, { name: 'Checkout API', alerts: 48 }, { name: 'Webhook Processor', alerts: 37 }, { name: 'Auth Service', alerts: 29 }, { name: 'API Gateway', alerts: 22 }],
    incidentProne: [{ name: 'Payment Gateway', count: 5 }, { name: 'Checkout API', count: 4 }, { name: 'Auth Service', count: 3 }, { name: 'Order Service', count: 2 }],
  },
  '90d': {
    incidents: [3, 5, 2, 4, 6, 3, 5, 4, 2, 6, 4, 5], mttr: [61, 55, 58, 49, 63, 57, 52, 59, 54, 60, 56, 58], mtta: [7, 6, 8, 6, 9, 7, 7, 8, 6, 7, 8, 7], reliability: [99.97, 99.95, 99.98, 99.96, 99.94, 99.97, 99.96, 99.95, 99.97, 99.94, 99.93, 99.9],
    sevMix: [{ label: 'SEV1', value: 7 }, { label: 'SEV2', value: 21 }, { label: 'SEV3', value: 17 }],
    noisyServices: [{ name: 'Payment Gateway', alerts: 132 }, { name: 'Webhook Processor', alerts: 98 }, { name: 'Checkout API', alerts: 91 }, { name: 'Auth Service', alerts: 74 }, { name: 'Analytics Pipeline', alerts: 60 }],
    incidentProne: [{ name: 'Payment Gateway', count: 9 }, { name: 'Webhook Processor', count: 7 }, { name: 'Checkout API', count: 6 }, { name: 'Auth Service', count: 5 }],
  },
  '6m': {
    incidents: [4, 6, 5, 7, 5, 8, 6, 9, 7, 8, 10, 9], mttr: [64, 60, 66, 58, 62, 59, 61, 57, 63, 60, 58, 56], mtta: [8, 7, 9, 7, 8, 9, 8, 7, 9, 8, 7, 7], reliability: [99.96, 99.95, 99.94, 99.93, 99.95, 99.92, 99.94, 99.95, 99.93, 99.92, 99.91, 99.9],
    sevMix: [{ label: 'SEV1', value: 11 }, { label: 'SEV2', value: 34 }, { label: 'SEV3', value: 39 }],
    noisyServices: [{ name: 'Payment Gateway', alerts: 240 }, { name: 'Webhook Processor', alerts: 181 }, { name: 'Checkout API', alerts: 169 }, { name: 'Auth Service', alerts: 140 }, { name: 'Analytics Pipeline', alerts: 118 }],
    incidentProne: [{ name: 'Payment Gateway', count: 14 }, { name: 'Checkout API', count: 11 }, { name: 'Webhook Processor', count: 10 }, { name: 'Auth Service', count: 9 }],
  },
};
