import { Routes, Route, Navigate } from "react-router-dom"
import Login from "./components/auth/Login"
import Register from "./components/auth/Register"
import Dashboard from "./components/pages/Dashboard"
import MySessions from "./components/pages/MySessions"
import SessionEditor from "./components/pages/SessionEditor"
import { useAuth } from "./contexts/AuthContext"

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/" 
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} 
        />
        <Route 
          path="/register" 
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />} 
        />
        
        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/my-sessions"
          element={isAuthenticated ? <MySessions /> : <Navigate to="/login" />}
        />
        <Route
          path="/session/new"
          element={isAuthenticated ? <SessionEditor /> : <Navigate to="/login" />}
        />
        <Route
          path="/session/edit/:id"
          element={isAuthenticated ? <SessionEditor /> : <Navigate to="/login" />}
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App