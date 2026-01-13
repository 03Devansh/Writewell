import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { LogOut, User, ChevronDown } from 'lucide-react'

export default function AccountDropdown() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleSignOut = async () => {
    await signOut()
    navigate('/auth')
  }

  if (!user) return null

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-charcoal-600 hover:text-charcoal-900 hover:bg-cream-200 transition-colors"
      >
        <div className="w-8 h-8 bg-ink-900 text-cream-100 rounded-full flex items-center justify-center font-ui font-medium text-sm">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <span className="font-ui text-sm hidden sm:inline">{user.name}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 z-20 bg-white rounded-lg shadow-soft-lg border border-cream-300 py-1 min-w-[180px]">
            <Link
              to="/profile"
              onClick={() => setIsOpen(false)}
              className="w-full px-4 py-2 text-left text-sm font-ui text-charcoal-700 hover:bg-cream-100 flex items-center gap-2 transition-colors"
            >
              <User className="w-4 h-4" />
              Profile
            </Link>
            <button
              onClick={handleSignOut}
              className="w-full px-4 py-2 text-left text-sm font-ui text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          </div>
        </>
      )}
    </div>
  )
}
