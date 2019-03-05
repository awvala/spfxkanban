import { WebPartContext } from '@microsoft/sp-webpart-base';

export interface IAzureDevOpsKanbanBoardWebPartProps {
    description: string; // Stores the Web Part Title
    // workItems: Array<WItem>;
    context: WebPartContext;
   }