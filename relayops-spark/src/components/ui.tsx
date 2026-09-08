import * as React from 'react';
import * as stylex from '@stylexjs/stylex';
import { tokens } from '../styles/tokens.stylex';
import { initials, personById, type IncidentStatus, type Severity } from '../data/model';

const pulse = stylex.keyframes({
  '0%': { boxShadow: '0 0 0 0 rgba(220,38,38,0.5)' },
  '70%': { boxShadow: '0 0 0 6px rgba(220,38,38,0)' },
  '100%': { boxShadow: '0 0 0 0 rgba(220,38,38,0)' },
});

/* ---------- Badges ---------- */

const sevStyles = stylex.create({
  base: {
    display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 700,
    letterSpacing: '0.04em', padding: '3px 8px', borderRadius: 999, borderWidth: 1, borderStyle: 'solid',
    whiteSpace: 'nowrap',
  },
  SEV0: { backgroundColor: '#1e1b4b', color: '#fff', borderColor: '#1e1b4b' },
  SEV1: { backgroundColor: tokens.dangerSoft, color: tokens.danger, borderColor: '#fecaca' },
  SEV2: { backgroundColor: tokens.warnSoft, color: '#b45309', borderColor: '#fde68a' },
  SEV3: { backgroundColor: '#f1f5f9', color: '#475569', borderColor: tokens.line },
});

export function SevBadge({ sev, pulse }: { sev: Severity; pulse?: boolean }) {
  return (
    <span {...stylex.props(sevStyles.base, sevStyles[sev])} aria-label={`Severity ${sev}`}>
      {pulse && (sev === 'SEV0' || sev === 'SEV1') && <Dot color="#dc2626" pulse />}
      {sev}
    </span>
  );
}

const statusStyles = stylex.create({
  base: {
    display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600,
    padding: '3px 10px', borderRadius: 999, borderWidth: 1, borderStyle: 'solid', whiteSpace: 'nowrap',
  },
  Investigating: { backgroundColor: tokens.dangerSoft, color: tokens.danger, borderColor: '#fecaca' },
  Identified: { backgroundColor: tokens.warnSoft, color: '#b45309', borderColor: '#fde68a' },
  Monitoring: { backgroundColor: tokens.infoSoft, color: tokens.info, borderColor: '#bae6fd' },
  Resolved: { backgroundColor: tokens.okSoft, color: tokens.ok, borderColor: '#a7f3d0' },
});

const statusDot: Record<IncidentStatus, string> = {
  Investigating: '#dc2626',
  Identified: '#d97706',
  Monitoring: '#0284c7',
  Resolved: '#059669',
};

export function StatusBadge({ status }: { status: IncidentStatus }) {
  return (
    <span {...stylex.props(statusStyles.base, statusStyles[status])}>
      <Dot color={statusDot[status]} pulse={status === 'Investigating'} />
      {status}
    </span>
  );
}

export function Dot({ color, pulse }: { color: string; pulse?: boolean }) {
  return (
    <span
      aria-hidden
      {...stylex.props(dotStyles.dot, pulse && dotStyles.pulse)}
      style={{ backgroundColor: color }}
    />
  );
}

const dotStyles = stylex.create({
  dot: { width: 8, height: 8, borderRadius: '50%', display: 'inline-block', flexShrink: 0 },
  pulse: { animationName: pulse, animationDuration: '1.6s', animationIterationCount: 'infinite' },
});

export function HealthBadge({ health }: { health: 'Critical' | 'Degraded' | 'Healthy' }) {
  const map = {
    Critical: { bg: tokens.dangerSoft, fg: tokens.danger, bd: '#fecaca', dot: '#dc2626' },
    Degraded: { bg: tokens.warnSoft, fg: '#b45309', bd: '#fde68a', dot: '#d97706' },
    Healthy: { bg: tokens.okSoft, fg: tokens.ok, bd: '#a7f3d0', dot: '#059669' },
  } as const;
  const m = map[health];
  return (
    <span
      {...stylex.props(badgeStyles.base)}
      style={{ backgroundColor: m.bg, color: m.fg, borderColor: m.bd }}
    >
      <Dot color={m.dot} pulse={health === 'Critical'} />
      {health}
    </span>
  );
}

