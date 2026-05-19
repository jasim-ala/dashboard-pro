'use client'

import { useState, useRef, useEffect } from 'react'
import { Download, FileSpreadsheet, FileText, ChevronDown, Loader2 } from 'lucide-react'

function formatCurrency(n) {
  return `$${Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export default function ExportButton({ transactions = [], metrics = {} }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(null) // 'pdf' | 'excel'
  const dropdownRef = useRef(null)

  // Close on outside click
  useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  async function exportExcel() {
    setLoading('excel')
    setOpen(false)
    try {
      const { utils, writeFile } = await import('xlsx')

      // Summary sheet
      const summaryData = [
        ['VALOIS B2B — Sales Report'],
        ['Generated', new Date().toLocaleString('en-AE')],
        [],
        ['Total Revenue', formatCurrency(metrics.totalRevenue || 0)],
        ['Total Orders', transactions.length],
        [],
      ]

      // Transactions sheet
      const txHeaders = ['Date', 'Brand', 'Category', 'Units Sold', 'Revenue (USD)', 'Status']
      const txRows = transactions.map(t => [
        t.date,
        t.brand,
        t.product_category,
        t.units_sold,
        parseFloat(t.revenue),
        t.status || 'DELIVERED',
      ])

      const wb = utils.book_new()

      // Sheet 1 — Summary
      const wsSummary = utils.aoa_to_sheet([...summaryData])
      wsSummary['!cols'] = [{ wch: 24 }, { wch: 30 }]
      utils.book_append_sheet(wb, wsSummary, 'Summary')

      // Sheet 2 — Transactions
      const wsTx = utils.aoa_to_sheet([txHeaders, ...txRows])
      wsTx['!cols'] = [{ wch: 12 }, { wch: 20 }, { wch: 16 }, { wch: 12 }, { wch: 16 }, { wch: 14 }]
      utils.book_append_sheet(wb, wsTx, 'Transactions')

      writeFile(wb, `Valois_Sales_Report_${new Date().toISOString().split('T')[0]}.xlsx`)
    } catch (err) {
      console.error('Excel export failed:', err)
    }
    setLoading(null)
  }

  async function exportPDF() {
    setLoading('pdf')
    setOpen(false)
    try {
      const { default: jsPDF } = await import('jspdf')
      const { default: autoTable } = await import('jspdf-autotable')

      const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })
      const today = new Date().toLocaleDateString('en-AE', { year: 'numeric', month: 'long', day: 'numeric' })
      const pageW = doc.internal.pageSize.getWidth()

      // Header bar
      doc.setFillColor(15, 23, 42)
      doc.rect(0, 0, pageW, 22, 'F')
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(14)
      doc.setTextColor(255, 255, 255)
      doc.text('VALOIS B2B — Sales & Revenue Report', 14, 10)
      doc.setFontSize(8)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(148, 163, 184)
      doc.text(`Generated: ${today}`, 14, 17)

      // KPI summary boxes
      doc.setTextColor(15, 23, 42)
      const kpis = [
        ['Total Revenue', formatCurrency(metrics.totalRevenue || 0)],
        ['Total Orders',  String(transactions.length)],
        ['Avg. Order Value', transactions.length
          ? formatCurrency((metrics.totalRevenue || 0) / transactions.length)
          : '$0.00'],
      ]
      kpis.forEach(([label, value], i) => {
        const x = 14 + i * 92
        doc.setFillColor(248, 250, 252)
        doc.roundedRect(x, 27, 85, 18, 2, 2, 'F')
        doc.setDrawColor(226, 232, 240)
        doc.roundedRect(x, 27, 85, 18, 2, 2, 'S')
        doc.setFontSize(7)
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(100, 116, 139)
        doc.text(label.toUpperCase(), x + 5, 33)
        doc.setFontSize(12)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(15, 23, 42)
        doc.text(value, x + 5, 41)
      })

      // Transactions table
      doc.setFontSize(9)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(15, 23, 42)
      doc.text('Transaction Ledger', 14, 54)

      autoTable(doc, {
        startY: 57,
        head: [['Date', 'Brand', 'Category', 'Units', 'Revenue (USD)', 'Status']],
        body: transactions.map(t => [
          t.date,
          t.brand,
          t.product_category,
          String(t.units_sold),
          formatCurrency(t.revenue),
          t.status || 'DELIVERED',
        ]),
        styles: {
          fontSize: 8,
          cellPadding: 3,
          textColor: [51, 65, 85],
          lineColor: [226, 232, 240],
          lineWidth: 0.2,
        },
        headStyles: {
          fillColor: [15, 23, 42],
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          fontSize: 7.5,
          halign: 'left',
        },
        alternateRowStyles: { fillColor: [248, 250, 252] },
        columnStyles: {
          3: { halign: 'right' },
          4: { halign: 'right', fontStyle: 'bold', textColor: [22, 163, 74] },
        },
        margin: { left: 14, right: 14 },
        didDrawPage: (data) => {
          // Footer
          doc.setFontSize(7)
          doc.setTextColor(148, 163, 184)
          doc.text(
            `Page ${data.pageNumber} — Valois B2B Dashboard`,
            pageW / 2, doc.internal.pageSize.getHeight() - 6,
            { align: 'center' }
          )
        },
      })

      doc.save(`Valois_Sales_Report_${new Date().toISOString().split('T')[0]}.pdf`)
    } catch (err) {
      console.error('PDF export failed:', err)
    }
    setLoading(null)
  }

  return (
    <div ref={dropdownRef} style={{ position: 'relative' }}>
      <button
        className="cyber-btn"
        style={{ padding: '0.6rem 1.2rem', fontSize: '0.72rem', height: '36px', gap: '0.5rem', letterSpacing: '0.08em' }}
        onClick={() => setOpen(v => !v)}
        disabled={!!loading}
      >
        {loading ? <Loader2 size={14} style={{ animation: 'spin 0.7s linear infinite' }} /> : <Download size={14} />}
        <span className="btn-text">EXPORT REPORT</span>
        <ChevronDown size={12} style={{ marginLeft: '2px', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
      </button>

      {open && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 6px)',
          right: 0,
          background: '#fff',
          border: '1px solid #e2e8f0',
          borderRadius: '10px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          minWidth: '200px',
          zIndex: 200,
          overflow: 'hidden',
          animation: 'toastSlideIn 0.18s ease both',
        }}>
          <div style={{ padding: '0.5rem 0.75rem', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', color: '#94a3b8', borderBottom: '1px solid #f1f5f9' }}>
            CHOOSE FORMAT
          </div>
          <button onClick={exportExcel} style={menuItemStyle}>
            <FileSpreadsheet size={16} style={{ color: '#16a34a' }} />
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#0f172a' }}>Excel (.xlsx)</div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Multi-sheet workbook</div>
            </div>
          </button>
          <button onClick={exportPDF} style={{ ...menuItemStyle, borderBottom: 'none' }}>
            <FileText size={16} style={{ color: '#dc2626' }} />
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#0f172a' }}>PDF Report (.pdf)</div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Formatted landscape A4</div>
            </div>
          </button>
        </div>
      )}
    </div>
  )
}

const menuItemStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  width: '100%',
  padding: '0.75rem 1rem',
  background: 'none',
  border: 'none',
  borderBottom: '1px solid #f1f5f9',
  cursor: 'pointer',
  textAlign: 'left',
  transition: 'background 0.12s',
  onMouseEnter: e => e.currentTarget.style.background = '#f8fafc',
}
