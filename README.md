# FiveM Releases Viewer

A modern, responsive web application built with SvelteKit that provides an enhanced interface for browsing FiveM resources from the CFX community forum. Features a clean design, advanced filtering, infinite scrolling, and rich preview capabilities.

![SvelteKit](https://img.shields.io/badge/SvelteKit-FF3E00?style=flat&logo=svelte&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap-7952B3?style=flat&logo=bootstrap&logoColor=white)

## ✨ Features

### 🎯 Core Functionality
- **Real-time Forum Integration** - Direct sync with CFX forum releases API
- **Server-side Rendering** - Fast initial page loads with SvelteKit SSR
- **Infinite Scrolling** - Seamless loading of additional resources as you scroll
- **Responsive Design** - Optimized for desktop, tablet, and mobile devices

### 🔍 Advanced Filtering & Sorting
- **Multiple Sort Options**: Latest, Hot, Top Weekly/Monthly/Quarterly/Yearly, Top All Time
- **Resource Type Filtering**: All Resources, Paid Only, Free Only
- **Smart Tag System**: Automatic detection and badges for PAID/FREE resources
- **Framework Detection**: Auto-detection of ESX, QB-Core, Standalone, and other frameworks

### 🎨 User Interface
- **Grid Layout Controls**: Switch between 3-column and 4-column layouts
- **Dark/Light Theme Toggle** with system preference detection
- **Custom Font Selection**: Poppins (default), Inter, Roboto, Open Sans
- **Smart Title Cleaning**: Removes clutter and formats titles consistently
- **Color-coded Resource Cards**: Purple backgrounds for paid, green for free resources

### 📱 Resource Cards
- **Rich Preview Images** with fallback blur backgrounds for resources without images
- **Author Information** with avatars and usernames
- **Engagement Metrics**: View counts, likes, post counts
- **Time Stamps**: Relative time display (X hours/days ago)
- **Framework Badges**: Visual indicators for supported frameworks
- **Resource Type Badges**: Clear PAID/FREE indicators

### 🔗 Enhanced Resource Details
- **Detailed Modal Views** with full resource information
- **YouTube Video Integration**: Automatic detection and preview of YouTube links
- **Tebex Purchase Links**: Direct integration with Tebex store links
- **HTML Content Preview**: Cleaned and formatted forum post previews
- **External Forum Links**: Direct access to original forum threads

### ⚙️ User Preferences
- **Persistent Settings**: All preferences saved to localStorage
- **Settings Modal**: Centralized settings management
- **Responsive Controls**: Intuitive dropdowns and toggles

### 🛠️ Developer Features
- **Admin Tools**: Developer page with database management (admin-only)
- **Cache Management**: Intelligent caching for improved performance
- **API Endpoints**: RESTful API for topic data and previews

## 🚀 Quick Start

### Prerequisites
- **Node.js** v18+ 
- **pnpm** package manager

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd fivem-releases-viewer

# Install dependencies
pnpm install

# Start development server
pnpm run dev
```

The application will be available at `http://localhost:5173`

## 📋 Available Scripts

```bash
# Development
pnpm run dev              # Start development server
pnpm run dev -- --open   # Start dev server and open browser

# Production
pnpm run build           # Build for production
pnpm run preview         # Preview production build

# Code Quality
pnpm run check           # Run type checking
pnpm run check:watch     # Run type checking in watch mode
pnpm run lint            # Run ESLint
pnpm run format          # Format code with Prettier
```

## 🏗️ Project Structure

```
src/
├── lib/
│   ├── components/           # Reusable Svelte components
│   │   ├── InfiniteScroll.svelte    # Infinite scrolling handler
│   │   ├── Modal.svelte             # Resource detail modal
│   │   ├── PageHeader.svelte        # Application header
│   │   ├── ScrollStatus.svelte      # Debug component for scroll state
│   │   ├── SettingsModal.svelte     # User settings interface
│   │   ├── SettingsToggle.svelte    # Settings button
│   │   ├── ThemeToggle.svelte       # Dark/light mode toggle
│   │   ├── TopicCard.svelte         # Resource card component
│   │   └── ViewControls.svelte      # Filtering and layout controls
│   ├── cache.ts                     # Server-side caching utility
│   ├── index.ts                     # Library exports
│   └── types.ts                     # TypeScript type definitions
├── routes/
│   ├── +page.server.ts             # Server-side data loading
│   ├── +page.svelte                # Main application page
│   └── api/                        # API endpoints
│       ├── topic/[id]/preview/     # Individual topic preview API
│       └── topics/                 # Topics listing API
├── app.html                        # HTML template
└── app.d.ts                       # Global type definitions
```

## 🔌 API Integration

### Forum Data Source
- **Primary API**: `https://forum.cfx.re/c/releases/7.json`
- **Supported Endpoints**: Latest, Hot, Top (Weekly/Monthly/Quarterly/Yearly/All Time)
- **Data Processing**: Server-side parsing with user lookup and metadata enhancement

### Internal API Endpoints

#### `GET /api/topics`
Fetch paginated topics with filtering support
```
Query Parameters:
- filter: latest|hot|top-weekly|top-monthly|top-quarterly|top-yearly|top-all
- page: Page number (default: 1)
```

#### `GET /api/topic/[id]/preview`
Fetch detailed content preview for a specific resource
```
Path Parameters:
- id: Topic ID
```

## 🎨 Customization

### Theme System
The application supports both light and dark themes with automatic system preference detection:
- **Light Mode**: Clean, bright interface with subtle shadows
- **Dark Mode**: Dark backgrounds with high contrast text
- **System Preference**: Automatically detects and follows OS theme setting

### Font Options
Users can choose from four carefully selected fonts:
- **Poppins** (default) - Modern, friendly sans-serif
- **Inter** - Highly legible, designed for UI
- **Roboto** - Google's material design font
- **Open Sans** - Humanist sans-serif

### Grid Layouts
Responsive grid system with user-controlled column counts:
- **Desktop (>1200px)**: 3 or 4 columns (user choice)
- **Tablet (768px-1199px)**: 2-3 columns
- **Mobile (<768px)**: 1-2 columns

## 🔧 Configuration

### Environment Setup
The application requires no environment variables for basic functionality. All configuration is handled through:
- **Server-side caching** for API responses
- **Client-side localStorage** for user preferences
- **Responsive CSS** for layout adaptation

### Cache Configuration
- **API Cache Duration**: 5 minutes
- **Preview Cache**: On-demand with intelligent cleanup
- **User Preferences**: Persistent localStorage

## 📚 Technology Stack

### Frontend
- **SvelteKit** - Full-stack framework with SSR
- **TypeScript** - Type-safe development
- **Bootstrap 5** - Responsive CSS framework
- **Custom CSS** - Enhanced styling and animations

### Backend
- **SvelteKit Server Functions** - API routes and SSR
- **Node.js** - Runtime environment
- **In-memory Caching** - Performance optimization

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Vite** - Build tool and dev server
- **TypeScript** - Type checking

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow the existing code style (enforced by Prettier/ESLint)
- Add TypeScript types for new features
- Test responsive design on multiple screen sizes
- Ensure accessibility standards are maintained

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🐛 Known Issues & Future Enhancements

### Potential Improvements
- **Search Functionality**: Full-text search across resource titles and descriptions
- **Bookmarking System**: Save favorite resources for later
- **Advanced Filtering**: Filter by specific frameworks, authors, or date ranges
- **Resource Comparison**: Side-by-side comparison of similar resources
- **Offline Support**: PWA capabilities for offline browsing

### Performance Notes
- Initial page load optimized with SSR
- Image loading optimized with lazy loading and fallbacks
- API responses cached for improved performance
- Infinite scroll implements efficient memory management

---

Built with ❤️ for the FiveM community
