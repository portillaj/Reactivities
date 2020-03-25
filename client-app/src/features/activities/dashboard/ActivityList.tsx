import React, { SyntheticEvent } from 'react';
import { Item, Button, Label, Segment } from 'semantic-ui-react';
import { IActivity } from '../../../app/models/activity';

interface IProps {
    submitting: boolean;
    activities: IActivity[];
    target: string;
    selectActivity: (id: string) => void;
    deleteActivity: (e: SyntheticEvent<HTMLButtonElement>, id: string) => void;
}

const ActivityList: React.FC<IProps> = ({  target, deleteActivity, activities,  selectActivity, submitting
}) => {
    return (
        <Segment clearing>
            <Item.Group divided>
                { activities.map(activity => (
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

export default ActivityList;
