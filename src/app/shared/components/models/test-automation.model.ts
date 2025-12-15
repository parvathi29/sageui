export interface TestCase {
    id: string;
    title: string;
    source: string;
    type: 'Functional' | 'UI' | 'Security'|any;
    priority: 'High' | 'Medium' | 'Low';
    status: 'Ready' | 'Draft';
    feedback:string|'';
  }
  
  export interface GenerationResult {
    high_priority: number;
    medium_priority: number;
    low_priority: number;
    test_cases: TestCase[];
    automation_script: string;
  }