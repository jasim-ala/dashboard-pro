/* ==========================================================================
   NEBULA CORE // DYNAMIC DATA VISUALIZATION SYSTEMS
   ========================================================================== */

let revenueChartInstance = null;
let velocityChartInstance = null;
let mixChartInstance = null;

// Global defaults for Chart.js to fit the current active aesthetic
function configureChartDefaults() {
  if (typeof Chart === 'undefined') return;

  const isLight = document.body.classList.contains('light-theme');
  const textColor = isLight ? '#5c5f6a' : '#8a8e9b';
  const tooltipBg = isLight ? 'rgba(255, 255, 255, 0.98)' : 'rgba(10, 10, 15, 0.95)';
  const tooltipText = isLight ? '#12131a' : '#ffffff';
  const tooltipBorder = isLight ? 'rgba(0, 126, 167, 0.15)' : 'rgba(0, 240, 255, 0.2)';

  Chart.defaults.color = textColor; // --text-muted
  Chart.defaults.font.family = "'Plus Jakarta Sans', sans-serif";
  Chart.defaults.font.size = 11;
  Chart.defaults.responsive = true;
  Chart.defaults.maintainAspectRatio = false;
  
  // Custom tooltips styling
  Chart.defaults.plugins.tooltip.backgroundColor = tooltipBg;
  Chart.defaults.plugins.tooltip.titleColor = tooltipText;
  Chart.defaults.plugins.tooltip.titleFont = { family: "'Plus Jakarta Sans', sans-serif", weight: 'bold', size: 12 };
  Chart.defaults.plugins.tooltip.bodyColor = textColor;
  Chart.defaults.plugins.tooltip.bodyFont = { family: "'Plus Jakarta Sans', sans-serif", size: 11 };
  Chart.defaults.plugins.tooltip.borderColor = tooltipBorder;
  Chart.defaults.plugins.tooltip.borderWidth = 1;
  Chart.defaults.plugins.tooltip.padding = 10;
  Chart.defaults.plugins.tooltip.cornerRadius = 6;
  Chart.defaults.plugins.tooltip.displayColors = true;
  Chart.defaults.plugins.tooltip.boxWidth = 8;
  Chart.defaults.plugins.tooltip.boxHeight = 8;
  Chart.defaults.plugins.tooltip.usePointStyle = true;
}

/**
 * Initialize charts with specific historical metrics
 * @param {string} period - 'daily', 'monthly', or 'yearly'
 */
