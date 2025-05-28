"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useProperty, type Property, type SearchFilters } from "../contexts/PropertyContext"
import { useAuth } from "../contexts/AuthContext"

export default function PropertySearch() {
  const { searchProperties, addToFavorites, removeFromFavorites, favorites, loading } = useProperty()
  const { user } = useAuth()
  const [searchResults, setSearchResults] = useState<Property[]>([])
  const [filters, setFilters] = useState<SearchFilters>({
    location: "",
    priceRange: { min: 0, max: 1000000 },
    propertyType: [],
    bedrooms: null,
    bathrooms: null,
    minArea: null,
    maxArea: null,
  })
  const [sortBy, setSortBy] = useState<"price-asc" | "price-desc" | "newest" | "oldest">("newest")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  useEffect(() => {
    handleSearch()
  }, [])

  const handleSearch = async () => {
    const results = await searchProperties(filters)
    setSearchResults(sortProperties(results))
  }

  const sortProperties = (properties: Property[]) => {
    return [...properties].sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return a.price - b.price
        case "price-desc":
          return b.price - a.price
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        default:
          return 0
      }
    })
  }

  useEffect(() => {
    setSearchResults(sortProperties(searchResults))
  }, [sortBy])

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handlePropertyTypeChange = (type: string, checked: boolean) => {
    setFilters((prev) => ({
      ...prev,
      propertyType: checked ? [...prev.propertyType, type] : prev.propertyType.filter((t) => t !== type),
    }))
  }

  const toggleFavorite = (propertyId: string) => {
    if (!user) return

    if (favorites.includes(propertyId)) {
      removeFromFavorites(propertyId)
    } else {
      addToFavorites(propertyId)
    }
  }

  const PropertyCard = ({ property }: { property: Property }) => (
    <div className={`${viewMode === "grid" ? "col-md-6 col-lg-4" : "col-12"} mb-4`}>
      <div className={`card h-100 shadow-sm ${viewMode === "list" ? "card-horizontal" : ""}`}>
        <div className={`position-relative ${viewMode === "list" ? "d-flex" : ""}`}>
          <img
            src={property.images[0] || "/placeholder.svg"}
            className={`${viewMode === "list" ? "flex-shrink-0" : "card-img-top"}`}
            alt={property.title}
            style={{
              height: viewMode === "list" ? "200px" : "250px",
              width: viewMode === "list" ? "300px" : "100%",
              objectFit: "cover",
            }}
          />
          <div className="position-absolute top-0 end-0 m-2">
            <span className={`badge ${property.status === "For Sale" ? "bg-success" : "bg-primary"}`}>
              {property.status}
            </span>
          </div>
          {user && (
            <button
              className="btn btn-sm btn-light position-absolute top-0 start-0 m-2 border-0"
              onClick={() => toggleFavorite(property.id)}
              style={{ backgroundColor: "rgba(255,255,255,0.9)" }}
            >
              {favorites.includes(property.id) ? "❤️" : "🤍"}
            </button>
          )}
        </div>

        <div className={`card-body ${viewMode === "list" ? "flex-grow-1" : ""}`}>
          <h5 className="card-title">{property.title}</h5>
          <p className="card-text text-muted small mb-2">
            📍 {property.location.address}, {property.location.city}
          </p>
          <p className="card-text">{property.description.substring(0, 100)}...</p>

          <div className="row text-center mb-3">
            <div className="col-4">
              <small className="text-muted">🛏️ {property.details.bedrooms} beds</small>
            </div>
            <div className="col-4">
              <small className="text-muted">🚿 {property.details.bathrooms} baths</small>
            </div>
            <div className="col-4">
              <small className="text-muted">📐 {property.details.area} sqft</small>
            </div>
          </div>

          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h5 className="text-primary mb-0">
                ${property.price.toLocaleString()}
                {property.status === "For Rent" && <small className="text-muted">/month</small>}
              </h5>
            </div>
            <Link to={`/property/${property.id}`} className="btn btn-primary btn-sm">
              View Details
            </Link>
          </div>

          <div className="mt-2 d-flex justify-content-between text-muted small">
            <span>👁️ {property.views} views</span>
            <span>💬 {property.inquiries} inquiries</span>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="container py-4">
      <div className="row">
        {/* Filters Sidebar */}
        <div className="col-lg-3 mb-4">
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white">
              <h5 className="card-title mb-0">🔍 Search Filters</h5>
            </div>
            <div className="card-body">
              {/* Location */}
              <div className="mb-3">
                <label className="form-label fw-bold">Location</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="City, State, or ZIP"
                  value={filters.location}
                  onChange={(e) => handleFilterChange("location", e.target.value)}
                />
              </div>

              {/* Price Range */}
              <div className="mb-3">
                <label className="form-label fw-bold">Price Range</label>
                <div className="row">
                  <div className="col-6">
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Min"
                      value={filters.priceRange.min || ""}
                      onChange={(e) =>
                        handleFilterChange("priceRange", {
                          ...filters.priceRange,
                          min: Number.parseInt(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                  <div className="col-6">
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Max"
                      value={filters.priceRange.max || ""}
                      onChange={(e) =>
                        handleFilterChange("priceRange", {
                          ...filters.priceRange,
                          max: Number.parseInt(e.target.value) || 1000000,
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Property Type */}
              <div className="mb-3">
                <label className="form-label fw-bold">Property Type</label>
                {["Apartment", "House", "Office", "Commercial"].map((type) => (
                  <div key={type} className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={type}
                      checked={filters.propertyType.includes(type)}
                      onChange={(e) => handlePropertyTypeChange(type, e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor={type}>
                      {type}
                    </label>
                  </div>
                ))}
              </div>

              {/* Bedrooms */}
              <div className="mb-3">
                <label className="form-label fw-bold">Bedrooms</label>
                <select
                  className="form-select"
                  value={filters.bedrooms || ""}
                  onChange={(e) =>
                    handleFilterChange("bedrooms", e.target.value ? Number.parseInt(e.target.value) : null)
                  }
                >
                  <option value="">Any</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                  <option value="5">5+</option>
                </select>
              </div>

              {/* Bathrooms */}
              <div className="mb-3">
                <label className="form-label fw-bold">Bathrooms</label>
                <select
                  className="form-select"
                  value={filters.bathrooms || ""}
                  onChange={(e) =>
                    handleFilterChange("bathrooms", e.target.value ? Number.parseInt(e.target.value) : null)
                  }
                >
                  <option value="">Any</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                </select>
              </div>

              {/* Area */}
              <div className="mb-3">
                <label className="form-label fw-bold">Area (sqft)</label>
                <div className="row">
                  <div className="col-6">
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Min"
                      value={filters.minArea || ""}
                      onChange={(e) =>
                        handleFilterChange("minArea", e.target.value ? Number.parseInt(e.target.value) : null)
                      }
                    />
                  </div>
                  <div className="col-6">
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Max"
                      value={filters.maxArea || ""}
                      onChange={(e) =>
                        handleFilterChange("maxArea", e.target.value ? Number.parseInt(e.target.value) : null)
                      }
                    />
                  </div>
                </div>
              </div>

              <button className="btn btn-primary w-100" onClick={handleSearch} disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Searching...
                  </>
                ) : (
                  "Search Properties"
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="col-lg-9">
          {/* Results Header */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h4 className="mb-1">Search Results</h4>
              <p className="text-muted mb-0">{searchResults.length} properties found</p>
            </div>

            <div className="d-flex gap-2">
              {/* View Mode Toggle */}
              <div className="btn-group" role="group">
                <button
                  type="button"
                  className={`btn btn-outline-secondary ${viewMode === "grid" ? "active" : ""}`}
                  onClick={() => setViewMode("grid")}
                >
                  ⊞
                </button>
                <button
                  type="button"
                  className={`btn btn-outline-secondary ${viewMode === "list" ? "active" : ""}`}
                  onClick={() => setViewMode("list")}
                >
                  ☰
                </button>
              </div>

              {/* Sort Dropdown */}
              <select
                className="form-select"
                style={{ width: "auto" }}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2 text-muted">Searching properties...</p>
            </div>
          )}

          {/* Results Grid/List */}
          {!loading && (
            <div className="row">
              {searchResults.length > 0 ? (
                searchResults.map((property) => <PropertyCard key={property.id} property={property} />)
              ) : (
                <div className="col-12">
                  <div className="text-center py-5">
                    <div className="display-1 mb-3">🔍</div>
                    <h4>No properties found</h4>
                    <p className="text-muted">Try adjusting your search filters to find more properties.</p>
                    <button
                      className="btn btn-primary"
                      onClick={() => {
                        setFilters({
                          location: "",
                          priceRange: { min: 0, max: 1000000 },
                          propertyType: [],
                          bedrooms: null,
                          bathrooms: null,
                          minArea: null,
                          maxArea: null,
                        })
                        handleSearch()
                      }}
                    >
                      Clear Filters
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
