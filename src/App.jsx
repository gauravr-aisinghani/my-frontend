import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import VerifyEmail from "./pages/VerifyEmail";
import ProtectedRoute from "./components/ProtectedRoute";
import ForgotPassword from "./pages/ForgotPassword";

import SuperAdminLogin from "./pages/SuperAdminLogin.jsx";
import SuperAdminDashboard from "./pages/SuperAdminDashboard.jsx";

import AdminPage from "./pages/AdminPage.jsx";
import AdminDashboardPage from "./pages/AdminDashboardPage.jsx";
import AdminDriverRequestsPage from "./pages/AdminDriverRequestsPage";
import DailyVisitorPage2 from "./pages/DailyVisitorsPage2.jsx";
import SelectedDriversPage from "./pages/SelectedDriversPage.jsx";
import VehiclesPage from "./pages/VehiclesPage.jsx";
import ReportsPage from "./pages/ReportsPage.jsx";
import TransportCompanyVisitorPage from "./pages/TransportCompanyVisitorPage.jsx";
import FinalVerifiedTransporterPage from "./pages/FinalVerifiedTransporterPage.jsx";
import TransporterRegistrationPage from "./pages/TransporterRegistrationPage.jsx";
import DriverRegistrationPage from "./pages/DriverRegistrationPage.jsx";
import CreateTable from "./pages/CreateTable";
import XmlTableCreator from "./pages/XmlTableCreator";
import DriverDetails from "./pages/DriverDetails";
import LicenceDetailsPage from "./pages/LicenceDetailsPage";
import LastExperiencePage from "./pages/LastExperiencePage";
import CrudUI from "./pages/CrudUI";
import DailyVisitorTable from "./components/DailyVisitorsTable.jsx";
import DriverVerificationPage from "./pages/DriverVerificationPage.jsx";
import TransporterVerificationPage from "./pages/TransporterVerificationPage.jsx";
import DriverReports from "./pages/DriverReports.jsx";

import GenerateGdcPage from "./pages/GenerateGdcPage.jsx";
import GenerateGdcTransporterPage from "./pages/GenerateGdcTransporterPage.jsx";

import Payments from "./pages/Payments.jsx";
import PaymentConfirmation from "./components/PaymentConfirmation.jsx";
import AdminNotificationsPage from "./pages/AdminNotificationsPage.jsx";
import VisitorTransportersTable from "./components/VisitorTransportersTable.jsx";
import SelectedTransportersTable from "./components/SelectedTransportersTable.jsx";
import TransporterReports from "./pages/TransporterReports.jsx";
import EntrySelection from "./pages/EntrySelection.jsx";
import GlobalLoader from "./components/GlobalLoader";
import PaymentReports from "./pages/paymentReportApi.jsx";

// 🔥 OPERATIONS PAGES
import AssignDriver from "./pages/operations/AssignDriver.jsx";
import PaidByTransporter from "./pages/operations/PaidByTransporter.jsx";
import PaymentVerified from "./pages/operations/PaymentVerified.jsx";
import CurrentPosting from "./pages/operations/CurrentPosting.jsx";
import FinalSettlement from "./pages/operations/FinalSettlement.jsx";
import TransporterLedger from "./pages/operations/TransporterLedger.jsx";
import DriverLedger from "./pages/operations/DriverLedger.jsx";
import TransporterDashboard from "./pages/TransporterDashboard.jsx";
import RaiseDriverRequest from "./pages/RaiseDriverRequest.jsx";
import TransporterNotificationsPage from "./pages/TransporterNotificationsPage.jsx";
import TransporterWallet from "./pages/TransporterWallet.jsx";
import IdealDrivers from "./pages/IdealDrivers.jsx";

