# MicroEnterprise Management Suite

A comprehensive management suite for microenterprises, freelancers, and small businesses. Built with Angular 19, Nx, and Tailwind CSS with a Protocol-inspired design system.

## ✨ Features

- **📊 Activity Report Generator** - Create professional monthly activity reports for clients
- **🎨 UI Components Library** - Comprehensive, reusable component system
- **💼 Modern Dashboard** - Clean, intuitive interface for managing your business tools
- **🎯 More Features Coming Soon** - Bill generation, freelance calculators, and more

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd activity-report-generator

# Install dependencies
npm install

# Start development server
npm start
```

### Development server

Run `npm start` or `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload when you change source files.

## 🎨 UI Components Library

This project includes a comprehensive UI library built with Angular and Tailwind CSS. All components follow the Protocol-inspired design system with consistent theming and accessibility features.

### Available Components

- **Button** - Multiple variants (primary, secondary, outline, ghost, success, danger) with loading states
- **Card** - Various styles (default, elevated, outlined, glass) with header/footer support
- **Input** - Form inputs with validation, icons, and accessibility features
- **Badge** - Status indicators and labels with different variants and sizes
- **Modal** - Accessible modals with backdrop controls and size options
- **Loading** - Loading indicators (spinner, dots, pulse) in multiple sizes

### Using UI Components

```typescript
import { ButtonComponent, CardComponent, InputComponent } from './app/ui';

@Component({
  imports: [ButtonComponent, CardComponent, InputComponent],
  template: `
    <ui-card variant="glass">
      <ui-input label="Name" placeholder="Enter your name"></ui-input>
      <ui-button variant="primary" size="lg">Submit</ui-button>
    </ui-card>
  `
})
```

Visit `/ui-showcase` in the application to see all components in action with live examples.

## 🛠 Technology Stack

- **Frontend Framework**: Angular 19 with standalone components
- **Build System**: Nx monorepo with optimized builds
- **Styling**: Tailwind CSS v3.4.0 with custom Protocol-inspired theme
- **TypeScript**: Latest version with strict type checking
- **State Management**: Angular Signals for reactive state
- **Icons**: Emoji-based icon system for better accessibility

## 🎨 Design System

The application uses a Protocol-inspired design system with:

- **Colors**: Indigo primary palette with purple accents and sophisticated dark theme
- **Typography**: Inter font family for optimal readability
- **Shadows**: Custom protocol-style shadows and glows
- **Animations**: Smooth transitions and micro-interactions
- **Components**: Consistent, accessible, and reusable UI elements

## 📁 Project Structure

```
src/
├── app/
│   ├── features/          # Feature modules
│   │   ├── dashboard/     # Main dashboard
│   │   ├── activity-report/   # Activity report generator
│   │   └── ui-showcase/   # UI components showcase
│   ├── shared/           # Shared components and services
│   │   └── components/   # Shared components (header, etc.)
│   ├── ui/              # UI Library
│   │   ├── components/  # Reusable UI components
│   │   ├── utils.ts     # UI utilities and helpers
│   │   └── index.ts     # Library exports
│   └── environments/    # Environment configurations
├── assets/              # Static assets
└── styles.scss         # Global styles with Tailwind imports
```

## 🔧 Build and Deployment

### Build for production

```bash
npm run build
```

### Build with Docker

```bash
# Development
docker-compose up

# Production
docker-compose -f docker-compose.dokploy.yml up
```

### Deploy

```bash
# Using the provided deploy script
./deploy.sh
```

## 🧪 Testing

### Unit tests

```bash
npm test
```

### End-to-end tests

```bash
npm run e2e
```

## 📖 Documentation

- [Tailwind Setup Guide](./TAILWIND_SETUP_GUIDE.md) - Complete guide for setting up Tailwind CSS with Nx
- [UI Components Guide](./README-TAILWIND.md) - Detailed component documentation and examples

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Design inspiration from [Protocol](https://tailwindcss.com/plus/templates/protocol)
- Built with [Angular](https://angular.io/) and [Nx](https://nx.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons and illustrations from various open-source projects
