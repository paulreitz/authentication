import React from 'react';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@material-ui/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import store from './store/configureStore';
import theme from './theme/theme';

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div>Next: Header</div>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
