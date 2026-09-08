export type Severity = 'SEV0' | 'SEV1' | 'SEV2' | 'SEV3';
export type IncidentStatus = 'Investigating' | 'Identified' | 'Monitoring' | 'Resolved';
export type Person = { name: string; role: string; initials: string; color: string; email: string };
export type Incident = { id: string; title: string; severity: Severity; status: IncidentStatus; services: string[]; commander: string; responders: string[]; created: string; duration: string; description: string; resolution?: string };
export type Alert = { id: string; name: string; service: string; severity: Severity; source: string; state: 'Firing' | 'Acknowledged' | 'Resolved'; triggered: string; duration: string; assignee: string; incident?: string };
export type Service = { name: string; slug: string; team: string; owner: string; tier: number; uptime: string; runtime: string; repository: string; latency: number };
export type Deployment = { id: string; service: string; version: string; commit: string; environment: 'Production' | 'Staging'; author: string; time: string; status: 'Successful' | 'Failed' | 'Rolling out' | 'Rolled back'; pr: number; incident?: string };
export type Team = { name: string; slug: string; lead: string; members: string[]; primary: string; secondary: string; next: string; reliability: string; description: string };
export type TimelineEvent = { id: string; incident: string; time: string; type: 'system' | 'update' | 'alert' | 'deployment' | 'status' | 'comment'; author?: string; body: string };
export type Task = { id: string; incident: string; title: string; owner: string; done: boolean; priority: 'High' | 'Medium' | 'Low'; due: string };
export type Postmortem = { id: string; title: string; incident: string; severity: Severity; owner: string; status: 'Draft' | 'In review' | 'Published'; created: string; sections: Record<string, string>; actions: { id: string; title: string; owner: string; priority: string; due: string; done: boolean }[] };
export type Notification = { id: string; title: string; body: string; time: string; type: 'incident' | 'deployment' | 'oncall' | 'mention' | 'task' | 'alert'; path: string; read: boolean };

