import projectActions from '../../utils/projectActions';

const defaultProject = {
    projectKey: undefined,
    accountId: -1,
    name: undefined,
    useCodes: false,
    useRoles: false,
    defaultRole: -1,
    createdAt: undefined
}

export default (state = defaultProject, action) => {
    switch(action.type) {
        case projectActions.SET_PROJECT:
            return action.project;
        case projectActions.CLEAR_PROJECT:
            return defaultProject;
        default:
            return state;
    }
}