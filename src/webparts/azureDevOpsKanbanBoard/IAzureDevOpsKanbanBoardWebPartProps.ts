export interface IAzureDevOpsKanbanBoardWebPartProps {
    description: string; // Stores the Web Part Title
   }

   export interface WID {
    id?: string | number;
  }

  export interface WItem {
    Id: string | number;
    Title?: string;
    Description?: string;
    WorkItemType?: string;
    State?: string;
    StartDate?: Date;
    TargetDate?: Date;
  }

  export interface WItems {
    value: WItem[];
  }