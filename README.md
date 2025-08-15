# Thamanyah Assignment - تكليف ثمانية

A clean, fast iTunes search application built with Next.js 14, TypeScript, Tailwind CSS, and Prisma. Inspired by the user-focused design philosophy of Podbay.fm.

## Features

- 🎧 Search iTunes podcasts with real-time results
- 📱 Responsive design with grid and list views
- ⚡ Fast search with caching using PostgreSQL
- 🎨 Clean, minimal UI inspired by Podbay.fm
- 🔍 Advanced search filtering and sorting
- 📊 Store search history and results

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Database**: PostgreSQL with Prisma ORM
- **API**: Next.js API Routes
- **External API**: iTunes Search API

## Quick Start

1. **Clone and install dependencies:**
   ```bash
   cd thamanyah-assessment
   npm install
   ```

2. **Set up your database:**
   ```bash
   # Update .env.local with your PostgreSQL connection string
   # Then run Prisma migrations
   npx prisma generate
   npx prisma db push
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Environment Variables

Create a `.env.local` file with:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/itunes_search_db?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
ITUNES_API_BASE_URL="https://itunes.apple.com/search"
```

## Project Structure

```
thamanyah-assessment/
├── app/
│   ├── api/search/          # Search API routes
│   ├── components/          # React components
│   ├── lib/                # Utility functions and services
│   ├── types/              # TypeScript type definitions
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Home page
├── prisma/
│   └── schema.prisma       # Database schema
├── public/                 # Static assets
└── ...config files
```

## API Endpoints

### Search Podcasts
```
GET /api/search?term=query&media=podcast&limit=20
```

Returns paginated search results with caching for improved performance.

## Design Philosophy

This application follows Podbay.fm's design principles:
- **Clean & Minimal**: No clutter or unnecessary elements
- **User-Focused**: Prioritizes user experience over flashy features
- **Fast & Lightweight**: Optimized for speed and performance
- **Intuitive**: Easy navigation and interactions

## Development

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Generate Prisma client
npx prisma generate

# Push database schema
npx prisma db push
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

MIT License - see LICENSE file for details.