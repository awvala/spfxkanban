import * as React from 'react';
import styles from './AzureDevOpsKanbanBoard.module.scss';
import { IAzureDevOpsKanbanBoardProps, WID, BoardData } from './IAzureDevOpsKanbanBoardProps';
import { CustomLaneHeader } from './CustomLaneHeader';
import { CustomCard } from './CustomCard';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/components/Spinner';
import { Placeholder } from '@pnp/spfx-controls-react/lib/Placeholder';
import { escape } from '@microsoft/sp-lodash-subset';
import Board from 'react-trello';
import { autobind } from 'office-ui-fabric-react';

import { AadHttpClient, HttpClientResponse } from '@microsoft/sp-http';

export interface IAzureDevOpsKanbanBoardState {
  loading?: boolean;
  showPlaceholder?: boolean;
}

export default class AzureDevOpsKanbanBoard extends React.Component<IAzureDevOpsKanbanBoardProps, Board, IAzureDevOpsKanbanBoardState> {

  constructor(props: IAzureDevOpsKanbanBoardProps, state: IAzureDevOpsKanbanBoardState) {
    super(props);

    this._onConfigure = this._onConfigure.bind(this);

    // Initialize the state of the component
    this.state = {
      loading: true,
      showPlaceholder: false,
      workbench: this.props.isWorkbench,
      data:
      {
        lanes: [
          {
            id: 'Loading...',
            title: 'Loading...',
            cards: [],
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

    // Check if placeholder needs to be shown
    if (this.state.showPlaceholder) {
      return (
        <Placeholder
          iconName="Edit"
          iconText="Kanban board web part configuration"
          description="Please configure the web part to show the kanban board."
          buttonLabel="Configure"
          onConfigure={this._onConfigure}
        />
      );
    } else {
      return (
        <div className={styles.azureDevOpsKanbanBoard}>
          {this.state.loading ?
            (
              <Spinner size={SpinnerSize.large} label="Retrieving results ..." />
            ) : this.state.data.length === null ?
              (
                <Placeholder
                  iconName="InfoSolid"
                  iconText="No items found"
                  description="Please select a new list or update the filter in the property pane."
                  buttonLabel="Configure"
                  onConfigure={this._onConfigure}
                />
              ) :
              <div className={styles.container}>
                <h2>{escape(this.props.description)}</h2>
                <Board
                  data={this.state.data}
                  draggable
                  laneDraggable
                  cardDraggable={false}
                  collapsibleLanes
                  customLaneHeader={<CustomLaneHeader />}
                  className={styles.boardContainer}
                  customCardLayout
                >
                  <CustomCard />
                </Board>
              </div>
          }
        </div>
      );
    }
  }

  public componentDidMount(): void {
    this.loadData();
  }

  public componentDidUpdate() {
    if (this.state.loading) {
      this.loadData();
    }
  }

  @autobind
  private loadData(): void {
    if (this.state.workbench) {
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
        },
        loading: false,
      });
      console.log(this.state.data);
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
                  this.buildLanes(json)
                    .then((boardData) => {
                      let workItemsList = boardData;

                      json.value.map((items: any) => {
                        const tempState = items.fields["System.State"];
                        let laneIndex = workItemsList.lanes.findIndex((item) => item.title === tempState);

                        workItemsList.lanes[laneIndex].cards.push({
                          id: items.id,
                          title: items.fields["System.Title"],
                          description: items.fields["System.Description"],
                          workItemType: items.fields["System.WorkItemType"],
                          state: items.fields["System.State"],
                          startdate: items.fields["Microsoft.VSTS.Scheduling.StartDate"],
                          targetdate: items.fields["Microsoft.VSTS.Scheduling.TargetDate"],
                          relations: items.relations
                        });
                      });
                      this.setState({
                        data: workItemsList,
                        loading: false,
                        // data: {
                        //   lanes: [
                        //     {
                        //       id: 'Planned Tasks',
                        //       title: 'Planned Tasks',
                        //       // label: '2/2',
                        //       cards: [
                        //         { id: 'Card1', title: 'Write Blog', description: 'Can AI make memes', label: '30 mins' },
                        //         { id: 'Card2', title: 'Pay Rent', description: 'Transfer via NEFT', label: '5 mins', metadata: { sha: 'be312a1' } }
                        //       ]
                        //     },
                        //     {
                        //       id: 'In Progress',
                        //       title: 'In Progress',
                        //       // label: '0/0',
                        //       cards: [
                        //         { id: 'Card1', title: 'Review movies', description: 'Can AI review cinematography?', label: '20 mins' },
                        //         { id: 'Card2', title: 'Go out to dinner', description: 'Can I turn my OS into Friday?', label: '5 mins' }
                        //       ]
                        //     }
                        //   ]
                        // },
                      });
                      console.log(this.state.data);
                    });
                });
            });
        });
    }
  }

  // Get the State values from the API results to construct Lanes and place them into the BoardData structure.
  protected buildLanes = async (json): Promise<BoardData> => {
    let uniqueStates = Array.from(new Set(json.value.map(item => item.fields["System.State"])));
    // console.log(uniqueStates);
    let boardData = {
      lanes: [],
    };

    uniqueStates.map((items: any) => {
      boardData.lanes.push({
        id: items,
        title: items,
        cards: [],
      });
    });
    // console.log(boardData);
    return boardData;
  }

}