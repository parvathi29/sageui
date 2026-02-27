import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-alert-banner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="visible()" 
         class="fixed top-20 right-8 z-[100] min-w-[300px] p-4 rounded-2xl border shadow-2xl animate-fade-in flex items-center justify-between"
         [ngClass]="type === 'success' 
           ? 'bg-green-500/10 border-green-500/20 text-green-500' 
           : 'bg-red-500/10 border-red-500/20 text-red-500'">

      <div class="flex items-center space-x-3">
        <svg *ngIf="type === 'success'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>

        <svg *ngIf="type === 'error'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>

        <span class="text-xs font-bold uppercase tracking-wider">
          {{ message }}
        </span>
      </div>

      <button (click)="visible.set(false)" 
              class="ml-4 opacity-50 hover:opacity-100 transition-opacity">
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"/>
        </svg>
      </button>

    </div>
  `
})
export class AlertBannerComponent {
  @Input() message: string = '';
  @Input() type: 'success' | 'error' = 'success';

  visible = signal(false);

  show(msg: string, type: 'success' | 'error' = 'success') {
    this.message = msg;
    this.type = type;
    this.visible.set(true);
    setTimeout(() => this.visible.set(false), 4000);
  }
}