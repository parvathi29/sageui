import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Required for ngModel
import { ToasterService } from '../../../core/services/toaster.service';
import JSZip from 'jszip';
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
      <div class="grid grid-cols-1 gap-6">
              <div *ngFor="let option of exportOptions" 
             (click)="option.disabled ? null : downloadProjectBundle()" 
             [ngClass]="{'opacity-50 cursor-not-allowed': option.disabled}"
             class="p-6 bg-bg-primary rounded-lg border border-border-default hover:border-highlight transition-all cursor-pointer flex items-center space-x-6">
          
  <div class="p-4 bg-highlight/10 rounded-full text-highlight">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
            </svg>
          </div>
          
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
        <button (click)="goBack.emit()" class="text-gray-400 hover:text-primary flex items-center">
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
  @Input() storyId?: string;
  @Input() jobId?: string;
  @Output() goBack = new EventEmitter<void>();
  @Output() startNew = new EventEmitter<void>();
  private toaster = inject(ToasterService);
  jiraUrl: string = '';
  successMessage: string | null = null;
  isJiraPushing: boolean = false;

  exportOptions: ExportOption[] = [
    { 
      label: 'Download Project Bundle (.zip)', 
      description: 'Includes Excel Test Cases and framework-specific Automation Scripts', 
      iconClass: 'download', 
      message: 'Project bundle generated successfully!' 
    }
  ];
  private getExtension(frameworkStr: string): string {
    if (!frameworkStr) return 'txt';
        const fw = frameworkStr.toLowerCase();
    if (fw.includes('selenium') && fw.includes('java')) return 'java';
    if (fw.includes('selenium') && fw.includes('python')) return 'py';
    if (fw.includes('playwright')) return 'js';
    if (fw.includes('cypress')) return 'js';
    if (fw.includes('database') || fw.includes('sql')) return 'sql';
    return 'txt';
  }

 async downloadProjectBundle() {
    this.toaster.show('Preparing your download bundle...', 'success');
    const zip = new JSZip();

    try {
      // 1. GENERATE EXCEL FILE (In-memory)
      const dataToExport = this.testCases.map(tc => ({
        ID: tc.ID,
        Title: tc.Title,
        Type: tc.Type,
        Priority: tc.Priority,
        Preconditions: tc.Preconditions,
        Steps: tc.Steps,
        Expected_Results: tc['Expected Results'] || tc.ExpectedResults
      }));

      const ws = XLSX.utils.json_to_sheet(dataToExport);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'TestCases');
      
      // Write to a buffer instead of a file
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      zip.file("Functional_Test_Cases.xlsx", excelBuffer);

      // 2. ADD AUTOMATION SCRIPTS
      const scriptsFolder = zip.folder("automation_scripts");
      
      Object.keys(this.automationScripts).forEach(id => {
        const scriptData = this.automationScripts[id];
        if (scriptData && scriptData.script) {
          // Use our mapping to find the right extension based on the 'framework' key in the response
          const extension = this.getExtension(scriptData.framework);
          const content = scriptData.script.join('\n');
          scriptsFolder?.file(`${id}_Test.${extension}`, content);
        }
      });

      // 3. GENERATE AND TRIGGER DOWNLOAD
      const content = await zip.generateAsync({ type: "blob" });
      const fileName = `SageScript_Project_${new Date().getTime()}.zip`;
      
      const link = document.createElement('a');
      link.href = URL.createObjectURL(content);
      link.download = fileName;
      link.click();
      URL.revokeObjectURL(link.href);

      this.toaster.show('Bundle downloaded!', 'success');
    } catch (error) {
      console.error(error);
      this.toaster.show('Failed to generate bundle', 'error');
    }
  }

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