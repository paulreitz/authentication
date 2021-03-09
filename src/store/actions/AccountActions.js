import accountActions from '../../utils/accountActions';

export const setAccount = (accountData) => ({
    type: accountActions.SET_ACCOUNT,
    accountData
});

export const unsetAction = () => ({
    type: accountActions.UNSET_ACCOUNT
});