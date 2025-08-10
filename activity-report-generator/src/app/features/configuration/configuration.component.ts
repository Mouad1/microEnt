import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-configuration',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="configuration-container">
      <h1 class="page-title">System Configuration</h1>
      <p class="admin-notice">
        This section is only accessible to administrators.
      </p>

      <div class="config-sections">
        <div class="config-card">
          <h2>User Management</h2>
          <p>Manage users, roles, and permissions</p>
          <button class="btn btn-primary">Manage Users</button>
        </div>

        <div class="config-card">
          <h2>System Settings</h2>
          <p>Configure system-wide settings and preferences</p>
          <button class="btn btn-primary">System Settings</button>
        </div>

        <div class="config-card">
          <h2>Report Templates</h2>
          <p>Manage and customize report templates</p>
          <button class="btn btn-primary">Template Settings</button>
        </div>

        <div class="config-card">
          <h2>API Configuration</h2>
          <p>Configure external APIs and integrations</p>
          <button class="btn btn-primary">API Settings</button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .configuration-container {
        padding: 2rem;
        max-width: 1200px;
        margin: 0 auto;
      }

      .page-title {
        font-size: 2.5rem;
        font-weight: bold;
        color: #1f2937;
        margin-bottom: 0.5rem;
      }

      .admin-notice {
        color: #6b7280;
        margin-bottom: 2rem;
        font-style: italic;
      }

      .config-sections {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 1.5rem;
      }

      .config-card {
        background: white;
        border: 1px solid #e5e7eb;
        border-radius: 0.5rem;
        padding: 1.5rem;
        box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
        transition: box-shadow 0.2s;
      }

      .config-card:hover {
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      }

      .config-card h2 {
        font-size: 1.25rem;
        font-weight: 600;
        color: #1f2937;
        margin-bottom: 0.5rem;
      }

      .config-card p {
        color: #6b7280;
        margin-bottom: 1rem;
      }

      .btn {
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 0.375rem;
        font-weight: 500;
        cursor: pointer;
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
export class ConfigurationComponent {}
