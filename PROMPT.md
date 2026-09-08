# UI Design Benchmark: Complex SaaS Application

You are being evaluated on your ability to design and implement a polished, complex SaaS application.

This is a benchmark of product design, UI design, UX design, information architecture, interaction design, frontend engineering, and overall implementation quality.

You must build the application described below.

Do not ask clarifying questions.

Do not simplify the product.

Do not remove features because they are difficult to implement.

Do not substitute major features with placeholder text describing what could exist.

Make reasonable implementation decisions where necessary, but do not change the product requirements.

The visual design, layout, interaction patterns, navigation model, component composition, visual hierarchy, density, motion, typography, spacing, color system, and overall UX are intentionally unspecified. Those decisions are entirely yours.

Your goal is to produce the best SaaS product experience you can.

---

# Product

Build a SaaS application called **RelayOps**.

RelayOps is an incident management and operational intelligence platform used by engineering organizations.

It combines:

* incident management
* service ownership
* alert triage
* on-call coordination
* deployment tracking
* postmortems
* operational analytics
* team collaboration

The application should feel like a real product used daily by engineering teams rather than a collection of disconnected dashboard widgets.

Assume the primary users are:

* software engineers
* site reliability engineers
* engineering managers
* incident commanders
* platform engineers
* operations teams

The application is a multi-user B2B SaaS product.

---

# Technical Requirements

You must use:

* React
* TanStack Start
* TypeScript
* StyleX

Use StyleX as the primary styling system.

Do not use:

* Tailwind CSS
* shadcn/ui
* Material UI
* Chakra UI
* Ant Design
* Bootstrap
* prebuilt application templates

You may use small supporting libraries where appropriate, such as:

* icon libraries
* charting libraries
* date libraries
* utility libraries

Do not use another component framework to provide the application's design system.

Build the interface from your own components.

---

# Application Requirements

The finished application must contain all major areas described below.

The application should have enough realistic data to make every screen useful.

Do not use empty states as a substitute for implementing the interface.

---

# 1. Global Application Shell

Design a complete authenticated SaaS application shell.

It must support navigation between:

* Overview
* Incidents
* Alerts
* Services
* Deployments
* On-call
* Analytics
* Postmortems
* Teams
* Settings

Also provide access to:

* global search
* notifications
* user account
* workspace selection
* quick actions

The navigation architecture is up to you.

The application should remain usable as the number of services, teams, incidents, and alerts grows substantially.

---

# 2. Global Search

Implement a global search experience.

The user should be able to search across:

* incidents
* services
* teams
* people
* alerts
* deployments
* postmortems

Search results should clearly distinguish resource types.

Example searches:

* "payment"
* "database latency"
* "INC-1042"
* "Sarah Chen"

The search experience should support keyboard-oriented use.

---

# 3. Overview

Create an operational overview for the organization.

It must communicate the current operational state quickly.

Include meaningful representations of:

* active incidents
* alert volume
* service health
* current on-call personnel
* recent deployments
* incident trends
* MTTR
* reliability or uptime
* important changes requiring attention

There should be enough information for an engineering manager or SRE to understand what is happening without opening every section.

Do not make this a generic grid of unrelated stat cards.

Create a coherent operational dashboard.

---

# 4. Incidents

Implement a full incident management area.

## Incident list

Include incidents with:

* ID
* title
* severity
* status
* impacted services
* commander
* created time
* duration
* responders

Required severity levels:

* SEV0
* SEV1
* SEV2
* SEV3

Required statuses:

* Investigating
* Identified
* Monitoring
* Resolved

Users must be able to:

* search incidents
* filter incidents
* sort incidents
* change views or grouping if appropriate
* quickly distinguish active and resolved incidents
* create an incident

Use realistic incident data.

Examples:

* Checkout failures after payment gateway deployment
* Elevated API latency in us-east-1
* Authentication failures affecting enterprise customers
* Delayed webhook processing
* Database connection exhaustion

---

# 5. Incident Detail

This is one of the most important screens in the benchmark.

Create a rich incident workspace for:

**INC-1042: Checkout failures after payment gateway deployment**

Severity:

**SEV1**

Status:

**Investigating**

Started:

**Today at 10:32 AM**

Affected services:

* Checkout API
* Payment Gateway
* Order Service

Incident commander:

**Sarah Chen**

Responders:

* Marcus Johnson
* Priya Patel
* Liam Brooks
* Elena Rodriguez

