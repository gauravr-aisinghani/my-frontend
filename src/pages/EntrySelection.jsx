import { useNavigate } from "react-router-dom";
import { Truck, User, CreditCard, Users } from "lucide-react";
import { useState } from "react";

export default function EntrySelection() {
  const navigate = useNavigate();

  const [loginRole, setLoginRole] = useState(null); // DRIVER | TRANSPORTER
  const [showLogin, setShowLogin] = useState(false);
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

  const handleSendOtp = () => {
    if (!gdc.trim()) {
      setError("Please enter GDC Number");
      return;
    }
    setError("");
    setStep(2);
  };

  const handleVerifyOtp = () => {
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex flex-col items-center px-6 py-12">

      {/* HEADER */}
      <div className="text-center max-w-2xl">
        <h1 className="text-4xl font-bold text-gray-800">
          Welcome to <span className="text-green-600">WTL</span>
        </h1>
        <p className="text-gray-500 mt-3">
          India’s trusted Driver–Transporter Network
        </p>
      </div>

      {/* STATS */}
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-4xl">
        <StatCard icon={<Users />} label="Registered Drivers" value="100,000+" />
        <StatCard icon={<Truck />} label="Active Transporters" value="10,000+" />
        <StatCard icon={<CreditCard />} label="Monthly Transactions" value="₹50Cr+" />
      </div>

      {/* ACTION CARDS */}
      <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
        <MainCard
          icon={<User size={34} />}
          title="Driver Registration"
          desc="Create & activate Driver GDC"
          color="green"
          onClick={() => navigate("/driver/signup")}
        />
        <MainCard
          icon={<Truck size={34} />}
          title="Transporter Registration"
          desc="Create & activate Transporter GDC"
          color="blue"
          onClick={() => navigate("/transporter/signup")}
        />
        <MainCard
          icon={<CreditCard size={34} />}
          title="Payments"
          desc="Recharge & manage services"
          color="orange"
          onClick={() => navigate("/payment")}
        />
      </div>

      {/* ALREADY MEMBER */}
      <div className="mt-16 bg-white rounded-2xl shadow-lg px-10 py-6 text-center">
        <p className="text-gray-600 text-lg">Already a member?</p>
        <button
          onClick={() => setShowLogin(true)}
          className="mt-3 px-8 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition"
        >
          Login with GDC
        </button>
      </div>

      {/* LOGIN FLOW */}
      {showLogin && (
        <Modal onClose={resetLogin}>
          {!loginRole && (
            <>
              <h3 className="text-xl font-semibold mb-6">Select Login Type</h3>
              <div className="grid grid-cols-2 gap-4">
                <RoleButton
                  icon={<Truck />}
                  label="Transporter"
                  onClick={() => setLoginRole("TRANSPORTER")}
                />
                <RoleButton
                  icon={<User />}
                  label="Driver"
                  onClick={() => setLoginRole("DRIVER")}
                />
              </div>
            </>
          )}

          {loginRole && step === 1 && (
            <>
              <h3 className="text-xl font-semibold mb-4">
                {loginRole} Login
              </h3>
              <input
                placeholder={`Enter ${loginRole} GDC`}
                value={gdc}
                onChange={(e) => setGdc(e.target.value)}
                className="w-full p-3 border rounded-xl"
              />
              {error && <p className="text-red-500 mt-2">{error}</p>}
              <button
                onClick={handleSendOtp}
                className="w-full mt-4 bg-blue-600 text-white py-3 rounded-xl"
              >
                Send OTP
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <h3 className="text-xl font-semibold mb-4">Verify OTP</h3>
              <input
                placeholder="Enter OTP (123456)"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full p-3 border rounded-xl"
              />
              {error && <p className="text-red-500 mt-2">{error}</p>}
              <button
                onClick={handleVerifyOtp}
                className="w-full mt-4 bg-green-600 text-white py-3 rounded-xl"
              >
                Verify & Login
              </button>
            </>
          )}
        </Modal>
      )}
    </div>
  );
}

/* ---------- COMPONENTS ---------- */

function MainCard({ icon, title, desc, color, onClick }) {
  const colorMap = {
    green: "bg-green-100 text-green-600",
    blue: "bg-blue-100 text-blue-600",
    orange: "bg-orange-100 text-orange-600",
  };

  return (
    <div
      onClick={onClick}
      className="cursor-pointer bg-white rounded-3xl shadow-md hover:shadow-2xl transition p-8 text-center"
    >
      <div className={`mx-auto w-20 h-20 flex items-center justify-center rounded-full ${colorMap[color]}`}>
        {icon}
      </div>
      <h3 className="mt-6 text-2xl font-semibold">{title}</h3>
      <p className="mt-2 text-gray-500">{desc}</p>
    </div>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <div className="bg-white rounded-2xl shadow p-6 flex items-center gap-4">
      <div className="p-3 bg-gray-100 rounded-full">{icon}</div>
      <div>
        <p className="text-xl font-bold">{value}</p>
        <p className="text-gray-500 text-sm">{label}</p>
      </div>
    </div>
  );
}

function RoleButton({ icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="border rounded-xl py-6 flex flex-col items-center hover:bg-gray-50 transition"
    >
      <div className="mb-2">{icon}</div>
      <span className="font-medium">{label}</span>
    </button>
  );
}

function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-2xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400"
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
}
