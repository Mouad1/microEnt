import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { marked } from 'marked';
import {
  DocumentationService,
  DocumentationFile,
} from '../../shared/services/documentation.service';

@Component({
  selector: 'app-documentation-viewer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="documentation-container">
      <h1 class="page-title">Private Documentation</h1>
      <p class="admin-notice">
        This documentation is only accessible to administrators.
      </p>

      <div class="docs-grid">
        <div
          class="doc-card"
          *ngFor="let doc of documentationFiles"
          (click)="selectDocument(doc)"
          [class.selected]="selectedDoc?.path === doc.path"
        >
          <h3>{{ doc.name }}</h3>
          <p>{{ doc.description }}</p>
        </div>
      </div>

      <div class="content-viewer" *ngIf="selectedDoc">
        <div class="content-header">
          <div class="header-left">
            <h2>{{ selectedDoc.name }}</h2>
            <span class="file-path">{{ selectedDoc.path }}</span>
          </div>
          <div class="header-controls">
            <button
              class="btn btn-toggle"
              (click)="toggleView()"
              [class.active]="showRawContent"
            >
              {{ showRawContent ? 'Show Rendered' : 'Show Raw' }}
            </button>
            <button class="btn btn-close" (click)="closeDocument()">✕</button>
          </div>
        </div>
        <div class="content-body">
          <div *ngIf="loading" class="loading">
            <div class="loading-spinner"></div>
            Loading document...
          </div>
          <div
            *ngIf="!loading && !showRawContent && renderedContent"
            class="markdown-content"
            [innerHTML]="renderedContent"
          ></div>
          <div
            *ngIf="!loading && showRawContent && documentContent"
            class="raw-content"
          >
            <pre>{{ documentContent }}</pre>
          </div>
          <div *ngIf="!loading && error" class="error">
            <strong>Error:</strong> {{ error }}
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .documentation-container {
        padding: 2rem;
        max-width: 1400px;
        margin: 0 auto;
      }

      .page-title {
        font-size: 2.5rem;
        font-weight: bold;
        color: #1f2937;
        margin-bottom: 0.5rem;
      }

      .admin-notice {
        color: #dc2626;
        margin-bottom: 2rem;
        font-style: italic;
        font-weight: 500;
      }

      .docs-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 1rem;
        margin-bottom: 2rem;
      }

      .doc-card {
        background: white;
        border: 2px solid #e5e7eb;
        border-radius: 0.5rem;
        padding: 1.5rem;
        cursor: pointer;
        transition: all 0.2s;
      }

      .doc-card:hover {
        border-color: #3b82f6;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      }

      .doc-card.selected {
        border-color: #3b82f6;
        background-color: #eff6ff;
      }

      .doc-card h3 {
        font-size: 1.125rem;
        font-weight: 600;
        color: #1f2937;
        margin-bottom: 0.5rem;
      }

      .doc-card p {
        color: #6b7280;
        font-size: 0.875rem;
      }

      .content-viewer {
        background: white;
        border: 1px solid #e5e7eb;
        border-radius: 0.5rem;
        overflow: hidden;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      }

      .content-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1.5rem;
        background-color: #f9fafb;
        border-bottom: 1px solid #e5e7eb;
      }

      .header-left {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
      }

      .header-controls {
        display: flex;
        gap: 0.75rem;
        align-items: center;
      }

      .content-header h2 {
        font-size: 1.5rem;
        font-weight: 600;
        color: #1f2937;
        margin: 0;
      }

      .file-path {
        font-size: 0.75rem;
        color: #6b7280;
        font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
      }

      .btn {
        border: none;
        border-radius: 0.375rem;
        padding: 0.5rem 0.75rem;
        cursor: pointer;
        font-weight: 500;
        font-size: 0.875rem;
        transition: all 0.2s;
      }

      .btn-toggle {
        background: #f3f4f6;
        color: #374151;
      }

      .btn-toggle:hover {
        background: #e5e7eb;
      }

      .btn-toggle.active {
        background: #3b82f6;
        color: white;
      }

      .btn-close {
        background: #ef4444;
        color: white;
      }

      .btn-close:hover {
        background: #dc2626;
      }

      .content-body {
        padding: 2rem;
        max-height: 600px;
        overflow-y: auto;
      }

      .loading {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
        text-align: center;
        color: #6b7280;
        font-style: italic;
        padding: 2rem;
      }

      .loading-spinner {
        width: 2rem;
        height: 2rem;
        border: 3px solid #e5e7eb;
        border-top: 3px solid #3b82f6;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }

      @keyframes spin {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }

      .error {
        color: #dc2626;
        font-weight: 500;
        background-color: #fef2f2;
        border: 1px solid #fecaca;
        border-radius: 0.5rem;
        padding: 1rem;
        margin: 1rem 0;
      }

      .raw-content {
        font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
        background-color: #1f2937;
        border-radius: 0.5rem;
        margin: 1rem 0;
      }

      .raw-content pre {
        color: #f9fafb;
        padding: 1.5rem;
        margin: 0;
        white-space: pre-wrap;
        line-height: 1.6;
        font-size: 0.875rem;
        overflow-x: auto;
      }

      .markdown-content {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto',
          'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
        line-height: 1.6;
        color: #374151;
      }

      .markdown-content h1 {
        font-size: 2rem;
        font-weight: bold;
        color: #1f2937;
        margin-bottom: 1rem;
        padding-bottom: 0.5rem;
        border-bottom: 2px solid #e5e7eb;
      }

      .markdown-content h2 {
        font-size: 1.5rem;
        font-weight: 600;
        color: #1f2937;
        margin-top: 2rem;
        margin-bottom: 1rem;
        padding-bottom: 0.25rem;
        border-bottom: 1px solid #e5e7eb;
      }

      .markdown-content h3 {
        font-size: 1.25rem;
        font-weight: 600;
        color: #374151;
        margin-top: 1.5rem;
        margin-bottom: 0.75rem;
      }

      .markdown-content h4,
      .markdown-content h5,
      .markdown-content h6 {
        font-size: 1rem;
        font-weight: 600;
        color: #374151;
        margin-top: 1rem;
        margin-bottom: 0.5rem;
      }

      .markdown-content p {
        margin-bottom: 1rem;
        line-height: 1.7;
      }

      .markdown-content ul,
      .markdown-content ol {
        margin-bottom: 1rem;
        padding-left: 2rem;
      }

      .markdown-content li {
        margin-bottom: 0.5rem;
        line-height: 1.6;
      }

      .markdown-content code {
        background-color: #f3f4f6;
        padding: 0.125rem 0.25rem;
        border-radius: 0.25rem;
        font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
        font-size: 0.875rem;
        color: #e53e3e;
      }

      .markdown-content pre {
        background-color: #1f2937;
        color: #f9fafb;
        padding: 1rem;
        border-radius: 0.5rem;
        overflow-x: auto;
        margin-bottom: 1rem;
        font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
        font-size: 0.875rem;
        line-height: 1.5;
      }

      .markdown-content pre code {
        background: none;
        padding: 0;
        color: inherit;
        border-radius: 0;
      }

      .markdown-content blockquote {
        border-left: 4px solid #3b82f6;
        background-color: #eff6ff;
        padding: 1rem;
        margin: 1rem 0;
        font-style: italic;
      }

      .markdown-content table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 1rem;
      }

      .markdown-content th,
      .markdown-content td {
        border: 1px solid #e5e7eb;
        padding: 0.75rem;
        text-align: left;
      }

      .markdown-content th {
        background-color: #f9fafb;
        font-weight: 600;
      }

      .markdown-content a {
        color: #3b82f6;
        text-decoration: underline;
      }

      .markdown-content a:hover {
        color: #2563eb;
      }

      .markdown-content strong {
        font-weight: 600;
      }

      .markdown-content em {
        font-style: italic;
      }

      .markdown-content hr {
        border: none;
        border-top: 2px solid #e5e7eb;
        margin: 2rem 0;
      }

      .markdown-content img {
        max-width: 100%;
        height: auto;
        border-radius: 0.5rem;
        margin: 1rem 0;
      }
    `,
  ],
  providers: [DocumentationService],
})
export class DocumentationViewerComponent implements OnInit {
  documentationFiles: DocumentationFile[] = [];
  selectedDoc: DocumentationFile | null = null;
  documentContent: string = '';
  renderedContent: SafeHtml = '';
  loading = false;
  error: string | null = null;
  showRawContent = false;

  constructor(
    private readonly documentationService: DocumentationService,
    private readonly sanitizer: DomSanitizer
  ) {
    // Configure marked options for better rendering
    marked.setOptions({
      gfm: true, // GitHub Flavored Markdown
      breaks: true, // Convert '\n' in paragraphs into <br>
      pedantic: false, // Don't fix any of the original markdown bugs or poor behavior
    });
  }

  ngOnInit() {
    this.checkDocumentationAccess();
  }

  private checkDocumentationAccess(): void {
    this.documentationService.hasDocumentationAccess().subscribe({
      next: () => this.loadDocumentationFiles(),
      error: (err) => this.handleAccessError(err),
    });
  }

  private handleAccessError(err: any): void {
    console.error('Error checking access:', err);
    this.setAccessDeniedError();
  }

  private loadDocumentationFiles(): void {
    this.documentationFiles = this.documentationService.getDocumentationList();
  }

  private setAccessDeniedError(): void {
    this.error = 'Access denied. Administrator privileges required.';
  }

  selectDocument(doc: DocumentationFile) {
    this.selectedDoc = doc;
    this.loading = true;
    this.error = null;
    this.documentContent = '';
    this.renderedContent = '';

    this.documentationService.getDocumentationContent(doc.path).subscribe({
      next: (content) => {
        this.documentContent = content;
        this.renderMarkdown(content)
          .then(() => {
            this.loading = false;
          })
          .catch((error) => {
            console.error('Error rendering markdown:', error);
            this.error = 'Error rendering markdown content';
            this.loading = false;
          });
      },
      error: (err) => {
        this.error = 'Failed to load document content';
        this.loading = false;
        console.error('Error loading document:', err);
      },
    });
  }

  private async renderMarkdown(content: string): Promise<void> {
    try {
      // Parse markdown to HTML
      const rawHtml = await marked.parse(content);
      // Sanitize the HTML to prevent XSS attacks
      this.renderedContent = this.sanitizer.bypassSecurityTrustHtml(rawHtml);
    } catch (error) {
      console.error('Error rendering markdown:', error);
      this.error = 'Error rendering markdown content';
    }
  }

  toggleView(): void {
    this.showRawContent = !this.showRawContent;
  }

  closeDocument() {
    this.selectedDoc = null;
    this.documentContent = '';
    this.renderedContent = '';
    this.error = null;
    this.showRawContent = false;
  }
}
