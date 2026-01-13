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
  Bot
} from 'lucide-react'

interface AIChatProps {
  documentId: Id<"documents">
  documentContent: string
  token: string
}

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

export default function AIChat({ documentId, documentContent, token }: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

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

      const response = await chat({
        message: userMessage.content,
        documentContent,
        knowledgeContext,
        chatHistory,
      })

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.content,
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('AI chat error:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please make sure your OpenAI API key is configured correctly.',
      }
      setMessages(prev => [...prev, errorMessage])
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
