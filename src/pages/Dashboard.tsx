import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { useAuth } from '../contexts/AuthContext'
import AccountDropdown from '../components/AccountDropdown'
import { 
  PenLine, 
  Plus, 
  FileText, 
  Clock, 
  Trash2,
  MoreVertical
} from 'lucide-react'
import type { Id } from '../../convex/_generated/dataModel'

const PAYMENT_PENDING_KEY = 'writewell_payment_pending'
const PAYMENT_PENDING_TIMEOUT = 5 * 60 * 1000 // 5 minutes
const EARLY_ACCESS_KEY = 'writewell_early_access_granted'
const EARLY_ACCESS_TIMEOUT = 2.1 * 60 * 1000 // 2.1 minutes

function formatDate(timestamp: number): string {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  })
}

function getPreview(content: string): string {
  // Strip HTML tags and get first 100 characters
  const text = content.replace(/<[^>]*>/g, '').trim()
  if (text.length <= 100) return text || 'No content yet'
  return text.substring(0, 100) + '...'
}

function DocumentCard({ 
  document, 
  onDelete 
}: { 
  document: {
    _id: Id<"documents">
    title: string
    content: string
    updatedAt: number
    createdAt: number
  }
  onDelete: (id: Id<"documents">) => void
}) {
  const [showMenu, setShowMenu] = useState(false)
  
  return (
    <Link
      to={`/document/${document._id}`}
      className="card p-6 block group relative hover:scale-[1.02] transition-all duration-200"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-cream-200 rounded-lg flex items-center justify-center group-hover:bg-gold-100 transition-colors">
            <FileText className="w-5 h-5 text-charcoal-600 group-hover:text-gold-700 transition-colors" />
          </div>
          <div>
            <h3 className="font-display text-lg font-semibold text-charcoal-900 group-hover:text-ink-900 transition-colors">
              {document.title}
            </h3>
            <div className="flex items-center gap-1 text-sm text-charcoal-500 font-ui">
              <Clock className="w-3.5 h-3.5" />
              <span>{formatDate(document.updatedAt)}</span>
            </div>
          </div>
        </div>
        <div className="relative">
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setShowMenu(!showMenu)
            }}
            className="p-1.5 rounded-lg text-charcoal-400 hover:text-charcoal-600 hover:bg-cream-200 transition-colors"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
          {showMenu && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setShowMenu(false)
                }}
              />
              <div className="absolute right-0 top-full mt-1 z-20 bg-white rounded-lg shadow-soft-lg border border-cream-300 py-1 min-w-[120px]">
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    onDelete(document._id)
                    setShowMenu(false)
                  }}
                  className="w-full px-3 py-2 text-left text-sm font-ui text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      <p className="font-body text-sm text-charcoal-600 line-clamp-2">
        {getPreview(document.content)}
      </p>
    </Link>
  )
}

