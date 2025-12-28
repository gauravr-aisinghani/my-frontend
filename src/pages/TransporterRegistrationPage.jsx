import React from "react";
import {
  TransporterProvider,
  useTransporter,
} from "../context/TransporterContext";

import TransporterStep1 from "../components/TransporterStep1";
import TransporterStep2Vehicle from "../components/TransporterStep2Vehicle";
import TransporterStep3 from "../components/TransporterStep3";
import TransporterSummary from "../components/TransporterSummary";

import { AnimatePresence, motion } from "framer-motion";

const Inner = () => {
  const { data, update } = useTransporter();
  const step = data.step || 1;

  const goTo = (n) => update({ step: n });

  const variants = {
    initial: { opacity: 0, x: 80 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -80 },
  };

  return (
    <div className="w-full min-h-full flex justify-center bg-gray-100">
      <div className="w-full max-w-[1300px] bg-white p-4 md:p-6 rounded-xl shadow-lg flex flex-col">
        
        {/* ===== HEADER ===== */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-4">
          <h2 className="text-2xl md:text-3xl font-bold text-green-600">
            Transporter Registration
          </h2>
          <div className="text-sm md:text-base text-gray-600 mt-2 md:mt-0">
            Step {step <= 3 ? step : 3} / 3
          </div>
        </div>

        {/* ===== PROGRESS BAR ===== */}
        <div className="w-full bg-gray-200 h-2 rounded mb-6">
          <div
            className="h-2 rounded bg-green-600 transition-all duration-300"
            style={{ width: `${(Math.min(step, 3) / 3) * 100}%` }}
          />
        </div>

        {/* ===== STEPS ===== */}
        <div className="relative flex-1 overflow-hidden">
          <AnimatePresence mode="wait">

            {step === 1 && (
              <motion.div {...motionProps(variants)}>
                <TransporterStep1 onNext={() => goTo(2)} />
              </motion.div>
            )}

            {step === 2 && (
              <motion.div {...motionProps(variants)}>
                <TransporterStep2Vehicle
                  onNext={() => goTo(3)}
                  onBack={() => goTo(1)}
                />
              </motion.div>
            )}

            {step === 3 && (
              <motion.div {...motionProps(variants)}>
                <TransporterStep3
                  onNext={() => goTo(4)}   // ✅ SUCCESS
                  onBack={() => goTo(2)}
                />
              </motion.div>
            )}

            {/* ===== SUCCESS SCREEN (Driver Style) ===== */}
            {step === 4 && (
              <motion.div {...motionProps(variants)}>
                <div className="p-6 md:p-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-xl shadow-2xl flex flex-col items-center text-center text-white">

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 mb-4 animate-bounce"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>

                  <h2 className="text-2xl md:text-3xl font-extrabold mb-2">
                    Registration Successful 🎉
                  </h2>

                  <p className="text-lg md:text-xl max-w-xl mx-auto">
                    Your transporter registration has been successfully submitted.
                    <br />
                    Your <strong>Transporter ID</strong> will be shared after verification.
                    Once verified, you can complete payment and start using our services.
                  </p>

                  <button
                    onClick={() => goTo(1)}
                    className="mt-6 px-6 py-3 bg-white text-green-600 font-bold rounded-full shadow-lg hover:shadow-xl transition transform hover:-translate-y-1"
                  >
                    Start New Registration
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* ===== SUMMARY (unchanged) ===== */}
        <div className="mt-6">
          <TransporterSummary />
        </div>
      </div>
    </div>
  );
};

/* ===== MOTION HELPER ===== */
const motionProps = (variants) => ({
  variants,
  initial: "initial",
  animate: "animate",
  exit: "exit",
  transition: { duration: 0.4 },
});

export default function TransporterRegistrationPage() {
  return (
    <TransporterProvider>
      <Inner />
    </TransporterProvider>
  );
}
