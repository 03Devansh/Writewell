import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Underline from '@tiptap/extension-underline'
import { useEffect, useCallback, useState, useRef } from 'react'
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  Undo,
  Redo,
  Plus,
  Download,
  ChevronDown,
} from 'lucide-react'
import { exportToDocx, exportToPdf } from '../../utils/exportUtils'

interface RichEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
  onAddContext?: (text: string) => void
  title?: string
}

interface ToolbarButtonProps {
  onClick: () => void
  isActive?: boolean
  disabled?: boolean
  children: React.ReactNode
  title: string
}

function ToolbarButton({ onClick, isActive, disabled, children, title }: ToolbarButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`
        p-2 rounded-lg transition-colors
        ${isActive 
          ? 'bg-ink-900 text-cream-100' 
          : 'text-charcoal-600 hover:bg-cream-200 hover:text-charcoal-900'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      {children}
    </button>
  )
}

function ToolbarDivider() {
  return <div className="w-px h-6 bg-charcoal-200 mx-1" />
}

export default function RichEditor({ content, onChange, placeholder, onAddContext, title }: RichEditorProps) {
  const [showAddButton, setShowAddButton] = useState(false)
  const [buttonPosition, setButtonPosition] = useState({ top: 0, left: 0 })
  const [selectedText, setSelectedText] = useState('')
  const [showExportMenu, setShowExportMenu] = useState(false)
  const editorRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const exportMenuRef = useRef<HTMLDivElement>(null)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Placeholder.configure({
        placeholder: placeholder || 'Start writing your document...',
      }),
      Underline,
    ],
    content,
    editorProps: {
      attributes: {
        class: 'tiptap prose prose-lg max-w-none focus:outline-none',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    onSelectionUpdate: ({ editor }) => {
      const { from, to } = editor.state.selection
      const isEmpty = from === to
      
      if (isEmpty) {
        setShowAddButton(false)
        return
      }

      // Get selected text (plain text, no HTML)
      const text = editor.state.doc.textBetween(from, to, ' ')
      if (text.trim().length === 0) {
        setShowAddButton(false)
        return
      }

      setSelectedText(text.trim())
      
      // Get selection coordinates
      try {
        const { $from } = editor.state.selection
        const coords = editor.view.coordsAtPos($from.pos)
        
        if (editorRef.current) {
          const editorRect = editorRef.current.getBoundingClientRect()
          const scrollTop = editorRef.current.scrollTop
          
          // Position button near the selection, offset to the right
          setButtonPosition({
            top: coords.top - editorRect.top + scrollTop + 5,
            left: coords.right - editorRect.left + 10,
          })
          setShowAddButton(true)
        }
      } catch (error) {
        // If we can't get coordinates, hide the button
        setShowAddButton(false)
      }
    },
  })

  // Update editor content when prop changes (e.g., from AI insertion)
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content)
    }
  }, [content, editor])

  const insertText = useCallback((text: string) => {
    if (editor) {
      editor.chain().focus().insertContent(text).run()
    }
  }, [editor])

  // Expose insertText method
  useEffect(() => {
    if (editor) {
      (window as unknown as { insertTextToEditor?: (text: string) => void }).insertTextToEditor = insertText
    }
    return () => {
      delete (window as unknown as { insertTextToEditor?: (text: string) => void }).insertTextToEditor
    }
  }, [editor, insertText])

  // Handle click outside to hide button
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        // Don't hide if clicking on the button itself
        if (event.target !== buttonRef.current) {
          // Check if click is in the editor area
          if (editorRef.current && !editorRef.current.contains(event.target as Node)) {
            setShowAddButton(false)
          }
        }
      }
    }

    if (showAddButton) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showAddButton])

  const handleAddContext = () => {
    if (selectedText && onAddContext) {
      onAddContext(selectedText)
      // Clear selection and hide button
      if (editor) {
        editor.commands.blur()
      }
      setShowAddButton(false)
      setSelectedText('')
    }
  }

  // Handle export dropdown click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        exportMenuRef.current &&
        !exportMenuRef.current.contains(event.target as Node) &&
        !(event.target as Element)?.closest('[data-export-button]')
      ) {
        setShowExportMenu(false)
      }
    }

    if (showExportMenu) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showExportMenu])

  const handleExportDocx = async () => {
    if (!editor) return
    try {
      const htmlContent = editor.getHTML()
      await exportToDocx(htmlContent, title || 'Untitled Document')
      setShowExportMenu(false)
    } catch (error) {
      console.error('Export failed:', error)
      alert('Failed to export document. Please try again.')
    }
  }

  const handleExportPdf = async () => {
    if (!editor) return
    try {
      const htmlContent = editor.getHTML()
      await exportToPdf(htmlContent, title || 'Untitled Document')
      setShowExportMenu(false)
    } catch (error) {
      console.error('Export failed:', error)
      alert('Failed to export document. Please try again.')
    }
  }

  if (!editor) {
    return (
      <div className="animate-pulse">
        <div className="h-12 bg-cream-200 rounded-lg mb-4" />
        <div className="space-y-3">
          <div className="h-4 bg-cream-200 rounded w-3/4" />
          <div className="h-4 bg-cream-200 rounded w-full" />
          <div className="h-4 bg-cream-200 rounded w-5/6" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 bg-cream-50 border-b border-cream-300 rounded-t-xl flex-wrap">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive('bold')}
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive('italic')}
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive('underline')}
          title="Underline"
        >
          <UnderlineIcon className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          isActive={editor.isActive('strike')}
          title="Strikethrough"
        >
          <Strikethrough className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          isActive={editor.isActive('heading', { level: 1 })}
          title="Heading 1"
        >
          <Heading1 className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor.isActive('heading', { level: 2 })}
          title="Heading 2"
        >
          <Heading2 className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          isActive={editor.isActive('heading', { level: 3 })}
          title="Heading 3"
        >
          <Heading3 className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive('bulletList')}
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive('orderedList')}
          title="Numbered List"
        >
          <ListOrdered className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive('blockquote')}
          title="Quote"
        >
          <Quote className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="Undo"
        >
          <Undo className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="Redo"
        >
          <Redo className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarDivider />

        {/* Export button with dropdown */}
        <div className="relative" ref={exportMenuRef}>
          <button
            data-export-button
            onClick={() => setShowExportMenu(!showExportMenu)}
            className={`
              p-2 rounded-lg transition-colors flex items-center gap-1
              ${showExportMenu
                ? 'bg-ink-900 text-cream-100' 
                : 'text-charcoal-600 hover:bg-cream-200 hover:text-charcoal-900'}
            `}
            title="Export"
          >
            <Download className="w-4 h-4" />
            <ChevronDown className="w-3 h-3" />
          </button>
          
          {showExportMenu && (
            <div className="absolute right-0 top-full mt-1 bg-white border border-cream-300 rounded-lg shadow-lg z-50 min-w-[160px]">
              <button
                onClick={handleExportDocx}
                className="w-full px-4 py-2 text-left text-sm text-charcoal-700 hover:bg-cream-50 transition-colors first:rounded-t-lg last:rounded-b-lg"
              >
                Export as DOCX
              </button>
              <button
                onClick={handleExportPdf}
                className="w-full px-4 py-2 text-left text-sm text-charcoal-700 hover:bg-cream-50 transition-colors first:rounded-t-lg last:rounded-b-lg"
              >
                Export as PDF
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Editor content */}
      <div 
        ref={editorRef}
        className="flex-1 overflow-auto p-6 bg-white rounded-b-xl relative"
      >
        <EditorContent editor={editor} />
        
        {/* Floating add context button */}
        {showAddButton && (
          <button
            ref={buttonRef}
            onClick={handleAddContext}
            className="absolute z-10 w-8 h-8 bg-ink-900 text-cream-100 rounded-full shadow-lg hover:bg-ink-800 transition-all flex items-center justify-center animate-in fade-in duration-200"
            style={{
              top: `${buttonPosition.top}px`,
              left: `${buttonPosition.left}px`,
            }}
            title="Add to AI context"
          >
            <Plus className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}
