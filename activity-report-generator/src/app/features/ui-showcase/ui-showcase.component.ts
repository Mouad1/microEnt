import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  ButtonComponent,
  CardComponent,
  InputComponent,
  BadgeComponent,
  ModalComponent,
  LoadingComponent,
} from '../../ui';

@Component({
  selector: 'app-ui-showcase',
  standalone: true,
  imports: [
    CommonModule,
    ButtonComponent,
    CardComponent,
    InputComponent,
    BadgeComponent,
    ModalComponent,
    LoadingComponent,
  ],
  template: `
    <div class="min-h-screen bg-slate-50 py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h1 class="text-4xl font-bold text-slate-900 mb-4">
            UI Components Library
          </h1>
          <p class="text-xl text-slate-600 max-w-3xl mx-auto">
            A comprehensive collection of reusable UI components built with
            Angular and Tailwind CSS
          </p>
        </div>

        <!-- Buttons Section -->
        <section class="mb-16">
          <h2 class="text-2xl font-bold text-slate-900 mb-6">Buttons</h2>
          <ui-card variant="default" class="mb-8">
            <div class="space-y-6">
              <!-- Button Variants -->
              <div>
                <h3 class="text-lg font-semibold text-slate-700 mb-3">
                  Variants
                </h3>
                <div class="flex flex-wrap gap-3">
                  <ui-button variant="primary">Primary</ui-button>
                  <ui-button variant="secondary">Secondary</ui-button>
                  <ui-button variant="outline">Outline</ui-button>
                  <ui-button variant="ghost">Ghost</ui-button>
                  <ui-button variant="success">Success</ui-button>
                  <ui-button variant="danger">Danger</ui-button>
                </div>
              </div>

              <!-- Button Sizes -->
              <div>
                <h3 class="text-lg font-semibold text-slate-700 mb-3">Sizes</h3>
                <div class="flex flex-wrap items-center gap-3">
                  <ui-button variant="primary" size="sm">Small</ui-button>
                  <ui-button variant="primary" size="md">Medium</ui-button>
                  <ui-button variant="primary" size="lg">Large</ui-button>
                  <ui-button variant="primary" size="xl">Extra Large</ui-button>
                </div>
              </div>

              <!-- Button States -->
              <div>
                <h3 class="text-lg font-semibold text-slate-700 mb-3">
                  States
                </h3>
                <div class="flex flex-wrap gap-3">
                  <ui-button variant="primary" icon="🚀">With Icon</ui-button>
                  <ui-button variant="primary" [isLoading]="true"
                    >Loading</ui-button
                  >
                  <ui-button variant="primary" [disabled]="true"
                    >Disabled</ui-button
                  >
                  <ui-button variant="primary" [fullWidth]="true"
                    >Full Width</ui-button
                  >
                </div>
              </div>
            </div>
          </ui-card>
        </section>

        <!-- Cards Section -->
        <section class="mb-16">
          <h2 class="text-2xl font-bold text-slate-900 mb-6">Cards</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ui-card variant="default">
              <h3 class="text-lg font-semibold mb-2">Default Card</h3>
              <p class="text-slate-600">
                Basic card with subtle shadow and border.
              </p>
            </ui-card>

            <ui-card variant="elevated">
              <h3 class="text-lg font-semibold mb-2">Elevated Card</h3>
              <p class="text-slate-600">
                Card with protocol-style shadow for more emphasis.
              </p>
            </ui-card>

            <ui-card variant="glass">
              <h3 class="text-lg font-semibold mb-2">Glass Card</h3>
              <p class="text-slate-600">
                Semi-transparent card with backdrop blur effect.
              </p>
            </ui-card>

            <ui-card variant="outlined">
              <h3 class="text-lg font-semibold mb-2">Outlined Card</h3>
              <p class="text-slate-600">
                Card with prominent border and hover effects.
              </p>
            </ui-card>

            <ui-card variant="default" [hover]="true">
              <h3 class="text-lg font-semibold mb-2">Hoverable Card</h3>
              <p class="text-slate-600">
                Interactive card with hover scale effect.
              </p>
            </ui-card>

            <ui-card variant="default" [header]="true" [footer]="true">
              <div slot="header">
                <h3 class="text-lg font-semibold">Card with Header & Footer</h3>
              </div>
              <p class="text-slate-600">
                This card demonstrates header and footer slots.
              </p>
              <div slot="footer" class="flex justify-end">
                <ui-button variant="primary" size="sm">Action</ui-button>
              </div>
            </ui-card>
          </div>
        </section>

        <!-- Inputs Section -->
        <section class="mb-16">
          <h2 class="text-2xl font-bold text-slate-900 mb-6">Input Fields</h2>
          <ui-card variant="default">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ui-input
                label="Basic Input"
                placeholder="Enter some text..."
                hint="This is a helpful hint"
              ></ui-input>

              <ui-input
                label="Email Input"
                type="email"
                placeholder="your@email.com"
                prefixIcon="📧"
              ></ui-input>

              <ui-input
                label="Password Input"
                type="password"
                placeholder="Enter password"
                suffixIcon="🔒"
              ></ui-input>

              <ui-input
                label="Required Field"
                placeholder="Required input"
                [required]="true"
                hint="This field is required"
              ></ui-input>

              <ui-input
                label="Input with Error"
                placeholder="Invalid input"
                error="This field has an error"
              ></ui-input>

              <ui-input
                label="Disabled Input"
                placeholder="Can't edit this"
                [disabled]="true"
              ></ui-input>
            </div>
          </ui-card>
        </section>

        <!-- Badges Section -->
        <section class="mb-16">
          <h2 class="text-2xl font-bold text-slate-900 mb-6">Badges</h2>
          <ui-card variant="default">
            <div class="space-y-6">
              <!-- Badge Variants -->
              <div>
                <h3 class="text-lg font-semibold text-slate-700 mb-3">
                  Variants
                </h3>
                <div class="flex flex-wrap gap-3">
                  <ui-badge variant="default">Default</ui-badge>
                  <ui-badge variant="primary">Primary</ui-badge>
                  <ui-badge variant="secondary">Secondary</ui-badge>
                  <ui-badge variant="success">Success</ui-badge>
                  <ui-badge variant="warning">Warning</ui-badge>
                  <ui-badge variant="danger">Danger</ui-badge>
                  <ui-badge variant="outline">Outline</ui-badge>
                </div>
              </div>

              <!-- Badge Sizes -->
              <div>
                <h3 class="text-lg font-semibold text-slate-700 mb-3">Sizes</h3>
                <div class="flex flex-wrap items-center gap-3">
                  <ui-badge variant="primary" size="sm">Small</ui-badge>
                  <ui-badge variant="primary" size="md">Medium</ui-badge>
                  <ui-badge variant="primary" size="lg">Large</ui-badge>
                </div>
              </div>

              <!-- Badge with Icons -->
              <div>
                <h3 class="text-lg font-semibold text-slate-700 mb-3">
                  With Icons
                </h3>
                <div class="flex flex-wrap gap-3">
                  <ui-badge variant="success" icon="✓">Available</ui-badge>
                  <ui-badge variant="warning" icon="⏳">Pending</ui-badge>
                  <ui-badge variant="danger" icon="✗">Unavailable</ui-badge>
                </div>
              </div>
            </div>
          </ui-card>
        </section>

        <!-- Loading Section -->
        <section class="mb-16">
          <h2 class="text-2xl font-bold text-slate-900 mb-6">
            Loading Indicators
          </h2>
          <ui-card variant="default">
            <div class="space-y-8">
              <!-- Loading Variants -->
              <div>
                <h3 class="text-lg font-semibold text-slate-700 mb-3">
                  Variants
                </h3>
                <div class="flex items-center gap-8">
                  <ui-loading variant="spinner" text="Loading..."></ui-loading>
                  <ui-loading variant="dots" text="Processing..."></ui-loading>
                  <ui-loading
                    variant="pulse"
                    text="Please wait..."
                  ></ui-loading>
                </div>
              </div>

              <!-- Loading Sizes -->
              <div>
                <h3 class="text-lg font-semibold text-slate-700 mb-3">Sizes</h3>
                <div class="flex items-center gap-6">
                  <ui-loading variant="spinner" size="sm"></ui-loading>
                  <ui-loading variant="spinner" size="md"></ui-loading>
                  <ui-loading variant="spinner" size="lg"></ui-loading>
                  <ui-loading variant="spinner" size="xl"></ui-loading>
                </div>
              </div>

              <!-- Centered Loading -->
              <div>
                <h3 class="text-lg font-semibold text-slate-700 mb-3">
                  Centered
                </h3>
                <div class="h-32 bg-slate-100 rounded-lg flex items-center">
                  <ui-loading
                    variant="spinner"
                    size="lg"
                    text="Loading content..."
                    [center]="true"
                  ></ui-loading>
                </div>
              </div>
            </div>
          </ui-card>
        </section>

        <!-- Modal Section -->
        <section class="mb-16">
          <h2 class="text-2xl font-bold text-slate-900 mb-6">Modal</h2>
          <ui-card variant="default">
            <div class="space-y-4">
              <p class="text-slate-600">
                Click the buttons below to open different modal variations:
              </p>
              <div class="flex flex-wrap gap-3">
                <ui-button variant="primary" (onClick)="openBasicModal()"
                  >Basic Modal</ui-button
                >
                <ui-button variant="secondary" (onClick)="openModalWithFooter()"
                  >Modal with Footer</ui-button
                >
                <ui-button variant="outline" (onClick)="openLargeModal()"
                  >Large Modal</ui-button
                >
              </div>
            </div>
          </ui-card>
        </section>

        <!-- Back to Dashboard -->
        <div class="text-center">
          <ui-button variant="outline" size="lg" (onClick)="goBack()">
            ← Back to Dashboard
          </ui-button>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <ui-modal
      [isModalOpen]="showBasicModal()"
      title="Basic Modal"
      (onClose)="closeBasicModal()"
    >
      <p class="text-slate-600 mb-4">
        This is a basic modal example. It demonstrates the modal component with
        a title and close functionality.
      </p>
      <p class="text-slate-600">
        You can click outside the modal or press the Escape key to close it.
      </p>
    </ui-modal>

    <ui-modal
      [isModalOpen]="showFooterModal()"
      title="Modal with Footer"
      [hasFooter]="true"
      (onClose)="closeFooterModal()"
    >
      <p class="text-slate-600 mb-4">
        This modal includes a footer section where you can place action buttons
        or additional content.
      </p>
      <div slot="footer">
        <ui-button variant="outline" size="sm" (onClick)="closeFooterModal()"
          >Cancel</ui-button
        >
        <ui-button variant="primary" size="sm" (onClick)="closeFooterModal()"
          >Confirm</ui-button
        >
      </div>
    </ui-modal>

    <ui-modal
      [isModalOpen]="showLargeModal()"
      title="Large Modal"
      size="lg"
      (onClose)="closeLargeModal()"
    >
      <div class="space-y-4">
        <p class="text-slate-600">
          This is a larger modal that can accommodate more content. It's perfect
          for forms, detailed information, or complex interactions.
        </p>
        <ui-input
          label="Example Input"
          placeholder="Try typing something..."
          hint="This input works inside the modal"
        ></ui-input>
        <p class="text-slate-600">
          The modal maintains proper focus management and accessibility features
          while being fully customizable.
        </p>
      </div>
    </ui-modal>
  `,
})
export class UiShowcaseComponent {
  showBasicModal = signal(false);
  showFooterModal = signal(false);
  showLargeModal = signal(false);

  constructor(private readonly router: Router) {}

  openBasicModal() {
    this.showBasicModal.set(true);
  }

  closeBasicModal() {
    this.showBasicModal.set(false);
  }

  openModalWithFooter() {
    this.showFooterModal.set(true);
  }

  closeFooterModal() {
    this.showFooterModal.set(false);
  }

  openLargeModal() {
    this.showLargeModal.set(true);
  }

  closeLargeModal() {
    this.showLargeModal.set(false);
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }
}
