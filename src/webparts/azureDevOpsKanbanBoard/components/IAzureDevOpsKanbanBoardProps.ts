import { IAzureDevOpsKanbanBoardWebPartProps, WItem } from '../IAzureDevOpsKanbanBoardWebPartProps';

export interface IAzureDevOpsKanbanBoardProps extends IAzureDevOpsKanbanBoardWebPartProps{
  description: string;
  workItems: Array<WItem>;
}
