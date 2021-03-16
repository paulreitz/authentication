import roleActions from '../../utils/roleActions';

export default (state = [], action) => {
    switch(action.type) {
        case roleActions.SET_ROLES:
            return action.roles;
        case roleActions.CLEAR_ROLES:
            return [];
        default:
            return state;
    }
}