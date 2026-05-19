import { getDashboardMetrics, getSalesTransactions } from '@/app/actions'
import { DollarSign, TrendingUp, Users, Sparkles, Activity, ArrowUpRight, Download, ChevronDown } from 'lucide-react'
import WholesalePipeline from '@/components/WholesalePipeline'
import ExportButton from '@/components/ExportButton'

export default async function SalesDashboard() {
  const [metrics, transactions] = await Promise.all([
    getDashboardMetrics(),
    getSalesTransactions(),
  ])

  return (
    <section className="content-view" id="sales-view">
      {/* Header */}
      <div className="view-header-block">
        <div className="view-title">
          <span className="title-pre">USER DASHBOARD</span>
          <h2>SALES & REVENUE OVERVIEW</h2>
        </div>

        <div className="row-layout" style={{ gap: '1rem', flexWrap: 'wrap' }}>
          <div className="segmented-control glass-panel">
            <button className="time-tab">DAILY FEED</button>
            <button className="time-tab active">MONTHLY REPORT</button>
            <button className="time-tab">ANNUAL REPORT</button>
          </div>
          <ExportButton transactions={transactions} metrics={metrics} />
        </div>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card glass-panel flex-column">
          <div className="kpi-glow-overlay"></div>
          <div className="kpi-header">
            <span className="kpi-label">TOTAL B2B REVENUE</span>
            <div className="kpi-icon-wrap cyan-glow"><DollarSign size={16} /></div>
          </div>
          <div className="kpi-body">
            <h3 className="kpi-value">
              ${(metrics.totalRevenue || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h3>
            <div className="kpi-metric-trend positive">
              <TrendingUp size={14} />
              <span>+0.0%</span>
              <span className="trend-subtext">vs last period</span>
            </div>
          </div>
        </div>

        <div className="kpi-card glass-panel flex-column">
          <div className="kpi-glow-overlay"></div>
          <div className="kpi-header">
            <span className="kpi-label">ACTIVE B2B ACCOUNTS</span>
            <div className="kpi-icon-wrap purple-glow"><Users size={16} /></div>
          </div>
          <div className="kpi-body">
            <h3 className="kpi-value">{transactions.length || 0}</h3>
            <div className="kpi-metric-trend positive">
              <TrendingUp size={14} />
              <span>Total orders</span>
              <span className="trend-subtext">in pipeline</span>
            </div>
          </div>
        </div>

        <div className="kpi-card glass-panel flex-column">
          <div className="kpi-glow-overlay"></div>
          <div className="kpi-header">
            <span className="kpi-label">MERCHANDISING ROI</span>
            <div className="kpi-icon-wrap amber-glow"><Sparkles size={16} /></div>
          </div>
          <div className="kpi-body">
            <h3 className="kpi-value">382%</h3>
            <div className="kpi-progress-bar">
              <div className="progress-fill amber-glow-bar" style={{ width: '75%' }}></div>
            </div>
          </div>
        </div>

        <div className="kpi-card glass-panel flex-column">
          <div className="kpi-glow-overlay"></div>
          <div className="kpi-header">
            <span className="kpi-label">CONVERSION RATE</span>
            <div className="kpi-icon-wrap cyan-glow"><Activity size={16} /></div>
          </div>
          <div className="kpi-body row-layout">
            <div className="metric-block-left">
              <h3 className="kpi-value">78.4%</h3>
              <div className="kpi-metric-trend positive">
                <ArrowUpRight size={14} />
                <span>+4.2% vs benchmark</span>
              </div>
            </div>
            <div className="circular-gauge-wrapper">
              <svg className="circular-gauge" viewBox="0 0 36 36">
                <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path className="circle-fill cyan-glow-stroke" strokeDasharray="78.4, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Placeholder */}
      <div className="visuals-grid">
        <div className="visual-card glass-panel large-card">
          <div className="card-title-panel">
            <div className="panel-tag">REVENUE TRENDS</div>
            <h3>NET SALES REVENUE OVER TIME (USD)</h3>
          </div>
          <div className="chart-canvas-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Chart visualisation coming soon — add transactions below to begin.</p>
          </div>
        </div>
      </div>

      {/* Live Transaction Pipeline — Client Component */}
      <WholesalePipeline initialTransactions={transactions} />
    </section>
  )
}
