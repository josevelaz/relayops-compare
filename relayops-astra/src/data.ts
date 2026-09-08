export type Severity = "SEV0" | "SEV1" | "SEV2" | "SEV3";
export type IncidentStatus =
  "Investigating" | "Identified" | "Monitoring" | "Resolved";
export type Health = "Operational" | "Degraded" | "Partial outage";
export interface Person {
  id: string;
  name: string;
  role: string;
  email: string;
  color: string;
  team: string;
}
export interface TimelineEvent {
  id: string;
  time: string;
  type: "system" | "comment" | "alert" | "deployment" | "status";
  text: string;
  author?: string;
}
export interface Task {
  id: string;
  title: string;
  owner: string;
  done: boolean;
  priority: string;
  due: string;
}
export interface Incident {
  id: string;
  title: string;
  severity: Severity;
  status: IncidentStatus;
  services: string[];
  commander: string;
  responders: string[];
  created: string;
  duration: string;
  description: string;
  timeline: TimelineEvent[];
  tasks: Task[];
}
export interface Service {
  id: string;
  name: string;
  team: string;
  owner: string;
  tier: string;
  health: Health;
  uptime: string;
  runtime: string;
  repo: string;
  latency: string;
  dependencies: string[];
}
export interface Alert {
  id: string;
  name: string;
  service: string;
  severity: Severity;
  source: string;
  state: "Firing" | "Acknowledged" | "Resolved";
  time: string;
  duration: string;
  assignee: string;
  incident?: string;
}
export interface Deployment {
  id: string;
  service: string;
  version: string;
  commit: string;
  environment: "Production" | "Staging";
  author: string;
  time: string;
  status: "Successful" | "Failed" | "Rolling out" | "Rolled back";
  pr: string;
  incident?: string;
}
export interface Team {
  id: string;
  name: string;
  description: string;
  lead: string;
  members: string[];
  primary: string;
  secondary: string;
  next: string;
  reliability: string;
  color: string;
}
export interface Postmortem {
  id: string;
  title: string;
  incident: string;
  severity: Severity;
  owner: string;
  status: "Draft" | "In review" | "Published";
  created: string;
  sections: Record<string, string>;
  actions: Task[];
}
export interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  link: string;
  type: "incident" | "deployment" | "oncall" | "mention" | "task" | "alert";
}

export const people: Person[] = [
  {
    id: "sarah",
    name: "Sarah Chen",
    role: "Engineering Manager",
    email: "sarah.chen@northstar.io",
    color: "lilac",
    team: "Payments",
  },
  {
    id: "marcus",
    name: "Marcus Johnson",
    role: "Senior Software Engineer",
    email: "marcus.j@northstar.io",
    color: "sand",
    team: "Payments",
  },
  {
    id: "priya",
    name: "Priya Patel",
    role: "Site Reliability Engineer",
    email: "priya.patel@northstar.io",
    color: "rose",
    team: "Payments",
  },
  {
    id: "liam",
    name: "Liam Brooks",
    role: "Software Engineer",
    email: "liam.brooks@northstar.io",
    color: "blue",
    team: "Payments",
  },
  {
    id: "elena",
    name: "Elena Rodriguez",
    role: "Senior Software Engineer",
    email: "elena.r@northstar.io",
    color: "green",
    team: "Payments",
  },
  {
    id: "noah",
    name: "Noah Williams",
    role: "Software Engineer",
    email: "noah.w@northstar.io",
    color: "sand",
    team: "Payments",
  },
  {
    id: "alex",
    name: "Alex Morgan",
    role: "Platform Engineer",
    email: "alex.morgan@northstar.io",
    color: "green",
    team: "Platform",
  },
  {
    id: "james",
    name: "James Wilson",
    role: "Engineering Manager",
    email: "james.w@northstar.io",
    color: "blue",
    team: "Core API",
  },
  {
    id: "maya",
    name: "Maya Thompson",
    role: "Site Reliability Engineer",
    email: "maya.t@northstar.io",
    color: "rose",
    team: "Infrastructure",
  },
  {
    id: "david",
    name: "David Kim",
    role: "Staff Software Engineer",
    email: "david.kim@northstar.io",
    color: "lilac",
    team: "Developer Experience",
  },
  {
    id: "olivia",
    name: "Olivia Parker",
    role: "Senior Software Engineer",
    email: "olivia.p@northstar.io",
    color: "sand",
    team: "Core API",
  },
  {
    id: "ethan",
    name: "Ethan Wright",
    role: "Platform Engineer",
    email: "ethan.w@northstar.io",
    color: "blue",
    team: "Infrastructure",
  },
];

