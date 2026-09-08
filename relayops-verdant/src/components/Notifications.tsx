import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { Bell, CheckCheck, GitBranch, MessageSquare, ShieldAlert, Timer, ClipboardCheck } from 'lucide-react';
import { useStore } from '../state/store';
import { useActions } from '../state/actions';
import { Button, Modal, Tabs, ui } from './ui';
const s = stylex.create({ item: { display: 'flex', alignItems: 'flex-start', gap: 12, padding: '17px 12px', borderBottom: '1px solid #edf1f0', backgroundColor: { default: '#fff', ':hover': '#f7faf8' }, borderLeft: 0, borderRight: 0, borderTop: 0, width: '100%', textAlign: 'left' }, unread: { backgroundColor: '#f3f9f6' }, icon: { color: '#668f7c', marginTop: 3 }, dot: { width: 6, height: 6, borderRadius: '50%', backgroundColor: '#248669', marginTop: 6 } });
export function Notifications({ onClose }: { onClose: () => void }) {
  const { data, setData, notify } = useStore(); const { go } = useActions();
  const [tab, setTab] = useState('All');
  const icons = { incident: ShieldAlert, deployment: GitBranch, oncall: Timer, mention: MessageSquare, task: ClipboardCheck, alert: Bell };
  return <Modal title="Your inbox" onClose={onClose} footer={<Button variant="ghost" onClick={() => { setData(d => ({ ...d, notifications: d.notifications.map(n => ({ ...n, read: true })) })); notify('All notifications marked as read'); }}><CheckCheck size={15} />Mark all as read</Button>}><Tabs tabs={['All', { label: 'Unread', count: data.notifications.filter(n => !n.read).length }]} value={tab} onChange={setTab} />{data.notifications.filter(n => tab === 'All' || !n.read).map(n => { const Icon = icons[n.type]; return <button key={n.id} {...stylex.props(s.item, !n.read && s.unread)} onClick={() => { setData(d => ({ ...d, notifications: d.notifications.map(x => x.id === n.id ? { ...x, read: true } : x) })); go(n.path); onClose(); }}><Icon size={18} {...stylex.props(s.icon)} /><div {...stylex.props(ui.grow)}><p {...stylex.props(ui.strong, ui.small)}>{n.title}</p><p {...stylex.props(ui.secondary, ui.small)}>{n.body}</p><p {...stylex.props(ui.tableSub)}>{n.time}</p></div>{!n.read && <span {...stylex.props(s.dot)} />}</button>; })}{tab === 'Unread' && data.notifications.every(n => n.read) && <p {...stylex.props(ui.empty)}>You’re all caught up.</p>}</Modal>;
}
