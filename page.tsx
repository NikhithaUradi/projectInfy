"use client"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider, useAuth } from "./contexts/AuthContext"
import { PropertyProvider } from "./contexts/PropertyContext"
import { NotificationProvider } from "./contexts/NotificationContext"
import Navbar from "./components/Navbar"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import PropertySearch from "./pages/PropertySearch"
import PropertyDetails from "./pages/PropertyDetails"
import PropertyListing from "./pages/PropertyListing"
import Messages from "./pages/Messages"
import Profile from "./pages/Profile"
import Favorites from "./pages/Favorites"
import Reports from "./pages/Reports"
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.bundle.min.js"

function AppContent() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" />} />
        <Route path="/search" element={<PropertySearch />} />
        <Route path="/property/:id" element={<PropertyDetails />} />
        <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/list-property" element={user ? <PropertyListing /> : <Navigate to="/login" />} />
        <Route path="/messages" element={user ? <Messages /> : <Navigate to="/login" />} />
        <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
        <Route path="/favorites" element={user ? <Favorites /> : <Navigate to="/login" />} />
        <Route
          path="/reports"
          element={
            user && (user.role === "Agent" || user.role === "Seller") ? <Reports /> : <Navigate to="/dashboard" />
          }
        />
      </Routes>
    </div>
  )
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <PropertyProvider>
          <NotificationProvider>
            <AppContent />
          </NotificationProvider>
        </PropertyProvider>
      </AuthProvider>
    </Router>
  )
}

