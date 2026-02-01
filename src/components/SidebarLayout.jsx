// src/components/SidebarLayout.jsx
import React, { useState } from "react";
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
  ChevronDown,
} from "lucide-react";

import SessionManager from "./SessionManager";

/* ================= PAGE TITLES ================= */
const pageTitles = {
  "": "Dashboard",
  "daily-visitors": "Visitors Driver",
  "selected-drivers": "Final Drivers",
  "driver-registration": "Driver Signup",
  "daily-visitor-table": "Visitor Drivers List",
  "driver-verification": "Pending Drivers",
  "generate-gdc": "Generate GDC",

  "transport-visitor": "Visitor Transporter",
  "visitor-transporters-list": "Visitor Transporters List",
  "selected-transporters-list": "Final Transporter",
  "transporter-registration": "Transporter Signup",
  "transporter-verification": "Transporter Verification",
  "generate-gdc-transporter": "Generate GDC Transporter",

  "payments": "Payments",

  "drivers-reports": "Driver Reports",
  "transporter-reports": "Transporter Reports",
  "payment-reports": "Payment Reports",

  "assign-driver": "Assign Driver",
  "ideal-drivers": "Ideal Drivers",
  "payment-verified": "Payment Verified",
  "current-posting": "Current Posting",
  "final-settlement": "Final Settlement",
  "transporter-ledger": "Transporter Ledger",
  "driver-ledger": "Driver Ledger",
};

/* ================= SIDEBAR DATA ================= */
const sidebarSections = [
  {
    title: "Dashboard",
    items: [{ label: "Dashboard", path: "", icon: <Home size={18} /> }],
  },
  {
    title: "Drivers",
    items: [
      { label: "Visitors Driver", path: "daily-visitors", icon: <Users size={18} /> },
      { label: "Final Drivers", path: "selected-drivers", icon: <CheckSquare size={18} /> },
      { label: "Driver Signup", path: "driver-registration", icon: <FilePlus2 size={18} /> },
      { label: "Visitor Drivers List", path: "daily-visitor-table", icon: <FilePlus2 size={18} /> },
      { label: "Pending Drivers Verification", path: "driver-verification", icon: <CheckSquare size={18} /> },
      { label: "Generate GDC", path: "generate-gdc", icon: <CheckSquare size={18} /> },
    ],
  },
  {
    title: "Transporters",
    items: [
      { label: "Visitors Transporter", path: "transport-visitor", icon: <Truck size={18} /> },
      { label: "Visitor Transporters List", path: "visitor-transporters-list", icon: <Truck size={18} /> },
      { label: "Final Transporter", path: "selected-transporters-list", icon: <CheckSquare size={18} /> },
      { label: "Transporter Signup", path: "transporter-registration", icon: <FilePlus2 size={18} /> },
      { label: "Pending Verification", path: "transporter-verification", icon: <CheckSquare size={18} /> },
      { label: "Generate GDC", path: "generate-gdc-transporter", icon: <CheckSquare size={18} /> },
    ],
  },
  {
    title: "Payments",
    items: [{ label: "Payments", path: "payments", icon: <DollarSign size={18} /> }],
  },
  {
    title: "Reports",
    items: [
      { label: "Driver Reports", path: "drivers-reports", icon: <Users size={18} /> },
      { label: "Transporter Reports", path: "transporter-reports", icon: <Truck size={18} /> },
      { label: "Payments Reports", path: "payment-reports", icon: <DollarSign size={18} /> },
    ],
  },
  {
    title: "Operations",
    items: [
      { label: "Assign Driver", path: "assign-driver", icon: <Users size={18} /> },
      { label: "Ideal Drivers", path: "ideal-drivers", icon: <DollarSign size={18} /> },
      { label: "Payment Verified", path: "payment-verified", icon: <CheckSquare size={18} /> },
      { label: "Current Posting", path: "current-posting", icon: <Truck size={18} /> },
      { label: "Final Settlement", path: "final-settlement", icon: <CheckSquare size={18} /> },
      { label: "Transporter Ledger", path: "transporter-ledger", icon: <FilePlus2 size={18} /> },
      { label: "Driver Ledger", path: "driver-ledger", icon: <Users size={18} /> },
    ],
  },
];

export default function SidebarLayout({ onLogout }) {
  const location = useLocation();
  const currentPath = location.pathname.replace("/dashboard/", "");
  const pageTitle = pageTitles[currentPath] || "Dashboard";

  const [openSections, setOpenSections] = useState({ Dashboard: true });

  const toggleSection = (title) => {
    setOpenSections((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  const base = "/dashboard";

  return (
    <div className="min-h-screen flex bg-gray-100">
      <SessionManager />

      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r fixed inset-y-0">
        <div className="flex items-center justify-between p-4 border-b">
          <span className="text-2xl font-bold text-green-600">WTL</span>
          <button className="p-2 rounded-md hover:bg-gray-100">
            <Menu />
          </button>
        </div>

        <nav className="p-3 text-sm">
          {sidebarSections.map((section) => (
            <div key={section.title} className="mb-4">
              {/* HEADING – NO BACKGROUND */}
              <button
                onClick={() => toggleSection(section.title)}
                className="w-full flex items-center justify-between px-2 py-1
                text-green-700 font-semibold uppercase tracking-wide
                bg-transparent hover:text-green-900"
              >
                {section.title}
                <ChevronDown
                  size={16}
                  className={`transition-transform ${
                    openSections[section.title] ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* ITEMS */}
              <div
                className={`mt-2 ml-3 space-y-1 overflow-hidden transition-all duration-300 ${
                  openSections[section.title] ? "max-h-[600px]" : "max-h-0"
                }`}
              >
                {section.items.map((item) => {
                  const to = item.path === "" ? base : `${base}/${item.path}`;
                  return (
                    <NavLink
                      key={to}
                      to={to}
                      end={item.path === ""}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2 rounded-md
                        ${
                          isActive
                            ? "bg-green-50 text-green-800 border-l-4 border-green-600"
                            : "text-gray-700 hover:bg-gray-100"
                        }`
                      }
                    >
                      {item.icon}
                      {item.label}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}

          {/* LOGOUT */}
          <button
            onClick={onLogout}
            className="mt-6 w-full flex items-center gap-3 px-4 py-3 rounded-lg
            text-red-600 bg-red-50 border border-red-200 hover:bg-red-100"
          >
            <LogOut size={18} />
            Logout
          </button>
        </nav>
      </aside>

      {/* MAIN */}
      <main className="ml-64 flex-1">
        <header className="p-5 bg-white border-b sticky top-0">
          <h1 className="text-2xl font-bold text-gray-800">{pageTitle}</h1>
        </header>

        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
