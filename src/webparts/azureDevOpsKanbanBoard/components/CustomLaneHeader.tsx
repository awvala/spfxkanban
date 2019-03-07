import * as React from 'react';
import styles from './AzureDevOpsKanbanBoard.module.scss';

export const CustomLaneHeader = props => {
    return (
        <div>
            <header className={styles.laneCustomHeader}>
                <div style={{ fontSize: 14}}>{props.title}</div>
                {props.label  && (
                    <div style= {{ width: '30%', textAlign: 'right', fontSize: 13}}>
                    </div>
                )}
            </header>
        </div>
    );
};