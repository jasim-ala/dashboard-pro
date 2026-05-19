/* ==========================================================================
   NEBULA CORE // GLOBAL SYSTEM ORCHESTRATOR & ROUTER
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initializeSystemEngine();
});

/**
 * Main bootloader system
 */
function initializeSystemEngine() {
  // 1. Initialize Interactive Particle Network
  bootParticleBackground();

  // 2. Initialize Pointer Tracker Glow spotlight
  bootCursorGlowTracker();

  // 3. Compile Lucide SVG Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // 4. Setup Global Keyboard Shortcuts
  bootKeyboardShortcuts();

  // 5. Welcome Toast alert
  showToast('GATEWAY ONLINE', 'Nebula core telemetry channel initialized successfully. Secure port 8443 open.', 'success');
}

/**
 * Single-Page Router View Swapper
 * @param {string} view - target view ('sales' or 'admin')
 */
function navigate(view) {
  const salesView = document.getElementById('sales-view');
  const adminView = document.getElementById('admin-view');
  const navLinks = document.querySelectorAll('.nav-link');

  // Skip if same view active
  if (view === 'sales' && !salesView.classList.contains('hidden')) return;
  if (view === 'admin' && !adminView.classList.contains('hidden')) return;

  // Cinematic view transition timeline swap
  const activeView = view === 'sales' ? adminView : salesView;
  const targetView = view === 'sales' ? salesView : adminView;

  activeView.classList.add('invisible-fade');
  
  setTimeout(() => {
    activeView.classList.add('hidden');
    activeView.classList.remove('invisible-fade');

    targetView.classList.remove('hidden');
    targetView.classList.add('invisible-fade');
    
    // Trigger charts rendering or admin stats
    if (view === 'sales') {
      // Re-trigger graphs draw animations
      switchTimePeriod('monthly');
      renderSalesLedger();
    } else {
      initializeAdminSuite();
    }

    setTimeout(() => {
      targetView.classList.remove('invisible-fade');
    }, 50);

  }, 300);

  // Update active sidebar navigators classes
  navLinks.forEach(link => {
    if (link.getAttribute('href') === `#/${view}`) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // If mobile, auto-close drawer after navigation
  const sidebar = document.getElementById('sidebar');
  if (sidebar.classList.contains('mobile-active')) {
    sidebar.classList.remove('mobile-active');
  }
}

/**
 * Initialize sales metrics telemetry after auth clearance
 */
function initializeDashboardCore() {
  // Sync core metric displays and mount default monthly charts
  switchTimePeriod('monthly');
  renderSalesLedger();
  
  // Custom dashboard greeting toast
  setTimeout(() => {
    showToast('WELCOME OPERATOR', 'Valois apparel operations panel loaded. Active targets cataloged.', 'success');
  }, 1000);
}

/**
 * Collapsible sidebar controls
 */
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  
  if (window.innerWidth <= 768) {
    // Mobile viewport: toggle drawer overlay
    sidebar.classList.toggle('mobile-active');
  } else {
    // Desktop viewport: toggle icon collapsed mode
    sidebar.classList.toggle('collapsed');
    
    // Inform charts canvas to adjust their bounds to fit new grid dimensions
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 250);
  }
}

/**
 * Close mobile sidebar if clicked outside panel
 */
document.addEventListener('click', (e) => {
  const sidebar = document.getElementById('sidebar');
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  
  if (window.innerWidth <= 768 && 
      sidebar.classList.contains('mobile-active') && 
      !sidebar.contains(e.target) && 
      !mobileMenuBtn.contains(e.target)) {
    sidebar.classList.remove('mobile-active');
  }
});

/**
 * Toggle notification alerts dropdown
 */
function toggleNotifications() {
  const dropdown = document.getElementById('notif-dropdown');
  dropdown.classList.toggle('hidden');
}

// Close notification dropdown when clicked outside widget
document.addEventListener('click', (e) => {
  const widget = document.querySelector('.notifications-widget');
  const dropdown = document.getElementById('notif-dropdown');
  
  if (widget && dropdown && !widget.contains(e.target) && !dropdown.classList.contains('hidden')) {
    dropdown.classList.add('hidden');
  }
});

/**
 * Decouple connection and return to sign-in page
 */
