import * as stylex from '@stylexjs/stylex';
import { useEffect, useRef, type ReactNode, type ButtonHTMLAttributes, type InputHTMLAttributes, type SelectHTMLAttributes } from 'react';
import { Link } from '@tanstack/react-router';
import { ArrowUpRight, Check, ChevronRight, Search, X } from 'lucide-react';
import { personByName } from '../data/model';

export const ui = stylex.create({
  row: { display: 'flex', alignItems: 'center', gap: 10 },
  between: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: { default: 'nowrap', '@media (max-width: 650px)': 'wrap' } },
  wrap: { flexWrap: 'wrap' },
  stack: { display: 'flex', flexDirection: 'column', gap: 20 },
  stackSmall: { display: 'flex', flexDirection: 'column', gap: 12 },
  grow: { flexGrow: 1, minWidth: 0 },
  muted: { color: '#68777a' },
  secondary: { color: '#637078', lineHeight: 1.6 },
  small: { fontSize: 12 },
  tiny: { fontSize: 11 },
  strong: { fontWeight: 600, color: '#26363b' },
  mono: { fontFamily: 'ui-monospace, SFMono-Regular, monospace', fontSize: 11, letterSpacing: '-.2px' },
  green: { color: '#12836b' },
  red: { color: '#c95049' },
  amber: { color: '#aa721c' },
  heading: { fontFamily: 'Manrope, sans-serif', fontWeight: 750, fontSize: 27, letterSpacing: '-1.1px', lineHeight: 1.35 },
  sectionTitle: { fontSize: 14, fontWeight: 650, letterSpacing: '-.15px' },
  pageHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginBottom: 25, flexWrap: 'wrap' },
  subtitle: { color: '#68767a', marginTop: 7, fontSize: 13 },
  panel: { backgroundColor: 'white', border: '1px solid #e3e8ea', borderRadius: 10, minWidth: 0, overflow: 'hidden' },
  panelHead: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: 62, padding: '17px 21px', borderBottom: '1px solid #eef0f1', gap: 12, flexWrap: { default: 'nowrap', '@media (max-width: 650px)': 'wrap' } },
  pad: { padding: 21 },
  divider: { border: 0, borderTop: '1px solid #e9edef', margin: '16px 0' },
  grid2: { display: 'grid', gridTemplateColumns: { default: 'repeat(2, minmax(0, 1fr))', '@media (max-width: 720px)': '1fr' }, gap: 20 },
  grid3: { display: 'grid', gridTemplateColumns: { default: 'repeat(3, minmax(0, 1fr))', '@media (max-width: 1150px)': 'repeat(2, minmax(0, 1fr))', '@media (max-width: 650px)': '1fr' }, gap: 18 },
  mainGrid: { display: 'grid', gridTemplateColumns: { default: 'minmax(0, 1fr) 318px', '@media (max-width: 1150px)': 'minmax(0, 1fr) 280px', '@media (max-width: 850px)': '1fr' }, gap: 20, alignItems: 'start' },
  button: { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 7, minHeight: { default: 35, '@media (max-width: 650px)': 44 }, padding: '8px 13px', borderRadius: 6, border: '1px solid #dfe5e7', backgroundColor: { default: '#fff', ':hover': '#f5f8f8' }, fontSize: 12, fontWeight: 550, whiteSpace: 'nowrap', transition: 'background-color .15s, border-color .15s', flexShrink: 0 },
  primary: { backgroundColor: { default: '#177e67', ':hover': '#116653' }, borderColor: '#177e67', color: 'white', boxShadow: '0 1px 2px #103e3615' },
  danger: { backgroundColor: { default: '#fff3f1', ':hover': '#fce6e3' }, borderColor: '#f2d8d4', color: '#bd4c43' },
  ghost: { backgroundColor: { default: 'transparent', ':hover': '#eff4f3' }, borderColor: 'transparent', color: '#61726f' },
  iconButton: { width: { default: 34, '@media (max-width: 650px)': 44 }, height: { default: 34, '@media (max-width: 650px)': 44 }, padding: 0 },
  link: { color: { default: '#287f6b', ':hover': '#105441' }, display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 550 },
  field: { display: 'flex', flexDirection: 'column', gap: 7, fontSize: 12, fontWeight: 550 },
  input: { backgroundColor: '#fff', border: '1px solid #dfe5e7', borderRadius: 6, padding: '9px 11px', minHeight: 37, width: '100%', color: '#2c3c42', outline: { default: 'none', ':focus': '2px solid #97ccba' } },
  select: { backgroundColor: '#fff', border: '1px solid #dfe5e7', borderRadius: 6, padding: '8px 30px 8px 11px', minHeight: 35, color: '#52616a', fontSize: 12, maxWidth: '100%' },
  search: { display: 'flex', alignItems: 'center', gap: 9, border: '1px solid #e0e6e8', borderRadius: 6, backgroundColor: '#fff', minHeight: 36, padding: '0 11px', color: '#8c969b', maxWidth: '100%' },
  searchInput: { border: 0, outline: 'none', padding: '9px 0', width: '100%', minWidth: 0, backgroundColor: 'transparent', color: '#34474c', fontSize: 12 },
  toolbar: { display: 'flex', gap: 10, justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, flexWrap: 'wrap' },
  tabs: { display: 'flex', alignItems: 'center', gap: 24, borderBottom: '1px solid #e0e6e8', marginBottom: 21, overflowX: 'auto' },
  tab: { backgroundColor: 'transparent', border: 0, borderBottom: '2px solid transparent', padding: '11px 0 14px', fontSize: 12, fontWeight: 550, whiteSpace: 'nowrap', color: { default: '#77848b', ':hover': '#21765f' } },
  activeTab: { color: '#177e67', borderBottomColor: '#177e67' },
  count: { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: 19, height: 19, borderRadius: 4, backgroundColor: '#f0f3f4', color: '#7b878c', padding: '0 5px', fontSize: 10, marginLeft: 6, fontWeight: 600 },
  badge: { display: 'inline-flex', alignItems: 'center', gap: 5, borderRadius: 4, padding: '4px 7px', fontSize: 10, lineHeight: 1.15, fontWeight: 600, whiteSpace: 'nowrap', letterSpacing: '.1px', backgroundColor: '#f0f3f5', color: '#637079' },
  redBadge: { backgroundColor: '#fff0ee', color: '#c4544b' },
  greenBadge: { backgroundColor: '#ecf7f1', color: '#228665' },
  amberBadge: { backgroundColor: '#fff5e4', color: '#ac7a29' },
  blueBadge: { backgroundColor: '#edf3fd', color: '#557cbd' },
  purpleBadge: { backgroundColor: '#f3effc', color: '#8464b1' },
  dot: { height: 6, width: 6, borderRadius: '50%', backgroundColor: 'currentColor', flexShrink: 0 },
  avatar: (color: string, size: number) => ({ backgroundColor: color, color: '#43544e', width: size, height: size, borderRadius: '50%', display: 'inline-flex', justifyContent: 'center', alignItems: 'center', fontSize: size < 30 ? 9 : 10, fontWeight: 650, flexShrink: 0, border: '2px solid white', letterSpacing: '-.3px' }),
  avatarGroup: { display: 'flex', alignItems: 'center', paddingLeft: 5 },
  overlap: { marginLeft: -6 },
  tableWrap: { overflowX: 'auto', width: '100%' },
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left', whiteSpace: 'nowrap' },
  th: { fontSize: 10, textTransform: 'uppercase', letterSpacing: '.6px', color: '#687970', fontWeight: 500, backgroundColor: '#fafbfc', padding: '12px 20px', borderBottom: '1px solid #edf0f1' },
  td: { padding: '16px 20px', borderBottom: '1px solid #eef1f2', fontSize: 12, color: '#617079' },
  tr: { backgroundColor: { default: '#fff', ':hover': '#fafcfb' } },
  tableTitle: { color: { default: '#334147', ':hover': '#13775f' }, fontSize: 12, fontWeight: 550, display: 'block', whiteSpace: 'normal', minWidth: 220, maxWidth: 470, lineHeight: 1.5 },
  tableSub: { marginTop: 4, fontSize: 10, color: '#697a70' },
  dialog: { border: '1px solid #e3e9e7', borderRadius: 13, padding: 0, width: 'min(580px, calc(100vw - 28px))', maxHeight: 'calc(100dvh - 40px)', boxShadow: '0 24px 100px #102c3440', color: '#26383e', backgroundColor: { default: '#fff', '::backdrop': '#132f3b66' }, backdropFilter: { default: 'none', '::backdrop': 'blur(3px)' } },
  dialogWide: { width: 'min(740px, calc(100vw - 28px))' },
  dialogBody: { padding: 24 },
  dialogFoot: { padding: '16px 24px', borderTop: '1px solid #edf0f1', display: 'flex', justifyContent: 'flex-end', gap: 9, backgroundColor: '#fbfcfc' },
  label: { fontSize: 10, fontWeight: 600, letterSpacing: '.9px', color: '#677970', textTransform: 'uppercase' },
  empty: { padding: 40, textAlign: 'center', color: '#7a878b', lineHeight: 1.8 },
  callout: { padding: '14px 17px', backgroundColor: '#f1f8f5', border: '1px solid #dfede5', borderRadius: 7, display: 'flex', alignItems: 'flex-start', gap: 10, color: '#477a66', fontSize: 12, lineHeight: 1.65 },
  alertCallout: { backgroundColor: '#fff7f3', borderColor: '#f5e2d8', color: '#ab6650' },
  progress: { height: 5, backgroundColor: '#ecf1ef', borderRadius: 3, overflow: 'hidden' },
  progressFill: (width: number, color: string) => ({ width: `${width}%`, height: '100%', backgroundColor: color, borderRadius: 3 }),
});

