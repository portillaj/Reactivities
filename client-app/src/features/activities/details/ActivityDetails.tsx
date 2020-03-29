import React, { useContext, useEffect } from 'react';
import { Grid } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import ActivityStore from '../../../app/stores/activityStore';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import ActivityDetailedHeader from './ActivityDetailedHeader';
import ActivityDetailedInfo from './ActivityDetailedInfo';
import ActivityDetailedChat from './ActivityDetailedChat';
import ActivityDetailedSidebar from './ActivityDetailedSidebar';

interface DetailParams {
  id: string;
};

const ActivityDetails: React.FC<RouteComponentProps<DetailParams>> = ({ match: { params }, history }) => {
    const { activity, loadActivity, loadingInitial } = useContext(ActivityStore);
    useEffect(() => {
      loadActivity(params.id);
    }, [loadActivity, params.id, history]);
    
    if(loadingInitial) return <LoadingComponent content="Loading activity..." />;

    if(!activity) {
      return <h2>Activity not found</h2>
    }

    return (
      <Grid>
        <Grid.Column width={10}>
          <ActivityDetailedHeader activity={activity} />
          <ActivityDetailedInfo activity={activity} />
          <ActivityDetailedChat />
        </Grid.Column>
        <Grid.Column width={6}>
          <ActivityDetailedSidebar />
        </Grid.Column>
      </Grid>
    )
}

export default withRouter(observer(ActivityDetails));
