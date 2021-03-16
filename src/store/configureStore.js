import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import AccountReducer from './reducers/AccountReducer';
import ProjectListReducer from './reducers/ProjectListReducer';
import ProjectReducer from './reducers/ProjectReducer';
import CodeReducer from './reducers/CodeReducer';
import RoleReducer from './reducers/RoleReducer';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
    combineReducers({
        account: AccountReducer,
        projects: ProjectListReducer,
        project: ProjectReducer,
        codes: CodeReducer,
        roles: RoleReducer
    }),
    composeEnhancers(applyMiddleware(thunk))
);

export default store;