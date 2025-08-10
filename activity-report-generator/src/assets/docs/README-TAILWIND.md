# 🎨 Create Your Visual Identity with Tailwind CSS + Angular + Nx

A step-by-step guide to building a professional design system for your Angular applications using Tailwind CSS in an Nx workspace.

## 🚀 Quick Start

### 1. Add Tailwind to Your Nx Project

```bash
# For existing Angular app
npx nx g @nx/angular:setup-tailwind your-app-name

# For new Angular app with Tailwind
npx nx g @nx/angular:app your-app-name --add-tailwind
```

### 2. Install Essential Plugins

```bash
npm install -D @tailwindcss/forms @tailwindcss/typography
```

### 3. Create Your Brand Identity

Update `tailwind.config.js` with your custom theme:

```javascript
const { createGlobPatternsForDependencies } = require("@nx/angular/tailwind");
const { join } = require("path");

module.exports = {
  content: [join(__dirname, "src/**/!(*.stories|*.spec).{ts,html}"), ...createGlobPatternsForDependencies(__dirname)],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eff6ff",
          500: "#3b82f6",
          600: "#2563eb", // Your main brand color
          700: "#1d4ed8",
        },
        secondary: {
          50: "#f8fafc",
          500: "#64748b",
          600: "#475569",
          900: "#0f172a",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 2px 15px -3px rgba(0, 0, 0, 0.07)",
        glow: "0 0 20px rgba(59, 130, 246, 0.15)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/typography")],
};
```

### 4. Add Google Fonts & Base Styles

Update `src/styles.scss`:

```scss
@tailwind base;
@tailwind components;
@tailwind utilities;

@import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap");

body {
  font-family: "Inter", system-ui, sans-serif;
}
```

## 🧱 Build Reusable Components

### Create a UI Library

```bash
npx nx g @nx/angular:lib ui
npx nx g @nx/angular:component button --project=ui
```

### Example: Smart Button Component

```typescript
import { Component, Input, signal } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "ui-button",
  standalone: true,
  imports: [CommonModule],
  template: `
    <button [class]="buttonClasses()">
      <ng-content></ng-content>
    </button>
  `,
})
export class ButtonComponent {
  @Input() variant = signal<"primary" | "secondary">("primary");
  @Input() size = signal<"sm" | "md" | "lg">("md");

  buttonClasses = signal(() => {
    const base = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2";

    const variants = {
      primary: "bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500",
      secondary: "bg-secondary-100 text-secondary-700 hover:bg-secondary-200 focus:ring-secondary-500",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-xs",
      md: "px-4 py-2 text-sm",
      lg: "px-6 py-3 text-base",
    };

    return `${base} ${variants[this.variant()]} ${sizes[this.size()]}`;
  });
}
```

## 🔄 Share Across Multiple Apps

### Option 1: Shared Design System Library

```bash
npx nx g @nx/angular:lib design-system
```

Create `libs/design-system/tailwind.preset.js`:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eff6ff",
          600: "#2563eb",
          700: "#1d4ed8",
        },
        // ... your brand colors
      },
    },
  },
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/typography")],
};
```

Use in each app's `tailwind.config.js`:

```javascript
const { createGlobPatternsForDependencies } = require("@nx/angular/tailwind");
const { join } = require("path");
const sharedConfig = require("../../libs/design-system/tailwind.preset");

module.exports = {
  presets: [sharedConfig],
  content: [join(__dirname, "src/**/!(*.stories|*.spec).{ts,html}"), ...createGlobPatternsForDependencies(__dirname)],
};
```

### Option 2: CSS Variables for Multiple Themes

Use CSS variables in your Tailwind config:

```javascript
colors: {
  primary: {
    50: 'var(--primary-50)',
    600: 'var(--primary-600)',
  },
},
```

Then define different values per app:

```scss
/* App 1 - Blue theme */
:root {
  --primary-50: #eff6ff;
  --primary-600: #2563eb;
}

/* App 2 - Green theme */
:root {
  --primary-50: #f0fdf4;
  --primary-600: #16a34a;
}
```

## 💡 Pro Tips

1. **Use Nx dependency utilities:** The `createGlobPatternsForDependencies` function automatically includes styles from your Nx libraries.

2. **Semantic naming:** Use `primary`, `secondary`, `success`, `warning`, `danger` instead of color names.

3. **Component composition:** Build small, reusable components that combine well together.

4. **Performance:** Be specific with your content paths to optimize bundle size.

## 🛠️ Troubleshooting

**Issue: Styles not loading?**

- Check `@tailwind` directives are in your main styles file
- Verify content paths in `tailwind.config.js` include all your files

**Issue: PostCSS errors?**

```bash
npm install -D tailwindcss@^3.4.0 postcss autoprefixer
```

**Issue: Build errors?**

```bash
npx nx reset  # Clear Nx cache
```

## 🎯 Result

You now have:

- ✅ Professional visual identity
- ✅ Consistent design system
- ✅ Reusable components
- ✅ Multi-app scalability
- ✅ Type-safe styling with Angular

## 📚 Learn More

- [Full Setup Guide](./TAILWIND_SETUP_GUIDE.md)
- [Nx + Tailwind Docs](https://nx.dev/technologies/angular/recipes/using-tailwind-css-with-angular-projects)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

---

**Found this helpful? ⭐ Star this repo and share with the community!**

_Building professional Angular apps has never been easier with this powerful combination of tools._