export default function Dashboard() {
  const { token } = useAuth()
  const navigate = useNavigate()
  const [isCreating, setIsCreating] = useState(false)
  const earlyAccessCheckIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Check subscription status - ONLY on Dashboard route
  const subscriptionStatus = useQuery(
    api.auth.getSubscriptionStatus,
    token ? { token } : 'skip'
  )

  // Continuously check if early access has expired (poll every 5 seconds)
  useEffect(() => {
    const checkEarlyAccess = () => {
      const earlyAccess = localStorage.getItem(EARLY_ACCESS_KEY)
      if (earlyAccess) {
        const earlyAccessTimestamp = parseInt(earlyAccess, 10)
        if (Date.now() - earlyAccessTimestamp > EARLY_ACCESS_TIMEOUT) {
          // Early access expired, clear both flags and redirect to trial
          localStorage.removeItem(EARLY_ACCESS_KEY)
          localStorage.removeItem(PAYMENT_PENDING_KEY)
          navigate('/trial', { replace: true })
        }
      }
    }

    // Check immediately
    checkEarlyAccess()

    // Then check every 5 seconds
    earlyAccessCheckIntervalRef.current = setInterval(checkEarlyAccess, 5000)

    return () => {
      if (earlyAccessCheckIntervalRef.current) {
        clearInterval(earlyAccessCheckIntervalRef.current)
        earlyAccessCheckIntervalRef.current = null
      }
    }
  }, [navigate])

  // Redirect unpaid users to trial (not stuck on loader)
  // BUT: Don't redirect if payment is pending or early access is granted
  useEffect(() => {
    // Handle three states: undefined (loading), or object (resolved - always returns object, never null)
    if (subscriptionStatus !== undefined) {
      // Status is resolved, check if user has active subscription
      if (!subscriptionStatus.hasActiveSubscription) {
        // Check for early access flag first
        const earlyAccess = localStorage.getItem(EARLY_ACCESS_KEY)
        if (earlyAccess) {
          // Check if early access has expired (older than 2.1 minutes)
          const earlyAccessTimestamp = parseInt(earlyAccess, 10)
          if (Date.now() - earlyAccessTimestamp <= EARLY_ACCESS_TIMEOUT) {
            // Early access is valid, allow access
            // Continue checking subscription status in background
            return
          } else {
            // Early access expired, clear both flags and redirect to trial
            localStorage.removeItem(EARLY_ACCESS_KEY)
            localStorage.removeItem(PAYMENT_PENDING_KEY)
            navigate('/trial', { replace: true })
            return
          }
        }

        // Check if payment is pending - if so, redirect to payment-confirming instead
        const paymentPending = localStorage.getItem(PAYMENT_PENDING_KEY)
        if (paymentPending) {
          // Check if payment pending has expired (older than 5 minutes)
          const pendingTimestamp = parseInt(paymentPending, 10)
          if (Date.now() - pendingTimestamp <= PAYMENT_PENDING_TIMEOUT) {
            // Payment still pending, go to confirmation page
            navigate('/payment-confirming', { replace: true })
            return
          } else {
            // Payment pending expired, clear it
            localStorage.removeItem(PAYMENT_PENDING_KEY)
          }
        }
        // No pending payment or early access, redirect to trial
        navigate('/trial', { replace: true })
      } else {
        // Subscription is active, clear any stale payment pending and early access flags
        localStorage.removeItem(PAYMENT_PENDING_KEY)
        localStorage.removeItem(EARLY_ACCESS_KEY)
      }
    }
  }, [subscriptionStatus, navigate])

  const documents = useQuery(
    api.documents.list,
    token ? { token } : 'skip'
  )

  const createDocument = useMutation(api.documents.create)
  const deleteDocument = useMutation(api.documents.remove)

  const handleCreateDocument = async () => {
    if (!token) return
    setIsCreating(true)
    try {
      const docId = await createDocument({ token })
      navigate(`/document/${docId}`)
    } catch (error) {
      console.error('Failed to create document:', error)
    } finally {
      setIsCreating(false)
    }
  }

  const handleDeleteDocument = async (id: Id<"documents">) => {
    if (!token) return
    if (!confirm('Are you sure you want to delete this document?')) return
    try {
      await deleteDocument({ token, documentId: id })
    } catch (error) {
      console.error('Failed to delete document:', error)
    }
  }

  // Show loading state while subscription status is being checked
  // This is the ONLY place subscription loading is shown
  if (subscriptionStatus === undefined) {
    return (
      <div className="min-h-screen bg-cream-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-ink-900 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-charcoal-600 font-body">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream-100">
      {/* Header */}
      <header className="bg-white border-b border-cream-300 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <PenLine className="w-6 h-6 text-ink-900" />
            <span className="font-display text-xl font-semibold text-ink-900">Writewell</span>
          </Link>
          <AccountDropdown />
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-charcoal-900 mb-1">
              Your Documents
            </h1>
            <p className="font-body text-charcoal-600">
              Create, edit, and manage your writing projects
            </p>
          </div>
          <button
            onClick={handleCreateDocument}
            disabled={isCreating}
            className="btn-primary flex items-center gap-2 disabled:opacity-50"
          >
            {isCreating ? (
              <>
                <div className="w-4 h-4 border-2 border-cream-100 border-t-transparent rounded-full animate-spin" />
                <span>Creating...</span>
              </>
            ) : (
              <>
                <Plus className="w-5 h-5" />
                <span>New Document</span>
              </>
            )}
          </button>
        </div>

        {/* Documents grid */}
        {documents === undefined ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card p-6 animate-pulse">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-cream-200 rounded-lg" />
                  <div>
                    <div className="h-5 w-32 bg-cream-200 rounded mb-2" />
                    <div className="h-3 w-20 bg-cream-200 rounded" />
                  </div>
                </div>
                <div className="h-4 w-full bg-cream-200 rounded mb-2" />
                <div className="h-4 w-2/3 bg-cream-200 rounded" />
              </div>
            ))}
          </div>
        ) : documents.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-cream-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <FileText className="w-10 h-10 text-charcoal-400" />
            </div>
            <h2 className="font-display text-2xl font-semibold text-charcoal-900 mb-2">
              No documents yet
            </h2>
            <p className="font-body text-charcoal-600 mb-6">
              Create your first document to start writing with AI assistance
            </p>
            <button
              onClick={handleCreateDocument}
              disabled={isCreating}
              className="btn-primary inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              <span>Create Document</span>
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {documents.map((doc) => (
              <DocumentCard
                key={doc._id}
                document={doc}
                onDelete={handleDeleteDocument}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
