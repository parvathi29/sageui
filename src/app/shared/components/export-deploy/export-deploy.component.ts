import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Required for ngModel
import { AlertBannerComponent } from '../alert-banner/alert-banner.component'; // New

// Helper interface for the export options (defined in previous step)
interface ExportOption {
  label: string;
  description: string;
  iconClass: string; // Use Tailwind classes for icons
  message: string;
}

@Component({
  selector: 'app-export-deploy',
  standalone: true,
  imports: [CommonModule, FormsModule, AlertBannerComponent], // Added FormsModule and AlertBanner
  template: `
    <div class="bg-bg-secondary p-8 rounded-xl shadow-2xl">
      <h2 class="text-2xl font-semibold mb-6 text-text-default">Export & Deploy</h2>
      <p class="text-gray-400 mb-6">Your AI-powered testing control center</p>

      <app-alert-banner 
        [message]="successMessage" 
        [type]="'success'" 
        (messageChange)="successMessage = $event">
      </app-alert-banner>

      <div class="flex justify-around text-center mb-10 p-4 border border-gray-700 rounded-lg">
        <div>
          <h3 class="text-lg font-medium text-gray-400">Generation Complete</h3>
          <p class="text-3xl font-bold text-text-default mt-1">{{ totalTestCases }}</p>
          <p class="text-sm text-highlight">Total Test Cases</p>
        </div>
        <div class="w-px bg-bg-primary mx-6"></div>
        <div>
          <h3 class="text-lg font-medium text-gray-400">Automation Scripts</h3>
          <p class="text-3xl font-bold text-text-default mt-1">{{ totalAutomationScripts }}</p>
          <p class="text-sm text-highlight">Scripts Generated</p>
        </div>
      </div>

      <h3 class="text-xl font-semibold text-text-default mb-4">Export & Integration Options</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div *ngFor="let option of exportOptions" (click)="handleExport(option)"
          class="p-4 bg-bg-primary rounded-lg border border-gray-700 hover:border-highlight transition-colors duration-200 cursor-pointer flex items-start space-x-4">
          
          <svg class="w-6 h-6 text-highlight flex-shrink-0 mt-1" [ngClass]="option.iconClass" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <ng-container *ngIf="option.iconClass.includes('download')">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
            </ng-container>
            <ng-container *ngIf="option.iconClass.includes('github')">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4"></path>
            </ng-container>
            <ng-container *ngIf="option.iconClass.includes('python')">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l-4-4m0 0l-4-4m4 4h12M4 10l-4 4m0 0l4 4"></path>
            </ng-container>
          </svg>
          
          <div>
            <p class="text-white font-medium">{{ option.label }}</p>
            <p class="text-xs text-gray-400">{{ option.description }}</p>
          </div>
        </div>
      </div>
      
      <div class="mt-8 pt-6 border-t border-gray-700">
        <h3 class="text-text-default font-medium mb-2">Push to Jira</h3>
        <p class="text-xs text-gray-400 mb-3">Direct integration with your project management</p>
        
        <div class="flex space-x-3">
          <input type="url" placeholder="https://your-org.atlassian.net/browse/PROJECT"
            class="flex-grow p-2.5 text-sm rounded-lg border bg-bg-primary border-gray-700 placeholder-gray-500 text-white focus:ring-highlight focus:border-highlight"
            [(ngModel)]="jiraUrl">
          <button (click)="pushToJira()"
            class="bg-highlight hover:bg-purple-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200"
            [disabled]="!jiraUrl || isJiraPushing">
            <span *ngIf="!isJiraPushing">Push</span>
            <span *ngIf="isJiraPushing">Pushing...</span>
          </button>
        </div>
      </div>

      <div class="flex justify-start mt-8">
        <button (click)="goBack.emit()" class="text-gray-400 hover:text-white flex items-center">
          <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          Back
        </button>
        <button (click)="startNew.emit()" class="ml-auto bg-gray-700 hover:bg-gray-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200">
          Start New
        </button>
      </div>
    </div>
  `,
})
export class ExportDeployComponent {
  @Input({ required: true }) totalTestCases: number = 0;
  @Input({ required: true }) totalAutomationScripts: number = 0;
  
  @Output() goBack = new EventEmitter<void>();
  @Output() startNew = new EventEmitter<void>();
  
  jiraUrl: string = '';
  successMessage: string | null = null;
  isJiraPushing: boolean = false;

  exportOptions: ExportOption[] = [
    { label: 'Download as CSV', description: 'Spreadsheet format', iconClass: 'download', message: 'CSV file downloaded successfully!' },
    { label: 'Export to Excel', description: 'Download as .xlsx', iconClass: 'download', message: 'Excel file downloaded successfully!' },
    { label: 'Generate Selenium Script', description: 'Python automation', iconClass: 'python', message: 'Selenium script generated and downloaded!' },
    { label: 'Export to GitHub', description: 'Push to repository', iconClass: 'github', message: 'Test suite pushed to GitHub repository!' },
  ];

  handleExport(option: ExportOption): void {
    // Simulate API call/download delay
    this.successMessage = null; // Clear existing message
    setTimeout(() => {
      // Logic for actual download or API call would go here
      this.successMessage = option.message;
      console.log(`Action executed: ${option.label}`);
    }, 500); // 0.5s delay
  }

  pushToJira(): void {
    if (this.jiraUrl) {
      this.isJiraPushing = true;
      this.successMessage = null; // Clear existing message
      // Simulate API call delay for Jira integration
      setTimeout(() => {
        this.isJiraPushing = false;
        this.successMessage = `Test suite linked/pushed to Jira project: ${this.jiraUrl.split('/').pop()}!`;
        console.log(`Pushed to Jira project: ${this.jiraUrl}`);
      }, 1500); // 1.5s delay for push
    }
  }
}