export const teams: Team[] = [
  {
    id: "platform",
    name: "Platform",
    description: "The foundations that keep engineering moving.",
    lead: "alex",
    members: ["alex", "david", "ethan"],
    primary: "alex",
    secondary: "david",
    next: "ethan",
    reliability: "99.99%",
    color: "green",
  },
  {
    id: "payments",
    name: "Payments",
    description: "Reliable payments, from checkout to settlement.",
    lead: "sarah",
    members: ["sarah", "marcus", "priya", "liam", "elena", "noah"],
    primary: "priya",
    secondary: "marcus",
    next: "elena",
    reliability: "99.92%",
    color: "lilac",
  },
  {
    id: "core-api",
    name: "Core API",
    description: "Secure, fast APIs for every product experience.",
    lead: "james",
    members: ["james", "olivia", "liam"],
    primary: "olivia",
    secondary: "james",
    next: "james",
    reliability: "99.97%",
    color: "blue",
  },
  {
    id: "infrastructure",
    name: "Infrastructure",
    description: "Cloud infrastructure built for scale.",
    lead: "maya",
    members: ["maya", "ethan", "alex"],
    primary: "maya",
    secondary: "ethan",
    next: "ethan",
    reliability: "99.99%",
    color: "sand",
  },
  {
    id: "developer-experience",
    name: "Developer Experience",
    description: "Better tools for happier, more effective engineers.",
    lead: "david",
    members: ["david", "noah", "olivia"],
    primary: "david",
    secondary: "noah",
    next: "noah",
    reliability: "99.98%",
    color: "rose",
  },
];

export const services: Service[] = [
  {
    id: "checkout-api",
    name: "Checkout API",
    team: "Payments",
    owner: "marcus",
    tier: "Tier 1",
    health: "Degraded",
    uptime: "99.91%",
    runtime: "Node.js",
    repo: "relay/checkout-api",
    latency: "482 ms",
    dependencies: ["payment-gateway", "inventory-service"],
  },
  {
    id: "payment-gateway",
    name: "Payment Gateway",
    team: "Payments",
    owner: "sarah",
    tier: "Tier 1",
    health: "Partial outage",
    uptime: "99.89%",
    runtime: "Node.js",
    repo: "relay/payment-gateway",
    latency: "2,140 ms",
    dependencies: ["authentication-service", "billing-service"],
  },
  {
    id: "order-service",
    name: "Order Service",
    team: "Core API",
    owner: "james",
    tier: "Tier 1",
    health: "Degraded",
    uptime: "99.96%",
    runtime: "Go",
    repo: "relay/order-service",
    latency: "186 ms",
    dependencies: ["payment-gateway", "inventory-service"],
  },
  {
    id: "authentication-service",
    name: "Authentication Service",
    team: "Core API",
    owner: "olivia",
    tier: "Tier 1",
    health: "Operational",
    uptime: "99.99%",
    runtime: "Go",
    repo: "relay/auth",
    latency: "42 ms",
    dependencies: ["user-service"],
  },
  {
    id: "user-service",
    name: "User Service",
    team: "Core API",
    owner: "james",
    tier: "Tier 2",
    health: "Operational",
    uptime: "99.99%",
    runtime: "Go",
    repo: "relay/users",
    latency: "38 ms",
    dependencies: [],
  },
  {
    id: "notification-service",
    name: "Notification Service",
    team: "Platform",
    owner: "alex",
    tier: "Tier 2",
    health: "Operational",
    uptime: "99.98%",
    runtime: "Node.js",
    repo: "relay/notifications",
    latency: "64 ms",
    dependencies: ["user-service"],
  },
  {
    id: "webhook-processor",
    name: "Webhook Processor",
    team: "Platform",
    owner: "alex",
    tier: "Tier 2",
    health: "Degraded",
    uptime: "99.95%",
    runtime: "Python",
    repo: "relay/webhooks",
    latency: "240 ms",
    dependencies: ["notification-service"],
  },
  {
    id: "billing-service",
    name: "Billing Service",
    team: "Payments",
    owner: "elena",
    tier: "Tier 1",
    health: "Operational",
    uptime: "99.99%",
    runtime: "Node.js",
    repo: "relay/billing",
    latency: "92 ms",
    dependencies: ["user-service"],
  },
  {
    id: "api-gateway",
    name: "API Gateway",
    team: "Infrastructure",
    owner: "maya",
    tier: "Tier 1",
    health: "Degraded",
    uptime: "99.97%",
    runtime: "Go",
    repo: "relay/api-gateway",
    latency: "325 ms",
    dependencies: ["authentication-service", "order-service"],
  },
  {
    id: "search-service",
    name: "Search Service",
    team: "Core API",
    owner: "james",
    tier: "Tier 2",
    health: "Operational",
    uptime: "99.99%",
    runtime: "Java",
    repo: "relay/search",
    latency: "76 ms",
    dependencies: ["inventory-service"],
  },
  {
    id: "inventory-service",
    name: "Inventory Service",
    team: "Infrastructure",
    owner: "ethan",
    tier: "Tier 2",
    health: "Operational",
    uptime: "99.99%",
    runtime: "Go",
    repo: "relay/inventory",
    latency: "58 ms",
    dependencies: [],
  },
  {
    id: "analytics-pipeline",
    name: "Analytics Pipeline",
    team: "Developer Experience",
    owner: "david",
    tier: "Tier 3",
    health: "Operational",
    uptime: "99.96%",
    runtime: "Python",
    repo: "relay/analytics",
    latency: "112 ms",
    dependencies: ["order-service"],
  },
];

