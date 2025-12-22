// EntrySelection.jsx
import { useNavigate } from "react-router-dom";
import { Truck, User, CreditCard } from "lucide-react";

export default function EntrySelection() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      
      {/* Title */}
      <h1 className="text-2xl font-semibold text-gray-800">
        Welcome to WTL
      </h1>
      <p className="text-gray-500 mt-1">
        Select how you want to continue
      </p>

      {/* Cards */}
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        
        {/* Driver */}
        <div
          onClick={() => navigate("/driver/signup")}
          className="cursor-pointer bg-white rounded-xl shadow-md hover:shadow-xl transition p-6 w-72 border-t-4 border-green-500"
        >
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-green-100 mx-auto">
            <User className="text-green-600" size={28} />
          </div>

          <h3 className="text-center text-lg font-semibold text-gray-800 mt-4">
            Driver
          </h3>
          <p className="text-center text-sm text-gray-500 mt-1">
            Register & activate Driver GDC
          </p>
        </div>

        {/* Transporter */}
        <div
          onClick={() => navigate("/transporter/signup")}
          className="cursor-pointer bg-white rounded-xl shadow-md hover:shadow-xl transition p-6 w-72 border-t-4 border-blue-500"
        >
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-blue-100 mx-auto">
            <Truck className="text-blue-600" size={28} />
          </div>

          <h3 className="text-center text-lg font-semibold text-gray-800 mt-4">
            Transporter
          </h3>
          <p className="text-center text-sm text-gray-500 mt-1">
            Register & activate Transporter GDC
          </p>
        </div>

        {/* Payments */}
        <div
          onClick={() => navigate("/payments")}
          className="cursor-pointer bg-white rounded-xl shadow-md hover:shadow-xl transition p-6 w-72 border-t-4 border-orange-500"
        >
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-orange-100 mx-auto">
            <CreditCard className="text-orange-600" size={28} />
          </div>

          <h3 className="text-center text-lg font-semibold text-gray-800 mt-4">
            Payments
          </h3>
          <p className="text-center text-sm text-gray-500 mt-1">
            Pay & activate services
          </p>
        </div>

      </div>
    </div>
  );
}
