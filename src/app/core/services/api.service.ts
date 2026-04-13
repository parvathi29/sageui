import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { GenerationResult, ProjectFolder, UserSession } from '../../shared/components/models/test-automation.model';
import { Observable } from 'rxjs';
export interface DashboardData {
  stats: any[];
  recentJobs: any[];
  jobStatusStats: any[];
}
@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  generateTests(payload: any) {
    return this.http.post(
      `${this.baseUrl}/api/generate-test-cases`,
      payload
    );
  }
login(username: string, password: string): Observable<UserSession> 
{ 
  return this.http.post<UserSession>(`${this.baseUrl}/api/login`,
   { username, password });
   }
  getJobs() {
    return this.http.get(
      `${this.baseUrl}/api/jobs`
    );
  }

jobsurl= `${this.baseUrl}/api/jobs`; 

deleteJob(id: string): Observable<any> {
   return this.http.delete<any>(`${this.baseUrl}/api/jobs/${id}`); 
  }
regenerateJob(id: string): Observable<any> 
{ 
  return this.http.post<any>(`${this.baseUrl}/api/jobs/${id}/regenerate`, {});
 }
loadUserProjects(displayName: string): Observable<ProjectFolder[]> {
   return this.http.get<ProjectFolder[]>(`${this.baseUrl}/api/projects/${displayName}`); 
  }
 loadTenantProjects(userName: string, tenantId: number): Observable<ProjectFolder[]> 
 { return this.http.get<ProjectFolder[]>(
  `${this.baseUrl}/api/projects/${userName}?tenantId=${tenantId}`);
 }

 requestOnboarding(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/onboard/request`, payload);
  }
getAgentTrace(jobId: string) {
  return this.http.get<any>(`${this.baseUrl}/api/jobs/${jobId}/agent-status`);
  //  return this.http.get<any>(`${this.baseUrl}/api/jobs/1/agent-status`);
}
generateTestCases(requestData: any, userId: number): Observable<any> {
  const { payloads, data_model_file } = requestData;

  // Add userId to every item in the array
  const finalPayloads = payloads.map((p: any) => ({
    ...p,
    user_id: userId
  }));

  const formData = new FormData();

  // The backend expects the key 'payload' to be a JSON string
  formData.append('payload', JSON.stringify(finalPayloads));

  // Attach the physical file if it exists
  if (data_model_file) {
    formData.append('data_model_file', data_model_file);
  }

  return this.http.post<any>(
    `${this.baseUrl}/api/generate-test-cases`,
    formData
  );
}

createProject(modalData: { name: string; parentId: string; project_spec?: string | null }, userId: number):
      Observable<any> {
         const finalPayload =
          { 
             name: modalData.name,
             parentId: modalData.parentId, 
             user_id: userId, 
             project_spec: modalData.project_spec ?? null 
            };
             return this.http.post<any>(`${this.baseUrl}/api/projects/create`, finalPayload);
             }
getJobResults(jobId: string, storyId?: string): Observable<GenerationResult> {
  let url = `${this.baseUrl}/api/results/${jobId}`;
  if (storyId) {
    url += `?story_id=${storyId}`;
  }
  return this.http.get<GenerationResult>(url);
}

     getDashboardStats(userId: number): Observable<DashboardData> {
    return this.http.get<DashboardData>(`${this.baseUrl}/api/dashboard/${userId}`);
  }

  sendQuickFeedback(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/feedback/quick`, payload);
  }
    sendDetailedFeedback(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/feedback/detailed`, payload);
  }

 getAdminOnboarding(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/api/admin/onboarding`);
  }
  getAdminSuggestions(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/api/admin/suggestions`);
  }

  // 3. Approve a request: Backend will move data to 'users' table and send the automated email
  approveOnboarding(requestId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/admin/onboarding/approve/${requestId}`, {});
  }


  getStories(jobId: number): Observable<any[]> {
  return this.http.get<any[]>(`${this.baseUrl}/api/jobs/${jobId}/stories`);
}

// Fetch the actual test cases/scripts for ONE specific story
getStoryResults(jobId: number, storyId: string): Observable<any> {
  return this.http.get<any>(`${this.baseUrl}/api/results/${jobId}?story_id=${storyId}`);
}
 getProjectDetails(projectId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/api/projects/${projectId}/details`);
  }
}
