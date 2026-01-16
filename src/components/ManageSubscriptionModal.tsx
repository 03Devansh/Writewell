import { useState } from 'react'
import { useAction } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { useAuth } from '../contexts/AuthContext'
import { X, CreditCard } from 'lucide-react'

interface ManageSubscriptionModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ManageSubscriptionModal({ isOpen, onClose }: ManageSubscriptionModalProps) {
  const { token, user } = useAuth()
  const [isLoadingPortal, setIsLoadingPortal] = useState(false)
  const [portalError, setPortalError] = useState<string | null>(null)
  const getCustomerPortalUrl = useAction(api.polar.getCustomerPortalUrl)

  const handleManageSubscription = async () => {
    if (!token) return

    setPortalError(null)
    setIsLoadingPortal(true)

    try {
      const result = await getCustomerPortalUrl({ token })
      if (result.url) {
        window.open(result.url, '_blank', 'noopener,noreferrer')
        onClose()
      } else {
        setPortalError(result.error || 'No subscription found. Please subscribe to manage your subscription.')
      }
    } catch (err) {
      console.error('Error fetching portal URL:', err)
      setPortalError(err instanceof Error ? err.message : 'Failed to open subscription management. Please try again later.')
    } finally {
      setIsLoadingPortal(false)
    }
  }

  const getSubscriptionStatusDisplay = () => {
    if (!user?.hasActiveSubscription) {
      return 'Free / Unpaid'
    }
    if (user.subscriptionStatus) {
      return user.subscriptionStatus.charAt(0).toUpperCase() + user.subscriptionStatus.slice(1)
    }
    return 'Active'
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/20 z-50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div 
          className="bg-white rounded-xl shadow-soft-lg border border-cream-300 max-w-md w-full p-6 animate-fade-in"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-2xl font-semibold text-charcoal-900">
              Manage Subscription
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-charcoal-400 hover:text-charcoal-600 hover:bg-cream-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="space-y-4">
            {/* Subscription Status */}
            <div>
              <label className="block font-ui text-sm font-medium text-charcoal-700 mb-2">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  Subscription Status
                </div>
              </label>
              <p className="text-charcoal-900 font-ui">{getSubscriptionStatusDisplay()}</p>
            </div>

            {/* Error message */}
            {portalError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm font-ui text-red-600">{portalError}</p>
              </div>
            )}

            {/* Manage Subscription Button */}
            <div className="pt-4 border-t border-cream-300">
              <button
                type="button"
                onClick={handleManageSubscription}
                disabled={isLoadingPortal}
                className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoadingPortal ? (
                  <>
                    <div className="w-4 h-4 border-2 border-cream-100 border-t-transparent rounded-full animate-spin" />
                    <span>Loading...</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" />
                    <span>Open Subscription Portal</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
