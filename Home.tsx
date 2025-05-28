"use client"
import { Link } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

export default function Home() {
  const { user } = useAuth()

  return (
    <div className="min-vh-100">
      {/* Hero Section */}
      <section className="bg-primary text-white py-5">
        <div className="container">
          <div className="row align-items-center min-vh-75">
            <div className="col-lg-6">
              <h1 className="display-4 fw-bold mb-4">Find Your Perfect Property</h1>
              <p className="lead mb-4">
                Discover amazing properties for sale and rent. Connect with trusted agents and sellers in your area.
              </p>
              <div className="d-flex gap-3 flex-wrap">
                <Link to="/search" className="btn btn-light btn-lg">
                  🔍 Search Properties
                </Link>
                {!user && (
                  <Link to="/register" className="btn btn-outline-light btn-lg">
                    Get Started
                  </Link>
                )}
              </div>
            </div>
            <div className="col-lg-6">
              <img src="/placeholder.svg?height=400&width=600" alt="Real Estate" className="img-fluid rounded shadow" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-5">
        <div className="container">
          <div className="row text-center mb-5">
            <div className="col-12">
              <h2 className="display-5 fw-bold">Why Choose PropertyHub?</h2>
              <p className="lead text-muted">Everything you need for your property journey</p>
            </div>
          </div>

          <div className="row g-4">
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <div className="display-4 mb-3">🔍</div>
                  <h5 className="card-title">Advanced Search</h5>
                  <p className="card-text">
                    Find properties with powerful filters including location, price, type, and amenities.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <div className="display-4 mb-3">💬</div>
                  <h5 className="card-title">Direct Communication</h5>
                  <p className="card-text">
                    Connect directly with sellers, buyers, and agents through our secure messaging system.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <div className="display-4 mb-3">📅</div>
                  <h5 className="card-title">Easy Scheduling</h5>
                  <p className="card-text">
                    Schedule property viewings with just a few clicks and get instant confirmations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-light py-5">
        <div className="container">
          <div className="row text-center">
            <div className="col-md-3 mb-4">
              <div className="display-4 fw-bold text-primary">1000+</div>
              <p className="lead">Properties Listed</p>
            </div>
            <div className="col-md-3 mb-4">
              <div className="display-4 fw-bold text-primary">500+</div>
              <p className="lead">Happy Customers</p>
            </div>
            <div className="col-md-3 mb-4">
              <div className="display-4 fw-bold text-primary">50+</div>
              <p className="lead">Trusted Agents</p>
            </div>
            <div className="col-md-3 mb-4">
              <div className="display-4 fw-bold text-primary">25+</div>
              <p className="lead">Cities Covered</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-5">
        <div className="container">
          <div className="row justify-content-center text-center">
            <div className="col-lg-8">
              <h2 className="display-5 fw-bold mb-4">Ready to Get Started?</h2>
              <p className="lead mb-4">
                Join thousands of users who have found their perfect property through PropertyHub.
              </p>
              {!user ? (
                <div className="d-flex gap-3 justify-content-center flex-wrap">
                  <Link to="/register" className="btn btn-primary btn-lg">
                    Create Account
                  </Link>
                  <Link to="/search" className="btn btn-outline-primary btn-lg">
                    Browse Properties
                  </Link>
                </div>
              ) : (
                <Link to="/dashboard" className="btn btn-primary btn-lg">
                  Go to Dashboard
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
