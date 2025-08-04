import {
  Component,
  Input,
  Output,
  EventEmitter,
  computed,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'danger'
  | 'success';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

@Component({
  selector: 'ui-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      [type]="type"
      [disabled]="disabled || loading()"
      [class]="buttonClasses()"
      (click)="handleClick($event)"
    >
      @if (loading()) {
      <svg class="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        ></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      } @if (icon && !loading()) {
      <span class="mr-2">{{ icon }}</span>
      }
      <ng-content></ng-content>
    </button>
  `,
})
export class ButtonComponent {
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'md';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() disabled = false;
  @Input() icon?: string;
  @Input() fullWidth = false;

  loading = signal(false);
  @Input() set isLoading(value: boolean) {
    this.loading.set(value);
  }

  @Output() onClick = new EventEmitter<Event>();

  buttonClasses = computed(() => {
    const baseClasses =
      'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const sizeClasses = {
      sm: 'px-3 py-2 text-sm rounded-lg',
      md: 'px-4 py-2.5 text-sm rounded-lg',
      lg: 'px-6 py-3 text-base rounded-xl',
      xl: 'px-8 py-4 text-lg rounded-xl',
    };

    const variantClasses = {
      primary:
        'bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white shadow-glow hover:shadow-glow-lg focus:ring-indigo-500 transform hover:-translate-y-0.5',
      secondary:
        'bg-slate-100 hover:bg-slate-200 text-slate-900 focus:ring-slate-500 border border-slate-200',
      outline:
        'border border-slate-300 hover:border-indigo-500 text-slate-700 hover:text-indigo-600 hover:bg-indigo-50 focus:ring-indigo-500',
      ghost:
        'text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 focus:ring-indigo-500',
      danger:
        'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white focus:ring-red-500 transform hover:-translate-y-0.5',
      success:
        'bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white focus:ring-emerald-500 transform hover:-translate-y-0.5',
    };

    const widthClass = this.fullWidth ? 'w-full' : '';

    return `${baseClasses} ${sizeClasses[this.size]} ${
      variantClasses[this.variant]
    } ${widthClass}`;
  });

  handleClick(event: Event) {
    if (!this.disabled && !this.loading()) {
      this.onClick.emit(event);
    }
  }
}
