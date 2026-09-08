export type Severity = 'SEV0' | 'SEV1' | 'SEV2' | 'SEV3'
export type IncidentStatus =
  | 'Investigating'
  | 'Identified'
  | 'Monitoring'
  | 'Resolved'
export type Health = 'Critical' | 'Degraded' | 'Healthy' | 'Maintenance'

export interface Person {
  name: string
  initials: string
  role: string
  email: string
  tone: 'violet' | 'blue' | 'green' | 'amber' | 'rose' | 'slate'
}

export interface Incident {
  id: string
  title: string
  severity: Severity
  status: IncidentStatus
  services: string[]
  commander: string
  created: string
  duration: string
  responders: string[]
  impact: string
}

export interface Alert {
  id: string
  name: string
  service: string
  severity: 'Critical' | 'High' | 'Medium' | 'Low'
  source: string
  state: 'Firing' | 'Acknowledged' | 'Resolved'
  triggered: string
  duration: string
  assignee: string
  incident?: string
}

export interface Service {
  name: string
  slug: string
  owner: string
  tier: 'Tier 1' | 'Tier 2' | 'Tier 3'
  health: Health
  uptime: string
  incidents: number
  alerts: number
  deployment: string
  technology: string
  repository: string
}

export interface Deployment {
  id: string
  service: string
  version: string
  commit: string
  environment: 'Production' | 'Staging'
  author: string
  timestamp: string
  status: 'Successful' | 'Failed' | 'Rolling out' | 'Rolled back'
  pullRequest: string
  incident?: string
}

export interface Team {
  name: string
  slug: string
  lead: string
  members: number
  services: string[]
  onCall: string
  openIncidents: number
  reliability: string
}

export interface Postmortem {
  id: string
  title: string
  incident: string
  severity: Severity
  owner: string
  status: 'Draft' | 'In review' | 'Published'
  created: string
  progress: number
}

export const people: Person[] = [
  { name: 'Sarah Chen', initials: 'SC', role: 'Engineering Manager', email: 'sarah.chen@northstar.dev', tone: 'violet' },
  { name: 'Marcus Johnson', initials: 'MJ', role: 'Senior Software Engineer', email: 'marcus.johnson@northstar.dev', tone: 'blue' },
  { name: 'Priya Patel', initials: 'PP', role: 'Site Reliability Engineer', email: 'priya.patel@northstar.dev', tone: 'green' },
  { name: 'Liam Brooks', initials: 'LB', role: 'Software Engineer', email: 'liam.brooks@northstar.dev', tone: 'amber' },
  { name: 'Elena Rodriguez', initials: 'ER', role: 'Senior Software Engineer', email: 'elena.rodriguez@northstar.dev', tone: 'rose' },
  { name: 'Noah Williams', initials: 'NW', role: 'Software Engineer', email: 'noah.williams@northstar.dev', tone: 'slate' },
  { name: 'Alex Morgan', initials: 'AM', role: 'VP Engineering', email: 'alex.morgan@northstar.dev', tone: 'blue' },
  { name: 'Jordan Kim', initials: 'JK', role: 'Platform Engineer', email: 'jordan.kim@northstar.dev', tone: 'green' },
  { name: 'Maya Singh', initials: 'MS', role: 'Infrastructure Lead', email: 'maya.singh@northstar.dev', tone: 'violet' },
]

