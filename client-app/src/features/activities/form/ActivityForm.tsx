import React, { useState, FormEvent, useContext, useEffect } from 'react';
import { Segment, Form, Button } from 'semantic-ui-react';
import { v4 as uuid } from 'uuid';
import { IActivity } from '../../../app/models/activity';
import ActivityStore from '../../../app/stores/activityStore';
import { observer } from 'mobx-react-lite';
import { RouteComponentProps, withRouter } from 'react-router-dom';

interface DetailParams {
    id: string;
};

const ActivityForm: React.FC<RouteComponentProps<DetailParams>> = ({ match: { params }, history }) => {

    const {
        createActivity, 
        loadActivity, 
        editActivity, 
        clearActivity, 
        submitting,  
        activity: initialFormState 
    } = useContext(ActivityStore);

    
    const [activity, setActivity ] = useState<IActivity>({
        id: '',
        title: '',
        category: '',
        description: '',
        date: '',
        city: '',
        venue: ''
    });

    useEffect(() => {
        if(params.id && activity.id.length === 0) {
            loadActivity(params.id).then(() => initialFormState && setActivity(initialFormState));
        }
        return () => {
            clearActivity();
        };
    }, [loadActivity, clearActivity, params.id, initialFormState, activity.id.length]);

    const handleInputChange = (event: FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.currentTarget;
        setActivity({...activity, [name]: value});
    };

    const handleSubmit = async () => {
        if(activity.id.length === 0) {
            let newActivity = {
                ...activity,
                id: uuid()
            };
            await createActivity(newActivity);
            history.push(`/activities/${newActivity.id}`);
        } else {
            await editActivity(activity);
            history.push(`/activities/${activity.id}`);
        }
    }

    return (
        <Segment clearing>
            <Form>
                <Form.Input onChange={ handleInputChange } name="title" value={activity.title} placeholder="Title" />
                <Form.TextArea onChange={ handleInputChange } row={2} value={activity.description} name="description" placeholder="Description" />
                <Form.Input onChange={ handleInputChange } placeholder="Category" value={activity.category} name="category" />
                <Form.Input onChange={ handleInputChange } type="datetime-local" placeholder="Date" value={activity.date} name="date" />
                <Form.Input onChange={ handleInputChange } placeholder="City" value={activity.city} name="city" />
                <Form.Input onChange={ handleInputChange } placeholder="Venue" value={activity.venue} name="venue" />
                <Button onClick={handleSubmit} loading={submitting} floated="right" positive type="submit" content="Submit" />
                <Button onClick={() => history.push('/activities')} floated="right" type="button" content="Cancel" />
            </Form>
        </Segment>
    )
}

export default withRouter(observer(ActivityForm));
