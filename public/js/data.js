/* ==========================================================================
   NEBULA CORE // MOCK DATA ENGINE (B2B APPAREL & LIFESTYLE TELEMETRY)
   ========================================================================== */

const TELEMETRY_DATA = {
  // ----------------------------------------------------
  // DAILY PERIOD DATA (7 Days Window)
  // ----------------------------------------------------
  daily: {
    revenue: 104290,
    revenueTrend: "+8.4%",
    accounts: 384,
    accountsTrend: "+2 new clients",
    vmRoi: 365,
    conversion: 74.8,
    conversionTrend: "+2.1% vs benchmark",
    charts: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      revenue: [12400, 15800, 14200, 19100, 22400, 9800, 10590],
      velocityApparel: [480, 520, 450, 680, 710, 220, 280],
      velocityLifestyle: [290, 310, 340, 410, 490, 150, 190],
      distribution: [70, 30] // Wholesale vs Direct
    }
  },

  // ----------------------------------------------------
  // MONTHLY PERIOD DATA (12 Months Calendar Window)
  // ----------------------------------------------------
  monthly: {
    revenue: 1429820,
    revenueTrend: "+14.8%",
    accounts: 384,
    accountsTrend: "+8 this quarter",
    vmRoi: 382,
    conversion: 78.4,
    conversionTrend: "+4.2% vs benchmark",
    charts: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      revenue: [92000, 105000, 114000, 128000, 131000, 125000, 102000, 98000, 119000, 134000, 148000, 133820],
      velocityApparel: [3200, 3800, 4100, 4500, 4800, 4200, 3100, 2900, 3900, 4600, 5200, 4800],
      velocityLifestyle: [1900, 2100, 2300, 2900, 3100, 2800, 2100, 1800, 2400, 3100, 3700, 3400],
      distribution: [78, 22] // Wholesale vs Direct
    }
  },

  // ----------------------------------------------------
  // ANNUAL PERIOD DATA (5 Years Window)
  // ----------------------------------------------------
  yearly: {
    revenue: 6890400,
    revenueTrend: "+22.3%",
    accounts: 384,
    accountsTrend: "+46 overall",
    vmRoi: 412,
    conversion: 81.2,
    conversionTrend: "+6.8% vs benchmark",
    charts: {
      labels: ["2022", "2023", "2024", "2025", "2026"],
      revenue: [3890000, 4520000, 5100000, 6050000, 6890400],
      velocityApparel: [112000, 138000, 154000, 172000, 198000],
      velocityLifestyle: [64000, 78000, 89000, 104000, 124000],
      distribution: [84, 16] // Wholesale vs Direct
    }
  }
};

// ----------------------------------------------------
// SYSTEM SETTINGS INITIAL DATA
// ----------------------------------------------------
let SYSTEM_SETTINGS = {
  api: true,
  mfa: true,
  telemetry: false,
  syncRate: 15,
  rotationRate: 24
};

// ----------------------------------------------------
// DYNAMIC USER ROLE DIRECTORY & PERMISSIONS
// ----------------------------------------------------
let USER_ROLES = [
  {
    id: "admin",
    name: "Administrator",
    code: "SEC-LVL-4",
    headcount: 1,
    permissions: {
      read: true,
      write: true,
      admin: true
    }
  },
  {
    id: "manager",
    name: "Sales Director",
    code: "SEC-LVL-3",
    headcount: 3,
    permissions: {
      read: true,
      write: true,
      admin: false
    }
  },
  {
    id: "merchandiser",
    name: "Lead Merchandiser",
    code: "SEC-LVL-2",
    headcount: 2,
    permissions: {
      read: true,
      write: false,
      admin: false
    }
  }
];

// ----------------------------------------------------
// COMPREHENSIVE AUDIT TRAIL & LOGS DATA
// ----------------------------------------------------
const ACCESS_LOGS = [];

// ----------------------------------------------------
// DYNAMIC SYSTEM OPERATORS RECORDS DATABASE
// ----------------------------------------------------
let DEFAULT_SYSTEM_OPERATORS = [
  {
    id: "op-1",
    name: "VALOIS ADMIN",
    email: "admin@valois.com",
    role: "Administrator",
    roleCode: "SEC-LVL-4",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop",
    status: "ACTIVE",
    dateAdded: "2026-01-10"
  },
  {
    id: "op-2",
    name: "MARK OPERATOR",
    email: "mark@valois.com",
    role: "Sales Director",
    roleCode: "SEC-LVL-3",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&auto=format&fit=crop",
    status: "ACTIVE",
    dateAdded: "2026-03-14"
  },
  {
    id: "op-3",
    name: "ELENA MERCH",
    email: "elena@valois.com",
    role: "Lead Merchandiser",
    roleCode: "SEC-LVL-2",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=256&auto=format&fit=crop",
    status: "ACTIVE",
    dateAdded: "2026-04-02"
  }
];

let savedOperators = localStorage.getItem('valois-operators');
let SYSTEM_OPERATORS = savedOperators ? JSON.parse(savedOperators) : DEFAULT_SYSTEM_OPERATORS;

// ----------------------------------------------------
// DYNAMIC SALES TRANSACTIONS DATABASE
// ----------------------------------------------------
let SALES_TRANSACTIONS = [
  {
    id: "TX-9021",
    date: "2026-05-18",
    brand: "VALOIS APPAREL EU",
    apparelUnits: 1450,
    lifestyleUnits: 820,
    revenue: 48500.00,
    status: "DELIVERED"
  },
  {
    id: "TX-9020",
    date: "2026-05-17",
    brand: "LUMIERE BOUTIQUE",
    apparelUnits: 580,
    lifestyleUnits: 310,
    revenue: 19800.00,
    status: "DELIVERED"
  },
  {
    id: "TX-9019",
    date: "2026-05-16",
    brand: "MILAN SHOWROOM STORES",
    apparelUnits: 980,
    lifestyleUnits: 490,
    revenue: 31400.00,
    status: "DELIVERED"
  },
  {
    id: "TX-9018",
    date: "2026-05-15",
    brand: "APEX LIFESTYLE DIST",
    apparelUnits: 1200,
    lifestyleUnits: 850,
    revenue: 42000.00,
    status: "PROCESSING"
  },
  {
    id: "TX-9017",
    date: "2026-05-14",
    brand: "NORDIC MERCH CO",
    apparelUnits: 340,
    lifestyleUnits: 200,
    revenue: 11200.00,
    status: "PENDING"
  }
];
