'use client'

import { useState, useMemo } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { Line } from 'react-chartjs-2'

// Register ChartJS modules
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

export default function NetSalesChart({ transactions = [] }) {
  const [chartMode, setChartMode] = useState('cumulative') // 'daily' or 'cumulative'

  // Process data for the chart
  const chartData = useMemo(() => {
    if (!transactions.length) return null

    // Sort transactions by date ascending
    const sortedTx = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date))

    // Group by date
    const dateMap = {}
    sortedTx.forEach(tx => {
      const dateStr = tx.date
      const rev = parseFloat(tx.revenue) || 0
      dateMap[dateStr] = (dateMap[dateStr] || 0) + rev
    })

    const labels = Object.keys(dateMap)
    const dailyValues = Object.values(dateMap)

    // Calculate cumulative values
    const cumulativeValues = []
    let sum = 0
    dailyValues.forEach(val => {
      sum += val
      cumulativeValues.push(sum)
    })

    return {
      labels,
      daily: dailyValues,
      cumulative: cumulativeValues
    }
  }, [transactions])

  if (!chartData) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '280px',
        color: 'var(--text-muted)',
        fontSize: '0.88rem'
      }}>
        No transactions logged yet. Add your first wholesale order below to populate the chart.
      </div>
    )
  }

  // Define dynamic HSL/RGB colors matching the dashboard glow
  const isCumulative = chartMode === 'cumulative'
  const accentColor = isCumulative ? 'rgb(245, 158, 11)' : 'rgb(6, 182, 212)' // Amber vs Cyan
  const accentGlow = isCumulative ? 'rgba(245, 158, 11, 0.15)' : 'rgba(6, 182, 212, 0.15)'

  const data = {
    labels: chartData.labels,
    datasets: [
      {
        label: isCumulative ? 'Cumulative Net Revenue (USD)' : 'Daily Order Revenue (USD)',
        data: isCumulative ? chartData.cumulative : chartData.daily,
        fill: true,
        borderColor: accentColor,
        borderWidth: 2,
        pointBackgroundColor: accentColor,
        pointBorderColor: 'rgba(255, 255, 255, 0.8)',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: accentColor,
        pointRadius: chartData.labels.length > 30 ? 1 : 4,
        pointHoverRadius: 6,
        tension: 0.35, // Smooth curves
        backgroundColor: (context) => {
          const chart = context.chart
          const { ctx, chartArea } = chart
          if (!chartArea) return null
          const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom)
          gradient.addColorStop(0, isCumulative ? 'rgba(245, 158, 11, 0.25)' : 'rgba(6, 182, 212, 0.25)')
          gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
          return gradient
        },
      }
    ]
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false // We use our own toggles/headers
      },
      tooltip: {
        backgroundColor: 'rgba(10, 10, 12, 0.95)',
        titleColor: '#fff',
        bodyColor: '#a1a1aa',
        borderColor: 'rgba(255, 255, 255, 0.08)',
        borderWidth: 1,
        padding: 10,
        cornerRadius: 6,
        displayColors: false,
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || ''
            if (label) {
              label = ': '
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.parsed.y)
            }
            return label
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.02)',
          tickColor: 'rgba(255, 255, 255, 0.05)'
        },
        ticks: {
          color: '#71717a',
          font: {
            family: 'Plus Jakarta Sans',
            size: 10
          },
          maxTicksLimit: 12
        }
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.03)',
          tickColor: 'rgba(255, 255, 255, 0.05)'
        },
        ticks: {
          color: '#71717a',
          font: {
            family: 'Plus Jakarta Sans',
            size: 10
          },
          callback: function(value) {
            if (value >= 1e6) return '$' + (value / 1e6).toFixed(1) + 'M'
            if (value >= 1e3) return '$' + (value / 1e3).toFixed(0) + 'k'
            return '$' + value
          }
        }
      }
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }}>
      {/* Chart controls */}
      <div style={{
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '0.5rem',
        marginBottom: '1rem'
      }}>
        <button
          onClick={() => setChartMode('cumulative')}
          style={{
            padding: '0.3rem 0.7rem',
            fontSize: '0.72rem',
            fontWeight: 700,
            background: isCumulative ? 'rgba(245, 158, 11, 0.1)' : 'transparent',
            border: `1px solid ${isCumulative ? 'rgb(245, 158, 11)' : 'var(--border-glass)'}`,
            borderRadius: '4px',
            color: isCumulative ? 'rgb(245, 158, 11)' : 'var(--text-muted)',
            cursor: 'pointer',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            transition: 'all 0.2s'
          }}
        >
          Cumulative
        </button>
        <button
          onClick={() => setChartMode('daily')}
          style={{
            padding: '0.3rem 0.7rem',
            fontSize: '0.72rem',
            fontWeight: 700,
            background: !isCumulative ? 'rgba(6, 182, 212, 0.1)' : 'transparent',
            border: `1px solid ${!isCumulative ? 'rgb(6, 182, 212)' : 'var(--border-glass)'}`,
            borderRadius: '4px',
            color: !isCumulative ? 'rgb(6, 182, 212)' : 'var(--text-muted)',
            cursor: 'pointer',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            transition: 'all 0.2s'
          }}
        >
          Daily Flow
        </button>
      </div>

      {/* Actual Line Canvas */}
      <div style={{ flexGrow: 1, minHeight: '260px', position: 'relative' }}>
        <Line data={data} options={options} />
      </div>
    </div>
  )
}
