"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

export interface Property {
  id: string
  title: string
  description: string
  price: number
  type: "Apartment" | "House" | "Office" | "Commercial"
  status: "For Sale" | "For Rent" | "Sold" | "Rented"
  location: {
    address: string
    city: string
    state: string
    zipCode: string
    coordinates: { lat: number; lng: number }
  }
  details: {
    bedrooms: number
    bathrooms: number
    area: number
    yearBuilt: number
    parking: number
  }
  amenities: string[]
  images: string[]
  agent: {
    id: string
    name: string
    email: string
    phone: string
    avatar?: string
  }
  seller: {
    id: string
    name: string
    email: string
    phone: string
  }
  createdAt: string
  updatedAt: string
  views: number
  inquiries: number
  offers: Offer[]
  viewings: Viewing[]
}

export interface Offer {
  id: string
  buyerId: string
  buyerName: string
  amount: number
  status: "Pending" | "Accepted" | "Rejected" | "Countered"
  message: string
  createdAt: string
}

export interface Viewing {
  id: string
  userId: string
  userName: string
  date: string
  time: string
  status: "Scheduled" | "Completed" | "Cancelled"
  notes?: string
}

export interface SearchFilters {
  location: string
  priceRange: { min: number; max: number }
  propertyType: string[]
  bedrooms: number | null
  bathrooms: number | null
  minArea: number | null
  maxArea: number | null
}

interface PropertyContextType {
  properties: Property[]
  favorites: string[]
  searchFilters: SearchFilters
  loading: boolean
  searchProperties: (filters: SearchFilters) => Promise<Property[]>
  getProperty: (id: string) => Property | undefined
  addToFavorites: (propertyId: string) => void
  removeFromFavorites: (propertyId: string) => void
  createProperty: (
    property: Omit<Property, "id" | "createdAt" | "updatedAt" | "views" | "inquiries" | "offers" | "viewings">,
  ) => Promise<void>
  updateProperty: (id: string, updates: Partial<Property>) => Promise<void>
  deleteProperty: (id: string) => Promise<void>
  submitOffer: (propertyId: string, offer: Omit<Offer, "id" | "createdAt">) => Promise<void>
  scheduleViewing: (propertyId: string, viewing: Omit<Viewing, "id">) => Promise<void>
}

const PropertyContext = createContext<PropertyContextType | undefined>(undefined)

// Mock data
const mockProperties: Property[] = [
  {
    id: "1",
    title: "Modern Downtown Apartment",
    description: "Beautiful modern apartment in the heart of downtown with stunning city views.",
    price: 350000,
    type: "Apartment",
    status: "For Sale",
    location: {
      address: "123 Main St",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      coordinates: { lat: 40.7128, lng: -74.006 },
    },
    details: {
      bedrooms: 2,
      bathrooms: 2,
      area: 1200,
      yearBuilt: 2020,
      parking: 1,
    },
    amenities: ["Gym", "Pool", "Concierge", "Rooftop Deck"],
    images: ["/placeholder.svg?height=400&width=600"],
    agent: {
      id: "agent1",
      name: "Sarah Johnson",
      email: "sarah@realestate.com",
      phone: "+1234567890",
    },
    seller: {
      id: "seller1",
      name: "Mike Smith",
      email: "mike@email.com",
      phone: "+1234567891",
    },
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
    views: 45,
    inquiries: 8,
    offers: [],
    viewings: [],
  },
  {
    id: "2",
    title: "Spacious Family House",
    description: "Perfect family home with large backyard and excellent school district.",
    price: 2500,
    type: "House",
    status: "For Rent",
    location: {
      address: "456 Oak Avenue",
      city: "Brooklyn",
      state: "NY",
      zipCode: "11201",
      coordinates: { lat: 40.6892, lng: -73.9442 },
    },
    details: {
      bedrooms: 4,
      bathrooms: 3,
      area: 2500,
      yearBuilt: 2015,
      parking: 2,
    },
    amenities: ["Garden", "Garage", "Fireplace", "Basement"],
    images: ["/placeholder.svg?height=400&width=600"],
    agent: {
      id: "agent2",
      name: "David Wilson",
      email: "david@realestate.com",
      phone: "+1234567892",
    },
    seller: {
      id: "seller2",
      name: "Lisa Brown",
      email: "lisa@email.com",
      phone: "+1234567893",
    },
    createdAt: "2024-01-10",
    updatedAt: "2024-01-10",
    views: 32,
    inquiries: 12,
    offers: [],
    viewings: [],
  },
]

