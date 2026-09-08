import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { ArrowDownRight, ArrowUpRight, Download, Repeat2, TrendingDown } from 'lucide-react';
import { useStore } from '../state/store';
import { servicePath } from '../data/model';
import { AppLink, Badge, Button, PageHeader, Panel, Progress, Select, Status, ui } from '../components/ui';
import { ChartLegend, Sparkline, TrendChart } from '../components/Charts';

const periods = {
  '7 days': { incidents: 8, reduction: 20, mtta: 2.1, mttr: 29, alerts: 312, deploy: 3, severity: [0, 1, 5, 2] },
  '30 days': { incidents: 28, reduction: 22, mtta: 2.4, mttr: 32, alerts: 1284, deploy: 9, severity: [0, 5, 14, 9] },
  '90 days': { incidents: 91, reduction: 22, mtta: 3.1, mttr: 41, alerts: 4682, deploy: 28, severity: [2, 15, 43, 31] },
  '6 months': { incidents: 204, reduction: 22, mtta: 3.8, mttr: 47, alerts: 10921, deploy: 64, severity: [3, 34, 92, 75] },
};
const noisy = [
  { name: 'Payment Gateway', incidents: 7, alerts: 328, mttr: 41, recurrence: 'Routing & configuration', share: 26 },
  { name: 'Webhook Processor', incidents: 5, alerts: 264, mttr: 38, recurrence: 'Queue saturation', share: 21 },
  { name: 'API Gateway', incidents: 4, alerts: 182, mttr: 24, recurrence: 'Regional latency', share: 14 },
  { name: 'Authentication Service', incidents: 3, alerts: 146, mttr: 28, recurrence: 'Certificate rotation', share: 11 },
  { name: 'Order Service', incidents: 3, alerts: 131, mttr: 36, recurrence: 'Connection limits', share: 10 },
];
const s = stylex.create({
  metrics: { display: 'grid', gridTemplateColumns: { default: 'repeat(4, minmax(0, 1fr))', '@media (max-width: 650px)': 'repeat(2, minmax(0, 1fr))' }, backgroundColor: '#fff', border: '1px solid #e1e7e3', borderRadius: 9, marginBottom: 23 },
  metric: { padding: { default: 21, '@media (max-width: 650px)': 16 }, borderRight: '1px solid #e9eeea', minWidth: 0 },
  value: { fontFamily: 'Manrope, sans-serif', fontSize: 29, letterSpacing: '-1px', fontWeight: 750, margin: '13px 0 9px', color: '#355343' },
  chartGrid: { display: 'grid', gridTemplateColumns: { default: 'minmax(0, 1.7fr) minmax(260px, 1fr)', '@media (max-width: 900px)': '1fr' }, gap: 20 },
  severity: { display: 'flex', height: 23, borderRadius: 4, overflow: 'hidden', gap: 3, margin: '19px 0 24px' },
  segment: (weight: number, color: string) => ({ flex: weight, backgroundColor: color }),
  severityRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 0', borderBottom: '1px solid #edf1ee' },
  insight: { display: 'flex', gap: 12, alignItems: 'flex-start', padding: 19, border: '1px solid #dcebe1', backgroundColor: '#f1f8f3', borderRadius: 8 },
  bars: { display: 'flex', alignItems: 'end', height: 98, gap: 7, margin: '22px 0 12px' },
  bar: (height: number, color: string) => ({ flex: 1, height: `${height}%`, backgroundColor: color, borderRadius: '3px 3px 0 0' }),
  reliabilityRow: { padding: '13px 0', borderBottom: '1px solid #eaf0eb' },
});