function renderChartsForPeriod(period) {
  const data = TELEMETRY_DATA[period];
  if (!data) return;

  const isLight = document.body.classList.contains('light-theme');
  const gridColor = isLight ? 'rgba(18, 19, 26, 0.04)' : 'rgba(255, 255, 255, 0.02)';
  const doughnutBorder = isLight ? '#ffffff' : '#050508';
  const textColor = isLight ? '#5c5f6a' : '#8a8e9b';

  const ctxRev = document.getElementById('revenue-chart').getContext('2d');
  const ctxVel = document.getElementById('velocity-chart').getContext('2d');
  const ctxMix = document.getElementById('mix-chart').getContext('2d');

  // Create Glow Area Canvas Gradients
  const cyanGrad = ctxRev.createLinearGradient(0, 0, 0, 300);
  if (isLight) {
    cyanGrad.addColorStop(0, 'rgba(2, 132, 199, 0.2)');
    cyanGrad.addColorStop(0.5, 'rgba(2, 132, 199, 0.05)');
    cyanGrad.addColorStop(1, 'rgba(2, 132, 199, 0)');
  } else {
    cyanGrad.addColorStop(0, 'rgba(0, 240, 255, 0.22)');
    cyanGrad.addColorStop(0.5, 'rgba(0, 240, 255, 0.06)');
    cyanGrad.addColorStop(1, 'rgba(0, 240, 255, 0)');
  }

  // 1. REVENUE AREA CHART
  if (revenueChartInstance) {
    revenueChartInstance.destroy();
  }
  
  revenueChartInstance = new Chart(ctxRev, {
    type: 'line',
    data: {
      labels: data.charts.labels,
      datasets: [{
        label: 'Revenue Stream (USD)',
        data: data.charts.revenue,
        borderColor: '#00f0ff',
        borderWidth: 2,
        pointBackgroundColor: '#00f0ff',
        pointBorderColor: '#050508',
        pointBorderWidth: 1.5,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: '#00f0ff',
        pointHoverBorderColor: '#ffffff',
        pointHoverBorderWidth: 2,
        fill: true,
        backgroundColor: cyanGrad,
        tension: 0.35
      }]
    },
    options: {
      scales: {
        x: {
          grid: { display: false },
          border: { display: false },
          ticks: { color: textColor }
        },
        y: {
          grid: { color: gridColor },
          border: { display: false },
          ticks: {
            color: textColor,
            callback: (val) => '$' + Number(val).toLocaleString()
          }
        }
      },
      plugins: {
        legend: { display: false }
      }
    }
  });

  // 2. APPAREL VS LIFESTYLE BAR CHART
  if (velocityChartInstance) {
    velocityChartInstance.destroy();
  }

  // Create Bar Gradients
  const barCyan = ctxVel.createLinearGradient(0, 0, 0, 300);
  barCyan.addColorStop(0, '#00f0ff');
  barCyan.addColorStop(1, 'rgba(0, 240, 255, 0.2)');

  const barPurple = ctxVel.createLinearGradient(0, 0, 0, 300);
  barPurple.addColorStop(0, '#a100ff');
  barPurple.addColorStop(1, 'rgba(161, 0, 255, 0.2)');

  velocityChartInstance = new Chart(ctxVel, {
    type: 'bar',
    data: {
      labels: data.charts.labels,
      datasets: [
        {
          label: 'Apparel Units Shipped',
          data: data.charts.velocityApparel,
          backgroundColor: barCyan,
          borderColor: 'rgba(0, 240, 255, 0.3)',
          borderWidth: 1,
          borderRadius: 4,
          borderSkipped: false
        },
        {
          label: 'Lifestyle Units Shipped',
          data: data.charts.velocityLifestyle,
          backgroundColor: barPurple,
          borderColor: 'rgba(161, 0, 255, 0.3)',
          borderWidth: 1,
          borderRadius: 4,
          borderSkipped: false
        }
      ]
    },
    options: {
      scales: {
        x: {
          grid: { display: false },
          border: { display: false },
          ticks: { color: textColor }
        },
        y: {
          grid: { color: gridColor },
          border: { display: false },
          ticks: {
            color: textColor,
            callback: (val) => Number(val).toLocaleString()
          }
        }
      },
      plugins: {
        legend: {
          position: 'top',
          align: 'end',
          labels: {
            color: textColor,
            boxWidth: 10,
            boxHeight: 10,
            usePointStyle: true,
            padding: 15
          }
        }
      }
    }
  });

  // 3. WHOLESALE VS DIRECT DOUGHNUT CHART
  if (mixChartInstance) {
    mixChartInstance.destroy();
  }

  mixChartInstance = new Chart(ctxMix, {
    type: 'doughnut',
    data: {
      labels: ['B2B Wholesale Contracts', 'Direct Showroom Channels'],
      datasets: [{
        data: data.charts.distribution,
        backgroundColor: [
          '#00f0ff',
          '#a100ff'
        ],
        borderColor: doughnutBorder,
        borderWidth: 3,
        hoverOffset: 4
      }]
    },
    options: {
      cutout: '75%',
      plugins: {
        legend: {
          position: 'right',
          labels: {
            color: textColor,
            boxWidth: 8,
            boxHeight: 8,
            usePointStyle: true,
            padding: 15
          }
        }
      }
    }
  });
}

/**
 * Handle user changing the time series tabs (Daily, Monthly, Yearly)
 * @param {string} period - 'daily', 'monthly', 'yearly'
 */
function switchTimePeriod(period) {
  // Update Active tab class in DOM
  const tabs = document.querySelectorAll('.time-tab');
  tabs.forEach(tab => {
    if (tab.getAttribute('data-period') === period) {
      tab.classList.add('active');
    } else {
      tab.classList.remove('active');
    }
  });

  // Fade out KPI cards, update data, then fade back in with nice staggering
  const cards = document.querySelectorAll('.kpi-card');
  cards.forEach((card, index) => {
    card.style.opacity = '0.3';
    card.style.transform = 'translateY(5px)';
  });

  // Animate values swap
  setTimeout(() => {
    updateKPICardsData(period);
    renderChartsForPeriod(period);
    
    cards.forEach((card, index) => {
      setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, index * 80);
    });

    showToast('Report Updated', `Successfully loaded report data for period: ${period.toUpperCase()}`, 'success');
  }, 300);
}

