

//app-test-automation-shell component
import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressStepperComponent } from '../progress-stepper/progress-stepper.component';
import { InputRequirementsComponent } from '../input-requirements/input-requirements.component';
import { GenerationStatusComponent } from '../generation-status/generation-status.component';
import { ReviewValidateComponent } from '../review-validate/review-validate.component';
import { GenerationResult, ProjectFolder, TestCase, UserSession } from '../models/test-automation.model';
import { ExportDeployComponent } from '../export-deploy/export-deploy.component';
import { FormsModule } from '@angular/forms';
import { LandingPageComponent } from '../landing-page/landing-page.component';
import { UnitTestInputComponent } from '../unit-test-input/unit-test-input.component'; 

import { ThemeService } from '../../../core/services/theme.service';
import { HttpClient } from '@angular/common/http';
import { DashbordComponent } from '../dashbord/dashbord.component';
import { ProjectModelComponent } from '../project-model/project-model.component';
import { SidebarProjectsComponent } from '../sidebar-projects/sidebar-projects.component';
import { ScheduledJobsComponent } from '../scheduled-jobs/scheduled-jobs.component';
import { LoginComponent } from '../login/login.component';
import { ApiService } from '../../../core/services/api.service';

type AppView = 'login'|'landing' | 'dashboard' | 'new-generation' | 'scheduled-jobs';
type TestType = 'Functional' | 'Unit'; 
@Component({
  selector: 'app-test-automation-shell',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ProgressStepperComponent,
    DashbordComponent,
    InputRequirementsComponent,
    GenerationStatusComponent, 
    ReviewValidateComponent,
    FormsModule,
    ExportDeployComponent,
    LandingPageComponent,
    UnitTestInputComponent,
    SidebarProjectsComponent,
    ProjectModelComponent,
    ScheduledJobsComponent,
    LoginComponent

  ],
  template: `
  <app-login *ngIf="currentView() === 'login'" (loginSuccess)="handleLogin($event)"></app-login>
 <div *ngIf="currentView() !== 'login'" class="min-h-screen flex flex-col transition-colors duration-300 bg-bg-primary text-text-default">
      <header class="h-16 bg-bg-secondary border-b border border-border-default flex items-center justify-between  px-8 sticky top-0 z-10 transition-colors duration-300">
         <div class="flex w-full items-center justify-between">
          <div class="flex items-center space-x-3">
          
            <svg width="20px" height="20px" viewBox="0 0 512 512" id="icons" xmlns="http://www.w3.org/2000/svg"><path d="M259.92,262.91,216.4,149.77a9,9,0,0,0-16.8,0L156.08,262.91a9,9,0,0,1-5.17,5.17L37.77,311.6a9,9,0,0,0,0,16.8l113.14,43.52a9,9,0,0,1,5.17,5.17L199.6,490.23a9,9,0,0,0,16.8,0l43.52-113.14a9,9,0,0,1,5.17-5.17L378.23,328.4a9,9,0,0,0,0-16.8L265.09,268.08A9,9,0,0,1,259.92,262.91Z" fill="none" stroke="#8b7bfd" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/><polygon points="108 68 88 16 68 68 16 88 68 108 88 160 108 108 160 88 108 68" fill="none" stroke="#8b7bfd" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/><polygon points="426.67 117.33 400 48 373.33 117.33 304 144 373.33 170.67 400 240 426.67 170.67 496 144 426.67 117.33" fill="none" stroke="#8b7bfd" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/></svg>
             <div class="flex flex-col leading-tight">
            <span class="text-[20px] font-semibold" style="color:#8b7bfd;">Sage Script</span>
            <span class="text-[10px] text-gray-400 -mt-0.5">Automated testing powered by AI</span>
          </div>
          </div>
        
          <div class="flex items-center space-x-4">
       
            <button (click)="theme.toggleTheme()"class="p-1 rounded-full text-gray-500 hover:text-highlight transition-colors duration-150">
              
              <svg *ngIf="theme.isDarkTheme()" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
              </svg>

              <svg *ngIf="!theme.isDarkTheme()" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
              </svg>
            </button>

            <div class="h-6 w-px bg-border-default mx-2"></div>

  <div class="relative">
    <button (click)="showUserMenu.set(!showUserMenu())" 
            class="flex items-center space-x-3 p-1.5 rounded-xl hover:bg-bg-primary transition-all border border-transparent hover:border-border-default">
      <div class="w-8 h-8 rounded-lg bg-highlight/20 flex items-center justify-center text-highlight font-bold text-xs uppercase">
        {{ currentUser()?.displayName?.substring(0,2) }}
      </div>
      <div class="flex flex-col items-start hidden sm:flex text-left">
        <span class="text-xs font-bold text-text-default leading-none">{{ currentUser()?.displayName }}</span>
        <span class="text-[9px] text-gray-500 font-bold uppercase tracking-tighter">
    {{ currentUser()?.tenants?.[0]?.role }}&#64;{{ currentUser()?.tenants?.[0]?.tenantName }}
  </span>
      </div>
      <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7"></path></svg>
    </button>

    <div *ngIf="showUserMenu()" 
         class="absolute right-0 mt-2 w-48 bg-bg-secondary border border-border-default rounded-2xl shadow-2xl overflow-hidden z-[60] animate-fade-in py-2">
      <div class="px-4 py-2 border-b border-border-default mb-1">
        <p class="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Account Settings</p>
      </div>
      
      <button class="w-full flex items-center px-4 py-2.5 text-xs text-gray-400 hover:bg-bg-primary hover:text-text-default transition-all">
        <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
        Profile
      </button>
      
      <button (click)="logout()" 
              class="w-full flex items-center px-4 py-2.5 text-xs text-priority-high hover:bg-red-500/10 transition-all font-bold">
        <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
        Sign Out
      </button>
    </div>
  </div>
          </div>
        </div>
       
      </header>
      <div class="flex flex-1 overflow-hidden">
        
        <aside *ngIf="currentView() !== 'landing'" class="w-64 border-r border-border-default bg-bg-secondary flex flex-col transition-all duration-300">
          <div class="p-6 space-y-8 flex-1">
            
            <nav class="space-y-1">
              <p class="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-3 mb-2">Portfolio</p>
              <button (click)="currentView.set('dashboard')" [ngClass]="{'bg-highlight/10 text-highlight': currentView() === 'dashboard'}" class="w-full flex items-center p-3 rounded-xl hover:bg-bg-primary text-gray-400 transition-all font-medium">
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>
                Dashboard
              </button>
              <button (click)="currentView.set('new-generation');currentStep=1" [ngClass]="{'bg-highlight/10 text-highlight': currentView() === 'new-generation'}" class="w-full flex items-center p-3 rounded-xl hover:bg-bg-primary text-gray-400 transition-all font-medium">
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4"/></svg>
                New Generation
              </button>
              <button (click)="currentView.set('scheduled-jobs')" [ngClass]="{'bg-highlight/10 text-highlight': currentView() === 'scheduled-jobs'}" class="w-full flex items-center p-3 rounded-xl hover:bg-bg-primary text-gray-400 transition-all font-medium">
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                Scheduled Jobs
              </button>
            </nav>
               <app-sidebar-projects
  [projects]="projects()"
  (toggle)="toggleProject($event)"
  (onCreateRequest)="showprojmodel.set(true)">
</app-sidebar-projects>
<app-project-model
  *ngIf="showprojmodel()"
  [flatProjects]="flatProjectsList"
  (onClose)="showprojmodel.set(false)"
  (onCreate)="handleCreateProject($event)">
</app-project-model>


          </div>
        </aside>

      <main class="flex-1 overflow-y-auto p-8 custom-scrollbar">
    <app-landing-page *ngIf="currentView() === 'landing'" (getStarted)="onGetStarted()"></app-landing-page>
    <ng-container *ngIf="currentView() === 'dashboard'">
      <app-dashbord (onNewGeneration)="currentView.set('new-generation')" (onViewJobs)="currentView.set('scheduled-jobs')"></app-dashbord>
    </ng-container>
    <app-scheduled-jobs *ngIf="currentView() === 'scheduled-jobs'" (onReview)="handleJobReview($event)"></app-scheduled-jobs>

   
         <div *ngIf="currentView() === 'new-generation'" class="max-w-6xl mx-auto">
              
            <div class="flex justify-center mb-8">
            <div class="inline-flex rounded-lg border border-border-default p-1 bg-bg-secondary shadow-inner">
              <button (click)="currentTestType = 'Functional'"
                [ngClass]="currentTestType === 'Functional' ? 'bg-highlight text-white shadow-md' : 'text-gray-500 dark:text-gray-300 hover:bg-bg-primary'"
                class="px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                Functional Test Cases
              </button>
              <button (click)="currentTestType = 'Unit'"
                [ngClass]="currentTestType === 'Unit' ? 'bg-highlight text-white shadow-md' : 'text-gray-500 dark:text-gray-300 hover:bg-bg-primary'"
                class="px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>
                Unit Test Cases
              </button>
            </div>
          </div>

          <ng-container *ngIf="currentTestType === 'Functional'"> 
             <app-progress-stepper [currentStep]="currentStep"></app-progress-stepper>
      <div class="mt-10">
        <app-input-requirements
          *ngIf="currentStep === 1"
          [projects]="flatProjectsList"
          (generationSuccess)="handleGeneration($event)"
          (onCreateNewProject)="showprojmodel.set(true)">
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
          [automation_scripts]="generationData?.automation_scripts || {}"
          [jobInfo]="generationData?.job_info"
          (exportAndDeploy)="currentStep = 4"
          (goBack)= "currentView.set('scheduled-jobs')"
          (addNewTestCase)="addNewTestCase()"
        ></app-review-validate>


    <app-export-deploy
          *ngIf="currentStep === 4"
          [totalTestCases]="generationData?.test_cases?.length || 0"
          [totalAutomationScripts]="scriptCount"
          (goBack)="currentStep = 3"
          (startNew)="resetFlow()"
        ></app-export-deploy>
    
    </div>
    </ng-container>

 <app-unit-test-input *ngIf="currentTestType === 'Unit'" (generationComplete)="currentStep = 1"></app-unit-test-input>
    </div>
    </main>
    </div>
    </div>
  `,
    styles: [`
    .custom-scrollbar::-webkit-scrollbar { width: 5px; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #374151; border-radius: 10px; }
  `]
})
export class TestAutomationShellComponent  {
  