function logout() {
  showToast('Logging Out', 'Signing out of your session securely...', 'warning');

  setTimeout(() => {
    triggerWarpTransition(() => {
      // Hide dashboard layouts
      document.getElementById('app-layout').classList.add('hidden');
      document.getElementById('auth-page').classList.remove('hidden');

      // Clear password field for security
      document.getElementById('login-password').value = '';
      
      showToast('Logged Out', 'You have been signed out.', 'success');
    });
  }, 600);
}

/**
 * ==========================================================================
 * HIGH-TECH TOAST NOTIFICATIONS DISPATCHER
 * ==========================================================================
 * Spawns dynamic diagnostic toasts in bottom right viewport
 * @param {string} title - title header
 * @param {string} message - description text
 * @param {string} type - 'success', 'warning', 'error', 'info'
 */
function showToast(title, message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;

  // Select suitable high-tech icons
  let iconName = 'info';
  if (type === 'success') iconName = 'shield-check';
  if (type === 'warning') iconName = 'alert-triangle';
  if (type === 'error') iconName = 'shield-alert';

  toast.innerHTML = `
    <div class="toast-ico-wrapper">
      <i data-lucide="${iconName}"></i>
    </div>
    <div class="toast-body">
      <span class="toast-title">${title}</span>
      <span class="toast-msg">${message}</span>
    </div>
    <div class="toast-close" onclick="removeToast(this.parentElement)">
      <i data-lucide="x"></i>
    </div>
  `;

  container.appendChild(toast);
  
  // Render lucide icon in newly created DOM node
  lucide.createIcons();

  // Auto-remove toast after 4.5 seconds
  setTimeout(() => {
    removeToast(toast);
  }, 4500);
}

function removeToast(toastElement) {
  if (!toastElement) return;
  toastElement.classList.add('removing');
  
  // Allow animation time to complete
  setTimeout(() => {
    if (toastElement.parentNode) {
      toastElement.parentNode.removeChild(toastElement);
    }
  }, 300);
}

/**
 * ==========================================================================
 * INTERACTIVE POINTER TRACKER GLOW
 * ==========================================================================
 * Positions glowing radial gradient spotlight behind panels
 */
function bootCursorGlowTracker() {
  const glow = document.getElementById('cursor-glow');
  
  document.addEventListener('mousemove', (e) => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
  });

  // Interactive 3D Card Hover Tilts
  // Tracks client coordinates inside card boundary to flex gradients and rotation
  document.addEventListener('mousemove', (e) => {
    const cards = document.querySelectorAll('[data-tilt]');
    
    cards.forEach(card => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Assign mouse coords as CSS variables to drive card glow overlays
      card.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
      card.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);

      // Gentle 3D rotate logic
      if (window.innerWidth > 768) {
        const tiltX = ((y / rect.height) - 0.5) * 10; // Max 5deg tilt
        const tiltY = ((x / rect.width) - 0.5) * -10;
        card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
      }
    });
  });

  document.addEventListener('mouseleave', () => {
    const cards = document.querySelectorAll('[data-tilt]');
    cards.forEach(card => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
    });
  });
}

/**
 * ==========================================================================
 * GLOBAL SHORTCUTS CORE (CMD+K / slash)
 * ==========================================================================
 */
function bootKeyboardShortcuts() {
  // Global shortcut listeners
  document.addEventListener('keydown', (e) => {
    // CMD + K / CTRL + K -> Focus Top search input
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      const search = document.querySelector('.search-command-bar input');
      if (search) search.focus();
    }
    
    // '/' -> Focus Logs search input if admin page is active
    if (e.key === '/' && document.activeElement.tagName !== 'INPUT') {
      const adminView = document.getElementById('admin-view');
      if (adminView && !adminView.classList.contains('hidden')) {
        e.preventDefault();
        const logSearch = document.getElementById('log-search-input');
        if (logSearch) logSearch.focus();
      }
    }
  });
}

function searchFocus(isFocused) {
  const kbd = document.querySelector('.cmd-kbd');
  if (kbd) {
    kbd.style.opacity = isFocused ? '0' : '1';
  }
}

/**
 * ==========================================================================
 * HIGH PERFORMANCE RADIAL PARTICLE NETWORKS
 * ==========================================================================
 * Draws drifting holographic nodes linked by thin web lines
 */
