'use client'

import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { CheckCircle2, XCircle, X } from 'lucide-react'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 4000)
  }, [])

  const dismiss = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}

      {/* Toast Rack */}
      <div style={{
        position: 'fixed',
        bottom: '1.5rem',
        right: '1.5rem',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.6rem',
        pointerEvents: 'none',
      }}>
        {toasts.map(t => (
          <div
            key={t.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.7rem',
              padding: '0.75rem 1rem',
              borderRadius: '10px',
              background: '#fff',
              border: `1px solid ${t.type === 'error' ? '#fecaca' : '#bbf7d0'}`,
              boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
              fontSize: '0.85rem',
              fontWeight: 500,
              color: t.type === 'error' ? '#991b1b' : '#166534',
              minWidth: '280px',
              maxWidth: '380px',
              pointerEvents: 'all',
              animation: 'toastSlideIn 0.25s cubic-bezier(0.16,1,0.3,1) both',
            }}
          >
            {t.type === 'error'
              ? <XCircle size={16} style={{ flexShrink: 0, color: '#dc2626' }} />
              : <CheckCircle2 size={16} style={{ flexShrink: 0, color: '#16a34a' }} />
            }
            <span style={{ flex: 1 }}>{t.message}</span>
            <button
              onClick={() => dismiss(t.id)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: '0.1rem' }}
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes toastSlideIn {
          from { opacity: 0; transform: translateY(12px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)   scale(1); }
        }
      `}</style>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>')
  return ctx.addToast
}
