import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestCase } from '../models/test-automation.model';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
@Component({
  selector: 'app-review-validate',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-bg-secondary p-8 rounded-xl shadow-2xl">
      <h2 class="text-2xl font-semibold mb-4 text-text-default">Review & Validate</h2>
      <p class="text-gray-400 mb-6">Review AI-generated test cases with full transparency and provide feedback</p>

      <div class="flex justify-between items-center border-b border-gray-700 mb-6">
        <div class="flex space-x-4 -mb-px">
          <button (click)="currentView = 'testCases'"
            [ngClass]="{'border-highlight text-text-content': currentView === 'testCases', 'border-transparent text-gray-400 hover:text-text-default': currentView !== 'testCases'}"
            class="py-2 px-4 border-b-2 font-medium transition-colors duration-150">
            Test Cases ({{ testCases.length }})
          </button>
          <button (click)="currentView = 'script'"
            [ngClass]="{'border-highlight text-text-content': currentView === 'script', 'border-transparent text-gray-400 hover:text-white': currentView !== 'script'}"
            class="py-2 px-4 border-b-2 font-medium transition-colors duration-150">
            Automation Script
          </button>
        </div>
        <button *ngIf="currentView === 'testCases'" (click)="addNewTestCase.emit()"
          class="bg-highlight hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center">
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
          Add Test Case
        </button>
      </div>

      <div *ngIf="currentView === 'testCases'" class="p-3 mb-6 bg-bg-secondary border-l-4 border-highlight text-sm text-gray-300">
        <span class="font-bold text-text-default">AI Transparency:</span> Each test case shows its source from your requirements. Use feedback buttons to help improve generation quality.
      </div>

      <div *ngIf="currentView === 'testCases'" class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-700">
          <thead>
            <tr class="text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              <th class="py-3 px-2">ID</th>
              <th class="py-3 px-2">Title & Source</th>
              <th class="py-3 px-2">Type</th>
              <th class="py-3 px-2">Priority</th>
              <th class="py-3 px-2">Status</th>
              <th class="py-3 px-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-800">
            <tr *ngFor="let tc of testCases" class="hover:bg-purple transition-colors duration-150">
              <td class="py-4 px-2 whitespace-nowrap text-sm font-medium text-gray-300">{{ tc.id }}</td>
              <td class="py-4 px-2 max-w-lg">
                <p class="text-sm font-semibold text-text-default truncate hover:overflow-visible hover:whitespace-normal">{{ tc.title }}</p>
                <p class="text-xs text-gray-500 mt-1">{{ tc.source }}</p>
              </td>
              <td class="py-4 px-2 whitespace-nowrap text-sm text-gray-400">{{ tc.type }}</td>
              <td class="py-4 px-2 whitespace-nowrap">
                <span class="px-2 py-0.5 rounded-full text-xs font-semibold"
                  [ngClass]="getPriorityClasses(tc.priority)">
                  {{ tc.priority }}
                </span>
              </td>
              <td class="py-4 px-2 whitespace-nowrap text-sm text-gray-300">{{ tc.status }}</td>
              <td class="py-4 px-2 whitespace-nowrap text-center text-sm font-medium space-x-3">
                <button (click)="action('edit', tc.id)" title="Edit" class="text-gray-400 hover:text-highlight">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                </button>
             <button 
             class="w-5 h-5 ransition-colors duration-200"
  (click)="toggleFeedback( tc,'like')" 
  title="Good feedback"
  [ngClass]="{'text-green-500': tc.feedback === 'like', 'text-gray-400': tc.feedback !== 'like'}"
  [innerHTML]="thumbUpSvg">
</button>

<button 
class="w-5 h-5 transition-colors duration-200"
  (click)="toggleFeedback( tc,'dislike')" 
  title="Bad feedback"
  [ngClass]="{'text-red-500': tc.feedback === 'dislike', 'text-gray-400': tc.feedback !== 'dislike'}"
  [innerHTML]="thumbDownSvg">
</button>


                <button (click)="action('delete', tc.id)" title="Delete" class="text-gray-400 hover:text-red-600">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div *ngIf="currentView === 'script'" class="p-4 bg-bg-primary rounded-lg max-h-96 overflow-y-auto">
      <h3 class="text-md font-semibold text-gray-300 mb-2">Python/Selenium Script</h3>
      <button class="float-right text-xs text-highlight hover:text-purple-400 border border-highlight px-2 py-1 rounded">
        Save Script
      </button>
      <pre class="whitespace-pre-wrap text-xs text-text-default font-mono">
      {{ automationScript }}
    </pre>

      </div>

      <div class="flex justify-between mt-8">
        <button (click)="goBack.emit()" class="text-gray-400 hover:text-white flex items-center">
          <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          Back
        </button>
        <button (click)="exportAndDeploy.emit()"
          class="bg-highlight hover:bg-purple-700 text-white px-6 py-3 rounded-lg flex items-center transition-colors duration-200">
          Export & Deploy
          <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
        </button>
      </div>
    </div>
  `,
})
export class ReviewValidateComponent  implements OnInit{
  constructor(private http: HttpClient,private sanitizer: DomSanitizer) {}
  @Input({ required: true }) testCases: TestCase[] = [];
  @Output() exportAndDeploy = new EventEmitter<void>();
  @Output() goBack = new EventEmitter<void>();
  @Output() addNewTestCase = new EventEmitter<void>();
thumbUpSvg: SafeHtml = '';
thumbDownSvg: SafeHtml = '';
  currentView: 'testCases' | 'script' = 'testCases';
  @Input({ required: true }) automationScript: string = '';
  getPriorityClasses(priority: 'High' | 'Medium' | 'Low'): string {
    switch (priority) {
      case 'High':
        return 'bg-priority-high/20 text-priority-high';
      case 'Medium':
        return 'bg-priority-medium/20 text-priority-medium';
      case 'Low':
        return 'bg-priority-low/20 text-priority-low';
      default:
        return '';
    }
  }

  action(type: string, id: string): void {
    // In a real application, this would trigger modal/API calls
    console.log(`Action: ${type} performed on Test Case ID: ${id}`);
    // For "delete," you would update the 'testCases' array here.
  }
  ngOnInit() {
   this.http.get('/assets/icons/thumb-up.svg', { responseType: 'text' })
    .subscribe(svg => this.thumbUpSvg = this.sanitizer.bypassSecurityTrustHtml(svg));

  this.http.get('/assets/icons/thumb-down.svg', { responseType: 'text' })
    .subscribe(svg => this.thumbDownSvg = this.sanitizer.bypassSecurityTrustHtml(svg));
  }


  toggleFeedback(tc: any, type: 'like' | 'dislike') {
  tc.feedback = tc.feedback === type ? null : type;
}
}