import axios from 'axios';
import store from '../store/configureStore';

const server = process.env && process.env.NODE_ENV === 'development'
    ? 'http://localhost:3008/api'
    : '/api';

const retryTimeMs = 500;
const maxRetries = 5;

export const serverCall = (endpoint, data, method) => {
    return new Promise((resolve, reject) => {
        attemptCall(endpoint, data, method, resolve, reject, 0);
    });
};

const attemptCall = (endpoint, data, method, resolve, reject, attempt) => {
    const token = store.getState().account.token;
    const config = {
        method,
        data,
        url: `${server}/${endpoint}`
    }
    if (!!token) {
        config.headers = {'x-access-token': `Bearer ${token}`};
    }
    axios(config)
    .then((response) => {
        resolve(response.data);
    })
    .catch((error) => {
        if (attempt < maxRetries) {
            setTimeout(() => {
                attempt++;
                attemptCall(endpoint, data, method, resolve, reject, attempt);
            }, attempt * retryTimeMs);
        }
        else {
            reject(error);
        }
    })
}