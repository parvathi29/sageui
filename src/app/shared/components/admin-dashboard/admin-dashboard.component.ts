
import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../core/services/api.service';
import { ToasterService } from '../../../core/services/toaster.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-8 animate-fade-in space-y-8">
      <div class="flex justify-between items-end">
        <div>
          <h1 class="text-3xl font-black text-text-default tracking-tight">Admin Console</h1>
          <p class="text-gray-500 text-sm">Manage platform access and review user feedback</p>
        </div>
        <div class="flex space-x-3">
          <div class="px-4 py-2 bg-bg-secondary border border-border-default rounded-xl">
            <span class="text-[10px] font-bold text-gray-500 uppercase block">Server Status</span>
            <span class="text-xs font-bold text-green-500 flex items-center">
              <span class="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span> Operational
            </span>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-bg-secondary p-6 rounded-3xl border border-border-default shadow-sm">
          <p class="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">Pending Requests</p>
          <h2 class="text-4xl font-black text-highlight">{{ onboardingRequests().length }}</h2>
        </div>
        <div class="bg-bg-secondary p-6 rounded-3xl border border-border-default shadow-sm">
          <p class="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">User Suggestions</p>
          <h2 class="text-4xl font-black text-text-default">{{ suggestions().length }}</h2>
        </div>
        <div class="bg-bg-secondary p-6 rounded-3xl border border-border-default shadow-sm">
          <p class="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">Total Users</p>
          <h2 class="text-4xl font-black text-text-default">124</h2>
        </div>
      </div>

      <div class="bg-bg-secondary rounded-3xl border border-border-default overflow-hidden shadow-2xl">
        <div class="flex border-b border-border-default px-6">
          <button (click)="activeTab.set('onboarding')" 
            [class.border-highlight]="activeTab() === 'onboarding'"
            class="px-6 py-4 text-sm font-bold border-b-2 border-transparent transition-all">
            Onboarding Requests
          </button>
          <button (click)="activeTab.set('suggestions')" 
            [class.border-highlight]="activeTab() === 'suggestions'"
            class="px-6 py-4 text-sm font-bold border-b-2 border-transparent transition-all">
            User Suggestions
          </button>
        </div>

        <div class="p-6">
          <table *ngIf="activeTab() === 'onboarding'" class="w-full text-left border-separate border-spacing-y-3">
            <thead>
              <tr class="text-[10px] font-black text-gray-500 uppercase tracking-widest px-4">
                <th class="pb-2 pl-4">Enterprise</th>
                <th class="pb-2">Contact Info</th>
                <th class="pb-2">Role</th>
                <th class="pb-2 text-right pr-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let req of onboardingRequests()" class="bg-bg-primary/40 group hover:bg-bg-primary/80 transition-all">
                <td class="py-4 pl-4 rounded-l-2xl border-y border-l border-border-default">
                  <p class="font-bold text-text-default">{{ req.enterprise }}</p>
               
                </td>
                <td class="py-4 border-y border-border-default">
                  <p class="text-xs font-medium text-text-default">{{ req.email }}</p>
                  <p class="text-[10px] text-gray-500">{{ req.phone }}</p>
                </td>
                <td class="py-4 border-y border-border-default text-xs font-bold text-highlight">{{ req.role }}</td>
                <td class="py-4 pr-4 text-right rounded-r-2xl border-y border-r border-border-default">
                  <button (click)="approveRequest(req)" class="px-4 py-1.5 bg-green-500/10 text-green-500 text-[10px] font-black rounded-lg hover:bg-green-500 hover:text-white transition-all">
                    APPROVE & MAIL
                  </button>
                </td>
              </tr>
            </tbody>
          </table>

          <div *ngIf="activeTab() === 'suggestions'" class="space-y-4">
             <div *ngFor="let sug of suggestions()" class="p-6 bg-bg-primary/30 border border-border-default rounded-2xl">
                <div class="flex justify-between items-start mb-2">
                  {{ sug.suggestion_type | uppercase }} - {{ sug.project_name || 'General' }}
                 
                </div>
                <p class="text-sm text-gray-400 leading-relaxed">{{ sug.message }}</p>
                <div class="mt-4 pt-4 border-t border-border-default flex items-center text-[10px] text-gray-500">
                  <span class="font-bold text-text-default mr-2">{{ sug.user_name }}</span> • {{ sug.email }}
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AdminDashboardComponent implements OnInit {
  private api = inject(ApiService);
  private toaster = inject(ToasterService);

  activeTab = signal<'onboarding' | 'suggestions'>('onboarding');
  onboardingRequests = signal<any[]>([]);
  suggestions = signal<any[]>([]);

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    // These should call your specific admin endpoints
    this.api.getAdminOnboarding().subscribe(data => this.onboardingRequests.set(data));
    this.api.getAdminSuggestions().subscribe(data => this.suggestions.set(data));
  }

  approveRequest(req: any) {
    this.api.approveOnboarding(req.id).subscribe(() => {
      this.toaster.show(`Approved access for ${req.enterprise}`, 'success');
      this.fetchData(); // Refresh
    });
  }
}