Include the following capabilities.

## Incident status

Show:

* current severity
* current status
* duration
* customer impact
* affected services
* commander
* responders

Users should be able to update relevant incident properties.

## Timeline

Create an incident timeline containing realistic entries such as:

10:32 AM
Automated monitoring detected checkout error rate above 18%.

10:34 AM
Incident INC-1042 automatically created.

10:36 AM
Sarah Chen assigned as incident commander.

10:39 AM
Payment Gateway deployment `payment-gateway@4.18.2` identified as a possible trigger.

10:43 AM
Rollback initiated.

10:48 AM
Checkout error rate decreased from 21.4% to 8.7%.

10:53 AM
Engineers identified stale payment routing configuration on two instances.

11:01 AM
Configuration refresh initiated.

Include multiple event types such as:

* system events
* human updates
* alerts
* deployment events
* status changes
* comments

The timeline should be easy to scan during a high-pressure incident.

## Collaboration

Allow responders to post incident updates or notes.

Include examples of existing discussion.

## Alerts

Show alerts associated with the incident.

## Deployments

Show potentially related deployments.

## Service impact

Show affected services and their current health.

## Tasks

Include incident tasks such as:

* Verify rollback completion
* Compare routing config across gateway instances
* Contact payment provider if failure rate remains elevated
* Prepare customer status update

Tasks should have owners and completion states.

## Customer communication

Provide an area for customer-facing or internal status updates.

## Incident controls

Include relevant incident actions such as:

* change status
* change severity
* add responder
* assign commander
* resolve incident
* create follow-up action
* create postmortem

You decide how these actions should appear.

---

# 6. Alerts

Build an alert management interface.

Alerts should contain:

* alert name
* service
* severity
* source
* state
* triggered time
* duration
* assignee
* related incident, if any

Example alerts:

* Checkout error rate > 10%
* Payment API P95 latency > 2s
* PostgreSQL connection pool > 90%
* Worker queue depth > 50k
* Authentication error rate anomaly
* Redis memory utilization > 85%
* Webhook delivery failure rate

Sources can include:

* Datadog
* Grafana
* CloudWatch
* Sentry
* custom monitors

Users should be able to:

* search
* filter
* acknowledge alerts
* assign alerts
* inspect alerts
* associate alerts with incidents
* create incidents from alerts

Represent alert noise and urgency clearly.

---

# 7. Services

Build a service catalog.

The organization has these services:

* Checkout API
* Payment Gateway
* Order Service
* Authentication Service
* User Service
* Notification Service
* Webhook Processor
* Billing Service
* API Gateway
* Search Service
* Inventory Service
* Analytics Pipeline

Each service should have useful metadata such as:

* owner
* team
* tier
* current health
* uptime
* open incidents
* active alerts
* recent deployment
* technology
* repository

Service tiers:

* Tier 1
* Tier 2
* Tier 3

---

# 8. Service Detail

Create a full detail view for:

**Payment Gateway**

Metadata:

Team: Payments
Tier: Tier 1
Repository: `relay/payment-gateway`
Runtime: Node.js
Infrastructure: Kubernetes
Primary region: us-east-1

Show useful operational information including:

* current health
* ownership
* on-call contact
* active alerts
* active incidents
* recent deployments
* reliability
* latency
* error rate
* dependencies
* recent changes

Dependencies:

Payment Gateway depends on:

* Authentication Service
* Billing Service

Dependent services:

* Checkout API
* Order Service

Provide a useful representation of service relationships.

---

# 9. Deployments

Create a deployment activity area.

Deployments should contain:

* service
* version
* commit
* environment
* author
* timestamp
* status
* linked pull request
* related incidents

Environments:

* Production
* Staging

Statuses:

* Successful
* Failed
* Rolling out
* Rolled back

Include realistic deployment entries.

Make it easy to notice deployments that correlate with operational problems.

---

# 10. On-call

Build an on-call management interface.

Teams:

* Platform
* Payments
* Core API
* Infrastructure
* Developer Experience

Show:

* who is currently on call
* primary engineer
* secondary engineer
* shift duration
* next person
* escalation policy

Provide a schedule view.

Include enough information to understand coverage for the current week.

You decide whether the best representation is a calendar, timeline, roster, table, or another interface.

---

# 11. Analytics

Create a meaningful operational analytics section.

Include analysis for:

