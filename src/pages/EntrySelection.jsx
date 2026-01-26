import { useNavigate } from "react-router-dom";
import { Truck, User, CreditCard } from "lucide-react";
import { useState } from "react";
import { loginWithMobile } from "../api/transporterAuthApi";

export default function EntrySelection() {
  const navigate = useNavigate();

  const [showLogin, setShowLogin] = useState(false);
  const [loginRole, setLoginRole] = useState(null); // DRIVER | TRANSPORTER

  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");

  const [step, setStep] = useState(1);
  const [error, setError] = useState("");

  const resetLogin = () => {
    setShowLogin(false);
    setLoginRole(null);
    setMobile("");
    setOtp("");
    setGeneratedOtp("");
    setStep(1);
    setError("");
  };

  // ================= SEND OTP =================
  const sendOtp = async () => {
    if (!/^\d{10}$/.test(mobile)) {
      setError("Enter valid 10 digit mobile number");
      return;
    }

    try {
      const res = await loginWithMobile(mobile, loginRole);

      if (!res.exists) {
        setError("Not a registered user");
        return;
      }

      // 🔥 FRONTEND MOCK OTP (6 digit)
      const mockOtp = Math.floor(100000 + Math.random() * 900000).toString();

      setGeneratedOtp(mockOtp);
      setError("");
      setStep(2);

      console.log("Mock OTP (DEV):", mockOtp); // dev log

    } catch (err) {
      setError("Something went wrong");
    }
  };

  // ================= VERIFY OTP =================
// ================= VERIFY OTP =================
const verifyOtp = async () => {
  if (otp.length !== 6) {
    setError("Enter valid 6 digit OTP");
    return;
  }

  if (otp !== generatedOtp) {
    setError("Invalid OTP");
    return;
  }

  try {
    // 🔥 BACKEND CALL (example endpoint)
    const res = await loginWithMobile(mobile, loginRole);

    /*
      Expected backend response (snake_case):
      {
        exists: true,
        message: "...",
        role: "TRANSPORTER" | "DRIVER",
        user_id: "...",
        transporter_registration_id: "...",
        driver_registration_id: ...,
        gdc_number: "..."
      }
    */

    if (!res.exists) {
      setError("Login failed");
      return;
    }

    // ✅ SAVE EXACT BACKEND RESPONSE (SNAKE_CASE)
    localStorage.setItem(
      "user_context",
      JSON.stringify(res)
    );

    // ✅ ROLE BASED NAVIGATION
    if (res.role === "TRANSPORTER") {
      navigate("/transporter-dashboard");
    } else if (res.role === "DRIVER") {
      navigate("/driver/dashboard");
    }

  } catch (err) {
    setError("Something went wrong");
  }
};



  return (
    <div className="min-h-screen bg-white">

      {/* ================= HEADER ================= */}
      <div className="flex flex-col items-center text-center pt-10 px-4">
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

        <button
          onClick={() => setShowLogin(true)}
          className="mt-6 px-6 py-2 bg-black text-white rounded-lg text-sm"
        >
          Already a member? Login
        </button>
      </div>

      {/* ================= CARDS ================= */}
      <div className="mt-16 px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">

          <div
            onClick={() => navigate("/driver/signup")}
            className="cursor-pointer bg-white rounded-3xl border p-10 text-center hover:shadow-lg transition"
          >
            <div className="mx-auto w-20 h-20 flex items-center justify-center rounded-full bg-green-100 text-green-600">
              <User size={34} />
            </div>
            <h3 className="mt-6 text-2xl font-semibold">Driver</h3>
            <p className="mt-2 text-gray-500">
              Register & activate Driver GDC
            </p>
          </div>

          <div
            onClick={() => navigate("/transporter/signup")}
            className="cursor-pointer bg-white rounded-3xl border p-10 text-center hover:shadow-lg transition"
          >
            <div className="mx-auto w-20 h-20 flex items-center justify-center rounded-full bg-blue-100 text-blue-600">
              <Truck size={34} />
            </div>
            <h3 className="mt-6 text-2xl font-semibold">Transporter</h3>
            <p className="mt-2 text-gray-500">
              Register & activate Transporter GDC
            </p>
          </div>

          <div
            onClick={() => navigate("/payment")}
            className="cursor-pointer bg-white rounded-3xl border p-10 text-center hover:shadow-lg transition"
          >
            <div className="mx-auto w-20 h-20 flex items-center justify-center rounded-full bg-orange-100 text-orange-600">
              <CreditCard size={34} />
            </div>
            <h3 className="mt-6 text-2xl font-semibold">Payments</h3>
            <p className="mt-2 text-gray-500">
              Recharge & manage services
            </p>
          </div>

        </div>
      </div>

      {/* ================= LOGIN MODAL ================= */}
      {showLogin && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 relative">

            <button
              onClick={resetLogin}
              className="absolute right-4 top-3 text-gray-400 text-xl"
            >
              ✕
            </button>

            {!loginRole && (
              <>
                <h3 className="text-lg font-semibold mb-4">Login As</h3>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setLoginRole("DRIVER")}
                    className="bg-black text-white rounded-xl py-4"
                  >
                    Driver
                  </button>
                  <button
                    onClick={() => setLoginRole("TRANSPORTER")}
                    className="bg-black text-white rounded-xl py-4"
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
                  placeholder="Enter Mobile Number"
                  value={mobile}
                  maxLength={10}
                  onChange={(e) => {
                    if (/^\d*$/.test(e.target.value)) {
                      setMobile(e.target.value);
                    }
                  }}
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
                <h3 className="text-lg font-semibold mb-2">Verify OTP</h3>

                {/* 🔥 DEV ONLY - MOCK OTP */}
                <div className="w-full p-3 mb-3 border rounded-lg bg-yellow-100 text-center font-semibold">
                  Mock OTP: {generatedOtp}
                </div>

                <input
                  placeholder="Enter OTP"
                  value={otp}
                  maxLength={6}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full p-3 border rounded-lg"
                />

                {error && (
                  <p className="text-red-500 text-sm mt-2">{error}</p>
                )}

                <button
                  onClick={verifyOtp}
                  className="w-full mt-4 bg-black text-white py-2 rounded-lg"
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
