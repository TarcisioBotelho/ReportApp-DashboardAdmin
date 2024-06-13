export interface User {
    name: string;
  }
  
  export interface Type {
    name: string;
  }
  
  export interface Status {
    id: number;
    name: string;
  }
  
  export interface Report {
    id: number;
    title: string;
    description: string;
    user: User;
    type: Type;
    status: Status | null; // Permite null
  }  