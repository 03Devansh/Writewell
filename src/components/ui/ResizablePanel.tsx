import { useState, useRef, useEffect, useCallback } from 'react'

interface ResizablePanelProps {
  children: React.ReactNode
  defaultWidth: number
  minWidth?: number
  maxWidth?: number
  side: 'left' | 'right'
  onWidthChange?: (width: number) => void
  storageKey?: string
}

export default function ResizablePanel({
  children,
  defaultWidth,
  minWidth = 200,
  maxWidth = 800,
  side,
  onWidthChange,
  storageKey,
}: ResizablePanelProps) {
  const [width, setWidth] = useState(() => {
    if (storageKey) {
      const saved = localStorage.getItem(storageKey)
      if (saved) {
        const parsed = parseInt(saved, 10)
        if (!isNaN(parsed) && parsed >= minWidth && parsed <= maxWidth) {
          return parsed
        }
      }
    }
    return defaultWidth
  })

  const [isResizing, setIsResizing] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const startXRef = useRef<number>(0)
  const startWidthRef = useRef<number>(0)

  // Save width to localStorage when it changes
  useEffect(() => {
    if (storageKey) {
      localStorage.setItem(storageKey, width.toString())
    }
    if (onWidthChange) {
      onWidthChange(width)
    }
  }, [width, storageKey, onWidthChange])

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setIsResizing(true)
    startXRef.current = e.clientX
    startWidthRef.current = width
    document.body.style.cursor = side === 'left' ? 'ew-resize' : 'ew-resize'
    document.body.style.userSelect = 'none'
  }, [width, side])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing) return

    const deltaX = side === 'left' 
      ? e.clientX - startXRef.current 
      : startXRef.current - e.clientX
    
    const newWidth = Math.max(
      minWidth,
      Math.min(maxWidth, startWidthRef.current + deltaX)
    )
    
    setWidth(newWidth)
  }, [isResizing, side, minWidth, maxWidth])

  const handleMouseUp = useCallback(() => {
    setIsResizing(false)
    document.body.style.cursor = ''
    document.body.style.userSelect = ''
  }, [])

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isResizing, handleMouseMove, handleMouseUp])

  return (
    <div
      ref={panelRef}
      className="relative flex-shrink-0 overflow-hidden"
      style={{ width: `${width}px` }}
    >
      {children}
      {/* Resize handle */}
      <div
        onMouseDown={handleMouseDown}
        className={`
          absolute top-0 bottom-0 w-1 z-10
          ${side === 'left' ? 'right-0' : 'left-0'}
          hover:bg-ink-300 transition-colors cursor-ew-resize
          ${isResizing ? 'bg-ink-400' : 'bg-transparent'}
        `}
      >
        {/* Visual indicator */}
        <div
          className={`
            absolute top-1/2 -translate-y-1/2 w-0.5 h-12 rounded-full
            ${side === 'left' ? 'right-0' : 'left-0'}
            bg-charcoal-400 opacity-0 hover:opacity-100 transition-opacity
            ${isResizing ? 'opacity-100 bg-ink-600' : ''}
          `}
        />
      </div>
    </div>
  )
}
