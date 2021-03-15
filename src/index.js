import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import store from './store/configureStore';
import { setAccount } from './store/actions/AccountActions';
import { serverCall } from './utils/server';
import { setCurrentProjectList } from './utils/projectUtils';

const token = window.localStorage.getItem('token');
if (token) {
  serverCall('account/refresh', {token}, 'post')
  .then(result => {
    store.dispatch(setAccount(result));
    window.localStorage.setItem('token', result.token);
    setCurrentProjectList();
  });
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