  theme=inject(ThemeService);
  http = inject(HttpClient);
  currentView = signal<AppView>('login');
  currentStep: number = 1;
  receivedData: any = null; 
  currentTestType: TestType = 'Functional';
  generationData: GenerationResult | null = null;
  showprojmodel=signal(false);
  showUserMenu = signal(false);
projects = signal<ProjectFolder[]>([
  { id: '1', name: 'E-Commerce Platform', count: 45, subFolders: [] },
  { id: '2', name: 'Banking Portal', count: 67, subFolders: [] },
  { id: '3', name: 'Mobile App', count: 0, subFolders: [
    { id: '4', name: 'kit', count: 0, subFolders: [] }
  ]}
]);
currentUser = signal<UserSession | null>(null);

constructor(private apiService: ApiService) {}
private addToParent(
  list: ProjectFolder[],
  parentId: string,
  newItem: ProjectFolder
): ProjectFolder[] {
  return list.map(folder => {
    if (folder.id === parentId) {
      return {
        ...folder,
        isOpen: true,
        subFolders: [...(folder.subFolders || []), newItem]
      };
    }

    if (folder.subFolders?.length) {
      return {
        ...folder,
        subFolders: this.addToParent(folder.subFolders, parentId, newItem)
      };
    }

    return folder;
  });

}

private updateNestedProjects(list: ProjectFolder[], parentId: string, newItem: ProjectFolder) {
  for (let folder of list) {
    if (folder.id === parentId) {
      folder.subFolders = [...(folder.subFolders || []), newItem];
      folder.isOpen = true; // Automatically open parent when adding sub
      return;
    }
    if (folder.subFolders) this.updateNestedProjects(folder.subFolders, parentId, newItem);
  }
}
  get scriptCount(): number {
    return this.generationData ? Object.keys(this.generationData.automation_scripts).length : 0;
  }
  onGetStarted() {
    this.currentView.set('dashboard');
    this.currentStep = 1;
  }

handleLogin(user: UserSession) {
  this.currentUser.set(user);
  this.currentView.set('dashboard');
  
  // Use the primary tenant's name or ID to load projects
  // In an enterprise app, you might let the user select a tenant first
  const primaryTenant = user.tenants[0]; 
    this.loadUserProjects();
  // this.loadTenantProjects(user.displayName, primaryTenant.tenantId);
}

// loadTenantProjects(userName: string, tenantId: number) {
//   // Update your API call to pass the tenant context if necessary
//   this.http.get<ProjectFolder[]>(`http://127.0.0.1:8000/api/projects/${userName}`)
//     .subscribe(data => this.projects.set(data));
// }

  

