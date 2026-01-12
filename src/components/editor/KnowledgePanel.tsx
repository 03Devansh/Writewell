import { useState } from 'react'
import { useMutation, useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import type { Id } from '../../../convex/_generated/dataModel'
import { 
  Plus, 
  BookOpen, 
  Trash2, 
  ChevronDown, 
  ChevronRight,
  X,
  Check
} from 'lucide-react'

interface KnowledgePanelProps {
  documentId: Id<"documents">
  token: string
}

interface KnowledgeItem {
  _id: Id<"knowledge">
  title: string
  content: string
  createdAt: number
}

function KnowledgeEntry({ 
  item, 
  onDelete 
}: { 
  item: KnowledgeItem
  onDelete: (id: Id<"knowledge">) => void 
}) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="bg-white rounded-lg shadow-soft border border-cream-300 overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-3 flex items-center justify-between text-left hover:bg-cream-50 transition-colors"
      >
        <div className="flex items-center gap-2 min-w-0">
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 text-charcoal-500 flex-shrink-0" />
          ) : (
            <ChevronRight className="w-4 h-4 text-charcoal-500 flex-shrink-0" />
          )}
          <span className="font-ui text-sm font-medium text-charcoal-900 truncate">
            {item.title}
          </span>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDelete(item._id)
          }}
          className="p-1 text-charcoal-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors flex-shrink-0"
          title="Delete"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </button>
      {isExpanded && (
        <div className="px-3 pb-3 pt-0">
          <p className="text-sm text-charcoal-600 font-body whitespace-pre-wrap pl-6">
            {item.content}
          </p>
        </div>
      )}
    </div>
  )
}

export default function KnowledgePanel({ documentId, token }: KnowledgePanelProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newContent, setNewContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const knowledge = useQuery(
    api.knowledge.list,
    { token, documentId }
  )

  const addKnowledge = useMutation(api.knowledge.add)
  const removeKnowledge = useMutation(api.knowledge.remove)

  const handleAdd = async () => {
    if (!newTitle.trim() || !newContent.trim()) return
    
    setIsSubmitting(true)
    try {
      await addKnowledge({
        token,
        documentId,
        title: newTitle.trim(),
        content: newContent.trim(),
      })
      setNewTitle('')
      setNewContent('')
      setIsAdding(false)
    } catch (error) {
      console.error('Failed to add knowledge:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: Id<"knowledge">) => {
    try {
      await removeKnowledge({ token, knowledgeId: id })
    } catch (error) {
      console.error('Failed to delete knowledge:', error)
    }
  }

  return (
    <div className="h-full flex flex-col bg-cream-50 border-r border-cream-300">
      {/* Header */}
      <div className="p-4 border-b border-cream-300">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-gold-700" />
            <h2 className="font-display text-sm font-semibold text-charcoal-900 uppercase tracking-wide">
              Knowledge
            </h2>
          </div>
          <button
            onClick={() => setIsAdding(true)}
            className="p-1.5 text-ink-900 hover:bg-cream-200 rounded-lg transition-colors"
            title="Add Knowledge"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <p className="text-xs text-charcoal-500 font-ui">
          Add references for AI context
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-3 space-y-2">
        {/* Add form */}
        {isAdding && (
          <div className="bg-white rounded-lg shadow-soft border border-gold-300 p-3 animate-slide-up">
            <div className="flex items-center justify-between mb-3">
              <span className="font-ui text-sm font-medium text-charcoal-900">
                Add Reference
              </span>
              <button
                onClick={() => {
                  setIsAdding(false)
                  setNewTitle('')
                  setNewContent('')
                }}
                className="p-1 text-charcoal-400 hover:text-charcoal-600 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Title (e.g., 'Research Paper 2024')"
              className="w-full px-3 py-2 text-sm border border-charcoal-200 rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent font-ui"
            />
            <textarea
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="Paste content, notes, or key information..."
              rows={4}
              className="w-full px-3 py-2 text-sm border border-charcoal-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent font-body"
            />
            <div className="flex justify-end gap-2 mt-3">
              <button
                onClick={() => {
                  setIsAdding(false)
                  setNewTitle('')
                  setNewContent('')
                }}
                className="px-3 py-1.5 text-sm font-ui text-charcoal-600 hover:bg-cream-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                disabled={isSubmitting || !newTitle.trim() || !newContent.trim()}
                className="px-3 py-1.5 text-sm font-ui bg-ink-900 text-cream-100 rounded-lg hover:bg-ink-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
              >
                {isSubmitting ? (
                  <div className="w-3.5 h-3.5 border-2 border-cream-100 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Check className="w-3.5 h-3.5" />
                )}
                <span>Add</span>
              </button>
            </div>
          </div>
        )}

        {/* Knowledge list */}
        {knowledge === undefined ? (
          <div className="space-y-2">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white rounded-lg p-3 animate-pulse">
                <div className="h-4 w-24 bg-cream-200 rounded" />
              </div>
            ))}
          </div>
        ) : knowledge.length === 0 && !isAdding ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-cream-200 rounded-xl flex items-center justify-center mx-auto mb-3">
              <BookOpen className="w-6 h-6 text-charcoal-400" />
            </div>
            <p className="text-sm text-charcoal-500 font-ui mb-3">
              No references yet
            </p>
            <button
              onClick={() => setIsAdding(true)}
              className="text-sm text-ink-900 font-ui font-medium hover:underline"
            >
              Add your first reference
            </button>
          </div>
        ) : (
          knowledge.map((item) => (
            <KnowledgeEntry
              key={item._id}
              item={item}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </div>
  )
}
