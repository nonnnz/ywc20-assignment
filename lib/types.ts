// API Response Types
export interface Applicant {
    firstName: string;
    lastName: string;
    interviewRefNo: string;
    major: MajorType;
  }
  
  export type MajorType = 'web_design' | 'web_content' | 'web_programming' | 'web_marketing';
  
  export interface ApiResponse {
    design: Applicant[];
    content: Applicant[];
    programming: Applicant[];
    marketing: Applicant[];
  }
  
  // Search Related Types
  export interface SearchHistoryItem {
    query: string;
    timestamp: number;
  }
  
  export interface SearchResult {
    applicant: Applicant;
    score: number;
  }
  
  // Animation Types
  export interface AnimationProps {
    children: React.ReactNode;
    delay?: number;
  }
  
  // Location Types
  export interface LocationMarker {
    id: string;
    title: string;
    description: string;
    lat: number;
    lng: number;
    icon?: string;
  }