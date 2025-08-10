import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="unauthorized-container">
      <div class="unauthorized-content">
        <div class="icon">
          <svg
            class="w-24 h-24 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 16.5c-.77.833.192 2.5 1.732 2.5z"
            ></path>
          </svg>
        </div>

        <h1 class="title">Access Denied</h1>
        <p class="message">
          You don't have permission to access this page. Contact your
          administrator if you believe this is an error.
        </p>

        <div class="actions">
          <button routerLink="/dashboard" class="btn btn-primary">
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .unauthorized-container {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #f9fafb;
      }

      .unauthorized-content {
        text-align: center;
        max-width: 500px;
        padding: 2rem;
      }

      .icon {
        margin-bottom: 1.5rem;
        display: flex;
        justify-content: center;
      }

      .icon svg {
        width: 6rem;
        height: 6rem;
        color: #ef4444;
      }

      .title {
        font-size: 2rem;
        font-weight: bold;
        color: #1f2937;
        margin-bottom: 1rem;
      }

      .message {
        color: #6b7280;
        margin-bottom: 2rem;
        line-height: 1.6;
      }

      .actions {
        display: flex;
        justify-content: center;
      }

      .btn {
        padding: 0.75rem 1.5rem;
        border: none;
        border-radius: 0.375rem;
        font-weight: 500;
        cursor: pointer;
        text-decoration: none;
        display: inline-block;
        transition: background-color 0.2s;
      }

      .btn-primary {
        background-color: #3b82f6;
        color: white;
      }

      .btn-primary:hover {
        background-color: #2563eb;
      }
    `,
  ],
})
export class UnauthorizedComponent {}
