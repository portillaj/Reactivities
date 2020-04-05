import { observable, computed, action, configure, runInAction } from 'mobx';
import { history } from '../../';
import { IUser, IUserFormValues } from '../models/user';
import agent from '../api/agent';
import { RootStore } from './rootStore';

configure({enforceActions: 'always'});

export default class UserStore {
    rootStore: RootStore;
	constructor(rootStore: RootStore) {
		this.rootStore = rootStore;
    };

    @observable user: IUser | null = null;

    @computed get isLoggedIn() { return !!this.user };

    @action login = async (values: IUserFormValues) => {
        try {

            const user = await agent.User.login(values);
            runInAction('logging in', () => {
                this.user = user;
            });
            this.rootStore.commonStore.setToken(user.token);
            this.rootStore.modalStore.closeModal();
            history.push('/activities');
        } catch (error) {
            throw error;
        }
    }

    @action logout = () => {
        this.rootStore.commonStore.setToken(null);
        this.user = null;
        history.push('/');
    }

    @action getUser = async () => {
        try {
            const user = await agent.User.current();
            runInAction(() => {
                this.user = user;
            });
        } catch (error) {
            console.log(error);
        }
    }

    @action register = async(values: IUserFormValues) => {
        try {
            const user = await agent.User.register(values);
                this.rootStore.commonStore.setToken(user.token);
                this.rootStore.modalStore.closeModal();
                history.push('/activities');
        } catch (error) {
            throw error;
        }
    }
}
