# VS Code Setup Guide for GovScheme AI

This guide will help you set up the complete GovScheme AI project in your local VS Code environment.

## Step 1: Download Project Files

### Option A: Copy from Replit
1. Download these key files from your Replit environment:
   - `package.json` - Dependencies
   - `tsconfig.json` - TypeScript configuration
   - `vite.config.ts` - Build configuration
   - `tailwind.config.ts` - Styling configuration
   - `drizzle.config.ts` - Database configuration
   - All files in `client/`, `server/`, `shared/` folders

### Option B: GitHub Repository
If you have this project in a Git repository, simply clone it:
```bash
git clone <your-repo-url>
cd govscheme-ai
```

## Step 2: Create Project Structure

Create this folder structure in VS Code:

```
govscheme-ai/
├── .env                    # Environment variables (create this)
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.ts
├── drizzle.config.ts
├── components.json
├── client/
│   ├── index.html
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── hooks/
│       ├── lib/
│       ├── App.tsx
│       ├── main.tsx
│       └── index.css
├── server/
│   ├── services/
│   │   ├── perplexity.ts
│   │   └── schemeParser.ts
│   ├── index.ts
│   ├── routes.ts
│   ├── storage.ts
│   └── vite.ts
└── shared/
    └── schema.ts
```

## Step 3: Install Node.js and VS Code Extensions

### Install Node.js
1. Download Node.js 18+ from [nodejs.org](https://nodejs.org/)
2. Install and verify: `node --version`

### Recommended VS Code Extensions
Install these extensions for the best development experience:

```json
{
  "recommendations": [
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense",
    "ms-vscode.vscode-json"
  ]
}
```

## Step 4: Environment Configuration

Create `.env` file in the root directory:

```env
# AI Integration - REQUIRED
PERPLEXITY_API_KEY=your_perplexity_api_key_here

# Development Settings
NODE_ENV=development
PORT=5000

# Database (optional for development)
DATABASE_URL=postgresql://username:password@localhost:5432/govscheme
```

### Get Perplexity API Key
1. Go to [perplexity.ai](https://www.perplexity.ai/)
2. Sign up/login
3. Navigate to API section
4. Generate API key
5. Copy to `.env` file

## Step 5: Install Dependencies

Open terminal in VS Code and run:

```bash
# Install all dependencies
npm install

# Verify installation
npm list --depth=0
```

## Step 6: VS Code Settings

Create `.vscode/settings.json`:

```json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"],
    ["cx\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]
  ]
}
```

## Step 7: Run the Application

```bash
# Start development server
npm run dev
```

This will:
- Start the Express backend on port 5000
- Start the Vite frontend development server
- Open browser at http://localhost:5000

## Step 8: Verify Everything Works

### Test the Application
1. Open http://localhost:5000 in browser
2. Create/update user profile
3. Check scheme recommendations load
4. Verify AI recommendations appear
5. Test profile switching (Student → Software Engineer)

### Development Workflow
1. **Frontend changes**: Edit files in `client/src/`
2. **Backend changes**: Edit files in `server/`
3. **Shared types**: Edit `shared/schema.ts`
4. **Styling**: Use Tailwind classes, edit `client/src/index.css`

## Step 9: Key Development Files

### Most Important Files to Understand:

1. **`server/services/schemeParser.ts`** - Dynamic scheme generation logic
2. **`server/services/perplexity.ts`** - AI integration
3. **`client/src/pages/dashboard.tsx`** - Main application page
4. **`client/src/components/ai-recommendations.tsx`** - AI recommendation display
5. **`shared/schema.ts`** - Data types and validation

### Common Development Tasks:

**Add New Scheme Type:**
```typescript
// In server/services/schemeParser.ts
if (userProfile.occupation.toLowerCase().includes('doctor')) {
  schemes.push({
    id: 'medical-scheme',
    name: 'Medical Professional Scheme',
    // ... rest of scheme data
  });
}
```

**Modify AI Prompts:**
```typescript
// In server/services/perplexity.ts
const prompt = `Based on your profile as a ${age}-year-old ${occupation}...`;
```

## Troubleshooting

### Common Issues:

1. **Port 5000 in use:**
   ```bash
   lsof -ti:5000 | xargs kill -9
   ```

2. **Dependencies issues:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **TypeScript errors:**
   ```bash
   npx tsc --noEmit
   ```

4. **Environment variables not loading:**
   - Ensure `.env` is in root directory
   - Restart dev server after changes
   - Check file is not named `.env.txt`

## Next Steps

- Customize scheme data in `schemeParser.ts`
- Add new UI components in `client/src/components/`
- Modify AI prompts for better recommendations
- Add new API endpoints in `server/routes.ts`
- Deploy to production when ready

## Production Deployment

When ready to deploy:
1. Set up PostgreSQL database
2. Configure production environment variables
3. Build for production: `npm run build`
4. Deploy to your hosting platform

Happy coding! 🚀