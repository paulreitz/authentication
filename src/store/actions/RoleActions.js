import roleActions from '../../utils/roleActions';

export const setRoles = (roles) => ({
    type: roleActions.SET_ROLES,
    roles
});

export const clearRoles = () => ({
    type: roleActions.CLEAR_ROLES
});