// src/pages/DriverRegistrationPage.jsx
import React from "react";
import { useSelector, useDispatch } from "react-redux";

import DriverDetailsForm from "../components/DriverDetailsForm";
import LicenceDetailsForm from "../components/LicenceDetailsForm";
import SarpanchDetailsForm from "../components/SarpanchDetailsForm";
import VillageDetailsForm from "../components/VillageDetailsForm";
import LastExperienceForm from "../components/LastExperienceForm";
import DriverDocumentsForm from "../components/DriverDocumentsForm";

import {
  setStep,
  selectDriverRegistration,
} from "../store/driverRegistrationSlice";

import { AnimatePresence, motion } from "framer-motion";

const Inner = () => {
  const dispatch = useDispatch();
  const reg = useSelector(selectDriverRegistration);
  const step = reg.step || 1;

  const variants = {
    initial: { opacity: 0, x: 80 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -80 },
  };

  return (
    <div className="w-full h-full">
      <div className="bg-white shadow-lg rounded-xl p-4 md:p-6 w-full h-full flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <h2 className="text-lg md:text-xl font-bold text-green-700">
            Driver Registration
          </h2>
          <div className="text-sm text-gray-600 font-medium">Step {step} / 6</div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4 md:mb-6">
          <div className="w-full bg-gray-200 h-2 rounded-lg">
            <div
              className="h-2 bg-green-600 rounded-lg transition-all duration-500"
              style={{ width: `${(step / 6) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
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
                <DriverDetailsForm
                  onNext={() => dispatch(setStep(2))}
                />
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
                <LicenceDetailsForm
                  onNext={() => dispatch(setStep(3))}
                  onBack={() => dispatch(setStep(1))}
                />
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
                <SarpanchDetailsForm
                  onNext={() => dispatch(setStep(4))}
                  onBack={() => dispatch(setStep(2))}
                />
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
                <LastExperienceForm
                  onNext={() => dispatch(setStep(5))}
                  onBack={() => dispatch(setStep(3))}
                />
              </motion.div>
            )}

            {step === 5 && (
              <motion.div
                key="step5"
                variants={variants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.4 }}
              >
                <DriverDocumentsForm
                  onNext={(nextStep) => dispatch(setStep(nextStep))}
                  onBack={() => dispatch(setStep(4))}
                />
              </motion.div>
            )}

            {step === 6 && (
              <motion.div
                key="step6"
                variants={variants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.4 }}
              >
                <div className="p-6 md:p-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-xl shadow-2xl flex flex-col items-center text-center text-white">
                  <div className="mb-6">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-16 w-16 mx-auto mb-4 animate-bounce"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <h2 className="text-2xl md:text-3xl font-extrabold mb-2">
                      Registration Completed! 🎉
                    </h2>
                    <p className="text-lg md:text-xl max-w-xl mx-auto">
                      Your documents are successfully submitted. Your <strong>GDC number</strong> will be sent to you after verification. 
                      Once verified, you can make payments and start using our services immediately.
                    </p>
                  </div>

                  <div className="mt-6">
                    <button
                      onClick={() => dispatch(setStep(1))}
                      className="px-6 py-3 bg-white text-green-600 font-bold rounded-full shadow-lg hover:shadow-xl transition transform hover:-translate-y-1"
                    >
                      Back to Start
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </div>
    </div>
  );
};

export default function DriverRegistrationPage() {
  return <Inner />;
}
