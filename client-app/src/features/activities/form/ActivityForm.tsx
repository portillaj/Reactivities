import React, { useState, FormEvent } from 'react';
import { Segment, Form, Button } from 'semantic-ui-react';
import { v4 as uuid } from 'uuid';
import { IActivity } from '../../../app/models/activity';

interface IProps {
    setEditMode: (editMode: boolean) => void;
    activity: IActivity | null;
    createActivity: (activity: IActivity) => void;
    editActivity: (activity: IActivity) => void;
};

const ActivityForm: React.FC<IProps> = ({ 
    editActivity,
    createActivity,
    setEditMode,
    activity: initialFormState
}) => {
    const initializeForm = () => {
        if(initialFormState) {
            return initialFormState;
        }
        return {
            id: '',
            title: '',
            category: '',
            description: '',
            date: '',
            city: '',
            venue: ''
        }
    };

    const [activity, setActivity ] = useState<IActivity>(initializeForm);

    const handleInputChange = (event: FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.currentTarget;
        setActivity({...activity, [name]: value});
    };

    const handleSubmit = () => {
        if(activity.id.length === 0) {
            let newActivity = {
                ...activity,
                id: uuid()
            };
            createActivity(newActivity);
        } else {
            editActivity(activity);
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
                <Button onClick={handleSubmit} floated="right" positive type="submit" content="Submit" />
                <Button onClick={() => setEditMode(false)} floated="right" type="button" content="Cancel" />
            </Form>
        </Segment>
    )
}

export default ActivityForm
