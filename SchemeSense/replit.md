# replit.md

## Overview

GovScheme AI is a comprehensive web application that helps users discover and apply to government schemes and subsidies in India. The platform provides personalized recommendations using AI, scheme browsing with advanced filtering, application tracking, and user profile management. Built with a modern tech stack, it offers an intuitive interface for citizens to find relevant government benefits based on their demographics and eligibility criteria.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes

### August 12, 2025 - Dynamic Scheme Generation System
- **Major Feature**: Completely rebuilt scheme generation from static database to dynamic profile-based creation
- **Technical Implementation**: Created `SchemeParser.createUserSpecificSchemes()` method that generates 5-10 schemes based on user occupation, age, salary, and state
- **User Impact**: System now shows different schemes for students vs engineers vs farmers, with authentic government schemes and correct benefits
- **AI Integration**: Perplexity AI recommendations now inform the scheme selection process
- **User Verification**: User confirmed the new system works much better than previous static approach

## System Architecture

### Frontend Architecture
The client-side application is built with React and TypeScript, utilizing a component-based architecture with the following key decisions:

- **UI Framework**: Uses shadcn/ui components built on Radix UI primitives for consistent, accessible interface components
- **Styling**: Tailwind CSS with CSS custom properties for theming, providing a utility-first approach with design system consistency
- **Routing**: Wouter for lightweight client-side routing with minimal bundle impact
- **State Management**: TanStack Query (React Query) for server state management, providing caching, background updates, and optimistic updates
- **Form Handling**: React Hook Form with Zod validation for type-safe form management
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
The server follows a RESTful API design pattern with Express.js:

- **Framework**: Express.js with TypeScript for type-safe server development
- **API Design**: RESTful endpoints organized by resource (users, schemes, applications)
- **Data Validation**: Zod schemas shared between client and server for consistent validation
- **Error Handling**: Centralized error handling middleware with structured error responses
- **Development Integration**: Vite middleware integration for seamless full-stack development

### Data Storage Solutions
The application uses a flexible storage abstraction pattern:

- **ORM**: Drizzle ORM with PostgreSQL dialect for type-safe database operations
- **Schema Management**: Centralized schema definitions with automated TypeScript type generation
- **Migration Support**: Drizzle Kit for database schema migrations and version control
- **Development Storage**: In-memory storage implementation for rapid prototyping and testing
- **Production Database**: Neon Database (serverless PostgreSQL) for scalable cloud deployment

### Authentication and Authorization
Currently implements a simplified authentication system:

- **User Management**: Basic user creation and profile management
- **Session Handling**: Mock user system for development (MOCK_USER_ID pattern)
- **Future Extensibility**: Architecture supports integration with proper authentication providers

### External Service Integrations
The system integrates external services for enhanced functionality:

- **AI Recommendations**: Perplexity AI API for generating personalized scheme recommendations
- **Government Data**: Structured scheme data with comprehensive eligibility criteria
- **Real-time Features**: Built-in support for notifications and status updates

### Key Design Patterns

1. **Shared Schema Pattern**: Common TypeScript types and Zod schemas used across client and server
2. **Repository Pattern**: Storage abstraction allowing for multiple data source implementations
3. **Component Composition**: Reusable UI components following atomic design principles
4. **Optimistic Updates**: Client-side state updates with server synchronization
5. **Progressive Enhancement**: Core functionality works without JavaScript, enhanced with React

### Performance Considerations

- **Code Splitting**: Automatic route-based code splitting with Vite
- **Caching Strategy**: React Query provides intelligent caching with stale-while-revalidate patterns
- **Bundle Optimization**: Tree shaking and modern ES modules for minimal bundle size
- **Database Optimization**: Efficient queries with proper indexing considerations

## External Dependencies

### Core Framework Dependencies
- **React 18**: Frontend framework with concurrent features
- **Express.js**: Backend web framework for Node.js
- **TypeScript**: Type safety across the entire stack

### Database and ORM
- **Drizzle ORM**: Type-safe SQL toolkit and query builder
- **@neondatabase/serverless**: Serverless PostgreSQL driver for Neon Database
- **Drizzle Kit**: Migration tool and schema management

### UI and Styling
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Headless component library for accessibility
- **shadcn/ui**: Pre-built component system based on Radix
- **Lucide React**: Consistent icon library

### State Management and Data Fetching
- **TanStack React Query**: Server state management and caching
- **React Hook Form**: Form state management and validation
- **Zod**: Schema validation and type inference

### AI and External Services
- **Perplexity AI API**: AI-powered recommendation generation
- **Government Scheme Data**: Structured data for Indian government schemes

### Development and Build Tools
- **Vite**: Frontend build tool and development server
- **ESBuild**: Fast JavaScript bundler for backend
- **PostCSS**: CSS processing with Autoprefixer

### Additional Libraries
- **Wouter**: Lightweight client-side routing
- **date-fns**: Date utility library
- **clsx**: Conditional CSS class names utility
- **class-variance-authority**: Component variant management