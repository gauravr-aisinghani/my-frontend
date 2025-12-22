// EntrySelection.jsx
import { useNavigate } from "react-router-dom";
import { Truck, User, CreditCard } from "lucide-react";

export default function EntrySelection() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6">
      
      {/* Title */}
      <h1 className="text-3xl font-semibold text-gray-800">
        Welcome to WTL
      </h1>
      <p className="text-gray-500 mt-2 text-base">
        Select how you want to continue
      </p>

      {/* Cards */}
      <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
        
        {/* Driver */}
        <div
          onClick={() => navigate("/driver/signup")}
          className="cursor-pointer bg-white rounded-2xl shadow-lg hover:shadow-2xl transition p-8 w-80 border-t-4 border-green-500"
        >
          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mx-auto">
            <User className="text-green-600" size={36} />
          </div>

          <h3 className="text-center text-xl font-semibold text-gray-800 mt-6">
            Driver
          </h3>
          <p className="text-center text-sm text-gray-500 mt-2">
            Register & activate Driver GDC
          </p>
        </div>

        {/* Transporter */}
        <div
          onClick={() => navigate("/transporter/signup")}
          className="cursor-pointer bg-white rounded-2xl shadow-lg hover:shadow-2xl transition p-8 w-80 border-t-4 border-blue-500"
        >
          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-blue-100 mx-auto">
            <Truck className="text-blue-600" size={36} />
          </div>

          <h3 className="text-center text-xl font-semibold text-gray-800 mt-6">
            Transporter
          </h3>
          <p className="text-center text-sm text-gray-500 mt-2">
            Register & activate Transporter GDC
          </p>
        </div>

        {/* Payments */}
        <div
          onClick={() => navigate("/payments")}
          className="cursor-pointer bg-white rounded-2xl shadow-lg hover:shadow-2xl transition p-8 w-80 border-t-4 border-orange-500"
        >
          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-orange-100 mx-auto">
            <CreditCard className="text-orange-600" size={36} />
          </div>

          <h3 className="text-center text-xl font-semibold text-gray-800 mt-6">
            Payments
          </h3>
          <p className="text-center text-sm text-gray-500 mt-2">
            Pay & activate services
          </p>
        </div>

      </div>
    </div>
  );
}
