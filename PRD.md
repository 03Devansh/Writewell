# Product Requirements Document (PRD)
## Inkwell - AI-Powered Document Writing Application

**Version:** 1.0  
**Date:** January 2025  
**Status:** Active Development

---

## 1. Executive Summary

### 1.1 Product Overview
Inkwell is a beautiful, AI-powered document writing application designed to help users write research papers and professional documents by integrating their knowledge base with intelligent AI assistance. The application combines a rich text editor with contextual AI that understands both the document content and user-provided references.

### 1.2 Product Vision
To empower writers, researchers, and academics with an intelligent writing assistant that seamlessly integrates their knowledge base, enabling them to create exceptional documents with confidence and efficiency.

### 1.3 Target Audience
- **Primary:** Researchers, academics, and students writing research papers
- **Secondary:** Professional writers, content creators, and knowledge workers
- **Tertiary:** Anyone requiring AI-assisted document creation with reference management

---

## 2. Product Goals & Objectives

### 2.1 Primary Goals
1. **Enable Context-Aware Writing:** Provide AI assistance that understands both document content and user-provided knowledge/references
2. **Streamline Research Integration:** Allow users to easily add and manage research papers, notes, and references as context for AI
3. **Deliver Professional Writing Experience:** Offer a beautiful, distraction-free editor with comprehensive formatting capabilities
4. **Ensure Data Persistence:** Provide real-time sync and auto-save functionality across devices

### 2.2 Success Metrics
- User engagement: Average documents created per user per month
- AI utilization: Percentage of documents with AI interactions
- Knowledge base usage: Average knowledge items per document
- Subscription conversion: Trial-to-paid conversion rate
- User retention: Monthly active users (MAU) and retention rates

---

## 3. Core Features & Functionality

### 3.1 Authentication & User Management

#### 3.1.1 User Authentication
- **Email/Password Authentication:** Secure sign-up and login system
- **Session Management:** Token-based authentication with automatic session handling
- **Profile Management:** Users can update name, email, and preferences
- **Account Dropdown:** Quick access to profile and logout functionality

#### 3.1.2 Subscription Management
- **Subscription Model:** $5/month subscription via Polar integration
- **Trial Flow:** Free trial page with subscription checkout
- **Status Checking:** Real-time subscription status verification
- **Access Control:** Subscription-gated access to core features

### 3.2 Document Management

#### 3.2.1 Document Dashboard
- **Document List View:** Grid layout displaying all user documents
- **Document Cards:** Show title, preview, and last updated timestamp
- **Create Document:** One-click document creation with auto-navigation to editor
- **Delete Document:** Document deletion with confirmation dialog
- **Empty State:** Helpful messaging and CTA when no documents exist
- **Loading States:** Skeleton loaders during data fetching

#### 3.2.2 Document Editor
- **Rich Text Editing:** Full-featured editor powered by TipTap
  - Text formatting: Bold, italic, underline, strikethrough
  - Headings: H1, H2, H3
  - Lists: Ordered and unordered lists
  - Blockquotes
  - Paragraph formatting
- **Document Title:** Editable title with inline editing
- **Auto-Save:** Automatic saving with 2-second debounce
- **Save Status Indicator:** Visual feedback showing save state (Saving/Unsaved/Saved)
- **Keyboard Shortcuts:** Cmd/Ctrl+S for manual save
- **Unsaved Changes Warning:** Browser warning before leaving with unsaved changes
- **Last Saved Timestamp:** Human-readable time display (e.g., "2m ago", "Just now")

### 3.3 Knowledge Base Integration

#### 3.3.1 Knowledge Panel (Left Sidebar)
- **Knowledge Items List:** Expandable/collapsible list of all knowledge entries
- **Add Knowledge:** Form to add new references with title and content
- **Delete Knowledge:** Remove knowledge items with confirmation
- **Knowledge Display:** Expandable cards showing title and full content
- **Empty State:** Guidance for adding first knowledge item
- **Toggle Visibility:** Show/hide sidebar functionality

#### 3.3.2 Knowledge Context
- **AI Integration:** All knowledge items automatically included in AI context
- **Document-Specific:** Knowledge items are scoped to individual documents
- **Content Management:** Support for research papers, notes, and reference materials

### 3.4 AI Writing Assistant

