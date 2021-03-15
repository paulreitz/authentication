import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import AccountReducer from './reducers/AccountReducer';
import ProjectListReducer from './reducers/ProjectListReducer';
import ProjectReducer from './reducers/ProjectReducer';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
    combineReducers({
        account: AccountReducer,
        projects: ProjectListReducer,
        project: ProjectReducer
    }),
    composeEnhancers(applyMiddleware(thunk))
);

export default store;