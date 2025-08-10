import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';

export interface DocumentationFile {
  name: string;
  path: string;
  description: string;
  lastModified?: Date;
}

@Injectable({
  providedIn: 'root',
})
export class DocumentationService {
  private readonly docsPath = 'assets/docs';

  private readonly documentationFiles: DocumentationFile[] = [
    {
      name: 'Admin Indicator Fix',
      path: 'ADMIN_INDICATOR_FIX.md',
      description: 'Guide for fixing admin indicator issues',
    },
    {
      name: 'Auth0 Setup',
      path: 'AUTH0_SETUP.md',
      description: 'Complete guide for Auth0 authentication setup',
    },
    {
      name: 'Tailwind README',
      path: 'README-TAILWIND.md',
      description: 'Tailwind CSS implementation guide',
    },
    {
      name: 'Main README',
      path: 'README.md',
      description: 'Main project documentation',
    },
    {
      name: 'Tailwind Setup Guide',
      path: 'TAILWIND_SETUP_GUIDE.md',
      description: 'Step-by-step Tailwind CSS setup instructions',
    },
    {
      name: 'UI Library Guide',
      path: 'UI_LIBRARY_GUIDE.md',
      description: 'Guide for using the custom UI component library',
    },
    {
      name: 'User Testing Guide',
      path: 'USER_TESTING_GUIDE.md',
      description: 'Guidelines and procedures for user testing',
    },
  ];

  constructor(
    private readonly http: HttpClient,
    private readonly authService: AuthService
  ) {}

  /**
   * Get list of available documentation files (Admin only)
   */
  getDocumentationList(): DocumentationFile[] {
    return this.documentationFiles;
  }

  /**
   * Get content of a specific documentation file (Admin only)
   */
  getDocumentationContent(fileName: string): Observable<string> {
    const filePath = `${this.docsPath}/${fileName}`;
    return this.http.get(filePath, { responseType: 'text' });
  }

  /**
   * Check if user has access to documentation (integrates with Auth0)
   * Throws error if access is denied
   */
  hasDocumentationAccess(): Observable<void> {
    return this.authService.isAdmin().pipe(
      map((isAdmin: boolean) => {
        if (!isAdmin) {
          throw new Error('Access denied: Administrator privileges required');
        }
      })
    );
  }
}
