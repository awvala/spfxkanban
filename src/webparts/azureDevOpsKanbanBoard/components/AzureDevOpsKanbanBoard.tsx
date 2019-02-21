import * as React from 'react';
import styles from './AzureDevOpsKanbanBoard.module.scss';
import { IAzureDevOpsKanbanBoardProps } from './IAzureDevOpsKanbanBoardProps';
import { escape } from '@microsoft/sp-lodash-subset';
import Board from 'react-trello';


const data = {
  lanes: [
    {
      id: 'lane1',
      title: 'Planned Tasks',
      label: '2/2',
      cards: [
        {id: 'Card1', title: 'Write Blog', description: 'Can AI make memes', label: '30 mins'},
        {id: 'Card2', title: 'Pay Rent', description: 'Transfer via NEFT', label: '5 mins', metadata: {sha: 'be312a1'}}
      ]
    },
    {
      id: 'lane2',
      title: 'Completed',
      label: '0/0',
      cards: []
    }
  ]
};

export default class AzureDevOpsKanbanBoard extends React.Component<IAzureDevOpsKanbanBoardProps, Board> {
  
  public render(): React.ReactElement<IAzureDevOpsKanbanBoardProps> {
    return (
      // <div className={ styles.azureDevOpsKanbanBoard }>
      //   <div className={ styles.container }>
      //     <div className={ styles.row }>
      //       <div className={ styles.column }>
      //         <span className={ styles.title }>Welcome to SharePoint!</span>
      //         <p className={ styles.subTitle }>Customize SharePoint experiences using Web Parts.</p>
      //         <p className={ styles.description }>{escape(this.props.description)}</p>
      //         <a href="https://aka.ms/spfx" className={ styles.button }>
      //           <span className={ styles.label }>Learn more</span>
      //         </a>
      //       </div>
      //     </div>
      //   </div>
      // </div>
      <div className={ styles.azureDevOpsKanbanBoard }>
      <h2 className={ styles.description }>{escape(this.props.description)}</h2>
        <Board 
          data={data} 
          draggable
          laneDraggable
          cardDraggable={false}
          collapsibleLanes

        />
      </div>
    );
  }
}
