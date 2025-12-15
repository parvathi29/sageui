

//app-test-automation-shell component
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressStepperComponent } from '../progress-stepper/progress-stepper.component';
import { InputRequirementsComponent } from '../input-requirements/input-requirements.component';
import { GenerationStatusComponent } from '../generation-status/generation-status.component';
import { ReviewValidateComponent } from '../review-validate/review-validate.component';
import { GenerationResult, TestCase } from '../models/test-automation.model';
import { ExportDeployComponent } from '../export-deploy/export-deploy.component';
import { FormsModule } from '@angular/forms';
import { LandingPageComponent } from '../landing-page/landing-page.component';
import { UnitTestInputComponent } from '../unit-test-input/unit-test-input.component'; 

type TestType = 'Functional' | 'Unit'; // Define the two flow types
import { ThemeService } from '../../../core/services/theme.service';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-test-automation-shell',
  standalone: true,
  imports: [
    CommonModule,
    ProgressStepperComponent,
    InputRequirementsComponent,
    GenerationStatusComponent, 
    ReviewValidateComponent,
    FormsModule,
    ExportDeployComponent,
    LandingPageComponent,
    UnitTestInputComponent
  ],
  template: `
  <div class="min-h-screen">
      <header class="bg-bg-secondary border-b border border-border-default py-4 px-8 sticky top-0 z-10 transition-colors duration-300">
        <div class="flex justify-between items-center max-w-7xl mx-auto">
          <div class="flex items-center space-x-3">
          
            <svg width="20px" height="20px" viewBox="0 0 512 512" id="icons" xmlns="http://www.w3.org/2000/svg"><path d="M259.92,262.91,216.4,149.77a9,9,0,0,0-16.8,0L156.08,262.91a9,9,0,0,1-5.17,5.17L37.77,311.6a9,9,0,0,0,0,16.8l113.14,43.52a9,9,0,0,1,5.17,5.17L199.6,490.23a9,9,0,0,0,16.8,0l43.52-113.14a9,9,0,0,1,5.17-5.17L378.23,328.4a9,9,0,0,0,0-16.8L265.09,268.08A9,9,0,0,1,259.92,262.91Z" fill="none" stroke="#8b7bfd" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/><polygon points="108 68 88 16 68 68 16 88 68 108 88 160 108 108 160 88 108 68" fill="none" stroke="#8b7bfd" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/><polygon points="426.67 117.33 400 48 373.33 117.33 304 144 373.33 170.67 400 240 426.67 170.67 496 144 426.67 117.33" fill="none" stroke="#8b7bfd" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/></svg>
             <div class="flex flex-col leading-tight">
            <span class="text-[20px] font-semibold" style="color:#8b7bfd;">Sage Script</span>
            <span class="text-[10px] text-gray-400 -mt-0.5">Automated testing powered by AI</span>
          </div>
          </div>
        
          <div class="flex items-center space-x-4">
            <span class="text-sm text-gray-400 hidden sm:block">Guest User</span>
            <button (click)="theme.toggleTheme()" 
                    class="p-1 rounded-full text-gray-500 hover:text-highlight transition-colors duration-150">
              
              <svg *ngIf="theme.isDarkTheme()" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
              </svg>

              <svg *ngIf="!theme.isDarkTheme()" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
              </svg>
            </button>
          </div>
        </div>
      </header>






    <main class="app-container">
    <app-landing-page
          *ngIf="currentStep === 0"
          (getStarted)="currentStep = 1"
        ></app-landing-page>

   
         <ng-container *ngIf="currentStep > 0">
              
            <div class="flex justify-center mb-8 mt-4">
            <div class="inline-flex rounded-lg border border-border-default p-1 bg-bg-secondary shadow-inner">
              <button (click)="currentTestType = 'Functional'"
                [ngClass]="currentTestType === 'Functional' ? 'bg-highlight text-white shadow-md' : 'text-gray-500 dark:text-gray-300 hover:bg-bg-primary'"
                class="px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                Functional Test Cases
              </button>
              <button (click)="selectUnitTestFlow()"
                [ngClass]="currentTestType === 'Unit' ? 'bg-highlight text-white shadow-md' : 'text-gray-500 dark:text-gray-300 hover:bg-bg-primary'"
                class="px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>
                Unit Test Cases
              </button>
            </div>
          </div>

          <ng-container *ngIf="currentTestType === 'Functional'">
            
             <app-progress-stepper [currentStep]="currentStep"></app-progress-stepper>
      <div class="my-10">
        <app-input-requirements
          *ngIf="currentStep === 1"
          (generationSuccess)="handleGeneration($event)"
        ></app-input-requirements>

        <ng-container *ngIf="currentStep === 2">
        <div *ngIf="!generationData; else statusContent" class="p-8 text-center bg-bg-secondary rounded-xl shadow-2xl">
          <h2 class="text-2xl font-semibold mb-4 text-primary">AI Test Case Generation</h2>
          <p class="text-gray-400 mb-6">AI is analyzing your user story and generating test cases</p>
          <div class="flex justify-center my-8">
            <svg class="animate-spin h-10 w-10 text-highlight" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <p class="text-sm text-gray-500">Generating test cases...</p>
        </div>
        <ng-template #statusContent>
            <app-generation-status
              [result]="generationData!"
              (reviewAndEdit)="currentStep = 3"
              (regenerate)="handleGeneration(null)"
              (goBack)="currentStep = 1"
            ></app-generation-status>
          </ng-template>
        </ng-container>
        <app-review-validate
          *ngIf="currentStep === 3"
          [testCases]="generationData?.test_cases || []"
          [automationScript]="generationData?.automation_script || ''"
           (exportAndDeploy)="currentStep = 4"
          (goBack)="currentStep = 2"
          (addNewTestCase)="addNewTestCase()"
        ></app-review-validate>


    <app-export-deploy
          *ngIf="currentStep === 4"
          [totalTestCases]="generationData?.test_cases?.length || 0"
          [totalAutomationScripts]="generationData?.automation_script ? 1 : 0"
          (goBack)="currentStep = 3"
          (startNew)="resetFlow()"
        ></app-export-deploy>
    
    </div>
    </ng-container>

<ng-container *ngIf="currentTestType === 'Unit'">
            <div class="my-10">
              <app-unit-test-input
                (generationComplete)="handleUnitTestGeneration()"
              ></app-unit-test-input>
            </div>
          </ng-container>

        </ng-container>


    </main>
    </div>
  `,
})
export class TestAutomationShellComponent  {
  
