/* ==========================================================================
   NEBULA CORE // SECURE ADMINISTRATION & ACCESS LOGS CONTROLLERS
   ========================================================================== */

let activeEditingRoleId = null;
let activeSeverityFilter = 'all';

/**
 * Populate access tables and role directory cards
 */
function initializeAdminSuite() {
  renderRolesDirectory();
  renderAccessLogs(ACCESS_LOGS);
  renderOperatorsList();
  
  // Set initial settings switches visual values from config data
  document.getElementById('setting-api').checked = SYSTEM_SETTINGS.api;
  document.getElementById('setting-mfa').checked = SYSTEM_SETTINGS.mfa;
  document.getElementById('setting-telemetry').checked = SYSTEM_SETTINGS.telemetry;
}

/**
 * 1. USER ROLE DIRECTORY ENGINE
 * Dynamically draws current active role profiles inside role grid
 */
function renderRolesDirectory() {
  const container = document.getElementById('role-grid-container');
  if (!container) return;

  container.innerHTML = '';

  USER_ROLES.forEach(role => {
    const card = document.createElement('div');
    card.className = 'role-row-card';
    
    // Determine graphic visual class based on role id
    let badgeClass = 'merchandiser';
    let iconLetter = 'M';
    if (role.id === 'admin') { badgeClass = 'admin'; iconLetter = 'A'; }
    if (role.id === 'manager') { badgeClass = 'manager'; iconLetter = 'D'; }

    card.innerHTML = `
      <div class="role-left-cap">
        <div class="role-badge-graphic ${badgeClass}">${iconLetter}</div>
        <div class="role-name-block">
          <span class="role-title">${role.name}</span>
          <span class="role-subtitle">${role.code} // Active Headcount: ${role.headcount}</span>
        </div>
      </div>
      <div class="permissions-summary">
        <span class="perm-pill ${role.permissions.read ? 'active' : ''}">Read-Only View</span>
        <span class="perm-pill ${role.permissions.write ? 'active' : ''}">Wholesale Edit</span>
        <span class="perm-pill ${role.permissions.admin ? 'active' : ''}">Decryption Clear</span>
      </div>
      <button class="perm-edit-btn" onclick="openPermissionModal('${role.id}')" title="Configure Capability Matrix">
        <i data-lucide="key-round"></i>
      </button>
    `;

    container.appendChild(card);
  });

  // Re-generate Lucide SVG shapes
  lucide.createIcons();
}

/**
 * Open credential settings modal for a specific role
 * @param {string} roleId 
 */
function openPermissionModal(roleId) {
  const role = USER_ROLES.find(r => r.id === roleId);
  if (!role) return;

  activeEditingRoleId = roleId;

  document.getElementById('modal-role-name').textContent = role.name.toUpperCase();
  
  // Set modal switch values
  document.getElementById('perm-read').checked = role.permissions.read;
  document.getElementById('perm-write').checked = role.permissions.write;
  document.getElementById('perm-admin').checked = role.permissions.admin;

  // Reveal modal panel in DOM
  const modal = document.getElementById('permission-modal');
  modal.classList.remove('hidden');
  modal.style.opacity = '0';
  
  setTimeout(() => {
    modal.style.opacity = '1';
  }, 10);

  showToast('Role Selected', `Editing permissions for ${role.name}.`, 'info');
}

/**
 * Dismiss permissions modal panel
 */
function closePermissionModal() {
  const modal = document.getElementById('permission-modal');
  modal.style.opacity = '0';
  
  setTimeout(() => {
    modal.classList.add('hidden');
    activeEditingRoleId = null;
  }, 200);
}

/**
 * Apply toggled capability matrix to specific role
 */
function saveRolePermissions() {
  if (!activeEditingRoleId) return;

  const roleIndex = USER_ROLES.findIndex(r => r.id === activeEditingRoleId);
  if (roleIndex === -1) return;

  // Read toggles state
  USER_ROLES[roleIndex].permissions.read = document.getElementById('perm-read').checked;
  USER_ROLES[roleIndex].permissions.write = document.getElementById('perm-write').checked;
  USER_ROLES[roleIndex].permissions.admin = document.getElementById('perm-admin').checked;

  // Re-render and close
  renderRolesDirectory();
  closePermissionModal();

  showToast('Permissions Saved', `Successfully updated role permissions for: ${USER_ROLES[roleIndex].name}`, 'success');
}

/**
 * 2. TELEMETRY ENGINE SWITCHES & SLIDERS
 * Triggered on operations settings adjustments
 * @param {string} key - setting identifier
 * @param {any} value - updated value
 */