const badgeStyles = stylex.create({
  base: {
    display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600,
    padding: '3px 10px', borderRadius: 999, borderWidth: 1, borderStyle: 'solid', whiteSpace: 'nowrap',
  },
  neutral: { backgroundColor: '#f1f5f9', color: '#475569', borderColor: tokens.line },
  accent: { backgroundColor: tokens.accentSoft, color: tokens.accentInk, borderColor: '#c7d2fe' },
  violet: { backgroundColor: tokens.violetSoft, color: '#6d28d9', borderColor: '#ddd6fe' },
  dark: { backgroundColor: tokens.sidebar, color: '#fff', borderColor: tokens.sidebar },
});

export function Tag({ children, tone = 'neutral' }: { children: React.ReactNode; tone?: 'neutral' | 'accent' | 'violet' | 'dark' }) {
  return <span {...stylex.props(badgeStyles.base, badgeStyles[tone])}>{children}</span>;
}

/* ---------- Avatars ---------- */

const avatarStyles = stylex.create({
  base: {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%',
    color: '#fff', fontWeight: 700, flexShrink: 0, borderWidth: 2, borderStyle: 'solid', borderColor: '#fff',
  },
  sm: { width: 26, height: 26, fontSize: 10 },
  md: { width: 32, height: 32, fontSize: 11 },
  lg: { width: 40, height: 40, fontSize: 13 },
});

export function Avatar({ personId, size = 'md', title }: { personId: string; size?: 'sm' | 'md' | 'lg'; title?: string }) {
  const p = personById[personId];
  if (!p) return null;
  return (
    <span {...stylex.props(avatarStyles.base, avatarStyles[size])} style={{ backgroundColor: p.avatarColor }} title={title ?? p.name} aria-label={p.name}>
      {initials(p.name)}
    </span>
  );
}

const stackStyles = stylex.create({
  row: { display: 'inline-flex', alignItems: 'center' },
  item: { marginLeft: -8 },
  first: { marginLeft: 0 },
});

export function AvatarStack({ ids, size = 'sm', max = 5 }: { ids: string[]; size?: 'sm' | 'md'; max?: number }) {
  const shown = ids.slice(0, max);
  const extra = ids.length - shown.length;
  return (
    <span {...stylex.props(stackStyles.row)}>
      {shown.map((id, i) => (
        <span key={id} {...stylex.props(stackStyles.item, i === 0 && stackStyles.first)}>
          <Avatar personId={id} size={size} />
        </span>
      ))}
      {extra > 0 && (
        <span key="extra" {...stylex.props(stackStyles.item)}>
          <span {...stylex.props(avatarStyles.base, avatarStyles[size])} style={{ backgroundColor: '#475569' }}>
            +{extra}
          </span>
        </span>
      )}
    </span>
  );
}

/* ---------- Cards / layout ---------- */

export const card = stylex.create({
  base: { backgroundColor: tokens.surface, borderWidth: 1, borderStyle: 'solid', borderColor: tokens.line, borderRadius: 12 },
  pad: { padding: 18 },
  padSm: { padding: 14 },
});

export const type = stylex.create({
  h1: { fontSize: 22, fontWeight: 700, color: tokens.ink, margin: 0, letterSpacing: '-0.01em' },
  h2: { fontSize: 15, fontWeight: 700, color: tokens.ink, margin: 0 },
  h3: { fontSize: 13, fontWeight: 700, color: tokens.ink, margin: 0 },
  sub: { fontSize: 13, color: tokens.muted, margin: 0 },
  label: { fontSize: 11, fontWeight: 700, color: tokens.muted, textTransform: 'uppercase', letterSpacing: '0.07em', margin: 0 },
});