/**
 * Sync all numeric labels on the KPI grid cards
 * @param {string} period - 'daily', 'monthly', 'yearly'
 */
function updateKPICardsData(period) {
  const data = TELEMETRY_DATA[period];
  if (!data) return;

  // Total Revenue Label with odometer effect
  const revVal = document.getElementById('kpi-revenue');
  revVal.textContent = '$' + data.revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const revTrend = document.getElementById('kpi-revenue-trend');
  revTrend.querySelector('span:first-of-type').textContent = data.revenueTrend;

  // Active Accounts
  const accVal = document.getElementById('kpi-accounts');
  accVal.textContent = data.accounts;
  const accTrend = document.getElementById('kpi-accounts-trend');
  accTrend.querySelector('span:first-of-type').textContent = data.accountsTrend;

  // Visual Merchandising ROI Progress bar
  const vmVal = document.getElementById('kpi-vm-roi');
  vmVal.textContent = data.vmRoi + '%';
  const vmFill = document.getElementById('vm-roi-fill');
  // Scale it nicely to fit bar container
  const fillWidth = Math.min(data.vmRoi / 5, 100);
  vmFill.style.width = fillWidth + '%';

  // Wholesale Conversion Rate Circular gauge
  const convVal = document.getElementById('kpi-conversion');
  convVal.textContent = data.conversion + '%';
  const convCircle = document.getElementById('conversion-circle');
  
  // Calculate SVG circle dasharray bounds
  const dashVal = `${data.conversion}, 100`;
  convCircle.setAttribute('stroke-dasharray', dashVal);
}

/**
 * Adapt all Chart.js labels and gridlines dynamically when switching light/dark themes
 * @param {boolean} isLight 
 */
function updateChartsThemeColors(isLight) {
  if (typeof Chart === 'undefined') return;

  const textColor = isLight ? '#5c5f6a' : '#8a8e9b';
  const gridColor = isLight ? 'rgba(18, 19, 26, 0.04)' : 'rgba(255, 255, 255, 0.02)';
  const tooltipBg = isLight ? 'rgba(255, 255, 255, 0.98)' : 'rgba(10, 10, 15, 0.95)';
  const tooltipText = isLight ? '#12131a' : '#ffffff';
  const tooltipBorder = isLight ? 'rgba(0, 126, 167, 0.15)' : 'rgba(0, 240, 255, 0.2)';
  const doughnutBorder = isLight ? '#ffffff' : '#050508';

  // Apply to Global Defaults so any re-rendered charts adopt the theme
  Chart.defaults.color = textColor;
  Chart.defaults.plugins.tooltip.backgroundColor = tooltipBg;
  Chart.defaults.plugins.tooltip.titleColor = tooltipText;
  Chart.defaults.plugins.tooltip.bodyColor = textColor;
  Chart.defaults.plugins.tooltip.borderColor = tooltipBorder;

  // Apply to active Revenue Chart
  if (revenueChartInstance) {
    revenueChartInstance.options.scales.x.ticks.color = textColor;
    revenueChartInstance.options.scales.y.ticks.color = textColor;
    revenueChartInstance.options.scales.y.grid.color = gridColor;
    revenueChartInstance.update();
  }

  // Apply to active Velocity Chart
  if (velocityChartInstance) {
    velocityChartInstance.options.scales.x.ticks.color = textColor;
    velocityChartInstance.options.scales.y.ticks.color = textColor;
    velocityChartInstance.options.scales.y.grid.color = gridColor;
    velocityChartInstance.options.plugins.legend.labels.color = textColor;
    velocityChartInstance.update();
  }

  // Apply to active Mix Chart
  if (mixChartInstance) {
    mixChartInstance.options.plugins.legend.labels.color = textColor;
    mixChartInstance.data.datasets[0].borderColor = doughnutBorder;
    mixChartInstance.update();
  }
}
