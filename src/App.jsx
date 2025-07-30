import { Routes, Route, Navigate, useLocation } from "react-router-dom"
import Login from "./components/auth/Login"
import Register from "./components/auth/Register"
import Dashboard from "./components/pages/Dashboard"
import MySessions from "./components/pages/MySessions"
import SessionEditor from "./components/pages/SessionEditor"
import { useAuth } from "./contexts/AuthContext"

function App() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (isAuthenticated && ['/login', '/register'].includes(location.pathname)) {
    return <Navigate to="/dashboard" replace />;
  }

  // Require authentication for protected routes
  if (!isAuthenticated && !['/login', '/register', '/'].includes(location.pathname)) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <Routes>
      <Route 
        path="/" 
        element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} 
      />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Protected Routes */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/my-sessions" element={<MySessions />} />
      <Route path="/session/new" element={<SessionEditor />} />
      <Route path="/session/edit/:id" element={<SessionEditor />} />
    </Routes>
  );
}

export default App