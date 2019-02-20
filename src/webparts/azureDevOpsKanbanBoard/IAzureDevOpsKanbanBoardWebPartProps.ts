export interface IAzureDevOpsKanbanBoardWebPartProps {
    description: string; // Stores the Web Part Title
   }

   export interface WItem {
    id?: string | number;
  }
  
  export interface WItems {
    workItems: WItem[];
  }

  export interface WIOptions {
    Id: string | number;
  }