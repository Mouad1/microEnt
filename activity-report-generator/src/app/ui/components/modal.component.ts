import {
  Component,
  Input,
  Output,
  EventEmitter,
  computed,
  signal,
  effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

@Component({
  selector: 'ui-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (isOpen()) {
    <div
      class="fixed inset-0 z-50 overflow-y-auto"
      (click)="onBackdropClick($event)"
      (keydown.escape)="close()"
      [attr.aria-modal]="true"
      [attr.role]="'dialog'"
    >
      <!-- Backdrop -->
      <div
        class="fixed inset-0 bg-slate-500 bg-opacity-75 transition-opacity duration-300"
      ></div>

      <!-- Modal container -->
      <div class="flex min-h-full items-center justify-center p-4">
        <div
          [class]="modalClasses()"
          class="relative transform rounded-xl bg-white shadow-protocol-lg transition-all duration-300 animate-scale-in"
          (click)="$event.stopPropagation()"
        >
          <!-- Header -->
          @if (title || showCloseButton) {
          <div
            class="flex items-center justify-between p-6 border-b border-slate-200"
          >
            @if (title) {
            <h3 class="text-lg font-semibold text-slate-900">{{ title }}</h3>
            } @if (showCloseButton) {
            <button
              type="button"
              class="text-slate-400 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg p-1"
              (click)="close()"
              [attr.aria-label]="'Close modal'"
            >
              <svg
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            }
          </div>
          }

          <!-- Body -->
          <div class="p-6">
            <ng-content></ng-content>
          </div>

          <!-- Footer -->
          @if (hasFooter) {
          <div
            class="flex justify-end space-x-3 px-6 py-4 border-t border-slate-200 bg-slate-50 rounded-b-xl"
          >
            <ng-content select="[slot=footer]"></ng-content>
          </div>
          }
        </div>
      </div>
    </div>
    }
  `,
})
export class ModalComponent {
  @Input() title = '';
  @Input() size: ModalSize = 'md';
  @Input() showCloseButton = true;
  @Input() closeOnBackdrop = true;
  @Input() hasFooter = false;

  isOpen = signal(false);

  @Input() set isModalOpen(value: boolean) {
    this.isOpen.set(value);
  }

  @Output() openChange = new EventEmitter<boolean>();
  @Output() onClose = new EventEmitter<void>();

  constructor() {
    // Handle body scroll lock
    effect(() => {
      if (this.isOpen()) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    });
  }

  modalClasses = computed(() => {
    const sizeClasses = {
      sm: 'max-w-md w-full',
      md: 'max-w-lg w-full',
      lg: 'max-w-2xl w-full',
      xl: 'max-w-4xl w-full',
      full: 'max-w-7xl w-full mx-4',
    };

    return sizeClasses[this.size];
  });

  openModal() {
    this.isOpen.set(true);
    this.openChange.emit(true);
  }

  close() {
    this.isOpen.set(false);
    this.openChange.emit(false);
    this.onClose.emit();
  }

  onBackdropClick(event: Event) {
    if (this.closeOnBackdrop && event.target === event.currentTarget) {
      this.close();
    }
  }
}
