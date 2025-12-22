import { useNavigate } from "react-router-dom";
import { Truck, User, CreditCard } from "lucide-react";

export default function EntrySelection() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex flex-col items-center justify-center px-6">
      
      {/* Heading */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 tracking-tight">
          Welcome to <span className="text-green-600">WTL</span>
        </h1>
        <p className="text-gray-500 mt-3 text-lg">
          Select how you want to continue
        </p>
      </div>

      {/* Cards */}
      <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-14">
        
        {/* Driver */}
        <div
          onClick={() => navigate("/driver/signup")}
          className="group cursor-pointer bg-white/90 backdrop-blur rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 p-10 w-96 border border-gray-100 hover:-translate-y-2"
        >
          <div className="absolute inset-x-0 top-0 h-1 rounded-t-3xl bg-green-500" />

          <div className="flex items-center justify-center w-24 h-24 rounded-full bg-green-100 mx-auto group-hover:scale-110 transition">
            <User size={42} className="text-green-600" />
          </div>

          <h3 className="text-center text-2xl font-semibold text-gray-800 mt-8">
            Driver
          </h3>
          <p className="text-center text-base text-gray-500 mt-3">
            Register & activate Driver GDC
          </p>
        </div>

        {/* Transporter */}
        <div
          onClick={() => navigate("/transporter/signup")}
          className="group cursor-pointer bg-white/90 backdrop-blur rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 p-10 w-96 border border-gray-100 hover:-translate-y-2"
        >
          <div className="absolute inset-x-0 top-0 h-1 rounded-t-3xl bg-blue-500" />

          <div className="flex items-center justify-center w-24 h-24 rounded-full bg-blue-100 mx-auto group-hover:scale-110 transition">
            <Truck size={42} className="text-blue-600" />
          </div>

          <h3 className="text-center text-2xl font-semibold text-gray-800 mt-8">
            Transporter
          </h3>
          <p className="text-center text-base text-gray-500 mt-3">
            Register & activate Transporter GDC
          </p>
        </div>

        {/* Payments */}
        <div
          onClick={() => navigate("/login")}
          className="group cursor-pointer bg-white/90 backdrop-blur rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 p-10 w-96 border border-gray-100 hover:-translate-y-2"
        >
          <div className="absolute inset-x-0 top-0 h-1 rounded-t-3xl bg-orange-500" />

          <div className="flex items-center justify-center w-24 h-24 rounded-full bg-orange-100 mx-auto group-hover:scale-110 transition">
            <CreditCard size={42} className="text-orange-600" />
          </div>

          <h3 className="text-center text-2xl font-semibold text-gray-800 mt-8">
            Payments
          </h3>
          <p className="text-center text-base text-gray-500 mt-3">
            Admin login required
          </p>
        </div>

      </div>
    </div>
  );
}
