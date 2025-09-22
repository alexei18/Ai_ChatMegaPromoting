# Bravin AI - 24/7 AI Receptionist

A modern, responsive marketing website for Bravin AI - an AI agent that answers inbound messages for companies. Features a clean white background design with strategic black sections and a pill-shaped floating header.

## ✨ Features

- **Pill-Shaped Header** - Fixed floating navigation that scales on scroll
- **Hero Section** - Clean white background with animated chat bubble and typewriter effect
- **Social Proof** - Horizontal logo ticker with customer testimonials
- **How It Works** - 3-step process with scroll-triggered animations (white background)
- **Industry Modules** - 6 industry-specific cards with hover effects (light gray background)
- **ROI Calculator** - Interactive calculator with count-up animations (black background)
- **Customer Stories** - Framer Motion carousel slider (white background)
- **Developer Section** - Code examples with copy-to-clipboard functionality (black background)
- **Pricing** - 3 pricing tiers with highlighted Growth plan (light gray background)
- **Mobile CTA** - Sticky footer that appears after 20% scroll
- **Footer** - Newsletter signup and navigation links (black background)

## 🛠 Tech Stack

- **Next.js 14** - App Router for modern React development
- **React 18** - Latest React features and hooks
- **TypeScript** - Type safety and better DX
- **Tailwind CSS v3** - Utility-first styling with custom design tokens
- **Framer Motion** - Smooth animations and transitions
- **React Simple Typewriter** - Typewriter effect for hero section

## 🎨 Design System

### Color Scheme
- **Primary Background**: White (`bg-white`)
- **Secondary Background**: Light Gray (`bg-gray-50`)
- **Accent Sections**: Black (`bg-black`)
- **Text**: Black on light backgrounds, White on dark backgrounds
- **Gradient Accent**: `linear-gradient(90deg, #8A4DFF 0%, #45B2FF 100%)`

### Typography
- Font Family: Inter, sans-serif
- Glow text effect with gradient clipping for accent text

### Layout Pattern
The site alternates between different background colors to create visual rhythm:
1. **White**: Hero, How It Works, Testimonials
2. **Light Gray**: Logo Ticker, Industry Modules, Pricing  
3. **Black**: ROI Calculator, Developer Section, Footer

## 📂 Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with font and metadata
│   └── page.tsx            # Main landing page with all sections
├── components/
│   ├── sections/           # Page sections
│   │   ├── HeroSection.tsx
│   │   ├── LogoTicker.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── IndustryModules.tsx
│   │   ├── ROICalculator.tsx
│   │   ├── Testimonials.tsx
│   │   ├── DeveloperSection.tsx
│   │   ├── Pricing.tsx
│   │   └── Footer.tsx
│   └── ui/                 # UI components
│       ├── Header.tsx      # Pill-shaped floating header
│       └── MobileFooterCTA.tsx
├── lib/
│   ├── data.ts             # Sample data and content
│   └── utils.ts            # Utility functions
└── styles/
    └── globals.css         # Global styles and custom keyframes
```

## 🚀 Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 Responsive Design

- Mobile-first approach
- Pill-shaped header adapts to mobile screens
- Sticky mobile footer CTA
- Responsive grid layouts
- Touch-friendly interactions

## ♿ Accessibility

- Reduced motion support via `prefers-reduced-motion`
- Keyboard navigation for all interactive elements
- Semantic HTML structure
- High contrast black and white color scheme

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 📄 License

This project is for demonstration purposes. All rights reserved.

## 🤝 Contributing

This is a demo project. For production use, please customize the content, replace placeholder images, and add your own branding.
