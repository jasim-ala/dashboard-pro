import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { getUsers, getPartners, getVMLogs, getAuditLogs } from '@/app/actions'
import PartnerManagement from '@/components/admin/PartnerManagement'
import VMLogger from '@/components/admin/VMLogger'
import UserAccessControl from '@/components/admin/UserAccessControl'
import BulkCSVUploader from '@/components/admin/BulkCSVUploader'
import AuditFeed from '@/components/admin/AuditFeed'
import { CheckCircle2 } from 'lucide-react'

export default async function AdminPanel() {
  const user = await currentUser()
  if (user?.publicMetadata?.role !== 'Admin') {
    redirect('/sales')
  }

  const [users, partners, vmLogs, auditLogs] = await Promise.all([
    getUsers(),
    getPartners(),
    getVMLogs(),
    getAuditLogs(),
  ])

  return (
    <section className="admin-page">
      {/* Page Header */}
      <div className="admin-page-header">
        <div>
          <p className="admin-page-pre">SYSTEM ADMINISTRATION</p>
          <h1 className="admin-page-title">Admin Control Panel</h1>
          <p className="admin-page-sub">Manage retail partners, inventory, merchandising, and system access.</p>
        </div>
        <div className="admin-status-badge">
          <CheckCircle2 size={14} />
          All Systems Operational
        </div>
      </div>

      {/* Stat Summary Bar */}
      <div className="admin-stats-bar">
        <div className="admin-stat">
          <span className="admin-stat-value">{partners.length}</span>
          <span className="admin-stat-label">Active Partners</span>
        </div>
        <div className="admin-stat-divider" />
        <div className="admin-stat">
          <span className="admin-stat-value">{users.length}</span>
          <span className="admin-stat-label">System Users</span>
        </div>
        <div className="admin-stat-divider" />
        <div className="admin-stat">
          <span className="admin-stat-value">{vmLogs.length}</span>
          <span className="admin-stat-label">VM Deployments</span>
        </div>
        <div className="admin-stat-divider" />
        <div className="admin-stat">
          <span className="admin-stat-value">{auditLogs.length}</span>
          <span className="admin-stat-label">Recent Actions</span>
        </div>
      </div>

      {/* Main Modules Grid */}
      <div className="admin-modules-grid">
        {/* LEFT COLUMN: Partners + VM Logger */}
        <div className="admin-col-main">
          <PartnerManagement partners={partners} />
          <VMLogger logs={vmLogs} />
          <BulkCSVUploader />
        </div>

        {/* RIGHT COLUMN: User Control + Audit Feed */}
        <div className="admin-col-side">
          <UserAccessControl users={users} />
          <AuditFeed logs={auditLogs} />
        </div>
      </div>
    </section>
  )
}