const currentTimeline: TimelineEvent[] = [
  {
    id: "e1",
    time: "10:32 AM",
    type: "alert",
    text: "Automated monitoring detected checkout error rate above 18%.",
    author: "Datadog",
  },
  {
    id: "e2",
    time: "10:34 AM",
    type: "system",
    text: "Incident INC-1042 automatically created. Payments escalation policy notified.",
  },
  {
    id: "e3",
    time: "10:36 AM",
    type: "status",
    text: "Sarah Chen assigned as incident commander.",
    author: "sarah",
  },
  {
    id: "e4",
    time: "10:39 AM",
    type: "deployment",
    text: "payment-gateway@4.18.2 identified as a possible trigger. Error rate peaked at 21.4%.",
    author: "marcus",
  },
  {
    id: "e5",
    time: "10:43 AM",
    type: "deployment",
    text: "Rollback to payment-gateway@4.18.1 initiated. All 12 pods are cycling.",
    author: "priya",
  },
  {
    id: "e6",
    time: "10:48 AM",
    type: "system",
    text: "Checkout error rate decreased from 21.4% to 8.7%. Latency is recovering.",
  },
  {
    id: "e6-public",
    time: "10:50 AM",
    type: "comment",
    author: "sarah",
    text: "[Public status page] We are investigating an issue affecting card payments at checkout. Our team has applied a mitigation and is working to restore normal service. Your payment details remain secure. Next update by 11:15 AM.",
  },
  {
    id: "e7",
    time: "10:53 AM",
    type: "comment",
    text: "Found stale payment routing configuration on gateway-7 and gateway-9. The rollback restored the code but not the cached config. Comparing checksums now.",
    author: "marcus",
  },
  {
    id: "e8",
    time: "11:01 AM",
    type: "comment",
    text: "Configuration refresh initiated on the two affected instances. Watching the error rate for the next 5 minutes before we move to monitoring.",
    author: "priya",
  },
  {
    id: "e9",
    time: "11:05 AM",
    type: "comment",
    text: "Support has been briefed. No duplicate charges confirmed. I’m preparing the next customer update for 11:15.",
    author: "sarah",
  },
];