function App() {
  return (
    <>
      <GlobalLoader />

      <Router>
        <Routes>

          {/* 🌍 PUBLIC ENTRY */}
          <Route path="/" element={<EntrySelection />} />

          {/* 🌍 PUBLIC REGISTRATION */}
          <Route path="/driver/signup" element={<DriverRegistrationPage />} />
          <Route path="/transporter/signup" element={<TransporterRegistrationPage />} />
           <Route path="/transporter-notification" element={<TransporterNotificationsPage />} />

           <Route path="/transporter/wallet" element={<TransporterWallet/>}/>

<Route
  path="/transporter-notification/:mobile"
  element={<TransporterNotificationsPage />}
/>


          {/* 🌍 PUBLIC PAYMENT */}
          <Route path="/payment" element={<Payments />} />
          <Route path="/payment-confirmation" element={<PaymentConfirmation />} />

          {/* 🔐 ADMIN LOGIN */}
          <Route path="/admin" element={<LoginForm />} />

           {/* 🔐 Transporter LOGIN */}
          <Route path="/transporter-dashboard" element={<TransporterDashboard />} />
          <Route
  path="/transporter/raise-driver-request"
  element={<RaiseDriverRequest />}
/>

           <Route
  path="/driver-requests"
  element={<AdminDriverRequestsPage />}
/>


<Route
  path="/admin/notifications"
  element={<AdminNotificationsPage />}
/>




          {/* OPTIONAL AUTH */}
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/verifyEmail" element={<VerifyEmail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* 👑 SUPER ADMIN */}
          <Route path="/super-admin" element={<SuperAdminLogin />} />
          <Route path="/super-admin-dashboard" element={<SuperAdminDashboard />} />

          {/* 🔒 ADMIN DASHBOARD */}
          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute>
                <AdminPage />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboardPage />} />
            <Route path="daily-visitors" element={<DailyVisitorPage2 />} />
            <Route path="selected-drivers" element={<SelectedDriversPage />} />
            <Route path="vehicles" element={<VehiclesPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="transport-visitor" element={<TransportCompanyVisitorPage />} />
            <Route path="final-verified-transporter" element={<FinalVerifiedTransporterPage />} />
            <Route path="transporter-registration" element={<TransporterRegistrationPage />} />
            <Route path="driver-registration" element={<DriverRegistrationPage />} />
            <Route path="create-table" element={<CreateTable />} />
             <Route path="ideal-drivers" element={<IdealDrivers />} />



            <Route path="xml-table" element={<XmlTableCreator />} />
            <Route path="driver-details" element={<DriverDetails />} />
            <Route path="licence-details" element={<LicenceDetailsPage />} />
            <Route path="last-experience" element={<LastExperiencePage />} />
            <Route path="curd" element={<CrudUI />} />
            <Route path="daily-visitor-table" element={<DailyVisitorTable />} />
            <Route path="driver-verification" element={<DriverVerificationPage />} />
            <Route path="transporter-verification" element={<TransporterVerificationPage />} />
            <Route path="drivers-reports" element={<DriverReports />} />
            <Route path="transporter-reports" element={<TransporterReports />} />
            <Route path="payment-reports" element={<PaymentReports />} />

            <Route path="generate-gdc" element={<GenerateGdcPage />} />
            <Route path="generate-gdc-transporter" element={<GenerateGdcTransporterPage />} />

            <Route path="payments" element={<Payments />} />

            <Route path="visitor-transporters-list" element={<VisitorTransportersTable />} />
            <Route path="selected-transporters-list" element={<SelectedTransportersTable />} />

            {/* 🔥 OPERATIONS ROUTES */}
            <Route path="assign-driver" element={<AssignDriver />} />
            <Route path="paid-by-transporter" element={<PaidByTransporter />} />
            <Route path="payment-verified" element={<PaymentVerified />} />
            <Route path="current-posting" element={<CurrentPosting />} />
            <Route path="final-settlement" element={<FinalSettlement />} />
            <Route path="transporter-ledger" element={<TransporterLedger />} />
            <Route path="driver-ledger" element={<DriverLedger />} />



          </Route>

          {/* 🔁 FALLBACK */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </Router>
    </>
  );
}

export default App;
