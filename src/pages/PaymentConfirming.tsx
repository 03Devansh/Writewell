import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'

const PAYMENT_PENDING_KEY = 'writewell_payment_pending'
const PAYMENT_PENDING_TIMEOUT = 5 * 60 * 1000 // 5 minutes
const EARLY_ACCESS_KEY = 'writewell_early_access_granted'

export default function PaymentConfirming() {
  const { token } = useAuth()
  const navigate = useNavigate()
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const [showAdditionalMessage, setShowAdditionalMessage] = useState(false)
  const [showEarlyAccessButton, setShowEarlyAccessButton] = useState(false)

  // Check if we should be on this page (payment pending)
  useEffect(() => {
    const paymentPending = localStorage.getItem(PAYMENT_PENDING_KEY)
    if (!paymentPending) {
      // No pending payment, redirect to trial
      navigate('/trial', { replace: true })
      return
    }
    
    // Check if payment pending has expired (older than 5 minutes)
    const pendingTimestamp = parseInt(paymentPending, 10)
    if (Date.now() - pendingTimestamp > PAYMENT_PENDING_TIMEOUT) {
      localStorage.removeItem(PAYMENT_PENDING_KEY)
      navigate('/trial', { replace: true })
      return
    }
  }, [navigate])

  // Check subscription status
  const subscriptionStatus = useQuery(
    api.auth.getSubscriptionStatus,
    token ? { token } : 'skip'
  )

  // Redirect immediately when subscription is confirmed (interruption-safe)
  useEffect(() => {
    if (subscriptionStatus !== undefined && subscriptionStatus.hasActiveSubscription) {
      // Clear payment pending flag and early access flag
      localStorage.removeItem(PAYMENT_PENDING_KEY)
      localStorage.removeItem(EARLY_ACCESS_KEY)
      
      // Clean up polling if active
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current)
        pollIntervalRef.current = null
      }
      // Redirect immediately - don't wait for animation
      navigate('/dashboard', { replace: true })
    }
  }, [subscriptionStatus, navigate])

  // Show additional message after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAdditionalMessage(true)
    }, 5000)

    return () => clearTimeout(timer)
  }, [])

  // Show early access button after 5-8 seconds
  useEffect(() => {
    // Random delay between 5-8 seconds
    const delay = 5000 + Math.random() * 3000
    const timer = setTimeout(() => {
      setShowEarlyAccessButton(true)
    }, delay)

    return () => clearTimeout(timer)
  }, [])

  // Handle early access button click
  const handleEarlyAccess = () => {
    // Set early access flag with timestamp
    localStorage.setItem(EARLY_ACCESS_KEY, Date.now().toString())
    // Navigate to dashboard immediately
    navigate('/dashboard', { replace: true })
    // Note: Polling continues in background, will clear flag when subscription confirmed
  }

  // Set up polling to check subscription status every 2 seconds
  // This ensures we catch the subscription even if the reactive query is slow
  useEffect(() => {
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
        console.log('Stopped polling for subscription status')
        
        // Clear payment pending flag
        localStorage.removeItem(PAYMENT_PENDING_KEY)
        
        // Redirect back to trial if payment wasn't confirmed
        navigate('/trial', { replace: true })
      }
      // The subscriptionStatus query will automatically refetch due to Convex reactivity
    }, 2000)

    // Cleanup on unmount
    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current)
        pollIntervalRef.current = null
      }
    }
  }, [navigate])

  return (
    <div className="min-h-screen bg-cream-100 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* Animated dots - subtle looping animation */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div 
            className="w-3 h-3 bg-ink-900 rounded-full animate-bounce" 
            style={{ animationDelay: '0ms', animationDuration: '1.4s' }} 
          />
          <div 
            className="w-3 h-3 bg-ink-900 rounded-full animate-bounce" 
            style={{ animationDelay: '200ms', animationDuration: '1.4s' }} 
          />
          <div 
            className="w-3 h-3 bg-ink-900 rounded-full animate-bounce" 
            style={{ animationDelay: '400ms', animationDuration: '1.4s' }} 
          />
        </div>

        {/* Title */}
        <h1 className="font-display text-3xl font-semibold text-charcoal-900 mb-3">
          Activating your account
        </h1>

        {/* Subtitle */}
        <p className="font-body text-lg text-charcoal-600 mb-4">
          Please wait while we confirm your payment.
        </p>

        {/* Additional message after 5 seconds */}
        {showAdditionalMessage && (
          <p className="font-body text-sm text-charcoal-500 mb-4">
            Since we are using external services for this app, this might take about 20-30s
          </p>
        )}

        {/* Early access button after 5-8 seconds */}
        {showEarlyAccessButton && (
          <button
            onClick={handleEarlyAccess}
            className="btn-primary mt-6"
          >
            Start using the app while we finish checking
          </button>
        )}
      </div>
    </div>
  )
}
