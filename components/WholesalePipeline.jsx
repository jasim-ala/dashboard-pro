'use client'

import { useState, useTransition, useOptimistic } from 'react'
import { addWholesaleOrder } from '@/app/actions'
import { BRANDS, PRODUCT_CATEGORIES } from '@/lib/constants'
import { PlusCircle, Loader2, CheckCircle2, AlertCircle, TrendingUp } from 'lucide-react'

const STATUS_STYLES = {
  DELIVERED:  { bg: '#f0fdf4', border: '#bbf7d0', color: '#16a34a' },
  PROCESSING: { bg: '#fffbeb', border: '#fde68a', color: '#d97706' },
  PENDING:    { bg: '#f8fafc', border: '#e2e8f0', color: '#64748b' },
}

function formatCurrency(n) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n)
}

export default function WholesalePipeline({ initialTransactions = [] }) {
  const [transactions, setTransactions] = useState(initialTransactions)
  const [isPending, startTransition] = useTransition()
  const [result, setResult] = useState(null)
  const [showForm, setShowForm] = useState(false)

  async function handleSubmit(formData) {
    const brand    = formData.get('brand')
    const category = formData.get('category')
    const apparel  = parseInt(formData.get('apparelUnits'), 10) || 0
    const lifestyle= parseInt(formData.get('lifestyleUnits'), 10) || 0
    const revenue  = parseFloat(formData.get('revenue'))
    const status   = formData.get('status') || 'DELIVERED'

    // Optimistic UI — add row immediately
    const optimisticRow = {
      id: `temp-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      brand,
      product_category: category,
      units_sold: apparel + lifestyle,
      revenue,
      status,
      _optimistic: true,
    }
    setTransactions(prev => [optimisticRow, ...prev])
    setResult(null)

    startTransition(async () => {
      const res = await addWholesaleOrder(formData)
      if (res?.error) {
        // Revert on failure
        setTransactions(prev => prev.filter(t => !t._optimistic))
        setResult({ error: res.error })
      } else {
        // Mark committed
        setTransactions(prev => prev.map(t => t._optimistic ? { ...t, _optimistic: false } : t))
        setResult({ success: true })
        setShowForm(false)
      }
    })
  }

  return (
    <div className="logs-card glass-panel" style={{ marginTop: '1rem' }}>
      {/* Header */}
      <div className="logs-header-panel">
        <div className="card-title-panel">
          <div className="panel-tag">SALES LEDGER</div>
          <h3>B2B WHOLESALE TRANSACTION PIPELINE</h3>
        </div>
        <button className="cyber-btn" onClick={() => setShowForm(v => !v)}>
          <PlusCircle size={15} className="btn-arrow" />
          <span className="btn-text">{showForm ? 'CANCEL' : 'NEW WHOLESALE ORDER'}</span>
        </button>
      </div>

      {/* Inline New Order Form */}
      {showForm && (
        <form action={handleSubmit} style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border-glass)',
          background: 'rgba(255,255,255,0.015)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
          gap: '0.75rem',
          alignItems: 'end',
        }}>
          {/* Brand */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            <label style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.08em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Brand</label>
            <select name="brand" required style={selectStyle}>
              {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          {/* Category */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            <label style={labelStyle}>Category</label>
            <select name="category" required style={selectStyle}>
              {PRODUCT_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          {/* Apparel Units */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            <label style={labelStyle}>Apparel Units</label>
            <input type="number" name="apparelUnits" min="0" defaultValue="0" required style={inputStyle} />
          </div>
          {/* Lifestyle Units */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            <label style={labelStyle}>Lifestyle Units</label>
            <input type="number" name="lifestyleUnits" min="0" defaultValue="0" required style={inputStyle} />
          </div>
          {/* Revenue */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            <label style={labelStyle}>Revenue (USD)</label>
            <input type="number" name="revenue" min="0.01" step="0.01" placeholder="0.00" required style={inputStyle} />
          </div>
          {/* Status */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            <label style={labelStyle}>Status</label>
            <select name="status" style={selectStyle}>
              <option value="DELIVERED">Delivered</option>
              <option value="PROCESSING">Processing</option>
              <option value="PENDING">Pending</option>
            </select>
          </div>
          {/* Submit */}
          <button type="submit" disabled={isPending} className="cyber-btn" style={{ height: '38px' }}>
            {isPending ? <Loader2 size={14} style={{ animation: 'spin 0.7s linear infinite' }} /> : <PlusCircle size={14} />}
            <span className="btn-text">{isPending ? 'Saving...' : 'Submit'}</span>
          </button>
        </form>
      )}

      {/* Feedback banner */}
      {result && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          padding: '0.65rem 1.5rem', fontSize: '0.83rem', fontWeight: 500,
          background: result.error ? '#fef2f2' : '#f0fdf4',
          borderBottom: `1px solid ${result.error ? '#fecaca' : '#bbf7d0'}`,
          color: result.error ? '#991b1b' : '#166534',
        }}>
          {result.error ? <AlertCircle size={15} /> : <CheckCircle2 size={15} />}
          {result.error || 'Order logged successfully and pipeline updated.'}
        </div>
      )}

      {/* Transactions Table */}
      <div className="logs-table-wrapper">
        <table className="logs-table" id="sales-ledger-table">
          <thead>
            <tr>
              <th style={{ width: '11%' }}>DATE</th>
              <th style={{ width: '12%' }}>ORDER ID</th>
              <th style={{ width: '22%' }}>BRAND</th>
              <th style={{ width: '16%' }}>CATEGORY</th>
              <th style={{ width: '12%' }}>UNITS</th>
              <th style={{ width: '14%' }}>REVENUE (USD)</th>
              <th style={{ width: '13%' }}>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '3rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                    <TrendingUp size={22} style={{ opacity: 0.3 }} />
                    <span>No transactions yet. Add your first wholesale order above.</span>
                  </div>
                </td>
              </tr>
            ) : transactions.map((tx, i) => {
              const pill = STATUS_STYLES[tx.status] || STATUS_STYLES.PENDING
              const shortId = tx._optimistic ? 'TX-NEW' : `TX-${tx.id?.slice(-4).toUpperCase()}`
              return (
                <tr key={tx.id} style={{ opacity: tx._optimistic ? 0.6 : 1, transition: 'opacity 0.3s' }}>
                  <td style={{ fontVariantNumeric: 'tabular-nums' }}>{tx.date}</td>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: 'var(--accent-cyan)' }}>{shortId}</td>
                  <td style={{ fontWeight: 600 }}>{tx.brand}</td>
                  <td>{tx.product_category}</td>
                  <td style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{Number(tx.units_sold).toLocaleString()}</td>
                  <td style={{ textAlign: 'right', fontWeight: 600, color: 'var(--accent-green)', fontVariantNumeric: 'tabular-nums' }}>
                    {formatCurrency(tx.revenue)}
                  </td>
                  <td>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', padding: '0.2rem 0.6rem',
                      borderRadius: '999px', fontSize: '0.7rem', fontWeight: 700,
                      background: pill.bg, border: `1px solid ${pill.border}`, color: pill.color,
                    }}>
                      {tx.status || 'DELIVERED'}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// Style helpers (avoids repetition)
const labelStyle = {
  fontSize: '0.65rem', fontWeight: 700,
  letterSpacing: '0.08em', color: 'var(--text-muted)', textTransform: 'uppercase',
}

const inputStyle = {
  padding: '0.48rem 0.6rem',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid var(--border-glass)',
  borderRadius: '6px',
  color: 'var(--text-primary)',
  fontSize: '0.85rem',
  outline: 'none',
  width: '100%',
}

const selectStyle = {
  ...inputStyle,
  appearance: 'auto',
}
