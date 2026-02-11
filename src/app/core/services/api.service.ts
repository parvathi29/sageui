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
  requestOnboarding(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/onboard/request`, payload);
  }
loadUserProjects(displayName: string): Observable<ProjectFolder[]> {
   return this.http.get<ProjectFolder[]>(`${this.baseUrl}/api/projects/${displayName}`); 
  }
 loadTenantProjects(userName: string, tenantId: number): Observable<ProjectFolder[]> 
 { return this.http.get<ProjectFolder[]>(
  `${this.baseUrl}/api/projects/${userName}?tenantId=${tenantId}`);
 }



 generateTestCases(payload: any, userId: number):
  Observable<any> { 
  const finalPayload = {
     ...payload, user_id: userId 
    };
     return this.http.post<any>(`${this.baseUrl}/api/generate-test-cases`, finalPayload);
     }

createProject(modalData: { name: string; parentId: string; description?: string | null }, userId: number):
      Observable<any> {
         const finalPayload =
          { 
             name: modalData.name,
             parentId: modalData.parentId, 
             user_id: userId, 
             description: modalData.description ?? null 
            };
             return this.http.post<any>(`${this.baseUrl}/api/projects/create`, finalPayload);
             }
  getJobResults(jobId: string): Observable<GenerationResult> {
     return this.http.get<GenerationResult>(`${this.baseUrl}/api/results/${jobId}`);
     }

     getDashboardStats(userId: number): Observable<DashboardData> {
    return this.http.get<DashboardData>(`${this.baseUrl}/api/dashboard/${userId}`);
  }
}
