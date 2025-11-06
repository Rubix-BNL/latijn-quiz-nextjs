# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15-based interactive quiz application for Latin-Dutch vocabulary learning. The application is entirely client-side with an emphasis on extreme performance optimization.

**Key characteristics**:
- Client-side only (no backend/API routes needed)
- 91 Latin vocabulary words from chapters 8, 9, and 10
- Modern UI built with shadcn/ui components and Tailwind CSS
- Optimized to 117KB initial bundle (~30-35KB gzipped)
- <5ms quiz start time, <2ms answer validation

## Development Commands

### Setup and Running
```bash
# Install dependencies
npm install

# Start development server (with hot reload)
npm run dev
# Access at http://localhost:3000

# Create production build
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Analyze bundle size
npm run analyze
```

### Type Checking
```bash
# TypeScript type checking (no emit)
npx tsc --noEmit
```

## Code Architecture

### Application Structure

The app uses Next.js 15 App Router with a single-page client component architecture:

```
app/
├── layout.tsx          # Root layout with metadata
├── page.tsx            # Entry point (renders Quiz component)
└── globals.css         # Global styles
```

### Core Components

**Main orchestrator**: `components/quiz.tsx`
- State machine managing three states: "not-started" | "in-progress" | "finished"
- Uses lazy loading with `require()` to load state-specific components only when needed
- All state management happens here (useState hooks)
- Performance optimizations with useMemo/useCallback throughout

**State-specific components** (all wrapped with React.memo):
- `quiz-start.tsx` - Start screen, loaded only in "not-started" state
- `quiz-question.tsx` - Question display, loaded only in "in-progress" state
- `quiz-results.tsx` - Results screen, loaded only in "finished" state

**UI components**: `components/ui/`
- shadcn/ui components (button, card, input, progress, badge)
- Pre-built, customizable with Tailwind

### Data Layer

**Vocabulary**: `data/vocabulary.ts`
- Single source of truth: `VOCAB` object mapping Latin → Dutch translations
- Module-level caching: `cachedVocabularyItems` computed once at load
- Fisher-Yates shuffle implementation for randomization
- 91 words organized by chapter (Hoofdstuk 8, 9, 10)

**Quiz logic**: `lib/quiz-utils.ts`
- `normalizeAnswer()`: Lowercase, strip whitespace, remove "(be)" prefixes
- `getNormalizedTranslations()`: **Map-based cache** for normalized translations (99.5% faster on cache hits)
- `generateHint()`: Returns first ~1/3 of shortest translation
- `calculateGrade()`: Converts score to 1-10 scale
- `calculatePercentage()`: Calculates percentage with 1 decimal precision

**Types**: `types/quiz.ts`
- TypeScript definitions for QuizState, QuizItem, WrongAnswer, etc.

### Quiz Flow Logic

1. **Start**: Shuffle vocabulary, initialize state
2. **Question Loop**:
   - Present Latin word
   - On **first wrong answer**: Show hint (worth 0.5 points if answered correctly)
   - On **second wrong answer**: Show correct answer, move to next (0 points)
   - On **correct answer**: Award points (1 or 0.5), move to next
3. **Results**: Display score, percentage, grade (1-10), and review wrong answers

### Performance Optimizations

This codebase is heavily optimized. **Important patterns to maintain**:

1. **Data caching**:
   - Module-level cache in `vocabulary.ts` (cachedVocabularyItems)
   - Map-based cache in `quiz-utils.ts` (translationCache)
   - Never recompute these on each call

2. **React optimizations**:
   - `useMemo` for derived state (currentItem, progress, totalVocabItems)
   - `useCallback` for event handlers (startQuiz, handleSubmit, moveToNext)
   - `React.memo` on all state-specific components
   - Lazy loading with `require()` instead of `next/dynamic` (avoids extra wrapper)

3. **Code splitting**:
   - Components split by quiz state
   - Only load what's needed for current state
   - shadcn/ui and lucide-react are optimized via `next.config.js`

4. **Bundle optimization**:
   - `next.config.js` uses `optimizePackageImports` for UI libraries
   - Tree shaking enabled
   - Compression enabled for production

See `PERFORMANCE.md` for detailed metrics and analysis.

### Answer Normalization

The quiz accepts flexible user input:
- Case-insensitive matching
- Removes optional prefixes: "(be)groeten" matches "groeten" or "begroeten"
- Splits on commas and slashes: "door, doorheen" accepts both "door" and "doorheen"
- Whitespace trimming

Multiple valid translations per word are supported (e.g., "salutare" accepts "begroeten", "groeten", or "(be)groeten").

### Language

All user-facing text, comments, and variable names are in **Dutch**. The application is for Dutch-speaking students learning Latin vocabulary.

## Configuration Files

### Next.js Config (`next.config.js`)
- `reactStrictMode: true` - Catches bugs in development
- `optimizePackageImports` - Optimizes imports from `@/components/ui` and `lucide-react`
- `compress: true` - Production compression
- `poweredByHeader: false` - Security header removal

### Tailwind Config (`tailwind.config.ts`)
- shadcn/ui integration with design tokens
- Custom theme configuration
- Animation support via tailwindcss-animate

### Package Management
- Uses npm (not yarn or pnpm)
- React 19 and Next.js 15.5+
- TypeScript 5

## Important Development Notes

1. **No backend needed**: This is a purely client-side application. Don't add API routes unless explicitly required for a new feature.

2. **Performance is critical**: Before making changes, understand the existing optimizations in `PERFORMANCE.md`. Maintain caching strategies and memoization patterns.

3. **State management**: All quiz state lives in `components/quiz.tsx`. Don't split this into separate stores or context unless the component becomes unmaintainable.

4. **Lazy loading pattern**: Use `require()` for state-based component loading (not `next/dynamic`), as demonstrated in `quiz.tsx`.

5. **No test infrastructure**: Project doesn't currently have tests. If adding tests, use Jest + React Testing Library.

6. **Deployment**: Application can be deployed to Vercel (`.vercel/` directory exists) or any static hosting.
