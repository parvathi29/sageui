import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GenerationResult } from '../models/test-automation.model';

@Component({
  selector: 'app-generation-status',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-8 bg-bg-secondary rounded-xl shadow-2xl">
      <h2 class="text-2xl font-semibold mb-4 text-text-default">AI Test Case Generation</h2>
      <p class="text-gray-400 mb-6">AI is analyzing your user story and generating test cases</p>

      <div class="flex justify-around space-x-4 mb-10">
        <div *ngFor="let item of priorityItems" class="flex-1 p-6 rounded-lg border-2"
          [ngClass]="getCardClasses(item.priority)">
          <p class="text-lg font-medium text-gray-300">{{ item.label }}</p>
          <p class="text-4xl font-bold mt-1">{{ result[item.key] }}</p>
        </div>
      </div>

      <div class="bg-bg-primary p-6 rounded-lg">
        <div class="flex items-center mb-4">
          <svg class="w-6 h-6 text-highlight mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <h3 class="text-xl font-semibold text-text-default">Generation Complete</h3>
        </div>
        <ul class="space-y-2 text-gray-400">
          <li class="flex items-center">
            <svg class="w-4 h-4 text-priority-low mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
            {{ result.test_cases.length }} functional test cases created
          </li>
          <li class="flex items-center">
            <svg class="w-4 h-4 text-priority-low mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
            Automation scripts generated (Python/Selenium)
          </li>
          <li class="flex items-center">
            <svg class="w-4 h-4 text-priority-low mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
            All test cases validated
          </li>
        </ul>
      </div>

      <div class="flex justify-between mt-8">
        <button (click)="goBack.emit()" class="text-gray-400 hover:text-white flex items-center">
          <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          Back
        </button>
        <div class="flex space-x-4">
          <button (click)="regenerate.emit()" class="text-highlight hover:text-purple-400">
            Regenerate
          </button>
          <button (click)="reviewAndEdit.emit()" class="bg-highlight hover:bg-purple-700 text-white px-6 py-3 rounded-lg flex items-center transition-colors duration-200">
            Review & Edit
            <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
          </button>
        </div>
      </div>
    </div>
  `,
})
export class GenerationStatusComponent {
  @Input({ required: true }) result!: GenerationResult;
  @Output() reviewAndEdit = new EventEmitter<void>();
  @Output() regenerate = new EventEmitter<void>();
  @Output() goBack = new EventEmitter<void>();

  priorityItems: { 
    label: string; 
    key: keyof GenerationResult; 
    priority: 'High' | 'Medium' | 'Low'; 
  }[] = [
    { label: 'High Priority', key: 'high_priority', priority: 'High' },
    { label: 'Medium Priority', key: 'medium_priority', priority: 'Medium' },
    { label: 'Low Priority', key: 'low_priority', priority: 'Low' },
  ];

  getCardClasses(priority: 'High' | 'Medium' | 'Low'): string {
    switch (priority) {
      case 'High':
        return 'border-priority-high text-priority-high';
      case 'Medium':
        return 'border-priority-medium text-priority-medium';
      case 'Low':
        return 'border-priority-low text-priority-low';
      default:
        return '';
    }
  }
}