  theme=inject(ThemeService)
  currentStep: number = 0;
  receivedData: any = null; 
  currentTestType: TestType = 'Functional';
  generationData: GenerationResult | null = null;
  
  handleGeneration(data: GenerationResult | null): void {
    this.currentStep = 2; // Transition to Generation status immediately

    if (data) {
      // If data is provided (from Step 1 submit), simulate the loading time
      this.generationData = null;
      setTimeout(() => {
        this.generationData = data;
      }, 2000); // 2 second simulation
    } else {
      // If regenerating, clear data and restart simulation (in a real app, call the backend again)
      this.generationData = null;
      setTimeout(() => {
        // Dummy data for regeneration simulation
        this.generationData = {
          high_priority: 2,
          medium_priority: 2,
          low_priority: 1,
          test_cases: [ /* same dummy data */ ] as TestCase[]
        } as GenerationResult;
      }, 2000);
    }
  }

  getStepName(step: number): string {
    switch(step) {
      case 1: return 'Input Requirements';
      case 2: return 'Generating Test Cases';
      case 3: return 'Review & Validate';
      case 4: return 'Export & Deploy';
      default: return 'Flow';
    }
  }
  addNewTestCase(): void {
    if (this.generationData) {
      const newTc: TestCase = {
        id: `TC${String(this.generationData.test_cases.length + 1).padStart(3, '0')}`,
        title: 'New test case',
        source: 'Generated by AI analysis',
        type: 'Functional',
        priority: 'Low',
        status: 'Draft',
        feedback:''
      };
      this.generationData.test_cases.push(newTc);
      // Logic to count priorities would update here
    }
  }
  resetFlow(): void {
    this.currentStep = 1;
    this.generationData = null;
    this.currentTestType = 'Functional';
    console.log('Flow reset. Ready for new input.');
  }
   selectUnitTestFlow(): void {
    this.currentTestType = 'Unit';
    // When switching to Unit, we reset the step counter to 1, but we don't display the functional stepper.
    this.currentStep = 1; 
  }
  
  handleUnitTestGeneration(): void {
    // This is the equivalent of the end of the unit test workflow.
    // We can simulate a final step or just leave it on the generated list view.
    // For now, we'll keep the currentStep at 1 (representing the input/result phase of Unit tests).
    console.log('Unit test generation complete.');
  }
}