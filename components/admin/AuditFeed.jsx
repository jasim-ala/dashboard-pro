import { Activity, Upload, UserPlus, Sparkles, Building2, Shield } from 'lucide-react'

const ICON_MAP = {
  SALE_ADDED: { icon: Activity, color: '#10b981' },
  BULK_UPLOAD: { icon: Upload, color: '#3b82f6' },
  USER_ADDED: { icon: UserPlus, color: '#f59e0b' },
  ROLE_CHANGED: { icon: Shield, color: '#8b5cf6' },
  VM_LOG_ADDED: { icon: Sparkles, color: '#ec4899' },
  PARTNER_ADDED: { icon: Building2, color: '#06b6d4' },
  PARTNER_STATUS: { icon: Building2, color: '#64748b' },
}

export default function AuditFeed({ logs = [] }) {
  return (
    <div className="admin-module-card">
      <div className="module-header">
        <div>
          <div className="module-tag" style={{ color: '#64748b' }}>SYSTEM</div>
          <h3 className="module-title">Recent Activity Feed</h3>
        </div>
        <span className="module-badge">Last 10 actions</span>
      </div>

      <div className="audit-feed">
        {logs.length === 0 ? (
          <div className="audit-empty">
            <Activity size={20} />
            <p>No system activity yet. Actions will appear here automatically.</p>
          </div>
        ) : logs.map((log, i) => {
          const mapping = ICON_MAP[log.action_type] || { icon: Activity, color: '#64748b' }
          const Icon = mapping.icon
          const isLast = i === logs.length - 1
          return (
            <div key={log.id} className={`audit-item ${isLast ? '' : 'audit-item-border'}`}>
              <div className="audit-icon-wrap" style={{ background: `${mapping.color}18`, border: `1px solid ${mapping.color}40` }}>
                <Icon size={14} style={{ color: mapping.color }} />
              </div>
              <div className="audit-content">
                <p className="audit-description">{log.description}</p>
                <div className="audit-meta">
                  <span className="audit-by">by {log.performed_by}</span>
                  <span className="audit-dot">·</span>
                  <time className="audit-time">
                    {new Date(log.created_at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </time>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
