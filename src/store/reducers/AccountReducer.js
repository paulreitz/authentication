import accountActions from '../../utils/accountActions';

const defaultAccount = {
    id: -1,
    userName: undefined,
    displayName: undefined,
    createdAt: undefined,
    token: undefined
}

export default (state = defaultAccount, action) => {
    switch(action.type) {
        case accountActions.SET_ACCOUNT:
            return action.accountData;
        case accountActions.UNSET_ACCOUNT:
            return defaultAccount;
        default:
            return state;
    }
}