"use client"
import { Link } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { useProperty } from "../contexts/PropertyContext"
import { useNotification } from "../contexts/NotificationContext"

export default function Dashboard() {
  const { user } = useAuth()
  const { properties, favorites } = useProperty()
  const { notifications, markAsRead, markAllAsRead } = useNotification()

  const userProperties = properties.filter((p) => p.seller.id === user?.id || p.agent.id === user?.id)

  const recentNotifications = notifications.slice(0, 5)

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 18) return "Good afternoon"
    return "Good evening"
  }

  const getQuickStats = () => {
    switch (user?.role) {
      case "Buyer":
        return [
          { label: "Saved Properties", value: favorites.length, icon: "❤️" },
          { label: "Recent Searches", value: 12, icon: "🔍" },
          { label: "Scheduled Viewings", value: 3, icon: "📅" },
          { label: "Active Inquiries", value: 5, icon: "💬" },
        ]
      case "Seller":
        return [
          { label: "Listed Properties", value: userProperties.length, icon: "🏠" },
          { label: "Total Views", value: userProperties.reduce((sum, p) => sum + p.views, 0), icon: "👁️" },
          { label: "Active Inquiries", value: userProperties.reduce((sum, p) => sum + p.inquiries, 0), icon: "💬" },
          { label: "Pending Offers", value: userProperties.reduce((sum, p) => sum + p.offers.length, 0), icon: "💰" },
        ]
      case "Agent":
        return [
          { label: "Managed Properties", value: userProperties.length, icon: "🏢" },
          { label: "Active Clients", value: 15, icon: "👥" },
          { label: "This Month Sales", value: 8, icon: "📈" },
          { label: "Commission Earned", value: "$25,000", icon: "💵" },
        ]
      default:
        return []
    }
  }

  const quickStats = getQuickStats()

  return (
    <div className="container py-4">
      {/* Welcome Section */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="bg-primary text-white rounded p-4">
            <h1 className="h3 mb-2">
              {getGreeting()}, {user?.name}! 👋
            </h1>
            <p className="mb-0 opacity-75">
              Welcome to your {user?.role.toLowerCase()} dashboard. Here's what's happening with your account.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="row mb-4">
        {quickStats.map((stat, index) => (
          <div key={index} className="col-md-3 mb-3">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body text-center">
                <div className="display-4 mb-2">{stat.icon}</div>
                <h5 className="card-title h2 mb-1">{stat.value}</h5>
                <p className="card-text text-muted small">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row">
        {/* Quick Actions */}
        <div className="col-lg-8 mb-4">
          <div className="card shadow-sm">
            <div className="card-header bg-white">
              <h5 className="card-title mb-0">Quick Actions</h5>
            </div>
            <div className="card-body">
              <div className="row g-3">
                {user?.role === "Buyer" && (
                  <>
                    <div className="col-md-6">
                      <Link to="/search" className="btn btn-outline-primary w-100 p-3">
                        <div className="d-flex align-items-center">
                          <span className="me-3 fs-4">🔍</span>
                          <div className="text-start">
                            <div className="fw-bold">Search Properties</div>
                            <small className="text-muted">Find your dream home</small>
                          </div>
                        </div>
                      </Link>
                    </div>
                    <div className="col-md-6">
                      <Link to="/favorites" className="btn btn-outline-primary w-100 p-3">
                        <div className="d-flex align-items-center">
                          <span className="me-3 fs-4">❤️</span>
                          <div className="text-start">
                            <div className="fw-bold">View Favorites</div>
                            <small className="text-muted">Saved properties</small>
                          </div>
                        </div>
                      </Link>
                    </div>
                  </>
                )}

                {(user?.role === "Seller" || user?.role === "Agent") && (
                  <>
                    <div className="col-md-6">
                      <Link to="/list-property" className="btn btn-outline-primary w-100 p-3">
                        <div className="d-flex align-items-center">
                          <span className="me-3 fs-4">➕</span>
                          <div className="text-start">
                            <div className="fw-bold">List New Property</div>
                            <small className="text-muted">Add a property</small>
                          </div>
                        </div>
                      </Link>
                    </div>
                    <div className="col-md-6">
                      <Link to="/reports" className="btn btn-outline-primary w-100 p-3">
                        <div className="d-flex align-items-center">
                          <span className="me-3 fs-4">📊</span>
                          <div className="text-start">
                            <div className="fw-bold">View Reports</div>
                            <small className="text-muted">Analytics & insights</small>
                          </div>
                        </div>
                      </Link>
                    </div>
                  </>
                )}

                <div className="col-md-6">
                  <Link to="/messages" className="btn btn-outline-primary w-100 p-3">
                    <div className="d-flex align-items-center">
                      <span className="me-3 fs-4">💬</span>
                      <div className="text-start">
                        <div className="fw-bold">Messages</div>
                        <small className="text-muted">Chat with contacts</small>
                      </div>
                    </div>
                  </Link>
                </div>

                <div className="col-md-6">
                  <Link to="/profile" className="btn btn-outline-primary w-100 p-3">
                    <div className="d-flex align-items-center">
                      <span className="me-3 fs-4">⚙️</span>
                      <div className="text-start">
                        <div className="fw-bold">Settings</div>
                        <small className="text-muted">Manage your profile</small>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Notifications */}
        <div className="col-lg-4 mb-4">
          <div className="card shadow-sm">
            <div className="card-header bg-white d-flex justify-content-between align-items-center">
              <h5 className="card-title mb-0">Recent Notifications</h5>
              {notifications.length > 0 && (
                <button className="btn btn-sm btn-outline-secondary" onClick={markAllAsRead}>
                  Mark all read
                </button>
              )}
            </div>
            <div className="card-body p-0">
              {recentNotifications.length > 0 ? (
                <div className="list-group list-group-flush">
                  {recentNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`list-group-item list-group-item-action ${!notification.read ? "bg-light" : ""}`}
                      onClick={() => markAsRead(notification.id)}
                      style={{ cursor: "pointer" }}
                    >
                      <div className="d-flex w-100 justify-content-between">
                        <h6 className="mb-1 fw-bold">{notification.title}</h6>
                        <small
                          className={`${notification.type === "error" ? "text-danger" : notification.type === "success" ? "text-success" : "text-primary"}`}
                        >
                          {notification.type === "error" ? "❌" : notification.type === "success" ? "✅" : "ℹ️"}
                        </small>
                      </div>
                      <p className="mb-1 small">{notification.message}</p>
                      <small className="text-muted">{new Date(notification.createdAt).toLocaleDateString()}</small>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-muted">
                  <div className="mb-2">🔔</div>
                  <p className="mb-0">No notifications yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      {(user?.role === "Seller" || user?.role === "Agent") && userProperties.length > 0 && (
        <div className="row">
          <div className="col-12">
            <div className="card shadow-sm">
              <div className="card-header bg-white">
                <h5 className="card-title mb-0">Your Properties</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  {userProperties.slice(0, 3).map((property) => (
                    <div key={property.id} className="col-md-4 mb-3">
                      <div className="card border">
                        <img
                          src={property.images[0] || "/placeholder.svg"}
                          className="card-img-top"
                          alt={property.title}
                          style={{ height: "200px", objectFit: "cover" }}
                        />
                        <div className="card-body">
                          <h6 className="card-title">{property.title}</h6>
                          <p className="card-text text-primary fw-bold">${property.price.toLocaleString()}</p>
                          <div className="d-flex justify-content-between text-muted small">
                            <span>👁️ {property.views} views</span>
                            <span>💬 {property.inquiries} inquiries</span>
                          </div>
                          <Link to={`/property/${property.id}`} className="btn btn-sm btn-outline-primary mt-2">
                            View Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
