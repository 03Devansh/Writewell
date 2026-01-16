import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ConvexProvider, ConvexReactClient } from 'convex/react'
import { AuthProvider } from './contexts/AuthContext'
import App from './App.tsx'
import './index.css'

const convexUrl = import.meta.env.VITE_CONVEX_URL

// Show setup instructions if Convex URL is not configured
if (!convexUrl) {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <div className="min-h-screen bg-cream-100 flex items-center justify-center p-8">
        <div className="max-w-xl w-full card p-8 text-center">
          <div className="w-16 h-16 bg-gold-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-gold-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
              <path d="m15 5 4 4"/>
            </svg>
          </div>
          <h1 className="font-display text-2xl font-bold text-charcoal-900 mb-4">
            Welcome to Writewell
          </h1>
          <p className="font-body text-charcoal-600 mb-6">
            To get started, you need to set up Convex. Follow these steps:
          </p>
          <div className="text-left bg-cream-50 rounded-lg p-4 mb-6">
            <ol className="space-y-3 font-ui text-sm text-charcoal-700">
              <li>
                <span className="font-semibold">1.</span> Run <code className="bg-charcoal-100 px-1.5 py-0.5 rounded">npx convex dev</code> in your terminal
              </li>
              <li>
                <span className="font-semibold">2.</span> Follow the prompts to log in and create a project
              </li>
              <li>
                <span className="font-semibold">3.</span> This will create a <code className="bg-charcoal-100 px-1.5 py-0.5 rounded">.env.local</code> file with your Convex URL
              </li>
              <li>
                <span className="font-semibold">4.</span> Restart the dev server with <code className="bg-charcoal-100 px-1.5 py-0.5 rounded">npm run dev</code>
              </li>
              <li>
                <span className="font-semibold">5.</span> Add your OpenAI API key in the Convex dashboard
              </li>
            </ol>
          </div>
          <a 
            href="https://docs.convex.dev/quickstart/react" 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn-primary inline-flex items-center gap-2"
          >
            View Convex Docs
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
              <polyline points="15 3 21 3 21 9"/>
              <line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
          </a>
        </div>
      </div>
    </StrictMode>,
  )
} else {
  const convex = new ConvexReactClient(convexUrl)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <ConvexProvider client={convex}>
        <AuthProvider>
          <BrowserRouter>
    <App />
          </BrowserRouter>
        </AuthProvider>
      </ConvexProvider>
  </StrictMode>,
)
}