export function Button({ children, variant, icon, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'danger' | 'ghost'; icon?: boolean }) {
  return <button type="button" {...props} {...stylex.props(ui.button, variant && ui[variant], icon && ui.iconButton)}>{children}</button>;
}
export function AppLink({ to, children, subtle = false }: { to: string; children: ReactNode; subtle?: boolean }) {
  return to === '/' ? <Link to="/" {...stylex.props(!subtle && ui.link)}>{children}</Link> : <Link to="/$" params={{ _splat: to.replace(/^\//, '') }} {...stylex.props(!subtle && ui.link)}>{children}</Link>;
}
export function MoreLink({ to, children = 'View all' }: { to: string; children?: ReactNode }) { return <AppLink to={to}>{children}<ChevronRight size={13} /></AppLink>; }
export function PageHeader({ title, description, actions, eyebrow }: { title: string; description?: string; actions?: ReactNode; eyebrow?: ReactNode }) {
  return <header {...stylex.props(ui.pageHeader)}><div>{eyebrow}<h1 {...stylex.props(ui.heading)}>{title}</h1>{description && <p {...stylex.props(ui.subtitle)}>{description}</p>}</div><div {...stylex.props(ui.row, ui.wrap)}>{actions}</div></header>;
}
export function Panel({ title, aside, children, noPadding = false }: { title?: ReactNode; aside?: ReactNode; children: ReactNode; noPadding?: boolean }) {
  return <section {...stylex.props(ui.panel)}>{title && <div {...stylex.props(ui.panelHead)}><h2 {...stylex.props(ui.sectionTitle)}>{title}</h2>{aside}</div>}<div {...stylex.props(!noPadding && ui.pad)}>{children}</div></section>;
}
export function Badge({ children, tone, dot = false }: { children: ReactNode; tone?: 'red' | 'green' | 'amber' | 'blue' | 'purple' | 'gray'; dot?: boolean }) {
  return <span {...stylex.props(ui.badge, tone === 'red' && ui.redBadge, tone === 'green' && ui.greenBadge, tone === 'amber' && ui.amberBadge, tone === 'blue' && ui.blueBadge, tone === 'purple' && ui.purpleBadge)}>{dot && <span {...stylex.props(ui.dot)} />}{children}</span>;
}
export function Status({ value }: { value: string }) {
  const tone = ['SEV0', 'SEV1', 'Investigating', 'Degraded', 'Failed', 'Firing', 'High'].includes(value) ? 'red' : ['SEV2', 'Identified', 'Rolled back', 'Medium', 'Draft'].includes(value) ? 'amber' : ['Monitoring', 'Rolling out', 'In review', 'Acknowledged'].includes(value) ? 'blue' : ['SEV3', 'Viewer', 'Low'].includes(value) ? 'purple' : ['Resolved', 'Healthy', 'Successful', 'Published', 'Active', 'Connected', 'Complete'].includes(value) ? 'green' : 'gray';
  return <Badge tone={tone} dot={!value.startsWith('SEV')}>{value}</Badge>;
}
export function Avatar({ name, size = 29 }: { name: string; size?: number }) {
  const person = personByName(name);
  return <span title={name} role="img" aria-label={name} {...stylex.props(ui.avatar(person?.color ?? '#e4e9e7', size))}>{person?.initials ?? name.split(' ').map(w => w[0]).slice(0, 2).join('')}</span>;
}
export function AvatarGroup({ names, max = 4 }: { names: string[]; max?: number }) {
  return <div {...stylex.props(ui.avatarGroup)}>{names.slice(0, max).map(name => <span key={name} {...stylex.props(ui.overlap)}><Avatar name={name} size={25} /></span>)}{names.length > max && <span {...stylex.props(ui.small, ui.muted)}>+{names.length - max}</span>}</div>;
}
export function Person({ name, subtitle }: { name: string; subtitle?: string }) { return <div {...stylex.props(ui.row)}><Avatar name={name} /><div><div {...stylex.props(ui.strong, ui.small)}>{name}</div>{subtitle && <div {...stylex.props(ui.tableSub)}>{subtitle}</div>}</div></div>; }
export function Field({ label, children }: { label: string; children: ReactNode }) { return <label {...stylex.props(ui.field)}>{label}{children}</label>; }
export function Input(props: InputHTMLAttributes<HTMLInputElement>) { return <input {...props} {...stylex.props(ui.input)} />; }
export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) { return <select {...props} {...stylex.props(ui.select)} />; }
export function SearchInput({ value, onChange, placeholder = 'Search...', label }: { value: string; onChange: (v: string) => void; placeholder?: string; label?: string }) {
  return <div {...stylex.props(ui.search)}><Search size={15} /><input aria-label={label ?? placeholder} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} {...stylex.props(ui.searchInput)} />{value && <button aria-label="Clear search" onClick={() => onChange('')} {...stylex.props(ui.button, ui.ghost, ui.iconButton)}><X size={13} /></button>}</div>;
}
export function Tabs({ tabs, value, onChange }: { tabs: (string | { label: string; count: number })[]; value: string; onChange: (v: string) => void }) {
  const labels = tabs.map(tab => typeof tab === 'string' ? tab : tab.label);
  return (
    <div role="tablist" {...stylex.props(ui.tabs)} onKeyDown={event => {
      if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const current = labels.indexOf(value);
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? labels.length - 1 : (current + (event.key === 'ArrowRight' ? 1 : -1) + labels.length) % labels.length;
      onChange(labels[next]);
      (event.currentTarget.children[next] as HTMLButtonElement | undefined)?.focus();
    }}>
      {tabs.map(tab => {
        const label = typeof tab === 'string' ? tab : tab.label;
        return <button type="button" role="tab" aria-selected={value === label} tabIndex={value === label ? 0 : -1} key={label} onClick={() => onChange(label)} {...stylex.props(ui.tab, value === label && ui.activeTab)}>{label}{typeof tab !== 'string' && <span {...stylex.props(ui.count)}>{tab.count}</span>}</button>;
      })}
    </div>
  );
}
export function Modal({ title, children, onClose, footer, wide }: { title: string; children: ReactNode; onClose: () => void; footer?: ReactNode; wide?: boolean }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => { const dialog = ref.current; const previous = document.activeElement as HTMLElement; dialog?.showModal(); return () => { dialog?.close(); previous?.focus(); }; }, []);
  return <dialog ref={ref} aria-label={title} onCancel={onClose} onClick={e => { if (e.target === e.currentTarget) { const r = e.currentTarget.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) onClose(); } }} {...stylex.props(ui.dialog, wide && ui.dialogWide)}><div {...stylex.props(ui.panelHead)}><h2 {...stylex.props(ui.sectionTitle)}>{title}</h2><Button icon variant="ghost" onClick={onClose} aria-label="Close dialog"><X size={18} /></Button></div><div {...stylex.props(ui.dialogBody)}>{children}</div>{footer && <div {...stylex.props(ui.dialogFoot)}>{footer}</div>}</dialog>;
}
export function Progress({ value, color = '#3a9b7b' }: { value: number; color?: string }) { return <div role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100} {...stylex.props(ui.progress)}><div {...stylex.props(ui.progressFill(value, color))} /></div>; }
export function EmptyResults({ name = 'results' }: { name?: string }) { return <div {...stylex.props(ui.empty)}><Search size={23} /><p>No {name} match these filters.</p><p {...stylex.props(ui.small)}>Try another search or select all statuses.</p></div>; }
export function Checked({ done }: { done: boolean }) { return done ? <Check size={14} color="#24896a" /> : <ArrowUpRight size={14} />; }
