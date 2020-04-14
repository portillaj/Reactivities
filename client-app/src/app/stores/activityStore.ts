import { observable, action, computed, configure, runInAction } from 'mobx';
import { SyntheticEvent } from 'react';
import { history } from '../..';
import { IActivity } from '../models/activity';
import agent from '../api/agent';
import { toast } from 'react-toastify';
import { RootStore } from './rootStore';
import { setActivityProps, createAttendee } from '../common/util/util';

configure({ enforceActions: 'always' });

export default class ActivityStore {
	rootStore: RootStore;
	constructor(rootStore: RootStore) {
		this.rootStore = rootStore;
	};

	@observable activityRegistry = new Map();
	@observable activity: IActivity | null = null;
	@observable loadingInitial = false;
	@observable loading = false;
	@observable submitting = false;
	@observable target = '';

	@computed
	get activitiesByDate() {
		return this.groupActivitiesByDate(Array.from(this.activityRegistry.values()));
	}

	groupActivitiesByDate(activities: IActivity[]) {
		const sortedActivities = activities.sort((a, b) => a.date.getTime() - b.date.getTime());
		return Object.entries(
			sortedActivities.reduce(
				(activities, activity) => {
					const date = activity.date.toISOString().split('T')[0];
					activities[date] = activities[date] ? [ ...activities[date], activity ] : [ activity ];
					return activities;
				},
				{} as { [key: string]: IActivity[] }
			)
		);
	}

	@action
	loadActivities = async () => {
		this.loadingInitial = true;
		const user = this.rootStore.userStore.user!;
		try {
			const activities = await agent.Activities.list();
			runInAction('loading activities', () => {
				activities.forEach((activity) => {
					setActivityProps(activity, user);
					this.activityRegistry.set(activity.id, activity);
				});
				this.loadingInitial = false;
			});
		} catch (err) {
			runInAction('load activities error', () => {
				this.loadingInitial = false;
			});
		}
	};

	@action
	clearActivity = () => {
		this.activity = null;
	};

	@action
	createActivity = async (activity: IActivity) => {
		this.submitting = true;
		try {
			await agent.Activities.create(activity);
			const attendee = createAttendee(this.rootStore.userStore.user!);
			attendee.isHost = true;
			let attendees = [];
			attendees.push(attendee);
			activity.attendees = attendees;
			activity.isHost = true;
			runInAction('creating activity', () => {
				this.activityRegistry.set(activity.id, activity);
				this.activity = activity;
				this.submitting = false;
			});
			history.push(`/activities/${activity.id}`);
		} catch (err) {
			runInAction('create activity error', () => {
				this.submitting = false;
			});
			toast.error('Problem submitting data');
			console.log(err);
		}
	};

	@action
	editActivity = async (activity: IActivity) => {
		this.submitting = true;
		try {
			await agent.Activities.update(activity);
			runInAction('editing activity', () => {
				this.activityRegistry.set(activity.id, activity);
				this.activity = activity;
				this.submitting = false;
			});
			history.push(`/activities/${activity.id}`);
		} catch (err) {
			runInAction('edit activity error', () => {
				this.submitting = false;
			});
			console.log(err);
		}
	};

	@action
	deleteActivity = async (event: SyntheticEvent<HTMLButtonElement>, id: string) => {
		this.submitting = true;
		this.target = event.currentTarget.name;
		try {
			await agent.Activities.delete(id);
			runInAction('deleting activity', () => {
				this.activityRegistry.delete(id);
				this.submitting = false;
				this.target = '';
			});
		} catch (err) {
			runInAction('delete activity error', () => {
				this.submitting = false;
			});
			console.log(err);
		}
	};

	@action
	loadActivity = async (id: string) => {
		let activity = this.getActivity(id);
		if (activity) {
			this.activity = activity;
			return activity;
		} else {
			this.loadingInitial = true;
			const user = this.rootStore.userStore.user!;
			try {
				activity = await agent.Activities.details(id);
				runInAction('getting activity', () => {
					setActivityProps(activity, user);
					this.activity = activity;
					this.activityRegistry.set(activity.id, activity);
					this.loadingInitial = false;
				});
				return activity;
			} catch (err) {
				runInAction('get activity error', () => {
					this.loadingInitial = false;
				});
				console.log('err', err);
			}
		}
	};

	getActivity = (id: string) => {
		return this.activityRegistry.get(id);
	};

	@action attendActivity = async () => {
		const attendee = createAttendee(this.rootStore.userStore.user!);
		this.loading = true;
		try {
			await agent.Activities.attend(this.activity!.id);
			runInAction(() => {
				if (this.activity) {
					this.activity.attendees.push(attendee);
					this.activity.isGoing = true;
					this.activityRegistry.set(this.activity.id, this.activity);
				}
				this.loading = false;
			});
		} catch(error) {
			runInAction(() => {
				this.loading = false;
			});
			toast.error('Problem signing up to activity');
		}
	}

	@action cancelAttendance = async () => {
		this.loading = true;
		try {
			await agent.Activities.unattend(this.activity!.id);
			runInAction(() => {
				if (this.activity) {
					this.activity.attendees = this.activity.attendees.filter(x => x.username !== this.rootStore.userStore.user!.username);
					this.activity.isGoing = false;
					this.activityRegistry.set(this.activity.id, this.activity);
				}
				this.loading = false;
			})

		} catch(error) {
			runInAction(() => {
				this.loading = false;
			})
			toast.error('Problem cancelling attendance');
		}
	}
}
