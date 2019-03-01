export interface IAzureDevOpsKanbanBoardWebPartProps {
    description: string; // Stores the Web Part Title
    workItems: Array<WItem>;
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
    Relations?: any;
  }

  export interface WItems {
    value: WItem[];
  }