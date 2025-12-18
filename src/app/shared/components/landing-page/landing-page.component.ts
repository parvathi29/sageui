import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="app-container text-center py-20">
      
      <div class="inline-flex items-center bg-gray-700/50 text-gray-400 text-xs font-medium px-3 py-1 rounded-full mb-6">
        
        <svg width="20px" height="20px" viewBox="0 0 512 512" id="icons" xmlns="http://www.w3.org/2000/svg"><path d="M259.92,262.91,216.4,149.77a9,9,0,0,0-16.8,0L156.08,262.91a9,9,0,0,1-5.17,5.17L37.77,311.6a9,9,0,0,0,0,16.8l113.14,43.52a9,9,0,0,1,5.17,5.17L199.6,490.23a9,9,0,0,0,16.8,0l43.52-113.14a9,9,0,0,1,5.17-5.17L378.23,328.4a9,9,0,0,0,0-16.8L265.09,268.08A9,9,0,0,1,259.92,262.91Z" fill="none" stroke="#06b6d4" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/><polygon points="108 68 88 16 68 68 16 88 68 108 88 160 108 108 160 88 108 68" fill="none" stroke="#06b6d4" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/><polygon points="426.67 117.33 400 48 373.33 117.33 304 144 373.33 170.67 400 240 426.67 170.67 496 144 426.67 117.33" fill="none" stroke="#06b6d4" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/></svg>
         <i class="fa-jelly fa-regular fa-sparkles mr-1 text-transparent bg-clip-text bg-gradient-to-r from-[#06b6d4] to-[#2563eb]"></i>
        Powered by AI
      </div>

      <h1 class="text-4xl font-extrabold text-text-default mb-4">
        Simplify Testing. <span class="bg-gradient-to-r from-[#06b6d4] to-[#2563eb] bg-clip-text text-transparent">Amplify Quality</span>.
      </h1>
      <p class="text-lg text-gray-400 max-w-3xl mx-auto mb-10">
        Your AI assistant for QA teams. Transform user stories, requirements into comprehensive test cases and automation scripts — instantly.
      </p>

      <div class="flex justify-center space-x-6 mb-20">
        <button (click)="getStarted.emit()"
          class="bg-highlight hover:bg-purple-700 text-white px-8 py-3 rounded-lg text-lg font-medium transition-colors duration-200 flex items-center shadow-lg shadow-highlight/20">
          Get Started
          <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
        </button>
        <button class="bg-gray-700 hover:bg-gray-600 text-white px-8 py-3 rounded-lg text-lg font-medium transition-colors duration-200 border border-gray-600">
          Try Demo
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <div *ngFor="let card of featureCards" class="p-6 bg-bg-secondary rounded-xl border border-gray-700 hover:border-highlight transition-colors duration-200">
          <div class="flex justify-center mb-4">
            <div class="p-3 rounded-full bg-highlight/20 text-highlight">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" [attr.d]="card.iconPath"></path></svg>
            </div>
          </div>
          <h3 class="text-xl font-semibold text-text-default mb-3">{{ card.title }}</h3>
          <p class="text-sm text-gray-400">{{ card.description }}</p>
        </div>
      </div>
    </div>
  `,
})
export class LandingPageComponent {
  @Output() getStarted = new EventEmitter<void>();

  featureCards = [
    {
      title: 'Generate Test Cases',
      description: 'AI analyzes your user stories and acceptance criteria to create comprehensive test scenarios in seconds.',
      iconPath: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' // File/Document icon
    },
    {
      title: 'Review Scenarios',
      description: 'Edit, refine, and validate AI-generated test cases with full transparency into how each was created.',
      iconPath: 'M15 12a3 3 0 11-6 0 3 3 0 016 0zM19 12a7 7 0 00-7-7 7 7 0 00-7 7 7 7 0 007 7 7 7 0 007-7z' // Eye/Review icon
    },
    {
      title: 'Export Scripts',
      description: 'Generate ready-to-run automation scripts for Selenium, Playwright, or export to your preferred format.',
      iconPath: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4' // Download/Export icon
    },
  ];
}