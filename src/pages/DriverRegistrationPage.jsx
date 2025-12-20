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
                <div className="p-4 bg-white rounded-lg shadow mt-4">
                  <h2 className="text-xl font-bold mb-4">Registration Completed 🎉</h2>

                  <p className="mb-2">
                    <strong>Saved:</strong>{" "}
                    {reg.submitted ? (
                      <span className="text-green-600 font-bold">Yes ✅</span>
                    ) : (
                      <span className="text-red-600 font-bold">No ❌</span>
                    )}
                  </p>

                  <p className="mb-6">
                    <strong>Driver Reg. ID:</strong> {reg.registrationId || "-"}
                  </p>

                  <button
                    onClick={() => dispatch(setStep(1))}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md"
                  >
                    Go Back to Step 1
                  </button>
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
