import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./auth/useAuth";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

import Projects from "./pages/Projects";
import CreateProject from "./pages/CreateProject";
import EditProject from "./pages/EditProject";
import OpenProject from "./pages/OpenProject";

import UserManagement from "./pages/UserManagement";
import CreateUser from "./pages/CreateUser";
import EditUser from "./pages/EditUser";

import Settings from "./pages/Settings";
import ChangePassword from "./pages/ChangePassword";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

import ProtectedLayout from "./layouts/ProtectedLayout";

function App() {
  const { auth } = useAuth();

  if (auth.loading) return null;

  return (
    <Routes>
      {/* ================= PUBLIC ================= */}
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      <Route
        path="/change-password"
        element={
          auth.isAuthenticated ? (
            <ChangePassword />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* ================= PROTECTED ================= */}
      <Route
        element={
          auth.isAuthenticated ? (
            <ProtectedLayout />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      >
        {/* Common */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />

        {/* PROJECTS */}
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:projectId" element={<OpenProject />} />

        <Route
          path="/projects/create"
          element={
            auth.role === "ADMIN" || auth.role === "MANAGER" ? (
              <CreateProject />
            ) : (
              <Navigate to="/dashboard" replace />
            )
          }
        />

        <Route
          path="/projects/:projectId/edit"
          element={
            auth.role === "ADMIN" || auth.role === "MANAGER" ? (
              <EditProject />
            ) : (
              <Navigate to="/dashboard" replace />
            )
          }
        />

        {/* USERS (ADMIN ONLY) */}
        <Route
          path="/users"
          element={
            auth.role === "ADMIN" ? (
              <UserManagement />
            ) : (
              <Navigate to="/dashboard" replace />
            )
          }
        />

        <Route
          path="/users/create"
          element={
            auth.role === "ADMIN" ? (
              <CreateUser />
            ) : (
              <Navigate to="/dashboard" replace />
            )
          }
        />

        <Route
          path="/users/:id/edit"
          element={
            auth.role === "ADMIN" ? (
              <EditUser />
            ) : (
              <Navigate to="/dashboard" replace />
            )
          }
        />
      </Route>

      {/* FALLBACK */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
