import { Component, OnInit, Output, EventEmitter, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { catchError, of } from 'rxjs';
import { ProjectFolder } from '../models/test-automation.model';
import { ToasterService } from '../../../core/services/toaster.service';
import { ApiService } from '../../../core/services/api.service';
type InputType = 'Manual Input' | 'Upload Document' | 'Fetch from DevOps' ;
type TestType = 'functional' | 'api' | 'database';
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
          <label for="project" class="text-sm font-medium text-gray-500 dark:text-gray-300">Project Workspace</label>
          <div class="flex space-x-2">
            <select id="project" formControlName="projectId"
              class="bg-bg-primary border border-gray-700 text-sm rounded-lg w-full px-3 p-2.5 text-text-default focus:ring-highlight focus:border-highlight outline-none"
            >
              <option value="" disabled>Select a project folder</option>
              <option *ngFor="let proj of projects" [value]="proj.id">{{ proj.parentId && proj.parentId !== 'root' ? '— ' : '' }}{{ proj.name }}</option>
            </select>
            <button type="button" (click)="onCreateNewProject.emit()" 
                    class="px-4 bg-highlight/10 text-highlight border border-highlight/30 rounded-lg hover:bg-highlight hover:text-white transition-all text-xs font-bold whitespace-nowrap">
              + New Project
            </button>
          </div>
          <p *ngIf="inputForm.controls['projectId'].invalid && inputForm.controls['projectId'].touched" class="text-[10px] text-priority-high">Please select a project destination.</p>
        </div>


         <div class="flex flex-col space-y-2">
             <label  class="text-sm font-medium text-gray-500 dark:text-gray-300">
              Test Type
              </label>

        <select formControlName="testType"
         class="bg-bg-primary border border-gray-700 text-sm rounded-lg w-full px-3 p-2.5 text-text-default focus:ring-highlight focus:border-highlight outline-none"
          >
        <option value="functional">Functional Test Case</option>
        <option value="api">API Testing</option>
        <option value="database">Database Script Generation</option>
        </select>
        </div>

        <div class="flex flex-col space-y-2">
          <label for="inputType" class="text-sm font-medium text-gray-500 dark:text-gray-300">Input Type</label>
          <select id="inputType" formControlName="inputType"
            class="bg-bg-primary border border-gray-700 text-sm rounded-lg w-full px-3 p-2.5 text-text-default focus:ring-highlight focus:border-highlight outline-none"
          >
            <option value="Manual Input" class="hover:bg-highlight/10">Manual Input</option>
            <option value="Upload Document" disabled class="text-gray-500">Upload Document</option>
            <option value="Fetch from DevOps" disabled class="text-gray-500">Fetch from DevOps (Coming Soon)</option>
            </select>
        </div>


        <div *ngIf="!showDatabaseOptions" class="flex flex-col space-y-2 pt-2">
         <label class="text-sm font-medium text-gray-500">
         Framework
          </label>
        <select formControlName="framework" class="bg-bg-primary border border-gray-700 text-sm rounded-lg w-full px-3 p-2.5 text-text-default">

         <option *ngFor="let fw of frameworkOptions" [value]="fw.value">
         {{fw.key}}
         </option>

</select>
</div>
<!-- OTHER FRAMEWORK -->

<div *ngIf="showOtherFrameworkInput">

<input
type="text"
formControlName="otherFramework"
placeholder="Enter framework name"
class="bg-bg-primary border border-gray-700 text-sm rounded-lg w-full px-3 p-2.5 text-text-default">

</div>
<!-- DATABASE OPTIONS -->

<div *ngIf="showDatabaseOptions" class="flex flex-col space-y-2">
  <label class="text-sm font-medium text-gray-500">
Target Database
</label>

<select formControlName="targetDatabase" class="bg-bg-primary border border-gray-700 text-sm rounded-lg w-full px-3 p-2.5 text-text-default">

<option *ngFor="let db of databaseOptions" [value]="db.value">
{{db.key}}
</option>

</select>
</div>
<!-- OTHER DATABASE -->

<div *ngIf="showOtherDatabaseInput">

<input
type="text"
formControlName="otherDatabase"
placeholder="Enter database name"
class="bg-bg-primary border border-gray-700 text-sm rounded-lg w-full px-3 p-2.5 text-text-default">
</div>


<!-- JSON DATA MODEL -->

<div *ngIf="showDatabaseOptions">

<label class="text-sm font-medium text-gray-500">
Upload Data Model (JSON)
</label>

<input
type="file"
accept=".json"
(change)="onDataModelUpload($event)"
class="block w-full text-sm mt-2">

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
                                 <div class="flex flex-col leading-tight"> 
               <h4 class="text-sm font-semibold text-text-default">Bulk Generation Mode</h4>
               <p class="text-xs text-gray-500">Add multiple stories to process them in a single agentic job.</p>
                 </div>

          <div formArrayName="stories" class="space-y-6">
        <div *ngFor="let story of stories.controls; let i = index" [formGroupName]="i" 
             class="p-6 bg-bg-primary/30 border border-border-default rounded-2xl relative animate-fade-in group">
          
          <div class="flex justify-between items-center mb-4">
            <span class="text-[10px] font-black text-highlight uppercase tracking-widest">User Story #{{ i + 1 }}</span>
            <button type="button" *ngIf="stories.length > 1" (click)="removeStory(i)" 
                    class="p-1.5 text-gray-500 hover:text-priority-high hover:bg-priority-high/10 rounded-lg transition-all">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
            </button>
          </div>

        <div class="space-y-4">
          <div>
            <label class="block mb-1.5 text-xs font-semibold text-gray-500">Story Description</label>
              <textarea rows="3" formControlName="user_story"
                class="block p-3 w-full text-sm rounded-xl border bg-bg-primary border-border-default placeholder-gray-600 text-text-default focus:ring-1 focus:ring-highlight outline-none"
                placeholder="As a user I want to..."></textarea>
<p *ngIf="story.get('acceptance_criteria')?.invalid && story.get('acceptance_criteria')?.touched"
   class="mt-1 text-xs text-priority-high">
  Acceptance Criteria is required.
</p>
          </div>
           <div>
              <label class="block mb-1.5 text-xs font-semibold text-gray-500">Acceptance Criteria</label>
              <textarea rows="3" formControlName="acceptance_criteria"  
              class="block p-3 w-full text-sm rounded-xl border bg-bg-primary border-border-default placeholder-gray-600 text-text-default focus:ring-1 focus:ring-highlight outline-none"
                placeholder="Given... When... Then..."></textarea>

           </div>
          </div>
        </div>
      </div>

      <button type="button" (click)="addStory()" 
              class="w-full py-4 mt-4 border-2 border-dashed border-border-default rounded-2xl text-gray-500 font-bold hover:border-highlight hover:text-highlight hover:bg-highlight/5 transition-all flex items-center justify-center space-x-2">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4"/></svg>
        <span>Add Another User Story</span>
      </button>
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
        <div class="pt-4 border-t border-border-default">
        <label class="text-sm font-medium text-gray-500">Target Framework</label>
        <select formControlName="framework" class="bg-bg-primary border border-gray-700 text-sm rounded-lg w-full px-3 p-2.5 mt-2 text-text-default">
          <option *ngFor="let fw of frameworkOptions" [value]="fw.value">{{fw.key}}</option>
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
            <span *ngIf="!isLoading">Generat Job →</span>
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
  
})
export class InputRequirementsComponent implements OnInit{
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private api = inject(ApiService);
   @Input() projects: ProjectFolder[] = []; 
   @Output() onCreateNewProject = new EventEmitter<void>();

