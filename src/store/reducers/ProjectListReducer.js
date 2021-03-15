import projectListActions from '../../utils/projectListActions';

export default (state = [], action) => {
    switch(action.type) {
        case projectListActions.SET_PROJECT_LIST:
            return action.list;
        case projectListActions.CLEAR_PROJECT_LIST:
            return [];
        default:
            return state;
    }
}