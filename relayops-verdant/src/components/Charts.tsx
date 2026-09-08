import * as stylex from '@stylexjs/stylex';
import { useId, useState } from 'react';
import { ui } from './ui';

const s = stylex.create({
  chart: { width: '100%', height: 'auto', overflow: 'visible', display: 'block' },
  chartBox: { position: 'relative', width: '100%' },
  tip: { position: 'absolute', top: 1, right: 3, fontSize: 11, color: '#498272', backgroundColor: '#eff8f4', padding: '5px 8px', borderRadius: 4 },
  healthBars: { display: 'flex', gap: 3, height: 28, width: '100%', alignItems: 'stretch' },
  healthBar: (color: string) => ({ backgroundColor: color, flex: 1, minWidth: 2, borderRadius: 2 }),
  legend: { display: 'flex', gap: 18, fontSize: 10, color: '#657a6d', marginTop: 10 },
  sparkline: { display: { default: 'block', '@media (max-width: 650px)': 'none' }, flexShrink: 1, minWidth: 0 },
});

const incidentSeries: Record<string, { values: number[]; previous: number[]; labels: string[]; unit: string }> = {
  '7 days': {
    values: [1, 0, 1, 0, 1, 2, 3],
    previous: [2, 1, 1, 2, 1, 1, 2],
    labels: ['Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue'],
    unit: 'day',
  },
  '30 days': {
    values: [1, 0, 1, 1, 0, 2, 0, 1, 1, 1, 2, 1, 1, 0, 2, 0, 1, 1, 0, 1, 1, 0, 2, 1, 0, 1, 1, 0, 2, 3],
    previous: [2, 1, 1, 2, 0, 2, 1, 0, 2, 1, 2, 1, 1, 0, 2, 0, 1, 1, 2, 1, 1, 0, 2, 1, 1, 2, 1, 0, 2, 3],
    labels: ['Aug 10', 'Aug 17', 'Aug 24', 'Aug 31', 'Sep 8'],
    unit: 'day',
  },
  '90 days': {
    values: [9, 8, 10, 7, 8, 6, 9, 5, 7, 4, 6, 4, 8],
    previous: [12, 9, 11, 10, 9, 8, 11, 9, 8, 7, 9, 6, 8],
    labels: ['Jun 11', 'Jul 1', 'Jul 21', 'Aug 10', 'Sep 8'],
    unit: 'week',
  },
  '6 months': {
    values: [45, 40, 35, 31, 25, 28],
    previous: [55, 49, 45, 43, 38, 31],
    labels: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
    unit: 'month',
  },
};

export function TrendChart({ large = false, range = '30 days', errorRate = false }: { large?: boolean; range?: string; errorRate?: boolean }) {
  const id = useId().replace(/:/g, '');
  const [hover, setHover] = useState<number | null>(null);
  const series = incidentSeries[range] ?? incidentSeries['30 days'];
  const data = errorRate
    ? [0.3, 0.2, 0.4, 0.3, 0.4, 0.5, 4.7, 9.6, 19.3, 21.4, 16.7, 14.1, 9.6, 9.2, 9, 8.9, 8.8, 8.7, 8.8, 8.7, 8.7, 8.7]
    : series.values;
  const width = 650;
  const height = large ? 240 : 180;
  const left = 28;
  const bottom = height - 25;
  const maximum = errorRate ? 24 : Math.ceil(Math.max(...data, ...series.previous) / 3) * 3;
  const points = data.map((value, index) => [left + index * (width - left - 10) / (data.length - 1), bottom - value / maximum * (height - 52)]);
  const path = points.map((point, index) => `${index ? 'L' : 'M'} ${point.join(' ')}`).join(' ');
  const previousPath = series.previous.map((value, index) => `${index ? 'L' : 'M'} ${left + index * (width - left - 10) / (series.previous.length - 1)} ${bottom - value / maximum * (height - 52)}`).join(' ');
  const labels = errorRate ? ['10:00', '10:15', '10:30', '10:45', '11:00'] : series.labels;
  const color = errorRate ? '#d1765d' : '#329476';

  return (
    <div {...stylex.props(s.chartBox)}>
      {hover !== null && hover < data.length && <div {...stylex.props(s.tip)}>{errorRate ? `${data[hover].toFixed(1)}% error rate` : `${data[hover]} incidents · ${series.unit} ${hover + 1}`}</div>}
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={errorRate ? 'Checkout error rate: peaked at 21.4%, now 8.7%' : `${data.reduce((sum, value) => sum + value, 0)} incidents over ${range}`} {...stylex.props(s.chart)}>
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity=".20" />
            <stop offset="100%" stopColor={color} stopOpacity=".01" />
          </linearGradient>
        </defs>
        {[0, 1, 2, 3].map(index => {
          const y = 27 + (bottom - 27) * index / 3;
          return <g key={index}><line x1={left} y1={y} x2={width} y2={y} stroke="#edf1f1" strokeDasharray="3 4" /><text x="0" y={y + 3} fill="#728278" fontSize="9">{maximum - index * maximum / 3}{errorRate ? '%' : ''}</text></g>;
        })}
        <path d={`${path} L ${width - 10} ${bottom} L ${left} ${bottom} Z`} fill={`url(#${id})`} />
        {!errorRate && <path d={previousPath} fill="none" stroke="#c0cec4" strokeWidth="1.5" strokeDasharray="4 4" />}
        <path d={path} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" />
        {points.map((point, index) => <rect key={index} x={point[0] - 9} y="0" width="18" height={bottom} fill="transparent" onMouseEnter={() => setHover(index)} onMouseLeave={() => setHover(null)}><title>{data[index]} {errorRate ? 'percent errors' : 'incidents'}</title></rect>)}
        {labels.map((label, index) => <text key={label} x={left + index * (width - left - 20) / (labels.length - 1)} y={height - 4} fill="#728278" fontSize="9" textAnchor={index === labels.length - 1 ? 'end' : 'start'}>{label}</text>)}
      </svg>
    </div>
  );
}

export function Sparkline({ color = '#3b9b7d', down = false }: { color?: string; down?: boolean }) {
  return (
    <svg width="89" height="30" viewBox="0 0 89 30" aria-hidden="true" {...stylex.props(s.sparkline)}>
      <path d={down ? 'M1 6L9 9 17 5 25 14 33 10 41 16 49 12 57 21 65 17 73 22 81 19 88 24' : 'M1 23L9 24 17 17 25 19 33 13 41 16 49 9 57 13 65 7 73 9 81 4 88 6'} fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function UptimeBars({ degraded = false }: { degraded?: boolean }) {
  return <div {...stylex.props(s.healthBars)}>{Array.from({ length: 45 }, (_, index) => <div key={index} title={`${45 - index} days ago · ${degraded && [5, 29, 43].includes(index) ? '99.87%' : '100%'} uptime`} {...stylex.props(s.healthBar(degraded && [5, 29, 43].includes(index) ? '#dda278' : index > 41 && degraded ? '#e5b086' : '#72b89a'))} />)}</div>;
}

export function ChartLegend() {
  return <div {...stylex.props(s.legend)}><span {...stylex.props(ui.row)}><span {...stylex.props(ui.dot, ui.green)} />This period</span><span {...stylex.props(ui.row)}><span {...stylex.props(ui.dot, ui.muted)} />Previous period</span></div>;
}
