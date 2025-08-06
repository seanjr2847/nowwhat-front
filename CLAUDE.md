# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Essential Commands
- `npm run dev` - Start development server (Vite)
- `npm run build` - Production build (TypeScript compilation + Vite build)  
- `npm run lint` - Run ESLint
- `npm run type-check` - TypeScript type checking without emit
- `npm run type-check:watch` - TypeScript type checking in watch mode
- `npm run check-all` - Run both type-check and lint (comprehensive validation)
- `npm run preview` - Preview production build

### Testing
This project does not currently have automated tests. When implementing tests, check the existing structure before assuming a testing framework.

## Project Architecture

### Tech Stack
- **React 19** with TypeScript
- **Vite** for build tooling and dev server
- **React Router** for client-side routing
- **Tailwind CSS** + **shadcn/ui** for styling
- **Radix UI** for accessible component primitives
- **Google OAuth** for authentication

### Core Architecture Patterns

#### Authentication Flow
The app uses Google OAuth with JWT tokens:
1. Google Sign-In → ID token from Google
2. ID token sent to backend API (`https://nowwhat-back.vercel.app`)
3. Backend validates with Google API → returns JWT access/refresh tokens
4. Tokens stored in localStorage with automatic refresh handling
5. Protected routes use `ProtectedRoute` wrapper component

#### State Management
- **AuthProvider**: Global authentication state using React Context
- **No external state library**: Uses React's built-in state management
- **Local component state**: Most components manage their own state

#### API Integration
- **Centralized API client**: `src/lib/api.ts` handles all backend communication
- **Automatic token refresh**: Built-in token refresh with retry logic
- **Streaming support**: Real-time streaming for AI question generation
- **Internationalization headers**: Automatic locale/timezone headers

#### Component Structure
- **Page components**: Located in `src/pages/` (HomePage, ClarifyPage, etc.)
- **Feature components**: Organized by feature (auth, streaming, result, etc.)
- **UI components**: shadcn/ui components in `src/components/ui/`
- **Shared components**: Reusable components in `src/components/`

### Key Directories

#### `/src/components/`
- **`ui/`** - shadcn/ui components (Button, Dialog, etc.)
- **`streaming/`** - AI question generation with real-time streaming
- **`result/`** - Checklist display and interaction components
- **`my-lists/`** - User's saved checklists management
- **`home/`** - Homepage specific components
- **`clarify/`** - Intent clarification and question flow
- **`ads/`** - Advertisement display components
- **`onboarding/`** - User onboarding and coach marks

#### `/src/lib/`
- **`api.ts`** - Complete API client with authentication, streaming, and error handling
- **`auth.ts`** - Authentication service functions
- **`utils.ts`** - Tailwind utilities and common helpers
- **`locale-utils.ts`** - Internationalization and localization utilities
- **`loading-messages.ts`** - Dynamic loading messages

#### `/src/hooks/`
- **`useAuth.ts`** - Authentication hook and context
- **`useStreamingQuestions.ts`** - Real-time AI question generation
- **`use-theme.ts`** - Dark/light theme management
- **`use-toast.ts`** - Toast notification system

### Key Features

#### Streaming AI Question Generation
- Real-time question generation with ChatGPT-style streaming
- `useStreamingQuestions` hook provides streaming state management
- JSON parsing from streamed responses with error handling
- Sequential question display with smooth animations

#### Internationalization
- Automatic locale detection (browser language/country)
- API headers include user locale, region, and timezone
- Support for multiple languages and regions
- Localization utilities in `locale-utils.ts`

#### Theme System  
- Dark/light theme support using `next-themes`
- Custom CSS variables for theme colors
- Korean font stack optimized for Korean/English content
- Smooth theme transitions

#### Advertisement Integration
- PropellerAds integration for monetization
- Mock ad components for development
- Ad display components with proper loading states

#### Responsive Design
- Mobile-first Tailwind CSS approach
- Custom breakpoints and container sizing
- Mobile-optimized navigation and interactions

## Development Guidelines

### Component Patterns
- Use TypeScript interfaces for prop types
- Implement proper error boundaries and loading states
- Follow shadcn/ui component patterns for consistency
- Use `cn()` utility for conditional CSS classes

### API Integration
- Always use the centralized API client in `src/lib/api.ts`
- Handle authentication errors with automatic token refresh
- Include proper loading and error states in components
- Use streaming APIs for real-time features

### Styling Conventions
- Use Tailwind CSS classes following the existing patterns
- Leverage CSS variables for theme colors
- Follow the Korean font stack configuration
- Use consistent spacing and sizing scales

### Error Handling
- Implement proper error boundaries for components
- Use the toast system for user notifications
- Handle API errors gracefully with user-friendly messages
- Log errors appropriately for debugging

### Authentication Requirements
- Wrap protected routes with `ProtectedRoute` component
- Use `useAuth` hook for authentication state
- Handle token expiration and refresh automatically
- Clear sensitive data on logout

## Environment Configuration

### Required Environment Variables
- `VITE_GOOGLE_CLIENT_ID` - Google OAuth client ID

### Backend Integration
- Production API: `https://nowwhat-back.vercel.app`
- API endpoints handle CORS and authentication
- Supports Korean localization and timezone handling

## Build and Deployment

### Build Process
1. TypeScript compilation (`tsc -b`)
2. Vite production build
3. Static assets optimization
4. Vercel deployment configuration in `vercel.json`

### Quality Checks
Run `npm run check-all` before commits to ensure:
- TypeScript type safety
- ESLint compliance
- No build errors

### ESLint Configuration
- Strict TypeScript rules enabled
- React Hooks plugin for proper hook usage
- React Refresh plugin for HMR
- Type-checked ESLint rules for enhanced type safety