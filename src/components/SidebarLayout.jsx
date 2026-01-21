// src/components/SidebarLayout.jsx
import React, { useState, useEffect } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import {
  Home,
  Users,
  Truck,
  CheckSquare,
  FilePlus2,
  DollarSign,
  LogOut,
  Menu,
  ChevronLeft,
} from "lucide-react";

import SessionManager from "./SessionManager";

// Page Titles Map
const pageTitles = {
  "": "Dashboard",
  "daily-visitors": "Visitors Driver",
  "selected-drivers": "Final Drivers",
  "driver-registration": "Driver Signup",
  "daily-visitor-table": "Visitor Drivers List",
  "driver-verification": "Pending Drivers",
  "generate-gdc": "Generate GDC",
  "transport-visitor": "Visitor Transporter",
  "final-verified-transporter": "Final Transporter",
  "transporter-registration": "Transporter Signup",
  "payments": "Payments",
  "vehicles": "Vehicles List",
  "add-vehicle": "Add Vehicle",
  "reports/transporters": "Transporter Reports",
  "reports/payments": "Payments Reports",
  "visitor-transporters-list": "Visitor Transporters List",
  "selected-transporters-list": "Selected Transporters List",
  "transporter-verification": "Transporter Verification ",
  "drivers-reports": "Drivers Reports",
  "transporter-reports": "Transporter Reports",
  "payment-reports": "Payment Reports",
  "assign-driver": "Assign Driver",
"paid-by-transporter": "Paid By Transporter",
"payment-verified": "Payment Verified",
"current-posting": "Current Posting",
"final-settlement": "Final Settlement",
"transporter-ledger": "Transporter Ledger",
"driver-ledger": "Driver Ledger",

};

const sidebarSections = [
  {
    title: "Dashboard",
    items: [
      { label: "Dashboard", path: "", icon: <Home className="w-5 h-5" /> },
    ],
  },
  {
    title: "Drivers",
    items: [
      { label: "Visitors Driver", path: "daily-visitors", icon: <Users className="w-5 h-5" /> },
      { label: "Final Drivers", path: "selected-drivers", icon: <CheckSquare className="w-5 h-5" /> },
      { label: "Driver Signup", path: "driver-registration", icon: <FilePlus2 className="w-5 h-5" /> },
      { label: "Visitor Drivers List", path: "daily-visitor-table", icon: <FilePlus2 className="w-5 h-5" /> },
      { label: "Pending Drivers Verification", path: "driver-verification", icon: <CheckSquare className="w-5 h-5" /> },
      { label: "Generate GDC", path: "generate-gdc", icon: <CheckSquare className="w-5 h-5" /> },
    ],
  },
  {
    title: "Transporters",
    items: [
      { label: "Visitors Transporter", path: "transport-visitor", icon: <Truck className="w-5 h-5" /> },
      { label: "Visitors Transporters List", path: "visitor-transporters-list", icon: <Truck className="w-5 h-5" /> },
      { label: "Final Transporter", path: "selected-transporters-list", icon: <CheckSquare className="w-5 h-5" /> },
      { label: "Transporter Signup", path: "transporter-registration", icon: <FilePlus2 className="w-5 h-5" /> },
      { label: "Pending Transporters Verification", path: "transporter-verification", icon: <CheckSquare className="w-5 h-5" /> },
      { label: "Generate GDC for Transporter", path: "generate-gdc-transporter", icon: <CheckSquare className="w-5 h-5" /> },


    ],
  },
  {
    title: "Payments",
    items: [
      { label: "Payments", path: "payment-reports", icon: <DollarSign className="w-5 h-5" /> },
    ],
  },
  {
    title: "Reports",
    items: [
      { label: "Driver Reports", path: "drivers-reports", icon: <Users className="w-5 h-5" /> },
      { label: "Transporter Reports", path: "transporter-reports", icon: <Truck className="w-5 h-5" /> },
      { label: "Payments Reports", path: "payment-reports", icon: <DollarSign className="w-5 h-5" /> },
    ],
  },
  {
  title: "Operations",
  items: [
    { label: "Assign Driver", path: "assign-driver", icon: <Users className="w-5 h-5" /> },
    { label: "Paid By Transporter", path: "paid-by-transporter", icon: <DollarSign className="w-5 h-5" /> },
    { label: "Payment Verified", path: "payment-verified", icon: <CheckSquare className="w-5 h-5" /> },
    { label: "Current Posting", path: "current-posting", icon: <Truck className="w-5 h-5" /> },
    { label: "Final Settlement", path: "final-settlement", icon: <CheckSquare className="w-5 h-5" /> },
    { label: "Transporter Ledger", path: "transporter-ledger", icon: <FilePlus2 className="w-5 h-5" /> },
    { label: "Driver Ledger", path: "driver-ledger", icon: <Users className="w-5 h-5" /> },
  ],
},

];

export default function SidebarLayout({ onLogout }) {
  const location = useLocation();
  const currentPath = location.pathname.replace("/dashboard/", "");
  const pageTitle = pageTitles[currentPath] || "Dashboard";

  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setCollapsed(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const base = "/dashboard";

  return (
    <div className="min-h-screen flex bg-gray-100">
      <SessionManager />

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 flex flex-col bg-white shadow-xl 
        transition-all duration-300 border-r 
        ${collapsed ? "w-20" : "w-64"}`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          {!collapsed && (
            <span className="text-3xl font-bold text-green-600 tracking-wide">WTL</span>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-lg border bg-white hover:bg-gray-100"
          >
            {collapsed ? <ChevronLeft className="rotate-180" /> : <Menu />}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          {sidebarSections.map((section) => (
            <div key={section.title} className="mb-5">
              {!collapsed && (
                <h3 className="px-4 mb-2 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                  {section.title}
                </h3>
              )}

              <ul className="space-y-1 px-2">
                {section.items.map((item) => {
                  const to = item.path === "" ? base : `${base}/${item.path}`;
                  return (
                    <li key={to}>
                      <NavLink
                        to={to}
                        end={item.path === ""}
                        className={({ isActive }) =>
                          `flex items-center gap-3 p-3 rounded-xl transition-all
  ${isActive
                            ? "text-green-700 font-semibold"
                            : "hover:bg-gray-200 text-gray-700"
                          }`
                        }
                      >
                        <span className="text-green-600">{item.icon}</span>
                        {!collapsed && <span>{item.label}</span>}
                      </NavLink>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}

          <div className="px-2 mt-4">
            <button
              onClick={onLogout}
              className="flex items-center gap-3 w-full p-3 rounded-xl font-medium
                bg-red-50 text-red-600 border border-red-200 hover:bg-red-100"
            >
              <LogOut className="w-4 h-4" />
              {!collapsed && <span>Logout</span>}
            </button>
          </div>
        </nav>
      </aside>

      {/* Page Content */}
      <main
        className={`transition-all duration-300 min-h-screen bg-gray-100 
        ${collapsed ? "ml-20" : "ml-64"} w-full`}
      >
        <header className="p-5 bg-white shadow-md border-b sticky top-0 z-10">
          <h1 className="text-2xl font-bold text-gray-800">{pageTitle}</h1>
        </header>

        <div className="px-6 py-6 w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