export const seedIncidents: Incident[] = [
  {
    id: "INC-1042",
    title: "Checkout failures after payment gateway deployment",
    severity: "SEV1",
    status: "Investigating",
    services: ["checkout-api", "payment-gateway", "order-service"],
    commander: "sarah",
    responders: ["marcus", "priya", "liam", "elena"],
    created: "Today, 10:32 AM",
    duration: "36m",
    description:
      "8.7% of checkout attempts are failing. Peak error rate was 21.4% (normal <0.5%). A rollback is complete, but stale routing configuration on two gateway instances continues to affect card payments. No duplicate charges or data loss confirmed.",
    timeline: currentTimeline,
    tasks: [
      {
        id: "t1",
        title: "Verify rollback completion",
        owner: "priya",
        done: true,
        priority: "High",
        due: "Today",
      },
      {
        id: "t2",
        title: "Compare routing config across gateway instances",
        owner: "marcus",
        done: false,
        priority: "High",
        due: "Today",
      },
      {
        id: "t3",
        title: "Contact payment provider if failure rate remains elevated",
        owner: "elena",
        done: false,
        priority: "Medium",
        due: "Today",
      },
      {
        id: "t4",
        title: "Prepare customer status update",
        owner: "sarah",
        done: false,
        priority: "High",
        due: "Today",
      },
    ],
  },
  {
    id: "INC-1041",
    title: "Elevated API latency in us-east-1",
    severity: "SEV2",
    status: "Monitoring",
    services: ["api-gateway"],
    commander: "maya",
    responders: ["ethan", "alex"],
    created: "Today, 9:14 AM",
    duration: "1h 54m",
    description:
      "Elevated P95 latency in us-east-1. Additional capacity has been added and traffic is stabilizing.",
    timeline: [
      {
        id: "a1",
        time: "9:14 AM",
        type: "alert",
        text: "API Gateway P95 latency crossed 500 ms.",
      },
      {
        id: "a2",
        time: "10:15 AM",
        type: "status",
        text: "Additional replicas are healthy. Monitoring recovery.",
        author: "maya",
      },
    ],
    tasks: [
      {
        id: "a-t1",
        title: "Validate latency across all availability zones",
        owner: "ethan",
        done: false,
        priority: "High",
        due: "Today",
      },
    ],
  },
  {
    id: "INC-1040",
    title: "Delayed webhook processing",
    severity: "SEV2",
    status: "Monitoring",
    services: ["webhook-processor"],
    commander: "alex",
    responders: ["david"],
    created: "Today, 8:47 AM",
    duration: "2h 21m",
    description:
      "A worker backlog delayed webhook deliveries by up to 8 minutes. Queue depth is recovering after workers were scaled.",
    timeline: [
      {
        id: "w1",
        time: "8:47 AM",
        type: "alert",
        text: "Webhook delivery delay exceeded 5 minutes.",
      },
      {
        id: "w2",
        time: "9:36 AM",
        type: "status",
        text: "Worker pool scaled to 24. Monitoring queue recovery.",
        author: "alex",
      },
    ],
    tasks: [
      {
        id: "w-t1",
        title: "Confirm backlog is fully drained",
        owner: "david",
        done: false,
        priority: "Medium",
        due: "Today",
      },
    ],
  },
  {
    id: "INC-1039",
    title: "Search indexing delay for new inventory",
    severity: "SEV3",
    status: "Resolved",
    services: ["search-service", "inventory-service"],
    commander: "james",
    responders: ["olivia"],
    created: "Yesterday, 3:21 PM",
    duration: "24m",
    description:
      "Search indexing recovered after a stalled partition was reassigned.",
    timeline: [
      {
        id: "s1",
        time: "3:45 PM",
        type: "status",
        text: "All indexes caught up. Incident resolved.",
        author: "james",
      },
    ],
    tasks: [],
  },
  {
    id: "INC-1038",
    title: "Authentication failures affecting enterprise customers",
    severity: "SEV1",
    status: "Resolved",
    services: ["authentication-service"],
    commander: "james",
    responders: ["olivia", "sarah"],
    created: "Sep 5, 2:08 PM",
    duration: "47m",
    description:
      "An SSO certificate rotation affected enterprise authentication. Certificates were refreshed.",
    timeline: [
      {
        id: "au1",
        time: "2:55 PM",
        type: "status",
        text: "Enterprise SSO is healthy after certificate refresh.",
        author: "james",
      },
    ],
    tasks: [],
  },
  {
    id: "INC-1034",
    title: "Payment Gateway outage",
    severity: "SEV1",
    status: "Resolved",
    services: ["payment-gateway", "checkout-api", "billing-service"],
    commander: "sarah",
    responders: ["marcus", "priya", "elena"],
    created: "Aug 28, 9:42 AM",
    duration: "38m",
    description:
      "Connection exhaustion in the payment provider adapter caused card payment failures. A connection limit and retry policy resolved the outage.",
    timeline: [
      {
        id: "p1",
        time: "9:42 AM",
        type: "alert",
        text: "Payment success rate dropped below 95%.",
      },
      {
        id: "p2",
        time: "9:49 AM",
        type: "comment",
        text: "Connection pool exhausted in the provider adapter.",
        author: "priya",
      },
      {
        id: "p3",
        time: "10:20 AM",
        type: "status",
        text: "Connection limits deployed. Payment success rate is back to 99.9%.",
        author: "sarah",
      },
    ],
    tasks: [],
  },
  {
    id: "INC-1028",
    title: "Authentication latency incident",
    severity: "SEV2",
    status: "Resolved",
    services: ["authentication-service"],
    commander: "james",
    responders: ["olivia"],
    created: "Aug 17, 11:23 AM",
    duration: "29m",
    description:
      "A slow token validation query increased authentication latency.",
    timeline: [],
    tasks: [],
  },
  {
    id: "INC-1019",
    title: "Webhook delivery delays",
    severity: "SEV2",
    status: "Resolved",
    services: ["webhook-processor"],
    commander: "alex",
    responders: ["david"],
    created: "Aug 4, 8:12 AM",
    duration: "52m",
    description:
      "Retries from an unavailable customer endpoint saturated the webhook queue.",
    timeline: [],
    tasks: [],
  },
  {
    id: "INC-1007",
    title: "Database connection exhaustion",
    severity: "SEV0",
    status: "Resolved",
    services: ["order-service", "user-service", "checkout-api"],
    commander: "maya",
    responders: ["ethan", "james", "priya"],
    created: "Jul 22, 4:06 PM",
    duration: "1h 12m",
    description:
      "An unbounded connection pool exhausted the primary PostgreSQL database.",
    timeline: [],
    tasks: [],
  },
];