export function SectionHeader({ title, sub, right }: { title: string; sub?: string; right?: React.ReactNode }) {
  return (
    <div {...stylex.props(sectionHead.wrap)}>
      <div>
        <h2 {...stylex.props(type.h2)}>{title}</h2>
        {sub && <p {...stylex.props(type.sub)} style={{ marginTop: 2 }}>{sub}</p>}
      </div>
      {right}
    </div>
  );
}

const sectionHead = stylex.create({
  wrap: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 12 },
});

/* ---------- Buttons ---------- */

const btn = stylex.create({
  base: {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 7,
    fontSize: 13, fontWeight: 600, borderRadius: 8, padding: '8px 14px', cursor: 'pointer',
    borderWidth: 1, borderStyle: 'solid', transitionProperty: 'background-color, border-color, transform',
    transitionDuration: '120ms', textDecoration: 'none', whiteSpace: 'nowrap',
  },
  primary: { backgroundColor: tokens.accent, borderColor: tokens.accent, color: '#fff', ':hover': { backgroundColor: '#4338ca' } },
  secondary: { backgroundColor: tokens.surface, borderColor: tokens.lineStrong, color: tokens.ink, ':hover': { backgroundColor: tokens.surface2 } },
  danger: { backgroundColor: tokens.danger, borderColor: tokens.danger, color: '#fff', ':hover': { backgroundColor: '#b91c1c' } },
  ghost: { backgroundColor: 'transparent', borderColor: 'transparent', color: tokens.ink2, ':hover': { backgroundColor: '#eef2ff' } },
  sm: { fontSize: 12, padding: '5px 10px', borderRadius: 7 },
  disabled: { opacity: 0.5, cursor: 'not-allowed' },
});

export function Button({
  children, tone = 'secondary', size, onClick, type: t = 'button', disabled, ariaLabel,
}: {
  children: React.ReactNode;
  tone?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm';
  onClick?: (e: React.MouseEvent) => void;
  type?: 'button' | 'submit';
  disabled?: boolean;
  ariaLabel?: string;
}) {
  return (
    <button
      type={t}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={onClick}
      {...stylex.props(btn.base, btn[tone], size === 'sm' && btn.sm, disabled && btn.disabled)}
    >
      {children}
    </button>
  );
}

/* ---------- Form fields ---------- */

const field = stylex.create({
  wrap: { display: 'flex', flexDirection: 'column', gap: 5, minWidth: 0 },
  label: { fontSize: 12, fontWeight: 600, color: tokens.ink2 },
  input: {
    borderWidth: 1, borderStyle: 'solid', borderColor: tokens.lineStrong, borderRadius: 8,
    padding: '8px 11px', fontSize: 13, color: tokens.ink, backgroundColor: '#fff', width: '100%',
  },
  hint: { fontSize: 12, color: tokens.muted, margin: 0 },
  error: { fontSize: 12, color: tokens.danger, margin: 0, fontWeight: 600 },
});

export function Field({ label, children, hint, error, htmlFor }: { label: string; children: React.ReactNode; hint?: string; error?: string; htmlFor?: string }) {
  return (
    <div {...stylex.props(field.wrap)}>
      <label {...stylex.props(field.label)} htmlFor={htmlFor}>{label}</label>
      {children}
      {hint && !error && <p {...stylex.props(field.hint)}>{hint}</p>}
      {error && <p {...stylex.props(field.error)} role="alert">{error}</p>}
    </div>
  );
}

export const inputStyle = stylex.create({
  input: {
    borderWidth: 1, borderStyle: 'solid', borderColor: tokens.lineStrong, borderRadius: 8,
    padding: '8px 11px', fontSize: 13, color: tokens.ink, backgroundColor: '#fff', width: '100%',
  },
});

/* ---------- Tabs ---------- */

const tabs = stylex.create({
  bar: { display: 'flex', gap: 2, borderBottomWidth: 1, borderBottomStyle: 'solid', borderBottomColor: tokens.line, overflowX: 'auto' },
  tab: {
    borderWidth: 0, backgroundColor: 'transparent', fontSize: 13, fontWeight: 600, color: tokens.muted,
    padding: '10px 14px', cursor: 'pointer', borderBottomWidth: 2, borderBottomStyle: 'solid',
    borderBottomColor: 'transparent', marginBottom: -1, whiteSpace: 'nowrap',
  },
  active: { color: tokens.accentInk, borderBottomColor: tokens.accent },
});

