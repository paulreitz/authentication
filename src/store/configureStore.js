import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import AccountReducer from './reducers/AccountReducer';
import ProjectListReducer from './reducers/ProjectListReducer';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
    combineReducers({
        account: AccountReducer,
        projects: ProjectListReducer
    }),
    composeEnhancers(applyMiddleware(thunk))
);

export default store;