export function Analytics() {
  const { notify } = useStore();
  const [range, setRange] = useState<keyof typeof periods>('30 days');
  const period = periods[range];
  const factor = period.incidents / 28;
  const recurring = Math.round(period.incidents * .18);
  const configurationEvents = Math.ceil(recurring * .6);
  const metrics = [
    { label: 'Total incidents', value: period.incidents, suffix: '', change: `${period.reduction}%` },
    { label: 'Mean time to acknowledge', value: period.mtta, suffix: 'min', change: '16%' },
    { label: 'Mean time to resolve', value: period.mttr, suffix: 'min', change: '18%' },
    { label: 'Alert volume', value: period.alerts.toLocaleString(), suffix: '', change: '14%' },
  ];
  function exportReport() {
    const rows = ['Service,Incidents,Alerts,MTTR (min)', ...noisy.map(service => `${service.name},${Math.max(1, Math.round(service.incidents * factor))},${Math.round(service.alerts * period.alerts / 1284)},${service.mttr}`)];
    const url = URL.createObjectURL(new Blob([rows.join('\n')], { type: 'text/csv' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `relayops-analytics-${range.replace(' ', '-')}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    notify('Analytics report exported');
  }
  return (
    <>
      <PageHeader title="Operational analytics" description="Learn from your operations. Build a more reliable tomorrow." actions={<>
        <Select aria-label="Analytics time range" value={range} onChange={event => setRange(event.target.value as keyof typeof periods)}>{Object.keys(periods).map(value => <option key={value}>{value}</option>)}</Select>
        <Button onClick={exportReport}><Download size={14} />Export report</Button>
      </>} />
      <div {...stylex.props(s.metrics)}>
        {metrics.map(metric => <div key={metric.label} {...stylex.props(s.metric)}>
          <p {...stylex.props(ui.small, ui.muted)}>{metric.label}</p>
          <div {...stylex.props(ui.between)}><div {...stylex.props(s.value)}>{metric.value}<span {...stylex.props(ui.small, ui.muted)}> {metric.suffix}</span></div><Sparkline down /></div>
          <p {...stylex.props(ui.row, ui.wrap, ui.tiny, ui.muted)}><span {...stylex.props(ui.row, ui.green)}><ArrowDownRight size={12} />{metric.change}</span>vs. previous period</p>
        </div>)}
      </div>
      <div {...stylex.props(ui.stack)}>
        <div {...stylex.props(s.chartGrid)}>
          <Panel title="Incident volume" aside={<ChartLegend />}>
            <TrendChart large range={range} />
            <p {...stylex.props(ui.small, ui.secondary)}>Incident frequency is trending down. The reporting snapshot includes {period.incidents} incidents across 47 production services.</p>
          </Panel>
          <Panel title="Incidents by severity" aside={<Badge>{period.incidents} total</Badge>}>
            <div {...stylex.props(s.severity)}>{period.severity.map((count, index) => <div key={index} {...stylex.props(s.segment(count, ['#b95950', '#df9b7c', '#dbc294', '#a1bdac'][index]))} />)}</div>
            {period.severity.map((count, index) => <div key={index} {...stylex.props(s.severityRow)}><Status value={`SEV${index}`} /><span {...stylex.props(ui.small, ui.muted)}>{['Critical', 'Major', 'Moderate', 'Minor'][index]}</span><strong>{count}</strong><span {...stylex.props(ui.tiny, ui.muted)}>{Math.round(count / period.incidents * 100)}%</span></div>)}
          </Panel>
        </div>
        <div {...stylex.props(s.insight)}><TrendingDown size={21} color="#539b6b" /><div><strong {...stylex.props(ui.small, ui.green)}>Less noise. Faster response.</strong><p {...stylex.props(ui.small, ui.secondary)}>Alert grouping and updated routing reduced duplicate pages by 14%. Your team now acknowledges incidents in {period.mtta} minutes on average, down from {(period.mtta / .84).toFixed(1)} minutes in the prior period.</p></div></div>
        <Panel title="Where to focus" aside={<Badge>Service contribution · {range}</Badge>} noPadding>
          <div {...stylex.props(ui.tableWrap)}>
            <table {...stylex.props(ui.table)}>
              <thead><tr>{['Service', 'Incidents', 'Alert volume', 'MTTR', 'Recurring pattern', 'Share of alerts'].map(heading => <th key={heading} scope="col" {...stylex.props(ui.th)}>{heading}</th>)}</tr></thead>
              <tbody>{noisy.map(service => <tr key={service.name} {...stylex.props(ui.tr)}>
                <td {...stylex.props(ui.td)}><AppLink to={servicePath(service.name)}>{service.name}</AppLink></td>
                <td {...stylex.props(ui.td)}>{Math.max(1, Math.round(service.incidents * factor))}</td>
                <td {...stylex.props(ui.td)}>{Math.round(service.alerts * period.alerts / 1284)}</td>
                <td {...stylex.props(ui.td)}>{service.mttr} min</td>
                <td {...stylex.props(ui.td)}>{service.recurrence}</td>
                <td {...stylex.props(ui.td)}><div {...stylex.props(ui.stackSmall)}><span>{service.share}%</span><Progress value={service.share} /></div></td>
              </tr>)}</tbody>
            </table>
          </div>
          <div {...stylex.props(ui.pad, ui.small, ui.muted)}>Top 5 services by incident count. Other services account for the remaining {period.incidents - noisy.reduce((sum, service) => sum + Math.max(1, Math.round(service.incidents * factor)), 0)} incidents.</div>
        </Panel>
        <div {...stylex.props(ui.grid3)}>
          <Panel title="Deployment-related incidents">
            <div {...stylex.props(s.value)}>{Math.round(period.deploy / period.incidents * 100)}<span {...stylex.props(ui.small)}>%</span></div>
            <p {...stylex.props(ui.small, ui.secondary)}>{period.deploy} of {period.incidents} incidents correlated with a deployment in the preceding 30 minutes.</p>
            <div {...stylex.props(s.bars)}>{[80, 72, 88, 64, 58, 67, 42, 38, 52, 34, 30, 32].map((value, index) => <div key={index} {...stylex.props(s.bar(value, index > 8 ? '#78ad8c' : '#c3d7ca'))} />)}</div>
            <AppLink to="/deployments">Inspect recent changes <ArrowUpRight size={12} /></AppLink>
          </Panel>
          <Panel title="Reliability trends">
            <div {...stylex.props(s.value)}>99.97<span {...stylex.props(ui.small)}>%</span></div>
            <p {...stylex.props(ui.small, ui.secondary)}>Overall availability · 0.02% above the previous period</p>
            {[{ tier: 'Tier 1', value: 99.95 }, { tier: 'Tier 2', value: 99.99 }, { tier: 'Tier 3', value: 99.97 }].map(tier => <div key={tier.tier} {...stylex.props(s.reliabilityRow)}><div {...stylex.props(ui.between)}><span {...stylex.props(ui.small, ui.muted)}>{tier.tier}</span><span {...stylex.props(ui.small, ui.green)}>{tier.value}%</span></div><Progress value={tier.value} /></div>)}
          </Panel>
          <Panel title="Incident recurrence">
            <div {...stylex.props(s.value)}>{recurring}<span {...stylex.props(ui.small, ui.muted)}> recurring incidents</span></div>
            <p {...stylex.props(ui.small, ui.secondary)}>{Math.round(recurring / period.incidents * 100)}% of incidents share a root cause with a previous event.</p>
            <hr {...stylex.props(ui.divider)} />
            <div {...stylex.props(ui.stackSmall)}>
              <p {...stylex.props(ui.row, ui.small, ui.amber)}><Repeat2 size={14} />Configuration drift · {configurationEvents} events</p>
              <p {...stylex.props(ui.row, ui.small, ui.muted)}><Repeat2 size={14} />Connection limits · {recurring - configurationEvents} events</p>
              <AppLink to="/postmortems">Review corrective actions <ArrowUpRight size={12} /></AppLink>
            </div>
          </Panel>
        </div>
      </div>
    </>
  );
}