* incident volume
* incidents by severity
* mean time to acknowledge
* mean time to resolve
* alert volume
* noisy services
* services causing the most incidents
* deployment-related incidents
* reliability trends
* incident recurrence

Support an adjustable time range.

Suggested ranges:

* 7 days
* 30 days
* 90 days
* 6 months

Use charts only when they improve comprehension.

Do not fill the screen with charts simply because this is an analytics page.

Include enough underlying data to make the analytics believable.

---

# 12. Postmortems

Build a postmortem management area.

Include:

* Draft
* In review
* Published

Example postmortems:

* Payment Gateway Outage - August 28
* Authentication Latency Incident - August 17
* Webhook Delivery Delays - August 4
* Database Connection Exhaustion - July 22

Show:

* incident
* severity
* owner
* status
* created date
* action item progress

Users should be able to open a postmortem.

---

# 13. Postmortem Detail

Create a postmortem for a resolved historical incident.

Include structured sections for:

* Summary
* Customer Impact
* Detection
* Timeline
* Root Cause
* Resolution
* What Went Well
* What Went Poorly
* Lessons Learned
* Corrective Actions

Corrective actions should support:

* owner
* priority
* due date
* status

The interface should work for reading and editing a postmortem.

---

# 14. Teams

Create a team directory.

Teams:

* Platform
* Payments
* Core API
* Infrastructure
* Developer Experience

Each team should contain:

* team lead
* members
* owned services
* current on-call
* open incidents
* reliability summary

Create a detailed team view for the Payments team.

Payments team members:

* Sarah Chen, Engineering Manager
* Marcus Johnson, Senior Software Engineer
* Priya Patel, Site Reliability Engineer
* Liam Brooks, Software Engineer
* Elena Rodriguez, Senior Software Engineer
* Noah Williams, Software Engineer

Owned services:

* Payment Gateway
* Checkout API
* Billing Service

---

# 15. Notifications

Implement a useful notification experience.

Examples:

* You were added to INC-1042.
* Payment Gateway deployment failed.
* You are on call in 30 minutes.
* Sarah Chen mentioned you in INC-1038.
* Postmortem action item is due tomorrow.
* SEV1 alert triggered for Checkout API.

Notifications should support read and unread states.

---

# 16. Quick Actions

Provide an efficient quick-action mechanism.

At minimum users should be able to quickly:

* create incident
* search
* acknowledge alert
* jump to service
* view on-call
* create postmortem

You decide how this should work.

Keyboard-oriented interaction is encouraged.

---

# 17. Create Incident Flow

Create a complete incident creation flow.

Fields should include:

* title
* severity
* affected services
* incident commander
* responders
* description

Users should be able to create an incident without leaving the operational context unnecessarily.

The workflow should account for incidents being created under pressure.

---

# 18. Settings

Build a realistic SaaS settings area.

Include sections for:

## Workspace

* workspace name
* organization information
* timezone

## Members

* name
* email
* role
* status

Roles:

* Admin
* Member
* Viewer

## Integrations

Show integrations such as:

* GitHub
* Slack
* Datadog
* PagerDuty
* Sentry
* AWS
* Grafana

Represent whether each integration is connected.

## Incident configuration

Include settings for:

* severity definitions
* incident statuses
* default incident commander behavior
* automatic incident creation

## Notifications

Allow configuration of notification preferences.

---

# Responsive Behavior

The product is primarily a desktop SaaS application, but the application must remain usable at smaller viewport sizes.

At minimum consider:

* 1440px desktop
* 1024px laptop or tablet landscape
* approximately 390px mobile

Do not simply hide all complex functionality on mobile.

Adapt the experience appropriately.

---

# Accessibility

Implement reasonable accessibility practices.

Include:

* semantic HTML
* keyboard navigation
* visible focus states
* accessible form labels
* sufficient contrast
* appropriate ARIA only where needed
* controls that do not depend only on color

---

# Interaction Quality

The product should feel interactive.

Implement appropriate behaviors for elements such as:

* navigation
* filters
* search
* dropdowns
* tabs
* forms
* dialogs
* command interfaces
* notifications
* status changes
* incident actions

Actions do not require a real backend, but interactions should behave convincingly in the frontend.

For example:

* filters should alter visible results
* search should return matching resources
* dialogs should open and close
* incident creation should behave like a real workflow
* tabs should change content
* selected states should work
* forms should validate where appropriate

