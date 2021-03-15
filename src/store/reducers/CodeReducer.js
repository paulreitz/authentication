import codeActions from '../../utils/codeActions';

export default (state = [], action) => {
    switch(action.type) {
        case codeActions.SET_CODES:
            return action.codes;
        case codeActions.CLEAR_CODES:
            return [];
        default:
            return state;
    }
}