export const incidents: Incident[] = [
  {
    id: 'INC-1042',
    title: 'Checkout failures after payment gateway deployment',
    severity: 'SEV1',
    status: 'Investigating',
    services: ['Checkout API', 'Payment Gateway', 'Order Service'],
    commander: 'Sarah Chen',
    created: 'Today, 10:32 AM',
    duration: '42m',
    responders: ['Marcus Johnson', 'Priya Patel', 'Liam Brooks', 'Elena Rodriguez'],
    impact: '8.7% of checkout attempts are failing. Enterprise and consumer customers affected.',
  },
  {
    id: 'INC-1041',
    title: 'Elevated API latency in us-east-1',
    severity: 'SEV2',
    status: 'Monitoring',
    services: ['API Gateway', 'User Service'],
    commander: 'Maya Singh',
    created: 'Today, 8:14 AM',
    duration: '2h 59m',
    responders: ['Maya Singh', 'Jordan Kim'],
    impact: 'P95 API latency remains 12% above baseline for east coast traffic.',
  },
  {
    id: 'INC-1040',
    title: 'Delayed webhook processing',
    severity: 'SEV2',
    status: 'Monitoring',
    services: ['Webhook Processor', 'Notification Service'],
    commander: 'Jordan Kim',
    created: 'Today, 6:48 AM',
    duration: '4h 25m',
    responders: ['Jordan Kim', 'Noah Williams'],
    impact: 'Webhooks are delayed by up to four minutes for 6% of tenants.',
  },
  {
    id: 'INC-1039',
    title: 'Authentication failures affecting enterprise customers',
    severity: 'SEV1',
    status: 'Resolved',
    services: ['Authentication Service', 'API Gateway'],
    commander: 'Priya Patel',
    created: 'Yesterday, 4:06 PM',
    duration: '1h 12m',
    responders: ['Priya Patel', 'Elena Rodriguez', 'Maya Singh'],
    impact: 'SSO sign-ins failed for 14 enterprise tenants.',
  },
  {
    id: 'INC-1038',
    title: 'Database connection exhaustion',
    severity: 'SEV2',
    status: 'Resolved',
    services: ['Order Service', 'Inventory Service'],
    commander: 'Marcus Johnson',
    created: 'Sep 6, 2:41 PM',
    duration: '47m',
    responders: ['Marcus Johnson', 'Liam Brooks'],
    impact: 'Order writes were delayed for 3.2% of customers.',
  },
  {
    id: 'INC-1037',
    title: 'Search indexing lag after queue rebalance',
    severity: 'SEV3',
    status: 'Resolved',
    services: ['Search Service'],
    commander: 'Jordan Kim',
    created: 'Sep 5, 11:23 AM',
    duration: '2h 06m',
    responders: ['Jordan Kim'],
    impact: 'New catalog items took up to 18 minutes to appear in search.',
  },
]

export const alerts: Alert[] = [
  { id: 'ALT-8821', name: 'Checkout error rate > 10%', service: 'Checkout API', severity: 'Critical', source: 'Datadog', state: 'Firing', triggered: '10:32 AM', duration: '42m', assignee: 'Priya Patel', incident: 'INC-1042' },
  { id: 'ALT-8820', name: 'Payment API P95 latency > 2s', service: 'Payment Gateway', severity: 'Critical', source: 'Grafana', state: 'Acknowledged', triggered: '10:31 AM', duration: '43m', assignee: 'Marcus Johnson', incident: 'INC-1042' },
  { id: 'ALT-8819', name: 'Payment route mismatch detected', service: 'Payment Gateway', severity: 'High', source: 'custom monitor', state: 'Firing', triggered: '10:38 AM', duration: '36m', assignee: 'Elena Rodriguez', incident: 'INC-1042' },
  { id: 'ALT-8818', name: 'PostgreSQL connection pool > 90%', service: 'Order Service', severity: 'High', source: 'Datadog', state: 'Acknowledged', triggered: '10:35 AM', duration: '39m', assignee: 'Liam Brooks', incident: 'INC-1042' },
  { id: 'ALT-8814', name: 'Worker queue depth > 50k', service: 'Webhook Processor', severity: 'High', source: 'CloudWatch', state: 'Acknowledged', triggered: '6:49 AM', duration: '4h 25m', assignee: 'Jordan Kim', incident: 'INC-1040' },
  { id: 'ALT-8811', name: 'Authentication error rate anomaly', service: 'Authentication Service', severity: 'Medium', source: 'Sentry', state: 'Firing', triggered: '9:58 AM', duration: '1h 16m', assignee: 'Unassigned' },
  { id: 'ALT-8809', name: 'Redis memory utilization > 85%', service: 'User Service', severity: 'Medium', source: 'Datadog', state: 'Firing', triggered: '9:41 AM', duration: '1h 33m', assignee: 'Maya Singh', incident: 'INC-1041' },
  { id: 'ALT-8804', name: 'Webhook delivery failure rate', service: 'Notification Service', severity: 'Medium', source: 'Grafana', state: 'Acknowledged', triggered: '7:03 AM', duration: '4h 11m', assignee: 'Noah Williams', incident: 'INC-1040' },
  { id: 'ALT-8799', name: 'Inventory sync lag > 5m', service: 'Inventory Service', severity: 'Low', source: 'CloudWatch', state: 'Firing', triggered: '8:52 AM', duration: '2h 22m', assignee: 'Unassigned' },
]

