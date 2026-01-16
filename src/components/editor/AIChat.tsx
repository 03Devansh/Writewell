import { useState, useRef, useEffect } from 'react'
import { useAction, useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import type { Id } from '../../../convex/_generated/dataModel'
import { 
  Sparkles, 
  Send, 
  Copy, 
  Check, 
  Plus,
  User,
  Bot,
  X
} from 'lucide-react'

interface AIChatProps {
  documentId: Id<"documents">
  documentContent: string
  token: string
  contextItems?: ContextItem[]
  onContextItemsChange?: (items: ContextItem[]) => void
  aiInstructions?: string
}

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

interface ContextItem {
  id: string
  text: string
}

export default function AIChat({ documentId, documentContent, token, contextItems = [], onContextItemsChange, aiInstructions }: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const removeContext = (id: string) => {
    if (onContextItemsChange) {
      onContextItemsChange(contextItems.filter(item => item.id !== id))
    }
  }

  const getTruncatedText = (text: string): string => {
    const words = text.split(/\s+/)
    if (words.length <= 2) {
      return text.length > 30 ? text.substring(0, 30) + '...' : text
    }
    const firstTwo = words.slice(0, 2).join(' ')
    return firstTwo.length > 30 ? firstTwo.substring(0, 30) + '...' : firstTwo + '...'
  }

  const knowledge = useQuery(
    api.knowledge.list,
    { token, documentId }
  )

  const chat = useAction(api.ai.chat)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const knowledgeContext = (knowledge || []).map(k => ({
        title: k.title,
        content: k.content,
      }))

      const chatHistory = messages.map(m => ({
        role: m.role,
        content: m.content,
      }))

      const selectedContext = contextItems.map(item => item.text)

      const chatParams: {
        message: string
        documentContent: string
        knowledgeContext: Array<{ title: string; content: string }>
        chatHistory: Array<{ role: 'user' | 'assistant'; content: string }>
        selectedContext?: string[]
        aiInstructions?: string
      } = {
        message: userMessage.content,
        documentContent,
        knowledgeContext,
        chatHistory,
      }

      // Only include selectedContext if there are items
      if (selectedContext.length > 0) {
        chatParams.selectedContext = selectedContext
      }

      // Only include aiInstructions if provided
      if (aiInstructions && aiInstructions.trim().length > 0) {
        chatParams.aiInstructions = aiInstructions.trim()
      }

      const response = await chat(chatParams)

      // Handle response - check success field if available
      if (response && typeof response === 'object' && 'success' in response && !response.success) {
        // The action returned an error message in content
        const errorMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: response.content || 'Sorry, I encountered an error.',
        }
        setMessages(prev => [...prev, errorMsg])
      } else {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: response?.content || 'I couldn\'t generate a response.',
        }
        setMessages(prev => [...prev, assistantMessage])
      }
    } catch (error) {
      console.error('AI chat error:', error)
      let errorMessage = 'Sorry, I encountered an error.'
      
      // Provide more specific error messages
      if (error instanceof Error) {
        console.error('Error details:', error.message, error.stack)
        if (error.message.includes('API key') || error.message.includes('authentication')) {
          errorMessage = 'Please make sure your OpenAI API key is configured correctly.'
        } else if (error.message.includes('validation') || error.message.includes('Invalid')) {
          errorMessage = 'There was a validation error. Please try again.'
        } else {
          errorMessage = `Error: ${error.message}`
        }
      }
      
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: errorMessage,
      }
      setMessages(prev => [...prev, errorMsg])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const insertToDocument = (text: string) => {
    const insertFn = (window as unknown as { insertTextToEditor?: (text: string) => void }).insertTextToEditor
    if (insertFn) {
      insertFn(text)
    }
  }

  return (
    <div className="h-full flex flex-col bg-cream-50 border-l border-cream-300">
      {/* Header */}
      <div className="p-4 border-b border-cream-300">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-4 h-4 text-ink-700" />
          <h2 className="font-display text-sm font-semibold text-charcoal-900 uppercase tracking-wide">
            AI Assistant
          </h2>
        </div>
        <p className="text-xs text-charcoal-500 font-ui">
          Ask for help writing or editing
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-auto p-3 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-ink-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Sparkles className="w-6 h-6 text-ink-700" />
            </div>
            <p className="text-sm text-charcoal-600 font-body mb-2">
              How can I help you write?
            </p>
            <p className="text-xs text-charcoal-500 font-ui">
              I can see your document and references
            </p>
            
            {/* Suggestions */}
            <div className="mt-6 space-y-2">
              {[
                'Help me write an introduction',
                'Summarize the key points',
                'Suggest improvements',
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => {
                    setInput(suggestion)
                    inputRef.current?.focus()
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-charcoal-600 bg-white rounded-lg border border-cream-300 hover:border-ink-300 hover:bg-cream-50 transition-colors font-ui"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`
                  w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0
                  ${message.role === 'user' 
                    ? 'bg-ink-900 text-cream-100' 
                    : 'bg-gold-100 text-gold-700'}
                `}
              >
                {message.role === 'user' ? (
                  <User className="w-3.5 h-3.5" />
                ) : (
                  <Bot className="w-3.5 h-3.5" />
                )}
              </div>
              <div
                className={`
                  flex-1 rounded-xl p-3 max-w-[85%]
                  ${message.role === 'user'
                    ? 'bg-ink-900 text-cream-100 ml-auto'
                    : 'bg-white border border-cream-300 shadow-soft'}
                `}
              >
                <p className={`
                  text-sm font-body whitespace-pre-wrap
                  ${message.role === 'user' ? 'text-cream-100' : 'text-charcoal-800'}
                `}>
                  {message.content}
                </p>
                
                {/* Actions for assistant messages */}
                {message.role === 'assistant' && (
                  <div className="flex items-center gap-1 mt-2 pt-2 border-t border-cream-200">
                    <button
                      onClick={() => copyToClipboard(message.content, message.id)}
                      className="p-1.5 text-charcoal-400 hover:text-charcoal-600 hover:bg-cream-100 rounded transition-colors"
                      title="Copy to clipboard"
                    >
                      {copiedId === message.id ? (
                        <Check className="w-3.5 h-3.5 text-green-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <button
                      onClick={() => insertToDocument(message.content)}
                      className="p-1.5 text-charcoal-400 hover:text-ink-700 hover:bg-cream-100 rounded transition-colors flex items-center gap-1"
                      title="Insert into document"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span className="text-xs font-ui">Insert</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        
        {/* Loading indicator */}
        {isLoading && (
          <div className="flex gap-3">
            <div className="w-7 h-7 rounded-full bg-gold-100 text-gold-700 flex items-center justify-center flex-shrink-0">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <div className="bg-white border border-cream-300 shadow-soft rounded-xl p-3">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-charcoal-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-charcoal-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-charcoal-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span className="text-xs text-charcoal-500 font-ui">Thinking...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-cream-300">
        {/* Context cards */}
        {contextItems.length > 0 && (
          <div className="mb-2 flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-charcoal-200 scrollbar-track-transparent">
            {contextItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white border border-cream-300 rounded-lg flex-shrink-0 group"
              >
                <span className="text-xs text-charcoal-700 font-ui max-w-[120px] truncate">
                  {getTruncatedText(item.text)}
                </span>
                <button
                  onClick={() => removeContext(item.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 text-charcoal-400 hover:text-charcoal-600 hover:bg-cream-100 rounded"
                  title="Remove context"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
        
        <div className="flex items-end gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask AI for help..."
            rows={1}
            className="flex-1 px-3 py-2 text-sm text-white border border-charcoal-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-ink-400 focus:border-transparent font-body max-h-32"
            style={{ minHeight: '40px' }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="p-2.5 bg-ink-900 text-cream-100 rounded-lg hover:bg-ink-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-xs text-charcoal-400 font-ui mt-2 text-center">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  )
}
