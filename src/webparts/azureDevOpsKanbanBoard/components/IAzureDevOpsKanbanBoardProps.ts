import { IAzureDevOpsKanbanBoardWebPartProps } from '../IAzureDevOpsKanbanBoardWebPartProps';
import { WebPartContext } from '@microsoft/sp-webpart-base';

export interface IAzureDevOpsKanbanBoardProps extends IAzureDevOpsKanbanBoardWebPartProps {
  description: string;
  isWorkbench: boolean;
  context: WebPartContext;
}


// string of ID's used to query Azure DevOps work items.
export interface WID {
  id?: string | number;
}

// Object data structure for the Kanban board
/*

  data: {
    lanes: [
      {
        id: 'Loading...',
        title: 'Loading...',
        cards: [],
      }
    ]
  }

*/

export interface BoardData {
  lanes: LaneData[];
}

export interface LaneData {
  id: string;
  title: string;
  label?: string;
  cards?: CardData[];
}

// export interface CardData {
//   value: WItem[];
// }

export interface CardData {
  Id: string | number;
  Title?: string;
  Description?: string;
  WorkItemType?: string;
  State?: string;
  StartDate?: Date;
  TargetDate?: Date;
  Relations?: any;
}


