'use server'

import { sql } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { clerkClient } from '@clerk/nextjs/server'

// Internal constants (not exported — use lib/constants.js for client imports)
import { BRANDS, PRODUCT_CATEGORIES, REGIONS } from '@/lib/constants'

// =====================================================================
// HELPERS — Audit Logging
// =====================================================================
async function logAudit(action_type, description, performed_by = 'Admin') {
  try {
    await sql`INSERT INTO audit_logs (action_type, description, performed_by) VALUES (${action_type}, ${description}, ${performed_by})`
  } catch (e) {
    console.error('Audit log failed:', e)
  }
}

// Converts every Date / BigInt in a DB row to a plain string/number so
// Next.js can safely serialize the object across the server→client boundary.
function serializeRow(row) {
  const out = {}
  for (const [key, val] of Object.entries(row)) {
    if (val instanceof Date) {
      out[key] = val.toISOString().split('T')[0]   // 'YYYY-MM-DD'
    } else if (typeof val === 'bigint') {
      out[key] = val.toString()
    } else {
      out[key] = val
    }
  }
  return out
}

// =====================================================================
// SALES DATA
// =====================================================================
export async function getDashboardMetrics() {
  try {
    const { rows } = await sql`SELECT COALESCE(SUM(revenue), 0) as total_revenue FROM sales_data`
    return { totalRevenue: parseFloat(rows[0]?.total_revenue) || 0 }
  } catch (err) {
    console.error('Failed to fetch metrics:', err)
    return { totalRevenue: 0 }
  }
}

export async function addWholesaleOrder(formData) {
  try {
    const brand = formData.get('brand')
    const category = formData.get('category')
    const apparelUnits = parseInt(formData.get('apparelUnits'), 10) || 0
    const lifestyleUnits = parseInt(formData.get('lifestyleUnits'), 10) || 0
    const revenue = parseFloat(formData.get('revenue'))
    const date = new Date().toISOString().split('T')[0]
    const totalUnits = apparelUnits + lifestyleUnits

    await sql`INSERT INTO sales_data (date, brand, product_category, units_sold, revenue)
              VALUES (${date}, ${brand}, ${category}, ${totalUnits}, ${revenue})`

    await logAudit('SALE_ADDED', `New wholesale order added for ${brand} — $${revenue}`)
    revalidatePath('/sales')
    revalidatePath('/admin')
    return { success: true }
  } catch (err) {
    console.error('Failed to add order:', err)
    return { error: 'Failed to add order' }
  }
}

export async function getSalesTransactions() {
  try {
    const { rows } = await sql`
      SELECT id, date, brand, product_category, units_sold, revenue
      FROM sales_data
      ORDER BY created_at DESC
      LIMIT 50`
    return rows.map(serializeRow)
  } catch (err) {
    console.error('Failed to fetch transactions:', err)
    return []
  }
}

export async function bulkInsertSalesData(records) {
  try {
    let inserted = 0
    for (const row of records) {
      const { date, brand, product_category, units_sold, revenue } = row
      if (!date || !brand || !product_category || !units_sold || !revenue) continue
      await sql`INSERT INTO sales_data (date, brand, product_category, units_sold, revenue)
                VALUES (${date}, ${brand}, ${product_category}, ${parseInt(units_sold)}, ${parseFloat(revenue)})`
      inserted++
    }
    await logAudit('BULK_UPLOAD', `Bulk CSV upload: ${inserted} records inserted`)
    revalidatePath('/sales')
    revalidatePath('/admin')
    return { success: true, inserted }
  } catch (err) {
    console.error('Bulk insert failed:', err)
    return { error: 'Bulk insert failed' }
  }
}

// =====================================================================
// USERS
// =====================================================================
export async function getUsers() {
  try {
    const { rows } = await sql`SELECT id, email, role, created_at FROM users ORDER BY created_at DESC`
    return rows.map(serializeRow)
  } catch (err) {
    console.error('Failed to fetch users:', err)
    return []
  }
}

