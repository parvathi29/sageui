import { Component, OnInit, OnDestroy, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { interval, Subscription, switchMap } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
@Component({
  selector: 'app-scheduled-jobs',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="animate-fade-in space-y-8">
      <div>
        <h1 class="text-3xl font-extrabold tracking-tight">Scheduled Jobs</h1>
        <p class="text-gray-500 text-sm mt-1">Monitor test generation jobs across all projects</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div *ngFor="let card of summaryCards" class="bg-bg-secondary p-6 rounded-2xl border border-border-default flex justify-between items-center">
          <div>
            <h2 class="text-3xl font-black">{{ getCount(card.status) }}</h2>
            <p class="text-gray-500 text-xs font-bold uppercase tracking-widest">{{ card.label }}</p>
          </div>
          <div class="p-3 bg-bg-primary rounded-full text-highlight">
                       <svg [ngClass]="{'animate-spin': card.status === 'In Progress'}" 
            class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" 
            [innerHTML]="card.icon">
           </svg>
          </div>
        </div>
      </div>

      <div class="bg-bg-secondary rounded-3xl border border-border-default p-8 shadow-sm">
        <div class="flex items-center space-x-4 mb-8 bg-bg-primary/50 p-3 rounded-xl border border-border-default">
           <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
           <input type="text" placeholder="Search by project name or description..." class="bg-transparent border-none outline-none text-sm w-full">
        </div>

        <div class="space-y-4">
          <div *ngFor="let job of jobs" class="flex flex-col md:flex-row md:items-center justify-between p-6 rounded-2xl bg-bg-primary/30 border border-border-default hover:border-highlight/40 transition-all group">
            <div class="flex items-center space-x-5">
              <div class="relative">
                <svg [ngClass]="job.status === 'In Progress' ? 'animate-spin text-amber-500' : 'text-gray-500'" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path *ngIf="job.status !== 'Completed'" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  <path *ngIf="job.status === 'Completed'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" class="text-green-500"/>
                </svg>
              </div>
              <div>
                <div class="flex items-center space-x-3">
                  <h3 class="font-bold text-lg group-hover:text-highlight transition-colors">{{ job.project }}</h3>
                  <span [ngClass]="getStatusClasses(job.status)" class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tighter border">
                    {{ job.status }}
                  </span>
                </div>
                <p class="text-sm text-gray-500">{{ job.description }}</p>
                <p class="text-[10px] text-gray-600 mt-1 uppercase font-bold tracking-widest">Submitted: {{ job.submitted }}</p>
              </div>
            </div>

            <div class="mt-4 md:mt-0 flex items-center space-x-4">
              <div *ngIf="job.status === 'Completed'" class="text-right">
                <p class="text-sm font-black text-text-default">{{ job.tests }} tests</p>
                <p class="text-[10px] text-gray-500 uppercase font-bold">Generated</p>
              </div>
              <button *ngIf="job.status === 'Completed'" (click)="onReview.emit(job)" 
                      class="bg-highlight hover:bg-purple-700 text-white px-6 py-2 rounded-xl text-xs font-bold transition-all shadow-lg shadow-highlight/20 active:scale-95">
                Review & Edit
              </button>
               <div class="relative">
                <button (click)="toggleMenu(job.id, $event)" class="p-2 hover:bg-bg-primary rounded-full text-gray-400 transition-colors">
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>
                </button>

                <div *ngIf="activeMenuId === job.id" class="absolute right-0 mt-2 w-48 bg-bg-secondary border border-border-default rounded-xl shadow-2xl z-50 py-2 animate-fade-in">
                  <button (click)="regenerateJob(job.id)" class="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-bg-primary hover:text-highlight flex items-center">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                    Regenerate
                  </button>
                  <button (click)="openDeleteConfirm(job)" class="w-full text-left px-4 py-2 text-sm text-priority-high hover:bg-red-500/10 flex items-center font-semibold">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                    Delete Job
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
            </div>

       <div *ngIf="showDeleteModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] animate-fade-in">
        <div class="bg-bg-secondary border border-border-default p-8 rounded-3xl max-w-sm w-full shadow-2xl">
          <h3 class="text-xl font-bold mb-2">Confirm Deletion</h3>
          <p class="text-gray-400 text-sm mb-6">Are you sure you want to delete the job for <span class="text-text-default font-semibold">{{ jobToDelete?.project }}</span>? This action cannot be undone.</p>
          <div class="flex space-x-3">
            <button (click)="showDeleteModal = false" class="flex-1 px-4 py-2 rounded-xl border border-border-default text-sm font-bold hover:bg-bg-primary transition-all">Cancel</button>
            <button (click)="confirmDelete()" class="flex-1 px-4 py-2 rounded-xl bg-priority-high text-white text-sm font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-500/20">Delete</button>
          </div>
        </div>
      </div>
    </div>
   `,
  styles: [`
    .animate-fade-in { animation: fadeIn 0.2s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
  `]
})
export class ScheduledJobsComponent implements OnInit, OnDestroy {
  @Output() onReview = new EventEmitter<any>();
  private http = inject(HttpClient);
  private pollSub?: Subscription;
  jobs: any[] = [];
  activeMenuId: string | null = null;
  showDeleteModal = false;
  jobToDelete: any = null;
  private sanitizer = inject(DomSanitizer);

  summaryCards = [
    { 
      label: 'In Queue', 
      status: 'In Queue', 
      icon: this.sanitizer.bypassSecurityTrustHtml('<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>') 
    },
    { 
      label: 'Processing', 
      status: 'In Progress', 
      icon: this.sanitizer.bypassSecurityTrustHtml('<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>') 
    },
    { 
      label: 'Completed', 
      status: 'Completed', 
      icon: this.sanitizer.bypassSecurityTrustHtml('<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>') 
    }
  ];
  constructor(private apiService: ApiService) {}
  
  ngOnInit() {
    this.loadJobs();
    window.addEventListener('click', () => this.activeMenuId = null);
    // UI Polling method: every 10 seconds
    this.pollSub = interval(10000).pipe(
      switchMap(() => this.http.get<any[]>(this.apiService.jobsurl))
    ).subscribe(data => this.jobs = data);
  }

  ngOnDestroy() { this.pollSub?.unsubscribe(); }

  loadJobs() {
    this.http.get<any[]>(this.apiService.jobsurl).subscribe(data => this.jobs = data);
  }
  
  toggleMenu(id: string, event: Event) {
    event.stopPropagation();
    this.activeMenuId = this.activeMenuId === id ? null : id;
  }

regenerateJob(id: string): void {
   this.apiService.regenerateJob(id).subscribe({ 
    next: () => this.loadJobs(), 
    error: (err) => console.error('Error regenerating job', err) }); 
  }
  

  openDeleteConfirm(job: any) {
    this.jobToDelete = job;
    this.showDeleteModal = true;
    this.activeMenuId = null;
  }

confirmDelete(): void {
   if (!this.jobToDelete)
    return;
   this.apiService.deleteJob(this.jobToDelete.id).subscribe({ 
    next: () => { 
    this.showDeleteModal = false;
     this.loadJobs();
    }, 
    error: (err) =>
    console.error('Error deleting job', err)
   }); 
  }

  getCount(status: string) { 
    return this.jobs.filter(j => j.status === status).length;
   }

  getStatusClasses(status: string) {
    switch (status) {
      case 'Completed': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'In Progress': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  }
}
