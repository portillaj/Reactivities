import React from 'react'
import {format } from 'date-fns';
import { Item, Button, Segment, Icon } from 'semantic-ui-react'
import { IActivity } from '../../../app/models/activity';
import { Link } from 'react-router-dom';
import ActivityListItemAttendees from './ActivityListItemAttendees';

interface IProps {
    activity: IActivity;
};

const ActivityListItem: React.FC<IProps> = ({ activity }) => {
    return (
        <Segment.Group>
            <Segment>
                <Item.Group>
                    <Item>
                    <Item.Image size="tiny" circular src="/assets/user.png" />
                    <Item.Content>
                        <Item.Header as='a'>{activity.title}</Item.Header>
                        <Item.Description>
                        Hosted By Jason
                        </Item.Description>
                    </Item.Content>
                </Item>
                </Item.Group>
            </Segment>
            <Segment>
                <Icon name='clock' />{format(activity.date, 'h:mm a')}
                <Icon name='marker' />{activity.venue}, {activity.city}
            </Segment>
            <Segment secondary>
                <ActivityListItemAttendees attendees={activity.attendees}/>
            </Segment>
            <Segment clearing>
                <span>{activity.description}</span>
                <Button
                    as={Link}
                    to={`/activities/${activity.id}`}
                    floated="right"
                    content="View"
                    color='blue'
                />
            </Segment>
        </Segment.Group>
    );
};

export default ActivityListItem
