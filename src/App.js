import React from 'react';
import { Provider } from 'react-redux';

import store from './store/configureStore';

function App() {
  return (
    <Provider store={store}>
      <div>Next: Setup theme.</div>
    </Provider>
  );
}

export default App;
