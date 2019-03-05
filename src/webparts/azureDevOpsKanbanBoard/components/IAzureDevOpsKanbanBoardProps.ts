import { IAzureDevOpsKanbanBoardWebPartProps} from '../IAzureDevOpsKanbanBoardWebPartProps';
import { WebPartContext } from '@microsoft/sp-webpart-base';

export interface IAzureDevOpsKanbanBoardProps extends IAzureDevOpsKanbanBoardWebPartProps{
  description: string;
  // workItems: Array<WItem>;
  isWorkbench: boolean;
  context: WebPartContext;
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

