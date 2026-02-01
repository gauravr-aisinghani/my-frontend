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
  ChevronDown,
} from "lucide-react";

import SessionManager from "./SessionManager";

const pageTitles = {
  "": "Dashboard",
  "daily-visitors": "Visitors Driver",
  "selected-drivers": "Final Drivers",
  "driver-registration": "Driver Signup",
  "daily-visitor-table": "Visitor Drivers List",
  "driver-verification": "Pending Drivers",
  "generate-gdc": "Generate GDC",
  "transport-visitor": "Visitor Transporter",
  "transporter-registration": "Transporter Signup",
  "payments": "Payments",
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
    items: [{ label: "Dashboard", path: "", icon: <Home size={18} /> }],
  },
  {
    title: "Drivers",
    items: [
      { label: "Visitors Driver", path: "daily-visitors", icon: <Users size={18} /> },
      { label: "Final Drivers", path: "selected-drivers", icon: <CheckSquare size={18} /> },
      { label: "Driver Signup", path: "driver-registration", icon: <FilePlus2 size={18} /> },
      { label: "Pending Drivers Verification", path: "driver-verification", icon: <CheckSquare size={18} /> },
    ],
  },
  {
    title: "Transporters",
    items: [
      { label: "Transporter Signup", path: "transporter-registration", icon: <FilePlus2 size={18} /> },
      { label: "Pending Verification", path: "transporter-verification", icon: <CheckSquare size={18} /> },
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
      { label: "Paid By Transporter", path: "paid-by-transporter", icon: <DollarSign size={18} /> },
    ],
  },
];

export default function SidebarLayout({ onLogout }) {
  const location = useLocation();
  const currentPath = location.pathname.replace("/dashboard/", "");
  const pageTitle = pageTitles[currentPath] || "Dashboard";

  const [openSections, setOpenSections] = useState({});

  const toggleSection = (title) => {
    setOpenSections((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const base = "/dashboard";

  return (
    <div className="min-h-screen flex bg-gray-100">
      <SessionManager />

      {/* Sidebar */}
      <aside className="w-64 bg-white border-r shadow-sm fixed inset-y-0">
        <div className="flex items-center justify-between p-4 border-b">
          <span className="text-2xl font-bold text-green-600">WTL</span>
          <button className="p-2 rounded-md hover:bg-gray-100">
            <Menu />
          </button>
        </div>

        <nav className="p-3 text-sm">
          {sidebarSections.map((section) => (
            <div key={section.title} className="mb-4">
              {/* Heading */}
              <button
                onClick={() => toggleSection(section.title)}
                className="w-full flex items-center justify-between text-gray-500 font-semibold tracking-wide px-2 py-1 hover:text-gray-800"
              >
                {section.title}
                <ChevronDown
                  size={16}
                  className={`transition-transform ${
                    openSections[section.title] ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Items */}
              <div
                className={`mt-2 space-y-1 overflow-hidden transition-all ${
                  openSections[section.title] ? "max-h-96" : "max-h-0"
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
                        `flex items-center gap-3 px-4 py-2 rounded-md transition
                        ${
                          isActive
                            ? "bg-green-50 text-green-700 border-l-4 border-green-600"
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

          {/* Logout */}
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

      {/* Main */}
      <main className="ml-64 flex-1">
        <header className="p-5 bg-white border-b shadow-sm sticky top-0 z-10">
          <h1 className="text-2xl font-bold text-gray-800">{pageTitle}</h1>
        </header>

        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
