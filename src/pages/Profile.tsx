import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { useAuth } from '../contexts/AuthContext'
import { PenLine, ArrowLeft, User, Mail, Save } from 'lucide-react'

export default function Profile() {
  const { user, token } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [aiGlobalInstructions, setAiGlobalInstructions] = useState('')
  const [isSavingInstructions, setIsSavingInstructions] = useState(false)
  const [instructionsSuccess, setInstructionsSuccess] = useState(false)

  const updateProfile = useMutation(api.auth.updateProfile)
  const updateGlobalInstructions = useMutation(api.auth.updateGlobalInstructions)

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      setName(user.name)
      setEmail(user.email)
      setAiGlobalInstructions(user.aiGlobalInstructions || '')
    }
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) return

    setError(null)
    setSuccess(false)
    setIsSaving(true)

    try {
      await updateProfile({
        token,
        name: name.trim(),
        email: email.trim(),
      })
      setSuccess(true)
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile')
    } finally {
      setIsSaving(false)
    }
  }

  const handleSaveInstructions = async () => {
    if (!token) return

    setInstructionsSuccess(false)
    setIsSavingInstructions(true)

    try {
      await updateGlobalInstructions({
        token,
        aiGlobalInstructions: aiGlobalInstructions.trim() || undefined,
      })
      setInstructionsSuccess(true)
      setTimeout(() => setInstructionsSuccess(false), 3000)
    } catch (err) {
      console.error('Failed to save instructions:', err)
    } finally {
      setIsSavingInstructions(false)
    }
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-cream-100">
      {/* Header */}
      <header className="bg-white border-b border-cream-300 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2">
            <PenLine className="w-6 h-6 text-ink-900" />
            <span className="font-display text-xl font-semibold text-ink-900">Writewell</span>
          </Link>
          <Link
            to="/dashboard"
            className="p-2 text-charcoal-600 hover:text-charcoal-900 hover:bg-cream-100 rounded-lg transition-colors"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-charcoal-900 mb-2">
            Profile Settings
          </h1>
          <p className="font-body text-charcoal-600">
            Manage your account information and preferences
          </p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name field */}
            <div>
              <label
                htmlFor="name"
                className="block font-ui text-sm font-medium text-charcoal-700 mb-2"
              >
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Name
                </div>
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field"
                placeholder="Your name"
                required
              />
            </div>

            {/* Email field */}
            <div>
              <label
                htmlFor="email"
                className="block font-ui text-sm font-medium text-charcoal-700 mb-2"
              >
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </div>
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="your.email@example.com"
                required
              />
            </div>

            {/* Error message */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm font-ui text-red-600">{error}</p>
              </div>
            )}

            {/* Success message */}
            {success && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm font-ui text-green-600">
                  Profile updated successfully!
                </p>
              </div>
            )}

            {/* Submit button */}
            <div className="flex items-center gap-4 pt-4">
              <button
                type="submit"
                disabled={isSaving}
                className="btn-primary flex items-center gap-2 disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-cream-100 border-t-transparent rounded-full animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
              <Link
                to="/dashboard"
                className="btn-ghost"
              >
                Cancel
              </Link>
            </div>

            {/* AI Writing Instructions section */}
            <div className="pt-6 border-t border-cream-300">
              <label
                htmlFor="aiGlobalInstructions"
                className="block font-ui text-sm font-medium text-charcoal-700 mb-2"
              >
                AI Writing Instructions
              </label>
              <p className="text-xs text-charcoal-500 font-ui mb-3">
                Tell the AI how you want it to write across all documents.
              </p>
              <textarea
                id="aiGlobalInstructions"
                value={aiGlobalInstructions}
                onChange={(e) => setAiGlobalInstructions(e.target.value)}
                rows={4}
                className="input-field resize-none"
                placeholder="Write in an academic, formal tone. Be concise and structured."
              />
              <div className="flex items-center gap-3 mt-3">
                <button
                  type="button"
                  onClick={handleSaveInstructions}
                  disabled={isSavingInstructions}
                  className="btn-primary flex items-center gap-2 disabled:opacity-50"
                >
                  {isSavingInstructions ? (
                    <>
                      <div className="w-4 h-4 border-2 border-cream-100 border-t-transparent rounded-full animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save Instructions</span>
                    </>
                  )}
                </button>
                {instructionsSuccess && (
                  <span className="text-sm font-ui text-green-600">
                    Instructions saved!
                  </span>
                )}
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
