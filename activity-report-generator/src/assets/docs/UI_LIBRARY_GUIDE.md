# UI Components Library Documentation

A comprehensive, reusable UI component library built with Angular 19 and Tailwind CSS, featuring a Protocol-inspired design system.

## 🎨 Design Principles

- **Consistency**: All components follow the same design patterns and color schemes
- **Accessibility**: Built with ARIA attributes and keyboard navigation support
- **Flexibility**: Multiple variants, sizes, and states for different use cases
- **Performance**: Optimized with Angular signals and standalone components
- **Developer Experience**: TypeScript support with comprehensive type definitions

## 🚀 Getting Started

### Installation

The UI library is already included in the project. To use components:

```typescript
import { ButtonComponent, CardComponent, InputComponent } from './app/ui';

@Component({
  imports: [ButtonComponent, CardComponent, InputComponent],
  // ... rest of component
})
```

### Import All Components

```typescript
import { UI_COMPONENTS } from './app/ui';

@Component({
  imports: [...UI_COMPONENTS],
  // ... rest of component
})
```

## 📋 Component Reference

### Button Component

Versatile button component with multiple variants and states.

#### Props

- `variant`: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success'
- `size`: 'sm' | 'md' | 'lg' | 'xl'
- `type`: 'button' | 'submit' | 'reset'
- `disabled`: boolean
- `icon`: string
- `fullWidth`: boolean
- `isLoading`: boolean

#### Events

- `onClick`: EventEmitter<Event>

#### Usage

```html
<ui-button variant="primary" size="lg" icon="🚀" (onClick)="handleClick()"> Get Started </ui-button>

<ui-button variant="outline" [isLoading]="loading" [disabled]="isDisabled"> Submit </ui-button>
```

### Card Component

Flexible container component with multiple styling options.

#### Props

- `variant`: 'default' | 'elevated' | 'outlined' | 'glass'
- `hover`: boolean
- `header`: boolean
- `footer`: boolean

#### Slots

- `[slot=header]`: Header content
- `[slot=footer]`: Footer content
- Default: Main content

#### Usage

```html
<ui-card variant="glass" hover="true">
  <h3>Card Title</h3>
  <p>Card content goes here...</p>
</ui-card>

<ui-card variant="default" header="true" footer="true">
  <div slot="header">
    <h3>Card with Header</h3>
  </div>

  <p>Main content</p>

  <div slot="footer">
    <ui-button variant="primary">Action</ui-button>
  </div>
</ui-card>
```

### Input Component

Form input component with validation and accessibility features.

#### Props

- `id`: string
- `label`: string
- `placeholder`: string
- `type`: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url'
- `size`: 'sm' | 'md' | 'lg'
- `disabled`: boolean
- `readonly`: boolean
- `required`: boolean
- `prefixIcon`: string
- `suffixIcon`: string
- `hint`: string
- `error`: string

#### Events

- `onInputChange`: EventEmitter<string>
- `onInputFocus`: EventEmitter<void>
- `onInputBlur`: EventEmitter<void>

#### Usage

```html
<ui-input label="Email Address" type="email" placeholder="your@email.com" prefixIcon="📧" [required]="true" hint="We'll never share your email" (onInputChange)="handleEmailChange($event)"></ui-input>

<ui-input label="Password" type="password" suffixIcon="🔒" error="Password must be at least 8 characters"></ui-input>
```

### Badge Component

Status indicators and labels with different variants.

#### Props

- `variant`: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'outline'
- `size`: 'sm' | 'md' | 'lg'
- `icon`: string

#### Usage

```html
<ui-badge variant="success" icon="✓">Available</ui-badge>
<ui-badge variant="warning" size="lg">Pending</ui-badge>
<ui-badge variant="primary">Featured</ui-badge>
```

### Modal Component

Accessible modal dialogs with customizable sizes and behavior.

#### Props

- `title`: string
- `size`: 'sm' | 'md' | 'lg' | 'xl' | 'full'
- `showCloseButton`: boolean
- `closeOnBackdrop`: boolean
- `hasFooter`: boolean
- `isModalOpen`: boolean

#### Events

- `openChange`: EventEmitter<boolean>
- `onClose`: EventEmitter<void>

#### Methods

- `openModal()`: Opens the modal
- `close()`: Closes the modal

#### Usage

```html
<ui-modal title="Confirmation" [isModalOpen]="showModal" [hasFooter]="true" (onClose)="handleClose()">
  <p>Are you sure you want to continue?</p>

  <div slot="footer">
    <ui-button variant="outline" (onClick)="cancel()">Cancel</ui-button>
    <ui-button variant="primary" (onClick)="confirm()">Confirm</ui-button>
  </div>
</ui-modal>
```

### Loading Component

Loading indicators with multiple styles and sizes.

#### Props

- `variant`: 'spinner' | 'dots' | 'pulse'
- `size`: 'sm' | 'md' | 'lg' | 'xl'
- `text`: string
- `center`: boolean

#### Usage

```html
<ui-loading variant="spinner" size="lg" text="Loading..." [center]="true"></ui-loading>
<ui-loading variant="dots" text="Processing..."></ui-loading>
<ui-loading variant="pulse" size="sm"></ui-loading>
```

