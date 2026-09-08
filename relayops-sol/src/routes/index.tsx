import * as stylex from '@stylexjs/stylex'
import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { AppShell } from '../components/AppShell'
import {
  CreateIncidentDialog,
  NotificationPopover,
  QuickActions,
  SearchDialog,
  Toast,
} from '../components/overlays'
import { alerts as seededAlerts, incidents as seededIncidents, notifications as seededNotifications, type Alert, type Incident } from '../data'
import { AnalyticsPage, PostmortemDetail, PostmortemsPage } from '../pages/AnalyticsPostmortems'
import { AlertsPage, ServiceDetail, ServicesPage } from '../pages/AlertsServices'
import { DeploymentsPage, OnCallPage } from '../pages/DeploymentsOnCall'
import { GenericIncidentDetail, IncidentDetail, IncidentsPage } from '../pages/Incidents'
import { Overview } from '../pages/Overview'
import { SettingsPage, TeamDetail, TeamsPage } from '../pages/TeamsSettings'
import { s } from '../styles'

const sections = ['overview', 'incidents', 'alerts', 'services', 'deployments', 'on-call', 'analytics', 'postmortems', 'teams', 'settings'] as const

export const Route = createFileRoute('/')({
  validateSearch: (search: Record<string, unknown>) => ({
    section: typeof search.section === 'string' && sections.includes(search.section as (typeof sections)[number]) ? search.section : 'overview',
    id: typeof search.id === 'string' ? search.id : undefined,
  }),
  component: RelayOps,
})

