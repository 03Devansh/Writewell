import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { PenLine, Eye, EyeOff } from 'lucide-react'

export default function Auth() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const { signIn, signUp, token } = useAuth()
  
  // Check subscription status after signin (not signup)
  const subscriptionStatus = useQuery(
    api.auth.getSubscriptionStatus,
    token ? { token } : 'skip'
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      if (isSignUp) {
        if (!name.trim()) {
          throw new Error('Please enter your name')
        }
        await signUp(email, password, name)
        // New users always go to trial page
        navigate('/trial', { replace: true })
      } else {
        await signIn(email, password)
        // Redirect will be handled by useEffect based on subscription status
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setIsLoading(false)
    }
  }

  // Redirect after successful signin based on subscription
  useEffect(() => {
    // Only redirect after signin when we have subscription status
    // Skip this for signup since we handle that in handleSubmit
    // Backend always returns an object, never null
    if (token && subscriptionStatus !== undefined && !isLoading) {
      if (subscriptionStatus.hasActiveSubscription) {
        navigate('/dashboard', { replace: true })
      } else {
        navigate('/trial', { replace: true })
      }
    }
  }, [token, subscriptionStatus, navigate, isLoading])

  return (
    <div className="min-h-screen bg-cream-100 flex flex-col">
      {/* Header */}
      <header className="p-6">
        <Link to="/" className="flex items-center gap-2 w-fit">
          <PenLine className="w-6 h-6 text-ink-900" />
          <span className="font-display text-xl font-semibold text-ink-900">Writewell</span>
        </Link>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center px-4 pb-16">
        <div className="w-full max-w-md animate-fade-in">
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl font-semibold text-charcoal-900 mb-2">
              {isSignUp ? 'Create your account' : 'Welcome back'}
            </h1>
            <p className="text-charcoal-600 font-body">
              {isSignUp
                ? 'Start writing with AI assistance'
                : 'Continue your writing journey'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="card p-8">
            {error && (
              <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm font-ui">
                {error}
              </div>
            )}

            <div className="space-y-5">
              {isSignUp && (
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-ui font-medium text-charcoal-700 mb-2"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input-field"
                    placeholder="Jane Doe"
                    required={isSignUp}
                  />
                </div>
              )}

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-ui font-medium text-charcoal-700 mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-ui font-medium text-charcoal-700 mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field pr-10"
                    placeholder="••••••••"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-400 hover:text-charcoal-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary mt-8 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-cream-100 border-t-transparent rounded-full animate-spin" />
                  <span>{isSignUp ? 'Creating account...' : 'Signing in...'}</span>
                </>
              ) : (
                <span>{isSignUp ? 'Create account' : 'Sign in'}</span>
              )}
            </button>
          </form>

          <p className="text-center mt-6 text-charcoal-600 font-ui text-sm">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              onClick={() => {
                setIsSignUp(!isSignUp)
                setError('')
              }}
              className="text-ink-900 font-medium hover:underline"
            >
              {isSignUp ? 'Sign in' : 'Sign up'}
            </button>
          </p>
        </div>
      </main>
    </div>
  )
}
