import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToasterService } from '../core/services/toaster.service';
@Component({
  selector: 'app-toaster',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed top-24 right-8 z-[999] space-y-3 pointer-events-none">
      <div *ngFor="let toast of toaster.toasts()" 
           class="pointer-events-auto min-w-[320px] p-4 rounded-2xl border shadow-2xl animate-slide-in flex items-center justify-between transition-all duration-300"
           [ngClass]="toast.type === 'success' ? 'bg-bg-secondary border-green-500/30 text-green-500' : 'bg-bg-secondary border-priority-high/30 text-priority-high'">
        
        <div class="flex items-center space-x-3">
          <div [ngClass]="toast.type === 'success' ? 'bg-green-500/20' : 'bg-priority-high/20'" class="p-2 rounded-lg">
            <svg *ngIf="toast.type === 'success'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
            <svg *ngIf="toast.type === 'error'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </div>
          <div class="flex flex-col">
            <span class="text-[10px] font-black uppercase tracking-widest opacity-60">{{ toast.type }}</span>
            <span class="text-xs font-bold text-text-default">{{ toast.message }}</span>
          </div>
        </div>
        
        <button (click)="toaster.remove(toast.id)" class="text-gray-500 hover:text-white transition-colors">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"/></svg>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .animate-slide-in { animation: slideIn 0.3s cubic-bezier(0, 0, 0.2, 1); }
    @keyframes slideIn { from { opacity: 0; transform: translateX(100px); } to { opacity: 1; transform: translateX(0); } }
  `]
})
export class ToasterComponent {
  toaster = inject(ToasterService);
}