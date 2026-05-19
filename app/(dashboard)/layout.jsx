import Sidebar from '@/components/Sidebar'
import Topbar from '@/components/Topbar'
import { ToastProvider } from '@/components/ToastProvider'

export default function DashboardLayout({ children }) {
  return (
    <ToastProvider>
      <div className="app-layout" id="app-layout">
        {/* Background Elements */}
        <canvas id="particle-canvas"></canvas>
        <div className="interactive-glow" id="cursor-glow"></div>
        <div className="screen-warp" id="screen-warp">
          <div className="warp-grid"></div>
          <div className="warp-flash"></div>
        </div>

        <Sidebar />
        <main className="main-container">
          <Topbar />
          {children}
        </main>
      </div>
    </ToastProvider>
  )
}
