import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
interface Step {
  id: number;
  label: string;
  subLabel: string;
}
@Component({
  selector: 'app-progress-stepper',
  standalone: true,
  imports: [CommonModule],
  // templateUrl: './progress-stepper.component.html',
  // styleUrl: './progress-stepper.component.scss'
  template: `
    <div class="flex justify-between items-center text-center max-w-4xl mx-auto py-8">
      <ng-container *ngFor="let step of steps; let i = index">
        <div class="flex flex-col items-center">
          <div
            class="w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors duration-300"
            [ngClass]="{
              'bg-highlight text-text-default': currentStep === step.id,
              'bg-gray-700 text-white': currentStep < step.id,
              'bg-green-600 text-text-default': currentStep > step.id
            }"
          >
            <span *ngIf="currentStep <= step.id">{{ step.id }}</span>
            <svg *ngIf="currentStep > step.id" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
          </div>
          <div class="mt-2 text-xs sm:text-sm">
            <p class="font-semibold" [ngClass]="{'text-text-default': currentStep >= step.id, 'text-gray-400': currentStep < step.id}">
              {{ step.label }}
            </p>
            <p class="text-xs text-gray-500 hidden sm:block">{{ step.subLabel }}</p>
          </div>
        </div>
        <div *ngIf="i < steps.length - 1" class="flex-auto border-t-2 transition-colors duration-300 mx-1 sm:mx-4"
          [ngClass]="{'border-highlight': currentStep > step.id, 'border-gray-700': currentStep <= step.id}">
        </div>
      </ng-container>
    </div>
  `,
})

export class ProgressStepperComponent {
  @Input() currentStep: number = 1;

  steps: Step[] = [
    { id: 1, label: 'Input', subLabel: 'User Story & Criteria' },
    { id: 2, label: 'Generate', subLabel: 'AI Test Cases' },
    { id: 3, label: 'Review', subLabel: 'Edit & Validate' },
    { id: 4, label: 'Export', subLabel: 'Deploy & Save' },
  ];
}
