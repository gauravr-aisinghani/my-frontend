// src/context/TransporterContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";

const TransporterContext = createContext();

const STORAGE_KEY = "transporter_registration_v1";

export const TransporterProvider = ({ children }) => {
  const [data, setData] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {
        step: 1,
        step1: {},
        step2: {},
        step3: { files: {} },
        verification: { otpValidated: false, approved: false },
        submitted: false,
        savedRecord: null,
      };
    } catch {
      return {
        step: 1,
        step1: {},
        step2: {},
        step3: { files: {} },
        verification: { otpValidated: false, approved: false },
        submitted: false,
        savedRecord: null,
      };
    }
  });

  useEffect(() => {
    // persist to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const update = (patch) => setData(prev => ({ ...prev, ...patch }));
  const updateStepData = (stepKey, payload) => {
    setData(prev => ({ ...prev, [stepKey]: { ...prev[stepKey], ...payload } }));
  };
  const reset = () => {
    const empt = {
      step: 1,
      step1: {},
      step2: {},
      step3: { files: {} },
      verification: { otpValidated: false, approved: false },
      submitted: false,
      savedRecord: null,
    };
    setData(empt);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <TransporterContext.Provider value={{ data, update, updateStepData, reset }}>
      {children}
    </TransporterContext.Provider>
  );
};

export const useTransporter = () => useContext(TransporterContext);
