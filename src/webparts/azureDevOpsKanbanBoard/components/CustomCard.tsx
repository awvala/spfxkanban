import * as React from 'react';
import styles from './AzureDevOpsKanbanBoard.module.scss';
import Moment from 'react-moment';

export const CustomCard = props => {
    return (
        <div className={props.workItempType === "Epic" ? styles.epicCard
            : props.workItemType === "Feature" ? styles.featureCard
                : styles.userStoryCard}>
        <header>
            <div className="ms-fontSize-m">
                {props.workItemType === "Epic" ? <i className="ms-Icon ms-Icon--CrownSolid ms-fontColor-orangeLighter" aria-hidden="true"></i>
                    : props.workItemType === "Feature" ? <i className="ms-Icon ms-Icon--Trophy2Solid ms-fontColor-themeDarker" aria-hidden="true"></i>
                        : <i className="ms-Icon ms-Icon--ReadingModeSolid ms-fontColor-themeSecondary" aria-hidden="true"></i>
                }<strong> {props.id} </strong> {props.title}
            </div>
        </header>
        <div className="ms-fontSize-s">
                <p>{props.description}</p>
                <div className={styles.dataStyle}><i className="ms-Icon ms-Icon--AlarmClock" aria-hidden="true"></i> <Moment format="MM/DD/YY">{props.target}</Moment>
                </div>
        </div>
        </div>
    );
};