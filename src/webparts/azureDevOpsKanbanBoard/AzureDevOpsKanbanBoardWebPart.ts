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
import { IAzureDevOpsKanbanBoardWebPartProps, WItem, WItems, WIOptions } from './IAzureDevOpsKanbanBoardWebPartProps';

export interface IAzureDevOpsKanbanBoardWebPartProps {
  description: string;
}

export default class AzureDevOpsKanbanBoardWebPart extends BaseClientSideWebPart<IAzureDevOpsKanbanBoardWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IAzureDevOpsKanbanBoardProps> = React.createElement(
      AzureDevOpsKanbanBoard,
      {
        description: this.properties.description
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
            let lists: WItem[] = response.workItems;
            lists.forEach((list: WItem) => {
              wIDS.push(list.id);
            });
            // console.log(wIDS);
            // let options: Array<WIOptions> = new Array<WIOptions>();
            // let lists: WItem[] = response.workItems;
            //lists.forEach((list: WItem) => {
            //   options.push({ Id: list.id });
            //});
            //console.log(`https://dev.azure.com/AndrewVala/_apis/wit/workitems?ids=${wIDS}&$expand=fields&api-version=5.0`);
            return wIDS;
          })
          .then((wIDs) => {
            client
              .get(`https://dev.azure.com/AndrewVala/_apis/wit/workitems?ids=${wIDs}&$expand=fields&api-version=5.0`, AadHttpClient.configurations.v1)
              .then((response: HttpClientResponse) => {
                return response.json();
              })
              .then((response) => {
                console.log(response);
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
