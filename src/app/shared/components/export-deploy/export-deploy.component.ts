import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Required for ngModel
import { ToasterService } from '../../../core/services/toaster.service';

import * as XLSX from 'xlsx';
// Helper interface for the export options (defined in previous step)
interface ExportOption {
  label: string;
  description: string;
  iconClass: string; 
  message: string;
  disabled?: boolean; 
}

@Component({
  selector: 'app-export-deploy',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-bg-secondary p-8 rounded-xl shadow-2xl border border-border-default">
      <h2 class="text-2xl font-semibold mb-6 text-text-default">Export & Deploy</h2>
      <p class="text-gray-400 mb-6">Your AI-powered testing control center</p>

      <!-- <app-alert-banner 
        [message]="successMessage" 
        [type]="'success'" 
        (messageChange)="successMessage = $event">
      </app-alert-banner> -->

      <div class="flex justify-around text-center mb-10 p-4 border border-border-default rounded-lg">
        <div>
          <h3 class="text-lg font-medium text-gray-400">Generation Complete</h3>
          <p class="text-3xl font-bold text-text-default mt-1">{{ totalTestCases }}</p>
          <p class="text-sm text-highlight">Total Test Cases</p>
        </div>
        <div class="w-px bg-border-default mx-6"></div>
        <div>
          <h3 class="text-lg font-medium text-gray-400">Automation Scripts</h3>
          <p class="text-3xl font-bold text-text-default mt-1">{{ totalAutomationScripts }}</p>
          <p class="text-sm text-highlight">Scripts Generated</p>
        </div>
      </div>

      <h3 class="text-xl font-semibold text-text-default mb-4">Export & Integration Options</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div *ngFor="let option of exportOptions" (click)="handleExport(option)" class="p-4 bg-bg-primary rounded-lg border border-border-default hover:border-highlight transition-colors duration-200 cursor-pointer flex items-start space-x-4">
          
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
            <p class="text-text-default font-medium">{{ option.label }}</p>
            <p class="text-xs text-gray-400">{{ option.description }}</p>
          </div>
        </div>
      </div>
      
      <div class="mt-8 pt-6 border-t border-border-default">
        <h3 class="text-text-default font-medium mb-2">Push to Jira</h3>
        <p class="text-xs text-gray-400 mb-3">Direct integration with your project management</p>
        
        <div class="flex space-x-3">
          <input type="url" placeholder="https://your-org.atlassian.net/browse/PROJECT"
            class="flex-grow p-2.5 text-sm rounded-lg border bg-bg-primary border-gray-700 placeholder-gray-500 text-white focus:ring-highlight focus:border-highlight"
            [(ngModel)]="jiraUrl">
         <button
            class="bg-gray-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium cursor-not-allowed opacity-50"
            disabled>
             Push
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
  @Input() testCases: any[] = []; 
  @Input() automationScripts: any = {};
  @Output() goBack = new EventEmitter<void>();
  @Output() startNew = new EventEmitter<void>();
  private toaster = inject(ToasterService);
  jiraUrl: string = '';
  successMessage: string | null = null;
  isJiraPushing: boolean = false;

  exportOptions: ExportOption[] = [
    { label: 'Download as CSV', description: 'Download Functional Test Cases', iconClass: 'download', message: 'Functional test cases downloaded successfully!' },
    { label: 'Export to Excel', description: 'Download Functional Test Cases ', iconClass: 'download', message: 'Functional test cases downloaded successfully!' },
    { label: 'Export Automation Scripts', description: 'Download automation scripts', iconClass: 'python', message: 'Automation script generated and downloaded!' },
    { label: 'Export to GitHub', description: 'Push to repository', iconClass: 'github', message: 'Test suite pushed to GitHub repository!',disabled: true },
  ];
private readonly FRAMEWORK_EXTENSIONS: { [key: string]: string } = {
    'Selenium': 'py',
    'Playwright': 'js',
    'Cypress': 'js',
    'REST Assured': 'java',
    'Database': 'sql'
  };
handleExport(option: any): void {
    if (option.label.includes('CSV')) {
      this.exportToExcelOrCsv('csv');
    } else if (option.label.includes('Excel')) {
      this.exportToExcelOrCsv('xlsx');
   } else if (option.label.includes('Automation')) {
      this.downloadScripts(); // This now handles dynamic formats
    }
  }
private triggerFileDownload(content: string, fileName: string, contentType: string): void {
    const blob = new Blob([content], { type: contentType });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

private downloadScripts(): void {
  console.log('Downloading automation scripts:', this.automationScripts);
    if (!this.automationScripts || Object.keys(this.automationScripts).length === 0) {
      this.toaster.show('No automation scripts available', 'error');
      return;
    }
    Object.keys(this.automationScripts).forEach(category => {
      const scriptData = this.automationScripts[category];
      
      // Determine extension based on framework (default to txt if unknown)
      const extension = this.FRAMEWORK_EXTENSIONS[scriptData.framework] || 'txt';
      
      // Create the file content
      const content = scriptData.script.join('\n');
      
      this.triggerFileDownload(
        content, 
        `Sage_${category.toLowerCase()}_tests.${extension}`,
        extension === 'sql' ? 'text/sql' : 'text/plain'
      );
    });

    this.toaster.show('Framework-specific scripts downloaded!', 'success');
  }

  
private exportToExcelOrCsv(type: 'csv' | 'xlsx'): void {
    if (this.testCases.length === 0) {
      this.toaster.show('No test cases to export', 'error');
      return;
    }

    // 1. Flatten the data for spreadsheet format
    const dataToExport = this.testCases.map(tc => ({
      ID: tc.ID,
      Title: tc.Title,
      Type: tc.Type,
      Priority: tc.Priority,
      Preconditions: tc.Preconditions,
      Steps: tc.Steps,
      Expected_Results: tc.ExpectedResults
    }));
    // 2. Create worksheet
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataToExport);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'TestCases');

    // 3. Trigger Download
    const fileName = `SageScript_Export_${new Date().getTime()}.${type}`;
    XLSX.writeFile(wb, fileName, { bookType: type });
    
    this.toaster.show(`${type.toUpperCase()} downloaded successfully!`, 'success');
  }

  // private downloadScripts(): void {
  //   // Download automation scripts as a combined .txt or individual files
  //   const scriptsString = Object.keys(this.automationScripts)
  //     .map(key => `### ${key} ###\n${this.automationScripts[key].script.join('\n')}`)
  //     .join('\n\n');

  //   const blob = new Blob([scriptsString], { type: 'text/plain' });
  //   const url = window.URL.createObjectURL(blob);
  //   const a = document.createElement('a');
  //   a.href = url;
  //   a.download = 'automation_scripts.py';
  //   a.click();
  //   window.URL.revokeObjectURL(url);
    
  //   this.toaster.show('Automation scripts downloaded!', 'success');
  // }
  pushToJira(): void {
    if (this.jiraUrl) {
      this.isJiraPushing = true;
      this.successMessage = null; 
      // Simulate API call delay for Jira integration
      setTimeout(() => {
        this.isJiraPushing = false;
        this.successMessage = `Test suite linked/pushed to Jira project: ${this.jiraUrl.split('/').pop()}!`;
        console.log(`Pushed to Jira project: ${this.jiraUrl}`);
      }, 1500); // 1.5s delay for push
    }
  }
}



          // <button (click)="pushToJira()"
          //   class="bg-highlight hover:bg-purple-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200"
          //   [disabled]="!jiraUrl || isJiraPushing">
          //   <span *ngIf="!isJiraPushing">Push</span>
          //   <span *ngIf="isJiraPushing">Pushing...</span>
          // </button>