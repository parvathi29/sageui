import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestCase } from '../models/test-automation.model';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
@Component({
  selector: 'app-review-validate',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-bg-secondary p-8 rounded-xl shadow-2xl transition-all duration-300">
      <h2 class="text-2xl font-semibold mb-4 text-text-default">Review & Validate</h2>
      <p class="text-gray-400 mb-6">Review AI-generated test cases with full transparency and provide feedback</p>

      <div class="flex justify-between items-center border-b border-gray-700 mb-6">
        <div class="flex space-x-4 -mb-px">
          <button (click)="currentView = 'testCases'"
            [ngClass]="{'border-highlight text-highlight': currentView === 'testCases', 'border-transparent text-gray-400 hover:text-text-default': currentView !== 'testCases'}"
            class="py-2 px-4 border-b-2 font-medium transition-colors duration-150">
            Test Cases ({{ testCases.length }})
          </button>
          <button (click)="currentView = 'script'" 
            [ngClass]="{'border-highlight text-text-content': currentView === 'script', 'border-transparent text-gray-400 hover:text-default': currentView !== 'script'}"
            class="py-2 px-4 border-b-2 font-medium transition-colors duration-150">
            Automation Script ({{ scriptKeys.length }})
          </button>
        </div>
        <button *ngIf="currentView === 'testCases'" (click)="addNewTestCase.emit()"
          class="bg-highlight hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center">
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
          Add Test Case
        </button>
      </div>

      <div *ngIf="currentView === 'testCases'" class="p-3 mb-6 bg-bg-secondary border-l-4 border-highlight text-sm text-gray-300 flex items-center">
      <svg class="w-4 h-4 text-highlight mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>  
      <span class="font-bold text-text-default">AI Transparency:</span> Each test case shows its source from your requirements. Use feedback buttons to help improve generation quality.
      </div>

      <div *ngIf="currentView === 'testCases'" class="w-full">
              <div class="grid grid-cols-12 gap-4 px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-800">
          <div class="col-span-6">ID & Title</div>
          <div class="col-span-2">Type</div>
          <div class="col-span-1">Priority</div>
          <div class="col-span-1">Status</div>
          <div class="col-span-2 text-right">Actions</div>
        </div>

        <div class="max-h-[600px] overflow-y-auto custom-scrollbar">
          <div *ngFor="let tc of testCases" class="border-b border-gray-800/50">
            <div class="grid grid-cols-12 gap-4 px-4 py-4 items-center hover:bg-bg-primary/30 transition-colors cursor-pointer"
                 (click)="toggleRow(tc.ID)">
              
              <div class="col-span-6 flex items-center space-x-3">
                <svg [ngClass]="{'rotate-90': expandedRows[tc.ID]}" class="w-4 h-4 transition-transform text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                <div class="flex flex-col">
                    <div class="flex items-center space-x-1">
                        <span class="text-sm font-bold text-highlight">{{ tc.ID }}</span>
                        <svg class="w-3.5 h-3.5 text-gray-500 hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    </div>
                    <span class="text-sm font-medium text-text-default">{{ tc.Title }}</span>
                </div>
              </div>

              <div class="col-span-2">
                <span [ngClass]="getTypeClasses(tc.Type)" class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                  {{ tc.Type }}
                </span>
              </div>

              <div class="col-span-1">
                <span [ngClass]="getPriorityClasses(tc.Priority)" class="px-2 py-0.5 rounded text-[10px] font-bold">
                  {{ tc.Priority }}
                </span>
              </div>

              <div class="col-span-1">
                <span class="text-xs font-semibold text-gray-400 bg-gray-800/50 px-2 py-1 rounded border border-gray-700">Ready</span>
              </div>

              <div class="col-span-2 flex justify-end space-x-3" (click)="$event.stopPropagation()">
                <button (click)="toggleFeedback(tc, 'like')" [ngClass]="{'text-green-500': tc.feedback === 'like', 'text-gray-500': tc.feedback !== 'like'}" class="transition-colors hover:text-green-400" [innerHTML]="thumbUpSvg"></button>
                <button (click)="toggleFeedback(tc, 'dislike')" [ngClass]="{'text-red-500': tc.feedback === 'dislike', 'text-gray-500': tc.feedback !== 'dislike'}" class="transition-colors hover:text-red-400" [innerHTML]="thumbDownSvg"></button>
                 <button (click)="action('edit', tc.ID)" title="Edit" class="text-gray-400 hover:text-highlight">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                </button>
             <button 
             class="w-5 h-5 ransition-colors duration-200"
                 (click)="toggleFeedback( tc,'like')" 
                 title="Good feedback" 
                 [ngClass]="{'text-green-500': tc.feedback === 'like', 'text-gray-400': tc.feedback !== 'like'}"
                [innerHTML]="thumbUpSvg">
                </button>

<button 
class="w-5 h-5 transition-colors duration-200"
  (click)="toggleFeedback( tc,'dislike')" 
  title="Bad feedback"
  [ngClass]="{'text-red-500': tc.feedback === 'dislike', 'text-gray-400': tc.feedback !== 'dislike'}"
  [innerHTML]="thumbDownSvg">
</button>
                <button (click)="action('delete', tc.ID)" class="text-gray-500 hover:text-red-600 transition-colors">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>
              </div>
            </div>

            <div *ngIf="expandedRows[tc.ID]" class="px-12 py-6 bg-bg-primary/20 border-t border-gray-800/50 animate-fade-in">
              <div class="grid grid-cols-1 gap-6">
                
                <section>
                    <h4 class="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Preconditions</h4>
                    <p class="text-sm text-gray-300 leading-relaxed">{{ tc.Preconditions || 'No preconditions defined.' }}</p>
                </section>

                <section>
                    <h4 class="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Steps</h4>
                    <div class="text-sm text-gray-300 space-y-1">
                        <p *ngFor="let step of formatSteps(tc.Steps)">{{ step }}</p>
                    </div>
                </section>

                <section>
                    <h4 class="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Expected Results</h4>
                    <p class="text-sm text-gray-300 leading-relaxed">{{ tc.ExpectedResults }}</p>
                </section>

                <section>
                    <h4 class="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Test Data</h4>
                    <div class="border border-gray-700 rounded-lg overflow-hidden bg-bg-primary/40">
                        <div class="flex bg-gray-800/40 border-b border-gray-700">
                            <button (click)="setTestDataTab(tc.ID, 'Inputs')" 
                                    [ngClass]="{'bg-highlight text-white': testDataTabs[tc.ID] === 'Inputs' || !testDataTabs[tc.ID]}"
                                    class="px-4 py-2 text-[10px] font-bold uppercase transition-all flex items-center">
                                <svg class="w-3 h-3 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16m-7 6h7"></path></svg>
                                Inputs
                            </button>
                            <button (click)="setTestDataTab(tc.ID, 'API')" 
                                    [ngClass]="{'bg-highlight text-white': testDataTabs[tc.ID] === 'API'}"
                                    class="px-4 py-2 text-[10px] font-bold uppercase transition-all flex items-center">
                                <svg class="w-3 h-3 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>
                                API Payload
                            </button>
                            <button (click)="setTestDataTab(tc.ID, 'DB')" 
                                    [ngClass]="{'bg-highlight text-white': testDataTabs[tc.ID] === 'DB'}"
                                    class="px-4 py-2 text-[10px] font-bold uppercase transition-all flex items-center">
                                <svg class="w-3 h-3 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"></path></svg>
                                DB Mock
                            </button>
                        </div>
                        <div class="p-4 overflow-x-auto max-h-48 custom-scrollbar">
                            <pre class="text-[11px] font-mono text-highlight leading-tight">{{ getTestDataContent(tc) | json }}</pre>
                        </div>
                    </div>
                </section>

              </div>
            </div>
          </div>
        </div>
        
      </div>

      <div *ngIf="currentView === 'script'" class="flex h-[500px] border border-gray-700 rounded-lg overflow-hidden bg-bg-primary/20">
      <div class="w-48 border-r border-gray-700 bg-bg-secondary/50 overflow-y-auto custom-scrollbar">
          <div class="p-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest border-b border-gray-800">
            Scripts ({{ scriptKeys.length }})
          </div>
          <div *ngFor="let key of scriptKeys" 
               (click)="selectedScriptKey = key"
               [ngClass]="{'bg-highlight/10 border-l-4 border-highlight': selectedScriptKey === key}"
               class="p-4 cursor-pointer hover:bg-bg-primary/40 border-b border-gray-800/50 transition-all">
            <p class="text-sm font-bold" [ngClass]="selectedScriptKey === key ? 'text-highlight' : 'text-text-default'">{{ key }}</p>
            <p class="text-[10px] text-gray-500 font-medium">Java/Selenium</p>
          </div>
        </div>

        <div class="flex-1 flex flex-col bg-bg-primary/30">
          <div class="flex justify-between items-center p-4 border-b border-gray-800 bg-bg-secondary/30">
            <div>
                <h3 class="text-sm font-bold text-text-default">Java/Selenium</h3>
                <p class="text-[10px] text-gray-500">Test Case: {{ selectedScriptKey }} • Ready to integrate into your CI/CD pipeline</p>
            </div>
            <div class="flex space-x-3">
                <button (click)="copyScript()" class="flex items-center text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-colors">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                    Copy
                </button>
                <button class="bg-highlight hover:bg-purple-700 text-white px-4 py-2 rounded text-[10px] font-bold uppercase tracking-widest flex items-center shadow-lg shadow-highlight/20 transition-all">
                    <svg class="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path></svg>
                    Save Script
                </button>
            </div>
          </div>

          <div class="flex-1 overflow-auto p-6 font-mono text-xs custom-scrollbar bg-bg-primary/10">
            <div class="flex">
                <div class="text-right pr-4 text-gray-600 select-none border-r border-gray-800 mr-4">
                    <div *ngFor="let line of getActiveScript(); let i = index" class="leading-6">
                        {{ i + 1 }}
                    </div>
                </div>
                <div class="text-text-default overflow-x-auto whitespace-pre">
                    <div *ngFor="let line of getActiveScript()" class="leading-6 hover:bg-highlight/5 transition-colors px-1">
                        {{ line }}
                    </div>
                </div>
            </div>
          </div>
        </div>


      </div>

      <div class="flex justify-between mt-8">
        <button (click)="goBack.emit()" class="text-gray-400 hover:text-white flex items-center">
          <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          Back
        </button>
        <button (click)="exportAndDeploy.emit()"
          class="bg-highlight hover:bg-purple-700 text-white px-6 py-3 rounded-lg flex items-center transition-colors duration-200">
          Export & Deploy
          <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #374151; border-radius: 10px; }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #8b7bfd; }
    .animate-fade-in { animation: fadeIn 0.3s ease-in-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class ReviewValidateComponent  implements OnInit{
  constructor(private http: HttpClient,private sanitizer: DomSanitizer) {}
  @Input({ required: true }) testCases: TestCase[] = [];
  @Input({ required: true }) automation_scripts: any = {};
  @Output() exportAndDeploy = new EventEmitter<void>();
  @Output() goBack = new EventEmitter<void>();
  @Output() addNewTestCase = new EventEmitter<void>();

  thumbUpSvg: SafeHtml = '';
  thumbDownSvg: SafeHtml = '';
  expandedRows: { [key: string]: boolean } = {};
  testDataTabs: { [key: string]: 'Inputs' | 'API' | 'DB' } = {};
  currentView: 'testCases' | 'script' = 'testCases';
  selectedScriptKey: string = '';
  scriptKeys: string[] = [];
  

 
  ngOnInit() {
   this.http.get('/assets/icons/thumb-up.svg', { responseType: 'text' })
    .subscribe(svg => this.thumbUpSvg = this.sanitizer.bypassSecurityTrustHtml(svg));

  this.http.get('/assets/icons/thumb-down.svg', { responseType: 'text' })
    .subscribe(svg => this.thumbDownSvg = this.sanitizer.bypassSecurityTrustHtml(svg));


    this.scriptKeys = Object.keys(this.automation_scripts);
    console.log("jepdkjpoewkpjpwej",this.scriptKeys)
    if (this.scriptKeys.length > 0) {
      this.selectedScriptKey = this.scriptKeys[0];
    }
  }
 toggleRow(id: string) {
    this.expandedRows[id] = !this.expandedRows[id];
  }
  setTestDataTab(id: string, tab: 'Inputs' | 'API' | 'DB') {
    this.testDataTabs[id] = tab;
  }
   getTestDataContent(tc: any) {
    const tab = this.testDataTabs[tc.ID] || 'Inputs';
    if (tab === 'Inputs') return tc.TestData.Inputs;
    if (tab === 'API') return tc.TestData.API_Payload;
    if (tab === 'DB') return tc.TestData.DB_Mock;
    return {};
  }
formatSteps(steps: string): string[] {
    return steps ? steps.split('\n') : [];
  }
   getTypeClasses(type: string): string {
    const t = type?.toLowerCase();
    switch (t) {
      case 'positive': return 'bg-green-500/10 text-green-500 border border-green-500/20';
      case 'negative': return 'bg-red-500/10 text-red-500 border border-red-500/20';
      case 'edge case': return 'bg-purple-500/10 text-purple-400 border border-purple-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border border-gray-500/20';
    }
  }
 getPriorityClasses(priority: string): string {
    switch (priority) {
      case 'High': return 'bg-red-900/40 text-red-400 border border-red-800/50';
      case 'Medium': return 'bg-yellow-900/30 text-yellow-500 border border-yellow-800/40';
      case 'Low': return 'bg-green-900/30 text-green-500 border border-green-800/40';
      default: return 'bg-gray-800 text-gray-400';
    }
  }

  toggleFeedback(tc: any, type: 'like' | 'dislike') {
  tc.feedback = tc.feedback === type ? null : type;
}
 action(type: string, id: string): void {
    // In a real application, this would trigger modal/API calls
    console.log(`Action: ${type} performed on Test Case ID: ${id}`);
    // For "delete," you would update the 'testCases' array here.
  }
  getActiveScript(): string[] {
    return this.automation_scripts[this.selectedScriptKey]?.script || [];
  }

  copyScript() {
    const code = this.getActiveScript().join('\n');
    navigator.clipboard.writeText(code);
    alert('Script copied to clipboard!');
  }
}