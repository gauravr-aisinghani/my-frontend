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
  const [serverOtp, setServerOtp] = useState("");

  const [step, setStep] = useState(1);
  const [error, setError] = useState("");

  const resetLogin = () => {
    setShowLogin(false);
    setLoginRole(null);
    setMobile("");
    setOtp("");
    setServerOtp("");
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
        setError("Mobile number not registered");
        return;
      }

      setServerOtp(res.otp); // 🔥 backend generated OTP
      setError("");
      setStep(2);
    } catch (err) {
      setError("Server error");
    }
  };

  // ================= VERIFY OTP =================
  const verifyOtp = () => {
    if (otp !== serverOtp) {
      setError("Invalid OTP");
      return;
    }

    if (loginRole === "TRANSPORTER") {
      navigate("/transporter-dashboard");
    } else {
      navigate("/driver/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-white">

      {/* HEADER */}
      <div className="flex flex-col items-center text-center pt-10 px-4">
        <h1 className="text-4xl font-bold text-gray-800">
          Welcome to <span className="text-green-600">WTL</span>
        </h1>

        <p className="text-gray-500 mt-1">
          India’s trusted Driver–Transporter Network
        </p>

        <button
          onClick={() => setShowLogin(true)}
          className="mt-6 px-6 py-2 bg-black text-white rounded-lg text-sm"
        >
          Already a member? Login
        </button>
      </div>

      {/* CARDS */}
      <div className="mt-16 px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">

          <div
            onClick={() => navigate("/driver/signup")}
            className="cursor-pointer bg-white rounded-3xl border p-10 text-center"
          >
            <User size={34} className="mx-auto text-green-600" />
            <h3 className="mt-6 text-2xl font-semibold">Driver</h3>
          </div>

          <div
            onClick={() => navigate("/transporter/signup")}
            className="cursor-pointer bg-white rounded-3xl border p-10 text-center"
          >
            <Truck size={34} className="mx-auto text-blue-600" />
            <h3 className="mt-6 text-2xl font-semibold">Transporter</h3>
          </div>

          <div
            onClick={() => navigate("/payment")}
            className="cursor-pointer bg-white rounded-3xl border p-10 text-center"
          >
            <CreditCard size={34} className="mx-auto text-orange-600" />
            <h3 className="mt-6 text-2xl font-semibold">Payments</h3>
          </div>

        </div>
      </div>

      {/* LOGIN MODAL */}
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
                  onChange={(e) =>
                    /^\d*$/.test(e.target.value) &&
                    setMobile(e.target.value)
                  }
                  className="w-full p-3 border rounded-lg"
                />

                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

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

                {/* DEV ONLY */}
                <p className="text-xs text-gray-500 mb-2">
                  Mock OTP: <b>{serverOtp}</b>
                </p>

                <input
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full p-3 border rounded-lg"
                />

                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

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
