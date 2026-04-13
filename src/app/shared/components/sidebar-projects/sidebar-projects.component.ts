
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectFolder } from '../models/test-automation.model';

@Component({
  selector: 'app-sidebar-projects',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="mt-6 space-y-1">
      <div class="flex items-center justify-between px-3 mb-2">
        <p class="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Projects</p>
        <button (click)="onCreateRequest.emit()" class="text-gray-500 hover:text-highlight transition-colors">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
          </svg>
        </button>
      </div>

      <ng-container *ngTemplateOutlet="folderTree; context: { $implicit: projects, level: 0 }"></ng-container>

      <ng-template #folderTree let-folders let-level="level">
        <div *ngFor="let folder of folders" class="space-y-1">
          <div 
            class="group flex items-center justify-between p-2 rounded-xl text-gray-400 hover:bg-bg-primary cursor-pointer transition-all border border-transparent hover:border-border-default"
            [style.padding-left.px]="level * 12 + 8"
            (click)="handleProjectClick($event, folder)"
          >
            <div class="flex items-center min-w-0">
              <svg *ngIf="folder.subFolders?.length" 
                   [ngClass]="{'rotate-90': folder.isOpen}"
                   class="w-3 h-3 mr-1.5 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M9 5l7 7-7 7"/>
              </svg>
              <svg class="w-5 h-5 mr-2 shrink-0" [ngClass]="folder.isOpen ? 'text-highlight' : 'text-gray-500'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path *ngIf="!folder.isOpen" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"/>
                <path *ngIf="folder.isOpen" d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5z"/>
              </svg>
              <span class="text-sm font-medium truncate" [ngClass]="{'text-text-default': folder.isOpen}">{{ folder.name }}</span>
            </div>
            <span class="text-[10px] font-bold bg-bg-primary px-2 py-0.5 rounded border border-border-default">{{ folder.count }}</span>
          </div>

          <div *ngIf="folder.isOpen && folder.subFolders?.length" class="animate-fade-in">
            <ng-container *ngTemplateOutlet="folderTree; context: { $implicit: folder.subFolders, level: level + 1 }"></ng-container>
          </div>
        </div>
      </ng-template>
    </div>
  `
})
export class SidebarProjectsComponent {
  @Input() projects: ProjectFolder[] = [];
  @Output() onCreateRequest = new EventEmitter<void>();
  @Output() toggle = new EventEmitter<string>();
@Output() onSelect = new EventEmitter<string>();
toggleFolder(folder: ProjectFolder) {
  this.toggle.emit(folder.id);
}
handleProjectClick(event: MouseEvent, folder: ProjectFolder) {
    event.stopPropagation();
    // 1. Emit select to show the ProjectViewComponent
    this.onSelect.emit(folder.id);
    
    // 2. Still toggle if it has children (optional, based on your preference)
    if (folder.subFolders?.length) {
      this.toggle.emit(folder.id);
    }
}
}