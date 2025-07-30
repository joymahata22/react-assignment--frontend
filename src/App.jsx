import { Routes, Route, Navigate, useLocation } from "react-router-dom"
import Login from "./components/auth/Login"
import Register from "./components/auth/Register"
import Dashboard from "./components/pages/Dashboard"
import MySessions from "./components/pages/MySessions"
import SessionEditor from "./components/pages/SessionEditor"
import { useAuth } from "./contexts/AuthContext"

function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

function App() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <Routes>
      <Route 
        path="/" 
        element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} 
      />
      <Route
        path="/login"
        element={
          isAuthenticated ? 
            <Navigate to="/dashboard" replace /> : 
            <Login />
        }
      />
      <Route
        path="/register"
        element={
          isAuthenticated ? 
            <Navigate to="/dashboard" replace /> : 
            <Register />
        }
      />
      
      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-sessions"
        element={
          <ProtectedRoute>
            <MySessions />
          </ProtectedRoute>
        }
      />
      <Route
        path="/session/new"
        element={
          <ProtectedRoute>
            <SessionEditor />
          </ProtectedRoute>
        }
      />
      <Route
        path="/session/edit/:id"
        element={
          <ProtectedRoute>
            <SessionEditor />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App