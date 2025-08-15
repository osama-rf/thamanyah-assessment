# Thamanyah Assignment - تكليف ثمانية

A clean, fast iTunes search application built with Next.js 15, TypeScript, Tailwind CSS, and Supabase. Features real-time podcast and episode search with responsive design and multi-language support.

## Features

- 🎧 Search iTunes podcasts and episodes with instant results
- 📱 Fully responsive design that works on all devices
- ⚡ Fast search with debounced input and caching using Supabase
- 🎨 Clean, modern UI with dark/light theme support
- 🌍 Multi-language support (Arabic/English) with RTL support
- 🔍 Grid and list view options for search results
- 📊 Popular podcasts section and search history

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Database**: Supabase (PostgreSQL)
- **API**: Next.js API Routes
- **External API**: iTunes Search API

## Quick Start

1. **Clone and install dependencies:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/thamanyah-assessment.git
   cd thamanyah-assessment
   npm install
   ```

2. **Set up Supabase:**
   - Create a new project at [supabase.com](https://supabase.com)
   - Copy your project URL and anon key
   - Run the SQL migrations in your Supabase SQL editor:
     - `supabase-migration.sql` (for podcasts table)
     - `episodes-migration.sql` (for episodes table)

3. **Configure environment variables:**
   Create a `.env.local` file with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Environment Variables

Create a `.env.local` file with:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Project Structure

```
thamanyah-assessment/
├── app/
│   ├── api/
│   │   ├── search/          # Podcast search API route
│   │   └── popular/         # Popular podcasts API route
│   ├── components/          # React components
│   │   ├── EpisodeGrid.tsx  # Episode display components
│   │   ├── PodcastCard.tsx  # Podcast card component
│   │   ├── SearchBar.tsx    # Search functionality
│   │   └── ...              # Other UI components
│   ├── contexts/            # React contexts
│   │   ├── LanguageContext.tsx  # Language/i18n context
│   │   └── ThemeContext.tsx     # Dark/light theme context
│   ├── lib/                 # Utility functions and services
│   │   ├── supabase.ts      # Supabase client configuration
│   │   ├── itunes-api.ts    # iTunes API service
│   │   └── utils.ts         # Utility functions
│   ├── types/              # TypeScript type definitions
│   ├── globals.css         # Global styles and CSS variables
│   ├── layout.tsx          # Root layout with providers
│   └── page.tsx            # Home page
├── public/                 # Static assets (logos, icons)
├── supabase-migration.sql  # Database schema for podcasts
├── episodes-migration.sql  # Database schema for episodes
└── ...config files
```

## API Endpoints

### Search Podcasts
```
GET /api/search?term=query&media=podcast&limit=50
```

### Popular Podcasts
```
GET /api/popular
```

Both endpoints return cached results for improved performance and include Supabase integration.

## Key Features Explained

### Multi-Language Support
- Supports Arabic and English with automatic RTL layout
- Language context provides translations throughout the app
- Seamless language switching with persistent user preference

### Theme Support
- Dark and light theme modes with system preference detection
- CSS custom properties for consistent theming
- Smooth transitions between theme changes

### Search Functionality
- Debounced search input to reduce API calls
- Real-time search results as you type
- Search history and popular podcasts caching in Supabase

### Responsive Design
- Mobile-first approach with Tailwind CSS
- Grid and list view toggles for different screen sizes
- Optimized navigation and search bar for mobile devices

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
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

MIT License - see LICENSE file for details.