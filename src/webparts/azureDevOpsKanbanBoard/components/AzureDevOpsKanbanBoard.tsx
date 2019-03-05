import * as React from 'react';
import styles from './AzureDevOpsKanbanBoard.module.scss';
import { IAzureDevOpsKanbanBoardProps, WID, WItem } from './IAzureDevOpsKanbanBoardProps';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/components/Spinner';
import { Placeholder } from '@pnp/spfx-controls-react/lib/Placeholder';
import { escape } from '@microsoft/sp-lodash-subset';
import Board from 'react-trello';
import { autobind } from 'office-ui-fabric-react';

import { AadHttpClient, HttpClientResponse } from '@microsoft/sp-http';

export interface IAzureDevOpsKanbanBoardState {
  workItems: Array<WItem>;
  loading?: boolean;
  showPlaceholder?: boolean;
}

export default class AzureDevOpsKanbanBoard extends React.Component<IAzureDevOpsKanbanBoardProps, Board, IAzureDevOpsKanbanBoardState> {

  constructor(props: IAzureDevOpsKanbanBoardProps, state: IAzureDevOpsKanbanBoardState) {
    super(props);

    this._onConfigure = this._onConfigure.bind(this);

    // Initialize the state of the component
    this.state = {
      //listData: {},
      loading: false,
      showPlaceholder: false,
      workItems: [],
      data: {
        lanes: [
          {
            id: 'Loading...',
            title: 'Loading...',
            // label: '2/2',
            cards: []
          }
        ]
      }
    };
  }

  /*
   * Opens the web part property pane
  */
  private _onConfigure() {
    this.props.context.propertyPane.open();
  }

  public render(): React.ReactElement<IAzureDevOpsKanbanBoardProps> {
    return (
      <div className={styles.azureDevOpsKanbanBoard}>
        <div className={styles.container}>
          <h2>{escape(this.props.description)}</h2>
          <Board
            data={this.state.data}
            draggable
            laneDraggable
            cardDraggable={false}
            collapsibleLanes
          />
        </div>
      </div>
    );
  }

  public componentDidMount(): void {
    this.loadData();
  }

  @autobind
  private loadData(): void {
    if (this.props.isWorkbench) {
      // get mock data in Workbench
      this.setState({
        data: {
          lanes: [
            {
              id: 'Planned Tasks',
              title: 'Planned Tasks',
              // label: '2/2',
              cards: [
                { id: 'Card1', title: 'Write Blog', description: 'Can AI make memes', label: '30 mins' },
                { id: 'Card2', title: 'Pay Rent', description: 'Transfer via NEFT', label: '5 mins', metadata: { sha: 'be312a1' } }
              ]
            },
            {
              id: 'In Progress',
              title: 'In Progress',
              // label: '0/0',
              cards: [
                { id: 'Card1', title: 'Review movies', description: 'Can AI review cinematography?', label: '20 mins' },
                { id: 'Card2', title: 'Go out to dinner', description: 'Can I turn my OS into Friday?', label: '5 mins' }
              ]
            }
          ]
        }
      });
      // console.log(this.state.data);
    } else {
      // console.log("Get ADO data");
      this.props.context.aadHttpClientFactory
        .getClient('499b84ac-1321-427f-aa17-267ca6975798')
        .then((client: AadHttpClient): void => {
          client
            .get('https://dev.azure.com/AndrewVala/Andrew_Vala/_apis/wit/wiql/2153e285-b146-4322-aaaa-95df5dd01c96?api-version=5.0', AadHttpClient.configurations.v1)
            .then((response: HttpClientResponse) => {
              return response.json();
            })
            .then((response) => {
              let wIDS = new Array;
              let lists: WID[] = response.workItems;
              lists.forEach((list: WID) => {
                wIDS.push(list.id);
              });
              return wIDS;
            })
            .then((wIDs) => {
              client
                .get(`https://dev.azure.com/AndrewVala/_apis/wit/workitems?ids=${wIDs}&$expand=relations&api-version=5.0`, AadHttpClient.configurations.v1)
                .then((response: HttpClientResponse) => {
                  return response.json();
                })
                .then(json => {
                  // console.log(json);
                  //let uniqueStates = [new Set(json.value.map(item => item.fields["System.State"]))];
                  // console.log(uniqueStates);

                  this.buildLanes(json);
                  let workItems: Array<WItem> = new Array<WItem>();
                  //for (let i: number = 0; i < items.value.length; i++) {
                  json.value.map((items: any) => {
                    workItems.push({
                      Id: items.id,
                      Title: items.fields["System.Title"],
                      Description: items.fields["System.Description"],
                      WorkItemType: items.fields["System.WorkItemType"],
                      State: items.fields["System.State"],
                      StartDate: items.fields["Microsoft.VSTS.Scheduling.StartDate"],
                      TargetDate: items.fields["Microsoft.VSTS.Scheduling.TargetDate"],
                      Relations: items.relations
                    });
                  });
                  this.setState({
                    workItems: workItems,
                  });
                  console.log(this.state.workItems);
                  //this.buildLanes();
                });
            });
        });
    }
  }

  @autobind
  private buildLanes(json): void {
    //let uniqueStates = Array.from(new Set(this.state.workItems.map(item => item.State)));
    // console.log(uniqueStates);
     let uniqueStates = Array.from(new Set(json.value.map(item => item.fields["System.State"])));
     console.log(uniqueStates);
    let lanes = [];
    uniqueStates.map((items: any) => {
      lanes.push({
        id: items,
        title: items,
        cards: [],
      });

    });
    console.log(lanes);
  }

}