const alertRows: [string, string, Severity, string, string, string?][] = [
  [
    "Checkout error rate > 10%",
    "checkout-api",
    "SEV1",
    "Datadog",
    "10:32 AM",
    "INC-1042",
  ],
  [
    "Payment API P95 latency > 2s",
    "payment-gateway",
    "SEV1",
    "Grafana",
    "10:33 AM",
    "INC-1042",
  ],
  [
    "Payment routing config mismatch",
    "payment-gateway",
    "SEV1",
    "Custom",
    "10:52 AM",
    "INC-1042",
  ],
  [
    "Order completion rate < 95%",
    "order-service",
    "SEV2",
    "Datadog",
    "10:35 AM",
    "INC-1042",
  ],
  [
    "PostgreSQL connection pool > 90%",
    "order-service",
    "SEV2",
    "CloudWatch",
    "10:41 AM",
  ],
  [
    "API Gateway P95 latency > 500ms",
    "api-gateway",
    "SEV2",
    "Grafana",
    "9:14 AM",
    "INC-1041",
  ],
  [
    "Worker queue depth > 50k",
    "webhook-processor",
    "SEV2",
    "CloudWatch",
    "8:47 AM",
    "INC-1040",
  ],
  [
    "Webhook delivery failure rate",
    "webhook-processor",
    "SEV2",
    "Datadog",
    "8:49 AM",
    "INC-1040",
  ],
  [
    "Authentication error rate anomaly",
    "authentication-service",
    "SEV3",
    "Sentry",
    "10:56 AM",
  ],
  [
    "Redis memory utilization > 85%",
    "user-service",
    "SEV3",
    "CloudWatch",
    "10:48 AM",
  ],
  [
    "Checkout retry budget exceeded",
    "checkout-api",
    "SEV2",
    "Datadog",
    "10:36 AM",
    "INC-1042",
  ],
  [
    "Payment provider timeout increase",
    "payment-gateway",
    "SEV2",
    "Sentry",
    "10:38 AM",
    "INC-1042",
  ],
  [
    "Gateway upstream reset rate",
    "api-gateway",
    "SEV3",
    "Grafana",
    "9:18 AM",
    "INC-1041",
  ],
  [
    "Inventory cache miss rate > 20%",
    "inventory-service",
    "SEV3",
    "Datadog",
    "10:02 AM",
  ],
  [
    "Analytics consumer lag > 2m",
    "analytics-pipeline",
    "SEV3",
    "Grafana",
    "10:22 AM",
  ],
  [
    "Notification retries elevated",
    "notification-service",
    "SEV3",
    "Sentry",
    "10:53 AM",
  ],
  [
    "Billing reconciliation delay",
    "billing-service",
    "SEV3",
    "Custom",
    "10:59 AM",
  ],
  [
    "Search replica memory pressure",
    "search-service",
    "SEV3",
    "CloudWatch",
    "9:12 AM",
  ],
  [
    "API Gateway 5xx rate elevated",
    "api-gateway",
    "SEV2",
    "Datadog",
    "9:16 AM",
    "INC-1041",
  ],
  [
    "Webhook dead letter queue growth",
    "webhook-processor",
    "SEV3",
    "CloudWatch",
    "9:02 AM",
    "INC-1040",
  ],
];
export const seedAlerts: Alert[] = alertRows.map((a, i) => ({
  id: `ALT-${2841 - i}`,
  name: a[0],
  service: a[1],
  severity: a[2],
  source: a[3],
  state: i < 17 ? "Firing" : i < 19 ? "Acknowledged" : "Resolved",
  time: a[4],
  duration: `${[36, 35, 16, 33, 27, 114, 141, 139, 12, 20, 32, 30, 110, 66, 46, 15, 9, 116, 112, 126][i]}m`,
  assignee:
    i < 4
      ? ["marcus", "priya", "marcus", "liam"][i]
      : i % 3 === 0
        ? ""
        : services.find((s) => s.id === a[1])!.owner,
  incident: a[5],
}));
export const deployments: Deployment[] = [
  {
    id: "DEP-892",
    service: "payment-gateway",
    version: "4.18.2",
    commit: "a3f82c1",
    environment: "Production",
    author: "marcus",
    time: "Today, 10:28 AM",
    status: "Rolled back",
    pr: "#1842",
    incident: "INC-1042",
  },
  {
    id: "DEP-891",
    service: "notification-service",
    version: "2.9.0",
    commit: "9e4b2d7",
    environment: "Production",
    author: "alex",
    time: "Today, 10:16 AM",
    status: "Successful",
    pr: "#726",
  },
  {
    id: "DEP-890",
    service: "search-service",
    version: "3.12.1",
    commit: "c62d9f0",
    environment: "Production",
    author: "olivia",
    time: "Today, 10:11 AM",
    status: "Failed",
    pr: "#932",
  },
  {
    id: "DEP-889",
    service: "billing-service",
    version: "2.24.0",
    commit: "b182ae4",
    environment: "Staging",
    author: "elena",
    time: "Today, 10:02 AM",
    status: "Rolling out",
    pr: "#1187",
  },
  {
    id: "DEP-888",
    service: "api-gateway",
    version: "5.3.1",
    commit: "7f3a0cd",
    environment: "Production",
    author: "maya",
    time: "Today, 9:02 AM",
    status: "Successful",
    pr: "#2144",
    incident: "INC-1041",
  },
  {
    id: "DEP-887",
    service: "checkout-api",
    version: "3.6.4",
    commit: "d905cb2",
    environment: "Production",
    author: "liam",
    time: "Today, 8:34 AM",
    status: "Successful",
    pr: "#1672",
  },
  {
    id: "DEP-886",
    service: "authentication-service",
    version: "6.1.0",
    commit: "e41b873",
    environment: "Staging",
    author: "james",
    time: "Today, 8:15 AM",
    status: "Successful",
    pr: "#2601",
  },
  {
    id: "DEP-885",
    service: "payment-gateway",
    version: "4.18.1",
    commit: "2b7dc19",
    environment: "Production",
    author: "priya",
    time: "Yesterday, 2:42 PM",
    status: "Successful",
    pr: "#1831",
  },
  {
    id: "DEP-884",
    service: "inventory-service",
    version: "1.42.0",
    commit: "50d8e2a",
    environment: "Production",
    author: "ethan",
    time: "Yesterday, 11:18 AM",
    status: "Successful",
    pr: "#681",
  },
];

