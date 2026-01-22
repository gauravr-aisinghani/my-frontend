import React from "react";
import { Bell, Wallet, Users, CalendarCheck, FileText, PlusCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function TransporterDashboard() {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Transporter Dashboard</h1>
        <div className="relative">
          <Bell className="w-6 h-6 text-gray-600" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">3</span>
        </div>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="rounded-2xl">
          <CardContent className="p-4 flex items-center gap-4">
            <Wallet className="text-green-600" />
            <div>
              <p className="text-sm text-gray-500">Wallet Balance</p>
              <p className="text-xl font-bold">₹12,500</p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardContent className="p-4 flex items-center gap-4">
            <Users className="text-blue-600" />
            <div>
              <p className="text-sm text-gray-500">Active Drivers</p>
              <p className="text-xl font-bold">18</p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardContent className="p-4 flex items-center gap-4">
            <CalendarCheck className="text-orange-600" />
            <div>
              <p className="text-sm text-gray-500">Total Working Days</p>
              <p className="text-xl font-bold">320</p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardContent className="p-4 flex items-center gap-4">
            <FileText className="text-purple-600" />
            <div>
              <p className="text-sm text-gray-500">Ledger Balance</p>
              <p className="text-xl font-bold">₹4,200</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="rounded-2xl">
          <CardContent className="p-5">
            <h2 className="font-semibold mb-2">Raise Driver Requirement</h2>
            <p className="text-sm text-gray-500 mb-4">Need more drivers? Raise a request.</p>
            <button className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-xl">
              <PlusCircle size={18} /> Raise Request
            </button>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardContent className="p-5">
            <h2 className="font-semibold mb-2">Payment History</h2>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>₹2,000 - Driver Payment</li>
              <li>₹1,500 - GDC Recharge</li>
              <li>₹3,000 - Monthly Fees</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardContent className="p-5">
            <h2 className="font-semibold mb-2">Driver Attendance</h2>
            <p className="text-sm text-gray-500 mb-2">Mark & view driver attendance</p>
            <ul className="text-sm text-gray-600">
              <li>Total Drivers: 20</li>
              <li>Present Today: 16</li>
              <li>On Leave: 4</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
