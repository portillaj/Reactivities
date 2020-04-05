import React, { useContext, useEffect } from 'react';
import { Route, withRouter, RouteComponentProps, Switch } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { Container } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import NavBar from '../../features/nav/NavBar';
import Homepage from '../../features/home/Homepage';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import ActivityForm from '../common/form/ActivityForm';
import ActivityDetails from '../../features/activities/details/ActivityDetails';
import NotFound from './NotFound';
import LoginForm from '../../features/user/LoginForm';
import { RootStoreContext } from '../stores/rootStore';
import LoadingComponent from './LoadingComponent';
import ModalContainer from '../common/modals/ModalContainer';

const App: React.FC<RouteComponentProps> = ({ location }) => {
  const rootStore = useContext(RootStoreContext);
  const { setAppLoaded, token, appLoaded } = rootStore.commonStore;
  const {getUser } = rootStore.userStore;

  useEffect(() => {
    if(token) {
      getUser().finally(() => setAppLoaded())
    } else {
      setAppLoaded()
    }
  }, [getUser, setAppLoaded, token]);

  if(!appLoaded) return <LoadingComponent content="Loading app..." />

  return (
      <>
        <ModalContainer />
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
                <Route path="/login"><LoginForm /></Route>
                <Route><NotFound /></Route>
              </Switch>
            </Container>
          </>
        )}/>
      </>
  );
};

export default withRouter(observer(App));
