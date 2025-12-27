// src/pages/DailyVisitorsPage.jsx
import React from "react";
import { Provider } from "react-redux";
import store from "../store/store";

import DailyVisitorForm2 from "../components/DailyVisitorForm2";
import SelectedDriversTable from "../components/SelectedDriversTable";

const DailyVisitorsPage = () => {
  return (
    <Provider store={store}>
      <div className="w-full h-full bg-gray-50">

        {/* ===== PAGE HEADER (NO GAP ABOVE) ===== */}
        {/* <div className="bg-white shadow border-b border-gray-200 p-2 md:p-3 m-0 rounded-none">
          <h1 className="text-lg md:text-xl font-semibold text-green-700 text-center leading-tight">
            Daily Visitors / Driver Enquiries
          </h1>

          <p className="text-center text-gray-600 mt-0.5 text-xs md:text-sm leading-tight">
            Add daily drivers, manage enquiries & finalize drivers.
          </p>
        </div> */}

        {/* ===== FORM SECTION (NO EXTRA SPACING) ===== */}
        <div className="space-y-6">
          <DailyVisitorForm2 />
        </div>

        
        {/* {  */}
        {/* <div className="p-2 md:p-3">
          <DailyVisitorsTable />
        </div> */}

        {/* // <div className="p-2 md:p-3">
        //   <SelectedDriversTable />
        // </div> */}
        
      </div>
    </Provider>
  );
};

export default DailyVisitorsPage;