  loadUserProjects() {
    const user = this.currentUser();
    if (!user?.displayName) {
       console.error('No user or displayName available'); return;

     }
    this.apiService.loadUserProjects(user?.displayName)
      .subscribe({
        next: (data) => this.projects.set(data),
        error: (err) => console.error('Error loading projects', err)
  });
}
  handleGeneration(payloadFromInput:any): void {
    const user = this.currentUser();
   
    this.generationData = null;

    if (!user) return;


this.apiService.generateTestCases(payloadFromInput, user.userId).
subscribe({ 

      next: (response: any) => {
        // 2. Redirect user to Scheduled Jobs immediately
        this.currentView.set('scheduled-jobs');
        
        // 3. Optional: Show a toast/notification
        console.log('Job submitted successfully. Tracking ID:', response.job_id);
      },
      error: (err) => {
        alert('Failed to submit job. Please check backend.');
      }
    });
}
  
  //   if (data) {
    
  //     setTimeout(() => {
  //       this.generationData = data;
  //     }, 4000); // 2 second simulation
  //   } else {
  //     // If regenerating, clear data and restart simulation (in a real app, call the backend again)
  //     this.generationData = null;
  //     setTimeout(() => {
  //       // Dummy data for regeneration simulation
  //       this.generationData = {
  //         high_priority: 2,
  //         medium_priority: 2,
  //         low_priority: 1,
  //         test_cases: [  ] as TestCase[]
  //       } as GenerationResult;
  //     }, 4000);
  //   }
  // }

