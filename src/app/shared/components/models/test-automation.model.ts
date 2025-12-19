// export interface TestCase {
//     id: string;
//     title: string;
//     source: string;
//     type: 'Functional' | 'UI' | 'Security'|any;
//     priority: 'High' | 'Medium' | 'Low';
//     status: 'Ready' | 'Draft';
//     feedback:string|'';
//   }
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
    high_priority_count: number;
    medium_priority_count: number;
    low_priority_count: number;
    test_cases: TestCase[];
    automation_scripts: {[key:string]:AutomationScript};
  }
