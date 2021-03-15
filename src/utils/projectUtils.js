import { serverCall } from './server';
import store from '../store/configureStore';
import { setProjectList } from '../store/actions/ProjectListActions';

export const setCurrentProjectList = () => {
    const token = !!store.getState().account.token;
    if (token) {
        serverCall('project/project', {}, 'post')
        .then(result => {
            if (result.success) {
                store.dispatch(setProjectList(result.projects));
            }
        })
    }
}