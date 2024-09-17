import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import LoginPage from "./pages/LoginPage";
import DashboardLayout from "./components/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/HomePage";
import ProtectedRoute from "./components/ProtectedRoutes";
import RoleSelection from "./pages/RoleSelection";
import RegisterPage from "./pages/RegisterPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import Overview from "./pages/Overview";
import Properties from "./pages/Properties";
import Requests from "./pages/Requests";
import Settings from "./pages/Settings";
import OwnerDashboard from "./pages/OwnerDashboard";
import ChatListContainer from "./components/ChatListContainer"; // Adjust path as needed
import ChatWindow from "./components/ChatWindow"; // Adjust path as needed

function App() {
  const { user } = useAuth();

  return (
    <Router>
      <Routes>
        {/* Login Route */}
        <Route
          path="/login"
          element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />}
        />

        {/* Registration and Verification Routes */}
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />

        {/* Role Selection Route */}
        <Route
          path="/role-selection"
          element={
            <ProtectedRoute>
              <RoleSelection />
            </ProtectedRoute>
          }
        />

        {/* Dashboard and Nested Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="overview" element={<Overview />} />

          {/* Owner Dashboard Nested Routes */}
          <Route path="owner">
            <Route path="properties" element={<Properties />} />
            <Route path="requests" element={<Requests />} />
            <Route path="settings" element={<Settings />} />

            {/* Chats Route */}
            <Route path="chats" element={<ChatListContainer />} />

            {/* Nested chat route, now relative */}
            <Route path="chats/:chatId" element={<ChatWindow />} />
          </Route>
        </Route>

        {/* Fallback for undefined routes */}
        <Route path="*" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
