import React from 'react';
import { Route, withRouter, RouteComponentProps } from 'react-router-dom';
import { Container } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import NavBar from '../../features/nav/NavBar';
import Homepage from '../../features/home/Homepage';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import ActivityForm from '../../features/activities/form/ActivityForm';
import ActivityDetails from '../../features/activities/details/ActivityDetails';

const App: React.FC<RouteComponentProps> = ({ location }) => (
    <>
      <Route exact path="/"><Homepage /></Route>
      <Route path={'/(.+)'} render={() => (
        <>
          <NavBar />
          <Container style={{ marginTop: '7em'}}>
            <Route exact path="/activities"><ActivityDashboard /></Route>
            <Route path="/activities/:id"><ActivityDetails /></Route>
            <Route key={location.key} path={["/createActivity", "/manage/:id"]}><ActivityForm /></Route>
          </Container>
        </>
      )}/>
    </>
);

export default withRouter(observer(App));