const paymentSections = {
  Summary:
    "On August 28, 2026, Payment Gateway experienced a 38-minute outage caused by connection exhaustion in our payment provider adapter. Card payments failed for a subset of customers between 09:42 and 10:20 UTC. The Payments team restored service by enforcing connection limits and deploying a bounded retry policy.",
  "Customer Impact":
    "Approximately 12,400 checkout attempts were affected across 840 merchants. The peak failure rate was 24.6%. Customers saw a payment processing error and could retry after recovery. No duplicate charges occurred, and no transaction data was lost. Delayed settlements completed by 12:00 UTC.",
  Detection:
    "Datadog detected the payment success rate falling below 95% at 09:42 UTC. The Payments on-call engineer, Priya Patel, acknowledged the alert within two minutes. The customer support team reported the first merchant ticket at 09:47 UTC.",
  Timeline:
    "09:42 — Payment success rate alert fired.\n09:44 — Priya Patel acknowledged and began investigation.\n09:49 — Connection pool exhaustion identified in provider adapter.\n09:52 — Sarah Chen declared SEV1 and opened the incident bridge.\n10:03 — Bounded retry policy tested in staging.\n10:11 — Hotfix rolled out to production.\n10:20 — Payment success rate returned to 99.9%.\n10:35 — Incident resolved after sustained recovery.",
  "Root Cause":
    "The provider adapter introduced in version 4.16.0 created a new HTTP connection for each retry. When our payment provider responded slowly, retries accumulated faster than connections were released. The adapter did not enforce a maximum number of concurrent connections. This exhausted the node connection limit and prevented new payment requests from completing.",
  Resolution:
    "We capped provider connections at 100 per pod and added exponential backoff with jitter. The hotfix was deployed using a canary rollout, with payment success rate and connection count verified at each stage. We drained affected pods after confirming the canary was healthy.",
  "What Went Well":
    "• Automated monitoring detected the issue before the majority of support reports.\n• The on-call runbook helped narrow the fault to the provider adapter in seven minutes.\n• Clear incident roles kept technical work and customer communication moving in parallel.",
  "What Went Poorly":
    "• Our load tests did not simulate slow provider responses with concurrent retries.\n• Connection pool utilization was not exposed on the payment service dashboard.\n• The initial alert did not include a link to the provider adapter runbook.",
  "Lessons Learned":
    "External dependencies need explicit concurrency limits, even when their expected response time is low. We will test degraded dependency behavior in staging, not only successful requests. Service dashboards must make resource saturation visible before it causes customer impact.",
};
export const seedPostmortems: Postmortem[] = [
  {
    id: "PM-104",
    title: "Payment Gateway Outage — August 28",
    incident: "INC-1034",
    severity: "SEV1",
    owner: "sarah",
    status: "In review",
    created: "Aug 29, 2026",
    sections: paymentSections,
    actions: [
      {
        id: "pa1",
        title: "Enforce bounded connection pools in all provider adapters",
        owner: "marcus",
        priority: "High",
        due: "Sep 5, 2026",
        done: true,
      },
      {
        id: "pa2",
        title: "Add connection pool metrics to payment dashboard",
        owner: "priya",
        priority: "High",
        due: "Sep 7, 2026",
        done: true,
      },
      {
        id: "pa3",
        title: "Add slow-provider scenarios to integration load tests",
        owner: "elena",
        priority: "High",
        due: "Sep 9, 2026",
        done: false,
      },
      {
        id: "pa4",
        title: "Update payment provider incident runbook",
        owner: "liam",
        priority: "Medium",
        due: "Sep 11, 2026",
        done: false,
      },
      {
        id: "pa5",
        title: "Review retry policies across Tier 1 services",
        owner: "sarah",
        priority: "Medium",
        due: "Sep 14, 2026",
        done: false,
      },
    ],
  },
  {
    id: "PM-103",
    title: "Authentication Latency Incident — August 17",
    incident: "INC-1028",
    severity: "SEV2",
    owner: "james",
    status: "Published",
    created: "Aug 18, 2026",
    sections: {
      ...paymentSections,
      Summary:
        "A missing index on the token validation table increased authentication latency for 29 minutes on August 17.",
      "Customer Impact":
        "Enterprise customers experienced slow sign-ins. No authentication data was lost.",
      "Root Cause":
        "A token query scanned the full table after a schema change.",
      Resolution: "A covering index was added and query plans were verified.",
      Detection: "Grafana P95 authentication latency monitor fired at 11:23.",
      Timeline:
        "11:23 — Alert triggered.\n11:31 — Slow query identified.\n11:52 — Index deployed; latency recovered.",
      "What Went Well": "Query tracing pinpointed the affected database call.",
      "What Went Poorly":
        "Production query plans were not checked before release.",
      "Lessons Learned": "Review query plans as part of schema migrations.",
    },
    actions: [
      {
        id: "aa1",
        title: "Add query plan checks to migrations",
        owner: "olivia",
        done: true,
        priority: "High",
        due: "Aug 25, 2026",
      },
      {
        id: "aa2",
        title: "Document token query performance budget",
        owner: "james",
        done: true,
        priority: "Medium",
        due: "Aug 28, 2026",
      },
    ],
  },
  {
    id: "PM-102",
    title: "Webhook Delivery Delays — August 4",
    incident: "INC-1019",
    severity: "SEV2",
    owner: "alex",
    status: "Draft",
    created: "Aug 5, 2026",
    sections: {
      Summary:
        "Webhook deliveries were delayed for 52 minutes when a failing customer endpoint saturated the shared queue.",
      "Customer Impact":
        "320 customers received event notifications up to 18 minutes late.",
      Detection: "Queue age exceeded the 5-minute delivery objective.",
      Timeline:
        "08:12 — Queue age alert.\n08:26 — Failing endpoint isolated.\n09:04 — Queue drained.",
      "Root Cause": "Retries for one endpoint consumed shared worker capacity.",
      Resolution: "The endpoint was quarantined and workers scaled out.",
      "What Went Well": "All queued events were eventually delivered.",
      "What Went Poorly": "Per-tenant queue limits were missing.",
      "Lessons Learned": "Isolate failure domains at the tenant level.",
    },
    actions: [
      {
        id: "wa1",
        title: "Implement per-tenant retry queues",
        owner: "david",
        done: false,
        priority: "High",
        due: "Sep 12, 2026",
      },
      {
        id: "wa2",
        title: "Add endpoint quarantine runbook",
        owner: "alex",
        done: true,
        priority: "Medium",
        due: "Aug 14, 2026",
      },
    ],
  },
  {
    id: "PM-101",
    title: "Database Connection Exhaustion — July 22",
    incident: "INC-1007",
    severity: "SEV0",
    owner: "maya",
    status: "Published",
    created: "Jul 23, 2026",
    sections: {
      Summary:
        "The primary PostgreSQL database exhausted connections during a traffic spike, causing a 72-minute cross-service outage.",
      "Customer Impact":
        "Order creation and user updates were unavailable. Read-only operations continued on replicas.",
      Detection:
        "CloudWatch connection count and API error monitors fired at 16:06.",
      Timeline:
        "16:06 — Connection alert.\n16:12 — SEV0 declared.\n16:44 — Pool limits deployed.\n17:18 — Recovery confirmed.",
      "Root Cause": "Each new worker opened an unbounded connection pool.",
      Resolution:
        "PgBouncer was enabled and per-service connection budgets enforced.",
      "What Went Well": "Database failover preserved all committed data.",
      "What Went Poorly": "Connection budgets did not account for autoscaling.",
      "Lessons Learned":
        "Model aggregate resource use at maximum replica count.",
    },
    actions: [
      {
        id: "da1",
        title: "Enforce connection budgets in service templates",
        owner: "ethan",
        done: true,
        priority: "High",
        due: "Aug 1, 2026",
      },
      {
        id: "da2",
        title: "Run database saturation game day",
        owner: "maya",
        done: true,
        priority: "High",
        due: "Aug 12, 2026",
      },
    ],
  },
];