export function Tabs<T extends string>({ tabs: names, active, onChange, counts }: { tabs: readonly T[]; active: T; onChange: (t: T) => void; counts?: Partial<Record<T, number>> }) {
  return (
    <div role="tablist" {...stylex.props(tabs.bar)}>
      {names.map((t) => (
        <button
          key={t}
          role="tab"
          aria-selected={active === t}
          onClick={() => onChange(t)}
          {...stylex.props(tabs.tab, active === t && tabs.active)}
        >
          {t}
          {counts?.[t] != null && counts[t]! > 0 && (
            <span {...stylex.props(countBadge.s)}> {counts[t]}</span>
          )}
        </button>
      ))}
    </div>
  );
}

const countBadge = stylex.create({
  s: {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: 20, height: 20,
    borderRadius: 999, backgroundColor: tokens.accentSoft, color: tokens.accentInk, fontSize: 11,
    fontWeight: 700, paddingLeft: 5, paddingRight: 5, marginLeft: 6,
  },
});

/* ---------- Modal ---------- */

const modal = stylex.create({
  overlay: {
    position: 'fixed', top: 0, right: 0, bottom: 0, left: 0, backgroundColor: 'rgba(15, 23, 42, 0.5)', zIndex: 90,
    display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: 24, overflowY: 'auto',
  },
  box: {
    backgroundColor: '#fff', borderRadius: 14, width: '100%', maxWidth: 560,
    boxShadow: '0 24px 64px rgba(15,23,42,0.28)', marginTop: '6vh', overflow: 'hidden',
  },
  head: { padding: '18px 22px 0' },
  body: { padding: '14px 22px 22px' },
});

export function Modal({ onClose, labelledBy, children, wide }: { onClose: () => void; labelledBy: string; children: React.ReactNode; wide?: boolean }) {
  const boxRef = React.useRef<HTMLDivElement>(null);
  const prevFocus = React.useRef<HTMLElement | null>(null);
  React.useEffect(() => {
    prevFocus.current = (document.activeElement as HTMLElement | null) ?? null;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key === 'Tab') {
        const root = boxRef.current;
        if (!root) return;
        const items = Array.from(
          root.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'),
        ).filter((el) => !el.hasAttribute('disabled') && el.getAttribute('aria-hidden') !== 'true');
        if (items.length === 0) {
          e.preventDefault();
          return;
        }
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    const t = window.setTimeout(() => {
      const root = boxRef.current;
      const first = root?.querySelector<HTMLElement>('input, select, textarea, button:not([aria-label="Close dialog"])') ?? root;
      first?.focus();
    }, 40);
    return () => {
      window.clearTimeout(t);
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      prevFocus.current?.focus?.();
    };
  }, [onClose]);
  return (
    <div {...stylex.props(modal.overlay)} onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div ref={boxRef} role="dialog" aria-modal="true" aria-labelledby={labelledBy} tabIndex={-1} {...stylex.props(modal.box)} style={wide ? { maxWidth: 720 } : undefined}>
        {children}
      </div>
    </div>
  );
}

export function ModalHead({ id, title, sub, onClose }: { id: string; title: string; sub?: string; onClose: () => void }) {
  return (
    <div {...stylex.props(modal.head)}>
      <div {...stylex.props(modalHead.row)}>
        <div>
          <h2 id={id} {...stylex.props(type.h1)} style={{ fontSize: 17 }}>{title}</h2>
          {sub && <p {...stylex.props(type.sub)} style={{ marginTop: 3 }}>{sub}</p>}
        </div>
        <button onClick={onClose} aria-label="Close dialog" {...stylex.props(modalHead.x)}>✕</button>
      </div>
    </div>
  );
}

