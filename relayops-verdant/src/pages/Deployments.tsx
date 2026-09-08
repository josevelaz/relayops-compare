import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { AlertTriangle, ArrowUpRight, Clock3, GitBranch, GitCommitHorizontal, GitPullRequest, Link2, Package, Terminal } from 'lucide-react';
import { deployments, servicePath, type Deployment } from '../data/model';
import { useActions } from '../state/actions';
import { useStore } from '../state/store';
import { AppLink, Avatar, Badge, Button, EmptyResults, Modal, PageHeader, Panel, SearchInput, Select, Status, ui } from '../components/ui';

const s = stylex.create({
  summary: { display: 'flex', alignItems: 'center', gap: 18, marginBottom: 24, padding: 18, backgroundColor: '#fff', border: '1px solid #e3e8e7', borderRadius: 8, flexWrap: 'wrap' },
  metric: { padding: '0 20px', borderRight: '1px solid #e8eeea' },
  value: { fontFamily: 'Manrope, sans-serif', fontSize: 24, fontWeight: 750, marginBottom: 4 },
  correlated: { backgroundColor: '#fffcfa' },
  code: { backgroundColor: '#15382e', borderRadius: 7, padding: 18, color: '#bcdbcb', fontFamily: 'ui-monospace, monospace', fontSize: 11, lineHeight: 2, whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' },
});

export function Deployments({ selectedId }: { selectedId?: string }) {
  const { go } = useActions();
  const { data } = useStore();
  const [query, setQuery] = useState('');
  const [environment, setEnvironment] = useState('All environments');
  const [status, setStatus] = useState('All statuses');
  const filtered = deployments.filter(deployment =>
    `${deployment.service} ${deployment.version} ${deployment.commit} ${deployment.author}`.toLowerCase().includes(query.toLowerCase()) &&
    (environment === 'All environments' || deployment.environment === environment) &&
    (status === 'All statuses' || deployment.status === status),
  );
  const selected = deployments.find(deployment => deployment.id === selectedId);

  return (
    <>
      <PageHeader title="Deployments" description="Every change, connected to its operational impact." actions={
        <Badge tone={data.integrations.GitHub ? 'green' : 'gray'} dot>
          GitHub {data.integrations.GitHub ? 'connected' : 'disconnected · cached history'}
        </Badge>
      } />
      <div {...stylex.props(s.summary)}>
        <div {...stylex.props(s.metric)}><div {...stylex.props(s.value)}>3</div><span {...stylex.props(ui.small, ui.muted)}>Production · last hour</span></div>
        <div {...stylex.props(s.metric)}><div {...stylex.props(s.value, ui.red)}>1</div><span {...stylex.props(ui.small, ui.muted)}>Failed deployment</span></div>
        <div {...stylex.props(s.metric)}><div {...stylex.props(s.value, ui.amber)}>1</div><span {...stylex.props(ui.small, ui.muted)}>Rolled back</span></div>
        <div {...stylex.props(ui.grow)}>
          <div {...stylex.props(ui.row, ui.amber)}><AlertTriangle size={16} /><strong>One incident correlates with recent changes</strong></div>
          <p {...stylex.props(ui.tableSub)}>Payment Gateway v4.18.2 deployed 4 minutes before INC-1042</p>
        </div>
        <AppLink to="/incidents/INC-1042">Investigate <ArrowUpRight size={13} /></AppLink>
      </div>
      <div {...stylex.props(ui.toolbar)}>
        <SearchInput value={query} onChange={setQuery} placeholder="Search service, version, or commit…" />
        <div {...stylex.props(ui.row, ui.wrap)}>
          <Select aria-label="Deployment environment" value={environment} onChange={event => setEnvironment(event.target.value)}>
            {['All environments', 'Production', 'Staging'].map(value => <option key={value}>{value}</option>)}
          </Select>
          <Select aria-label="Deployment status" value={status} onChange={event => setStatus(event.target.value)}>
            {['All statuses', 'Successful', 'Failed', 'Rolling out', 'Rolled back'].map(value => <option key={value}>{value}</option>)}
          </Select>
        </div>
      </div>
      <Panel title="Deployment activity" aside={<span {...stylex.props(ui.small, ui.muted)}>{filtered.length} deployments</span>} noPadding>
        <DeploymentTable deployments={filtered} />
        {!filtered.length && <EmptyResults name="deployments" />}
      </Panel>
      {selected && <DeploymentDetails deployment={selected} onClose={() => go('/deployments')} />}
    </>
  );
}

function DeploymentTable({ deployments }: { deployments: Deployment[] }) {
  return (
    <div {...stylex.props(ui.tableWrap)}>
      <table {...stylex.props(ui.table)}>
        <thead><tr>{['Service / version', 'Environment', 'Status', 'Author', 'Deployed at', 'Pull request', 'Related incident'].map(heading => <th key={heading} scope="col" {...stylex.props(ui.th)}>{heading}</th>)}</tr></thead>
        <tbody>
          {deployments.map(deployment => (
            <tr key={deployment.id} {...stylex.props(ui.tr, !!deployment.incident && s.correlated)}>
              <td {...stylex.props(ui.td)}>
                <AppLink to={`/deployments/${deployment.id}`} subtle>
                  <span {...stylex.props(ui.row, ui.strong)}><GitBranch size={14} color="#85988c" />{deployment.service}</span>
                  <p {...stylex.props(ui.tableSub, ui.mono)}>{deployment.version} · {deployment.commit}</p>
                </AppLink>
              </td>
              <td {...stylex.props(ui.td)}><Badge tone={deployment.environment === 'Production' ? 'gray' : 'purple'}>{deployment.environment}</Badge></td>
              <td {...stylex.props(ui.td)}><Status value={deployment.status} /></td>
              <td {...stylex.props(ui.td)}><span {...stylex.props(ui.row)}><Avatar name={deployment.author} size={24} />{deployment.author}</span></td>
              <td {...stylex.props(ui.td)}>{deployment.time}</td>
              <td {...stylex.props(ui.td)}>
                <a {...stylex.props(ui.link)} href={`https://github.com/relay/${deployment.service.toLowerCase().replaceAll(' ', '-')}/pull/${deployment.pr}`} target="_blank" rel="noreferrer">
                  <GitPullRequest size={12} />#{deployment.pr}<ArrowUpRight size={11} />
                </a>
              </td>
              <td {...stylex.props(ui.td)}>
                {deployment.incident ? <AppLink to={`/incidents/${deployment.incident}`}><Link2 size={12} />{deployment.incident}</AppLink> : <span {...stylex.props(ui.muted)}>No correlation</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function DeploymentDetails({ deployment, onClose }: { deployment: Deployment; onClose: () => void }) {
  const failed = ['Failed', 'Rolled back'].includes(deployment.status);
  const log = deployment.status === 'Rolled back'
    ? '[10:43 AM] Rollback requested by Marcus Johnson\n[10:46 AM] Previous revision restored across all replicas'
    : deployment.status === 'Failed'
      ? '[10:53 AM] Readiness check failed: upstream timeout\n[10:54 AM] Rollout stopped. Previous revision remains active.'
      : deployment.status === 'Rolling out'
        ? '[11:02 AM] Canary healthy. Rolling out to remaining replicas.'
        : '[complete] All replicas ready. Deployment successful.';
  return (
    <Modal title={`${deployment.service} ${deployment.version}`} onClose={onClose} wide footer={<>
      <AppLink to={servicePath(deployment.service)}>Open service <ArrowUpRight size={13} /></AppLink>
      <Button onClick={onClose}>Close</Button>
    </>}>
      <div {...stylex.props(ui.stack)}>
        <div {...stylex.props(ui.between)}>
          <div {...stylex.props(ui.row)}><Status value={deployment.status} /><Badge>{deployment.environment}</Badge></div>
          <span {...stylex.props(ui.mono, ui.muted)}>{deployment.id}</span>
        </div>
        {deployment.incident && <div {...stylex.props(ui.callout, ui.alertCallout)}>
          <AlertTriangle size={17} />
          <div>This change is associated with <AppLink to={`/incidents/${deployment.incident}`}>{deployment.incident}</AppLink>.
            <p>{deployment.status === 'Rolled back' ? 'The release was rolled back to v4.18.1. Configuration differences remain under investigation.' : 'The checkout hotfix failed its readiness checks. No new pods received production traffic.'}</p>
          </div>
        </div>}
        <div {...stylex.props(ui.grid2)}>
          <Panel title="Release metadata">
            <div {...stylex.props(ui.stackSmall)}>
              <p {...stylex.props(ui.row)}><GitCommitHorizontal size={14} /><code>{deployment.commit}</code></p>
              <p {...stylex.props(ui.row)}><Clock3 size={14} />{deployment.time.includes('Sep') ? deployment.time : `September 8 at ${deployment.time}`}</p>
              <p {...stylex.props(ui.row)}><Avatar name={deployment.author} size={24} />{deployment.author}</p>
              <p {...stylex.props(ui.row)}><Package size={14} />Kubernetes · us-east-1</p>
            </div>
          </Panel>
          <Panel title="Deployment checks">
            <div {...stylex.props(ui.stackSmall)}>
              {['Build & unit checks', 'Container image scan', 'Configuration validation', 'Release readiness'].map((check, index) => (
                <div key={check} {...stylex.props(ui.between)}><span {...stylex.props(ui.small)}>{check}</span><Status value={index === 3 && failed ? 'Failed' : 'Successful'} /></div>
              ))}
            </div>
          </Panel>
        </div>
        <div {...stylex.props(s.code)}>
          <Terminal size={13} /> Release activity{'\n'}
          [{deployment.time}] Image verified: {deployment.service.toLowerCase().replaceAll(' ', '-')}:{deployment.version}{'\n'}
          [{deployment.time}] Deployment submitted to {deployment.environment.toLowerCase()} controller{'\n'}
          {log}
        </div>
      </div>
    </Modal>
  );
}
