import React from 'react'
import { Segment, Item, Header, Button, Image } from 'semantic-ui-react'
import { IActivity } from '../../../app/models/activity';
import { observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';

const activityImageStyle = {
  filter: 'brightness(30%)'
};

const activityImageTextStyle = {
  position: 'absolute',
  bottom: '5%',
  left: '5%',
  width: '100%',
  height: 'auto',
  color: 'white'
};

interface IProps {
    activity: IActivity;
};

const ActivityDetailedHeader: React.FC<IProps> = ({ activity }) => {
    return (
            <Segment.Group>
              <Segment basic attached='top' style={{ padding: '0' }}>
                <Image style={activityImageStyle} src={`/assets/categoryImages/${activity.category}.jpg`} fluid />
                <Segment style={activityImageTextStyle} basic>
                  <Item.Group>
                    <Item>
                      <Item.Content>
                        <Header
                          size='huge'
                          content={activity.title}
                          style={{ color: 'white' }}
                        />
                        <p>{activity.date}</p>
                        <p>
                          Hosted by <strong>Bob</strong>
                        </p>
                      </Item.Content>
                    </Item>
                  </Item.Group>
                </Segment>
              </Segment>
              <Segment clearing attached='bottom'>
                <Button color='teal'>Join Activity</Button>
                <Button>Cancel attendance</Button>
                <Button as={Link} to={`/manage/${activity.id}`}color='orange' floated='right'>
                  Manage Event
                </Button>
              </Segment>
            </Segment.Group>
    );
};

export default observer(ActivityDetailedHeader);
