# Meeting Notes Whisperer

AI-powered meeting transcription and insights for remote workers.

## 🚀 Tech Stack

- **Framework**: Next.js 14 with Pages Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui with Radix UI
- **State Management**: TanStack Query
- **Forms**: React Hook Form with Zod validation

## 🏗️ Project Structure

```
├── pages/                 # Next.js Pages Router
│   ├── _app.tsx          # App wrapper with providers
│   ├── _document.tsx     # Custom HTML document
│   ├── index.tsx         # Home page
│   └── 404.tsx           # 404 error page
├── src/
│   ├── components/        # React components
│   │   ├── ui/           # shadcn/ui components
│   │   ├── HeroSection.tsx
│   │   ├── ProblemSection.tsx
│   │   ├── DemoSection.tsx
│   │   ├── PricingSection.tsx
│   │   ├── SocialProofSection.tsx
│   │   └── ClosingCTASection.tsx
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility functions
│   └── assets/           # Images and static assets
├── styles/
│   └── globals.css       # Global styles and Tailwind CSS
└── public/               # Static files
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
npm start
```

## 🔧 Key Features

- **File-based Routing**: Next.js Pages Router for simple navigation
- **Server-Side Rendering**: Better SEO and performance
- **Image Optimization**: Automatic image optimization with Next.js Image
- **TypeScript**: Full type safety
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Component Library**: Consistent UI with shadcn/ui components

## 📱 Pages

- **Home** (`/`): Landing page with hero, features, and pricing
- **404**: Custom error page for non-existent routes

## 🎨 Design System

Built with a modern, remote-work focused design system featuring:
- Purple gradient primary colors
- Soft blue accents
- Glassmorphism effects
- Smooth animations and transitions
- Responsive grid layouts

## 🚀 Migration Notes

This project was migrated from React + Vite to Next.js 14 with Pages Router. Key changes:

- Replaced Vite with Next.js build system
- Converted React Router to Next.js file-based routing
- Updated image handling to use Next.js Image component
- Maintained all existing UI components and styling
- Preserved TypeScript configuration and path aliases

## 📄 License

This project is private and proprietary.
