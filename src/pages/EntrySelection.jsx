import { useNavigate } from "react-router-dom";
import { Truck, User, CreditCard } from "lucide-react";
import { useState } from "react";

export default function EntrySelection() {
  const navigate = useNavigate();

  const [showLogin, setShowLogin] = useState(false);
  const [gdc, setGdc] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");

  const handleSendOtp = () => {
    if (!gdc.trim()) {
      setError("Enter GDC Number");
      return;
    }
    setError("");
    setStep(2); // OTP step
  };

  const handleVerifyOtp = () => {
    if (otp !== "123456") {
      setError("Invalid OTP");
      return;
    }

    // 🔑 ROLE DETECTION (MOCK)
    if (gdc.startsWith("GDC-T")) {
      navigate("/transporter/dashboard");
    } else if (gdc.startsWith("GDC-D")) {
      navigate("/driver/dashboard");
    } else {
      setError("Invalid GDC Number");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex flex-col items-center justify-center px-4 py-10">

      {/* Heading */}
      <div className="text-center max-w-xl">
        <h1 className="text-4xl font-bold text-gray-800">
          Welcome to <span className="text-green-600">WTL</span>
        </h1>
        <p className="text-gray-500 mt-3">
          India’s trusted Driver–Transporter network
        </p>
      </div>

      {/* Cards */}
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
        <Card
          icon={<User size={36} />}
          title="Driver"
          desc="Register & activate Driver GDC"
          color="green"
          onClick={() => navigate("/driver/signup")}
        />

        <Card
          icon={<Truck size={36} />}
          title="Transporter"
          desc="Register & activate Transporter GDC"
          color="blue"
          onClick={() => navigate("/transporter/signup")}
        />

        <Card
          icon={<CreditCard size={36} />}
          title="Payments"
          desc="Pay & activate services"
          color="orange"
          onClick={() => navigate("/payment")}
        />
      </div>

      {/* Already Member */}
      <div className="mt-12 text-center">
        <p className="text-gray-600">Already a member?</p>
        <button
          onClick={() => setShowLogin(true)}
          className="mt-2 px-6 py-2 bg-black text-white rounded-lg"
        >
          Login with GDC
        </button>
      </div>

      {/* LOGIN MODAL */}
      {showLogin && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white w-full max-w-md rounded-2xl p-6">
            <h3 className="text-xl font-semibold mb-4">Login</h3>

            {step === 1 && (
              <>
                <input
                  placeholder="Enter GDC Number"
                  value={gdc}
                  onChange={(e) => setGdc(e.target.value)}
                  className="w-full p-3 border rounded-lg"
                />
                {error && <p className="text-red-500 mt-2">{error}</p>}
                <button
                  onClick={handleSendOtp}
                  className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg"
                >
                  Send OTP
                </button>
              </>
            )}

            {step === 2 && (
              <>
                <input
                  placeholder="Enter OTP (123456)"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full p-3 border rounded-lg"
                />
                {error && <p className="text-red-500 mt-2">{error}</p>}
                <button
                  onClick={handleVerifyOtp}
                  className="w-full mt-4 bg-green-600 text-white py-2 rounded-lg"
                >
                  Verify & Login
                </button>
              </>
            )}

            <button
              onClick={() => setShowLogin(false)}
              className="mt-4 text-sm text-gray-500"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* Reusable Card */
function Card({ icon, title, desc, color, onClick }) {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer bg-white rounded-3xl shadow-md hover:shadow-2xl transition p-8 text-center"
    >
      <div className={`mx-auto w-20 h-20 flex items-center justify-center rounded-full bg-${color}-100 text-${color}-600`}>
        {icon}
      </div>
      <h3 className="mt-6 text-2xl font-semibold">{title}</h3>
      <p className="mt-2 text-gray-500">{desc}</p>
    </div>
  );
}
