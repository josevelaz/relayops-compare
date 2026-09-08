import * as stylex from '@stylexjs/stylex'
import { useEffect, useMemo, useRef, useState } from 'react'
import {
  AlertTriangle,
  Bell,
  Box,
  Check,
  FileText,
  GitCommitHorizontal,
  Search,
  Siren,
  Users,
  Wrench,
  X,
  Zap,
} from 'lucide-react'
import { people, searchIndex, services, type Incident, type Severity } from '../data'
import { s } from '../styles'
import { Avatar, Badge, Button, IconButton } from './ui'

interface SearchDialogProps {
  open: boolean
  onClose: () => void
  onNavigate: (section: string, id?: string) => void
}

const resultIcons = {
  Incident: Siren,
  Service: Box,
  Team: Users,
  Person: Users,
  Alert: AlertTriangle,
  Deployment: GitCommitHorizontal,
  Postmortem: FileText,
} as const

export function SearchDialog({ open, onClose, onNavigate }: SearchDialogProps) {
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) return searchIndex.slice(0, 7)
    return searchIndex.filter((item) => `${item.title} ${item.meta} ${item.type}`.toLowerCase().includes(normalized)).slice(0, 10)
  }, [query])

  useEffect(() => {
    if (open) {
      setQuery('')
      setActive(0)
      window.setTimeout(() => inputRef.current?.focus(), 20)
    }
  }, [open])

  if (!open) return null

  const select = (result: (typeof searchIndex)[number]) => {
    onNavigate(result.section, result.id)
    onClose()
  }

  return (
    <div role="dialog" aria-modal="true" aria-label="Global search" {...stylex.props(s.overlay)} onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div {...stylex.props(s.modal, s.commandModal)}>
        <div {...stylex.props(s.commandInputWrap)}>
          <Search {...stylex.props(s.icon)} />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => { setQuery(event.target.value); setActive(0) }}
            onKeyDown={(event) => {
              if (event.key === 'Escape') onClose()
              if (event.key === 'ArrowDown') { event.preventDefault(); setActive((value) => Math.min(value + 1, results.length - 1)) }
              if (event.key === 'ArrowUp') { event.preventDefault(); setActive((value) => Math.max(value - 1, 0)) }
              if (event.key === 'Enter' && results[active]) select(results[active])
            }}
            placeholder="Search incidents, services, people, alerts…"
            aria-label="Search all RelayOps resources"
            {...stylex.props(s.commandInput)}
          />
          <Badge>ESC</Badge>
        </div>
        <div {...stylex.props(s.commandResults)}>
          <div {...stylex.props(s.commandGroup)}>{query ? `${results.length} results` : 'Suggested'}</div>
          {results.length ? results.map((result, index) => {
            const Icon = resultIcons[result.type as keyof typeof resultIcons]
            return (
              <button
                type="button"
                key={`${result.type}-${result.title}`}
                {...stylex.props(s.commandItem, index === active && s.segmentActive)}
                onMouseEnter={() => setActive(index)}
                onClick={() => select(result)}
              >
                <span {...stylex.props(s.commandIcon)}><Icon size={15} /></span>
                <span {...stylex.props(s.grow)}>
                  <span {...stylex.props(s.rowPrimary)}>{result.title}</span>
                  <span {...stylex.props(s.rowSecondary)}>{result.meta}</span>
                </span>
                <Badge tone="gray">{result.type}</Badge>
              </button>
            )
          }) : (
            <div {...stylex.props(s.emptyFilter)}>No results for “{query}”. Try a service, person, or incident ID.</div>
          )}
        </div>
        <div {...stylex.props(s.modalFooter, s.tiny, s.muted)}>
          <span>↑↓ Navigate</span><span>↵ Open</span><span>esc Close</span>
        </div>
      </div>
    </div>
  )
}

