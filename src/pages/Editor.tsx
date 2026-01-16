import { useState, useEffect, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { useAuth } from '../contexts/AuthContext'
import AccountDropdown from '../components/AccountDropdown'
import RichEditor from '../components/editor/RichEditor'
import KnowledgePanel from '../components/editor/KnowledgePanel'
import AIChat from '../components/editor/AIChat'
import ResizablePanel from '../components/ui/ResizablePanel'
import { 
  PenLine, 
  ArrowLeft, 
  Cloud, 
  CloudOff,
  BookOpen,
  Sparkles
} from 'lucide-react'
import type { Id } from '../../convex/_generated/dataModel'

function formatLastSaved(timestamp: number): string {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  
  if (diff < 60000) return 'Just now'
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
  
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export default function Editor() {
  const { id } = useParams<{ id: string }>()
  const { token, user } = useAuth()
  
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<number | null>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [showLeftSidebar, setShowLeftSidebar] = useState(true)
  const [showRightSidebar, setShowRightSidebar] = useState(true)
  const [isEditingTitle, setIsEditingTitle] = useState(false)

  const documentId = id as Id<"documents">

  const document = useQuery(
    api.documents.get,
    token && id ? { token, documentId } : 'skip'
  )

  const updateDocument = useMutation(api.documents.update)

  // Initialize from document
  useEffect(() => {
    if (document) {
      setTitle(document.title)
      setContent(document.content)
      setLastSaved(document.updatedAt)
    }
  }, [document])

  // Auto-save with debounce
  const save = useCallback(async () => {
    if (!token || !documentId || !hasUnsavedChanges) return

    setIsSaving(true)
    try {
      await updateDocument({
        token,
        documentId,
        title,
        content,
      })
      setLastSaved(Date.now())
      setHasUnsavedChanges(false)
    } catch (error) {
      console.error('Failed to save:', error)
    } finally {
      setIsSaving(false)
    }
  }, [token, documentId, title, content, updateDocument, hasUnsavedChanges])

  // Debounced auto-save
  useEffect(() => {
    if (!hasUnsavedChanges) return

    const timer = setTimeout(() => {
      save()
    }, 2000) // Save after 2 seconds of inactivity

    return () => clearTimeout(timer)
  }, [hasUnsavedChanges, save])

  // Handle content changes
  const handleContentChange = (newContent: string) => {
    setContent(newContent)
    setHasUnsavedChanges(true)
  }

  // Handle title changes
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
    setHasUnsavedChanges(true)
  }

  // Save on blur for title
  const handleTitleBlur = () => {
    setIsEditingTitle(false)
    if (hasUnsavedChanges) {
      save()
    }
  }

  // Keyboard shortcut for save
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault()
        save()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [save])

  // Warn before leaving with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault()
        e.returnValue = ''
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [hasUnsavedChanges])

  if (!document && document !== null) {
    return (
      <div className="min-h-screen bg-cream-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-ink-900 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-charcoal-600 font-body">Loading document...</p>
        </div>
      </div>
    )
  }

  if (document === null) {
    return (
      <div className="min-h-screen bg-cream-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-charcoal-600 font-body mb-4">Document not found</p>
          <Link to="/dashboard" className="btn-primary">
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-cream-100">
      {/* Header */}
      <header className="bg-white border-b border-cream-300 flex-shrink-0 z-30">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/dashboard"
              className="p-2 text-charcoal-600 hover:text-charcoal-900 hover:bg-cream-100 rounded-lg transition-colors"
              title="Back to Dashboard"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            
            <div className="flex items-center gap-2">
              <PenLine className="w-5 h-5 text-ink-900" />
              {isEditingTitle ? (
                <input
                  type="text"
                  value={title}
                  onChange={handleTitleChange}
                  onBlur={handleTitleBlur}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleTitleBlur()
                    }
                  }}
                  className="font-display text-lg font-semibold text-charcoal-900 bg-transparent border-b-2 border-ink-900 focus:outline-none px-1 min-w-[200px]"
                  autoFocus
                />
              ) : (
                <button
                  onClick={() => setIsEditingTitle(true)}
                  className="font-display text-lg font-semibold text-charcoal-900 hover:text-ink-900 transition-colors"
                  title="Click to edit title"
                >
                  {title}
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Save status */}
            <div className="flex items-center gap-2 text-sm font-ui">
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-charcoal-400 border-t-transparent rounded-full animate-spin" />
                  <span className="text-charcoal-500">Saving...</span>
                </>
              ) : hasUnsavedChanges ? (
                <>
                  <CloudOff className="w-4 h-4 text-gold-600" />
                  <span className="text-gold-600">Unsaved</span>
                </>
              ) : (
                <>
                  <Cloud className="w-4 h-4 text-green-600" />
                  <span className="text-charcoal-500">
                    Saved {lastSaved ? formatLastSaved(lastSaved) : ''}
                  </span>
                </>
              )}
            </div>

            {/* Toggle sidebars */}
            <div className="flex items-center gap-1 border-l border-cream-300 pl-4">
              <button
                onClick={() => setShowLeftSidebar(!showLeftSidebar)}
                className={`
                  p-2 rounded-lg transition-colors
                  ${showLeftSidebar 
                    ? 'bg-gold-100 text-gold-700' 
                    : 'text-charcoal-500 hover:bg-cream-100'}
                `}
                title="Toggle Knowledge Panel"
              >
                <BookOpen className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowRightSidebar(!showRightSidebar)}
                className={`
                  p-2 rounded-lg transition-colors
                  ${showRightSidebar 
                    ? 'bg-ink-100 text-ink-700' 
                    : 'text-charcoal-500 hover:bg-cream-100'}
                `}
                title="Toggle AI Chat"
              >
                <Sparkles className="w-4 h-4" />
              </button>
            </div>

            {/* Account dropdown */}
            <div className="border-l border-cream-300 pl-4">
              <AccountDropdown />
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left sidebar - Knowledge */}
        {showLeftSidebar && token && (
          <ResizablePanel
            defaultWidth={288}
            minWidth={200}
            maxWidth={600}
            side="left"
            storageKey="inkwell-knowledge-panel-width"
          >
            <div className="h-full overflow-hidden animate-slide-in-left">
              <KnowledgePanel documentId={documentId} token={token} />
            </div>
          </ResizablePanel>
        )}

        {/* Center - Editor */}
        <div className="flex-1 overflow-hidden p-4">
          <div className="h-full card overflow-hidden">
            <RichEditor
              content={content}
              onChange={handleContentChange}
              placeholder="Start writing your document..."
              title={title}
            />
          </div>
        </div>

        {/* Right sidebar - AI Chat */}
        {showRightSidebar && token && (
          <ResizablePanel
            defaultWidth={320}
            minWidth={250}
            maxWidth={600}
            side="right"
            storageKey="inkwell-ai-chat-panel-width"
          >
            <div className="h-full overflow-hidden animate-slide-in-right">
              <AIChat
                documentId={documentId}
                documentContent={content}
                token={token}
                aiInstructions={document?.aiInstructions ?? user?.aiGlobalInstructions ?? undefined}
              />
            </div>
          </ResizablePanel>
        )}
      </div>
    </div>
  )
}