  @Output() generationSuccess = new EventEmitter<any>(); // Emit result to parent

  isLoading: boolean = false;
  frameworkOptions: {key:string,value:string}[] = [];
  showOtherFrameworkInput = false;
  inputForm!: FormGroup; 
  uploadedFiles: File[] = [];
  currentInputType: InputType = 'Manual Input';
  isDragging: boolean = false;
  showDatabaseOptions = false;
showOtherDatabaseInput = false;
uploadedDataModel: File | null = null;
private toaster = inject(ToasterService);
databaseOptions = [
{ key:'Azure SQL', value:'Azure SQL'},
{ key:'PostgreSQL', value:'PostgreSQL'},
{ key:'SQLite', value:'SQLite'},
{ key:'MySQL', value:'MySQL'},
{ key:'Other', value:'other'}
];
frameworkConfig: Record<TestType, any> = {
  functional: [
    { key: 'Java + Selenium', value: 'Java + Selenium' },
    { key: 'JavaScript + TestComplete', value: 'JavaScript + TestComplete' },
    { key: 'Python + Selenium', value: 'Python + Selenium' },
    { key: 'JavaScript + Playwright', value: 'JavaScript + Playwright' },
    { key: 'Other', value: 'other' }
  ],

  api: [
    { key: 'Postman', value: 'postman' },
    { key: 'Bruno', value: 'bruno' },
    { key: 'Insomnia', value: 'insomnia' },
    { key: 'Other', value: 'other' }
  ],
  database: undefined
};



  
  ngOnInit(): void {
    this.inputForm = this.fb.group({
      projectId:['',Validators.required], 
      testType:['functional',Validators.required], 
    
      otherFramework:[''],
      targetDatabase:[''],
      otherDatabase:[''],
      dataModelFile:[null],
      inputType: ['Manual Input', Validators.required],
      framework: ['', Validators.required],
      fileInput: [null],
      stories: this.fb.array([this.createStoryGroup()])
    });

    this.inputForm.get('inputType')?.valueChanges.subscribe((type) => {
      this.currentInputType = type;
      this.updateValidation();
    });

    this.inputForm.get('testType')?.valueChanges.subscribe((type: TestType) => {
      this.handleTestTypeChange(type);
    });


this.inputForm.get('framework')?.valueChanges.subscribe(val => {
      this.showOtherFrameworkInput = val === 'other';
      this.toggleOtherValidator('otherFramework', val === 'other');
    });
    this.inputForm.get('targetDatabase')?.valueChanges.subscribe(val => {
      this.showOtherDatabaseInput = val === 'other';
      this.toggleOtherValidator('otherDatabase', val === 'other');
    });

this.handleTestTypeChange('functional');
}



