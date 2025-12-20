// src/pages/TransporterRegistrationPage.jsx
import React from "react";
import { TransporterProvider, useTransporter } from "../context/TransporterContext";
import TransporterStep1 from "../components/TransporterStep1";
import TransporterStep2 from "../components/TransporterStep2";
import TransporterStep3 from "../components/TransporterStep3";
import TransporterStep4 from "../components/TransporterStep4";
import TransporterSummary from "../components/TransporterSummary";
import { AnimatePresence, motion } from "framer-motion";

const Inner = () => {
  const { data, update } = useTransporter();
  const step = data.step || 1;

  const goTo = (n) => update({ step: n });

  // Animation variants
  const variants = {
    initial: { opacity: 0, x: 80 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -80 },
  };

  return (
    <div className="w-full min-h-full flex justify-center bg-gray-100">
      {/* White Paper Card */}
      <div className="w-full max-w-[1300px] bg-white p-4 md:p-6 rounded-xl shadow-lg flex flex-col">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-4">
          <h2 className="text-2xl md:text-3xl font-bold text-green-600">
            Transporter Registration
          </h2>
          <div className="text-sm md:text-base text-gray-600 mt-2 md:mt-0">
            Step {step} / 4
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 h-2 rounded mb-6">
          <div
            className="h-2 rounded bg-green-600 transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        {/* Step Forms */}
        <div className="relative flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                variants={variants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.4 }}
              >
                <TransporterStep1 onNext={() => goTo(2)} />
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                variants={variants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.4 }}
              >
                <TransporterStep2 onNext={() => goTo(3)} onBack={() => goTo(1)} />
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                variants={variants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.4 }}
              >
                <TransporterStep3 onNext={() => goTo(4)} onBack={() => goTo(2)} />
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                variants={variants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.4 }}
              >
                <TransporterStep4 onBack={() => goTo(3)} onComplete={() => goTo(4)} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Summary */}
        <div className="mt-6">
          <TransporterSummary />
        </div>
      </div>
    </div>
  );
};

export default function TransporterRegistrationPage() {
  return (
    <TransporterProvider>
      <Inner />
    </TransporterProvider>
  );
}
