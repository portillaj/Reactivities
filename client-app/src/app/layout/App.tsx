import React from 'react';
import { Route, withRouter, RouteComponentProps, Switch } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { Container } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import NavBar from '../../features/nav/NavBar';
import Homepage from '../../features/home/Homepage';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import ActivityForm from '../../features/activities/form/ActivityForm';
import ActivityDetails from '../../features/activities/details/ActivityDetails';
import NotFound from './NotFound';

const App: React.FC<RouteComponentProps> = ({ location }) => (
    <>
      <ToastContainer position='bottom-right' />
      <Route exact path="/"><Homepage /></Route>
      <Route path={'/(.+)'} render={() => (
        <>
          <NavBar />
          <Container style={{ marginTop: '7em'}}>
            <Switch>
              <Route exact path="/activities"><ActivityDashboard /></Route>
              <Route path="/activities/:id"><ActivityDetails /></Route>
              <Route key={location.key} path={["/createActivity", "/manage/:id"]}><ActivityForm /></Route>
              <Route><NotFound /></Route>
            </Switch>
          </Container>
        </>
      )}/>
    </>
);

export default withRouter(observer(App));
