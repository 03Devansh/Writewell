import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PenLine, Check, Sparkles } from 'lucide-react'

const CHECKOUT_LINK =
  'https://buy.polar.sh/polar_cl_LQD0qXROhgxYVq2pGE1B9h25cG15SiJHtgc6L0PcJ73'

export default function Trial() {
  const [isLoading, setIsLoading] = useState(false)

  const handleStartTrial = () => {
    try {
      setIsLoading(true)
      window.open(CHECKOUT_LINK, '_blank', 'noopener,noreferrer')
      setTimeout(() => setIsLoading(false), 500)
    } catch {
      setIsLoading(false)
    }
  }

  const benefits = [
    'Unlimited AI-powered writing assistance',
    'Advanced knowledge base integration',
    'Priority support and updates',
    'Export to multiple formats',
    'Collaborative editing features',
  ]

  return (
    <div className="min-h-screen bg-cream-100 flex flex-col">
      {/* Header */}
      <header className="p-6">
        <Link to="/" className="flex items-center gap-2 w-fit">
          <PenLine className="w-6 h-6 text-ink-900" />
          <span className="font-display text-xl font-semibold text-ink-900">
            Inkwell
          </span>
        </Link>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-4 pb-16">
        <div className="w-full max-w-2xl animate-fade-in">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gold-100 rounded-2xl mb-6">
              <Sparkles className="w-8 h-8 text-gold-700" />
            </div>
            <h1 className="font-display text-4xl font-bold text-charcoal-900 mb-4">
              Start Your Free Trial
            </h1>
            <p className="font-body text-lg text-charcoal-600 max-w-md mx-auto">
              Unlock the full power of Inkwell with AI-assisted writing, knowledge
              management, and more.
            </p>
          </div>

          <div className="card p-8 md:p-12">
            {/* Pricing */}
            <div className="text-center mb-10">
              <div className="inline-flex items-baseline gap-2 mb-2">
                <span className="font-display text-5xl font-bold text-charcoal-900">
                  $5
                </span>
                <span className="font-body text-xl text-charcoal-600">
                  /month
                </span>
              </div>
              <p className="font-body text-sm text-charcoal-500">
                Cancel anytime. No hidden fees.
              </p>
            </div>

            {/* Benefits */}
            <div className="space-y-4 mb-10">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-gold-100 rounded-full flex items-center justify-center mt-0.5">
                    <Check className="w-4 h-4 text-gold-700" />
                  </div>
                  <p className="font-body text-charcoal-700 flex-1">
                    {benefit}
                  </p>
                </div>
              ))}
            </div>

            {/* CTA */}
            <button
              onClick={handleStartTrial}
              disabled={isLoading}
              className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 py-4 text-lg"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-cream-100 border-t-transparent rounded-full animate-spin" />
                  <span>Opening checkout…</span>
                </>
              ) : (
                <span>Start Free Trial</span>
              )}
            </button>

            <p className="text-center mt-6 text-sm font-body text-charcoal-500">
              Secure payment powered by Polar
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