const modalHead = stylex.create({
  row: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 },
  x: {
    borderWidth: 0, backgroundColor: '#f1f5f9', width: 30, height: 30, borderRadius: 8,
    cursor: 'pointer', color: tokens.ink2, fontSize: 13, flexShrink: 0,
  },
});

export function ModalBody({ children }: { children: React.ReactNode }) {
  return <div {...stylex.props(modal.body)}>{children}</div>;
}

/* ---------- Charts (hand-rolled SVG) ---------- */

export function Sparkline({ data, width = 120, height = 36, stroke = '#4f46e5', fill = 'rgba(79,70,229,0.12)', id }: { data: number[]; width?: number; height?: number; stroke?: string; fill?: string; id: string }) {
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const span = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / Math.max(data.length - 1, 1)) * (width - 4) + 2;
    const y = height - 4 - ((v - min) / span) * (height - 10);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  const line = `M${pts.join(' L')}`;
  const area = `${line} L${(width - 2).toFixed(1)},${height} L2,${height} Z`;
  const gid = `sg-${id}`;
  return (
    <svg width={width} height={height} role="img" aria-label="Trend sparkline">
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={stroke} stopOpacity="0.35" />
          <stop offset="100%" stopColor={stroke} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gid})`} />
      <path d={line} fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={pts[pts.length - 1].split(',')[0]} cy={pts[pts.length - 1].split(',')[1]} r="3" fill={stroke} />
    </svg>
  );
}

export function BarChart({ data, labels, height = 150, color = '#4f46e5', format }: { data: number[]; labels: string[]; height?: number; color?: string; format?: (v: number) => string }) {
  const max = Math.max(...data, 1);
  return (
    <div {...stylex.props(bars.wrap)} style={{ height }} role="img" aria-label="Bar chart">
      {data.map((v, i) => (
        <div key={i} {...stylex.props(bars.col)}>
          <div {...stylex.props(bars.val)}>{format ? format(v) : v}</div>
          <div {...stylex.props(bars.track)}>
            <div {...stylex.props(bars.fill)} style={{ height: `${Math.max((v / max) * 100, 3)}%`, backgroundColor: color }} />
          </div>
          <div {...stylex.props(bars.lbl)}>{labels[i]}</div>
        </div>
      ))}
    </div>
  );
}

const bars = stylex.create({
  wrap: { display: 'flex', gap: 8, alignItems: 'stretch' },
  col: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, minWidth: 0 },
  val: { fontSize: 11, fontWeight: 700, color: tokens.ink },
  track: { flex: 1, width: '100%', maxWidth: 44, backgroundColor: '#eef2ff', borderRadius: 6, display: 'flex', alignItems: 'flex-end', overflow: 'hidden', minHeight: 40 },
  fill: { width: '100%', borderRadius: 6 },
  lbl: { fontSize: 10, color: tokens.muted, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' },
});

export function Donut({ segments, size = 150 }: { segments: { label: string; value: number; color: string }[]; size?: number }) {
  const total = segments.reduce((a, s) => a + s.value, 0) || 1;
  const r = 54;
  const c = 2 * Math.PI * r;
  let acc = 0;
  return (
    <div {...stylex.props(donut.wrap)}>
      <svg width={size} height={size} viewBox="0 0 140 140" role="img" aria-label="Severity distribution">
        <circle cx="70" cy="70" r={r} fill="none" stroke="#eef2ff" strokeWidth="18" />
        {segments.map((s) => {
          const frac = s.value / total;
          const off = acc;
          acc += frac;
          return (
            <circle
              key={s.label}
              cx="70" cy="70" r={r} fill="none" stroke={s.color} strokeWidth="18"
              strokeDasharray={`${(frac * c).toFixed(1)} ${c.toFixed(1)}`}
              strokeDashoffset={(-off * c + c * 0.25).toFixed(1)}
              strokeLinecap="butt"
              transform="rotate(-90 70 70)"
            />
          );
        })}
        <text x="70" y="66" textAnchor="middle" fontSize="22" fontWeight="800" fill="#0f172a">{total}</text>
        <text x="70" y="84" textAnchor="middle" fontSize="11" fill="#64748b">incidents</text>
      </svg>
      <div {...stylex.props(donut.legend)}>
        {segments.map((s) => (
          <div key={s.label} {...stylex.props(donut.row)}>
            <span {...stylex.props(donut.sw)} style={{ backgroundColor: s.color }} />
            <span {...stylex.props(donut.lab)}>{s.label}</span>
            <span {...stylex.props(donut.num)}>{s.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const donut = stylex.create({
  wrap: { display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap' },
  legend: { display: 'flex', flexDirection: 'column', gap: 8 },
  row: { display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 },
  sw: { width: 12, height: 12, borderRadius: 4 },
  lab: { color: tokens.ink2, fontWeight: 600 },
  num: { color: tokens.ink, fontWeight: 800, marginLeft: 4 },
});

export function LineChart({ series, labels, height = 150 }: { series: { label: string; color: string; data: number[] }[]; labels: string[]; height?: number }) {
  const all = series.flatMap((s) => s.data);
  const max = Math.max(...all, 1);
  const min = Math.min(...all, 0);
  const span = max - min || 1;
  const W = 600;
  const H = 160;
  const pad = 8;
  const path = (data: number[]) =>
    data.map((v, i) => {
      const x = pad + (i / Math.max(data.length - 1, 1)) * (W - pad * 2);
      const y = H - pad - ((v - min) / span) * (H - pad * 2);
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' ');
  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: height }} role="img" aria-label="Trend line chart">
        {[0.25, 0.5, 0.75].map((f) => (
          <line key={f} x1={pad} x2={W - pad} y1={H * f} y2={H * f} stroke="#e2e8f0" strokeWidth="1" />
        ))}
        {series.map((s) => (
          <path key={s.label} d={path(s.data)} fill="none" stroke={s.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        ))}
      </svg>
      <div {...stylex.props(lineMeta.row)}>
        {series.map((s) => (
          <span key={s.label} {...stylex.props(lineMeta.item)}>
            <span {...stylex.props(lineMeta.sw)} style={{ backgroundColor: s.color }} />
            {s.label}
          </span>
        ))}
        <span {...stylex.props(lineMeta.span)}>{labels[0]} → {labels[labels.length - 1]}</span>
      </div>
    </div>
  );
}

const lineMeta = stylex.create({
  row: { display: 'flex', gap: 14, alignItems: 'center', marginTop: 8, flexWrap: 'wrap', fontSize: 12, color: tokens.muted },
  item: { display: 'inline-flex', gap: 6, alignItems: 'center', fontWeight: 600, color: tokens.ink2 },
  sw: { width: 14, height: 4, borderRadius: 2 },
  span: { marginLeft: 'auto' },
});

export function Progress({ value, tone = '#4f46e5' }: { value: number; tone?: string }) {
  return (
    <div {...stylex.props(prog.track)} role="progressbar" aria-valuenow={Math.round(value)} aria-valuemin={0} aria-valuemax={100}>
      <div {...stylex.props(prog.fill)} style={{ width: `${Math.min(100, Math.max(0, value))}%`, backgroundColor: tone }} />
    </div>
  );
}

const prog = stylex.create({
  track: { height: 8, borderRadius: 999, backgroundColor: '#e8edf5', overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 999 },
});

export function Mono({ children }: { children: React.ReactNode }) {
  return <code {...stylex.props(monoStyle.c)}>{children}</code>;
}

const monoStyle = stylex.create({
  c: { fontFamily: 'ui-monospace, "SF Mono", "Cascadia Code", Menlo, Consolas, monospace', fontSize: '0.92em', backgroundColor: '#f1f5f9', borderWidth: 1, borderStyle: 'solid', borderColor: tokens.line, padding: '1px 6px', borderRadius: 6 },
});

export function EmptyNote({ children }: { children: React.ReactNode }) {
  return <p {...stylex.props(empty.s)}>{children}</p>;
}
const empty = stylex.create({ s: { fontSize: 13, color: tokens.muted, margin: 0 } });
