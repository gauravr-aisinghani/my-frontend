// src/pages/SelectedDriversPage.jsx
import React from "react";
import { Provider } from "react-redux";
import store from "../store/store";
import SelectedDriversTable from "../components/SelectedDriversTable";

const SelectedDriversPage = () => {
  return (
    <Provider store={store}>
      {/* FULL WIDTH – NO EXTRA MARGIN OR PADDING */}
      <div className="w-full h-full bg-gray-50">

        {/* PAGE HEADER */}
        <div className="bg-white rounded-none md:rounded-2xl shadow p-6 border-b border-gray-200">
          <h1 className="text-2xl md:text-3xl font-bold text-green-700 text-center">
            DAILY CALLING — SELECTED DRIVERS
          </h1>
          <p className="text-center text-gray-600 mt-1 text-sm md:text-base">
            Final shortlisted drivers after verification.
          </p>
        </div>

        {/* TABLE SECTION */}
        <div className="p-4 md:p-6">
          <SelectedDriversTable />
        </div>

      </div>
    </Provider>
  );
};

export default SelectedDriversPage;
