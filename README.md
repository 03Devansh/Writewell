# Writewell

A beautiful, AI-powered document writing application that helps you write research papers and documents by referencing your knowledge base.

## Features

- **Rich Text Editor**: Full-featured editor with formatting controls powered by TipTap
- **Knowledge Integration**: Add research papers, notes, and references as context for AI
- **AI Writing Assistant**: Chat-based AI that understands your document and references
- **Real-time Sync**: Documents auto-save and sync across devices via Convex
- **Classic Design**: Clean, serif-based aesthetic with soft shadows and warm colors

## Tech Stack

- **Frontend**: React 18 + Vite + TypeScript
- **Styling**: Tailwind CSS v4
- **Rich Text**: TipTap
- **Database & Auth**: Convex
- **AI**: OpenAI GPT-4

## Getting Started

### Prerequisites

- Node.js 20.19+ or 22.12+
- npm or yarn
- Convex account (free at [convex.dev](https://convex.dev))
- OpenAI API key

### Installation

1. Clone the repository and navigate to it:
   ```bash
   cd Writewell
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up Convex:
   ```bash
   npx convex dev
   ```
   This will prompt you to log in and create a new project. Follow the instructions.
   It will also generate the `convex/_generated` files and create a `.env.local` file with your `VITE_CONVEX_URL`.

4. Add your OpenAI API key to Convex:
   - Go to your Convex dashboard at [dashboard.convex.dev](https://dashboard.convex.dev)
   - Select your project
   - Navigate to Settings > Environment Variables
   - Add `OPENAI_API_KEY` with your OpenAI API key

5. Start the development server (in a new terminal):
   ```bash
   npm run dev
   ```

6. Open [http://localhost:5173](http://localhost:5173) in your browser

### Development Scripts

- `npm run dev` - Start the Vite development server
- `npm run dev:convex` - Start Convex development server (required for backend)
- `npm run build` - Build for production
- `npm run preview` - Preview the production build
- `npm run typecheck` - Run TypeScript type checking
- `npm run lint` - Run ESLint

## Project Structure

```
Writewell/
├── convex/                 # Convex backend
│   ├── _generated/        # Auto-generated Convex files
│   ├── schema.ts          # Database schema
│   ├── auth.ts            # Authentication functions
│   ├── documents.ts       # Document CRUD operations
│   ├── knowledge.ts       # Knowledge/references CRUD
│   └── ai.ts              # OpenAI integration
├── src/
│   ├── components/
│   │   └── editor/
│   │       ├── RichEditor.tsx     # TipTap editor component
│   │       ├── KnowledgePanel.tsx # Left sidebar for references
│   │       └── AIChat.tsx         # Right sidebar AI chat
│   ├── contexts/
│   │   └── AuthContext.tsx        # Authentication context
│   ├── pages/
│   │   ├── Landing.tsx            # Landing page
│   │   ├── Auth.tsx               # Login/Signup page
│   │   ├── Dashboard.tsx          # Document dashboard
│   │   └── Editor.tsx             # Document editor
│   ├── App.tsx                    # Main app with routing
│   ├── main.tsx                   # Entry point
│   └── index.css                  # Global styles & Tailwind config
├── index.html
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## Design System

### Typography
- **Headings**: Playfair Display (serif)
- **Body**: Lora (serif)
- **UI Elements**: System fonts

### Colors
- **Background**: Warm cream (#FAF9F6)
- **Primary**: Deep ink blue (#1a365d)
- **Accent**: Warm gold (#b8860b)
- **Text**: Charcoal (#2d3748)

## How to Use

1. **Sign Up / Login**: Create an account or log in to access your documents
2. **Create a Document**: Click "New Document" from the dashboard
3. **Add Knowledge**: Use the left sidebar to add references, notes, or research content
4. **Write**: Use the rich text editor in the center to write your document
5. **AI Assistance**: Chat with AI in the right sidebar - it can see your document and knowledge
6. **Auto-save**: Your work is automatically saved as you type

## License

MIT