function RelayOps() {
  const { section, id } = Route.useSearch()
  const navigate = Route.useNavigate()
  const [incidents, setIncidents] = useState(seededIncidents)
  const [alerts, setAlerts] = useState(seededAlerts)
  const [searchOpen, setSearchOpen] = useState(false)
  const [quickOpen, setQuickOpen] = useState(false)
  const [createOpen, setCreateOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [notifications, setNotifications] = useState(seededNotifications)
  const [toast, setToast] = useState('')
  const [sourceAlertId, setSourceAlertId] = useState<string>()

  const showToast = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast((current) => current === message ? '' : current), 3200)
  }

  const go = (nextSection: string, nextId?: string) => {
    setNotificationsOpen(false)
    void navigate({ search: { section: nextSection, id: nextId } })
  }

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement
      const typing = ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) || target.isContentEditable
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setSearchOpen(true)
      } else if (event.key === '/' && !typing) {
        event.preventDefault()
        setSearchOpen(true)
      } else if (event.key.toLowerCase() === 'c' && !typing && !event.metaKey && !event.ctrlKey) {
        setCreateOpen(true)
      } else if (event.key === 'Escape') {
        setSearchOpen(false)
        setQuickOpen(false)
        setCreateOpen(false)
        setNotificationsOpen(false)
        setMobileNavOpen(false)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const createIncident = (incident: Incident) => {
    setIncidents((current) => [incident, ...current])
    if (sourceAlertId) {
      setAlerts((current) => current.map((alert) => alert.id === sourceAlertId ? { ...alert, incident: incident.id, state: 'Acknowledged' } : alert))
      setSourceAlertId(undefined)
    }
    showToast(`${incident.id} declared. Responders have been notified.`)
    go('incidents')
  }

  const updateIncident = (incidentId: string, updates: Partial<Incident>) => {
    setIncidents((current) => current.map((incident) => incident.id === incidentId ? { ...incident, ...updates } : incident))
    showToast(`${incidentId} updated.`)
  }

  const updateAlert = (alertId: string, updates: Partial<Alert>) => {
    setAlerts((current) => current.map((alert) => alert.id === alertId ? { ...alert, ...updates } : alert))
  }

  const openCreateIncident = (alertId?: string) => {
    setSourceAlertId(alertId)
    setCreateOpen(true)
  }

  const activeIncident = incidents.find((incident) => incident.id === id)
  const checkoutIncident = incidents.find((incident) => incident.id === 'INC-1042') ?? seededIncidents[0]

  let page
  if (section === 'overview') page = <Overview incidents={incidents} alerts={alerts} onNavigate={go} />
  else if (section === 'incidents') page = activeIncident ? activeIncident.id === 'INC-1042' ? <IncidentDetail incident={activeIncident} alerts={alerts} onBack={() => go('incidents')} onUpdate={(updates) => updateIncident(activeIncident.id, updates)} onNavigate={go} onToast={showToast} /> : <GenericIncidentDetail incident={activeIncident} onBack={() => go('incidents')} onUpdate={(updates) => updateIncident(activeIncident.id, updates)} onToast={showToast} /> : <IncidentsPage incidents={incidents} onOpen={(incidentId) => go('incidents', incidentId)} onCreate={() => openCreateIncident()} />
  else if (section === 'alerts') page = <AlertsPage key={id ?? 'all'} alerts={alerts} initialQuery={id} onUpdateAlert={updateAlert} onNavigate={go} onCreateIncident={openCreateIncident} onToast={showToast} />
  else if (section === 'services') page = id === 'payment-gateway' ? <ServiceDetail incident={checkoutIncident} alerts={alerts} onBack={() => go('services')} onNavigate={go} /> : <ServicesPage key={id ?? 'all'} initialQuery={id} onOpen={(slug) => slug === 'payment-gateway' ? go('services', slug) : showToast('Service summary selected. Open Payment Gateway for the full workspace.')} />
  else if (section === 'deployments') page = <DeploymentsPage key={id ?? 'all'} initialQuery={id} onNavigate={go} onToast={showToast} />
  else if (section === 'on-call') page = <OnCallPage onToast={showToast} />
  else if (section === 'analytics') page = <AnalyticsPage />
  else if (section === 'postmortems') page = id === 'PM-128' ? <PostmortemDetail onBack={() => go('postmortems')} onToast={showToast} /> : <PostmortemsPage key={id ?? 'all'} initialQuery={id} onOpen={(postmortemId) => postmortemId === 'PM-128' ? go('postmortems', postmortemId) : showToast('Postmortem opened in read-only preview. Open PM-128 for the full review workspace.')} onToast={showToast} />
  else if (section === 'teams') page = id === 'payments' ? <TeamDetail incident={checkoutIncident} onBack={() => go('teams')} onNavigate={go} onToast={showToast} /> : <TeamsPage key={id ?? 'all'} initialQuery={id} onOpen={(slug) => slug === 'payments' ? go('teams', slug) : showToast('Team overview selected. Open Payments for the full team workspace.')} />
  else page = <SettingsPage onToast={showToast} />

  const unreadCount = notifications.filter((item) => item.unread).length

  return (
    <>
      <AppShell
        current={section}
        mobileNavOpen={mobileNavOpen}
        notificationOpen={notificationsOpen}
        unreadCount={unreadCount}
        onNavigate={go}
        onMobileNav={setMobileNavOpen}
        onSearch={() => setSearchOpen(true)}
        onQuickActions={() => setQuickOpen(true)}
        onNotifications={() => setNotificationsOpen((value) => !value)}
        onWorkspace={() => showToast('Production Engineering is the active workspace.')}
        onAccount={() => showToast('Signed in as Alex Morgan · Admin')}
        notificationPanel={<NotificationPopover items={notifications} onClose={() => setNotificationsOpen(false)} onRead={(notificationId) => setNotifications((current) => current.map((item) => item.id === notificationId ? { ...item, unread: false } : item))} onReadAll={() => setNotifications((current) => current.map((item) => ({ ...item, unread: false })))} />}
      >
        {page}
      </AppShell>

      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} onNavigate={go} />
      <QuickActions open={quickOpen} onClose={() => setQuickOpen(false)} onCreateIncident={() => openCreateIncident()} onAcknowledgeTop={() => { const top = alerts.find((alert) => alert.state === 'Firing'); if (top) { updateAlert(top.id, { state: 'Acknowledged', assignee: top.assignee === 'Unassigned' ? 'Alex Morgan' : top.assignee }); showToast(`${top.id} acknowledged.`) } }} onSearch={() => setSearchOpen(true)} onNavigate={go} onToast={showToast} />
      <CreateIncidentDialog open={createOpen} nextId={`INC-${Math.max(...incidents.map((incident) => Number(incident.id.replace('INC-', '')) || 0)) + 1}`} onClose={() => { setCreateOpen(false); setSourceAlertId(undefined) }} onCreate={createIncident} />
      {toast ? <Toast message={toast} /> : null}
    </>
  )
}