#### 3.4.1 AI Chat Interface (Right Sidebar)
- **Chat Interface:** Conversational AI assistant with message history
- **Context Awareness:** AI has access to:
  - Current document content
  - All knowledge base items
  - Chat history
  - Document-specific AI instructions
  - Global AI instructions (user-level)
- **Message Display:** User and assistant messages with distinct styling
- **Loading States:** Animated indicators during AI response generation
- **Error Handling:** User-friendly error messages for API failures

#### 3.4.2 AI Features
- **Writing Assistance:** Help with writing, editing, and improving content
- **Context Suggestions:** AI uses knowledge base to inform responses
- **Style Adherence:** Maintains document style and tone
- **Content Insertion:** One-click insertion of AI-generated text into document
- **Copy to Clipboard:** Easy copying of AI responses
- **Suggested Prompts:** Quick-start suggestions for common tasks

#### 3.4.3 AI Instructions
- **Global Instructions:** User-level AI writing preferences (stored in profile)
- **Document-Specific Instructions:** Per-document AI behavior customization
- **Instruction Hierarchy:** Document instructions override global instructions
- **Instruction Management:** Settings panel in Knowledge sidebar for document instructions

### 3.5 Export Functionality

#### 3.5.1 Export Formats
- **DOCX Export:** Export documents to Microsoft Word format (.docx)
  - Preserves formatting: headings, lists, blockquotes, text styles
  - Includes document title
  - Proper paragraph structure
- **PDF Export:** Export documents to PDF format (.pdf)
  - A4 page format
  - Preserves formatting and styling
  - Multi-page support for long documents
  - High-quality rendering

### 3.6 User Interface & Design

#### 3.6.1 Design System
- **Typography:**
  - Headings: Playfair Display (serif)
  - Body: Lora (serif)
  - UI Elements: System fonts
