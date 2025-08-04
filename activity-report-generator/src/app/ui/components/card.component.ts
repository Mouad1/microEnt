import { Component, Input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

export type CardVariant = 'default' | 'elevated' | 'outlined' | 'glass';

@Component({
  selector: 'ui-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="cardClasses()">
      @if (header) {
      <div class="card-header px-6 py-4 border-b border-slate-200">
        <ng-content select="[slot=header]"></ng-content>
      </div>
      }
      <div class="card-body p-6">
        <ng-content></ng-content>
      </div>
      @if (footer) {
      <div
        class="card-footer px-6 py-4 border-t border-slate-200 bg-slate-50 rounded-b-xl"
      >
        <ng-content select="[slot=footer]"></ng-content>
      </div>
      }
    </div>
  `,
})
export class CardComponent {
  @Input() variant: CardVariant = 'default';
  @Input() hover = false;
  @Input() header = false;
  @Input() footer = false;

  cardClasses = computed(() => {
    const baseClasses =
      'rounded-xl overflow-hidden transition-all duration-300';

    const variantClasses = {
      default: 'bg-white border border-slate-200 shadow-soft',
      elevated: 'bg-white shadow-protocol hover:shadow-protocol-lg',
      outlined: 'bg-white border-2 border-slate-200 hover:border-indigo-300',
      glass:
        'bg-white/95 backdrop-blur-sm border border-slate-200/50 shadow-protocol',
    };

    const hoverClass = this.hover ? 'hover:scale-105 cursor-pointer' : '';

    return `${baseClasses} ${variantClasses[this.variant]} ${hoverClass}`;
  });
}
