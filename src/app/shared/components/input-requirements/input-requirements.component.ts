import { Component, Output, EventEmitter, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
type InputType = 'Manual Input' | 'Upload Document' | 'Fetch from DevOps' ;
@Component({
  selector: 'app-input-requirements',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  template: `
    <div class="p-6 bg-bg-secondary border border-border-default rounded-xl shadow-2xl">
      <h2 class="text-xl font-semibold mb-6 text-text-default">Input Requirements</h2>
      <p class="text-sm text-gray-400 mb-6">
        Upload files, connect to DevOps, or enter requirements manually
      </p>

      <form [formGroup]="inputForm" (ngSubmit)="generateTestCases()" class="space-y-6">
        <div class="flex flex-col space-y-2">
          <label for="inputType" class="text-sm font-medium text-gray-500 dark:text-gray-300">Input Type</label>
          <select id="inputType" formControlName="inputType"
            class="bg-bg-primary border border-gray-700 text-sm rounded-lg w-full px-3 p-2.5 text-text-default focus:ring-highlight focus:border-highlight"
          >
            <option value="Manual Input" class="hover:bg-highlight/10">Manual Input</option>
            <option value="Upload Document" class="hover:bg-highlight/10">Upload Document</option>
            <option value="Fetch from DevOps" disabled class="text-gray-500">Fetch from DevOps (Coming Soon)</option>
            </select>
        </div>

      <ng-container *ngIf="currentInputType === 'Manual Input'">
          
          <div class="p-4 bg-bg-primary rounded-lg  border-border-default flex items-start space-x-3 transition-colors duration-300">
            <svg class="w-5 h-5 opacity-80 text-highlight flex-shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                <path fill="currentColor" d="M424.5 355.1C449 329.2 464 294.4 464 256C464 176.5 399.5 112 320 112C240.5 112 176 176.5 176 256C176 294.4 191 329.2 215.5 355.1C236.8 377.5 260.4 409.1 268.8 448L371.2 448C379.6 409 403.2 377.5 424.5 355.1zM459.3 388.1C435.7 413 416 443.4 416 477.7L416 496C416 540.2 380.2 576 336 576L304 576C259.8 576 224 540.2 224 496L224 477.7C224 443.4 204.3 413 180.7 388.1C148 353.7 128 307.2 128 256C128 150 214 64 320 64C426 64 512 150 512 256C512 307.2 492 353.7 459.3 388.1zM272 248C272 261.3 261.3 272 248 272C234.7 272 224 261.3 224 248C224 199.4 263.4 160 312 160C325.3 160 336 170.7 336 184C336 197.3 325.3 208 312 208C289.9 208 272 225.9 272 248z"/></svg>
                   <div class="flex flex-col leading-tight"> 
                    <h4 class="text-sm font-semibold text-text-default mb-2">Sample Format</h4>
                      <p class="text-xs text-gray-600 dark:text-gray-400">
 <span class="font-mono">User Story:</span> "As a [role], I want to [action] so that [benefit]"
</p>
<p class="text-xs text-gray-600 dark:text-gray-400">
<span class="font-mono">Acceptance Criteria:</span> Use Given-When-Then format
</p>
</div>
 </div>

          <div>
            <label for="userStory" class="block mb-2 text-sm font-medium text-gray-500 dark:text-gray-300">
              User Story <span class="text-xs text-gray-500">(As a user, I want to...)</span>
            </label>
            <textarea id="userStory" rows="4" formControlName="userStory"
              class="block p-2.5 w-full text-sm rounded-lg border bg-bg-primary border-border-default placeholder-gray-400 text-text-default focus:ring-highlight focus:border-highlight"
              placeholder="As a user I want to login to the application so that I can access my account..."
            ></textarea>
            <p *ngIf="inputForm.controls['userStory'].invalid && inputForm.controls['userStory'].touched"
               class="mt-1 text-xs text-priority-high">
              User Story is required.
            </p>
          </div>

          <div>
            <label for="acceptanceCriteria" class="block mb-2 text-sm font-medium text-gray-500 dark:text-gray-300">
              Acceptance Criteria <span class="text-xs text-gray-500">(Given... When... Then...)</span>
            </label>
            <textarea id="acceptanceCriteria" rows="6" formControlName="acceptanceCriteria"
              class="block p-2.5 w-full text-sm rounded-lg border bg-bg-primary border-border-default placeholder-gray-400 text-text-default focus:ring-highlight focus:border-highlight"
              placeholder="1. The user enters valid username and password..."
            ></textarea>
            <p *ngIf="inputForm.controls['acceptanceCriteria'].invalid && inputForm.controls['acceptanceCriteria'].touched"
               class="mt-1 text-xs text-priority-high">
              Acceptance Criteria is required.
            </p>
          </div>
        </ng-container>

        <ng-container *ngIf="currentInputType === 'Upload Document'">
          
          <div 
            (drop)="onFileDrop($event)" 
            (dragover)="onDragOver($event)" 
            (dragleave)="onDragLeave($event)"
            (click)="fileInput.click()"
            class="border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors duration-300"
            [ngClass]="{'border-highlight bg-highlight/10': isDragging, 'border-border-default bg-bg-primary/50': !isDragging}"
          >
            <input type="file" #fileInput (change)="onFileInput($event)" multiple hidden>

            <div class="flex flex-col items-center">
              <svg class="w-10 h-10 text-highlight mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
              
              <p class="text-text-default font-medium">Drop files here or click to upload</p>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Supports: Jira exports, Word docs, text files</p>
            </div>
          </div>
          
          <div *ngIf="uploadedFiles.length > 0" class="space-y-3 pt-2">
            <div *ngFor="let file of uploadedFiles" 
                 class="flex items-center justify-between p-3 bg-bg-primary rounded-lg border border-border-default shadow-sm">
              <div class="flex items-center space-x-2">
                <svg class="w-5 h-5 text-highlight flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                <span class="text-sm text-text-default truncate">{{ file.name }}</span>
              </div>
              <button (click)="removeFile(file)" type="button" class="text-gray-500 hover:text-priority-high transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
          </div>
          <p *ngIf="inputForm.controls['fileInput'].invalid && inputForm.controls['fileInput'].touched"
               class="mt-1 text-xs text-priority-high">
              At least one file is required for document upload.
          </p>
        </ng-container>
        <div class="flex flex-col space-y-2 pt-2">
          <label for="framework" class="text-sm font-medium text-gray-500 dark:text-gray-300">Framework</label>
          <select id="framework" formControlName="framework"
            class="bg-bg-primary border border-gray-700 text-sm rounded-lg w-full px-3 p-2.5 text-text-default focus:ring-highlight focus:border-highlight outline-none"
          >
            <option value="Java + Selenium">Java + Selenium</option>
            <option value="JavaScript + TestComplete">JavaScript + TestComplete</option>
            <option value="Python + Selenium">Python + Selenium</option>
            <option value="JavaScript + Playwright">JavaScript + Playwright</option>
          </select>
        </div>


        <div class="flex justify-end pt-4">
          <button type="submit" [disabled]="inputForm.invalid || isLoading"
            class="px-6 py-3 text-sm font-medium text-white rounded-lg transition-colors duration-200"
            [ngClass]="{
              'bg-highlight hover:bg-purple-700': inputForm.valid && !isLoading,
              'bg-gray-600 cursor-not-allowed': inputForm.invalid || isLoading
            }"
          >
            <span *ngIf="!isLoading">Generate Test Cases →</span>
            <span *ngIf="isLoading" class="flex items-center">
              Generating...
              <svg class="animate-spin ml-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
          </button>
        </div>
      </form>
    </div>
  `,
  // styleUrl: './input-requirements.component.scss'
})
export class InputRequirementsComponent implements OnInit{
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);

  @Output() generationSuccess = new EventEmitter<any>(); // Emit result to parent
  
  isLoading: boolean = false;
  // backendUrl = 'http://localhost:8000/api/generate-test-cases'; // Matches the FastAPI port
  
  // backendUrl='https://sagebackend-k8xg.onrender.com/functional-tests';
  backendUrl='https://test-case-generation.onrender.com/functional-tests';
  inputForm!: FormGroup; // Initialize in ngOnInit
  uploadedFiles: File[] = [];
  currentInputType: InputType = 'Manual Input';
  isDragging: boolean = false;


  ngOnInit(): void {
    this.inputForm = this.fb.group({
      inputType: ['Manual Input', Validators.required],
      framework: ['Java + Selenium', Validators.required],
      userStory: ['', Validators.required],
      acceptanceCriteria: ['', Validators.required],
      fileInput: [null as File[] | null]
    });
    // Listen for changes in inputType and update validators accordingly
    this.inputForm.get('inputType')?.valueChanges.subscribe((type: InputType) => {
      this.currentInputType = type;
      this.updateValidation(type);
    });
  }
private updateValidation(type: InputType): void {
    const userStoryControl = this.inputForm.get('userStory');
    const acceptanceCriteriaControl = this.inputForm.get('acceptanceCriteria');
    const fileInputControl = this.inputForm.get('fileInput');

    // Reset all
    userStoryControl?.clearValidators();
    acceptanceCriteriaControl?.clearValidators();
    fileInputControl?.clearValidators();

    if (type === 'Manual Input') {
      userStoryControl?.setValidators(Validators.required);
      acceptanceCriteriaControl?.setValidators(Validators.required);
    } else if (type === 'Upload Document') {
      fileInputControl?.setValidators(Validators.required);
    }

    userStoryControl?.updateValueAndValidity();
    acceptanceCriteriaControl?.updateValueAndValidity();
    fileInputControl?.updateValueAndValidity();
  }




  // --- File Upload Logic ---

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;
  }

  onFileDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;
    const files = event.dataTransfer?.files;
    if (files) {
      this.addFiles(Array.from(files));
    }
  }

  onFileInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.addFiles(Array.from(input.files));
    }
  }




  private addFiles(files: File[]): void {
    files.forEach(file => {
      // Simple check to avoid duplicates, though Angular Forms handles complexity
      if (!this.uploadedFiles.some(f => f.name === file.name)) {
        this.uploadedFiles.push(file);
      }
    });
    // Manually update the fileInput control value and mark as touched/dirty
    this.inputForm.get('fileInput')?.setValue(this.uploadedFiles.length > 0 ? this.uploadedFiles : null);
    this.inputForm.get('fileInput')?.markAsDirty();
    this.inputForm.get('fileInput')?.markAsTouched();
    this.inputForm.get('fileInput')?.updateValueAndValidity();
  }

  removeFile(file: File): void {
    this.uploadedFiles = this.uploadedFiles.filter(f => f !== file);
    this.inputForm.get('fileInput')?.setValue(this.uploadedFiles.length > 0 ? this.uploadedFiles : null);
    this.inputForm.get('fileInput')?.markAsDirty();
    this.inputForm.get('fileInput')?.updateValueAndValidity();
  }

 generateTestCases(): void {
    if (this.inputForm.invalid) {
      this.inputForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    const formData = new FormData();
    const inputType = this.inputForm.value.inputType;

    if (inputType === 'Manual Input') {
      formData.append('user_story', this.inputForm.value.userStory);
      formData.append('acceptance_criteria', this.inputForm.value.acceptanceCriteria);
      formData.append('framework_choice', this.inputForm.value.framework);
    } else if (inputType === 'Upload Document') {
      // Append all uploaded files to the form data
      this.uploadedFiles.forEach((file, index) => {
        formData.append(`file_${index}`, file, file.name);
      });
      // Use dummy data for backend processing requirement if no files are sent
      formData.append('user_story', 'Document uploaded for analysis.');
      formData.append('acceptance_criteria', 'Refer to attached files.');
    }

    this.http.post<any>(this.backendUrl, formData)
      .pipe(
        catchError(error => {
          console.error('Error generating test cases:', error);
          this.isLoading = false;
          // In a real app, show a user-friendly error message
          alert('Failed to connect to the backend or generate test cases. Check console for details.');
          return of(null);
        })
      )
      .subscribe(result => {
        if (result) {
          this.isLoading = false;
          this.generationSuccess.emit(result);
        }
      });
  }
}
