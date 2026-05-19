'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { UserButton, useUser } from '@clerk/nextjs'
import { ShoppingBag, ChevronLeft, TrendingUp, Sliders } from 'lucide-react'

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()
  const { user } = useUser()

  return (
    <aside className={`sidebar-panel ${collapsed ? 'collapsed' : ''}`} id="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-brand">
          <div className="brand-symbol">
            <ShoppingBag className="brand-icon" size={18} />
          </div>
          <span className="brand-name">VALOIS B2B</span>
        </div>
        <button className="collapse-trigger" onClick={() => setCollapsed(!collapsed)} title="Toggle Navigation Panel">
          <ChevronLeft className="arrow-icon" size={18} />
        </button>
      </div>

      <nav className="sidebar-nav">
        <ul>
          <li>
            <Link href="/sales" className={`nav-link ${pathname === '/sales' ? 'active' : ''}`}>
              <TrendingUp className="nav-icon" size={18} />
              <span className="nav-text">User Dashboard</span>
              <span className="tooltip">User Dashboard</span>
            </Link>
          </li>
          
          {user?.publicMetadata?.role === 'Admin' && (
            <li>
              <Link href="/admin" className={`nav-link ${pathname === '/admin' ? 'active' : ''}`}>
                <Sliders className="nav-icon" size={18} />
                <span className="nav-text">Admin Dashboard</span>
                <span className="tooltip">Admin Dashboard</span>
              </Link>
            </li>
          )}
        </ul>
      </nav>

      <div className="sidebar-footer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="profile-chip" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <UserButton 
            appearance={{
              elements: {
                userButtonAvatarBox: { width: 36, height: 36 }
              }
            }} 
          />
          {!collapsed && (
            <div className="profile-info">
              <div className="operator-name">{user?.firstName || 'USER'}</div>
              <div className="operator-role">{user?.publicMetadata?.role || 'Operator'}</div>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}