export const seedNotifications: Notification[] = [
  {
    id: "n1",
    title: "You were added to INC-1042",
    description: "Sarah Chen added you as a responder.",
    time: "12 min ago",
    read: false,
    link: "/incidents/INC-1042",
    type: "incident",
  },
  {
    id: "n2",
    title: "Payment Gateway deployment rolled back",
    description: "v4.18.2 failed health checks after release.",
    time: "25 min ago",
    read: false,
    link: "/deployments/DEP-892",
    type: "deployment",
  },
  {
    id: "n3",
    title: "Your on-call shift starts in 30 minutes",
    description: "You are secondary for Platform at 11:30 AM.",
    time: "8 min ago",
    read: false,
    link: "/on-call",
    type: "oncall",
  },
  {
    id: "n4",
    title: "Sarah Chen mentioned you in INC-1038",
    description: "“@Alex can you review the certificate rotation?”",
    time: "1 hour ago",
    read: true,
    link: "/incidents/INC-1038",
    type: "mention",
  },
  {
    id: "n5",
    title: "Postmortem action item is due tomorrow",
    description: "Add slow-provider scenarios to integration load tests.",
    time: "2 hours ago",
    read: true,
    link: "/postmortems/PM-104",
    type: "task",
  },
  {
    id: "n6",
    title: "SEV1 alert triggered for Checkout API",
    description: "Checkout error rate exceeded the 10% threshold.",
    time: "36 min ago",
    read: false,
    link: "/alerts/ALT-2841",
    type: "alert",
  },
];

export function person(id: string) {
  return people.find((p) => p.id === id);
}
export function serviceName(id: string) {
  return services.find((s) => s.id === id)?.name ?? id;
}
export function shortName(id: string) {
  const p = person(id);
  return p
    ? `${p.name.split(" ")[0]} ${p.name.split(" ")[1][0]}.`
    : "Unassigned";
}
