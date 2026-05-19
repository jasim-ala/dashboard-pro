-- =====================================================================
-- VALOIS B2B DASHBOARD — FULL DATABASE SCHEMA
-- Run this once to initialize all tables
-- =====================================================================

-- Users table (synced with Clerk)
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'User',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Sales data (expanded with brand column)
CREATE TABLE IF NOT EXISTS sales_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  brand VARCHAR(100) NOT NULL DEFAULT 'Unknown',
  product_category VARCHAR(100) NOT NULL,
  units_sold INT NOT NULL,
  revenue DECIMAL(12, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Retail Partners / B2B Accounts
CREATE TABLE IF NOT EXISTS retail_partners (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  account_name VARCHAR(255) NOT NULL,
  store_location VARCHAR(255) NOT NULL,
  region VARCHAR(100) NOT NULL DEFAULT 'Dubai',
  contact_person VARCHAR(255) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'Active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Visual Merchandising Audit Log
CREATE TABLE IF NOT EXISTS vm_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_name VARCHAR(255) NOT NULL,
  brand VARCHAR(100) NOT NULL,
  store_location VARCHAR(255) NOT NULL,
  deployment_date DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- System Audit / Activity Log
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  action_type VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  performed_by VARCHAR(255) DEFAULT 'System',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_sales_date ON sales_data(date);
CREATE INDEX IF NOT EXISTS idx_sales_category ON sales_data(product_category);
CREATE INDEX IF NOT EXISTS idx_sales_brand ON sales_data(brand);
CREATE INDEX IF NOT EXISTS idx_partners_status ON retail_partners(status);
CREATE INDEX IF NOT EXISTS idx_partners_region ON retail_partners(region);
CREATE INDEX IF NOT EXISTS idx_vm_logs_brand ON vm_logs(brand);
CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_logs(created_at DESC);

