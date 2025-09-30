# MongoDB UI

A modern, feature-rich MongoDB database management tool built with React, TypeScript, and Electron.

## Features

- 🔗 **Connection Management** - Easily connect to MongoDB databases with SSL support
- 📊 **Database Explorer** - Browse databases, collections, and documents
- 🎨 **Modern UI** - Dark/light theme with smooth animations
- ⚡ **Fast Performance** - Built with Vite for lightning-fast development
- 🔧 **Developer Friendly** - Full TypeScript support with comprehensive tooling
- 📱 **Cross Platform** - Works on Windows, macOS, and Linux

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **State Management**: Zustand
- **Animations**: Framer Motion
- **Icons**: Heroicons
- **Build Tool**: Vite
- **Desktop**: Electron
- **Testing**: Vitest, React Testing Library
- **Linting**: ESLint, Prettier

## Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/maifeeulasad/mongo-ui.git
cd mongo-ui
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

This will start both the React development server and Electron app.

## Available Scripts

### Development
- `npm run dev` - Start development with hot reload
- `npm run dev:react` - Start only React development server
- `npm run dev:electron` - Start only Electron (requires React server)

### Building
- `npm run build` - Build for production
- `npm run build:react` - Build React app only
- `npm run build:electron` - Build Electron main process

### Distribution
- `npm run dist` - Create distributable packages
- `npm run dist:win` - Build Windows installer
- `npm run dist:mac` - Build macOS DMG
- `npm run dist:linux` - Build Linux AppImage

### Code Quality
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm run type-check` - Run TypeScript type checking

### Testing
- `npm test` - Run tests
- `npm run test:ui` - Run tests with UI
- `npm run test:coverage` - Run tests with coverage

## Project Structure

```
mongo-ui/
├── electron/          # Electron main process files
│   ├── main.ts       # Main Electron process
│   ├── preload.ts    # Preload script
│   └── utils.ts      # Electron utilities
├── src/              # React application source
│   ├── components/   # Reusable UI components
│   ├── pages/        # Page components
│   ├── hooks/        # Custom React hooks
│   ├── store/        # Zustand stores
│   ├── types/        # TypeScript type definitions
│   ├── utils/        # Utility functions
│   └── test/         # Test utilities
├── public/           # Static assets
└── dist/             # Build output
```

## Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Development
NODE_ENV=development

# Application
VITE_APP_NAME=MongoDB UI
VITE_APP_VERSION=1.0.0
```

### Build Configuration

The project uses several configuration files:

- `vite.config.ts` - Vite configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `tsconfig.json` - TypeScript configuration
- `electron-builder.yml` - Electron Builder configuration
- `.eslintrc.cjs` - ESLint configuration
- `.prettierrc.json` - Prettier configuration

## Usage

### Creating Connections

1. Click the "+" button in the sidebar or go to Connections page
2. Fill in your MongoDB connection details
3. Test the connection and save

### Browsing Data

1. Select a connection from the sidebar
2. Browse databases and collections
3. View and edit documents

### Keyboard Shortcuts

- `Ctrl/Cmd + N` - New connection
- `Ctrl/Cmd + Q` - Quit application
- `F5` - Reload
- `F12` - Toggle developer tools

## Development

### Adding Dependencies

```bash
# Production dependency
npm install package-name

# Development dependency  
npm install -D package-name
```

### Custom Components

Components follow this structure:
```tsx
import { ComponentProps } from 'react'
import { cn } from '@/utils'

interface MyComponentProps extends ComponentProps<'div'> {
  title: string
}

export function MyComponent({ title, className, ...props }: MyComponentProps) {
  return (
    <div className={cn('base-styles', className)} {...props}>
      {title}
    </div>
  )
}
```

### State Management

Using Zustand for state management:
```tsx
import { create } from 'zustand'

interface Store {
  count: number
  increment: () => void
}

export const useStore = create<Store>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}))
```

## Building for Distribution

### Windows
```bash
npm run dist:win
```

### macOS
```bash
npm run dist:mac
```

### Linux
```bash
npm run dist:linux
```

Built packages will be in the `release/` directory.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Run the test suite
6. Submit a pull request

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Support

- 📧 Email: support@mongo-ui.dev
- 🐛 Issues: [GitHub Issues](https://github.com/maifeeulasad/mongo-ui/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/maifeeulasad/mongo-ui/discussions)

---

Made with ❤️ using React, TypeScript, and Electron