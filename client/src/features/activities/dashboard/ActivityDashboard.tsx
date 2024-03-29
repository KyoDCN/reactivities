import React, { useContext, useEffect } from 'react';
import { Grid } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import ActivityList from './ActivityList';
import { LoadingComponent } from '../../../app/layout/LoadingComponent';
import { RootStoreContext } from '../../../app/stores/rootStore';

const ActivityDashboard: React.FC = () => {
    const { activityStore } = useContext(RootStoreContext);
    const { loadActivities } = activityStore;

    useEffect(() => {
        loadActivities();
    }, [loadActivities]);

    if (activityStore.loadingInitial) return <LoadingComponent content='Loading Activities...' />;

    return (
        <Grid>
            <Grid.Column width='10'>
                <ActivityList />
            </Grid.Column>
            <Grid.Column width='6'>
                <h2>Activity Filters</h2>
            </Grid.Column>
        </Grid>
    );
};

export default observer(ActivityDashboard);