## 🎨 Design Tokens

### Colors

The library uses a Protocol-inspired color palette:

```typescript
// Primary (Indigo)
primary: {
  50: '#eef2ff',
  500: '#6366f1',
  600: '#4f46e5',
  700: '#4338ca',
  // ... full scale
}

// Accent (Purple)
accent: {
  50: '#fdf4ff',
  500: '#d946ef',
  600: '#c026d3',
  // ... full scale
}

// Semantic colors
success: emerald palette
warning: amber palette
danger: red palette
```

### Typography

- **Font Family**: Inter (primary), JetBrains Mono (monospace)
- **Font Weights**: 400 (normal), 500 (medium), 600 (semibold), 700 (bold)
- **Text Sizes**: Responsive scale from xs to 7xl

### Shadows

- `shadow-soft`: Subtle shadows for cards
- `shadow-protocol`: Protocol-style shadows
- `shadow-glow`: Colored glow effects
- Custom glow variants for primary and accent colors

### Spacing

Consistent spacing scale using Tailwind's spacing system with custom additions:

- Standard: 0.5rem increments
- Extended: 18 (4.5rem), 88 (22rem), 128 (32rem)

## 🛠 Utilities

### CSS Utilities

```typescript
import { UI_CLASSES, UI_COLORS, cn, responsive } from "./app/ui/utils";

// Combine classes
const classes = cn("base-class", condition && "conditional-class", null);

// Responsive utilities
const responsiveClasses = responsive({
  default: "text-sm",
  md: "text-base",
  lg: "text-lg",
});
```

### Color Utilities

```typescript
// Use predefined color combinations
<div className={UI_COLORS.primary[500]}>Primary background</div>
<div className={UI_COLORS.success[100]}>Success background</div>
```

### Common Patterns

```typescript
// Layout utilities
<div className={UI_CLASSES.layout.container}>
  <div className={UI_CLASSES.layout.flexBetween}>
    {/* Content */}
  </div>
</div>

// Focus styles
<button className={UI_CLASSES.focus.ring}>Accessible button</button>

// Animations
<div className={UI_CLASSES.animation.fadeIn}>Animated content</div>
```

## 🧪 Testing Components

### Unit Testing

Components are designed to be easily testable:

```typescript
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ButtonComponent } from "./button.component";

describe("ButtonComponent", () => {
  let component: ButtonComponent;
  let fixture: ComponentFixture<ButtonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ButtonComponent],
    });
    fixture = TestBed.createComponent(ButtonComponent);
    component = fixture.componentInstance;
  });

  it("should emit onClick when clicked", () => {
    spyOn(component.onClick, "emit");
    const button = fixture.nativeElement.querySelector("button");
    button.click();
    expect(component.onClick.emit).toHaveBeenCalled();
  });
});
```

### Visual Testing

Use the UI Showcase (`/ui-showcase`) to visually test all components and their variations.

## 🔧 Customization

### Extending Components

Components can be extended or wrapped for specific use cases:

```typescript
@Component({
  selector: "app-custom-button",
  template: `
    <ui-button [variant]="variant" [size]="size" [class]="customClasses" (onClick)="handleClick($event)">
      <ng-content></ng-content>
    </ui-button>
  `,
})
export class CustomButtonComponent {
  @Input() customClasses = "";
  // ... additional props and logic
}
```

### Theme Customization

Modify `tailwind.config.js` to customize the theme:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          // Your custom primary colors
        },
      },
    },
  },
};
```

## 📚 Best Practices

### Component Usage

1. **Always use semantic HTML**: Components output semantic HTML elements
2. **Provide labels**: Use proper labels for form inputs
3. **Handle loading states**: Use loading props for async operations
4. **Use appropriate variants**: Choose variants that match your use case
5. **Test accessibility**: Ensure components work with screen readers

### Performance

1. **Lazy load when possible**: Use route-based code splitting
2. **Use OnPush change detection**: Components are optimized for OnPush
3. **Minimize re-renders**: Use signals for state management
4. **Tree-shake unused components**: Import only what you need

### Styling

1. **Use design tokens**: Leverage predefined colors and spacing
2. **Maintain consistency**: Stick to the design system
3. **Avoid custom CSS**: Use Tailwind utilities when possible
4. **Test responsive design**: Ensure components work on all screen sizes

## 🚀 Future Enhancements

### Planned Components

- **Table**: Data tables with sorting and filtering
- **Dropdown**: Menu and select dropdowns
- **Toast**: Notification system
- **Progress**: Progress bars and indicators
- **Tabs**: Tab navigation component
- **Tooltip**: Contextual help tooltips
- **DatePicker**: Date and time selection
- **FileUpload**: File upload with drag-and-drop

### Planned Features

- **Dark mode**: Complete dark theme support
- **Animation library**: Enhanced micro-interactions
- **Form validation**: Integrated validation system
- **Theme builder**: Runtime theme customization
- **Component playground**: Interactive component editor

## 📞 Support

For questions, issues, or contributions:

1. Check existing documentation
2. Visit the UI Showcase for examples
3. Create an issue in the repository
4. Contribute improvements via pull requests

---

**Built with ❤️ for the developer community**