- **Color Palette:**
  - Background: Warm cream (#FAF9F6)
  - Primary: Deep ink blue (#1a365d)
  - Accent: Warm gold (#b8860b)
  - Text: Charcoal (#2d3748)
- **Design Aesthetic:** Classic, serif-based design with soft shadows and warm colors
- **Responsive Design:** Mobile-friendly layouts with adaptive breakpoints

#### 3.6.2 Layout Components
- **Three-Panel Layout:** Knowledge panel (left), Editor (center), AI Chat (right)
- **Collapsible Sidebars:** Toggle visibility of knowledge and AI panels
- **Header Bar:** Document title, save status, sidebar toggles, account dropdown
- **Navigation:** Breadcrumb navigation and back-to-dashboard links

### 3.7 Landing Page

#### 3.7.1 Marketing Content
- **Hero Section:** Compelling headline and value proposition
- **Feature Showcase:** Three-column feature grid highlighting key capabilities
- **Editor Preview:** Visual mockup of the editor interface
- **Call-to-Action:** Prominent sign-up and get started buttons
- **Testimonial Section:** Inspirational quote section
- **Navigation:** Header with logo and auth links

---

## 4. Technical Architecture

### 4.1 Technology Stack

#### 4.1.1 Frontend
- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite
- **Routing:** React Router DOM v7
- **Styling:** Tailwind CSS v4
- **Rich Text Editor:** TipTap v3
  - Extensions: Starter Kit, Placeholder, Underline
- **Icons:** Lucide React
- **Export Libraries:**
  - docx (DOCX generation)
  - jspdf + html2canvas (PDF generation)
  - file-saver (file downloads)

#### 4.1.2 Backend
- **Database & Backend:** Convex
  - Real-time database
  - Serverless functions
  - Authentication
  - File storage
- **AI Integration:** OpenAI GPT-4o-mini
  - API integration via Convex actions
  - Context-aware prompts
  - Error handling and rate limiting

#### 4.1.3 Payment Processing
- **Payment Provider:** Polar
  - Subscription management
  - Checkout integration
  - Webhook handling for subscription updates

### 4.2 Data Models

#### 4.2.1 Users Table
```typescript
{
  email: string
  name: string
  passwordHash: string
  createdAt: number
  hasActiveSubscription?: boolean
  subscriptionId?: string
  subscriptionStatus?: string
  subscriptionUpdatedAt?: number
  aiGlobalInstructions?: string
}
```

#### 4.2.2 Documents Table
```typescript
{
  userId: Id<"users">
  title: string
  content: string
  createdAt: number
  updatedAt: number
  aiInstructions?: string
}
```

#### 4.2.3 Knowledge Table
```typescript
{
  documentId: Id<"documents">
  title: string
  content: string
  createdAt: number
}
```

#### 4.2.4 Sessions Table
```typescript
{
  userId: Id<"users">
  token: string
  expiresAt: number
  createdAt: number
}
```

### 4.3 API & Backend Functions

#### 4.3.1 Authentication (`convex/auth.ts`)
- User registration
- User login
- Session management
- Profile updates
- Subscription status checking
- Global AI instructions management

#### 4.3.2 Documents (`convex/documents.ts`)
- Create document
- Get document
- List user documents
- Update document (title, content)
- Delete document
- Update document-specific AI instructions

#### 4.3.3 Knowledge (`convex/knowledge.ts`)
- Add knowledge item
- List knowledge items for document
- Remove knowledge item

#### 4.3.4 AI (`convex/ai.ts`)
- Chat action: Conversational AI with full context
- Generate text action: Direct text generation
- Context building: Document + knowledge + instructions
- Error handling: API errors, rate limits, token limits

#### 4.3.5 Webhooks (`convex/http.ts`, `convex/webhookVerification.ts`)
- Polar webhook handling
- Subscription status updates
- Webhook verification

---

## 5. User Flows

### 5.1 New User Onboarding
1. User visits landing page
2. Clicks "Get Started" or "Sign Up"
3. Creates account (email/password)
4. Redirected to trial/subscription page
5. Completes subscription checkout via Polar
6. Redirected to dashboard
7. Creates first document
8. Explores knowledge panel and AI chat

### 5.2 Document Creation & Editing
1. User clicks "New Document" on dashboard
2. Navigates to editor with blank document
3. Edits document title inline
4. Writes content in rich text editor
5. Auto-save triggers after 2 seconds of inactivity
6. User can manually save with Cmd/Ctrl+S
7. Save status indicator shows current state

### 5.3 Knowledge Base Workflow
1. User opens knowledge panel (left sidebar)
2. Clicks "Add" button
3. Enters title and content for reference
4. Saves knowledge item
5. Knowledge item appears in expandable list
6. AI automatically includes knowledge in context for future queries

### 5.4 AI Writing Assistance
1. User opens AI chat panel (right sidebar)
2. Views suggested prompts or types custom query
3. AI receives:
   - Current document content
   - All knowledge items
   - Chat history
   - AI instructions (document or global)
4. AI generates contextual response
5. User can:
   - Copy response to clipboard
   - Insert response directly into document
   - Continue conversation

### 5.5 Document Export
1. User completes document
2. Clicks export option (if implemented in UI)
3. Chooses format (DOCX or PDF)
4. File downloads automatically
5. Document ready for sharing/submission

---

## 6. User Experience Requirements

### 6.1 Performance
- **Page Load:** Initial page load < 2 seconds
- **Auto-Save:** Save operations complete within 500ms
- **AI Response:** AI responses generated within 5-10 seconds
- **Real-time Sync:** Document changes sync within 1 second

### 6.2 Accessibility
- **Keyboard Navigation:** Full keyboard support for all interactions
- **Screen Readers:** Semantic HTML and ARIA labels
- **Color Contrast:** WCAG AA compliant color combinations
- **Focus States:** Clear focus indicators for all interactive elements

### 6.3 Responsive Design
- **Desktop:** Full three-panel layout (1280px+)
- **Tablet:** Collapsible sidebars, optimized touch targets (768px-1279px)
- **Mobile:** Single-panel view with navigation (320px-767px)

### 6.4 Error Handling
- **Network Errors:** Clear messaging for connection issues
- **API Errors:** User-friendly error messages for AI failures
- **Validation Errors:** Inline validation feedback
- **Save Errors:** Retry mechanisms for failed saves

---

## 7. Security & Privacy

### 7.1 Authentication Security
- **Password Hashing:** Secure password hashing (bcrypt or similar)
- **Session Tokens:** Secure, time-limited session tokens
- **Token Storage:** Secure client-side token storage
- **CSRF Protection:** Cross-site request forgery protection

### 7.2 Data Security
- **Data Encryption:** Encrypted data in transit (HTTPS)
- **Access Control:** User-scoped data access (users can only access their own documents)
- **API Key Security:** OpenAI API key stored securely in environment variables

### 7.3 Privacy
- **Data Ownership:** Users own their documents and data
- **Data Deletion:** Users can delete their documents and account
- **Third-Party Services:** Clear disclosure of OpenAI and Polar integrations

---

## 8. Business Model

### 8.1 Pricing
- **Subscription:** $5/month
- **Payment Provider:** Polar
- **Billing:** Monthly recurring
- **Cancellation:** Users can cancel anytime

### 8.2 Subscription Features
- Unlimited document creation
- Unlimited AI interactions
- Unlimited knowledge base items
- Export functionality
- Priority support (future)

### 8.3 Trial Flow
- Users must subscribe to access core features
- Trial page provides subscription checkout
- Automatic redirect after successful subscription

---

## 9. Future Enhancements (Roadmap)

### 9.1 Short-term (Next 3 months)
- **Collaboration:** Real-time collaborative editing
- **Templates:** Document templates for common paper types
- **Citations:** Automatic citation generation and management
- **Version History:** Document versioning and revision history
- **Search:** Full-text search across documents and knowledge base

### 9.2 Medium-term (3-6 months)
- **Mobile App:** Native iOS and Android applications
- **Offline Mode:** Offline editing with sync when online
- **Advanced AI:** Fine-tuned models for specific writing styles
- **Integrations:** Zotero, Mendeley, Google Scholar integrations
- **Analytics:** Writing analytics and productivity insights

### 9.3 Long-term (6+ months)
- **Team Workspaces:** Shared workspaces for teams
- **API Access:** Public API for third-party integrations
- **Plugin System:** Extensible plugin architecture
- **Advanced Export:** LaTeX, Markdown, HTML exports
- **AI Models:** Multiple AI model options (Claude, Gemini, etc.)

---

## 10. Success Criteria & KPIs

### 10.1 User Engagement
- **Target:** 10+ documents created per active user per month
- **Target:** 80% of documents have at least one AI interaction
- **Target:** Average of 3+ knowledge items per document

### 10.2 Business Metrics
- **Target:** 30% trial-to-paid conversion rate
- **Target:** 70% monthly retention rate
- **Target:** 5,000+ active subscribers within 6 months

### 10.3 Product Quality
- **Target:** < 1% error rate for AI responses
- **Target:** 99.9% uptime
- **Target:** < 100ms average save latency

---

## 11. Dependencies & Integrations

### 11.1 External Services
- **Convex:** Backend-as-a-Service (database, auth, serverless functions)
- **OpenAI:** AI model provider (GPT-4o-mini)
- **Polar:** Payment processing and subscription management

### 11.2 API Requirements
- **OpenAI API Key:** Required environment variable
- **Convex Deployment:** Required for backend functionality
- **Polar Webhook:** Required for subscription status updates

---

## 12. Risks & Mitigations

### 12.1 Technical Risks
- **AI API Failures:** Mitigation through error handling and retry logic
- **Rate Limiting:** Mitigation through request queuing and user feedback
- **Data Loss:** Mitigation through auto-save and backup mechanisms
- **Scalability:** Mitigation through Convex's serverless architecture

### 12.2 Business Risks
- **Low Conversion:** Mitigation through improved onboarding and value demonstration
- **Churn:** Mitigation through feature improvements and user engagement
- **Competition:** Mitigation through unique knowledge base integration and superior UX

### 12.3 Security Risks
- **Data Breaches:** Mitigation through encryption and access controls
- **API Key Exposure:** Mitigation through secure environment variable storage
- **Session Hijacking:** Mitigation through secure token management

---

## 13. Appendix

### 13.1 Glossary
- **Knowledge Base:** User-provided references, notes, and research materials
- **AI Instructions:** Customizable prompts that guide AI behavior
- **Context:** Combined information (document + knowledge + instructions) sent to AI
- **Auto-Save:** Automatic document saving without user action

### 13.2 References
- TipTap Documentation: https://tiptap.dev
- Convex Documentation: https://docs.convex.dev
- OpenAI API Documentation: https://platform.openai.com/docs
- Polar Documentation: https://docs.polar.sh

### 13.3 Document History
- **v1.0 (January 2025):** Initial PRD creation based on current codebase

---

**Document Owner:** Product Team  
**Last Updated:** January 2025  
**Next Review:** February 2025
