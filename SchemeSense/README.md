# GovScheme AI - Government Scheme Recommendation Platform

A comprehensive web application that helps users discover and apply to government schemes and subsidies in India using AI-powered personalized recommendations.

## Features

- **Dynamic Scheme Generation**: AI-powered scheme recommendations based on user profile
- **Profile-Based Matching**: Different schemes for students, engineers, farmers, entrepreneurs
- **Real Government Schemes**: Authentic schemes with actual benefits and eligibility criteria
- **Responsive UI**: Mobile-first design with modern interface
- **Smart Filtering**: Advanced search and category filtering
- **Application Tracking**: Track your scheme applications

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Express.js, TypeScript
- **AI Integration**: Perplexity AI API for recommendations
- **Database**: PostgreSQL with Drizzle ORM (development uses in-memory storage)
- **Build Tools**: Vite, ESBuild

## Prerequisites

- Node.js 18 or higher
- npm or yarn package manager
- Perplexity AI API key (for AI recommendations)

## Local Setup Instructions

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone <your-repo-url>
cd govscheme-ai

# Install dependencies
npm install
```

### 2. Environment Setup

Create a `.env` file in the root directory:

```env
# AI Integration
PERPLEXITY_API_KEY=your_perplexity_api_key_here

# Development Settings
NODE_ENV=development
PORT=5000

# Database (optional - uses in-memory storage by default)
DATABASE_URL=your_database_url_here
```

### 3. Get Your Perplexity API Key

1. Visit [Perplexity AI](https://www.perplexity.ai/)
2. Sign up for an account
3. Navigate to API settings
4. Generate an API key
5. Add it to your `.env` file

### 4. Run the Application

```bash
# Start development server (runs both frontend and backend)
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5000
- Backend API: http://localhost:5000/api

### 5. Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   └── lib/           # Utilities and API client
├── server/                # Express backend
│   ├── services/          # Business logic
│   │   ├── perplexity.ts  # AI integration
│   │   └── schemeParser.ts # Dynamic scheme generation
│   ├── routes.ts          # API routes
│   └── storage.ts         # Data storage abstraction
├── shared/                # Shared TypeScript types
│   └── schema.ts          # Database schema and validation
└── components.json        # shadcn/ui configuration
```

## Key Components

### Dynamic Scheme Generation (`server/services/schemeParser.ts`)

The core innovation of this platform - generates personalized schemes based on:
- User occupation (Student, Software Engineer, Farmer, etc.)
- Age and income bracket
- Location (state-specific schemes)
- AI recommendation context

### AI Integration (`server/services/perplexity.ts`)

Uses Perplexity AI to generate contextual recommendations that inform the scheme selection process.

## Available Scripts

```bash
# Development
npm run dev          # Start full-stack development server

# Build
npm run build        # Build for production

# Database (if using PostgreSQL)
npm run db:generate  # Generate database schema
npm run db:migrate   # Run database migrations
```

## API Endpoints

- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user profile
- `GET /api/users/:id/recommendations` - Get personalized scheme recommendations
- `GET /api/users/:id/applications` - Get user applications
- `POST /api/applications` - Submit scheme application

## Deployment

### Local Development
The app uses in-memory storage by default, perfect for local development and testing.

### Production Deployment
For production, configure a PostgreSQL database and update the `DATABASE_URL` environment variable.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For questions or issues:
1. Check the GitHub issues
2. Review the documentation
3. Contact the development team

---

Built with ❤️ for helping citizens access government benefits more easily.