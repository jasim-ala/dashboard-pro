'use client'

import { useMemo } from 'react'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js'
import { Doughnut } from 'react-chartjs-2'

// Register ChartJS modules
ChartJS.register(ArcElement, Tooltip, Legend)

export default function BrandShareChart({ transactions = [] }) {
  const chartData = useMemo(() => {
    if (!transactions.length) return null

    // Group revenue by brand
    const brandMap = {}
    transactions.forEach(tx => {
      const brand = tx.brand || 'Unknown'
      const rev = parseFloat(tx.revenue) || 0
      brandMap[brand] = (brandMap[brand] || 0) + rev
    })

    const labels = Object.keys(brandMap)
    const dataValues = Object.values(brandMap)

    return {
      labels,
      datasets: [
        {
          label: 'Revenue Share (USD)',
          data: dataValues,
          backgroundColor: [
            'rgba(0, 240, 255, 0.75)',   // Neon Cyan
            'rgba(245, 158, 11, 0.75)',  // Amber
            'rgba(168, 85, 247, 0.75)',  // Purple
            'rgba(16, 185, 129, 0.75)',  // Green
            'rgba(239, 68, 68, 0.75)',    // Red
          ],
          borderColor: [
            '#00f0ff',
            '#f59e0b',
            '#a855f7',
            '#10b981',
            '#ef4444',
          ],
          borderWidth: 1.5,
          hoverOffset: 12,
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
        Add wholesale orders to view brand market share.
      </div>
    )
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: '#e4e4e7',
          font: {
            family: 'Plus Jakarta Sans',
            size: 11,
            weight: '500'
          },
          padding: 15,
          usePointStyle: true,
          pointStyle: 'circle'
        }
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
            const value = context.parsed
            const total = context.dataset.data.reduce((acc, curr) => acc + curr, 0)
            const percentage = ((value / total) * 100).toFixed(1)
            const formattedVal = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
            return ` ${formattedVal} (${percentage}%)`
          }
        }
      }
    },
    cutout: '65%' // Doughnut inner circle cutout size
  }

  return (
    <div style={{ width: '100%', height: '100%', minHeight: '230px', position: 'relative' }}>
      <Doughnut data={chartData} options={options} />
    </div>
  )
}