export function QuickActions({
  open,
  onClose,
  onCreateIncident,
  onAcknowledgeTop,
  onSearch,
  onNavigate,
  onToast,
}: {
  open: boolean
  onClose: () => void
  onCreateIncident: () => void
  onAcknowledgeTop: () => void
  onSearch: () => void
  onNavigate: (section: string) => void
  onToast: (message: string) => void
}) {
  if (!open) return null
  const actions = [
    { label: 'Create incident', hint: 'C', icon: Siren, action: onCreateIncident },
    { label: 'Search everything', hint: '⌘ K', icon: Search, action: onSearch },
    { label: 'Acknowledge top alert', hint: 'A', icon: Check, action: onAcknowledgeTop },
    { label: 'Jump to a service', hint: 'S', icon: Box, action: onSearch },
    { label: 'View who is on call', hint: 'O', icon: Users, action: () => onNavigate('on-call') },
    { label: 'Create postmortem', hint: 'P', icon: FileText, action: () => onNavigate('postmortems') },
  ]
  return (
    <div role="dialog" aria-modal="true" aria-label="Quick actions" {...stylex.props(s.overlay)} onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div {...stylex.props(s.modal, s.commandModal)}>
        <div {...stylex.props(s.modalHeader)}>
          <div {...stylex.props(s.inline)}><Zap {...stylex.props(s.icon)} /><strong>Quick actions</strong></div>
          <IconButton icon={X} label="Close" onClick={onClose} />
        </div>
        <div {...stylex.props(s.commandResults)}>
          <div {...stylex.props(s.commandGroup)}>Operational workflows</div>
          {actions.map(({ label, hint, icon: Icon, action }, index) => (
            <button key={label} type="button" autoFocus={index === 0} {...stylex.props(s.commandItem)} onClick={() => { action(); onClose() }}>
              <span {...stylex.props(s.commandIcon)}><Icon size={15} /></span>
              <span {...stylex.props(s.grow, s.rowPrimary)}>{label}</span>
              <Badge>{hint}</Badge>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export function CreateIncidentDialog({
  open,
  nextId,
  onClose,
  onCreate,
}: {
  open: boolean
  nextId: string
  onClose: () => void
  onCreate: (incident: Incident) => void
}) {
  const [title, setTitle] = useState('')
  const [severity, setSeverity] = useState<Severity>('SEV2')
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [commander, setCommander] = useState('Sarah Chen')
  const [responders, setResponders] = useState<string[]>(['Priya Patel'])
  const [description, setDescription] = useState('')
  const [attempted, setAttempted] = useState(false)

  useEffect(() => {
    if (!open) return
    setTitle('')
    setSeverity('SEV2')
    setSelectedServices([])
    setCommander('Sarah Chen')
    setResponders(['Priya Patel'])
    setDescription('')
    setAttempted(false)
  }, [open])

  if (!open) return null
  const valid = title.trim().length >= 5 && selectedServices.length > 0 && description.trim().length >= 10

  const toggleService = (name: string) => setSelectedServices((current) => current.includes(name) ? current.filter((item) => item !== name) : [...current, name])
  const toggleResponder = (name: string) => setResponders((current) => current.includes(name) ? current.filter((item) => item !== name) : [...current, name])
  const submit = () => {
    setAttempted(true)
    if (!valid) return
    onCreate({
      id: nextId,
      title: title.trim(),
      severity,
      status: 'Investigating',
      services: selectedServices,
      commander,
      responders,
      created: 'Just now',
      duration: '<1m',
      impact: description.trim(),
    })
    onClose()
  }

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="create-incident-title" {...stylex.props(s.overlay)} onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div {...stylex.props(s.modal, s.modalWide)}>
        <div {...stylex.props(s.modalHeader)}>
          <div>
            <h2 id="create-incident-title" {...stylex.props(s.panelTitle)}>Declare an incident</h2>
            <div {...stylex.props(s.rowSecondary)}>Start coordination now. You can refine details later.</div>
          </div>
          <IconButton icon={X} label="Close" onClick={onClose} />
        </div>
        <div {...stylex.props(s.modalBody)}>
          <div {...stylex.props(s.formGrid)}>
            <label {...stylex.props(s.field, s.fieldFull)}>
              <span {...stylex.props(s.label)}>Incident title</span>
              <input autoFocus value={title} onChange={(event) => setTitle(event.target.value)} placeholder="What is failing, and where?" {...stylex.props(s.input)} />
              {attempted && title.trim().length < 5 ? <span {...stylex.props(s.error)}>Enter a clear title of at least 5 characters.</span> : null}
            </label>
            <label {...stylex.props(s.field)}>
              <span {...stylex.props(s.label)}>Severity</span>
              <select value={severity} onChange={(event) => setSeverity(event.target.value as Severity)} {...stylex.props(s.input)}>
                <option>SEV0</option><option>SEV1</option><option>SEV2</option><option>SEV3</option>
              </select>
              <span {...stylex.props(s.hint)}>{severity === 'SEV0' ? 'Company-wide critical impact' : severity === 'SEV1' ? 'Major customer impact' : severity === 'SEV2' ? 'Degraded service or partial impact' : 'Minor impact or risk'}</span>
            </label>
            <label {...stylex.props(s.field)}>
              <span {...stylex.props(s.label)}>Incident commander</span>
              <select value={commander} onChange={(event) => setCommander(event.target.value)} {...stylex.props(s.input)}>
                {people.slice(0, 6).map((person) => <option key={person.name}>{person.name}</option>)}
              </select>
            </label>
            <fieldset {...stylex.props(s.field, s.fieldFull)}>
              <legend {...stylex.props(s.label)}>Affected services</legend>
              <div {...stylex.props(s.wrap)}>
                {services.map((service) => (
                  <button key={service.name} type="button" onClick={() => toggleService(service.name)} {...stylex.props(s.button, s.buttonSmall, selectedServices.includes(service.name) && s.buttonPrimary)}>
                    {selectedServices.includes(service.name) ? <Check size={12} /> : null}{service.name}
                  </button>
                ))}
              </div>
              {attempted && !selectedServices.length ? <span {...stylex.props(s.error)}>Select at least one affected service.</span> : null}
            </fieldset>
            <fieldset {...stylex.props(s.field, s.fieldFull)}>
              <legend {...stylex.props(s.label)}>Responders</legend>
              <div {...stylex.props(s.wrap)}>
                {people.slice(1, 7).map((person) => (
                  <button key={person.name} type="button" onClick={() => toggleResponder(person.name)} {...stylex.props(s.button, s.buttonSmall, responders.includes(person.name) && s.buttonPrimary)}>
                    <Avatar name={person.name} size="small" />{person.name}
                  </button>
                ))}
              </div>
            </fieldset>
            <label {...stylex.props(s.field, s.fieldFull)}>
              <span {...stylex.props(s.label)}>Customer impact and context</span>
              <textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Describe current symptoms, scope, and anything responders need to know…" {...stylex.props(s.textarea)} />
              {attempted && description.trim().length < 10 ? <span {...stylex.props(s.error)}>Add a short impact description.</span> : null}
            </label>
          </div>
        </div>
        <div {...stylex.props(s.modalFooter)}>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="primary" icon={Siren} onClick={submit}>Declare {severity} incident</Button>
        </div>
      </div>
    </div>
  )
}

export function Toast({ message }: { message: string }) {
  return <div role="status" {...stylex.props(s.toast)}><Check size={15} />{message}</div>
}

export function NotificationPopover({
  items,
  onClose,
  onRead,
  onReadAll,
}: {
  items: Array<{ id: number; title: string; body: string; time: string; unread: boolean; kind: string }>
  onClose: () => void
  onRead: (id: number) => void
  onReadAll: () => void
}) {
  return (
    <aside aria-label="Notifications" {...stylex.props(s.popover)}>
      <div {...stylex.props(s.panelHeader)}>
        <div><h2 {...stylex.props(s.panelTitle)}>Notifications</h2><span {...stylex.props(s.panelMeta)}>{items.filter((item) => item.unread).length} unread</span></div>
        <div {...stylex.props(s.inline)}><Button size="small" variant="ghost" onClick={onReadAll}>Mark all read</Button><IconButton icon={X} label="Close notifications" onClick={onClose} /></div>
      </div>
      <div style={{ maxHeight: 530, overflowY: 'auto' }}>
        {items.map((item) => (
          <button key={item.id} type="button" onClick={() => onRead(item.id)} {...stylex.props(s.commandItem, s.notificationItem, item.unread && s.notificationUnread)}>
            <span {...stylex.props(s.notificationGlyph)}>{item.kind === 'alert' || item.kind === 'incident' ? <AlertTriangle size={14} /> : <Bell size={14} />}</span>
            <span {...stylex.props(s.grow)}>
              <span {...stylex.props(s.rowPrimary)}>{item.title}</span>
              <span {...stylex.props(s.rowSecondary)}>{item.body}</span>
              <span {...stylex.props(s.rowSecondary)}>{item.time}</span>
            </span>
            {item.unread ? <span {...stylex.props(s.notificationUnreadDot)} /> : null}
          </button>
        ))}
      </div>
    </aside>
  )
}