Do not make a static screenshot disguised as an application.

---

# Data Requirements

Use realistic seeded data throughout the product.

Data must remain internally consistent.

For example:

If Payment Gateway is affected by INC-1042:

* the service should show the incident
* the incident should show the service
* related alerts should reference the incident
* related deployments should appear where appropriate

If Sarah Chen is incident commander:

* her role should remain consistent throughout the application

If a deployment caused or correlates with an incident:

* that relationship should appear in both relevant places

Avoid random independent mock data.

Treat the application as one coherent data model.

---

# Visual and UX Freedom

You have complete control over the product's visual and interaction design.

There is deliberately no prescribed:

* design style
* color palette
* typography
* border radius
* spacing scale
* navigation pattern
* sidebar structure
* information density
* dashboard arrangement
* table design
* card design
* modal design
* chart style
* icon style
* visual hierarchy

Do not ask for design direction.

Do not imitate a specific existing product unless you independently conclude that some established pattern produces the best UX.

Make these decisions yourself.

This freedom is part of the benchmark.

---

# Design Expectations

Your design should demonstrate strong judgment in:

* information architecture
* navigation
* hierarchy
* data density
* legibility
* discoverability
* consistency
* task efficiency
* visual polish
* interaction feedback
* accessibility
* use of whitespace
* use of color
* complex-state presentation
* progressive disclosure
* prioritization of urgent information

Operational software has competing requirements.

It must expose large amounts of information while allowing users to quickly identify what matters.

Solve that problem through design.

---

# Engineering Expectations

Build maintainable application code.

Avoid implementing the entire application in one component.

Create reusable primitives and domain components where appropriate.

Examples may include:

* application shell
* navigation
* status indicators
* severity indicators
* data tables
* filtering controls
* dialogs
* command interfaces
* timelines
* avatars
* metric displays
* service health indicators

Do not over-engineer abstractions for components used only once.

Use TypeScript properly.

Avoid unnecessary `any`.

Keep data models coherent.

Use StyleX consistently.

---

# State

A real backend is not required.

Use local mock data and frontend state where appropriate.

The application should work immediately after startup without external accounts, API keys, authentication services, or databases.

Do not require the evaluator to configure third-party services.

---

# Sample Organization

Use the organization:

**Northstar Labs**

Workspace:

**Production Engineering**

The organization has approximately:

* 85 engineers
* 12 engineering teams
* 47 production services
* 1.8 million requests per minute at peak

You only need to explicitly model the teams and services required above, but the UI may reflect the larger organization where useful.

---

# Current Operational Context

Use this scenario to make the application feel alive.

Today is a normal workday, but a SEV1 incident is currently active.

Active incident:

**INC-1042: Checkout failures after payment gateway deployment**

Current incident status:

Investigating

Current error rate:

8.7%

Peak error rate:

21.4%

Normal error rate:

below 0.5%

A rollback has already occurred, but some checkout failures remain.

The Payments team is actively investigating configuration differences between gateway instances.

There are also:

* 2 SEV2 incidents being monitored
* 17 currently firing alerts
* 3 production deployments in the last hour
* 1 failed deployment
* 2 engineers beginning on-call shifts later today

Reflect this context throughout the product where relevant.

---

# Completion Standard

A successful submission should feel like a credible SaaS product that could be demonstrated to customers.

Prioritize working depth over superficial breadth, but every required major section must exist.

Do not stop after creating an attractive overview page.

Do not provide only wireframes.

Do not provide only design specifications.

Do not provide screenshots instead of the application.

Implement the application.

Before considering the task complete, verify:

1. Every required navigation section exists.
2. The main screens contain meaningful realistic data.
3. INC-1042 has a detailed operational workspace.
4. Payment Gateway has a detailed service view.
5. The Payments team has a detailed team view.
6. A postmortem detail experience exists.
7. Search works.
8. Filters behave interactively.
9. At least one create or edit workflow works.
10. Navigation works.
11. The application is responsive.
12. StyleX is actually used for application styling.
13. The data remains consistent across screens.
14. The application runs without external configuration.

---

# Final Instruction

Treat this as both a product design exercise and an engineering exercise.

Do not explain what you would build.

Build it.

Do not ask me to choose a design direction.

Do not ask for product clarification.

The product requirements above are authoritative.

All UI and UX decisions that are not explicitly defined are yours to make.

Use your own judgment and produce the strongest implementation you can.
