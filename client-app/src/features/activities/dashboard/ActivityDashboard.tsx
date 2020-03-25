import React, { SyntheticEvent } from 'react';
import { Grid } from 'semantic-ui-react';
import { IActivity } from '../../../app/models/activity';
import ActivityList from './ActivityList';
import ActivityDetails from '../details/ActivityDetails';
import ActivityForm from '../form/ActivityForm';

interface IProps {
    submitting: boolean;
    target: string;
    deleteActivity: (e: SyntheticEvent<HTMLButtonElement>, id: string) => void;
    activities: IActivity[];
    selectActivity: (id: string) => void;
    selectedActivity: IActivity | null;
    editMode: boolean;
    setEditMode: (editMode: boolean) => void;
    setSelectedActivity: (activity: IActivity | null) => void;
    createActivity: (activity: IActivity) => void;
    editActivity: (activity: IActivity) => void;
}

const ActivityDashboard: React.FC<IProps> = ({
    activities, 
    editActivity,
    deleteActivity,
    createActivity,
    selectActivity,
    selectedActivity,
    submitting,
    setSelectedActivity,
    editMode,
    setEditMode,
    target
}) => {
    return (
        <Grid>
            <Grid.Column width={10}>
                    <ActivityList target={target} submitting={submitting} deleteActivity={deleteActivity} activities={activities} selectActivity={selectActivity} />
            </Grid.Column>
            <Grid.Column width={6}>
                { selectedActivity && !editMode &&
                <ActivityDetails
                    setEditMode={setEditMode}
                    activity={ selectedActivity }
                    setSelectedActivity={ setSelectedActivity }
                /> }
                { editMode &&
                    <ActivityForm
                        submitting={submitting}
                        key={selectedActivity && selectedActivity.id || 0}
                        activity={ selectedActivity }
                        setEditMode={setEditMode}
                        createActivity={createActivity}
                        editActivity={editActivity}
                    /> 
                }
            </Grid.Column>
      </Grid>
    )
}

export default ActivityDashboard
