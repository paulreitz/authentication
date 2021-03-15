import codeActions from '../../utils/codeActions';

export const setCodes = (codes) => ({
    type: codeActions.SET_CODES,
    codes
});

export const clearCodes = () => ({
    type: codeActions.CLEAR_CODES
});