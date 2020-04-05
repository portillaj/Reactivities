import React, { useState, useContext, useEffect } from 'react';
import { Segment, Form, Button, Grid } from 'semantic-ui-react';
import { v4 as uuid } from 'uuid';
import { ActivityFormValues } from '../../models/activity';
import { observer } from 'mobx-react-lite';
import { Form as FinalForm, Field } from 'react-final-form';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import TextInput from './TextInput';
import TextAreaInput from './TextAreaInput';
import SelectInput from './SelectInput';
import DateInput from './DateInput';
import { category } from '../options/categoryOptions';
import { combineValidators, isRequired, composeValidators, hasLengthGreaterThan } from 'revalidate';
import { combineDateAndTime } from '../util/util';
import { RootStoreContext } from '../../stores/rootStore';

const validate = combineValidators({
    title: isRequired({message: 'The event title is required'}),
    category: isRequired('Category'),
    description: composeValidators(
        isRequired('Description'),
        hasLengthGreaterThan(4)({message: 'Description needs to be at least 5 characters'}),
    )(),
    city: isRequired('City'),
    venue: isRequired('Venue'),
    date: isRequired('Date'),
    time: isRequired('Time')
});

interface DetailParams {
    id: string;
};

const ActivityForm: React.FC<RouteComponentProps<DetailParams>> = ({ match: { params }, history }) => {
    const rootStore = useContext(RootStoreContext);
    const {
        createActivity, 
        loadActivity, 
        editActivity, 
        submitting,  
    } = rootStore.activityStore;

    const [activity, setActivity ] = useState(new ActivityFormValues());
    const [loading ,setLoading] = useState(false);

    useEffect(() => {
        if(params.id) {
            setLoading(true);
                loadActivity(params.id)
                .then((activity) => setActivity(new ActivityFormValues(activity)))
                .finally(() => setLoading(false));
        }
    }, [loadActivity, params.id]);

    const handleFinalFormSubmit = (values: any) => {
        const dateAndTime = combineDateAndTime(values.date, values.time);
        const {date, time, ...activity} = values;
        activity.date = dateAndTime;
        if(!activity.id) {
            let newActivity = {
                ...activity,
                id: uuid()
            };
            createActivity(newActivity);
        } else {
            editActivity(activity);
        }
    };

    return (
        <Grid>
            <Grid.Column width={10}>
            <Segment clearing>
                <FinalForm
                    validate={validate}
                    initialValues={activity}
                    onSubmit={handleFinalFormSubmit}
                    render={({ handleSubmit, invalid, pristine }) => (
                        <Form onSubmit={handleSubmit} loading={loading}>
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
                            <Button disabled={loading || invalid || pristine} loading={submitting} floated="right" positive type="submit" content="Submit" />
                            <Button disabled={loading} onClick={activity.id ? () => history.push(`/activities/${activity.id}`) : () => history.push('/activities')} floated="right" type="button" content="Cancel" />
                        </Form>
                    )}
            />
            </Segment>
            </Grid.Column>
        </Grid>
    )
}

export default withRouter(observer(ActivityForm));