export async function addUser(prevState, formData) {
  try {
    const email = formData.get('email')
    const role = formData.get('role')
    await sql`INSERT INTO users (email, role) VALUES (${email}, ${role}) ON CONFLICT (email) DO UPDATE SET role = ${role}`
    await logAudit('USER_ADDED', `User ${email} added/updated with role ${role}`)
    revalidatePath('/admin')
    return { success: true }
  } catch (err) {
    console.error('Failed to add user:', err)
    return { error: 'Failed to add user' }
  }
}

export async function updateUserRole(userId, clerkId, newRole, email) {
  try {
    // Update Clerk metadata
    await clerkClient.users.updateUserMetadata(clerkId, {
      publicMetadata: { role: newRole },
    })
    // Sync to local DB
    await sql`UPDATE users SET role = ${newRole} WHERE email = ${email}`
    await logAudit('ROLE_CHANGED', `User ${email} role changed to ${newRole}`)
    revalidatePath('/admin')
    return { success: true }
  } catch (err) {
    console.error('Failed to update role:', err)
    return { error: 'Failed to update role' }
  }
}

// =====================================================================
// RETAIL PARTNERS
// =====================================================================
export async function getPartners() {
  try {
    const { rows } = await sql`SELECT * FROM retail_partners ORDER BY created_at DESC`
    return rows.map(serializeRow)
  } catch (err) {
    console.error('Failed to fetch partners:', err)
    return []
  }
}

export async function addPartner(prevState, formData) {
  try {
    const account_name = formData.get('account_name')
    const store_location = formData.get('store_location')
    const region = formData.get('region')
    const contact_person = formData.get('contact_person')
    const status = formData.get('status') || 'Active'

    await sql`INSERT INTO retail_partners (account_name, store_location, region, contact_person, status)
              VALUES (${account_name}, ${store_location}, ${region}, ${contact_person}, ${status})`

    await logAudit('PARTNER_ADDED', `New partner ${account_name} added in ${region}`)
    revalidatePath('/admin')
    return { success: true }
  } catch (err) {
    console.error('Failed to add partner:', err)
    return { error: 'Failed to add partner' }
  }
}

export async function updatePartnerStatus(id, status) {
  try {
    await sql`UPDATE retail_partners SET status = ${status} WHERE id = ${id}`
    await logAudit('PARTNER_STATUS', `Partner status updated to ${status}`)
    revalidatePath('/admin')
    return { success: true }
  } catch (err) {
    return { error: 'Failed to update status' }
  }
}

// =====================================================================
// VM AUDIT LOGS
// =====================================================================
export async function getVMLogs() {
  try {
    const { rows } = await sql`SELECT * FROM vm_logs ORDER BY created_at DESC LIMIT 50`
    return rows.map(serializeRow)
  } catch (err) {
    console.error('Failed to fetch VM logs:', err)
    return []
  }
}

export async function addVMLog(prevState, formData) {
  try {
    const campaign_name = formData.get('campaign_name')
    const brand = formData.get('brand')
    const store_location = formData.get('store_location')
    const deployment_date = formData.get('deployment_date')
    const notes = formData.get('notes') || ''

    await sql`INSERT INTO vm_logs (campaign_name, brand, store_location, deployment_date, notes)
              VALUES (${campaign_name}, ${brand}, ${store_location}, ${deployment_date}, ${notes})`

    await logAudit('VM_LOG_ADDED', `VM Audit: "${campaign_name}" for ${brand} at ${store_location}`)
    revalidatePath('/admin')
    return { success: true }
  } catch (err) {
    console.error('Failed to add VM log:', err)
    return { error: 'Failed to add VM log' }
  }
}

// =====================================================================
// SYSTEM AUDIT LOGS
// =====================================================================
export async function getAuditLogs() {
  try {
    const { rows } = await sql`SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 10`
    return rows.map(serializeRow)
  } catch (err) {
    console.error('Failed to fetch audit logs:', err)
    return []
  }
}
