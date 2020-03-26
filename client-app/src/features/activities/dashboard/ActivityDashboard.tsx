import React, { SyntheticEvent, useContext } from 'react';
import { Grid } from 'semantic-ui-react';
import { IActivity } from '../../../app/models/activity';
import ActivityList from './ActivityList';
import ActivityDetails from '../details/ActivityDetails';
import ActivityForm from '../form/ActivityForm';
import { observer } from 'mobx-react-lite';
import ActivityStore from '../../../app/stores/activityStore';

interface IProps {
    submitting: boolean;
    target: string;
    deleteActivity: (e: SyntheticEvent<HTMLButtonElement>, id: string) => void;
    setEditMode: (editMode: boolean) => void;
    setSelectedActivity: (activity: IActivity | null) => void;
    editActivity: (activity: IActivity) => void;
}

const ActivityDashboard: React.FC<IProps> = ({
    editActivity,
    deleteActivity,
    submitting,
    setSelectedActivity,
    setEditMode,
    target
}) => {
    const { editMode, selectedActivity} = useContext(ActivityStore);
    return (
        <Grid>
            <Grid.Column width={10}>
                    <ActivityList target={target} submitting={submitting} deleteActivity={deleteActivity} />
            </Grid.Column>
            <Grid.Column width={6}>
                { selectedActivity && !editMode &&
                <ActivityDetails
                    setEditMode={setEditMode}
                    setSelectedActivity={ setSelectedActivity }
                /> }
                { editMode &&
                    <ActivityForm
                        submitting={submitting}
                        key={selectedActivity && selectedActivity.id || 0}
                        activity={ selectedActivity }
                        setEditMode={setEditMode}
                        editActivity={editActivity}
                    /> 
                }
            </Grid.Column>
      </Grid>
    )
}

export default observer(ActivityDashboard);
