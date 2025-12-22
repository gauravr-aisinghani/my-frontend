import { useNavigate } from "react-router-dom";
import { Truck, User, CreditCard } from "lucide-react";

export default function EntrySelection() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex flex-col items-center justify-center px-4 py-10">
      
      {/* Heading */}
      <div className="text-center max-w-xl">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 tracking-tight">
          Welcome to <span className="text-green-600">WTL</span>
        </h1>
        <p className="text-gray-500 mt-2 sm:mt-3 text-base sm:text-lg">
          Select how you want to continue
        </p>
      </div>

      {/* Cards */}
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 w-full max-w-6xl">
        
        {/* Driver */}
        <div
          onClick={() => navigate("/driver/signup")}
          className="relative group cursor-pointer bg-white rounded-2xl sm:rounded-3xl shadow-md hover:shadow-2xl transition-all duration-300 p-6 sm:p-10 border border-gray-100 hover:-translate-y-1"
        >
          <div className="absolute inset-x-0 top-0 h-1 rounded-t-2xl sm:rounded-t-3xl bg-green-500" />

          <div className="flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-green-100 mx-auto group-hover:scale-110 transition">
            <User size={36} className="text-green-600" />
          </div>

          <h3 className="text-center text-xl sm:text-2xl font-semibold text-gray-800 mt-6 sm:mt-8">
            Driver
          </h3>
          <p className="text-center text-sm sm:text-base text-gray-500 mt-2 sm:mt-3">
            Register & activate Driver GDC
          </p>
        </div>

        {/* Transporter */}
        <div
          onClick={() => navigate("/transporter/signup")}
          className="relative group cursor-pointer bg-white rounded-2xl sm:rounded-3xl shadow-md hover:shadow-2xl transition-all duration-300 p-6 sm:p-10 border border-gray-100 hover:-translate-y-1"
        >
          <div className="absolute inset-x-0 top-0 h-1 rounded-t-2xl sm:rounded-t-3xl bg-blue-500" />

          <div className="flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-blue-100 mx-auto group-hover:scale-110 transition">
            <Truck size={36} className="text-blue-600" />
          </div>

          <h3 className="text-center text-xl sm:text-2xl font-semibold text-gray-800 mt-6 sm:mt-8">
            Transporter
          </h3>
          <p className="text-center text-sm sm:text-base text-gray-500 mt-2 sm:mt-3">
            Register & activate Transporter GDC
          </p>
        </div>

        {/* Payments */}
        <div
          onClick={() => navigate("/payment")}
          className="relative group cursor-pointer bg-white rounded-2xl sm:rounded-3xl shadow-md hover:shadow-2xl transition-all duration-300 p-6 sm:p-10 border border-gray-100 hover:-translate-y-1"
        >
          <div className="absolute inset-x-0 top-0 h-1 rounded-t-2xl sm:rounded-t-3xl bg-orange-500" />

          <div className="flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-orange-100 mx-auto group-hover:scale-110 transition">
            <CreditCard size={36} className="text-orange-600" />
          </div>

          <h3 className="text-center text-xl sm:text-2xl font-semibold text-gray-800 mt-6 sm:mt-8">
            Payments
          </h3>
          <p className="text-center text-sm sm:text-base text-gray-500 mt-2 sm:mt-3">
            Pay & activate services
          </p>
        </div>

      </div>
    </div>
  );
}