export const services: Service[] = [
  { name: 'Checkout API', slug: 'checkout-api', owner: 'Payments', tier: 'Tier 1', health: 'Critical', uptime: '99.91%', incidents: 1, alerts: 4, deployment: 'Today, 9:18 AM', technology: 'Go', repository: 'relay/checkout-api' },
  { name: 'Payment Gateway', slug: 'payment-gateway', owner: 'Payments', tier: 'Tier 1', health: 'Degraded', uptime: '99.93%', incidents: 1, alerts: 3, deployment: 'Today, 10:18 AM', technology: 'Node.js', repository: 'relay/payment-gateway' },
  { name: 'Order Service', slug: 'order-service', owner: 'Payments', tier: 'Tier 1', health: 'Degraded', uptime: '99.95%', incidents: 1, alerts: 2, deployment: 'Yesterday, 4:02 PM', technology: 'Kotlin', repository: 'relay/order-service' },
  { name: 'Authentication Service', slug: 'authentication-service', owner: 'Core API', tier: 'Tier 1', health: 'Healthy', uptime: '99.98%', incidents: 0, alerts: 1, deployment: 'Yesterday, 1:46 PM', technology: 'Go', repository: 'relay/auth-service' },
  { name: 'User Service', slug: 'user-service', owner: 'Core API', tier: 'Tier 2', health: 'Degraded', uptime: '99.97%', incidents: 1, alerts: 1, deployment: 'Sep 7, 5:11 PM', technology: 'TypeScript', repository: 'relay/user-service' },
  { name: 'Notification Service', slug: 'notification-service', owner: 'Platform', tier: 'Tier 2', health: 'Degraded', uptime: '99.89%', incidents: 1, alerts: 2, deployment: 'Today, 10:49 AM', technology: 'Node.js', repository: 'relay/notifications' },
  { name: 'Webhook Processor', slug: 'webhook-processor', owner: 'Platform', tier: 'Tier 2', health: 'Degraded', uptime: '99.82%', incidents: 1, alerts: 3, deployment: 'Today, 8:20 AM', technology: 'Python', repository: 'relay/webhooks' },
  { name: 'Billing Service', slug: 'billing-service', owner: 'Payments', tier: 'Tier 1', health: 'Healthy', uptime: '99.99%', incidents: 0, alerts: 0, deployment: 'Sep 6, 3:32 PM', technology: 'Java', repository: 'relay/billing-service' },
  { name: 'API Gateway', slug: 'api-gateway', owner: 'Core API', tier: 'Tier 1', health: 'Degraded', uptime: '99.96%', incidents: 1, alerts: 1, deployment: 'Today, 10:54 AM', technology: 'Rust', repository: 'relay/api-gateway' },
  { name: 'Search Service', slug: 'search-service', owner: 'Core API', tier: 'Tier 2', health: 'Healthy', uptime: '99.94%', incidents: 0, alerts: 0, deployment: 'Sep 5, 9:14 AM', technology: 'Java', repository: 'relay/search' },
  { name: 'Inventory Service', slug: 'inventory-service', owner: 'Core API', tier: 'Tier 2', health: 'Healthy', uptime: '99.96%', incidents: 0, alerts: 1, deployment: 'Sep 7, 2:26 PM', technology: 'Kotlin', repository: 'relay/inventory' },
  { name: 'Analytics Pipeline', slug: 'analytics-pipeline', owner: 'Platform', tier: 'Tier 3', health: 'Healthy', uptime: '99.90%', incidents: 0, alerts: 2, deployment: 'Sep 5, 4:41 PM', technology: 'Python', repository: 'relay/analytics' },
]