export function PropertyProvider({ children }: { children: ReactNode }) {
  const [properties, setProperties] = useState<Property[]>(mockProperties)
  const [favorites, setFavorites] = useState<string[]>([])
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    location: "",
    priceRange: { min: 0, max: 1000000 },
    propertyType: [],
    bedrooms: null,
    bathrooms: null,
    minArea: null,
    maxArea: null,
  })
  const [loading, setLoading] = useState(false)

  const searchProperties = async (filters: SearchFilters): Promise<Property[]> => {
    setLoading(true)
    setSearchFilters(filters)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    const filtered = properties.filter((property) => {
      if (filters.location && !property.location.city.toLowerCase().includes(filters.location.toLowerCase())) {
        return false
      }
      if (property.price < filters.priceRange.min || property.price > filters.priceRange.max) {
        return false
      }
      if (filters.propertyType.length > 0 && !filters.propertyType.includes(property.type)) {
        return false
      }
      if (filters.bedrooms && property.details.bedrooms < filters.bedrooms) {
        return false
      }
      if (filters.bathrooms && property.details.bathrooms < filters.bathrooms) {
        return false
      }
      if (filters.minArea && property.details.area < filters.minArea) {
        return false
      }
      if (filters.maxArea && property.details.area > filters.maxArea) {
        return false
      }
      return true
    })

    setLoading(false)
    return filtered
  }

  const getProperty = (id: string): Property | undefined => {
    return properties.find((p) => p.id === id)
  }

  const addToFavorites = (propertyId: string) => {
    setFavorites((prev) => [...prev, propertyId])
  }

  const removeFromFavorites = (propertyId: string) => {
    setFavorites((prev) => prev.filter((id) => id !== propertyId))
  }

  const createProperty = async (
    propertyData: Omit<Property, "id" | "createdAt" | "updatedAt" | "views" | "inquiries" | "offers" | "viewings">,
  ) => {
    setLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const newProperty: Property = {
      ...propertyData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      views: 0,
      inquiries: 0,
      offers: [],
      viewings: [],
    }

    setProperties((prev) => [newProperty, ...prev])
    setLoading(false)
  }

  const updateProperty = async (id: string, updates: Partial<Property>) => {
    setLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    setProperties((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p)),
    )

    setLoading(false)
  }

  const deleteProperty = async (id: string) => {
    setLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    setProperties((prev) => prev.filter((p) => p.id !== id))
    setLoading(false)
  }

  const submitOffer = async (propertyId: string, offer: Omit<Offer, "id" | "createdAt">) => {
    const newOffer: Offer = {
      ...offer,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }

    setProperties((prev) => prev.map((p) => (p.id === propertyId ? { ...p, offers: [...p.offers, newOffer] } : p)))
  }

  const scheduleViewing = async (propertyId: string, viewing: Omit<Viewing, "id">) => {
    const newViewing: Viewing = {
      ...viewing,
      id: Date.now().toString(),
    }

    setProperties((prev) =>
      prev.map((p) => (p.id === propertyId ? { ...p, viewings: [...p.viewings, newViewing] } : p)),
    )
  }

  return (
    <PropertyContext.Provider
      value={{
        properties,
        favorites,
        searchFilters,
        loading,
        searchProperties,
        getProperty,
        addToFavorites,
        removeFromFavorites,
        createProperty,
        updateProperty,
        deleteProperty,
        submitOffer,
        scheduleViewing,
      }}
    >
      {children}
    </PropertyContext.Provider>
  )
}

export function useProperty() {
  const context = useContext(PropertyContext)
  if (context === undefined) {
    throw new Error("useProperty must be used within a PropertyProvider")
  }
  return context
}
