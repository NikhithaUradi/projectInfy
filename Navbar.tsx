"use client"
import { Link, useLocation } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { useNotification } from "../contexts/NotificationContext"

export default function Navbar() {
  const { user, logout } = useAuth()
  const { unreadCount } = useNotification()
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
          🏠 PropertyHub
        </Link>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className={`nav-link ${isActive("/") ? "active" : ""}`} to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive("/search") ? "active" : ""}`} to="/search">
                Search Properties
              </Link>
            </li>
            {user && (
              <>
                <li className="nav-item">
                  <Link className={`nav-link ${isActive("/dashboard") ? "active" : ""}`} to="/dashboard">
                    Dashboard
                  </Link>
                </li>
                {(user.role === "Seller" || user.role === "Agent") && (
                  <li className="nav-item">
                    <Link className={`nav-link ${isActive("/list-property") ? "active" : ""}`} to="/list-property">
                      List Property
                    </Link>
                  </li>
                )}
              </>
            )}
          </ul>

          <ul className="navbar-nav">
            {user ? (
              <>
                <li className="nav-item">
                  <Link
                    className={`nav-link position-relative ${isActive("/messages") ? "active" : ""}`}
                    to="/messages"
                  >
                    💬 Messages
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className={`nav-link position-relative ${isActive("/favorites") ? "active" : ""}`}
                    to="/favorites"
                  >
                    ❤️ Favorites
                  </Link>
                </li>
                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle position-relative"
                    href="#"
                    role="button"
                    data-bs-toggle="dropdown"
                  >
                    🔔 Notifications
                    {unreadCount > 0 && (
                      <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                        {unreadCount}
                      </span>
                    )}
                  </a>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li>
                      <h6 className="dropdown-header">Recent Notifications</h6>
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/dashboard">
                        View All Notifications
                      </Link>
                    </li>
                  </ul>
                </li>
                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                    👤 {user.name}
                  </a>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li>
                      <Link className="dropdown-item" to="/profile">
                        Profile
                      </Link>
                    </li>
                    {(user.role === "Agent" || user.role === "Seller") && (
                      <li>
                        <Link className="dropdown-item" to="/reports">
                          Reports
                        </Link>
                      </li>
                    )}
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <button className="dropdown-item" onClick={logout}>
                        Logout
                      </button>
                    </li>
                  </ul>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className={`nav-link ${isActive("/login") ? "active" : ""}`} to="/login">
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className={`nav-link ${isActive("/register") ? "active" : ""}`} to="/register">
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  )
}
