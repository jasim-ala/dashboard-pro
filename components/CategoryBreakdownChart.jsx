'use client'

import { useMemo } from 'react'
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js'
import { Bar } from 'react-chartjs-2'

// Register ChartJS modules
ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
)

export default function CategoryBreakdownChart({ transactions = [] }) {
  const chartData = useMemo(() => {
    if (!transactions.length) return null

    // Group units and revenue by category
    const categoryMap = {}
    transactions.forEach(tx => {
      const cat = tx.product_category || 'Other'
      const rev = parseFloat(tx.revenue) || 0
      categoryMap[cat] = (categoryMap[cat] || 0) + rev
    })

    const labels = Object.keys(categoryMap)
    const values = Object.values(categoryMap)

    return {
      labels,
      datasets: [
        {
          label: 'Total Revenue (USD)',
          data: values,
          backgroundColor: [
            'rgba(168, 85, 247, 0.45)', // Translucent Purple
            'rgba(16, 185, 129, 0.45)', // Translucent Green
          ],
          borderColor: [
            '#a855f7', // Purple
            '#10b981', // Green
          ],
          borderWidth: 1.5,
          borderRadius: 6,
          borderSkipped: false,
          barPercentage: 0.55
        }
      ]
    }
  }, [transactions])

  if (!chartData) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '240px',
        color: 'var(--text-muted)',
        fontSize: '0.85rem'
      }}>
        Add wholesale orders to view segment breakdown.
      </div>
    )
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(10, 10, 12, 0.95)',
        titleColor: '#fff',
        bodyColor: '#a1a1aa',
        borderColor: 'rgba(255, 255, 255, 0.08)',
        borderWidth: 1,
        padding: 10,
        cornerRadius: 6,
        callbacks: {
          label: function(context) {
            const val = context.parsed.y
            return ' ' + new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val)
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#a1a1aa',
          font: {
            family: 'Plus Jakarta Sans',
            size: 11,
            weight: '600'
          }
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
            if (value >= 1e3) return '$' + (value / 1e3).toFixed(0) + 'k'
            return '$' + value
          }
        }
      }
    }
  }

  return (
    <div style={{ width: '100%', height: '100%', minHeight: '230px', position: 'relative' }}>
      <Bar data={chartData} options={options} />
    </div>
  )
}
