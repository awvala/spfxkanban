import * as React from 'react';
import styles from './AzureDevOpsKanbanBoard.module.scss';
import Moment from 'react-moment';
import ReactHtmlParser from 'react-html-parser';

export const CustomCard = props => {

    // decrlare variable and store string with HTML to convert with the ReactHTMLParse module.
    const html = props.description;

    return (
        // Add State icon to top left of card based on workItemType
        <div className={props.workItemType === "Epic" ? styles.epicCard
            : props.workItemType === "Feature" ? styles.featureCard
                :  styles.userStoryCard}> {/* Default to UserStory*/}
            <header>
                {/* Style outline of card based on workItemType */}
                <div className="ms-fontSize-m">
                    {props.workItemType === "Epic" ? <i className="ms-Icon ms-Icon--CrownSolid ms-fontColor-orangeLighter" aria-hidden="true"></i>
                        : props.workItemType === "Feature" ? <i className="ms-Icon ms-Icon--Trophy2Solid ms-fontColor-themeDarker" aria-hidden="true"></i>
                            : <i className="ms-Icon ms-Icon--ReadingModeSolid ms-fontColor-themeSecondary" aria-hidden="true"></i>
                    }<strong> {props.id} </strong> {props.title}
                </div>
            </header>
            <div className="ms-fontSize-s">
                <p>{ReactHtmlParser(html)}</p>
                <div className={styles.dateStyle}><i className="ms-Icon ms-Icon--AlarmClock" aria-hidden="true"></i> <Moment format="MM/DD/YY">{props.target}</Moment>
                </div>
            </div>
        </div>
    );
};