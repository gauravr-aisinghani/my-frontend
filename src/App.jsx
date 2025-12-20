import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import VerifyEmail from "./pages/VerifyEmail";
import ProtectedRoute from "./components/ProtectedRoute";
import ForgotPassword from "./pages/ForgotPassword";
import SuperAdminLogin from "./pages/SuperAdminLogin.jsx";
import SidebarLayout from "./components/SidebarLayout";
import AdminDashboardPage from "./pages/AdminDashboardPage.jsx";
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
import SuperAdminDashboard from "./pages/SuperAdminDashboard.jsx";
import AdminPage from "./pages/AdminPage.jsx";
import GenerateGdcPage from "./pages/GenerateGdcPage.jsx";
import Payments from "./pages/Payments.jsx";
import PaymentConfirmation from "./components/PaymentConfirmation.jsx";
// 🔥 Add this
import GlobalLoader from "./components/GlobalLoader";
import VisitorTransportersTable from "./components/VisitorTransportersTable.jsx";
import SelectedTransportersTable from "./components/SelectedTransportersTable.jsx";

function App() {
  return (
    <>
      {/* 🔥 Global Loader works for all API requests */}
      <GlobalLoader />

      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/verifyEmail" element={<VerifyEmail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* SUPER ADMIN – OUTSIDE dashboard */}
          <Route path="/super-admin" element={<SuperAdminLogin />} />
          <Route path="/super-admin-dashboard" element={<SuperAdminDashboard />} />

          {/* Protected dashboard */}
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
            <Route path="xml-table" element={<XmlTableCreator />} />
            <Route path="driver-details" element={<DriverDetails />} />
            <Route path="licence-details" element={<LicenceDetailsPage />} />
            <Route path="last-experience" element={<LastExperiencePage />} />
            <Route path="daily-visitor" element={<DailyVisitorPage2 />} />
            <Route path="curd" element={<CrudUI />} />
            <Route path="daily-visitor-table" element={<DailyVisitorTable />} />
            <Route path="driver-verification" element={<DriverVerificationPage />} />
            <Route path="generate-gdc" element={<GenerateGdcPage />} />
            <Route path="payments" element={<Payments />} />
            <Route path="payment-confirmation" element={<PaymentConfirmation />} />
            <Route path="visitor-transporters-list" element={<VisitorTransportersTable />} />
             <Route path="selected-transporters-list" element={<SelectedTransportersTable />} />

            


          </Route>

          {/* Redirect unknown routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
