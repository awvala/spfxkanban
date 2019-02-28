export interface IAzureDevOpsKanbanBoardWebPartProps {
    description: string; // Stores the Web Part Title
    workItems: Array<WItem>;
   }

   export interface WID {
     target: Target;
  }

  export interface Target {
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