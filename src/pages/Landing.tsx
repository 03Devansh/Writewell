import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useEffect } from 'react'
import { 
  PenLine, 
  BookOpen, 
  Sparkles, 
  FileText, 
  ArrowRight,
  Quote
} from 'lucide-react'

export default function Landing() {
  const { user, isLoading } = useAuth()

  // Debug: Log auth state
  useEffect(() => {
    console.log('Landing page - Auth state:', { user: !!user, isLoading })
  }, [user, isLoading])

  // Don't block rendering if auth is loading - show page anyway
  // The auth state will update when ready
  return (
    <div className="min-h-screen bg-cream-100">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-cream-100/80 backdrop-blur-sm z-50 border-b border-cream-300">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <PenLine className="w-6 h-6 text-ink-900" />
            <span className="font-display text-xl font-semibold text-ink-900">Writewell</span>
          </Link>
          <div className="flex items-center gap-4">
            {user ? (
              <Link to="/dashboard" className="btn-primary">
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link to="/auth" className="btn-ghost">
                  Sign in
                </Link>
                <Link to="/auth" className="btn-primary">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold-100 rounded-full text-gold-800 font-ui text-sm mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered Writing Assistant</span>
          </div>
          
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-charcoal-900 mb-6 leading-tight animate-slide-up">
            Write with{' '}
            <span className="text-ink-900">purpose</span>,{' '}
            <br className="hidden md:block" />
            powered by{' '}
            <span className="text-gold-700">intelligence</span>
          </h1>
          
          <p className="font-body text-xl text-charcoal-600 mb-10 max-w-2xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Writewell helps you craft exceptional documents by combining your knowledge 
            with AI assistance. Add references, get intelligent suggestions, and write 
            research papers with confidence.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Link
              to="/auth"
              className="btn-primary text-lg px-8 py-4 flex items-center gap-2 group"
            >
              Start Writing
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#features"
              className="btn-secondary text-lg px-8 py-4"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Editor Preview */}
      <section className="py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="card p-2 overflow-hidden animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <div className="bg-cream-50 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-3 h-3 rounded-full bg-charcoal-300" />
                <div className="w-3 h-3 rounded-full bg-charcoal-300" />
                <div className="w-3 h-3 rounded-full bg-charcoal-300" />
              </div>
              <div className="grid grid-cols-12 gap-4 min-h-[300px]">
                {/* Left sidebar preview */}
                <div className="col-span-3 bg-cream-200 rounded-lg p-4">
                  <div className="text-xs font-ui font-medium text-charcoal-500 uppercase tracking-wide mb-3">
                    Knowledge
                  </div>
                  <div className="space-y-2">
                    <div className="bg-white rounded p-2 shadow-soft">
                      <div className="h-2 w-20 bg-charcoal-200 rounded mb-1" />
                      <div className="h-2 w-16 bg-charcoal-100 rounded" />
                    </div>
                    <div className="bg-white rounded p-2 shadow-soft">
                      <div className="h-2 w-24 bg-charcoal-200 rounded mb-1" />
                      <div className="h-2 w-12 bg-charcoal-100 rounded" />
                    </div>
                  </div>
                </div>
                {/* Main editor preview */}
                <div className="col-span-6 bg-white rounded-lg p-6 shadow-soft">
                  <div className="h-4 w-48 bg-charcoal-200 rounded mb-4" />
                  <div className="space-y-2">
                    <div className="h-2 w-full bg-charcoal-100 rounded" />
                    <div className="h-2 w-full bg-charcoal-100 rounded" />
                    <div className="h-2 w-3/4 bg-charcoal-100 rounded" />
                    <div className="h-2 w-full bg-charcoal-100 rounded" />
                    <div className="h-2 w-5/6 bg-charcoal-100 rounded" />
                  </div>
                  <div className="mt-6 p-3 bg-gold-50 border-l-2 border-gold-500 rounded-r">
                    <div className="h-2 w-32 bg-gold-200 rounded mb-1" />
                    <div className="h-2 w-40 bg-gold-100 rounded" />
                  </div>
                </div>
                {/* Right sidebar preview */}
                <div className="col-span-3 bg-cream-200 rounded-lg p-4">
                  <div className="text-xs font-ui font-medium text-charcoal-500 uppercase tracking-wide mb-3">
                    AI Assistant
                  </div>
                  <div className="space-y-2">
                    <div className="bg-ink-900 rounded-lg p-2">
                      <div className="h-2 w-20 bg-ink-700 rounded" />
                    </div>
                    <div className="bg-white rounded-lg p-2 shadow-soft">
                      <div className="h-2 w-24 bg-charcoal-100 rounded mb-1" />
                      <div className="h-2 w-20 bg-charcoal-100 rounded" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-bold text-charcoal-900 mb-4">
              Everything you need to write brilliantly
            </h2>
            <p className="font-body text-lg text-charcoal-600 max-w-2xl mx-auto">
              Writewell combines powerful features with elegant simplicity to help you 
              create outstanding documents.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="card p-8 text-center group hover:scale-105 transition-transform duration-300">
              <div className="w-14 h-14 bg-gold-100 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:bg-gold-200 transition-colors">
                <BookOpen className="w-7 h-7 text-gold-700" />
              </div>
              <h3 className="font-display text-xl font-semibold text-charcoal-900 mb-3">
                Knowledge Integration
              </h3>
              <p className="font-body text-charcoal-600">
                Add research papers, notes, and references. Your AI assistant uses 
                this context to provide relevant suggestions.
              </p>
            </div>

            <div className="card p-8 text-center group hover:scale-105 transition-transform duration-300">
              <div className="w-14 h-14 bg-ink-100 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:bg-ink-200 transition-colors">
                <Sparkles className="w-7 h-7 text-ink-700" />
              </div>
              <h3 className="font-display text-xl font-semibold text-charcoal-900 mb-3">
                AI Writing Assistant
              </h3>
              <p className="font-body text-charcoal-600">
                Chat with AI that understands your document and references. Get help 
                writing, editing, and refining your work.
              </p>
            </div>

            <div className="card p-8 text-center group hover:scale-105 transition-transform duration-300">
              <div className="w-14 h-14 bg-cream-300 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:bg-cream-200 transition-colors">
                <FileText className="w-7 h-7 text-charcoal-700" />
              </div>
              <h3 className="font-display text-xl font-semibold text-charcoal-900 mb-3">
                Rich Text Editing
              </h3>
              <p className="font-body text-charcoal-600">
                A beautiful, distraction-free editor with all the formatting tools 
                you need for academic and professional writing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial/Quote Section */}
      <section className="py-20 px-6 bg-ink-900">
        <div className="max-w-4xl mx-auto text-center">
          <Quote className="w-12 h-12 text-gold-500 mx-auto mb-6" />
          <blockquote className="font-display text-2xl md:text-3xl text-cream-100 leading-relaxed mb-6">
            "The art of writing is the art of discovering what you believe."
          </blockquote>
          <cite className="font-body text-cream-300 not-italic">
            — Gustave Flaubert
          </cite>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-4xl font-bold text-charcoal-900 mb-4">
            Ready to transform your writing?
          </h2>
          <p className="font-body text-lg text-charcoal-600 mb-8">
            Join Writewell today and experience the future of document creation.
          </p>
          <Link
            to="/auth"
            className="btn-primary text-lg px-10 py-4 inline-flex items-center gap-2 group"
          >
            Get Started Free
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-cream-300 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <PenLine className="w-5 h-5 text-ink-900" />
            <span className="font-display text-lg font-semibold text-ink-900">Writewell</span>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/style-guide" className="font-ui text-sm text-ink-900 hover:text-ink-700 transition-colors font-medium">
              STYLE GUIDE
            </Link>
            <p className="font-ui text-sm text-charcoal-500">
              © 2026 Writewell. Crafted with care.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
