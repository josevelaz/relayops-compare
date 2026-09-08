import * as stylex from '@stylexjs/stylex'
import type { ButtonHTMLAttributes, ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { Check, ChevronRight } from 'lucide-react'
import { people, type Health, type IncidentStatus, type Severity } from '../data'
import { s } from '../styles'

export function Button({
  children,
  icon: Icon,
  variant = 'secondary',
  size = 'normal',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
  icon?: LucideIcon
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'normal' | 'small'
}) {
  return (
    <button
      type="button"
      {...stylex.props(
        s.button,
        variant === 'primary' && s.buttonPrimary,
        variant === 'danger' && s.buttonDanger,
        variant === 'ghost' && s.buttonGhost,
        size === 'small' && s.buttonSmall,
      )}
      {...props}
    >
      {Icon ? <Icon {...stylex.props(size === 'small' ? s.iconSm : s.icon)} /> : null}
      {children}
    </button>
  )
}

export function IconButton({
  icon: Icon,
  label,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { icon: LucideIcon; label: string }) {
  return (
    <button type="button" aria-label={label} title={label} {...stylex.props(s.iconButton)} {...props}>
      <Icon {...stylex.props(s.icon)} />
    </button>
  )
}

export function Panel({ children, padded = false }: { children: ReactNode; padded?: boolean }) {
  return <section {...stylex.props(s.panel, padded && s.panelPad)}>{children}</section>
}

export function PanelHeader({
  title,
  meta,
  action,
}: {
  title: string
  meta?: string
  action?: ReactNode
}) {
  return (
    <div {...stylex.props(s.panelHeader)}>
      <div>
        <h2 {...stylex.props(s.panelTitle)}>{title}</h2>
        {meta ? <span {...stylex.props(s.panelMeta)}>{meta}</span> : null}
      </div>
      {action}
    </div>
  )
}

export function PageHeader({
  eyebrow,
  title,
  subtitle,
  actions,
}: {
  eyebrow?: string
  title: string
  subtitle?: string
  actions?: ReactNode
}) {
  return (
    <header {...stylex.props(s.pageHeader)}>
      <div>
        {eyebrow ? <p {...stylex.props(s.eyebrow)}>{eyebrow}</p> : null}
        <h1 {...stylex.props(s.title)}>{title}</h1>
        {subtitle ? <p {...stylex.props(s.subtitle)}>{subtitle}</p> : null}
      </div>
      {actions ? <div {...stylex.props(s.headerActions)}>{actions}</div> : null}
    </header>
  )
}

const toneStyle = {
  red: s.badgeRed,
  orange: s.badgeOrange,
  green: s.badgeGreen,
  blue: s.badgeBlue,
  violet: s.badgeViolet,
  gray: s.badgeGray,
  dark: s.badgeDark,
} as const

export function Badge({
  children,
  tone = 'gray',
  dot = false,
}: {
  children: ReactNode
  tone?: keyof typeof toneStyle
  dot?: boolean
}) {
  return (
    <span {...stylex.props(s.badge, toneStyle[tone])}>
      {dot ? <span {...stylex.props(s.dot)} /> : null}
      {children}
    </span>
  )
}

export function SeverityBadge({ severity }: { severity: Severity }) {
  const tone = severity === 'SEV0' || severity === 'SEV1' ? 'red' : severity === 'SEV2' ? 'orange' : 'blue'
  return <Badge tone={tone}>{severity}</Badge>
}

export function StatusBadge({ status }: { status: IncidentStatus }) {
  const tone = status === 'Investigating' ? 'red' : status === 'Identified' ? 'orange' : status === 'Monitoring' ? 'blue' : 'green'
  return <Badge tone={tone} dot>{status}</Badge>
}

export function HealthBadge({ health }: { health: Health }) {
  const tone = health === 'Critical' ? 'red' : health === 'Degraded' || health === 'Maintenance' ? 'orange' : 'green'
  return <Badge tone={tone} dot>{health}</Badge>
}

export function AlertBadge({ severity }: { severity: string }) {
  const tone = severity === 'Critical' ? 'red' : severity === 'High' ? 'orange' : severity === 'Medium' ? 'blue' : 'gray'
  return <Badge tone={tone}>{severity}</Badge>
}

export function DeploymentBadge({ status }: { status: string }) {
  const tone = status === 'Successful' ? 'green' : status === 'Failed' || status === 'Rolled back' ? 'red' : 'blue'
  return <Badge tone={tone} dot>{status}</Badge>
}

export function Avatar({ name, size = 'normal', overlap = false }: { name: string; size?: 'small' | 'normal' | 'large'; overlap?: boolean }) {
  const person = people.find((item) => item.name === name)
  const initials = person?.initials ?? name.split(' ').map((part) => part[0]).join('').slice(0, 2)
  const tone = person?.tone ?? 'slate'
  return (
    <span
      title={name}
      aria-label={name}
      {...stylex.props(
        s.avatar,
        size === 'small' && s.avatarSmall,
        size === 'large' && s.avatarLarge,
        tone === 'blue' && s.avatarBlue,
        tone === 'green' && s.avatarGreen,
        tone === 'amber' && s.avatarAmber,
        tone === 'rose' && s.avatarRose,
        tone === 'slate' && s.avatarSlate,
        overlap && s.avatarOverlap,
      )}
    >
      {initials}
    </span>
  )
}

export function AvatarStack({ names, max = 4 }: { names: string[]; max?: number }) {
  return (
    <div {...stylex.props(s.avatarStack)}>
      {names.slice(0, max).map((name, index) => (
        <Avatar key={name} name={name} size="small" overlap={index > 0} />
      ))}
      {names.length > max ? (
        <span {...stylex.props(s.avatar, s.avatarSmall, s.avatarSlate, s.avatarOverlap)}>+{names.length - max}</span>
      ) : null}
    </div>
  )
}

export function Metric({
  label,
  value,
  footer,
  trend,
}: {
  label: string
  value: string
  footer: string
  trend?: 'positive' | 'negative' | 'neutral'
}) {
  return (
    <Panel>
      <div {...stylex.props(s.metric)}>
        <div {...stylex.props(s.metricLabel)}>{label}</div>
        <div {...stylex.props(s.metricValue)}>{value}</div>
        <div {...stylex.props(s.metricFooter, trend === 'positive' && s.positive, trend === 'negative' && s.negative)}>{footer}</div>
      </div>
    </Panel>
  )
}

export function Tabs({ tabs, active, onChange }: { tabs: string[]; active: string; onChange: (tab: string) => void }) {
  return (
    <div role="tablist" {...stylex.props(s.tabs)}>
      {tabs.map((tab) => (
        <button
          key={tab}
          type="button"
          role="tab"
          aria-selected={active === tab}
          {...stylex.props(s.tab, active === tab && s.tabActive)}
          onClick={() => onChange(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  )
}

export function Progress({ value }: { value: number }) {
  return (
    <div role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={value} {...stylex.props(s.progressTrack)}>
      <div {...stylex.props(s.progressFill)} style={{ width: `${value}%` }} />
    </div>
  )
}

export function PersonLine({ name, detail }: { name: string; detail?: string }) {
  return (
    <div {...stylex.props(s.inline)}>
      <Avatar name={name} size="small" />
      <div {...stylex.props(s.grow)}>
        <div {...stylex.props(s.rowPrimary)}>{name}</div>
        {detail ? <div {...stylex.props(s.rowSecondary)}>{detail}</div> : null}
      </div>
    </div>
  )
}

export function Breadcrumb({ items, onBack }: { items: string[]; onBack?: () => void }) {
  return (
    <div {...stylex.props(s.wrap, s.tiny, s.muted)}>
      {items.map((item, index) => (
        <span key={item} {...stylex.props(s.inline)}>
          {index > 0 ? <ChevronRight {...stylex.props(s.iconSm)} /> : null}
          {index === 0 && onBack ? (
            <button type="button" onClick={onBack} {...stylex.props(s.link, s.tiny)}>{item}</button>
          ) : item}
        </span>
      ))}
    </div>
  )
}

export function Toggle({ on, label, onChange }: { on: boolean; label: string; onChange: () => void }) {
  return (
    <button type="button" role="switch" aria-checked={on} aria-label={label} onClick={onChange} {...stylex.props(s.button, s.buttonSmall)}>
      <span {...stylex.props(s.iconSm)}>{on ? <Check size={13} /> : null}</span>
      {on ? 'On' : 'Off'}
    </button>
  )
}