function bootParticleBackground() {
  return; // Particle matrix background disabled for clean professional SaaS style

  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  let particles = [];
  const mouse = {
    x: null,
    y: null,
    radius: 150
  };

  // Re-scale canvas bounds to capture full window limits
  function setCanvasBounds() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  setCanvasBounds();
  window.addEventListener('resize', setCanvasBounds);

  // Capture cursor position in background
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  // Particle Node Blueprint
  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.35; // Slow drift velocity
      this.vy = (Math.random() - 0.5) * 0.35;
      this.radius = Math.random() * 1.5 + 0.5; // Faint, subtle points
      // Dynamic colors based on electric blue / purple themes
      this.color = Math.random() > 0.5 ? 'rgba(0, 240, 255, 0.25)' : 'rgba(161, 0, 255, 0.15)';
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }

    update() {
      // Rebound against window boundaries
      if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
      if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;

      // Attract/Repel slightly on cursor proximity
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < mouse.radius) {
          const force = (mouse.radius - distance) / mouse.radius;
          this.x -= dx * force * 0.02; // Attract slightly toward cursor
          this.y -= dy * force * 0.02;
        }
      }

      this.x += this.vx;
      this.y += this.vy;
      this.draw();
    }
  }

  // Populate particle matrix (cap headcount at 45 to protect framerates)
  function initMatrix() {
    particles = [];
    const count = Math.min(Math.floor((canvas.width * canvas.height) / 32000), 50);
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  }
  initMatrix();
  window.addEventListener('resize', initMatrix);

  // Connect close points with neon links
  function connectPoints() {
    for (let a = 0; a < particles.length; a++) {
      for (let b = a; b < particles.length; b++) {
        const dx = particles[a].x - particles[b].x;
        const dy = particles[a].y - particles[b].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Draw line if points are sufficiently close
        if (distance < 120) {
          // Fade opacity based on proximity
          const opacity = (1 - (distance / 120)) * 0.06;
          ctx.strokeStyle = `rgba(0, 240, 255, ${opacity})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.stroke();
        }
      }
    }
  }

  // Animation Loop Core
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const isLight = document.body.classList.contains('light-theme');
    const colorStart = isLight ? 'rgba(255, 255, 255, 0.4)' : 'rgba(10, 10, 18, 0.4)';
    const colorEnd = isLight ? '#f3f4f8' : '#050508';

    // Re-draw background visual accent gradient overlay
    const radialGlow = ctx.createRadialGradient(
      canvas.width / 2, canvas.height / 2, 10,
      canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height)
    );
    radialGlow.addColorStop(0, colorStart);
    radialGlow.addColorStop(1, colorEnd);
    ctx.fillStyle = radialGlow;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Update and link points
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
    }
    connectPoints();
    
    requestAnimationFrame(animate);
  }
  animate();
}

/**
 * ==========================================================================
 * DYNAMIC THEME ENGINE (DARK / WHITE TOGGLE)
 * ==========================================================================
 */
function toggleTheme() {
  const body = document.body;
  const isLight = body.classList.toggle('light-theme');
  
  // Toggle icon displays
  const sunIcon = document.getElementById('theme-icon-light');
  const moonIcon = document.getElementById('theme-icon-dark');
  
  if (isLight) {
    if (sunIcon) sunIcon.style.display = 'none';
    if (moonIcon) moonIcon.style.display = 'block';
    showToast('THEME SHIFTED', 'Swapped core dashboard viewports to futuristic Frosted-White glass mode.', 'success');
  } else {
    if (sunIcon) sunIcon.style.display = 'block';
    if (moonIcon) moonIcon.style.display = 'none';
    showToast('THEME SHIFTED', 'Swapped core dashboard viewports to cinematic Space-Dark mode.', 'success');
  }

  // Persist preference
  localStorage.setItem('valois-theme', isLight ? 'light' : 'dark');

  // Inform Chart instances to re-render using updated light/dark label fonts
  if (typeof updateChartsThemeColors === 'function') {
    updateChartsThemeColors(isLight);
  }
}

// Restore saved user theme preference on boot
document.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('valois-theme');
  if (savedTheme === 'dark') {
    // If explicitly set to dark theme, remove default light theme
    document.body.classList.remove('light-theme');
    
    // Set theme widgets display
    const sunIcon = document.getElementById('theme-icon-light');
    const moonIcon = document.getElementById('theme-icon-dark');
    if (sunIcon) sunIcon.style.display = 'block';
    if (moonIcon) moonIcon.style.display = 'none';
  } else {
    // Default is light (white) theme. Ensure light-theme class is active
    document.body.classList.add('light-theme');
    
    const sunIcon = document.getElementById('theme-icon-light');
    const moonIcon = document.getElementById('theme-icon-dark');
    if (sunIcon) sunIcon.style.display = 'none';
    if (moonIcon) moonIcon.style.display = 'block';
  }
});

// ==========================================================================
// B2B WHOLESALE SALES LEDGER & TRANSACTION PIPELINE CONTROLLERS
// ==========================================================================

/**
 * Render all wholesale transactions inside the sales ledger table
 */
function renderSalesLedger() {
  const tbody = document.getElementById('sales-tbody');
  if (!tbody) return;

  tbody.innerHTML = '';

  if (typeof SALES_TRANSACTIONS === 'undefined' || SALES_TRANSACTIONS.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="align-center" style="color: var(--text-muted); font-family: var(--font-mono); font-size: 0.75rem; padding: 2rem; text-align: center;">
          NO WHOLESALE TRANSACTIONS LOGGED IN PIPELINE
        </td>
      </tr>
    `;
    return;
  }

  SALES_TRANSACTIONS.forEach(tx => {
    const row = document.createElement('tr');
    
    // Formatting currency and category mix text
    const revStr = '$' + tx.revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const categoryMix = `${tx.apparelUnits} Apparel // ${tx.lifestyleUnits} Lifestyle`;
    
    // Status Badge classes
    let statusClass = 'SUCCESS';
    if (tx.status === 'PROCESSING') statusClass = 'WARNING';
    if (tx.status === 'PENDING') statusClass = 'CRITICAL';

    row.innerHTML = `
      <td><span class="log-timestamp" style="font-weight: 600;">${tx.date}</span></td>
      <td><span class="log-ip" style="font-family: var(--font-mono); font-weight: 700; color: var(--accent-cyan); font-size: 0.72rem;">${tx.id}</span></td>
      <td>
        <div class="log-operator" style="gap: 0.5rem;">
          <span style="font-weight: 750; font-size: 0.82rem; letter-spacing: 0.02em;">${tx.brand}</span>
        </div>
      </td>
      <td><span class="log-message" style="font-size: 0.75rem;">${categoryMix}</span></td>
      <td><span class="log-message" style="font-weight: 800; font-family: var(--font-mono); color: var(--text-primary);">${revStr}</span></td>
      <td><span class="log-status ${statusClass}">${tx.status}</span></td>
    `;

    tbody.appendChild(row);
  });
}

/**
 * Open the Add wholesale contract modal
 */
function openAddOrderModal() {
  const modal = document.getElementById('add-order-modal');
  if (!modal) return;
  modal.classList.remove('hidden');
  modal.style.opacity = '0';
  
  // Clear inputs
  document.getElementById('add-order-brand').value = '';
  document.getElementById('add-order-apparel').value = '';
  document.getElementById('add-order-lifestyle').value = '';
  document.getElementById('add-order-revenue').value = '';
  document.getElementById('add-order-status').selectedIndex = 0;

  setTimeout(() => {
    modal.style.opacity = '1';
  }, 10);

  showToast('TRANSACTION GATEWAY', 'Opening B2B wholesale order pipeline logging...', 'info');
}

/**
 * Close the Add wholesale contract modal
 */
function closeAddOrderModal() {
  const modal = document.getElementById('add-order-modal');
  if (!modal) return;
  modal.style.opacity = '0';
  
  setTimeout(() => {
    modal.classList.add('hidden');
  }, 200);
}

/**
 * Submit and process a new B2B Wholesale order contract
 */
function addNewWholesaleOrder(event) {
  event.preventDefault();

  const brand = document.getElementById('add-order-brand').value.trim();
  const apparel = parseInt(document.getElementById('add-order-apparel').value);
  const lifestyle = parseInt(document.getElementById('add-order-lifestyle').value);
  const revenue = parseFloat(document.getElementById('add-order-revenue').value);
  const status = document.getElementById('add-order-status').value;

  if (!brand || isNaN(apparel) || isNaN(lifestyle) || isNaN(revenue) || revenue <= 0) {
    showToast('SUBMISSION REJECTED', 'Please enter valid order quantities and financial value.', 'error');
    return;
  }

  // 1. Generate Order ID
  const lastTxId = SALES_TRANSACTIONS.length > 0 ? SALES_TRANSACTIONS[0].id : "TX-9000";
  const numId = parseInt(lastTxId.split('-')[1]) + 1;
  const newTxId = `TX-${numId}`;

  const today = new Date().toISOString().split('T')[0];

  // 2. Create the Transaction object
  const newTx = {
    id: newTxId,
    date: today,
    brand: brand.toUpperCase(),
    apparelUnits: apparel,
    lifestyleUnits: lifestyle,
    revenue: revenue,
    status: status
  };

  // 3. Prepends it to local pipeline database
  SALES_TRANSACTIONS.unshift(newTx);

  // 4. Check if brand is a new client account
  let brandIsNew = true;
  // If we already have a previous order from this brand in older records, it is not new
  for (let i = 1; i < SALES_TRANSACTIONS.length; i++) {
    if (SALES_TRANSACTIONS[i].brand === brand.toUpperCase()) {
      brandIsNew = false;
      break;
    }
  }

  // 5. Dynamic metrics calculation logic: Add to the period statistics
  
  // Daily Feed:
  TELEMETRY_DATA.daily.revenue += revenue;
  if (brandIsNew) TELEMETRY_DATA.daily.accounts += 1;
  
  // Update daily chart data
  const dailyCharts = TELEMETRY_DATA.daily.charts;
  if (dailyCharts.revenue.length > 0) {
    dailyCharts.revenue[dailyCharts.revenue.length - 1] += revenue;
    dailyCharts.velocityApparel[dailyCharts.velocityApparel.length - 1] += apparel;
    dailyCharts.velocityLifestyle[dailyCharts.velocityLifestyle.length - 1] += lifestyle;
  }

  // Monthly Feed:
  TELEMETRY_DATA.monthly.revenue += revenue;
  if (brandIsNew) TELEMETRY_DATA.monthly.accounts += 1;
  
  // Update monthly chart data
  const monthlyCharts = TELEMETRY_DATA.monthly.charts;
  if (monthlyCharts.revenue.length > 0) {
    monthlyCharts.revenue[monthlyCharts.revenue.length - 1] += revenue;
    monthlyCharts.velocityApparel[monthlyCharts.velocityApparel.length - 1] += apparel;
    monthlyCharts.velocityLifestyle[monthlyCharts.velocityLifestyle.length - 1] += lifestyle;
  }

  // Yearly Feed:
  TELEMETRY_DATA.yearly.revenue += revenue;
  if (brandIsNew) TELEMETRY_DATA.yearly.accounts += 1;
  
  // Update yearly chart data
  const yearlyCharts = TELEMETRY_DATA.yearly.charts;
  if (yearlyCharts.revenue.length > 0) {
    yearlyCharts.revenue[yearlyCharts.revenue.length - 1] += revenue;
    yearlyCharts.velocityApparel[yearlyCharts.velocityApparel.length - 1] += apparel;
    yearlyCharts.velocityLifestyle[yearlyCharts.velocityLifestyle.length - 1] += lifestyle;
  }

  // 6. Push to System Logs under Administration
  if (typeof ACCESS_LOGS !== 'undefined') {
    const newAuditLog = {
      timestamp: new Date().toISOString(),
      operator: "VALOIS ADMIN",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop",
      action: `Logged wholesale order ${newTxId} for client ${brand.toUpperCase()} ($${revenue.toLocaleString()})`,
      ip: "10.0.8.14",
      status: "SUCCESS"
    };
    ACCESS_LOGS.unshift(newAuditLog);
    // If admin panel is rendered, refresh the list
    if (typeof renderAccessLogs === 'function') {
      renderAccessLogs(ACCESS_LOGS);
    }
  }

  // 7. Sync current Active period dashboard displays & redraw active Chart.js graph
  const activeTab = document.querySelector('.time-tab.active');
  const activePeriod = activeTab ? activeTab.getAttribute('data-period') : 'monthly';
  
  updateKPICardsData(activePeriod);
  renderChartsForPeriod(activePeriod);
  renderSalesLedger();

  // 8. Close Modal and Dispatch Success Toast
  closeAddOrderModal();
  showToast('ORDER PIPELINE SYNCED', `Wholesale contract ${newTxId} logged. Sales calculations updated.`, 'success');
}

/**
 * ==========================================================================
 * HIGH FIDELITY SALES DATA SERIALIZATION & REPORT EXPORTER (EXCEL & PDF)
 * ==========================================================================
 */

/**
 * Toggle export selection dropdown
 */
function toggleExportDropdown() {
  const dropdown = document.getElementById('export-dropdown');
  if (dropdown) dropdown.classList.toggle('hidden');
}

// Close export dropdown when clicking elsewhere
document.addEventListener('click', (e) => {
  const dropdown = document.getElementById('export-dropdown');
  const btn = document.querySelector('.export-dropdown-wrapper button');
  if (dropdown && btn && !dropdown.contains(e.target) && !btn.contains(e.target) && !dropdown.classList.contains('hidden')) {
    dropdown.classList.add('hidden');
  }
});

/**
 * Orchestrator to serialise reports and fire the format compile builders
 * @param {string} format - 'excel' or 'pdf'
 */
function triggerExport(format) {
  // Identify the currently selected segmented period
  const activeTab = document.querySelector('.time-tab.active');
  const period = activeTab ? activeTab.getAttribute('data-period') : 'monthly';
  
  if (period === 'daily') {
    showToast('EXPORT UNAVAILABLE', 'Real-time telemetry feeds cannot be serialized. Select Monthly or Yearly matrix.', 'warning');
    return;
  }

  showToast('COMPILING REPORT', `Extracting and compiling B2B wholesale ${period} dataset...`, 'info');

  setTimeout(() => {
    if (format === 'excel') {
      exportToExcel(period);
    } else if (format === 'pdf') {
      exportToPDF(period);
    }
    
    // Close overlay dropdown
    const dropdown = document.getElementById('export-dropdown');
    if (dropdown) dropdown.classList.add('hidden');
  }, 1000);
}

/**
 * Serializes dataset to CSV matrix (opens natively inside Excel, Numbers, Sheets)
 * @param {string} period - 'monthly' or 'yearly'
 */
function exportToExcel(period) {
  const data = TELEMETRY_DATA[period];
  if (!data) return;

  const charts = data.charts;
  
  // Assemble CSV raw contents
  let csv = "VALOIS APPAREL B2B WHOLESALE CORPORATE REPORT\r\n";
  csv += `TELEMETRY METRIC: ${period.toUpperCase()} REPORT SUMMARY\r\n`;
  csv += `GENERATED: ${new Date().toLocaleString()}\r\n`;
  csv += "CLEARANCE SEC LEVEL: SEC-LVL-4 AUTHORIZED DECRYPTION\r\n\r\n";
  
  csv += "TIME FRAME MATRIX,WHOLESALE REVENUE (USD),APPAREL UNIT VELOCITY,LIFESTYLE UNIT VELOCITY\r\n";

  for (let i = 0; i < charts.labels.length; i++) {
    const label = charts.labels[i];
    const revenue = charts.revenue[i];
    const apparel = charts.velocityApparel[i];
    const lifestyle = charts.velocityLifestyle[i];
    csv += `"${label}",${revenue},${apparel},${lifestyle}\r\n`;
  }

  // Calculate totals row
  const sumRevenue = charts.revenue.reduce((a, b) => a + b, 0);
  const sumApparel = charts.velocityApparel.reduce((a, b) => a + b, 0);
  const sumLifestyle = charts.velocityLifestyle.reduce((a, b) => a + b, 0);
  csv += `\r\nTOTALS RECORDED,${sumRevenue},${sumApparel},${sumLifestyle}\r\n`;

  // Spawn download blob trigger
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `Valois_B2B_Sales_Report_${period.toUpperCase()}_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  showToast('EXPORT GRANTED', `Excel matrix spreadsheet Valois_B2B_Sales_Report_${period.toUpperCase()} saved.`, 'success');
}

/**
 * Spawns a gorgeous high-fidelity vector PDF print tab
 * @param {string} period - 'monthly' or 'yearly'
 */
function exportToPDF(period) {
  const data = TELEMETRY_DATA[period];
  if (!data) return;

  const charts = data.charts;
  const sumRevenue = charts.revenue.reduce((a, b) => a + b, 0).toLocaleString();
  const sumApparel = charts.velocityApparel.reduce((a, b) => a + b, 0).toLocaleString();
  const sumLifestyle = charts.velocityLifestyle.reduce((a, b) => a + b, 0).toLocaleString();
  
  // Format table rows
  let rowsHTML = "";
  for (let i = 0; i < charts.labels.length; i++) {
    const label = charts.labels[i];
    const revenue = charts.revenue[i].toLocaleString();
    const apparel = charts.velocityApparel[i].toLocaleString();
    const lifestyle = charts.velocityLifestyle[i].toLocaleString();
    rowsHTML += `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #dee2e6; font-family: monospace;"><strong>${label}</strong></td>
        <td style="padding: 10px; border-bottom: 1px solid #dee2e6; color: #007ea7; font-weight: bold;">$${revenue}</td>
        <td style="padding: 10px; border-bottom: 1px solid #dee2e6;">${apparel} units</td>
        <td style="padding: 10px; border-bottom: 1px solid #dee2e6;">${lifestyle} units</td>
      </tr>
    `;
  }

  // Open an isolated sandbox window for native high-definition vector printing
  const win = window.open('', '_blank');
  win.document.write(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>VALOIS WHOLESALE SYSTEM DATA - ${period.toUpperCase()}</title>
      <style>
        body {
          font-family: 'Outfit', 'Helvetica Neue', Helvetica, Arial, sans-serif;
          color: #1a1a24;
          background: #ffffff;
          padding: 30px;
          margin: 0;
        }
        .header-panel {
          border-bottom: 2px solid #1a1a24;
          padding-bottom: 15px;
          margin-bottom: 30px;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
        }
        .title-block h1 {
          font-size: 26px;
          font-weight: 800;
          letter-spacing: 1px;
          margin: 0 0 5px 0;
          color: #0f1016;
        }
        .title-block span {
          font-size: 11px;
          color: #6c757d;
          font-weight: bold;
          letter-spacing: 2px;
          text-transform: uppercase;
        }
        .metadata-block {
          text-align: right;
          font-size: 11px;
          line-height: 1.5;
          color: #495057;
        }
        .stats-summary-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-bottom: 35px;
        }
        .stat-card {
          background: #f8f9fa;
          border: 1px solid #e9ecef;
          border-radius: 8px;
          padding: 15px;
        }
        .stat-label {
          font-size: 10px;
          color: #6c757d;
          font-weight: 800;
          letter-spacing: 1px;
          text-transform: uppercase;
          margin-bottom: 5px;
        }
        .stat-value {
          font-size: 20px;
          font-weight: 800;
          color: #12131a;
        }
        .report-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 40px;
        }
        .report-table th {
          background: #f1f3f5;
          border-bottom: 2px solid #dee2e6;
          padding: 12px 10px;
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          text-align: left;
          letter-spacing: 0.5px;
        }
        .footer-note {
          border-top: 1px solid #dee2e6;
          padding-top: 15px;
          font-size: 9px;
          color: #868e96;
          text-align: center;
          text-transform: uppercase;
          letter-spacing: 1.5px;
        }
        @media print {
          body { padding: 0; }
        }
      </style>
    </head>
    <body>
      <div class="header-panel">
        <div class="title-block">
          <h1>VALOIS APPAREL B2B</h1>
          <span>Global Sales Telemetry System</span>
        </div>
        <div class="metadata-block">
          <strong>REPORT CLEARANCE ID:</strong> SEC-VLS-${period.toUpperCase()}-${new Date().getFullYear()}<br>
          <strong>EXTRACTION DATETIME:</strong> ${new Date().toLocaleString()}<br>
          <strong>DECIPHER KEY INTEGRITY:</strong> LEVEL 4 DECRYPTED
        </div>
      </div>

      <div class="stats-summary-grid">
        <div class="stat-card">
          <div class="stat-label">AGGREGATE PERIOD REVENUE</div>
          <div class="stat-value">$${sumRevenue}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">AGGREGATE APPAREL VELOCITY</div>
          <div class="stat-value">${sumApparel} units</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">AGGREGATE LIFESTYLE VELOCITY</div>
          <div class="stat-value">${sumLifestyle} units</div>
        </div>
      </div>

      <table class="report-table">
        <thead>
          <tr>
            <th style="padding: 12px 10px;">Time-Series Reference</th>
            <th style="padding: 12px 10px;">Net Wholesale Revenue (USD)</th>
            <th style="padding: 12px 10px;">Apparel Unit Velocity</th>
            <th style="padding: 12px 10px;">Lifestyle Unit Velocity</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHTML}
        </tbody>
      </table>

      <div class="footer-note">
        Valois Telemetry Platform // Security Matrix Key Clearance Approved
      </div>

      <script>
        window.onload = function() {
          setTimeout(function() {
            window.print();
            window.close();
          }, 300);
        }
      </script>
    </body>
    </html>
  `);
  win.document.close();

  showToast('EXPORT GRANTED', 'PDF report formatted and printed successfully.', 'success');
}
