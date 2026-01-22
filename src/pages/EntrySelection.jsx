import { useNavigate } from "react-router-dom";
import { Truck, User, CreditCard } from "lucide-react";
import { useState } from "react";

export default function EntrySelection() {
  const navigate = useNavigate();

  const [showLogin, setShowLogin] = useState(false);
  const [loginRole, setLoginRole] = useState(null); // DRIVER | TRANSPORTER
  const [gdc, setGdc] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");

  const resetLogin = () => {
    setShowLogin(false);
    setLoginRole(null);
    setGdc("");
    setOtp("");
    setStep(1);
    setError("");
  };

  const sendOtp = () => {
    if (!gdc.trim()) {
      setError("Enter GDC Number");
      return;
    }
    setError("");
    setStep(2);
  };

  const verifyOtp = () => {
    if (otp !== "123456") {
      setError("Invalid OTP");
      return;
    }

    if (loginRole === "TRANSPORTER") {
      navigate("/transporter/dashboard");
    } else {
      navigate("/driver/dashboard");
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 via-white to-gray-100 min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-xl p-8">

        {/* TOP SECTION */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">

          {/* LEFT */}
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Welcome to <span className="text-green-600">WTL</span>
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              India’s trusted Driver–Transporter Network
            </p>

            {/* STATS INLINE */}
            <div className="flex gap-6 mt-3 text-sm">
              <div>
                <p className="font-semibold">100,000+</p>
                <p className="text-gray-500 text-xs">Active Drivers</p>
              </div>
              <div>
                <p className="font-semibold">10,000+</p>
                <p className="text-gray-500 text-xs">Transporters</p>
              </div>
              <div>
                <p className="font-semibold">₹50Cr+</p>
                <p className="text-gray-500 text-xs">Monthly Transactions</p>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <button
            onClick={() => setShowLogin(true)}
            className="px-6 py-2 bg-black text-white rounded-lg text-sm hover:bg-gray-800"
          >
            Already a member? Login
          </button>
        </div>

        {/* CARDS */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6">

          <div
            onClick={() => navigate("/driver/signup")}
            className="cursor-pointer border rounded-2xl p-6 hover:shadow-lg transition text-center"
          >
            <div className="mx-auto w-14 h-14 flex items-center justify-center rounded-full bg-green-100 text-green-600">
              <User size={28} />
            </div>
            <h3 className="mt-4 font-semibold text-lg">Driver</h3>
            <p className="text-sm text-gray-500">
              Register & activate Driver GDC
            </p>
          </div>

          <div
            onClick={() => navigate("/transporter/signup")}
            className="cursor-pointer border rounded-2xl p-6 hover:shadow-lg transition text-center"
          >
            <div className="mx-auto w-14 h-14 flex items-center justify-center rounded-full bg-blue-100 text-blue-600">
              <Truck size={28} />
            </div>
            <h3 className="mt-4 font-semibold text-lg">Transporter</h3>
            <p className="text-sm text-gray-500">
              Register & activate Transporter GDC
            </p>
          </div>

          <div
            onClick={() => navigate("/payment")}
            className="cursor-pointer border rounded-2xl p-6 hover:shadow-lg transition text-center"
          >
            <div className="mx-auto w-14 h-14 flex items-center justify-center rounded-full bg-orange-100 text-orange-600">
              <CreditCard size={28} />
            </div>
            <h3 className="mt-4 font-semibold text-lg">Payments</h3>
            <p className="text-sm text-gray-500">
              Recharge & manage services
            </p>
          </div>

        </div>
      </div>

      {/* LOGIN MODAL */}
      {showLogin && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 relative">
            <button
              onClick={resetLogin}
              className="absolute right-4 top-3 text-gray-400"
            >
              ✕
            </button>

            {!loginRole && (
              <>
                <h3 className="text-lg font-semibold mb-4">Login As</h3>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setLoginRole("DRIVER")}
                    className="border rounded-xl py-5 hover:bg-gray-50"
                  >
                    Driver
                  </button>
                  <button
                    onClick={() => setLoginRole("TRANSPORTER")}
                    className="border rounded-xl py-5 hover:bg-gray-50"
                  >
                    Transporter
                  </button>
                </div>
              </>
            )}

            {loginRole && step === 1 && (
              <>
                <h3 className="text-lg font-semibold mb-3">
                  {loginRole} Login
                </h3>
                <input
                  placeholder="Enter GDC Number"
                  value={gdc}
                  onChange={(e) => setGdc(e.target.value)}
                  className="w-full p-3 border rounded-lg"
                />
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                <button
                  onClick={sendOtp}
                  className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg"
                >
                  Send OTP
                </button>
              </>
            )}

            {step === 2 && (
              <>
                <h3 className="text-lg font-semibold mb-3">Verify OTP</h3>
                <input
                  placeholder="Enter OTP (123456)"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full p-3 border rounded-lg"
                />
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                <button
                  onClick={verifyOtp}
                  className="w-full mt-4 bg-green-600 text-white py-2 rounded-lg"
                >
                  Verify & Login
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