function saveSystemSetting(key, value) {
  SYSTEM_SETTINGS[key] = value;
  
  let labelText = 'Setting Updated';
  let severity = 'info';
  let message = `System preferences updated successfully.`;

  if (key === 'api') {
    labelText = 'API Integrations';
    severity = value ? 'success' : 'error';
    message = value ? 'External REST API integrations enabled.' : 'External REST API integrations disabled.';
  } else if (key === 'mfa') {
    labelText = 'MFA Settings';
    severity = value ? 'success' : 'warning';
    message = value ? 'Multi-Factor Authentication is now active.' : 'Multi-Factor Authentication bypassed.';
  } else if (key === 'telemetry') {
    labelText = 'Real-time System Updates';
    severity = value ? 'success' : 'info';
    message = value ? 'Real-time UI refresh channels operational.' : 'Real-time UI refresh channels paused.';
  } else if (key === 'sync-rate') {
    labelText = 'Sync Interval';
    message = `Refreshing dashboard data every ${value} seconds.`;
  } else if (key === 'rotation-rate') {
    labelText = 'Session Expiration';
    message = `Admin session expiration set to ${value} hours.`;
  }

  showToast(labelText, message, severity);
}

/**
 * Update visual text next to slider dynamically
 * @param {string} labelId - target span element
 * @param {string} valueText - updated text display
 */
function updateRangeLabel(labelId, valueText) {
  const elem = document.getElementById(labelId);
  if (elem) elem.textContent = valueText;
}

/**
 * 3. ACCESS LOGS AUDIT ENGINE
 * Populates security audit table from database array
 * @param {Array} logsList - logs to populate
 */
function renderAccessLogs(logsList) {
  const tbody = document.getElementById('logs-tbody');
  if (!tbody) return;

  tbody.innerHTML = '';

  if (logsList.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" class="align-center" style="color: var(--text-muted); font-family: var(--font-mono); font-size: 0.75rem; padding: 2rem;">
          NO ACCESS NODES DETECTED UNDER SELECTED FILTER METRICS
        </td>
      </tr>
    `;
    return;
  }

  logsList.forEach(log => {
    const row = document.createElement('tr');
    
    // Format timestamp nicely for futuristic display
    const date = new Date(log.timestamp);
    const timeStr = date.toLocaleTimeString() + ' // ' + date.toLocaleDateString();

    row.innerHTML = `
      <td><span class="log-timestamp">${timeStr}</span></td>
      <td>
        <div class="log-operator">
          <img src="${log.avatar}" alt="${log.operator}">
          <span>${log.operator}</span>
        </div>
      </td>
      <td><span class="log-message">${log.action}</span></td>
      <td><span class="log-ip">${log.ip}</span></td>
      <td><span class="log-status ${log.status}">${log.status}</span></td>
    `;

    tbody.appendChild(row);
  });
}

/**
 * Filter logs inside search bar inputs
 */
function filterAccessLogs() {
  const query = document.getElementById('log-search-input').value.trim().toLowerCase();
  
  const filtered = ACCESS_LOGS.filter(log => {
    // Check if matches text query
    const matchText = log.operator.toLowerCase().includes(query) || 
                      log.action.toLowerCase().includes(query) || 
                      log.ip.includes(query) || 
                      log.status.toLowerCase().includes(query);
    
    // Check if matches severity buttons filter
    const matchSeverity = activeSeverityFilter === 'all' || log.status === activeSeverityFilter;
    
    return matchText && matchSeverity;
  });

  renderAccessLogs(filtered);
}

/**
 * Trigger severity buttons category filtering
 * @param {string} severity - 'SUCCESS', 'WARNING', 'CRITICAL', or 'all'
 */
function filterLogsBySeverity(severity) {
  activeSeverityFilter = severity;

  // Highlight selected tab visually
  const tabs = document.querySelectorAll('.severity-tab');
  tabs.forEach(tab => {
    if (tab.getAttribute('data-severity') === severity) {
      tab.classList.add('active');
    } else {
      tab.classList.remove('active');
    }
  });

  // Filter logs list
  filterAccessLogs();
  showToast('AUDIT REPORT SHIFTED', `Swapped log readouts filter to: ${severity.toUpperCase()}`, 'info');
}

/**
 * 4. CLEARANCE & OPERATOR REGISTRY ENGINE
 * Renders list of authorized users under User Directory card
 */
function renderOperatorsList() {
  const container = document.getElementById('operator-list-container');
  if (!container) return;

  container.innerHTML = '';

  if (SYSTEM_OPERATORS.length === 0) {
    container.innerHTML = `
      <div class="align-center" style="color: var(--text-muted); font-family: var(--font-mono); font-size: 0.75rem; padding: 2rem; border: 1px dashed var(--border-glass); border-radius: var(--border-radius-sm); width: 100%;">
        NO SYSTEM OPERATORS GRANTED SYSTEM CLEARANCE CURRENTLY
      </div>
    `;
    return;
  }

  SYSTEM_OPERATORS.forEach(op => {
    const card = document.createElement('div');
    card.className = 'operator-row-card';

    // Format date nicely
    const dateParts = op.dateAdded.split('-');
    const formattedDate = `AUTHORIZED: ${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;

    // Compact role class name for CSS badge
    const badgeRoleClass = op.role.replace(/\s+/g, '');

    card.innerHTML = `
      <div class="op-profile">
        <div class="op-avatar-wrap">
          <img src="${op.avatar}" alt="${op.name}">
          <div class="op-status-dot"></div>
        </div>
        <div class="op-identity">
          <span class="op-name">${op.name}</span>
          <span class="op-email">${op.email}</span>
        </div>
      </div>
      <div class="op-meta">
        <span class="op-clearance-badge ${badgeRoleClass}">${op.role.toUpperCase()}</span>
        <span class="op-date">${formattedDate}</span>
      </div>
      <button class="cyber-btn deauth-btn" onclick="removeOperator('${op.id}')">
        DEACTIVATE
      </button>
    `;

    container.appendChild(card);
  });
}

