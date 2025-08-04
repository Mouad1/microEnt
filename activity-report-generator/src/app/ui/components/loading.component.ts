import { Component, Input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

export type LoadingSize = 'sm' | 'md' | 'lg' | 'xl';
export type LoadingVariant = 'spinner' | 'dots' | 'pulse';

@Component({
  selector: 'ui-loading',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="containerClasses()">
      @switch (variant) { @case ('spinner') {
      <svg [class]="spinnerClasses()" fill="none" viewBox="0 0 24 24">
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
      } @case ('dots') {
      <div [class]="dotsContainerClasses()">
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
      </div>
      } @case ('pulse') {
      <div [class]="pulseClasses()"></div>
      } } @if (text) {
      <p [class]="textClasses()">{{ text }}</p>
      }
    </div>
  `,
  styles: [
    `
      .dot {
        @apply bg-indigo-600 rounded-full animate-pulse;
      }

      .dot:nth-child(1) {
        animation-delay: 0ms;
      }

      .dot:nth-child(2) {
        animation-delay: 150ms;
      }

      .dot:nth-child(3) {
        animation-delay: 300ms;
      }

      @keyframes pulse-custom {
        0%,
        100% {
          opacity: 1;
        }
        50% {
          opacity: 0.3;
        }
      }

      .pulse-animation {
        animation: pulse-custom 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
      }
    `,
  ],
})
export class LoadingComponent {
  @Input() variant: LoadingVariant = 'spinner';
  @Input() size: LoadingSize = 'md';
  @Input() text = '';
  @Input() center = false;

  containerClasses = computed(() => {
    const baseClasses = 'flex items-center';
    const centerClass = this.center ? 'justify-center' : '';
    const directionClass = this.text ? 'flex-col space-y-2' : '';

    return `${baseClasses} ${centerClass} ${directionClass}`;
  });

  spinnerClasses = computed(() => {
    const baseClasses = 'animate-spin text-indigo-600';

    const sizeClasses = {
      sm: 'h-4 w-4',
      md: 'h-6 w-6',
      lg: 'h-8 w-8',
      xl: 'h-12 w-12',
    };

    return `${baseClasses} ${sizeClasses[this.size]}`;
  });

  dotsContainerClasses = computed(() => {
    const baseClasses = 'flex space-x-1';

    const dotSizeClasses = {
      sm: '[&>.dot]:h-1 [&>.dot]:w-1',
      md: '[&>.dot]:h-2 [&>.dot]:w-2',
      lg: '[&>.dot]:h-3 [&>.dot]:w-3',
      xl: '[&>.dot]:h-4 [&>.dot]:w-4',
    };

    return `${baseClasses} ${dotSizeClasses[this.size]}`;
  });

  pulseClasses = computed(() => {
    const baseClasses = 'bg-indigo-600 rounded-full pulse-animation';

    const sizeClasses = {
      sm: 'h-4 w-4',
      md: 'h-6 w-6',
      lg: 'h-8 w-8',
      xl: 'h-12 w-12',
    };

    return `${baseClasses} ${sizeClasses[this.size]}`;
  });

  textClasses = computed(() => {
    const baseClasses = 'text-slate-600';

    const sizeClasses = {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base',
      xl: 'text-lg',
    };

    return `${baseClasses} ${sizeClasses[this.size]}`;
  });
}
