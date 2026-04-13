import { Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
@Component({
  selector: 'app-project-view',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="animate-fade-in space-y-6">
      
      <div class="bg-bg-secondary border border-border-default rounded-3xl p-8 flex justify-between items-start shadow-sm">
        <div class="flex items-start space-x-5">
          <div class="p-4 bg-highlight/10 rounded-2xl text-highlight">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" stroke-width="2"/></svg>
          </div>
          <div>
            <div class="flex items-center space-x-3">
            <h1 class="text-3xl font-black text-text-default">{{ projectData?.project?.name }}</h1>
            <span *ngIf="viewMode === 'stories'" class="px-3 py-1 bg-highlight/10 text-highlight text-[10px] font-black rounded-lg uppercase">Select Story</span>
            </div>
            <div class="flex items-center space-x-4 mt-2 text-xs font-bold text-gray-500 uppercase tracking-widest">
              <span># proj-{{ projectData?.project?.project_id }}</span>
              <span>•</span>
              <span>Created: 02/02/2026</span>
            </div>
            <p class="mt-4 text-gray-400 text-sm max-w-2xl leading-relaxed">{{ projectData?.project?.description }}</p>
          </div>
        </div>
        <div class="flex space-x-3">
          <button *ngIf="viewMode === 'stories'" (click)="viewMode = 'jobs'" class="px-6 py-3 border border-border-default rounded-2xl font-bold hover:bg-bg-primary transition-all">
             Back to Jobs
          </button>
        <button (click)="onNewGeneration.emit()" class="bg-highlight hover:bg-purple-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center space-x-2 transition-all shadow-lg shadow-highlight/20">
          <span>+ New Generation</span>
        </button>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div *ngFor="let stat of statCards" class="bg-bg-secondary border border-border-default p-6 rounded-2xl flex items-center space-x-4">
           <div class="p-3 bg-bg-primary rounded-xl text-highlight">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" [innerHTML]="stat.icon"></svg>
           </div>
           <div>
              <p class="text-2xl font-black">{{ stat.value }}</p>
              <p class="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">{{ stat.label }}</p>
           </div>
        </div>
      </div>

      <div class="bg-bg-secondary border border-border-default rounded-3xl overflow-hidden shadow-sm">
             <ng-container *ngIf="viewMode === 'jobs'">
        <div class="p-6 border-b border-border-default flex justify-between items-center">
          <h2 class="text-xl font-bold">Jobs History</h2>
          <select class="bg-bg-primary border border-border-default text-xs rounded-lg px-3 py-1.5 outline-none">
            <option>All Status</option>
          </select>
        </div>

        <div class="p-4 space-y-3">
          <div *ngFor="let job of projectData?.jobs" 
               (click)="onJobClick(job)"
               class="p-5 bg-bg-primary/30 border border-border-default rounded-2xl hover:border-highlight transition-all cursor-pointer group">
            <div class="flex justify-between items-center">
                <div class="flex items-center space-x-4">
             
              <!-- FIXED ICONS -->
              <div class="animate-pulse">

                <svg *ngIf="job.status !== 'COMPLETED'"
                     class="w-5 h-5 animate-spin text-amber-500"
                     fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" stroke-width="2"/>
                </svg>

                <svg *ngIf="job.status === 'COMPLETED'"
                     class="w-6 h-6 text-green-500"
                     fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke-width="2"/>
                </svg>

                 </div>
                
                  <div>
                  <h4 class="font-bold text-text-default group-hover:text-highlight">{{ job.job_id}}</h4>
                  <p class="text-[10px] text-gray-500 uppercase font-bold tracking-widest">{{ job.submitted_at | date:'medium' }}</p>
                  </div>
              </div>
              <span [ngClass]="getStatusClasses(job.status)" class="px-3 py-1 rounded-full text-[10px] font-black border uppercase">
                {{ job.status }}
              </span>
              </div>
          </div>
            </div>
         

          
        </ng-container>
              <ng-container *ngIf="viewMode === 'stories'">
          <div class="p-6 border-b border-border-default flex justify-between items-center bg-bg-primary/20">
            <h2 class="text-xl font-bold italic text-highlight">Select a Story from Job #{{ selectedJob?.job_id }}</h2>
            <span class="text-xs font-bold text-gray-500">{{ availableStories.length }} stories ready for review</span>
          </div>
          
          <div class="p-4 grid grid-cols-1 gap-3">
             <div *ngFor="let story of availableStories" 
                  (click)="selectStory(story)"
                  class="p-6 bg-bg-primary/20 border border-border-default rounded-2xl hover:border-highlight cursor-pointer transition-all group">
                <div class="flex justify-between items-center mb-3">
                  <span class="px-3 py-1 bg-highlight/10 text-highlight text-[10px] font-black rounded-lg uppercase tracking-widest border border-highlight/20">
                    {{ story.user_story_id }}
                  </span>
                  <div class="flex items-center text-xs font-bold text-gray-500 group-hover:text-highlight">
                    <span>Review Cases</span>
                    <svg class="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 7l5 5m0 0l-5 5m5-5H6" stroke-width="2"/></svg>
                  </div>
                </div>
                <p class="text-text-default font-medium leading-relaxed">{{ story.user_story_text }}</p>
             </div>
          </div>
        </ng-container>
          
          <div *ngIf="projectData?.jobs.length === 0" class="py-20 text-center flex flex-col items-center">
             <svg class="w-12 h-12 text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" stroke-width="2"/></svg>
             <p class="text-gray-500 text-sm font-medium">No jobs found for this project</p>
          </div>
        
      </div>

    </div>
  `
})
export class ProjectViewComponent implements OnInit, OnChanges  {
@Input() projectId!: number;
@Output() onNewGeneration = new EventEmitter();
@Output() navigateToStories = new EventEmitter<any>();
  private api = inject(ApiService);
sanitizer = inject(DomSanitizer);
  projectData: any;
  statCards: any[] = [];
  viewMode: 'jobs' | 'stories' = 'jobs';
  selectedJob: any = null;
  availableStories: any[] = [];
  


  ngOnInit() {
    this.loadProjectDetails();
  }
ngOnChanges(changes: SimpleChanges) {
  if (changes['projectId'] && this.projectId) {
     this.viewMode = 'jobs'; 
    this.loadProjectDetails();
  }
}

  loadProjectDetails() {
    this.api.getProjectDetails(this.projectId).subscribe(data => {
      this.projectData = data;
      this.projectData.jobs = [...data.jobs].sort(
  (a, b) => b.job_id - a.job_id   // latest first
);
      this.statCards = [
        { label: 'Test Cases', value: data.stats.test_cases, icon: this.sanitizer.bypassSecurityTrustHtml('<path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke-width="2"/>') },
        { label: 'Scripts', value: data.stats.scripts, icon:this.sanitizer.bypassSecurityTrustHtml('<path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" stroke-width="2"/>') },
        { label: 'Jobs', value: data.stats.jobs_count, icon:this.sanitizer.bypassSecurityTrustHtml('<path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" stroke-width="2"/>' )},
        { label: 'User Stories', value: data.stats.stories_count, icon: this.sanitizer.bypassSecurityTrustHtml('<path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5S19.832 5.477 21 6.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" stroke-width="2"/>' )}
      ];
    });
  }

 onJobClick(job: any) {
    if (job.status !== 'COMPLETED') return;

    this.selectedJob = job;
    this.api.getStories(job.job_id).subscribe((stories: any[]) => {
      if (stories.length === 1) {
        // Auto-select if only one story
        this.selectStory(stories[0]);
      } else {
        this.availableStories = stories;
        this.viewMode = 'stories'; // Switch to story selection view
      }
    });
  }
    selectStory(story: any) {
    this.navigateToStories.emit({
      storyId: story.user_story_id,
      storyText: story.user_story_text,
      jobId: story.job_id
    });
  }


  

  getStatusClasses(status: string) {
    switch (status) {
      case 'COMPLETED': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'IN_PROGRESS': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  }
}

