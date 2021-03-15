import projectActions from '../../utils/projectActions';

export const setProject = (project) => ({
    type: projectActions.SET_PROJECT,
    project
});

export const clearProject = () => ({
    type: projectActions.CLEAR_PROJECT
})