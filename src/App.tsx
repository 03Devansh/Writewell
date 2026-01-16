import { Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useAuth } from './contexts/AuthContext'
import Landing from './pages/Landing'
import Auth from './pages/Auth'
import Dashboard from './pages/Dashboard'
import Editor from './pages/Editor'
import Profile from './pages/Profile'
import Trial from './pages/Trial'
import StyleGuide from '../new-style-guide/StyleGuide'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading, token } = useAuth()
  const [loadingTimeout, setLoadingTimeout] = useState(false)

  // Add timeout to prevent infinite loading
  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        setLoadingTimeout(true)
      }, 3000) // 3 second timeout

      return () => clearTimeout(timer)
    } else {
      setLoadingTimeout(false)
    }
  }, [isLoading])

  // Show loading only if still loading and timeout hasn't occurred
  if (isLoading && !loadingTimeout) {
    return (
      <div className="min-h-screen bg-cream-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-ink-900 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-charcoal-600 font-body">Loading...</p>
        </div>
      </div>
    )
  }

  // If no user/token after loading completes (or timeout), redirect to auth
  if (!user || !token) {
    return <Navigate to="/auth" replace />
  }

  return <>{children}</>
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()

  // Don't block rendering - show content even if auth is loading
  // This prevents infinite loading on public pages
  if (isLoading) {
    // Render children anyway - auth will update in background
    return <>{children}</>
  }

  // If user is logged in, redirect to dashboard
  // Subscription checks happen on Dashboard, not here
  if (user) {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route
        path="/auth"
        element={
          <PublicRoute>
            <Auth />
          </PublicRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/document/:id"
        element={
          <ProtectedRoute>
            <Editor />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route path="/trial" element={<Trial />} />
      <Route path="/style-guide" element={<StyleGuide />} />

    </Routes>
  )
}

export default App
