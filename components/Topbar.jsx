'use client'

import { Search, Sun, Moon, Bell, Menu } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function Topbar() {
  const [theme, setTheme] = useState('light')

  useEffect(() => {
    // Check initial theme from body class
    if (document.body.classList.contains('dark-theme')) {
      setTheme('dark')
    }
  }, [])

  const toggleTheme = () => {
    const isDark = theme === 'dark'
    if (isDark) {
      document.body.classList.remove('dark-theme')
      document.body.classList.add('light-theme')
      setTheme('light')
    } else {
      document.body.classList.remove('light-theme')
      document.body.classList.add('dark-theme')
      setTheme('dark')
    }
  }

  return (
    <header className="topbar-panel" id="topbar">
      <div className="topbar-left">
        <button className="mobile-menu-btn">
          <Menu size={20} />
        </button>
        
        <div className="search-command-bar">
          <Search className="search-icon" size={16} />
          <input type="text" placeholder="Search accounts, settings, or logs... [CMD + K]" />
          <kbd className="cmd-kbd">/</kbd>
        </div>
      </div>

      <div className="topbar-right">
        {/* System Status */}
        <div className="telemetry-bar">
          <div className="tel-item" title="API gateway response latency">
            <span className="tel-label">SYSTEM LATENCY</span>
            <span className="tel-value" style={{ color: 'var(--accent-green)', fontWeight: 600 }}>14ms</span>
          </div>
          <div className="tel-item" title="Data synchronization status">
            <span className="tel-label">DATA STATUS</span>
            <span className="tel-value" style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>Synced</span>
          </div>
        </div>

        {/* Aesthetic Theme Switch Widget */}
        <div className="top-widget theme-toggle-widget" onClick={toggleTheme} title="Toggle Visual Theme (Dark / White)" style={{ marginRight: '0.5rem' }}>
          {theme === 'dark' ? <Sun className="widget-icon" size={18} /> : <Moon className="widget-icon" size={18} />}
        </div>

        {/* Notifications Widget */}
        <div className="top-widget notifications-widget">
          <Bell className="widget-icon" size={18} />
          <span className="notification-badge"></span>
        </div>
      </div>
    </header>
  )
}
