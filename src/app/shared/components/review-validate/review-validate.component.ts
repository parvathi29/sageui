import { Component, Input, Output, EventEmitter, OnInit,OnChanges,SimpleChanges, signal, computed, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { TestCase } from '../models/test-automation.model';
import { ApiService } from '../../../core/services/api.service';
import { AlertBannerComponent } from '../alert-banner/alert-banner.component';
import { ToasterService } from '../../../core/services/toaster.service';
@Component({
  selector: 'app-review-validate',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrls: ['./review-validate.component.scss'],
  template: `
    <div class="bg-bg-secondary p-8 rounded-xl shadow-2xl transition-all duration-300 border border-border-default">
          <h2 class="text-2xl font-semibold mb-4 text-text-default">Review & Validate</h2>
      <p class="text-gray-400 mb-6">Review AI-generated test cases with full transparency and provide feedback</p>
      
      <div class="flex justify-between items-start mb-8 border-b border-gray-800 pb-6">
        <div>
          <div class="flex items-center space-x-2 text-highlight mb-1">
             <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"/></svg>
             <span class="text-[10px] font-bold uppercase tracking-widest">Project: {{ jobInfo?.project_id || 'PROJ-001' }}</span>
          </div>
          <h2 class="text-3xl font-black text-text-default">{{ jobInfo?.project_name || 'Banking Portal' }}</h2>
          <p class="text-gray-500 text-xs mt-1">Job ID: {{ jobInfo?.job_id || 'JOB-C100' }} • Completed: {{ jobInfo?.submitted_at || 'Jan 02, 2026' }}</p>
        </div>
        <div class="flex space-x-3">
           <button (click)="addNewTestCase.emit()" class="bg-highlight text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-purple-700 transition-all shadow-lg shadow-highlight/20 flex items-center">
              <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
              Add Test Case
           </button>
        </div>
      </div>

      <div class="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div class="flex space-x-1 bg-bg-primary p-1 rounded-xl border border-border-default">
           <button (click)="currentView = 'testCases'" 
                   [ngClass]="{'bg-gray-800 text-highlight shadow-sm': currentView === 'testCases', 'text-gray-500': currentView !== 'testCases'}" 
                   class="px-6 py-2 rounded-lg text-xs font-bold transition-all">
             Test Cases ({{ filteredTestCases.length }})
           </button>
           <button (click)="currentView = 'script'" 
                   [ngClass]="{'bg-gray-800 text-highlight shadow-sm': currentView === 'script', 'text-gray-500': currentView !== 'script'}" 
                   class="px-6 py-2 rounded-lg text-xs font-bold transition-all">
             Automation Scripts ({{ scriptKeys.length }})
           </button>
        </div>

        <div *ngIf="currentView === 'testCases'" class="flex items-center space-x-3">
           <div class="relative">
              <svg class="w-4 h-4 absolute left-3 top-2.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              <input type="text" [(ngModel)]="searchTerm" placeholder="Search Title or ID..." 
                     class="pl-9 pr-4 py-2 bg-bg-primary border border-border-default rounded-xl text-xs outline-none focus:border-highlight transition-all w-64 text-text-default">
           </div>
           <select [(ngModel)]="filterPriority" class="bg-bg-primary border border-border-default rounded-xl px-3 py-2 text-xs font-bold text-gray-400 focus:border-highlight outline-none">
              <option value="All">All Priority</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
           </select>
        </div>
      </div>

      <div *ngIf="currentView === 'testCases'" class="space-y-4">

              <div class="grid grid-cols-12 gap-4 px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-800">
          <div class="col-span-6">ID & Title</div>
          <div class="col-span-2">Type</div>
          <div class="col-span-1">Priority</div>
         
          <div class="col-span-2 text-right">Actions</div>
</div>
        <div *ngFor="let tc of paginatedTestCases" class="border border-border-default rounded-2xl overflow-hidden bg-bg-primary/20 hover:border-highlight/30 transition-all shadow-sm">
          <div (click)="toggleRow(tc.ID)" class="grid grid-cols-12 gap-4 items-center px-4 py-3 cursor-pointer hover:bg-bg-primary/40 transition-colors">
             <div class="col-span-6 flex items-center space-x-4">
                <svg [ngClass]="{'rotate-90': expandedRows[tc.ID]}" class="w-4 h-4 text-gray-500 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg>
                <div class="flex flex-col">
                   <span class="text-[10px] font-black text-highlight uppercase tracking-widest">{{ tc.ID }}</span>
                   <span class="text-sm font-bold text-text-default">{{ tc.Title }}</span>
                </div>
             </div>
             <div class="col-span-2 flex items-center">
                <span class="px-3 py-1 rounded-full text-[10px] font-black uppercase" [ngClass]="getTypeClasses(tc.Type)">{{ tc.Type }}</span>
             </div>
             <div class="col-span-1 flex items-center">
                <span class="px-2.5 py-0.5 rounded text-[10px] font-black uppercase" [ngClass]="getPriorityClasses(tc.Priority)">{{ tc.Priority }}</span>
             </div>
           <div class="col-span-2 flex justify-end space-x-3" >
                
                 <button (click)="action('edit', tc.ID)" title="Edit" class="text-gray-400 hover:text-highlight">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                </button>
             <button 
             class="w-5 h-5 ransition-colors duration-200"
                 (click)="onThumbsUp(tc.ID)"
                 title="Good feedback" 
                 [ngClass]="{'text-green-500': tc.feedback === 'like', 'text-gray-400': tc.feedback !== 'like'}"
                [innerHTML]="thumbUpSvg">
                </button>

            <button 
             class="w-5 h-5 transition-colors duration-200"
             (click)="onThumbsDown(tc.ID);$event.stopPropagation()"
             title="Bad feedback"
             [ngClass]="{'text-red-500': tc.feedback === 'dislike', 'text-gray-400': tc.feedback !== 'dislike'}"
             [innerHTML]="thumbDownSvg">
             </button>
                <button (click)="action('delete', tc.ID)" class="text-gray-500 hover:text-red-600 transition-colors">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>            
            </div>
          </div>

          <div *ngIf="expandedRows[tc.ID]" class="px-14 py-8 border-t border-gray-800 bg-bg-primary/10 animate-fade-in space-y-6">
            <section>
                <h4 class="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Preconditions</h4>
                <p class="text-sm text-gray-300">{{ tc.Preconditions || 'No preconditions defined.' }}</p>
            </section>
            <section>
                <h4 class="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Steps</h4>
                <div class="text-sm text-gray-300 space-y-1">
                    <p *ngFor="let step of formatSteps(tc.Steps)">{{ step }}</p>
                </div>
            </section>
            <section>
                <h4 class="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Expected Results</h4>
                <p class="text-sm text-gray-300">{{ tc.ExpectedResults }}</p>
            </section>
            <section>
                <h4 class="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Test Data</h4>
                <div class="border border-border-default rounded-xl overflow-hidden">
                    <div class="flex bg-gray-800/40 border-b border-border-default">
                        <button (click)="setTestDataTab(tc.ID, 'Inputs')" [ngClass]="{'bg-highlight text-white': testDataTabs[tc.ID] === 'Inputs' || !testDataTabs[tc.ID]}" class="px-5 py-2.5 text-[10px] font-bold uppercase transition-all">Inputs</button>
                        <button (click)="setTestDataTab(tc.ID, 'API')" [ngClass]="{'bg-highlight text-white': testDataTabs[tc.ID] === 'API'}" class="px-5 py-2.5 text-[10px] font-bold uppercase transition-all border-x border-border-default">API Payload</button>
                        <button (click)="setTestDataTab(tc.ID, 'DB')" [ngClass]="{'bg-highlight text-white': testDataTabs[tc.ID] === 'DB'}" class="px-5 py-2.5 text-[10px] font-bold uppercase transition-all">DB Mock</button>
                    </div>
                    <div class="p-5 bg-bg-primary/40 font-mono text-[11px] max-h-48 overflow-auto custom-scrollbar">
                        <pre class="text-highlight leading-relaxed">{{ getTestDataContent(tc) | json }}</pre>
                    </div>
                </div>
            </section>
          </div>
        </div>

        <div class="flex items-center justify-between mt-8 text-[10px] font-black text-gray-500 uppercase tracking-widest">
           <span>Showing {{ paginatedTestCases.length }} of {{ filteredTestCases.length }} Results</span>
           <div class="flex space-x-2">
              <button [disabled]="currentPage === 1" (click)="currentPage = currentPage - 1" class="px-4 py-2 border border-border-default rounded-xl hover:bg-bg-primary transition-all disabled:opacity-30">Previous</button>
              <button [disabled]="currentPage * pageSize >= filteredTestCases.length" (click)="currentPage = currentPage + 1" class="px-4 py-2 border border-border-default rounded-xl hover:bg-bg-primary transition-all disabled:opacity-30">Next</button>
           </div>
        </div>
      </div>

      <div *ngIf="currentView === 'script'" class="script-viewer-container">
      <div class="script-sidebar custom-scrollbar">
         <div class="p-4 text-[10px] font-black text-gray-500 uppercase tracking-widest border-b border-border-default">
             Script Registry ({{ scriptKeys.length }})
          </div>
         <div *ngFor="let key of scriptKeys; trackBy: trackByKey" 
            (click)="selectScript(key, $event)"
           [ngClass]="{
           'bg-highlight/10 border-l-4 border-highlight shadow-inner': selectedScriptKey === key,
           'hover:bg-bg-primary': selectedScriptKey !== key
            }"
          class="p-5 cursor-pointer border-b border-border-default transition-all group">
    
           <p class="text-sm font-black" 
           [ngClass]="selectedScriptKey === key ? 'text-highlight' : 'text-text-default'">
           {{ key }}
           </p>
          <p class="text-[10px] text-gray-500 font-bold ">
           {{ automation_scripts[key]?.framework }}
          </p>
       </div>
        </div>
        <div class="script-content-area">
          <div class="flex justify-between items-center p-5 border-b border-border-default bg-bg-secondary">
            <div>
                <h3 class="text-xs font-black text-text-default uppercase tracking-widest">{{ automation_scripts[selectedScriptKey]?.framework }}</h3>
                <p class="text-[10px] text-gray-500 font-bold">Generated Artifact • {{ selectedScriptKey }}</p>
            </div>
            <div class="flex space-x-4">
                <button (click)="copyScript()" class="flex items-center text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-text-default transition-colors group">
                    <svg class="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
                    Copy Source
                </button>
                <button class="bg-highlight hover:bg-purple-700 text-white px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-highlight/20 active:scale-95 transition-all">Save Script</button>
            </div>
          </div>
          <div class="flex-1 overflow-auto p-8 font-mono text-[11px] custom-scrollbar code-box">
            <div class="flex">
                <div class="text-right pr-6 text-gray-700 select-none border-r border-gray-800/50 mr-6">
                    <div *ngFor="let line of getActiveScript(); let i = index" class="leading-7">{{ i + 1 }}</div>
                </div>
                <div class="text-text-default whitespace-pre">
                    <div *ngFor="let line of getActiveScript()" class="leading-7 hover:bg-highlight/5 transition-colors px-2 rounded">{{ line }}</div>
                </div>
            </div>
          </div>
        </div>
      </div>

      <div class="flex justify-between mt-10 pt-8 border-t border-gray-800">
        <button (click)="goBack.emit()" class="text-gray-500 hover:text-white flex items-center font-black text-[10px] uppercase tracking-widest transition-all">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M10 19l-7-7 7-7"/></svg>
          Return to Dashboard
        </button>
        <button (click)="exportAndDeploy.emit()" class="bg-highlight hover:bg-purple-700 text-white px-10 py-4 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-highlight/20 transition-all active:scale-95">
          Proceed to Export
        </button>
      </div>
    </div>
  `,
  styles: [`
    .custom-scrollbar::-webkit-scrollbar { width: 5px; height: 5px; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #374151; border-radius: 10px; }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #8b7bfd; }
    .animate-fade-in { animation: fadeIn 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class ReviewValidateComponent implements OnInit,OnChanges {
  private toaster = inject(ToasterService);
  @Input() testCases: TestCase[] = [];
  @Input() automation_scripts: any = {};
  @Input() jobInfo: any = null;
  @Output() exportAndDeploy = new EventEmitter<void>();
  @Output() goBack = new EventEmitter<void>();
  @Output() addNewTestCase = new EventEmitter<void>();
  @Input() projectId!: string;
  @Input() userId!: number;
 
  // State
  thumbUpSvg: SafeHtml = '';
  thumbDownSvg: SafeHtml = '';
  currentView: 'testCases' | 'script' = 'testCases';
  expandedRows: { [key: string]: boolean } = {};
  testDataTabs: { [key: string]: 'Inputs' | 'API' | 'DB' } = {};
  selectedScriptKey: string = '';
  scriptKeys: string[] = [];
  alertMessage: string | null = null;
  alertType: 'success' | 'info' | 'error' = 'success';

showAlert(message: string, type: 'success' | 'info' | 'error' = 'success') {
  this.alertMessage = message;
  this.alertType = type;
}
  
  // Filtering & Pagination
  searchTerm = '';
  filterPriority = 'All';
  currentPage = 1;
  pageSize = 5;

  constructor(private apiservice: ApiService, private sanitizer: DomSanitizer,private http: HttpClient) {}

  ngOnInit() {
    this.loadIcons();
     console.log('ReviewValidateComponent initialized with projectId:', this.projectId, 'and userId:', this.userId);
    // this.scriptKeys = Object.keys(this.automation_scripts);
    // if (this.scriptKeys.length > 0) this.selectedScriptKey = this.scriptKeys[0];
  }
ngOnChanges(changes: SimpleChanges) {
    if (changes['automation_scripts'] && this.automation_scripts) {
      this.scriptKeys = Object.keys(this.automation_scripts);
      
      // 3. Ensure a script is selected if none is currently active
      if (!this.selectedScriptKey && this.scriptKeys.length > 0) {
        this.selectedScriptKey = this.scriptKeys[0];
      }
    }
  }
  // Logic Helpers

  trackByKey(index: number, key: string) {
  return key; 
}
  selectScript(key: string, event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.selectedScriptKey = key;
  }
  get filteredTestCases() {
    return this.testCases.filter(tc => {
      const matchSearch = tc.Title.toLowerCase().includes(this.searchTerm.toLowerCase()) || tc.ID.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchPriority = this.filterPriority === 'All' || tc.Priority === this.filterPriority;
      return matchSearch && matchPriority;
    });
  }

  get paginatedTestCases() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredTestCases.slice(start, start + this.pageSize);
  }

  toggleRow(id: string) { this.expandedRows[id] = !this.expandedRows[id]; }
  setTestDataTab(id: string, tab: 'Inputs' | 'API' | 'DB') { this.testDataTabs[id] = tab; }
  getActiveScript(): string[] { return this.automation_scripts[this.selectedScriptKey]?.script || []; }
  formatSteps(steps: string): string[] { return steps ? steps.split('\n') : []; }
  
  getTestDataContent(tc: any) {
    const tab = this.testDataTabs[tc.ID] || 'Inputs';
    return tc.TestData[tab === 'API' ? 'API_Payload' : tab === 'DB' ? 'DB_Mock' : 'Inputs'];
  }

  getTypeClasses(type: string): string {
    const t = type?.toLowerCase();
    if (t === 'positive') return 'bg-green-500/10 text-green-500 border border-green-500/20';
    if (t === 'negative') return 'bg-red-500/10 text-red-500 border border-red-500/20';
    return 'bg-purple-500/10 text-purple-400 border border-purple-500/20';
  }

  getPriorityClasses(priority: string): string {
    switch (priority) {
      case 'High': return 'bg-red-500/40 text-red-400 border border-red-800/50';
      case 'Medium': return 'bg-yellow-500/30 text-yellow-500 border border-yellow-800/40';
      default: return 'bg-green-500/30 text-green-500 border border-green-800/40';
    }
  }


  action(type: string, id: string) { console.log(`Action ${type} on ${id}`); }
  copyScript() { navigator.clipboard.writeText(this.getActiveScript().join('\n')); alert('Copied!'); }

  private loadIcons() {
    this.http.get('/assets/icons/thumb-up.svg', { responseType: 'text' }).subscribe(s => this.thumbUpSvg = this.sanitizer.bypassSecurityTrustHtml(s));
    this.http.get('/assets/icons/thumb-down.svg', { responseType: 'text' }).subscribe(s => this.thumbDownSvg = this.sanitizer.bypassSecurityTrustHtml(s));
  }

  onThumbsUp(testCaseId: string) {
  const payload = {
    user_id: this.userId,
    project_id: Number(this.projectId),
    test_case_id: testCaseId,
    feedback_type: 'POSITIVE'
  };
  this.apiservice.sendQuickFeedback(payload).subscribe({
     next: () => {
    this.toaster.show("Thanks for the feedback!", "success");
  },
  error: () => {
    this.toaster.show("Something went wrong!", "error");
  }
    });
  }
  onThumbsDown(testCaseId: string) {
  const feedbackMsg = prompt("Please provide feedback for " + testCaseId + ":");
  
  if (feedbackMsg) {
    const payload = {
      user_id: this.userId,
      project_id: this.projectId,
      test_case_id: testCaseId,
      feedback_description: feedbackMsg,
      feedback_type: 'NEGATIVE'
    };

    this.apiservice.sendDetailedFeedback(payload).subscribe({
      next: () => {
        this.toaster.show("Feedback submitted. We'll improve the generation!", "success");
      },
      error: () => {
        this.toaster.show("Failed to submit feedback.", "error");
      }
    });
  }
}
}