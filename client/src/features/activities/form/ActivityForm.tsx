import React, { useState, useContext, useEffect } from 'react';
import { Segment, Form, Button, Grid } from 'semantic-ui-react';
import { ActivityFormValues } from '../../../app/models/activity';
import { v4 as uuid } from 'uuid';
import { observer } from 'mobx-react-lite';
import { RouteComponentProps } from 'react-router';
import { Form as FinalForm, Field } from 'react-final-form';
import TextInput from '../../../app/common/form/TextInput';
import TextAreaInput from '../../../app/common/form/TextAreaInput';
import { category } from '../../../app/common/options/categoryOptions';
import SelectInput from '../../../app/common/form/SelectInput';
import DateInput from '../../../app/common/form/DateInput';
import { combineDateAndTime } from '../../../app/common/util/util';
import { combineValidators, isRequired, composeValidators, hasLengthGreaterThan } from 'revalidate'
import { RootStoreContext } from '../../../app/stores/rootStore';

const validate = combineValidators({
    title: isRequired({ message: 'The event title is required' }),
    category: isRequired('Category'),
    description: composeValidators(isRequired('Description'), hasLengthGreaterThan(4)({ message: 'Description must be at least 5 characters.' }))(),
    city: isRequired('City'),
    venue: isRequired('Venue'),
    date: isRequired('Date'),
    time: isRequired('Time')
});

interface DetailParams {
    id: string;
}

const ActivityForm: React.FC<RouteComponentProps<DetailParams>> = ({ match, history }) => {
    const { activityStore } = useContext(RootStoreContext);
    const { submitting, loadActivity, createActivity, editActivity } = activityStore;

    const [activity, setActivity] = useState(new ActivityFormValues());
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (match.params.id) {
            setLoading(true);
            loadActivity(match.params.id)
                .then(activity => setActivity(new ActivityFormValues(activity)))
                .finally(() => setLoading(false));
        }
    }, [loadActivity, match.params.id]);

    const handleFinalFormSubmit = (values: any) => {
        const dateAndTime = combineDateAndTime(values.date, values.time);
        const { date, time, ...activity } = values;
        activity.date = dateAndTime;
        if (activity.id.length === 0) {
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
                                <Field name='title' placeholder='Title' value={activity.title} component={TextInput} />
                                <Field
                                    name='description'
                                    placeholder='Description'
                                    rows={3}
                                    value={activity.description}
                                    component={TextAreaInput}
                                />
                                <Field
                                    name='category'
                                    placeholder='Category'
                                    options={category}
                                    value={activity.category}
                                    component={SelectInput}
                                />
                                <Form.Group widths='equal'>
                                    <Field
                                        name='date'
                                        placeholder='Date'
                                        date={true}
                                        value={activity.date}
                                        component={DateInput}
                                    />
                                    <Field
                                        name='time'
                                        placeholder='Time'
                                        time={true}
                                        value={activity.time}
                                        component={DateInput}
                                    />
                                </Form.Group>
                                <Field name='city' placeholder='City' value={activity.city} component={TextInput} />
                                <Field name='venue' placeholder='Venue' value={activity.venue} component={TextInput} />
                                <Button
                                    disabled={loading || invalid || pristine}
                                    loading={submitting}
                                    floated='right'
                                    positive
                                    type='submit'
                                    content='Submit'
                                />
                                <Button
                                    disabled={loading}
                                    onClick={activity.id ? () => history.push(`/activities/${activity.id}`) : () => history.push('/activities')}
                                    floated='right'
                                    type='submit'
                                    content='Cancel'
                                />
                            </Form>
                        )}
                    />
                </Segment>
            </Grid.Column>
        </Grid>
    );
};

export default observer(ActivityForm);