  get stories(): FormArray {
    return this.inputForm.get('stories') as FormArray;
  }
    createStoryGroup(): FormGroup {
      return this.fb.group({
        user_story: ['', [Validators.required, Validators.minLength(10)]],
        acceptance_criteria: ['', Validators.required]
      });
    }
  addStory() {
    this.stories.push(this.createStoryGroup());
    this.updateValidation();
  }

  removeStory(index: number) {
    if (this.stories.length > 1) 
      this.stories.removeAt(index);
    
  }

onDataModelUpload(event:any){

const file = event.target.files[0];

if(file){

this.uploadedDataModel = file;

this.inputForm.get('dataModelFile')?.setValue(file);

}

}
private updateValidation(): void {

   
    const fileControl = this.inputForm.get('fileInput');
       const storiesArray = this.stories;

    

     if (this.currentInputType === 'Manual Input') {
      fileControl?.clearValidators();
       fileControl?.setValue(null);
       storiesArray.controls.forEach((control, index) => {
      const group = control as FormGroup;
      const userStoryControl = group.get('user_story');
      const acceptanceCriteriaControl = group.get('acceptance_criteria');
      
      // Only validate if field is touched or if it's the first story
      if (index === 0 || userStoryControl?.touched || acceptanceCriteriaControl?.touched) {
        userStoryControl?.setValidators([Validators.required, Validators.minLength(10)]);
        acceptanceCriteriaControl?.setValidators(Validators.required);
      } else {
        // For untouched stories, validate only if they have content
        userStoryControl?.setValidators(this.conditionalValidator('minLength', 10));
        acceptanceCriteriaControl?.setValidators(this.conditionalValidator('required'));
      }
      
      userStoryControl?.updateValueAndValidity();
      acceptanceCriteriaControl?.updateValueAndValidity();
    });
    } else{
          fileControl?.setValidators(Validators.required);
     storiesArray.controls.forEach(control => {
      const group = control as FormGroup;
      group.get('user_story')?.clearValidators();
      group.get('acceptance_criteria')?.clearValidators();
      group.get('user_story')?.updateValueAndValidity();
      group.get('acceptance_criteria')?.updateValueAndValidity();
    });
  }

 
    //testDescriptionControl?.updateValueAndValidity();

    fileControl?.updateValueAndValidity();
  }

