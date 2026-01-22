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
  const [otpSent, setOtpSent] = useState(false);

  const resetLogin = () => {
    setShowLogin(false);
    setLoginRole(null);
    setGdc("");
    setOtp("");
    setStep(1);
    setError("");
    setOtpSent(false);
  };

  const sendOtp = () => {
    if (!gdc.trim()) {
      setError("Enter GDC Number");
      return;
    }
    setError("");
    setOtpSent(true); // mock OTP sent
    setStep(2);
  };

  const verifyOtp = () => {
    if (otp !== "123456") {
      setError("Invalid OTP (try 123456)");
      return;
    }

    if (loginRole === "TRANSPORTER") {
      navigate("/transporter/dashboard");
    } else {
      navigate("/driver/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">

      {/* HEADER */}
      <header className="flex items-center justify-between px-6 py-5">
        <div></div>

        <button
          onClick={() => setShowLogin(true)}
          className="px-5 py-2 bg-black text-white rounded-lg text-sm"
        >
          Already a member? Login
        </button>
      </header>

      {/* HERO */}
      <section className="text-center px-6">
        <h1 className="text-4xl font-bold text-gray-800">
          Welcome to <span className="text-green-600">WTL</span>
        </h1>
        <p className="text-gray-500 mt-1">
          India’s trusted Driver–Transporter Network
        </p>

        <div className="flex gap-8 mt-4 text-sm flex-wrap justify-center">
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
      </section>

      {/* CARDS */}
      <section className="flex justify-center mt-14 px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">

          {/* DRIVER */}
          <div
            onClick={() => navigate("/driver/signup")}
            className="cursor-pointer bg-white rounded-3xl border p-10 text-center hover:shadow-xl transition"
          >
            <div className="mx-auto w-20 h-20 flex items-center justify-center rounded-full bg-gray-100 text-black">
              <User size={34} />
            </div>
            <h3 className="mt-6 text-2xl font-semibold text-black">Driver</h3>
            <p className="mt-2 text-gray-500">
              Register & activate Driver GDC
            </p>
          </div>

          {/* TRANSPORTER */}
          <div
            onClick={() => navigate("/transporter/signup")}
            className="cursor-pointer bg-white rounded-3xl border p-10 text-center hover:shadow-xl transition"
          >
            <div className="mx-auto w-20 h-20 flex items-center justify-center rounded-full bg-gray-100 text-black">
              <Truck size={34} />
            </div>
            <h3 className="mt-6 text-2xl font-semibold text-black">
              Transporter
            </h3>
            <p className="mt-2 text-gray-500">
              Register & activate Transporter GDC
            </p>
          </div>

          {/* PAYMENTS */}
          <div
            onClick={() => navigate("/payment")}
            className="cursor-pointer bg-white rounded-3xl border p-10 text-center hover:shadow-xl transition"
          >
            <div className="mx-auto w-20 h-20 flex items-center justify-center rounded-full bg-gray-100 text-black">
              <CreditCard size={34} />
            </div>
            <h3 className="mt-6 text-2xl font-semibold text-black">
              Payments
            </h3>
            <p className="mt-2 text-gray-500">
              Recharge & manage services
            </p>
          </div>

        </div>
      </section>

      {/* LOGIN MODAL */}
      {showLogin && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
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
                    className="border rounded-xl py-4 hover:bg-gray-100"
                  >
                    Driver
                  </button>
                  <button
                    onClick={() => setLoginRole("TRANSPORTER")}
                    className="border rounded-xl py-4 hover:bg-gray-100"
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
                {error && (
                  <p className="text-red-500 text-sm mt-2">{error}</p>
                )}
                <button
                  onClick={sendOtp}
                  className="w-full mt-4 bg-black text-white py-2 rounded-lg"
                >
                  Send OTP
                </button>
              </>
            )}

            {step === 2 && (
              <>
                <h3 className="text-lg font-semibold mb-1">Verify OTP</h3>
                {otpSent && (
                  <p className="text-xs text-gray-500 mb-2">
                    Mock OTP sent: <b>123456</b>
                  </p>
                )}
                <input
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full p-3 border rounded-lg"
                />
                {error && (
                  <p className="text-red-500 text-sm mt-2">{error}</p>
                )}
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
