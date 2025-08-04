import { Component, Input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

export type BadgeVariant =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'outline';
export type BadgeSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'ui-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span [class]="badgeClasses()">
      @if (icon) {
      <span class="mr-1">{{ icon }}</span>
      }
      <ng-content></ng-content>
    </span>
  `,
})
export class BadgeComponent {
  @Input() variant: BadgeVariant = 'default';
  @Input() size: BadgeSize = 'md';
  @Input() icon = '';

  badgeClasses = computed(() => {
    const baseClasses = 'inline-flex items-center font-medium rounded-full';

    const sizeClasses = {
      sm: 'px-2 py-1 text-xs',
      md: 'px-2.5 py-1.5 text-xs',
      lg: 'px-3 py-2 text-sm',
    };

    const variantClasses = {
      default: 'bg-slate-100 text-slate-800 border border-slate-200',
      primary:
        'bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 border border-indigo-200',
      secondary: 'bg-slate-100 text-slate-700 border border-slate-200',
      success: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
      warning: 'bg-amber-100 text-amber-800 border border-amber-200',
      danger: 'bg-red-100 text-red-800 border border-red-200',
      outline: 'bg-transparent text-slate-600 border border-slate-300',
    };

    return `${baseClasses} ${sizeClasses[this.size]} ${
      variantClasses[this.variant]
    }`;
  });
}
