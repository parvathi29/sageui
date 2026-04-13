import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { interval, Subscription, switchMap, startWith } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-agent-status-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/20 dark:bg-black/60 backdrop-blur-sm animate-fade-in">
      <div class="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        
        <div class="p-6 flex justify-between items-start">
          <div>
            <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-1">Agent Status</h2>
            <p class="text-sm text-slate-600 dark:text-slate-400">Real-time execution logs for Job #{{jobId}}</p>
          </div>
          <button (click)="onClose.emit()" class="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <div class="flex-1 overflow-y-auto p-6 space-y-3 custom-scrollbar">
          
          <div *ngFor="let story of traceData | keyvalue" class="bg-slate-100/80 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
            
            <button (click)="toggleAccordion(story.key)"
                    class="w-full p-4 flex items-center justify-between hover:bg-slate-200 dark:hover:bg-slate-800/70 transition-all">
              <div class="flex items-center space-x-3">
                <svg [class.rotate-180]="isExpanded(story.key)" class="w-4 h-4 text-slate-500 dark:text-slate-400 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7"/></svg>
                <span class="text-[#8b7bfd] font-bold text-sm">{{ story.key }}</span>
                <span class="text-xs text-slate-500 dark:text-slate-300 font-medium">Analysis Trace</span>
              </div>
              <div class="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                {{ story.value.length }} Agents
              </div>
            </button>

            <div *ngIf="isExpanded(story.key)" class="px-6 pb-6 pt-2 space-y-0">
              <div *ngFor="let agent of story.value; let last = last; let first = first" class="relative pl-8 pb-6">
                
                <div *ngIf="!last" class="absolute left-[7px] top-6 bottom-0 w-[2px] bg-slate-300 dark:bg-slate-700"></div>

                <div [ngClass]="{
                    'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]': agent.status === 'Completed',
                    'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]': agent.status !== 'Completed'
                  }" 
                  class="absolute left-0 top-1 w-4 h-4 rounded-full border-[3px] border-white dark:border-slate-950 z-10">
                </div>

                <div class="flex items-center space-x-2 mb-2">
                  <svg class="w-4 h-4 text-[#8b7bfd]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"/></svg>
                  <span class="text-sm font-bold text-slate-900 dark:text-white">{{ agent.agent_name }}</span>
                  <span class="text-sm text-slate-700 dark:text-slate-300">{{ agent.state_name }}</span>
                  
                  <div *ngIf="agent.status === 'Completed'" class="flex items-center bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded-full">
                    <span class="text-[9px] font-bold text-green-500 uppercase tracking-tighter">Completed</span>
                  </div>

                  <div *ngIf="agent.status !== 'Completed' && last" class="flex items-center bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full animate-pulse">
                    <div class="w-1.5 h-1.5 bg-amber-500 rounded-full mr-1.5"></div>
                    <span class="text-[9px] font-bold text-amber-500 uppercase tracking-tighter">Running</span>
                  </div>
                </div>

                <div class="flex items-start space-x-3">
                  <svg class="w-4 h-4 mt-0.5 flex-shrink-0 text-slate-500 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9l-.707.707M12 18c-3.314 0-6-2.686-6-6 0-3.314 2.686-6 6-6s6 2.686 6 6c0 3.314-2.686 6-6 6z"/></svg>
                  <p class="text-xs leading-relaxed text-slate-600 dark:text-slate-400 whitespace-normal break-words w-full">
                    {{ agent.thought_process }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ` ,
   styles: [`
    .animate-fade-in { animation: fadeIn 0.2s ease-out; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    .custom-scrollbar::-webkit-scrollbar { width: 4px; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
  `]
})
export class AgentStatusModalComponent implements OnInit, OnDestroy  {









  @Input() jobId!: string;
  @Input() traceData: Record<string, any[]> = {};
  @Output() onClose = new EventEmitter<void>();
  
  private api = inject(ApiService);
  private pollSub?: Subscription;
  
  expandedStories = new Set<string>();

  ngOnInit() {
    // Polling logic: Runs every 5 seconds until modal is closed
    this.pollSub = interval(5000).pipe(
      startWith(0),
      switchMap(() => this.api.getAgentTrace(this.jobId))
    ).subscribe(data => {
      this.traceData = data;
      // Auto-expand first story if none are expanded
      if (this.expandedStories.size === 0 && Object.keys(data).length > 0) {
        this.expandedStories.add(Object.keys(data)[0]);
      }
    });
  }

  ngOnDestroy() {
    this.pollSub?.unsubscribe();
  }

  toggleAccordion(key: string) {
    if (this.expandedStories.has(key)) this.expandedStories.delete(key);
    else this.expandedStories.add(key);
  }

  isExpanded(key: string): boolean {
    return this.expandedStories.has(key);
  }
}