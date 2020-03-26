import React, { useEffect, useContext } from 'react';
import { Container } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import NavBar from '../../features/nav/NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import LoadingComponent from './LoadingComponent';
import ActivityStore from '../stores/activityStore';

const App = () => {
  const activityStore = useContext(ActivityStore);
  
  useEffect(() => {
    activityStore.loadActivities();
  }, [activityStore]);

  if(activityStore.loadingInitial) return <LoadingComponent content="Loading Activities..." />
   
    return (
      <>
       <NavBar />
       <Container style={{ marginTop: '7em'}}>
         <ActivityDashboard />
        </Container>
      </>
    );
};

export default observer(App);
