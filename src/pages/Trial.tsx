import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { PenLine, Check, Sparkles } from 'lucide-react'

const CHECKOUT_LINK =
  'https://buy.polar.sh/polar_cl_LQD0qXROhgxYVq2pGE1B9h25cG15SiJHtgc6L0PcJ73'

export default function Trial() {
  const [isLoading, setIsLoading] = useState(false)
  const [isCheckingSubscription, setIsCheckingSubscription] = useState(false)
  const { signOut, token } = useAuth()
  const navigate = useNavigate()
  const checkoutWindowRef = useRef<Window | null>(null)
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Check subscription status
  const subscriptionStatus = useQuery(
    api.auth.getSubscriptionStatus,
    token ? { token } : 'skip'
  )

  // Poll for subscription status after checkout
  useEffect(() => {
    if (isCheckingSubscription && subscriptionStatus !== undefined) {
      if (subscriptionStatus.hasActiveSubscription) {
        // Subscription is active! Redirect to dashboard
        console.log('Subscription detected! Redirecting to dashboard...')
        setIsCheckingSubscription(false)
        if (pollIntervalRef.current) {
          clearInterval(pollIntervalRef.current)
          pollIntervalRef.current = null
        }
        navigate('/dashboard', { replace: true })
      }
    }
  }, [subscriptionStatus, isCheckingSubscription, navigate])

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current)
      }
    }
  }, [])

  // Listen for window focus to check subscription status
  useEffect(() => {
    const handleFocus = () => {
      if (checkoutWindowRef.current?.closed && isCheckingSubscription) {
        // Checkout window was closed, start polling
        console.log('Checkout window closed, checking subscription status...')
        // The subscriptionStatus query will automatically refetch
      }
    }

    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [isCheckingSubscription])

  const handleStartTrial = () => {
    try {
      setIsLoading(true)
      const checkoutWindow = window.open(CHECKOUT_LINK, '_blank', 'noopener,noreferrer')
      checkoutWindowRef.current = checkoutWindow
      
      // Start checking for subscription after a short delay
      setIsCheckingSubscription(true)
      
      // Poll every 2 seconds for up to 2 minutes
      let pollCount = 0
      const maxPolls = 60 // 2 minutes at 2 second intervals
      
      pollIntervalRef.current = setInterval(() => {
        pollCount++
        if (pollCount >= maxPolls) {
          // Stop polling after max time
          if (pollIntervalRef.current) {
            clearInterval(pollIntervalRef.current)
            pollIntervalRef.current = null
          }
          setIsCheckingSubscription(false)
          console.log('Stopped polling for subscription status')
        }
        // The subscriptionStatus query will automatically refetch due to Convex reactivity
      }, 2000)
      
      setTimeout(() => setIsLoading(false), 500)
    } catch {
      setIsLoading(false)
      setIsCheckingSubscription(false)
    }
  }

  const handleLogout = async () => {
    await signOut()
    navigate('/auth')
  }

  const benefits = [
    'Unlimited AI-powered writing assistance',
    'Advanced knowledge base integration',
    'Priority support and updates',
    'Export to multiple formats',
    'Collaborative editing features',
  ]

  return (
    <div className="min-h-screen bg-cream-100 flex flex-col">
      {/* Header */}
      <header className="p-6">
        <Link to="/" className="flex items-center gap-2 w-fit">
          <PenLine className="w-6 h-6 text-ink-900" />
          <span className="font-display text-xl font-semibold text-ink-900">
            Inkwell
          </span>
        </Link>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-4 pb-16">
        <div className="w-full max-w-2xl animate-fade-in">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gold-100 rounded-2xl mb-6">
              <Sparkles className="w-8 h-8 text-gold-700" />
            </div>
            <h1 className="font-display text-4xl font-bold text-charcoal-900 mb-4">
              Start Your Free Trial
            </h1>
            <p className="font-body text-lg text-charcoal-600 max-w-md mx-auto">
              Unlock the full power of Inkwell with AI-assisted writing, knowledge
              management, and more.
            </p>
          </div>

          <div className="card p-8 md:p-12">
            {/* Checking subscription message */}
            {isCheckingSubscription && (
              <div className="mb-6 p-4 bg-gold-50 border border-gold-200 rounded-lg">
                <p className="font-body text-sm text-charcoal-700 text-center">
                  <span className="inline-block w-4 h-4 border-2 border-gold-700 border-t-transparent rounded-full animate-spin mr-2" />
                  Waiting for subscription confirmation... If you've completed checkout, we'll redirect you shortly.
                </p>
              </div>
            )}

            {/* Pricing */}
            <div className="text-center mb-10">
              <div className="inline-flex items-baseline gap-2 mb-2">
                <span className="font-display text-5xl font-bold text-charcoal-900">
                  $5
                </span>
                <span className="font-body text-xl text-charcoal-600">
                  /month
                </span>
              </div>
              <p className="font-body text-sm text-charcoal-500">
                Cancel anytime. No hidden fees.
              </p>
            </div>

            {/* Benefits */}
            <div className="space-y-4 mb-10">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-gold-100 rounded-full flex items-center justify-center mt-0.5">
                    <Check className="w-4 h-4 text-gold-700" />
                  </div>
                  <p className="font-body text-charcoal-700 flex-1">
                    {benefit}
                  </p>
                </div>
              ))}
            </div>

            {/* CTA */}
            <button
              onClick={handleStartTrial}
              disabled={isLoading || isCheckingSubscription}
              className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 py-4 text-lg"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-cream-100 border-t-transparent rounded-full animate-spin" />
                  <span>Opening checkout…</span>
                </>
              ) : isCheckingSubscription ? (
                <>
                  <div className="w-5 h-5 border-2 border-cream-100 border-t-transparent rounded-full animate-spin" />
                  <span>Checking subscription…</span>
                </>
              ) : (
                <span>Start Free Trial</span>
              )}
            </button>

            <p className="text-center mt-6 text-sm font-body text-charcoal-500">
              Secure payment powered by Polar
            </p>

            {/* Logout link */}
            <div className="text-center mt-6 pt-6 border-t border-cream-300">
              <button
                onClick={handleLogout}
                className="text-sm font-body text-charcoal-500 hover:text-charcoal-700 transition-colors underline"
              >
                Logged in with a wrong account? → Log out
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
