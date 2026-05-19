'use client'

import { useActionState, useRef, useEffect, useState } from 'react'
import { addUserAccount } from '@/app/actions'
import { UserPlus, Shield, User2, Mail, RefreshCw, Loader2 } from 'lucide-react'
import { useToast } from '@/components/ToastProvider'

const initialState = { success: false, error: null }

function RoleToggle({ user, onRoleChange, isPending }) {
  const isAdmin = user.role === 'Admin'
  return (
    <button
      onClick={() => onRoleChange(user.id, user.clerk_id, isAdmin ? 'User' : 'Admin', user.email)}
      disabled={isPending}
      className={`role-toggle-btn ${isAdmin ? 'role-toggle-admin' : 'role-toggle-user'}`}
      title={`Click to change to ${isAdmin ? 'User' : 'Admin'}`}
    >
      {isPending
        ? <RefreshCw size={11} className="spin" />
        : (isAdmin ? <Shield size={11} /> : <User2 size={11} />)
      }
      {isAdmin ? 'Admin' : 'User'}
    </button>
  )
}

export default function UserAccessControl({ users = [] }) {
  const toast = useToast()
  const formRef = useRef(null)
  const [optimisticUsers, setOptimisticUsers] = useState(users)
  const [pendingRoleId, setPendingRoleId] = useState(null)
  const [state, formAction, isPending] = useActionState(addUserAccount, initialState)

  useEffect(() => {
    if (state.success) {
      toast('Clerk account provisioned & DB synced successfully.', 'success')
      formRef.current?.reset()
    } else if (state.error) {
      toast(state.error, 'error')
    }
  }, [state])

  async function handleRoleChange(id, clerkId, newRole, email) {
    setPendingRoleId(id)
    setOptimisticUsers(prev => prev.map(u => u.id === id ? { ...u, role: newRole } : u))

    try {
      const res = await fetch('/api/update-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, clerkId, newRole, email }),
      })
      if (!res.ok) throw new Error('Failed')
      toast(`Role updated to ${newRole} for ${email}.`, 'success')
    } catch {
      setOptimisticUsers(users) // revert
      toast('Failed to update role. Check Clerk API key.', 'error')
    } finally {
      setPendingRoleId(null)
    }
  }

  return (
    <div className="admin-module-card">
      <div className="module-header">
        <div>
          <div className="module-tag" style={{ color: '#f59e0b' }}>ACCESS CONTROL</div>
          <h3 className="module-title">User Management & Permissions</h3>
        </div>
        <span className="module-badge">{optimisticUsers.length} users</span>
      </div>

      {/* Add User Form */}
      <form ref={formRef} action={formAction} className="module-form">
        <div className="form-grid-3">
          <div className="form-field">
            <label className="field-label">Email Address</label>
            <input name="email" type="email" required placeholder="user@example.com" className="field-input" />
          </div>
          <div className="form-field">
            <label className="field-label">Password</label>
            <input
              name="password"
              type="password"
              required
              placeholder="Min 8 chars, 1 number"
              minLength={8}
              className="field-input"
            />
          </div>
          <div className="form-field">
            <label className="field-label">Assign Role</label>
            <select name="role" required className="field-select">
              <option value="User">User</option>
              <option value="Admin">Admin</option>
              <option value="Sales Director">Sales Director</option>
            </select>
          </div>
        </div>
        <div className="form-grid-3" style={{ marginTop: '0.5rem' }}>
          <div className="form-field" style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="btn-primary btn-amber" disabled={isPending}>
              {isPending ? <Loader2 size={14} className="spin" /> : <UserPlus size={14} />}
              {isPending ? 'Provisioning...' : 'Create Clerk Account'}
            </button>
          </div>
        </div>
      </form>

      {/* Users Table */}
      <div className="module-table-wrap">
        <table className="module-table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Role</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {optimisticUsers.length === 0 ? (
              <tr><td colSpan="4" className="table-empty">No users in database yet.</td></tr>
            ) : optimisticUsers.map(u => (
              <tr key={u.id}>
                <td><span className="cell-with-icon"><Mail size={12} /> {u.email}</span></td>
                <td>
                  <span className={`status-pill ${u.role === 'Admin' ? 'status-admin' : 'status-user'}`}>
                    {u.role}
                  </span>
                </td>
                <td className="text-muted">{u.created_at?.slice(0, 10) || '—'}</td>
                <td>
                  <RoleToggle
                    user={u}
                    onRoleChange={handleRoleChange}
                    isPending={pendingRoleId === u.id}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
