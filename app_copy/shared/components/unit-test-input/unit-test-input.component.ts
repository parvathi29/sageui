import { Component, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertBannerComponent } from '../alert-banner/alert-banner.component';

// Define the structure for generated unit tests
interface UnitTest {
  id: string;
  title: string;
  coverage: number;
}

@Component({
  selector: 'app-unit-test-input',
  standalone: true,
  imports: [CommonModule, FormsModule, AlertBannerComponent],
  template: `
    <div class="bg-bg-secondary p-8 rounded-xl shadow-md border border-border-default transition-colors duration-300">
      
      <h2 class="text-2xl font-semibold text-text-default mb-4">Unit Test Case Generation</h2>
      <p class="text-gray-500 dark:text-gray-400 mb-6">
        Generate unit tests from your GitHub repository
      </p>

      <div class="flex space-x-3 mb-6">
        <input type="url" placeholder="https://github.com/orgs/user/repositories"
          class="flex-grow p-3 text-sm rounded-lg border border-border-default bg-bg-primary text-text-default focus:ring-highlight focus:border-highlight"
          [(ngModel)]="githubUrl">
        <button (click)="cloneRepo()" [disabled]="!githubUrl || isCloning"
          class="bg-highlight hover:bg-purple-700 text-white px-6 py-3 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center shadow-lg shadow-highlight/20 disabled:bg-gray-400 dark:disabled:bg-gray-600">
          <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
          <span *ngIf="!isCloning">Clone Repo</span>
          <span *ngIf="isCloning">Cloning...</span>
        </button>
      </div>

      <div *ngIf="generatedTests.length > 0">
        <app-alert-banner 
          [message]="'Unit tests generated: ' + generatedTests.length + ' unit tests created for src/database.py'" 
          [type]="'success'">
        </app-alert-banner>

        <h3 class="text-xl font-semibold text-text-default mt-6 mb-4">Generated Tests</h3>
        
        <div *ngFor="let test of generatedTests" 
             class="flex items-center justify-between p-4 mb-3 bg-bg-primary rounded-lg border border-border-default shadow-sm transition-colors duration-300">
          <div class="flex items-center space-x-3">
            <svg class="w-5 h-5 text-highlight flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            <div>
              <p class="text-sm font-semibold text-text-default">{{ test.id }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">{{ test.title }}</p>
            </div>
          </div>
          <span class="text-sm font-bold text-highlight">{{ test.coverage }}%</span>
        </div>

        <div class="flex justify-space-evenly space-x-4 mt-6">
          <button (click)="export('python')"
            class="bg-purple-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center shadow-md">
            <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21l3-3m-3 3l-3-3m3 3V3"></path></svg>
            Export as Python File
          </button>
          <button (click)="export('csv')"
            class="bg-purple-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center shadow-md">
            <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l3-3m-3 3l-3-3m-3 8h12a2 2 0 002-2V7a2 2 0 00-2-2H9.5a1 1 0 01-.8.4L6 8.5V19a2 2 0 002 2z"></path></svg>
            Export as CSV
          </button>
        </div>
      </div>
    </div>
  `,
})
export class UnitTestInputComponent {
  @Output() generationComplete = new EventEmitter<void>();

  githubUrl: string = 'https://github.com/orgs/microsoft/repositories';
  isCloning: boolean = false;
  generatedTests: UnitTest[] = [];

  // Dummy data simulating backend generation
  dummyTests: UnitTest[] = [
    { id: 'test_user_authentication', title: 'Test user login with valid credentials', coverage: 92 },
    { id: 'test_password_validation', title: 'Test password complexity requirements', coverage: 88 },
    { id: 'test_session_management', title: 'Test user session creation and expiration', coverage: 95 },
  ];

  cloneRepo(): void {
    if (!this.githubUrl) return;

    this.isCloning = true;
    this.generatedTests = [];

    // Simulate backend cloning and analysis delay
    setTimeout(() => {
      this.isCloning = false;
      this.generatedTests = this.dummyTests;
      this.generationComplete.emit(); // Notify shell that generation is complete
      console.log('Unit Tests Generated!');
    }, 2500);
  }

  export(format: 'python' | 'csv'): void {
    console.log(`Exporting unit tests as ${format}.`);
    alert(`Simulating export of ${this.generatedTests.length} unit tests as ${format.toUpperCase()}.`);
  }
}