  private conditionalValidator(type: 'required' | 'minLength', minLen?: number) {
    return (control: any) => {
      if (!control.value) return null; // Empty is OK
      if (type === 'required' && !control.value) return { required: true };
      if (type === 'minLength' && control.value.length < (minLen || 10)) {
        return { minlength: { requiredLength: minLen || 10, actualLength: control.value.length } };
      }
      return null;
    };
  }

  private handleTestTypeChange(type: TestType): void {
    const fwControl = this.inputForm.get('framework');
    const dbControl = this.inputForm.get('targetDatabase');
    const modelControl = this.inputForm.get('dataModelFile');
    
    fwControl?.clearValidators();
    dbControl?.clearValidators();
    modelControl?.clearValidators();
  
    if (type === 'database') {
      this.showDatabaseOptions = true;
      dbControl?.setValidators(Validators.required);
      modelControl?.setValidators(Validators.required);
      fwControl?.setValue('');
    } else {
      this.showDatabaseOptions = false;
      this.frameworkOptions = this.frameworkConfig[type] || [];
      fwControl?.setValidators(Validators.required);
    
      // Auto-select first option to ensure validity immediately
      if (this.frameworkOptions.length > 0) {
        this.inputForm.patchValue({ framework: this.frameworkOptions[0].value }, { emitEvent: false });
      }
    }

    // Refresh status
    fwControl?.updateValueAndValidity();
    dbControl?.updateValueAndValidity();
    modelControl?.updateValueAndValidity();
  }

  private toggleOtherValidator(fieldName: string, shouldValidate: boolean): void {
    const control = this.inputForm.get(fieldName);
    if (!control) return;

    if (shouldValidate) {
      control.setValidators(Validators.required);
    } else {
      control.clearValidators();
      control.setValue('');
    }
    control.updateValueAndValidity();
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
      //to avoid duplicates
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
    const val = this.inputForm.value;
    const testTypeMap: any = {
    functional: 'automation_test',
    api: 'api_test',
    database: 'database_script'
    };


  
    // const inputType: InputType = val.inputType;
    // const formData = new FormData();
    const selectedProject = this.projects.find(proj => String(proj.id) === String(val.projectId));
    const isSubProject = !!selectedProject?.parentId && String(selectedProject.parentId) !== 'root';
  
    let parentName: string | null = null;
    if (isSubProject) {
      const parentProj = this.projects.find(p => String(p.id) === String(selectedProject?.parentId));
      parentName = parentProj?.name ?? null;
    }
  
   const framework = val.framework === 'other' ? val.otherFramework : val.framework;
   const database = val.targetDatabase === 'other' ? val.otherDatabase : val.targetDatabase;
 

    const payloads = val.stories.map((story: any) => ({
      user_story: story.user_story,
      acceptance_criteria: story.acceptance_criteria,
      project_id: Number(val.projectId),

      project_name: isSubProject ? '' : selectedProject?.name, // Adjusted based on your logic
      sub_project_name: isSubProject ? selectedProject?.name : null,
      test_type: val.testType,
      framework_choice: framework,
      input_type: val.inputType,
      // stories: val.inputType === 'Manual Input' ? val.stories : [],
      // Database specific
      target_database: val.testType === 'database' ? (val.targetDatabase === 'other' ? val.otherDatabase : val.targetDatabase) : null,
      data_model: this.uploadedDataModel||null
    }));
     const finalRequest = {
    payloads: payloads, 
    data_model_file: this.uploadedDataModel
  };

  this.generationSuccess.emit(finalRequest);
    //  else if (inputType === 'Upload Document') {
    //   // Append all uploaded files to the form data
    //   this.uploadedFiles.forEach((file, index) => {
    //     formData.append(`file_${index}`, file, file.name);
    //   });
    //   // Use dummy data for backend processing requirement if no files are sent
    //   formData.append('user_story', 'Document uploaded for analysis.');
    //   formData.append('acceptance_criteria', 'Refer to attached files.');
    // }

  
}
}


