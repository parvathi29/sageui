

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProjectFolder } from '../models/test-automation.model';

@Component({
  selector: 'app-project-model',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div class="w-full max-w-md bg-bg-secondary border border-border-default rounded-2xl shadow-2xl overflow-hidden shadow-highlight/10">
        
        <div class="flex items-center justify-between p-6 border-b border-border-default">
          <h3 class="text-lg font-bold text-text-default">Create New Project</h3>
          <button (click)="onClose.emit()" class="text-gray-500 hover:text-white transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <div class="p-6 space-y-6">
          <div class="space-y-2">
            <label class="text-xs font-bold text-gray-500 uppercase tracking-widest">Project Name</label>
            <input type="text" [(ngModel)]="newProjectName" placeholder="e.g. Banking Portal"
                   class="w-full p-3 bg-bg-primary border border-border-default rounded-xl text-text-default focus:ring-2 focus:ring-highlight/50 focus:border-highlight outline-none transition-all">
          </div>

          <div class="space-y-2">
            <label class="text-xs font-bold text-gray-500 uppercase tracking-widest">Parent folder (optional)</label>
            <select [(ngModel)]="selectedParentId"
                    class="w-full p-3 bg-bg-primary border border-border-default rounded-xl text-text-default focus:ring-2 focus:ring-highlight/50 focus:border-highlight outline-none transition-all">
              <option value="root">Root level</option>
              <option *ngFor="let p of flatProjects" [value]="p.id">{{ p.name }}</option>
            </select>
          </div>
           
          <div class="space-y-2">
            <label class="text-xs font-bold text-gray-500 uppercase tracking-widest">
              Project Description
            </label>
            <textarea 
              [(ngModel)]="projectSpec"
              rows="4"
              placeholder="Enter project details, goals, scope..."
              class="w-full p-3 bg-bg-primary border border-border-default rounded-xl text-text-default focus:ring-2 focus:ring-highlight/50 focus:border-highlight outline-none transition-all resize-none">
            </textarea>
          </div>

          <button (click)="submit()" [disabled]="!newProjectName"
                  class="w-full py-4 bg-purple-400 hover:bg-purple-500 text-black font-extrabold rounded-xl transition-all shadow-lg shadow-cyan-400/20 active:scale-[0.98] disabled:opacity-50">
            Create Project
          </button>
        </div>
      </div>
    </div>
  `
})
export class ProjectModelComponent {
  @Input() flatProjects: ProjectFolder[] = [];
  @Output() onClose = new EventEmitter<void>();
  @Output() onCreate = new EventEmitter<{name: string, parentId: string}>();

  newProjectName = '';
  selectedParentId = 'root';
  description ='';
  projectSpec = '';
  submit() {

    const payload = {
    name: this.newProjectName, 
    parentId: this.selectedParentId, 
    project_spec: this.projectSpec || null 
  };
    this.onCreate.emit(payload);
    this.newProjectName = '';
    this.projectSpec = '';
    this.onClose.emit();
  }
}