export const people: Person[] = [
  { name: 'Sarah Chen', role: 'Engineering Manager', initials: 'SC', color: '#ead6c7', email: 'sarah.chen@northstar.io' },
  { name: 'Marcus Johnson', role: 'Senior Software Engineer', initials: 'MJ', color: '#d5dcf2', email: 'marcus.johnson@northstar.io' },
  { name: 'Priya Patel', role: 'Site Reliability Engineer', initials: 'PP', color: '#e8d9ef', email: 'priya.patel@northstar.io' },
  { name: 'Liam Brooks', role: 'Software Engineer', initials: 'LB', color: '#d1e9dd', email: 'liam.brooks@northstar.io' },
  { name: 'Elena Rodriguez', role: 'Senior Software Engineer', initials: 'ER', color: '#f0dfbe', email: 'elena.rodriguez@northstar.io' },
  { name: 'Noah Williams', role: 'Software Engineer', initials: 'NW', color: '#cde3eb', email: 'noah.williams@northstar.io' },
  { name: 'Alex Morgan', role: 'Platform Engineer', initials: 'AM', color: '#cce6db', email: 'alex.morgan@northstar.io' },
  { name: 'David Kim', role: 'Staff Software Engineer', initials: 'DK', color: '#dcdcf3', email: 'david.kim@northstar.io' },
  { name: 'Olivia Park', role: 'Infrastructure Engineer', initials: 'OP', color: '#f0d5d3', email: 'olivia.park@northstar.io' },
  { name: 'James Wilson', role: 'Engineering Manager', initials: 'JW', color: '#d7e2ed', email: 'james.wilson@northstar.io' },
];
export const services: Service[] = [
  { name: 'Checkout API', slug: 'checkout-api', team: 'Payments', owner: 'Elena Rodriguez', tier: 1, uptime: '99.92', runtime: 'Node.js', repository: 'relay/checkout-api', latency: 340 },
  { name: 'Payment Gateway', slug: 'payment-gateway', team: 'Payments', owner: 'Sarah Chen', tier: 1, uptime: '99.87', runtime: 'Node.js', repository: 'relay/payment-gateway', latency: 1240 },
  { name: 'Order Service', slug: 'order-service', team: 'Core API', owner: 'David Kim', tier: 1, uptime: '99.96', runtime: 'Go', repository: 'relay/order-service', latency: 215 },
  { name: 'Authentication Service', slug: 'authentication-service', team: 'Core API', owner: 'David Kim', tier: 1, uptime: '99.99', runtime: 'Go', repository: 'relay/auth-service', latency: 82 },
  { name: 'User Service', slug: 'user-service', team: 'Core API', owner: 'Noah Williams', tier: 2, uptime: '99.99', runtime: 'Node.js', repository: 'relay/user-service', latency: 64 },
  { name: 'Notification Service', slug: 'notification-service', team: 'Platform', owner: 'Alex Morgan', tier: 2, uptime: '100.00', runtime: 'Python', repository: 'relay/notifications', latency: 112 },
  { name: 'Webhook Processor', slug: 'webhook-processor', team: 'Platform', owner: 'Alex Morgan', tier: 2, uptime: '99.95', runtime: 'Go', repository: 'relay/webhook-processor', latency: 185 },
  { name: 'Billing Service', slug: 'billing-service', team: 'Payments', owner: 'Priya Patel', tier: 1, uptime: '99.99', runtime: 'Node.js', repository: 'relay/billing-service', latency: 96 },
  { name: 'API Gateway', slug: 'api-gateway', team: 'Infrastructure', owner: 'Olivia Park', tier: 1, uptime: '99.98', runtime: 'Rust', repository: 'relay/api-gateway', latency: 248 },
  { name: 'Search Service', slug: 'search-service', team: 'Core API', owner: 'David Kim', tier: 2, uptime: '99.99', runtime: 'Java', repository: 'relay/search-service', latency: 76 },
  { name: 'Inventory Service', slug: 'inventory-service', team: 'Core API', owner: 'James Wilson', tier: 2, uptime: '99.99', runtime: 'Go', repository: 'relay/inventory-service', latency: 48 },
  { name: 'Analytics Pipeline', slug: 'analytics-pipeline', team: 'Developer Experience', owner: 'James Wilson', tier: 3, uptime: '99.97', runtime: 'Python', repository: 'relay/analytics-pipeline', latency: 320 },
];
export const seedIncidents: Incident[] = [
  { id: 'INC-1042', title: 'Checkout failures after payment gateway deployment', severity: 'SEV1', status: 'Investigating', services: ['Checkout API', 'Payment Gateway', 'Order Service'], commander: 'Sarah Chen', responders: ['Marcus Johnson', 'Priya Patel', 'Liam Brooks', 'Elena Rodriguez'], created: 'Today, 10:32 AM', duration: '36m', description: 'Customers are experiencing intermittent checkout failures. Error rate is currently 8.7%, down from a peak of 21.4%. A rollback is complete; the Payments team is investigating stale routing configuration on two gateway instances.' },
  { id: 'INC-1041', title: 'Elevated API latency in us-east-1', severity: 'SEV2', status: 'Monitoring', services: ['API Gateway'], commander: 'Olivia Park', responders: ['David Kim', 'Alex Morgan'], created: 'Today, 9:14 AM', duration: '1h 54m', description: 'P95 latency increased after a node rebalance. Capacity has been restored and latency is returning to baseline.' },
  { id: 'INC-1040', title: 'Delayed webhook processing', severity: 'SEV2', status: 'Monitoring', services: ['Webhook Processor'], commander: 'Alex Morgan', responders: ['Noah Williams', 'Liam Brooks'], created: 'Today, 8:46 AM', duration: '2h 22m', description: 'An elevated queue depth delayed partner webhooks by up to 8 minutes. Workers have been scaled and the backlog is draining.' },
  { id: 'INC-1038', title: 'Payment gateway outage', severity: 'SEV1', status: 'Resolved', services: ['Payment Gateway', 'Checkout API'], commander: 'Sarah Chen', responders: ['Marcus Johnson', 'Priya Patel'], created: 'Aug 28, 2:08 PM', duration: '47m', description: 'A connection pool regression exhausted available provider connections. The pool limit was corrected and all transactions recovered.' },
  { id: 'INC-1035', title: 'Authentication failures affecting enterprise customers', severity: 'SEV2', status: 'Resolved', services: ['Authentication Service'], commander: 'David Kim', responders: ['Olivia Park', 'Noah Williams'], created: 'Aug 17, 9:20 AM', duration: '28m', description: 'Enterprise SSO requests experienced elevated latency after a certificate rotation. Cache invalidation restored normal behavior.' },
  { id: 'INC-1031', title: 'Webhook delivery delays', severity: 'SEV3', status: 'Resolved', services: ['Webhook Processor'], commander: 'Alex Morgan', responders: ['Liam Brooks'], created: 'Aug 4, 11:12 AM', duration: '1h 12m', description: 'A partner endpoint timeout caused worker starvation. Per-partner concurrency limits were introduced.' },
  { id: 'INC-1024', title: 'Database connection exhaustion', severity: 'SEV0', status: 'Resolved', services: ['Order Service', 'Checkout API', 'User Service'], commander: 'Olivia Park', responders: ['Sarah Chen', 'David Kim', 'Alex Morgan'], created: 'Jul 22, 4:02 PM', duration: '1h 38m', description: 'A long-running migration consumed all database connections. The migration was stopped and connection capacity was restored.' },
];
const alertDefinitions: [string, string, Severity, string, string?][] = [
  ['Checkout error rate > 10%', 'Checkout API', 'SEV1', 'Datadog', 'INC-1042'],
  ['Payment API P95 latency > 2s', 'Payment Gateway', 'SEV1', 'Grafana', 'INC-1042'],
  ['Payment routing configuration mismatch', 'Payment Gateway', 'SEV1', 'Custom monitor', 'INC-1042'],
  ['PostgreSQL connection pool > 90%', 'Order Service', 'SEV2', 'CloudWatch', 'INC-1042'],
  ['Worker queue depth > 50k', 'Webhook Processor', 'SEV2', 'Grafana', 'INC-1040'],
  ['Authentication error rate anomaly', 'Authentication Service', 'SEV2', 'Sentry'],
  ['Redis memory utilization > 85%', 'User Service', 'SEV3', 'CloudWatch'],
  ['Webhook delivery failure rate', 'Webhook Processor', 'SEV2', 'Datadog', 'INC-1040'],
  ['API gateway P95 latency above SLO', 'API Gateway', 'SEV2', 'Datadog', 'INC-1041'],
  ['Checkout upstream timeout', 'Checkout API', 'SEV1', 'Sentry', 'INC-1042'],
  ['Payment provider retry threshold', 'Payment Gateway', 'SEV2', 'Datadog', 'INC-1042'],
  ['Order processing error budget burn', 'Order Service', 'SEV2', 'Grafana', 'INC-1042'],
  ['Search index replication lag', 'Search Service', 'SEV3', 'CloudWatch'],
  ['Inventory cache miss ratio', 'Inventory Service', 'SEV3', 'Grafana'],
  ['Analytics event ingestion lag', 'Analytics Pipeline', 'SEV3', 'Datadog'],
  ['Notification delivery retry rate', 'Notification Service', 'SEV3', 'Sentry'],
  ['Billing reconciliation delay', 'Billing Service', 'SEV3', 'Custom monitor'],
  ['Gateway pod restart count', 'Payment Gateway', 'SEV2', 'CloudWatch', 'INC-1042'],
  ['API node CPU > 80%', 'API Gateway', 'SEV3', 'Grafana', 'INC-1041'],
  ['Webhook worker saturation', 'Webhook Processor', 'SEV3', 'Datadog', 'INC-1040'],
];
export const seedAlerts: Alert[] = alertDefinitions.map(([name, service, severity, source, incident], index) => ({ id: `ALT-${2841 - index}`, name, service, severity, source, incident, state: index < 17 ? 'Firing' : 'Acknowledged', triggered: index < 4 ? '10:32 AM' : index < 12 ? '10:18 AM' : '9:54 AM', duration: index < 4 ? '36m' : index < 12 ? '50m' : '1h 14m', assignee: index < 4 ? 'Priya Patel' : index % 2 ? 'Alex Morgan' : 'Unassigned' }));
export const deployments: Deployment[] = [
  { id: 'DEP-482', service: 'Authentication Service', version: 'v2.31.0', commit: 'b7e12ad', environment: 'Staging', author: 'David Kim', time: '10:58 AM', status: 'Rolling out', pr: 1842 },
  { id: 'DEP-481', service: 'Checkout API', version: 'v3.12.1', commit: 'f21c9a8', environment: 'Production', author: 'Elena Rodriguez', time: '10:51 AM', status: 'Failed', pr: 1839, incident: 'INC-1042' },
  { id: 'DEP-480', service: 'Order Service', version: 'v2.8.4', commit: 'a4f7c2e', environment: 'Production', author: 'Liam Brooks', time: '10:46 AM', status: 'Successful', pr: 1837 },
  { id: 'DEP-479', service: 'Payment Gateway', version: 'v4.18.2', commit: '8e4f1b2', environment: 'Production', author: 'Marcus Johnson', time: '10:28 AM', status: 'Rolled back', pr: 1834, incident: 'INC-1042' },
  { id: 'DEP-478', service: 'Search Service', version: 'v1.24.0', commit: 'd02a8f1', environment: 'Production', author: 'David Kim', time: '9:42 AM', status: 'Successful', pr: 1832 },
  { id: 'DEP-477', service: 'Billing Service', version: 'v2.6.3', commit: 'e1b4c82', environment: 'Production', author: 'Priya Patel', time: '9:16 AM', status: 'Successful', pr: 1828 },
  { id: 'DEP-476', service: 'Webhook Processor', version: 'v1.9.2', commit: 'a81c3f0', environment: 'Production', author: 'Alex Morgan', time: '8:12 AM', status: 'Successful', pr: 1825 },
  { id: 'DEP-475', service: 'Payment Gateway', version: 'v4.18.1', commit: 'c67df10', environment: 'Production', author: 'Marcus Johnson', time: 'Sep 7, 3:21 PM', status: 'Successful', pr: 1818 },
  { id: 'DEP-474', service: 'Payment Gateway', version: 'v4.17.9', commit: '3b26e8c', environment: 'Production', author: 'Priya Patel', time: 'Sep 4, 11:04 AM', status: 'Successful', pr: 1802 },
];
export const serviceDependencies: Record<string, string[]> = {
  'Checkout API': ['Payment Gateway', 'Order Service'],
  'Payment Gateway': ['Authentication Service', 'Billing Service'],
  'Order Service': ['Payment Gateway', 'Inventory Service'],
  'Authentication Service': ['User Service'],
  'User Service': [],
  'Notification Service': ['User Service'],
  'Webhook Processor': ['Notification Service'],
  'Billing Service': ['Authentication Service'],
  'API Gateway': ['Authentication Service', 'Checkout API', 'Search Service'],
  'Search Service': ['Inventory Service'],
  'Inventory Service': [],
  'Analytics Pipeline': ['Order Service', 'Webhook Processor'],
};
export const teams: Team[] = [
  { name: 'Payments', slug: 'payments', lead: 'Sarah Chen', members: people.slice(0, 6).map(p => p.name), primary: 'Priya Patel', secondary: 'Marcus Johnson', next: 'Elena Rodriguez', reliability: '99.93', description: 'Reliable payments, from checkout to settlement.' },
  { name: 'Platform', slug: 'platform', lead: 'Alex Morgan', members: ['Alex Morgan', 'Noah Williams', 'Liam Brooks'], primary: 'Alex Morgan', secondary: 'Liam Brooks', next: 'Noah Williams', reliability: '99.97', description: 'The shared systems that keep Northstar moving.' },
  { name: 'Core API', slug: 'core-api', lead: 'David Kim', members: ['David Kim', 'Noah Williams', 'James Wilson'], primary: 'David Kim', secondary: 'James Wilson', next: 'Noah Williams', reliability: '99.99', description: 'Core product APIs and identity infrastructure.' },
  { name: 'Infrastructure', slug: 'infrastructure', lead: 'Olivia Park', members: ['Olivia Park', 'Alex Morgan', 'David Kim'], primary: 'Olivia Park', secondary: 'David Kim', next: 'Alex Morgan', reliability: '99.98', description: 'Cloud infrastructure, networking, and resilience.' },
  { name: 'Developer Experience', slug: 'developer-experience', lead: 'James Wilson', members: ['James Wilson', 'Liam Brooks', 'Noah Williams'], primary: 'James Wilson', secondary: 'Liam Brooks', next: 'Noah Williams', reliability: '99.97', description: 'Helping engineers ship with confidence.' },
];
export const seedTimeline: TimelineEvent[] = [
  { id: 'ev1', incident: 'INC-1042', time: '10:32 AM', type: 'alert', body: 'Automated monitoring detected checkout error rate above 18%.' },
  { id: 'ev2', incident: 'INC-1042', time: '10:34 AM', type: 'system', body: 'Incident INC-1042 automatically created from Datadog monitor.' },
  { id: 'ev3', incident: 'INC-1042', time: '10:36 AM', type: 'status', author: 'Sarah Chen', body: 'Assigned as incident commander. Payments team paged and incident channel opened.' },
  { id: 'ev4', incident: 'INC-1042', time: '10:39 AM', type: 'deployment', author: 'Marcus Johnson', body: 'Payment Gateway deployment payment-gateway@4.18.2 identified as a possible trigger. Error rate peaked at 21.4%.' },
  { id: 'ev5', incident: 'INC-1042', time: '10:43 AM', type: 'deployment', author: 'Marcus Johnson', body: 'Rollback initiated to v4.18.1. Watching pod readiness as the previous version rolls out.' },
  { id: 'ev5b', incident: 'INC-1042', time: '10:46 AM', type: 'deployment', author: 'Marcus Johnson', body: 'Rollback complete. All pods are now running the previous version.' },
  { id: 'ev6', incident: 'INC-1042', time: '10:48 AM', type: 'update', author: 'Priya Patel', body: 'Checkout error rate decreased from 21.4% to 8.7%. Rollback helped, but we’re still above our 0.5% baseline.' },
  { id: 'ev7', incident: 'INC-1042', time: '10:53 AM', type: 'comment', author: 'Elena Rodriguez', body: 'Found stale payment routing configuration on gateway-7b and gateway-9c. Comparing checksums with healthy instances now.' },
  { id: 'ev8', incident: 'INC-1042', time: '11:01 AM', type: 'update', author: 'Liam Brooks', body: 'Configuration refresh initiated on the two affected instances. Watching error rates before we move to monitoring.' },
];
export const seedTasks: Task[] = [
  { id: 't1', incident: 'INC-1042', title: 'Verify rollback completion', owner: 'Marcus Johnson', done: true, priority: 'High', due: 'Today' },
  { id: 't2', incident: 'INC-1042', title: 'Compare routing config across gateway instances', owner: 'Elena Rodriguez', done: false, priority: 'High', due: 'Today' },
  { id: 't3', incident: 'INC-1042', title: 'Contact payment provider if failure rate remains elevated', owner: 'Priya Patel', done: false, priority: 'Medium', due: 'Today' },
  { id: 't4', incident: 'INC-1042', title: 'Prepare customer status update', owner: 'Sarah Chen', done: false, priority: 'High', due: 'Today' },
];
export const postmortemSections = ['Summary', 'Customer Impact', 'Detection', 'Timeline', 'Root Cause', 'Resolution', 'What Went Well', 'What Went Poorly', 'Lessons Learned'];
const historicalSections: Record<string, string> = {
  Summary: 'On August 28, a connection pool regression in Payment Gateway caused a 47-minute partial outage. The Payments team restored service by correcting the connection limit and restarting affected instances. No payment data was lost and no duplicate charges occurred.',
  'Customer Impact': 'Approximately 12,400 checkout attempts were affected between 2:08 PM and 2:55 PM UTC. 6.2% of active customers experienced at least one failed payment. All queued transactions were processed successfully after recovery.',
  Detection: 'Datadog triggered the payment success rate monitor at 2:08 PM. The on-call engineer acknowledged the alert within 2 minutes. Customer support received the first report at 2:13 PM.',
  Timeline: '14:08 — Payment success rate alert triggered.\n14:10 — Priya Patel acknowledged and began investigation.\n14:16 — Sarah Chen declared SEV1 and coordinated response.\n14:29 — Connection pool regression isolated.\n14:41 — Updated connection limit deployed.\n14:55 — All payment metrics returned to baseline.',
  'Root Cause': 'A library upgrade changed the default connection pool size from 100 to 10. The staging environment had lower transaction volume and did not expose this constraint. Under production load, connections queued until requests exceeded the provider timeout.',
  Resolution: 'We explicitly set the maximum pool size to 100, rolled out the configuration to all gateway instances, and verified provider connection metrics for 30 minutes. Queued transactions drained without manual intervention.',
  'What Went Well': '• Automated detection alerted the team before widespread customer reports.\n• Clear incident roles kept investigation and customer communication in parallel.\n• The rollback runbook was current and accessible.',
  'What Went Poorly': '• Staging load did not represent peak production traffic.\n• The dependency changelog did not highlight the changed default.\n• Connection pool utilization was not included in the service dashboard.',
  'Lessons Learned': 'Critical runtime limits should be explicit, version-controlled settings rather than library defaults. Release validation must include a production-shaped load test for the payment path.',
};
const authenticationReview: Record<string, string> = {
  Summary: 'On August 17, enterprise SSO authentication experienced elevated latency for 28 minutes after a certificate rotation. The Core API team restored normal behavior by invalidating stale certificate metadata.',
  'Customer Impact': 'Twelve enterprise organizations experienced slow or failed SSO requests between 9:20 AM and 9:48 AM UTC. Existing sessions and password-based authentication were not affected.',
  Detection: 'The SSO synthetic monitor detected elevated latency at 9:20 AM. David Kim acknowledged the alert at 9:22 AM, before the first support ticket arrived.',
  Timeline: '09:20 — SSO synthetic monitor triggered.\n09:22 — David Kim acknowledged the alert.\n09:28 — Regional certificate cache identified as the source.\n09:36 — Cache invalidation started across all regions.\n09:48 — Authentication latency returned to baseline.',
  'Root Cause': 'The certificate rotation job updated the signing certificate but did not invalidate cached metadata on two regional nodes. Those nodes retried requests against an expired key.',
  Resolution: 'The team invalidated all regional certificate caches, verified enterprise SSO canaries, and added a cache-refresh hook to the rotation job.',
  'What Went Well': '• Synthetic checks detected the regression before customer reports.\n• Clear regional metrics made it possible to isolate the affected nodes.',
  'What Went Poorly': '• Rotation checks verified certificate validity but not cache consistency.\n• The initial runbook did not include regional cache invalidation.',
  'Lessons Learned': 'Validate certificate rotation end to end. Test both newly created sessions and existing regional metadata before marking a rotation complete.',
};
const webhookReview: Record<string, string> = {
  Summary: 'On August 4, slow partner endpoints exhausted the shared webhook worker pool. Delivery was delayed for 72 minutes while the Platform team isolated retries and restored worker capacity.',
  'Customer Impact': 'Approximately 48,000 webhooks were delayed by up to 18 minutes. Events remained durable in the queue, and all were eventually delivered. No customer data was lost.',
  Detection: 'The queue age monitor triggered at 11:12 AM. Alex Morgan acknowledged within 3 minutes and checked per-partner delivery metrics.',
  Timeline: '11:12 — Queue age exceeded the delivery SLO.\n11:15 — Alex Morgan began investigation.\n11:31 — A slow partner endpoint was isolated.\n11:46 — Per-partner concurrency limits applied.\n12:24 — Backlog drained and normal delivery resumed.',
  'Root Cause': 'A single partner consumed the shared worker pool. Long request timeouts and unbounded retries prevented healthy partner requests from being processed.',
  Resolution: 'The team limited per-partner concurrency, enabled a circuit breaker for the slow endpoint, and temporarily increased worker capacity to drain the queue.',
  'What Went Well': '• Durable queues preserved all webhook events.\n• Per-partner metrics showed which endpoint was blocking progress.',
  'What Went Poorly': '• Shared concurrency allowed one partner to affect others.\n• Retry policy did not reduce pressure on a failing endpoint.',
  'Lessons Learned': 'Isolate partner workloads and set bounded retries. Alert on queue age as well as depth so delivery delays are visible sooner.',
};
const databaseReview: Record<string, string> = {
  Summary: 'On July 22, a long-running schema migration exhausted database connections and affected order, checkout, and user APIs for 98 minutes. Infrastructure stopped the migration and restored connection capacity.',
  'Customer Impact': 'Checkout and order creation were unavailable for most customers between 4:02 PM and 5:40 PM UTC. User profile writes also failed. Existing orders and payment records remained intact.',
  Detection: 'CloudWatch reported database connection pool utilization above 90% at 4:02 PM. Olivia Park declared a SEV0 incident after confirming failures across three critical APIs.',
  Timeline: '16:02 — Database connection alert triggered.\n16:06 — SEV0 declared; service owners paged.\n16:24 — Blocking migration identified.\n16:38 — Migration terminated and lock released.\n17:02 — Connection pools recycled in stages.\n17:40 — All affected APIs recovered.',
  'Root Cause': 'The schema migration held an exclusive table lock. Application connections waited for the lock until the entire pool was exhausted. The migration had no lock timeout.',
  Resolution: 'Infrastructure stopped the migration, cleared blocked connections, and restarted application pools in stages. The schema change was rescheduled using an online migration strategy.',
  'What Went Well': '• Connection telemetry identified the shared failure quickly.\n• Staged recovery avoided another surge in database connections.',
  'What Went Poorly': '• Production migrations did not enforce lock timeouts.\n• Staging tables were too small to expose the lock duration.',
  'Lessons Learned': 'Use online migrations for production tables. Enforce lock timeouts and verify migration behavior against production-sized data before release.',
};
export const seedPostmortems: Postmortem[] = [
  { id: 'PM-028', title: 'Payment Gateway Outage — August 28', incident: 'INC-1038', severity: 'SEV1', owner: 'Sarah Chen', status: 'In review', created: 'Aug 29, 2026', sections: historicalSections, actions: [{ id: 'a1', title: 'Set explicit connection pool limits for all payment services', owner: 'Marcus Johnson', priority: 'High', due: 'Sep 4', done: true }, { id: 'a2', title: 'Add connection pool utilization to the service dashboard', owner: 'Priya Patel', priority: 'High', due: 'Sep 7', done: true }, { id: 'a3', title: 'Add production-shaped load tests to release validation', owner: 'Elena Rodriguez', priority: 'High', due: 'Sep 12', done: false }, { id: 'a4', title: 'Audit runtime defaults in critical dependencies', owner: 'Liam Brooks', priority: 'Medium', due: 'Sep 15', done: false }] },
  { id: 'PM-027', title: 'Authentication Latency Incident — August 17', incident: 'INC-1035', severity: 'SEV2', owner: 'David Kim', status: 'Published', created: 'Aug 18, 2026', sections: authenticationReview, actions: [{ id: 'b1', title: 'Automate certificate cache invalidation', owner: 'David Kim', priority: 'High', due: 'Aug 24', done: true }, { id: 'b2', title: 'Add enterprise SSO canary checks', owner: 'Noah Williams', priority: 'Medium', due: 'Aug 28', done: true }] },
  { id: 'PM-026', title: 'Webhook Delivery Delays — August 4', incident: 'INC-1031', severity: 'SEV3', owner: 'Alex Morgan', status: 'Draft', created: 'Aug 5, 2026', sections: webhookReview, actions: [{ id: 'c1', title: 'Isolate partner retry queues', owner: 'Alex Morgan', priority: 'Medium', due: 'Sep 9', done: false }] },
  { id: 'PM-024', title: 'Database Connection Exhaustion — July 22', incident: 'INC-1024', severity: 'SEV0', owner: 'Olivia Park', status: 'Published', created: 'Jul 23, 2026', sections: databaseReview, actions: [{ id: 'd1', title: 'Require online migrations for production tables', owner: 'Olivia Park', priority: 'High', due: 'Aug 1', done: true }] },
];
export const seedNotifications: Notification[] = [
  { id: 'n1', title: 'You are following INC-1042', body: 'Sarah Chen subscribed you to the Payments incident updates.', time: '4 min ago', type: 'incident', path: '/incidents/INC-1042', read: false },
  { id: 'n2', title: 'Payment Gateway deployment rolled back', body: 'v4.18.2 failed health checks and was rolled back.', time: '25 min ago', type: 'deployment', path: '/deployments', read: false },
  { id: 'n3', title: 'Your on-call handoff is in 30 minutes', body: 'Noah Williams joins the Platform rotation at 11:38 AM. Prepare your handoff notes.', time: 'Just now', type: 'oncall', path: '/on-call', read: false },
  { id: 'n4', title: 'Sarah Chen mentioned you in INC-1038', body: '“@Alex can you review the load testing action item?”', time: '1 hour ago', type: 'mention', path: '/incidents/INC-1038', read: true },
  { id: 'n5', title: 'Postmortem action item is due tomorrow', body: 'Isolate partner retry queues · Webhook delivery delays', time: '2 hours ago', type: 'task', path: '/postmortems/PM-026', read: true },
  { id: 'n6', title: 'SEV1 alert triggered for Checkout API', body: 'Checkout error rate exceeded the 10% threshold.', time: '36 min ago', type: 'alert', path: '/alerts', read: false },
];
export const historicalTimeline: TimelineEvent[] = seedPostmortems.flatMap(pm => {
  const entries = pm.sections.Timeline.split('\n');
  return entries.map((line, index): TimelineEvent => ({
    id: `${pm.incident}-history-${index}`,
    incident: pm.incident,
    time: `${line.slice(0, 5)} UTC`,
    type: index === 0 ? 'alert' : index === entries.length - 1 ? 'status' : 'update',
    author: pm.owner,
    body: line.slice(line.indexOf('—') + 1).trim(),
  }));
});
export function serviceHealth(name: string, incidents: Incident[]): 'Degraded' | 'Monitoring' | 'Healthy' {
  const active = incidents.filter(i => i.services.includes(name) && i.status !== 'Resolved');
  return active.some(i => i.status !== 'Monitoring') ? 'Degraded' : active.length ? 'Monitoring' : 'Healthy';
}
export const servicePath = (name: string) => `/services/${services.find(s => s.name === name)?.slug ?? 'payment-gateway'}`;
export const personByName = (name: string) => people.find(p => p.name === name);
