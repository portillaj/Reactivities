import React, { useState, useEffect } from 'react';
import { Container } from 'semantic-ui-react';
import { IActivity } from '../models/activity';
import NavBar from '../../features/nav/NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import agent from '../api/agent';

const App = () => {
 
  const [activities, setActivities] = useState<IActivity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<IActivity | null>(null);
  const [editMode, setEditMode] = useState(false);

  const handleSelectActivity = (id: string) => {
    setSelectedActivity(activities.filter(a => a.id === id)[0]);
    setEditMode(false);
  };

  const handleOpenCreateForm = () => {
    setSelectedActivity(null);
    setEditMode(true);
  };

  const handleCreateActivity = async (activity: IActivity) => {
    await agent.Activities.create(activity);
      setActivities([...activities, activity]);
      setSelectedActivity(activity);
      setEditMode(false);
  };

  const handleEditActivity = async (activity: IActivity) => {
    await agent.Activities.update(activity);
    setActivities([...activities.filter(a => a.id !== activity.id), activity]);
    setSelectedActivity(activity);
    setEditMode(false);
  };

  const handleDeleteActivity = async (id: string) => {
    await agent.Activities.delete(id);
    setActivities([...activities.filter(a => a.id !== id)]);
  }

  useEffect(() => {
   agent.Activities.list()
    .then((response) => {
      let activities: IActivity[] = [];
      response.forEach(activity => {
        activity.date = activity.date.split('.')[0];
        activities.push(activity);
      });
      setActivities(activities);
    });
  }, []);
   
    return (
      <>
       <NavBar openCreateForm={handleOpenCreateForm} />
       <Container style={{ marginTop: '7em'}}>
         <ActivityDashboard
          deleteActivity={handleDeleteActivity}
          setSelectedActivity={setSelectedActivity}
          selectActivity={ handleSelectActivity }
          activities={activities}
          selectedActivity={selectedActivity}
          editMode={editMode}
          setEditMode={setEditMode}
          createActivity={handleCreateActivity}
          editActivity={handleEditActivity}
        />
        </Container>
      </>
    );
};

export default App;
