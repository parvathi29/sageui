import { Component, Output, EventEmitter,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService, DashboardData } from '../../../core/services/api.service';
import { DomSanitizer,SafeHtml} from '@angular/platform-browser';

@Component({
  selector: 'app-dashbord',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="animate-fade-in">
      <div class="flex justify-between items-center mb-10">

        <div>
          <h1 class="text-3xl font-extrabold tracking-tight">Dashboard</h1>
          <p class="text-gray-500 text-sm mt-1">Overview of your test automation projects</p>
        </div>
        <button (click)="onNewGeneration.emit()" class="bg-highlight/10 text-highlight border border-highlight/30 px-6 py-2 rounded-xl font-bold flex items-center hover:bg-highlight hover:text-white transition-all shadow-lg shadow-highlight/10">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4"/></svg>
          New Generation
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div *ngFor="let stat of stats" class="bg-bg-secondary p-6 rounded-2xl border border-border-default hover:border-highlight/50 transition-all cursor-pointer group">
          <div class="flex justify-between items-start mb-4">
             <div class="p-2 bg-bg-primary rounded-lg text-highlight">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" [innerHTML]="stat.icon"></svg>
             </div>
             <span [ngClass]="stat.trendUp ? 'text-green-500' : 'text-gray-500'" class="text-[10px] font-bold uppercase tracking-widest">
                {{ stat.trend }}
             </span>
          </div>
          <p class="text-gray-500 text-xs font-bold uppercase tracking-widest">{{ stat.label }}</p>
          <h2 class="text-4xl font-extrabold mt-1 group-hover:text-highlight transition-colors">{{ stat.value }}</h2>
          <p class="text-[10px] text-gray-500 mt-2">{{ stat.subtext }}</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 bg-bg-secondary rounded-3xl border border-border-default p-8 overflow-hidden relative shadow-sm">
          <div class="flex justify-between items-center mb-8">
             <h3 class="text-xl font-bold flex items-center">
                Recent Jobs
                <span class="ml-3 text-[10px] bg-highlight/20 text-highlight px-2 py-0.5 rounded-full">LIVE</span>
             </h3>
             <button (click)="onViewJobs.emit()" class="text-xs font-bold text-gray-500 hover:text-highlight flex items-center transition-colors">
                View All <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg>
             </button>
          </div>
          
          <div class="space-y-2">
             <div *ngFor="let job of recentJobs" class="flex items-center justify-between p-4 rounded-2xl hover:bg-bg-primary/50 transition-all group border border-transparent hover:border-border-default">
                <div class="flex items-center space-x-4">
                   <div class="w-10 h-10 rounded-full flex items-center justify-center bg-bg-primary text-gray-500 border border-border-default">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                   </div>
                   <div>
                      <p class="text-sm font-bold group-hover:text-highlight transition-colors">{{ job.name }}</p>
                     
                   </div>
                </div>
                <div class="flex items-center space-x-6">
                   <div *ngIf="job.testCount" class="text-right hidden sm:block">
                      <p class="text-xs font-bold">{{ job.testCount }} tests</p>
                   </div>
                   <span [ngClass]="getStatusClasses(job.status)" class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border">
                      {{ job.status }}
                   </span>
                </div>
             </div>
          </div>
        </div>

        <div class="bg-bg-secondary rounded-3xl border border-border-default p-8 flex flex-col shadow-sm">
           <h3 class="text-xl font-bold mb-8">Job Statistics</h3>
           <div class="flex-1 space-y-6">
              <div *ngFor="let s of jobStatusStats" class="flex items-center justify-between group">
                 <div class="flex items-center">
                    <div [style.backgroundColor]="s.color" class="w-2.5 h-2.5 rounded-full mr-4 shadow-sm shadow-black/20 transition-transform group-hover:scale-125"></div>
                    <span class="text-sm font-medium text-gray-400 group-hover:text-text-default transition-colors">{{ s.label }}</span>
                 </div>
                 <span class="text-lg font-bold group-hover:text-highlight transition-colors">{{ s.value }}</span>
              </div>
           </div>
           <button (click)="onViewJobs.emit()" class="mt-10 w-full py-4 rounded-2xl border border-border-default text-xs font-bold text-gray-500 hover:border-highlight hover:text-highlight transition-all flex items-center justify-center bg-bg-primary/30">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              View All Jobs
           </button>
        </div>
      </div>
    </div>
  `
})
export class DashbordComponent implements OnInit{
  @Output() onNewGeneration = new EventEmitter();
  @Output() onViewJobs = new EventEmitter();
  stats: any[] = [];
  recentJobs: any[] = [];
  jobStatusStats: any[] = [];
  isLoading = true;


  constructor(private api: ApiService,private sanitizer: DomSanitizer) {}
 ngOnInit(): void {
    const userId = 1; // Later, get this from your Auth/JWT service
    this.loadDashboard(userId);
  }
 loadDashboard(userId: number): void {
    this.api.getDashboardStats(userId).subscribe({
      next: (data: DashboardData) => {
        // Map the backend icons back to the stats array
        const rawIcons = [ 

          '<path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"/>',
          '<path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>',
          '<path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>',
          '<path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>'
        ];

        this.stats = data.stats.map((s, i) => ({ ...s, icon:this.sanitizer.bypassSecurityTrustHtml(rawIcons[i]) }));
        this.recentJobs = data.recentJobs;

        // Ensure the dashboard always shows a "Failed" bucket (fallback 0)
        // and preserves the order/labels we want to show in the UI.
        const defaults = [
          { label: 'Completed', value: 0, color: '#10b981' },
          { label: 'In Progress', value: 0, color: '#f59e0b' },
          { label: 'In Queue', value: 0, color: '#6b7280' },
          { label: 'Failed', value: 0, color: '#ef4444' }
        ];

        const apiStats = Array.isArray(data.jobStatusStats) ? data.jobStatusStats : [];
        this.jobStatusStats = defaults.map((d) => {
          const match = apiStats.find((s: any) => s.label?.toLowerCase() === d.label.toLowerCase());
          return match ? { ...d, ...match } : d;
        });

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching dashboard data', err);
        this.isLoading = false;
      }
    });
  }
   getStatusClasses(status: string) {
    const s = status.toLowerCase();
        if (s.includes('completed')) return 'bg-green-500/10 text-green-500 border-green-500/20';
    if (s.includes('progress')) return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
    if (s.includes('fail')) return 'bg-red-500/10 text-red-500 border-red-500/20';
    return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
  }




//   stats = [
//     { label: 'Total Projects', value: '9', subtext: '4 root folders', icon: '<path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"/>', trend: '', trendUp: false },
//     { label: 'Test Cases', value: '319', subtext: '+12 this week', icon: '<path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>', trend: '↗ 12% increase', trendUp: true },
//     { label: 'Automation Scripts', value: '259', subtext: 'Java/Selenium framework', icon: '<path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>', trend: '', trendUp: false },
//     { label: 'Active Jobs', value: '4', subtext: '1 processing, 3 queued', icon: '<path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>', trend: 'LIVE', trendUp: true }
//   ];

//   recentJobs = [
//     { name: 'Banking Portal', description: 'yyyyy', status: 'In Queue' },
//     { name: 'Patient Records', description: 'HIPAA compliance tests', status: 'In Queue' },
//     { name: 'Transaction Module', description: 'Wire transfer validations', status: 'In Queue' },
//     { name: 'User Management', description: 'CRUD operations for users', status: 'In Progress' },
//     { name: 'Payment Gateway', description: 'Stripe integration tests', status: 'Completed', testCount: 18 }
//   ];

//   jobStatusStats = [
//     { label: 'Completed', value: 2, color: '#10b981' },
//     { label: 'In Progress', value: 1, color: '#f59e0b' },
//     { label: 'In Queue', value: 3, color: '#6b7280' }
//   ];

//   getStatusClasses(status: string) {
//     switch (status) {
//       case 'Completed': return 'bg-green-500/10 text-green-500 border-green-500/20';
//       case 'In Progress': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
//       case 'In Queue': return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
//       default: return '';
//     }
//   }
}