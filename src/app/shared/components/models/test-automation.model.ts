
  export interface TestCase {
    ID: string;
    Title: string;
    source: string;
    Type: 'Positive' | 'Negtive' | 'Edge case'|any;
    Priority: 'High' | 'Medium' | 'Low';
    Preconditions: string;
    ExpectedResults:string;
    Steps: string;
    status: 'Ready' | 'Draft';
    feedback:string|'';
    TestData:TestData;
  }
  export interface AutomationScript {
  framework: string;
  script: string[];
}
  export interface TestData {
  Inputs: any;
  API_Payload: any;
  DB_Mock: any;
}
  export interface GenerationResult {
    high_priority: number;
    medium_priority: number;
    low_priority: number;
    test_cases: TestCase[];
    automation_scripts: {[key:string]:AutomationScript};
    job_info?: JobInfo;
  }
  export interface ProjectFolder {
  id: string;
  name: string;
  count: number;
  isOpen?: boolean;
  parentId?: string | null; // Null for root folders
  subFolders?: ProjectFolder[];
}
export interface JobInfo {
  job_id: string;
  project_name: string;
  project_id: string;
  submitted_by: string;
  completed_at: string;
}
export interface Tenant {
  tenantId: number;
  tenantName: string;
  role: string;
  accessLevel: number;
}

export interface UserSession {
  userId: number;
  displayName: string;
  email: string;
  tenants: Tenant[];
}