  handleScheduledJobReview(job: any) {
    this.generationData = {
      // test_cases:job.test_cases||job.tests||[],
      
      test_cases: Array.isArray(job.test_cases) ? job.test_cases : [],
      automation_scripts: job.automation_scripts || {}
    } as GenerationResult;
    this.currentView.set('new-generation');
    this.currentStep = 3;
  }
get flatProjectsList(): ProjectFolder[] {
  // Helper to provide a flat list for the dropdown select
  const flat: ProjectFolder[] = [];
  const recurse = (list: ProjectFolder[]) => {
    list.forEach(f => {
      flat.push(f);
      if(f.subFolders) recurse(f.subFolders);
    });
  };recurse(this.projects());
  return flat;
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
      ID: `TC${String(this.generationData.test_cases.length + 1).padStart(3, '0')}`,
      Title: 'New test case',
      source: 'Generated by AI analysis',
      Type: 'Edge case',
      Priority: 'Low',
      Preconditions: 'User is logged into the system',
      ExpectedResults:'dummy',
      Steps: '1. Navigate to the form\n2. Enter boundary value input\n3. Submit the form',
      status: 'Draft',
      feedback: '',
      TestData: {
        Inputs: {
          username: 'test_user',
          password: 'P@ssw0rd'
        },
        API_Payload: {
          endpoint: '/api/login',
          method: 'POST',
          body: {
            username: 'test_user',
            password: 'P@ssw0rd'
          }
        },
        DB_Mock: {
          userId: 1,
          isActive: true
        }
      }
      };
      this.generationData.test_cases.push(newTc);
 
    }
  }
    resetToHome() {
    this.currentView.set('landing');
    this.currentStep = 0;
  }
  resetFlow(): void {
    this.currentView.set('dashboard');
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

handleCreateProject(modalData: { name: string; parentId: string; description?: string | null }) {
  const user = this.currentUser();
  
  if (!user) return;

 

  this.apiService.createProject(modalData, user.userId)
    .subscribe({
      next: (response) => {
        console.log('Project created successfully', response);
        this.loadUserProjects(); // Refresh the sidebar list
        this.showprojmodel.set(false);
      },
      error: (err) => console.error('Creation failed', err)
    });
}


  handleUnitTestGeneration(): void {
    // This is the equivalent of the end of the unit test workflow.
    // We can simulate a final step or just leave it on the generated list view.
    // For now, we'll keep the currentStep at 1 (representing the input/result phase of Unit tests).
    console.log('Unit test generation complete.');
  }

  toggleProject(id: string) {
  this.projects.update(list => this.toggleRecursive(list, id));
}

private toggleRecursive(list: ProjectFolder[], id: string): ProjectFolder[] {
  return list.map(folder => {
    if (folder.id === id) {
      return { ...folder, isOpen: !folder.isOpen };
    }

    if (folder.subFolders?.length) {
      return {
        ...folder,
        subFolders: this.toggleRecursive(folder.subFolders, id)
      };
    }

    return folder;
  });
}
handleJobReview(job: any): void {
  console.log('Orchestrating review for Job ID:', job.id);
  
  this.apiService.getJobResults(job.id).subscribe({
    next: (data: GenerationResult) => {
    
      this.generationData = data
      this.currentView.set('new-generation');

      this.currentStep = 3; 

      console.log('Navigation to Review page complete for project:', data.job_info?.project_name);
    },
    error: (err) => {
      console.error('Failed to load job results:', err);
      alert('Error: Could not retrieve test results for this job.');
    }
  });
}


logout(): void {
  // 1. Clear session data
  this.currentUser.set(null);
  this.projects.set([]);
  
  // 2. Reset view to login
  this.currentView.set('login');
  this.currentStep = 0;
  this.showUserMenu.set(false);
  
  // 3. Clear any local storage if used
  localStorage.removeItem('user_session');
  console.log('User logged out successfully');
}
}