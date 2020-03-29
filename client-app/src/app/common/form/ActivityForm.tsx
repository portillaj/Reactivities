import React, { useState, useContext, useEffect } from 'react';
import { Segment, Form, Button, Grid } from 'semantic-ui-react';
import { IActivityFormValues } from '../../models/activity';
import ActivityStore from '../../stores/activityStore';
import { observer } from 'mobx-react-lite';
import { Form as FinalForm, Field } from 'react-final-form';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import TextInput from './TextInput';
import TextAreaInput from './TextAreaInput';
import SelectInput from './SelectInput';
import DateInput from './DateInput';
import { category } from '../options/categoryOptions';
import { combineDateAndTime } from '../util/util';

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

    
    const [activity, setActivity ] = useState<IActivityFormValues>({
        id: undefined,
        title: '',
        category: '',
        description: '',
        date: undefined,
        time: undefined,
        city: '',
        venue: ''
    });

    useEffect(() => {
        if(params.id && activity.id) {
            loadActivity(params.id).then(() => initialFormState && setActivity(initialFormState));
        }
        return () => {
            clearActivity();
        };
    }, [loadActivity, clearActivity, params.id, initialFormState, activity]);

    // const handleSubmit = async () => {
    //     if(activity.id.length === 0) {
    //         let newActivity = {
    //             ...activity,
    //             id: uuid()
    //         };
    //         await createActivity(newActivity);
    //         history.push(`/activities/${newActivity.id}`);
    //     } else {
    //         await editActivity(activity);
    //         history.push(`/activities/${activity.id}`);
    //     }
    // }

    const handleFinalFormSubmit = (values: any) => {
        const dateAndTime = combineDateAndTime(values.date, values.time);
        console.log('early activity', values);
        const {date, time, ...activity} = values;
        activity.date = dateAndTime;
        console.log(activity);

    };

    return (
        <Grid>
            <Grid.Column width={10}>
            <Segment clearing>
                <FinalForm
                    onSubmit={handleFinalFormSubmit}
                    render={({ handleSubmit }) => (
                        <Form onSubmit={handleSubmit}>
                            <Field
                                name="title"
                                value={activity.title}
                                placeholder="Title"
                                component={TextInput}
                            />
                            <Field
                                rows={3}
                                value={activity.description}
                                name="description"
                                placeholder="Description"
                                component={TextAreaInput}
                            />
                            <Field
                                placeholder="Category"
                                options={category}
                                value={activity.category}
                                name="category"
                                component={SelectInput}
                            />
                            <Form.Group width='equal'>
                                <Field 
                                    type="datetime-local"
                                    placeholder="Date"
                                    date
                                    value={activity.date}
                                    name="date"
                                    component={DateInput}
                                />
                                <Field 
                                    type="datetime-local"
                                    placeholder="Time"
                                    value={activity.time}
                                    name="time"
                                    time
                                    component={DateInput}
                                />
                            </Form.Group>
                            <Field placeholder="City" value={activity.city} name="city" component={TextInput} />
                            <Field placeholder="Venue" value={activity.venue} name="venue" component={TextInput} />
                            <Button loading={submitting} floated="right" positive type="submit" content="Submit" />
                            <Button onClick={() => history.push('/activities')} floated="right" type="button" content="Cancel" />
                        </Form>
                    )}
            />
            </Segment>
            </Grid.Column>
        </Grid>
    )
}

export default withRouter(observer(ActivityForm));