export const deployments: Deployment[] = [
  { id: 'DEP-6194', service: 'API Gateway', version: 'api-gateway@7.21.0', commit: '1a8b02f', environment: 'Production', author: 'Jordan Kim', timestamp: 'Today, 10:54 AM', status: 'Successful', pullRequest: '#4821' },
  { id: 'DEP-6193', service: 'Notification Service', version: 'notifications@3.9.1', commit: 'fbd091c', environment: 'Production', author: 'Noah Williams', timestamp: 'Today, 10:49 AM', status: 'Rolling out', pullRequest: '#1178' },
  { id: 'DEP-6192', service: 'Payment Gateway', version: 'payment-gateway@4.18.2', commit: 'a72c91e', environment: 'Production', author: 'Marcus Johnson', timestamp: 'Today, 10:18 AM', status: 'Rolled back', pullRequest: '#2847', incident: 'INC-1042' },
  { id: 'DEP-6191', service: 'Analytics Pipeline', version: 'analytics@2.4.0-rc.3', commit: '998cbda', environment: 'Staging', author: 'Priya Patel', timestamp: 'Today, 10:02 AM', status: 'Failed', pullRequest: '#942' },
  { id: 'DEP-6190', service: 'Checkout API', version: 'checkout@8.42.1', commit: '3317df2', environment: 'Production', author: 'Liam Brooks', timestamp: 'Today, 9:18 AM', status: 'Successful', pullRequest: '#3906' },
  { id: 'DEP-6189', service: 'Webhook Processor', version: 'webhooks@6.12.0', commit: 'e490dc3', environment: 'Production', author: 'Jordan Kim', timestamp: 'Today, 8:20 AM', status: 'Successful', pullRequest: '#1520', incident: 'INC-1040' },
  { id: 'DEP-6188', service: 'Payment Gateway', version: 'payment-gateway@4.18.2', commit: 'a72c91e', environment: 'Staging', author: 'Marcus Johnson', timestamp: 'Yesterday, 5:44 PM', status: 'Successful', pullRequest: '#2847' },
]

export const teams: Team[] = [
  { name: 'Platform', slug: 'platform', lead: 'Jordan Kim', members: 11, services: ['Notification Service', 'Webhook Processor', 'Analytics Pipeline'], onCall: 'Jordan Kim', openIncidents: 1, reliability: '99.91%' },
  { name: 'Payments', slug: 'payments', lead: 'Sarah Chen', members: 6, services: ['Payment Gateway', 'Checkout API', 'Billing Service'], onCall: 'Priya Patel', openIncidents: 1, reliability: '99.94%' },
  { name: 'Core API', slug: 'core-api', lead: 'Elena Rodriguez', members: 9, services: ['Authentication Service', 'User Service', 'API Gateway', 'Search Service', 'Inventory Service'], onCall: 'Elena Rodriguez', openIncidents: 1, reliability: '99.96%' },
  { name: 'Infrastructure', slug: 'infrastructure', lead: 'Maya Singh', members: 8, services: ['Compute Platform', 'Edge Network'], onCall: 'Maya Singh', openIncidents: 0, reliability: '99.98%' },
  { name: 'Developer Experience', slug: 'developer-experience', lead: 'Noah Williams', members: 7, services: ['CI Platform', 'Developer Portal'], onCall: 'Noah Williams', openIncidents: 0, reliability: '99.97%' },
]

export const postmortems: Postmortem[] = [
  { id: 'PM-128', title: 'Payment Gateway Outage — August 28', incident: 'INC-1018', severity: 'SEV1', owner: 'Sarah Chen', status: 'In review', created: 'Aug 29, 2026', progress: 72 },
  { id: 'PM-127', title: 'Authentication Latency Incident — August 17', incident: 'INC-1003', severity: 'SEV2', owner: 'Priya Patel', status: 'Published', created: 'Aug 18, 2026', progress: 86 },
  { id: 'PM-126', title: 'Webhook Delivery Delays — August 4', incident: 'INC-982', severity: 'SEV2', owner: 'Jordan Kim', status: 'Published', created: 'Aug 5, 2026', progress: 100 },
  { id: 'PM-125', title: 'Database Connection Exhaustion — July 22', incident: 'INC-961', severity: 'SEV1', owner: 'Marcus Johnson', status: 'Draft', created: 'Jul 23, 2026', progress: 38 },
]

