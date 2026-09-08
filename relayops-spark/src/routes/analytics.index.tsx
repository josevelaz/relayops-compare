import * as React from 'react';
import * as stylex from '@stylexjs/stylex';
import { createFileRoute } from '@tanstack/react-router';
import { TrendingDown, TrendingUp } from 'lucide-react';
import { tokens } from '../styles/tokens.stylex';
import { analyticsByRange } from '../data/model';
import { BarChart, Donut, LineChart, SectionHeader, card, type } from '../components/ui';

export const Route = createFileRoute('/analytics/')({
  component: AnalyticsPage,
});

const RANGES = [
  { id: '7d', label: '7 days' },
  { id: '30d', label: '30 days' },
  { id: '90d', label: '90 days' },
  { id: '6m', label: '6 months' },
] as const;

type RangeId = (typeof RANGES)[number]['id'];

function AnalyticsPage() {
  const [range, setRange] = React.useState<RangeId>('30d');
  const d = analyticsByRange[range];
  const total = d.sevMix.reduce((a, s) => a + s.value, 0);
  const avgMttr = Math.round(d.mttr.reduce((a, v) => a + v, 0) / d.mttr.length);
  const avgMtta = (d.mtta.reduce((a, v) => a + v, 0) / d.mtta.length).toFixed(1);
  const labels = d.incidents.map((_, i) => `T${i + 1}`);
  const depRelated = Math.round(total * 0.36);
  const maxNoisy = Math.max(...d.noisyServices.map((s) => s.alerts));

  return (
    <div {...stylex.props(pg.wrap)}>
      <div {...stylex.props(pg.head)}>
        <div>
          <h1 {...stylex.props(type.h1)}>Analytics</h1>
          <p {...stylex.props(type.sub)} style={{ marginTop: 4 }}>Operational health across incidents, alerts, deploys and reliability</p>
        </div>
        <div role="tablist" aria-label="Time range" {...stylex.props(pg.ranges)}>
          {RANGES.map((r) => (
            <button key={r.id} role="tab" aria-selected={range === r.id} onClick={() => setRange(r.id)} {...stylex.props(pg.rangeBtn, range === r.id && pg.rangeOn)}>
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <div {...stylex.props(kpi.grid)}>
        <Kpi label="Incidents" value={String(total)} sub={`${d.incidents[d.incidents.length - 1]} in latest bucket`} trend={range === '7d' ? 'up' : 'flat'} />
        <Kpi label="Mean time to resolve" value={`${avgMttr}m`} sub={`Acknowledge in ${avgMtta}m avg`} trend="down" good />
        <Kpi label="Deployment-related" value={`${depRelated} (${Math.round((depRelated / total) * 100)}%)`} sub="of all incidents" trend="up" />
        <Kpi label="Reliability" value={`${d.reliability[d.reliability.length - 1].toFixed(2)}%`} sub="trailing window" trend="down" />
      </div>

      <div {...stylex.props(pg.cols2)}>
        <section {...stylex.props(card.base, card.pad)} aria-label="Incident volume">
          <SectionHeader title="Incident volume" sub={`Last ${RANGES.find((r) => r.id === range)?.label} · ${total} total`} />
          <BarChart data={d.incidents} labels={labels} color="#4f46e5" />
          <p {...stylex.props(pg.note)}>Volume is climbing into September — the Payments cluster (gateway + checkout) drives 40% of the current window.</p>
        </section>
        <section {...stylex.props(card.base, card.pad)} aria-label="Incidents by severity">
          <SectionHeader title="By severity" sub="Where the pain concentrates" />
          <Donut segments={[
            { label: 'SEV1', value: d.sevMix.find((s) => s.label === 'SEV1')?.value ?? 0, color: '#dc2626' },
            { label: 'SEV2', value: d.sevMix.find((s) => s.label === 'SEV2')?.value ?? 0, color: '#d97706' },
            { label: 'SEV3', value: d.sevMix.find((s) => s.label === 'SEV3')?.value ?? 0, color: '#94a3b8' },
          ]} />
        </section>
      </div>

      <div {...stylex.props(pg.cols2)}>
        <section {...stylex.props(card.base, card.pad)} aria-label="Response times">
          <SectionHeader title="Acknowledge & resolve" sub="Mean minutes · lower is better" />
          <LineChart
            labels={labels}
            series={[
              { label: 'MTTR', color: '#4f46e5', data: d.mttr },
              { label: 'MTTA', color: '#0d9488', data: d.mtta },
            ]}
          />
          <p {...stylex.props(pg.note)}>MTTR improved 6 minutes week-over-week as runbooks for gateway rollback matured. MTTA ticked up 1 minute — paging rules for Auth are under review.</p>
        </section>
        <section {...stylex.props(card.base, card.pad)} aria-label="Reliability trend">
          <SectionHeader title="Reliability trend" sub="Successful responses · % of total" />
          <LineChart labels={labels} series={[{ label: 'Reliability %', color: '#059669', data: d.reliability.map((v) => Number((v - 99).toFixed(3)) * 100) }]} />
          <p {...stylex.props(pg.note)}>September dipped to 99.91% during the gateway outage window. Error budget for Checkout API is 62% consumed.</p>
        </section>
      </div>

      <div {...stylex.props(pg.cols2)}>
        <section {...stylex.props(card.base, card.pad)} aria-label="Noisy services">
          <SectionHeader title="Noisiest services" sub="Alert volume in range · candidates for monitor tuning" />
          <div {...stylex.props(rows.col)}>
            {d.noisyServices.map((s) => (
              <div key={s.name}>
                <div {...stylex.props(rows.top)}><span>{s.name}</span><span><strong>{s.alerts}</strong> alerts</span></div>
                <div {...stylex.props(rows.track)}><div {...stylex.props(rows.fill)} style={{ width: `${(s.alerts / maxNoisy) * 100}%` }} /></div>
              </div>
            ))}
          </div>
        </section>
        <section {...stylex.props(card.base, card.pad)} aria-label="Incident recurrence">
          <SectionHeader title="Incident recurrence" sub="Services causing the most incidents · repeat offenders" />
          <div {...stylex.props(rows.col)}>
            {d.incidentProne.map((s) => (
              <div key={s.name} {...stylex.props(rows.recRow)}>
                <span {...stylex.props(rows.recName)}>{s.name}</span>
                <span {...stylex.props(rows.recCount)}>{s.count} incidents</span>
                {s.name === 'Payment Gateway' && <span {...stylex.props(rows.recFlag)}>recurring — 3rd this quarter</span>}
              </div>
            ))}
          </div>
          <p {...stylex.props(pg.note)}>Payment Gateway recurs across quarters (vault outage in Aug, routing incident now). Its postmortem actions are tracked on the Postmortems page.</p>
        </section>
      </div>
    </div>
  );
}

function Kpi({ label, value, sub, trend, good }: { label: string; value: string; sub: string; trend: 'up' | 'down' | 'flat'; good?: boolean }) {
  return (
    <div {...stylex.props(kpi.cell)}>
      <p {...stylex.props(type.label)}>{label}</p>
      <p {...stylex.props(kpi.value)}>{value}</p>
      <p {...stylex.props(kpi.sub)}>{sub} {trend === 'up' ? <TrendingUp size={12} /> : trend === 'down' ? <TrendingDown size={12} /> : null}</p>
      {good && <p {...stylex.props(kpi.good)}>improving</p>}
    </div>
  );
}

const pg = stylex.create({
  wrap: { display: 'flex', flexDirection: 'column', gap: 14 },
  head: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' },
  ranges: { display: 'flex', backgroundColor: '#e8edf5', borderRadius: 9, padding: 3, gap: 2 },
  rangeBtn: { borderWidth: 0, backgroundColor: 'transparent', borderRadius: 7, padding: '6px 13px', fontSize: 12, fontWeight: 700, color: tokens.muted, cursor: 'pointer' },
  rangeOn: { backgroundColor: '#fff', color: tokens.ink, boxShadow: '0 1px 3px rgba(15,23,42,0.12)' },
  cols2: { display: 'grid', gridTemplateColumns: { default: '1fr 1fr', '@media (max-width: 900px)': '1fr' }, gap: 14, alignItems: 'start' },
  note: { fontSize: 12, color: tokens.muted, lineHeight: 1.6, margin: '10px 0 0' },
});

const kpi = stylex.create({
  grid: { display: 'grid', gridTemplateColumns: { default: 'repeat(4, 1fr)', '@media (max-width: 900px)': 'repeat(2, 1fr)' }, gap: 12 },
  cell: { backgroundColor: '#fff', borderWidth: 1, borderStyle: 'solid', borderColor: tokens.line, borderRadius: 12, padding: 16 },
  value: { margin: '4px 0 2px', fontSize: 24, fontWeight: 800, color: tokens.ink },
  sub: { margin: 0, fontSize: 12, color: tokens.muted, display: 'flex', gap: 5, alignItems: 'center' },
  good: { margin: '4px 0 0', fontSize: 11, fontWeight: 800, color: tokens.ok },
});

const rows = stylex.create({
  col: { display: 'flex', flexDirection: 'column', gap: 12, marginTop: 4 },
  top: { display: 'flex', justifyContent: 'space-between', fontSize: 13, color: tokens.ink2, fontWeight: 600, marginBottom: 5 },
  track: { height: 9, borderRadius: 999, backgroundColor: '#eef2ff', overflow: 'hidden' },
  fill: { height: '100%', backgroundColor: '#4f46e5', borderRadius: 999 },
  recRow: { display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0', borderBottomWidth: 1, borderBottomStyle: 'solid', borderBottomColor: '#f1f5f9', fontSize: 13 },
  recName: { fontWeight: 700, color: tokens.ink, flex: 1 },
  recCount: { color: tokens.muted, fontWeight: 600 },
  recFlag: { fontSize: 11, fontWeight: 800, color: '#b45309', backgroundColor: '#fffbeb', borderRadius: 999, padding: '2px 9px' },
});
