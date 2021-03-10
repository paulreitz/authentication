import accountActions from '../../utils/accountActions';

export const setAccount = (accountData) => ({
    type: accountActions.SET_ACCOUNT,
    accountData
});

export const unsetAccount = () => ({
    type: accountActions.UNSET_ACCOUNT
});