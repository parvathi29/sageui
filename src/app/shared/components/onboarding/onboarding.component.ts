import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Output } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-onboarding',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-bg-primary p-6">
      <div class="max-w-xl w-full bg-bg-secondary border border-border-default rounded-3xl p-10 shadow-2xl">
        <h2 class="text-2xl font-black text-text-default mb-2">Request Access</h2>
        <p class="text-gray-400 text-sm mb-8">
          Enter your details. We will send verification credentials to your official mail.
        </p>
        
        <form [formGroup]="onboardForm" (ngSubmit)="submit()" class="space-y-4">
          
          <div>
            <input
              type="email"
              formControlName="email"
              placeholder="Official Email"
              class="w-full p-4 bg-bg-primary border border-border-default rounded-xl text-text-default outline-none focus:border-highlight"
              [ngClass]="{
                'border-priority-high':
                  onboardForm.get('email')?.invalid &&
                  onboardForm.get('email')?.touched
              }"
            />
          </div>

          <input
            type="text"
            formControlName="enterprise"
            placeholder="Enterprise/Company Name"
            class="w-full p-4 bg-bg-primary border border-border-default rounded-xl text-text-default outline-none focus:border-highlight transition-all"
          />

          <select
            formControlName="role"
            class="w-full p-4 bg-bg-primary border border-border-default rounded-xl text-text-default outline-none focus:border-highlight transition-all"
          >
            <option value="">Select Role</option>
            <option value="QA Lead">QA Lead</option>
            <option value="Tester">Tester</option>
          </select>

          <input
            type="text"
            formControlName="phone"
            placeholder="Contact Number"
            class="w-full p-4 bg-bg-primary border border-border-default rounded-xl text-text-default outline-none focus:border-highlight"
          />

          <button
            type="submit"
            [disabled]="onboardForm.invalid || isLoading"
            class="w-full py-4 bg-highlight text-white font-bold rounded-xl shadow-lg shadow-highlight/20 mt-4 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ isLoading ? 'Processing Request...' : 'Submit Request' }}
          </button>

          <button
            type="button"
            (click)="goBack.emit()"
            class="w-full text-gray-500 text-sm font-medium hover:text-white transition-colors"
          >
            Back to Home
          </button>
        </form>

        <div
          *ngIf="isSubmitted"
          class="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-center"
        >
          <p class="text-green-500 text-sm font-bold">
            Request Sent! Check your email for verification.
          </p>
        </div>
      </div>
    </div>
  `
})
export class OnboardingComponent {
  @Output() goBack = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private api = inject(ApiService);

  onboardForm: FormGroup;
  isLoading = false;
  isSubmitted = false;

  constructor() {
    this.onboardForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      enterprise: ['', Validators.required],
      role: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]*$')]]
    });
  }

  submit() {
    if (this.onboardForm.invalid) {
      this.onboardForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const payload = this.onboardForm.value;

    this.api.requestOnboarding(payload)
      .pipe(
        catchError(err => {
          this.isLoading = false;
          alert('Failed to submit onboarding request. Please try again.');
          return of(null);
        })
      )
      .subscribe(res => {
        this.isLoading = false;

        if (res) {
          this.isSubmitted = true;
          this.onboardForm.reset();

          setTimeout(() => this.goBack.emit(), 3000);
        }
      });
  }
}
