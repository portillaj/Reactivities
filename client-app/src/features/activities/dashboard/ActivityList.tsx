import React, { SyntheticEvent, useContext } from 'react';
import { Item, Button, Label, Segment } from 'semantic-ui-react';
import { IActivity } from '../../../app/models/activity';
import { observer } from 'mobx-react-lite';
import ActivityStore from '../../../app/stores/activityStore';

interface IProps {
    submitting: boolean;
    target: string;
    deleteActivity: (e: SyntheticEvent<HTMLButtonElement>, id: string) => void;
}

const ActivityList: React.FC<IProps> = ({  target, deleteActivity, submitting
}) => {
    const { selectActivity, activitiesByDate } = useContext(ActivityStore);
    return (
        <Segment clearing>
            <Item.Group divided>
                { activitiesByDate.map(activity => (
                    <Item key={activity.id}>
                        <Item.Content>
                <Item.Header as='a'>{activity.title}</Item.Header>
                            <Item.Meta>{activity.date}</Item.Meta>
                            <Item.Description>
                                <div>{activity.description}</div>
                                <div>{activity.city}, {activity.venue}</div>
                            </Item.Description>
                            <Item.Extra>
                                <Button  onClick={() => selectActivity(activity.id)} floated="right" content="View" color='blue' />
                                <Button  name={activity.id} onClick={(e) => deleteActivity(e, activity.id)} loading={target === activity.id && submitting} floated="right" content="Delete" color='red' />
                                <Label basic content={activity.category} />
                            </Item.Extra>
                        </Item.Content>
                    </Item>
                ))}
            </Item.Group>
        </Segment>
       
    )
};

export default observer(ActivityList);
