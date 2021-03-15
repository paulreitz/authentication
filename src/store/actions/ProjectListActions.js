import projectListActions from '../../utils/projectListActions';

export const setProjectList = (list) => ({
    type: projectListActions.SET_PROJECT_LIST,
    list
});

export const clearProjectList = () => ({
    type: projectListActions.CLEAR_PROJECT_LIST
});