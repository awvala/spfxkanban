import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';
import { AadHttpClient, HttpClientResponse } from '@microsoft/sp-http';

import * as strings from 'AzureDevOpsKanbanBoardWebPartStrings';
import AzureDevOpsKanbanBoard from './components/AzureDevOpsKanbanBoard';
import { IAzureDevOpsKanbanBoardProps } from './components/IAzureDevOpsKanbanBoardProps';
import { IAzureDevOpsKanbanBoardWebPartProps, WID, WItem, WItems } from './IAzureDevOpsKanbanBoardWebPartProps';

export interface IAzureDevOpsKanbanBoardWebPartProps {
  description: string;
}

export default class AzureDevOpsKanbanBoardWebPart extends BaseClientSideWebPart<IAzureDevOpsKanbanBoardWebPartProps> {

  private workItemList: WItem[];

  public render(): void {
    const element: React.ReactElement<IAzureDevOpsKanbanBoardProps> = React.createElement(
      AzureDevOpsKanbanBoard,
      {
        description: this.properties.description,
        workItems: this.workItemList
      }
    );

    this.context.aadHttpClientFactory
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
              .then((items: any) => {
                // console.log(items);
                const workItems: WItem[] = [];
                for (let i: number = 0; i < items.value.length; i++) {
                  workItems.push({
                    Id: items.value[i].id,
                    Title: items.value[i].fields["System.Title"],
                    Description: items.value[i].fields["System.Description"],
                    WorkItemType: items.value[i].fields["System.WorkItemType"],
                    State: items.value[i].fields["System.State"],
                    StartDate: items.value[i].fields["Microsoft.VSTS.Scheduling.StartDate"],
                    TargetDate: items.value[i].fields["Microsoft.VSTS.Scheduling.TargetDate"],
                    Relations: items.value[i].relations,
                  });
                }
                this.workItemList = workItems;
                 console.log(this.workItemList);
              });
          });
      });

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