/**
 * Open inject operator modal overlay
 */
function openAddUserModal() {
  const modal = document.getElementById('add-user-modal');
  modal.classList.remove('hidden');
  modal.style.opacity = '0';
  
  // Clear any past inputs
  document.getElementById('add-op-name').value = '';
  document.getElementById('add-op-email').value = '';
  document.getElementById('add-op-password').value = '';
  document.getElementById('add-op-role').selectedIndex = 1;

  setTimeout(() => {
    modal.style.opacity = '1';
  }, 10);

  showToast('GATEWAY ACCESS TRIGGERED', 'Opening operator registry clearance ports...', 'warning');
}

/**
 * Dismiss inject operator modal overlay
 */
function closeAddUserModal() {
  const modal = document.getElementById('add-user-modal');
  modal.style.opacity = '0';
  
  setTimeout(() => {
    modal.classList.add('hidden');
  }, 200);
}

/**
 * Register new operator, push to database, and re-render
 * @param {Event} event 
 */
function addNewOperator(event) {
  event.preventDefault();

  const name = document.getElementById('add-op-name').value.trim();
  const email = document.getElementById('add-op-email').value.trim();
  const password = document.getElementById('add-op-password').value;
  const role = document.getElementById('add-op-role').value;

  if (!name || !email || !password || !role) {
    showToast('REGISTRATION INCORRECT', 'All clearance descriptors (including password) are required to grant access.', 'error');
    return;
  }

  // Choose a random cool premium avatar
  const randomPicId = Math.floor(Math.random() * 70);
  const avatarUrl = `https://i.pravatar.cc/150?img=${randomPicId}`;

  // Assign clearance codes
  let roleCode = "SEC-LVL-2";
  if (role === 'Administrator') roleCode = "SEC-LVL-4";
  if (role === 'Sales Director') roleCode = "SEC-LVL-3";

  // Create operator object
  const newOp = {
    id: `op-${Date.now()}`,
    name: name.toUpperCase(),
    email: email.toLowerCase(),
    role: role,
    roleCode: roleCode,
    avatar: avatarUrl,
    status: "ACTIVE",
    dateAdded: new Date().toISOString().split('T')[0],
    password: password // Included for demo purposes
  };

  // Push and update
  SYSTEM_OPERATORS.push(newOp);
  localStorage.setItem('valois-operators', JSON.stringify(SYSTEM_OPERATORS));
  renderOperatorsList();
  closeAddUserModal();

  showToast('User Created', `User ${name} has been successfully created!`, 'success');
}

/**
 * Remove user access, delete from directory, and re-render
 * @param {string} operatorId 
 */
function removeOperator(operatorId) {
  const opIndex = SYSTEM_OPERATORS.findIndex(op => op.id === operatorId);
  if (opIndex === -1) return;

  const deauthedOperatorName = SYSTEM_OPERATORS[opIndex].name;

  // Remove operator
  SYSTEM_OPERATORS.splice(opIndex, 1);
  localStorage.setItem('valois-operators', JSON.stringify(SYSTEM_OPERATORS));
  renderOperatorsList();

  showToast('User Deactivated', `User ${deauthedOperatorName} has been successfully deactivated.`, 'error');
}
