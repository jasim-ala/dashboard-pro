'use client'

import { useActionState, useRef, useEffect } from 'react'
import { addVMLog } from '@/app/actions'
import { BRANDS, REGIONS } from '@/lib/constants'
import { Sparkles, PlusCircle, MapPin, CalendarDays, Loader2 } from 'lucide-react'
import { useToast } from '@/components/ToastProvider'

const initialState = { success: false, error: null }

export default function VMLogger({ logs = [] }) {
  const toast = useToast()
  const formRef = useRef(null)
  const [state, formAction, isPending] = useActionState(addVMLog, initialState)

  useEffect(() => {
    if (state.success) {
      toast('VM deployment logged successfully.', 'success')
      formRef.current?.reset()
    } else if (state.error) {
      toast(state.error, 'error')
    }
  }, [state])

  return (
    <div className="admin-module-card">
      <div className="module-header">
        <div>
          <div className="module-tag" style={{ color: '#8b5cf6' }}>MERCHANDISING</div>
          <h3 className="module-title">Visual Merchandising Audit Log</h3>
        </div>
        <span className="module-badge">{logs.length} deployments</span>
      </div>

      <form ref={formRef} action={formAction} className="module-form">
        <div className="form-grid-4">
          <div className="form-field">
            <label className="field-label">Campaign Name</label>
            <input name="campaign_name" required placeholder="e.g. Summer Activation '26" className="field-input" />
          </div>
          <div className="form-field">
            <label className="field-label">Brand</label>
            <select name="brand" required className="field-select">
              {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          <div className="form-field">
            <label className="field-label">Store Location</label>
            <input name="store_location" required placeholder="e.g. Mall of Emirates" className="field-input" />
          </div>
          <div className="form-field">
            <label className="field-label">Deployment Date</label>
            <input name="deployment_date" type="date" required className="field-input" />
          </div>
        </div>
        <div className="form-field" style={{ marginTop: '0.75rem' }}>
          <label className="field-label">Performance Notes / ROI Observations</label>
          <textarea
            name="notes"
            rows={3}
            placeholder="Describe the visual setup, traffic impact, and estimated ROI..."
            className="field-textarea"
          />
        </div>
        <div className="form-footer">
          <button type="submit" className="btn-primary btn-purple" disabled={isPending}>
            {isPending ? <Loader2 size={14} className="spin" /> : <PlusCircle size={14} />}
            {isPending ? 'Logging...' : 'Log Deployment'}
          </button>
        </div>
      </form>

      <div className="module-table-wrap">
        <table className="module-table">
          <thead>
            <tr>
              <th>Campaign</th>
              <th>Brand</th>
              <th>Location</th>
              <th>Date</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr><td colSpan="5" className="table-empty">No VM deployments logged yet.</td></tr>
            ) : logs.map(log => (
              <tr key={log.id}>
                <td className="font-medium">
                  <span className="cell-with-icon"><Sparkles size={12} /> {log.campaign_name}</span>
                </td>
                <td><span className="brand-chip">{log.brand}</span></td>
                <td><span className="cell-with-icon"><MapPin size={12} /> {log.store_location}</span></td>
                <td><span className="cell-with-icon"><CalendarDays size={12} /> {log.deployment_date}</span></td>
                <td className="notes-cell">{log.notes || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