export const notifications = [
  { id: 1, title: 'You were added to INC-1042', body: 'Sarah Chen added you as a responder.', time: '34m', unread: true, kind: 'incident' },
  { id: 2, title: 'Payment Gateway deployment rolled back', body: 'Version 4.18.2 was rolled back in Production.', time: '47m', unread: true, kind: 'deployment' },
  { id: 3, title: 'You are on call in 30 minutes', body: 'Payments primary · 12:00 PM–8:00 PM.', time: '1h', unread: true, kind: 'oncall' },
  { id: 4, title: 'Sarah Chen mentioned you in INC-1038', body: '“Can you confirm the pool limit change?”', time: 'Yesterday', unread: false, kind: 'mention' },
  { id: 5, title: 'Action item due tomorrow', body: 'Add payment routing config validation.', time: 'Yesterday', unread: false, kind: 'task' },
  { id: 6, title: 'SEV1 alert triggered for Checkout API', body: 'Checkout error rate exceeded 10%.', time: '34m', unread: true, kind: 'alert' },
]

export const incidentTimeline = [
  { time: '11:01 AM', type: 'change', title: 'Configuration refresh initiated', body: 'Elena Rodriguez started a rolling refresh on the two stale gateway instances.', actor: 'Elena Rodriguez' },
  { time: '10:56 AM', type: 'comment', title: 'Config hash differs on gw-prod-12 and gw-prod-17', body: 'Both instances missed the routing config refresh after rollback. Comparing sidecar logs now.', actor: 'Marcus Johnson' },
  { time: '10:53 AM', type: 'system', title: 'Stale payment routing configuration identified', body: 'Two gateway instances are serving an outdated provider routing table.', actor: 'System' },
  { time: '10:48 AM', type: 'metric', title: 'Checkout error rate decreased to 8.7%', body: 'Error rate fell from a peak of 21.4% after the rollback completed.', actor: 'Datadog' },
  { time: '10:43 AM', type: 'deployment', title: 'Rollback initiated', body: 'payment-gateway@4.18.2 rollback started in Production.', actor: 'Marcus Johnson' },
  { time: '10:39 AM', type: 'deployment', title: 'Deployment identified as possible trigger', body: 'payment-gateway@4.18.2 completed 14 minutes before the first customer failures.', actor: 'Sarah Chen' },
  { time: '10:36 AM', type: 'people', title: 'Sarah Chen assigned as incident commander', body: 'Four responders joined the incident channel.', actor: 'RelayOps' },
  { time: '10:34 AM', type: 'system', title: 'Incident INC-1042 automatically created', body: 'Alert policy “Checkout critical path” created a SEV1 incident.', actor: 'RelayOps' },
  { time: '10:32 AM', type: 'alert', title: 'Checkout error rate above 18%', body: 'Automated monitoring detected a sharp rise in failed checkout attempts.', actor: 'Datadog' },
]

export const searchIndex = [
  ...incidents.map((item) => ({ type: 'Incident', title: `${item.id} · ${item.title}`, meta: `${item.severity} · ${item.status}`, section: 'incidents', id: item.id })),
  ...services.map((item) => ({ type: 'Service', title: item.name, meta: `${item.owner} · ${item.tier} · ${item.health}`, section: 'services', id: item.slug })),
  ...teams.map((item) => ({ type: 'Team', title: item.name, meta: `${item.members} members · ${item.services.length} services`, section: 'teams', id: item.slug })),
  ...people.map((item) => ({ type: 'Person', title: item.name, meta: item.role, section: 'teams', id: item.name === 'Jordan Kim' ? 'platform' : item.name === 'Maya Singh' ? 'infrastructure' : item.name === 'Alex Morgan' ? undefined : 'payments' })),
  ...alerts.map((item) => ({ type: 'Alert', title: item.name, meta: `${item.service} · ${item.state}`, section: 'alerts', id: item.id })),
  ...deployments.map((item) => ({ type: 'Deployment', title: item.version, meta: `${item.status} · ${item.environment}`, section: 'deployments', id: item.id })),
  ...postmortems.map((item) => ({ type: 'Postmortem', title: item.title, meta: `${item.incident} · ${item.status}`, section: 'postmortems', id: item.id })),
] as const
