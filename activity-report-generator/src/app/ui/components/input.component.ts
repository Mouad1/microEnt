import {
  Component,
  Input,
  Output,
  EventEmitter,
  forwardRef,
  computed,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export type InputSize = 'sm' | 'md' | 'lg';
export type InputType =
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'tel'
  | 'url';

@Component({
  selector: 'ui-input',
  standalone: true,
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
  template: `
    <div class="relative">
      @if (label) {
      <label [for]="id" class="block text-sm font-medium text-slate-700 mb-2">
        {{ label }}
        @if (required) {
        <span class="text-red-500 ml-1">*</span>
        }
      </label>
      }

      <div class="relative">
        @if (prefixIcon) {
        <div
          class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
        >
          <span class="text-slate-400">{{ prefixIcon }}</span>
        </div>
        }

        <input
          [id]="id"
          [type]="type"
          [placeholder]="placeholder"
          [disabled]="disabled"
          [readonly]="readonly"
          [value]="value()"
          [class]="inputClasses()"
          (input)="onInput($event)"
          (blur)="onBlur()"
          (focus)="onFocus()"
        />

        @if (suffixIcon) {
        <div
          class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"
        >
          <span class="text-slate-400">{{ suffixIcon }}</span>
        </div>
        }
      </div>

      @if (hint || error) {
      <p [class]="hintClasses()">
        {{ error || hint }}
      </p>
      }
    </div>
  `,
})
export class InputComponent implements ControlValueAccessor {
  @Input() id = '';
  @Input() label = '';
  @Input() placeholder = '';
  @Input() type: InputType = 'text';
  @Input() size: InputSize = 'md';
  @Input() disabled = false;
  @Input() readonly = false;
  @Input() required = false;
  @Input() prefixIcon = '';
  @Input() suffixIcon = '';
  @Input() hint = '';
  @Input() error = '';

  @Output() onInputChange = new EventEmitter<string>();
  @Output() onInputFocus = new EventEmitter<void>();
  @Output() onInputBlur = new EventEmitter<void>();

  value = signal('');
  isFocused = signal(false);

  private onChange = (value: string) => {};
  private onTouched = () => {};

  inputClasses = computed(() => {
    const baseClasses =
      'block w-full border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1';

    const sizeClasses = {
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-2.5 text-sm',
      lg: 'px-4 py-3 text-base',
    };

    let stateClasses = '';
    if (this.error) {
      stateClasses = 'border-red-300 focus:border-red-500 focus:ring-red-500';
    } else if (this.isFocused()) {
      stateClasses =
        'border-indigo-500 focus:border-indigo-500 focus:ring-indigo-500';
    } else {
      stateClasses =
        'border-slate-300 hover:border-slate-400 focus:border-indigo-500 focus:ring-indigo-500';
    }

    const disabledClasses = this.disabled
      ? 'bg-slate-50 cursor-not-allowed'
      : 'bg-white';

    let paddingClasses = '';
    if (this.prefixIcon) {
      paddingClasses = 'pl-10';
    } else if (this.suffixIcon) {
      paddingClasses = 'pr-10';
    }

    return `${baseClasses} ${
      sizeClasses[this.size]
    } ${stateClasses} ${disabledClasses} ${paddingClasses}`;
  });

  hintClasses = computed(() => {
    const baseClasses = 'mt-2 text-sm';
    const colorClasses = this.error ? 'text-red-600' : 'text-slate-500';
    return `${baseClasses} ${colorClasses}`;
  });

  onInput(event: Event) {
    const target = event.target as HTMLInputElement;
    const newValue = target.value;
    this.value.set(newValue);
    this.onChange(newValue);
    this.onInputChange.emit(newValue);
  }

  onFocus() {
    this.isFocused.set(true);
    this.onInputFocus.emit();
  }

  onBlur() {
    this.isFocused.set(false);
    this.onTouched();
    this.onInputBlur.emit();
  }

  // ControlValueAccessor implementation
  writeValue(value: string): void {
    this.value.set(value || '');
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
