'use client'

import { useActionState, useRef, useEffect } from 'react'
import { addPartner } from '@/app/actions'
import { REGIONS } from '@/lib/constants'
import { MapPin, User, PlusCircle, CheckCircle2, XCircle, Loader2 } from 'lucide-react'
import { useToast } from '@/components/ToastProvider'

const initialState = { success: false, error: null }

export default function PartnerManagement({ partners = [] }) {
  const toast = useToast()
  const formRef = useRef(null)
  const [state, formAction, isPending] = useActionState(addPartner, initialState)

  // Fire toast and reset form when action completes
  useEffect(() => {
    if (state.success) {
      toast('Partner registered successfully.', 'success')
      formRef.current?.reset()
    } else if (state.error) {
      toast(state.error, 'error')
    }
  }, [state])

  return (
    <div className="admin-module-card">
      <div className="module-header">
        <div>
          <div className="module-tag">B2B ACCOUNTS</div>
          <h3 className="module-title">Retail Partner Directory</h3>
        </div>
        <span className="module-badge">{partners.length} registered</span>
      </div>

      <form ref={formRef} action={formAction} className="module-form">
        <div className="form-grid-4">
          <div className="form-field">
            <label className="field-label">Account Name</label>
            <input name="account_name" required placeholder="e.g. LunaFash Dubai" className="field-input" />
          </div>
          <div className="form-field">
            <label className="field-label">Store Location</label>
            <input name="store_location" required placeholder="e.g. Mall of Emirates" className="field-input" />
          </div>
          <div className="form-field">
            <label className="field-label">Region</label>
            <select name="region" required className="field-select">
              {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div className="form-field">
            <label className="field-label">Contact Person</label>
            <input name="contact_person" required placeholder="Full Name" className="field-input" />
          </div>
        </div>
        <div className="form-footer">
          <select name="status" className="field-select" style={{ width: 'auto' }}>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          <button type="submit" className="btn-primary" disabled={isPending}>
            {isPending ? <Loader2 size={14} className="spin" /> : <PlusCircle size={14} />}
            {isPending ? 'Saving...' : 'Add Partner'}
          </button>
        </div>
      </form>

      <div className="module-table-wrap">
        <table className="module-table">
          <thead>
            <tr>
              <th>Account Name</th>
              <th>Location</th>
              <th>Region</th>
              <th>Contact</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {partners.length === 0 ? (
              <tr><td colSpan="5" className="table-empty">No partners registered yet.</td></tr>
            ) : partners.map(p => (
              <tr key={p.id}>
                <td className="font-medium">{p.account_name}</td>
                <td><span className="cell-with-icon"><MapPin size={12} /> {p.store_location}</span></td>
                <td><span className="region-chip">{p.region}</span></td>
                <td><span className="cell-with-icon"><User size={12} /> {p.contact_person}</span></td>
                <td>
                  <span className={`status-pill ${p.status === 'Active' ? 'status-active' : 'status-inactive'}`}>
                    {p.status === 'Active' ? <CheckCircle2 size={11} /> : <XCircle size={11} />}
                    {p.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
