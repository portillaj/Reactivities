import React, { useContext, useEffect } from 'react';
import { Card, Image, Button } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import ActivityStore from '../../../app/stores/activityStore';
import { RouteComponentProps, withRouter, Link } from 'react-router-dom';
import LoadingComponent from '../../../app/layout/LoadingComponent';

interface DetailParams {
  id: string;
};

const ActivityDetails: React.FC<RouteComponentProps<DetailParams>> = ({ match: { params }, history }) => {
    const { activity, loadActivity, loadingInitial } = useContext(ActivityStore);
    useEffect(() => {
      loadActivity(params.id);
    }, [loadActivity, params.id]);
    
    if(loadingInitial || !activity) return <LoadingComponent content="Loading activity..." />;

    return (
        <Card fluid>
        <Image src={`/assets/categoryImages/${activity!.category}.jpg`} wrapped ui={false} />
        <Card.Content>
          <Card.Header>{activity!.title}</Card.Header>
          <Card.Meta>
            <span className='date'>{activity!.date}</span>
          </Card.Meta>
          <Card.Description>
            { activity!.description}
          </Card.Description>
        </Card.Content>
        <Card.Content extra>
         <Button.Group widths={2}>
             <Button as={Link} to={`/manage/${activity.id}`} basic color="blue" content="Edit" />
             <Button onClick={() => history.push('/activities')} basic color="grey" content="Cancel" />
         </Button.Group>
        </Card.Content>
      </Card>
    )
}

export default withRouter(observer(ActivityDetails));
