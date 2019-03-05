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
            id: '',
            title: '',
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
              id: 'lane1',
              title: 'Planned Tasks',
              // label: '2/2',
              cards: [
                { id: 'Card1', title: 'Write Blog', description: 'Can AI make memes', label: '30 mins' },
                { id: 'Card2', title: 'Pay Rent', description: 'Transfer via NEFT', label: '5 mins', metadata: { sha: 'be312a1' } }
              ]
            },
            {
              id: 'lane2',
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
      console.log(this.state.data);
    } else {
      console.log("Get ADO data");
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
                  console.log(json);
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

                  this.setState ({
                    workItems: workItems,
                  });
                   console.log(this.state.workItems);
                });
            });
        });
    }
  }
}

    //else if (!this.props.missingField && this.props.filterName !== undefined) {
    //   // convert data from Azure DevOps
    //   this.props.spHttpClient.get(`${this.props.siteUrl}/_api/Web/Lists(guid'${this.props.listName}')/items?$select=Title,Description,BackgroundImageLocation,LinkLocation,Owner/Title&$expand=Owner/Id&$filter=Category eq '${this.props.filterName}'`, SPHttpClient.configurations.v1)
    //     .then(response => {
    //       return response.json();
    //     })
    //     .then((items: any) => {
    //       // console.log(items);
    //       const listItems: IFilteredPromotedLinkDataItem[] = [];
    //       for (let i: number = 0; i < items.value.length; i++) {
    //         listItems.push({
    //           Title: items.value[i].Title,
    //           Description: items.value[i].Description,
    //           ImageUrl: items.value[i].BackgroundImageLocation.Url,
    //           LinkUrl: items.value[i].LinkLocation.Url,
    //           Owner: items.value[i].Owner.Title
    //         });
    //       }
    //       this.setState({
    //         listData: listItems,
    //         loading: false,
    //         showPlaceholder: false
    //       });
    //     }, (err: any) => {
    //       console.log(err);
    //     });
    // } else {
    //   // disable the Filter dropdown
    //   this.setState({
    //     listData: [],
    //     loading: false,
    //     showPlaceholder: false
    //   });
    // }



